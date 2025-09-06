import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/client';
import {
  analyzeWellnessAndAdapt,
  generateMotivationalMessage,
  generateFormCues,
} from '@/lib/utils/ai/adaptation';
import { ApiResponse } from '@/lib/types/database';

// POST /api/ai/adaptation - Get AI-powered adaptation recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, wellness_data, recent_performance } = body;

    if (!user_id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'user_id is required',
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Get recent data if not provided
    let wellnessData = wellness_data;
    let recentSessions = recent_performance?.sessions || [];
    let recentSetLogs = recent_performance?.set_logs || [];

    if (!wellnessData) {
      // Get recent check-ins
      const { data: checkIns } = await supabase
        .from('daily_check_ins')
        .select('*')
        .eq('user_id', user_id)
        .order('date', { ascending: false })
        .limit(7);

      if (checkIns && checkIns.length > 0) {
        const latestCheckIn = checkIns[0];
        wellnessData = {
          mood: latestCheckIn.mood,
          energy_level: latestCheckIn.energy_level,
          sleep_hours: latestCheckIn.sleep_hours,
          muscle_soreness: latestCheckIn.muscle_soreness,
          recent_rpe_trend: checkIns.map(ci => ci.energy_level),
          recent_workout_frequency: checkIns.length,
        };
      }
    }

    if (recentSessions.length === 0) {
      // Get recent sessions
      const { data: sessions } = await supabase
        .from('sessions')
        .select(
          `
          id,
          date,
          status,
          average_rpe,
          session_exercises (
            id,
            set_logs (rpe, weight_used)
          )
        `
        )
        .eq('user_id', user_id)
        .eq('status', 'completed')
        .order('date', { ascending: false })
        .limit(5);

      recentSessions = sessions || [];
    }

    if (recentSetLogs.length === 0) {
      // Get recent set logs
      const { data: setLogs } = await supabase
        .from('set_logs')
        .select('*')
        .in(
          'session_exercise_id',
          recentSessions.flatMap(
            s => s.session_exercises?.map(se => se.id) || []
          )
        )
        .order('created_at', { ascending: false })
        .limit(20);

      recentSetLogs = setLogs || [];
    }

    // Analyze and get recommendations
    const recommendations = await analyzeWellnessAndAdapt(
      wellnessData,
      recentSessions,
      recentSetLogs
    );

    // Generate motivational message
    const motivationalMessage = await generateMotivationalMessage({
      streak_days: await getStreakDays(user_id, supabase),
      recent_improvements: await getRecentImprovements(user_id, supabase),
      upcoming_goals: await getUpcomingGoals(user_id, supabase),
      current_challenges: await getCurrentChallenges(
        wellnessData,
        recentSessions
      ),
    });

    const adaptationData = {
      recommendations,
      motivational_message: motivationalMessage,
      wellness_data: wellnessData,
      analysis_timestamp: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<typeof adaptationData>>({
      success: true,
      data: adaptationData,
    });
  } catch (error) {
    console.error('Error getting AI adaptation:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to get AI adaptation recommendations',
      },
      { status: 500 }
    );
  }
}

// POST /api/ai/adaptation/form-cues - Get form cues for specific exercise
export async function POST_FORM_CUES(request: NextRequest) {
  try {
    const body = await request.json();
    const { exercise_name, common_mistakes = [] } = body;

    if (!exercise_name) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'exercise_name is required',
        },
        { status: 400 }
      );
    }

    const formCues = await generateFormCues(exercise_name, common_mistakes);

    return NextResponse.json<ApiResponse<typeof formCues>>({
      success: true,
      data: formCues,
    });
  } catch (error) {
    console.error('Error generating form cues:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to generate form cues',
      },
      { status: 500 }
    );
  }
}

// POST /api/ai/adaptation/motivational - Get personalized motivational message
export async function POST_MOTIVATIONAL(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, performance_data } = body;

    if (!user_id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'user_id is required',
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Get performance data if not provided
    let performanceData = performance_data;
    if (!performanceData) {
      performanceData = {
        streak_days: await getStreakDays(user_id, supabase),
        recent_improvements: await getRecentImprovements(user_id, supabase),
        upcoming_goals: await getUpcomingGoals(user_id, supabase),
        current_challenges: await getCurrentChallenges(null, []),
      };
    }

    const motivationalMessage =
      await generateMotivationalMessage(performanceData);

    return NextResponse.json<ApiResponse<{ message: string }>>({
      success: true,
      data: { message: motivationalMessage },
    });
  } catch (error) {
    console.error('Error generating motivational message:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to generate motivational message',
      },
      { status: 500 }
    );
  }
}

/**
 * Get user's current streak days
 */
async function getStreakDays(userId: string, supabase: any): Promise<number> {
  try {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('date')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('date', { ascending: false });

    if (!sessions || sessions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (sessionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak days:', error);
    return 0;
  }
}

/**
 * Get recent improvements
 */
async function getRecentImprovements(
  userId: string,
  supabase: any
): Promise<string[]> {
  try {
    const { data: progressMetrics } = await supabase
      .from('progress_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5);

    if (!progressMetrics || progressMetrics.length < 2) return [];

    const improvements: string[] = [];
    const latest = progressMetrics[0];
    const previous = progressMetrics[1];

    if (latest.value > previous.value) {
      improvements.push(
        `Improved ${latest.metric_type} by ${(((latest.value - previous.value) / previous.value) * 100).toFixed(1)}%`
      );
    }

    return improvements;
  } catch (error) {
    console.error('Error getting recent improvements:', error);
    return [];
  }
}

/**
 * Get upcoming goals
 */
async function getUpcomingGoals(
  userId: string,
  supabase: any
): Promise<string[]> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('profile_data')
      .eq('id', userId)
      .single();

    if (!user?.profile_data?.goals) return [];

    return user.profile_data.goals;
  } catch (error) {
    console.error('Error getting upcoming goals:', error);
    return [];
  }
}

/**
 * Get current challenges
 */
async function getCurrentChallenges(
  wellnessData: any,
  recentSessions: any[]
): Promise<string[]> {
  const challenges: string[] = [];

  if (wellnessData) {
    if (wellnessData.energy_level < 4) {
      challenges.push('Low energy levels');
    }
    if (wellnessData.sleep_hours < 6) {
      challenges.push('Insufficient sleep');
    }
    if (wellnessData.muscle_soreness > 3) {
      challenges.push('High muscle soreness');
    }
    if (wellnessData.mood < 3) {
      challenges.push('Low mood');
    }
  }

  if (recentSessions.length > 0) {
    const avgRPE =
      recentSessions.reduce(
        (sum, session) => sum + (session.average_rpe || 0),
        0
      ) / recentSessions.length;

    if (avgRPE > 7) {
      challenges.push('High workout intensity');
    }
  }

  return challenges;
}
