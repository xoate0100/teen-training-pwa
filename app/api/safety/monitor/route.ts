import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/client';
import {
  analyzeSafetyMetrics,
  generateSafetyAlerts,
  shouldModifySession,
} from '@/lib/utils/safety-monitoring';
import { ApiResponse } from '@/lib/types/database';

// POST /api/safety/monitor - Analyze safety metrics and generate alerts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, analysis_type = 'comprehensive' } = body;

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

    // Get recent data for analysis
    const { data: recentCheckIns } = await supabase
      .from('daily_check_ins')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: false })
      .limit(7);

    const { data: recentSessions } = await supabase
      .from('sessions')
      .select(
        `
        id,
        date,
        status,
        average_rpe,
        session_exercises (
          id,
          set_logs (weight_used, rpe, reps_completed)
        )
      `
      )
      .eq('user_id', user_id)
      .order('date', { ascending: false })
      .limit(5);

    const { data: recentSetLogs } = await supabase
      .from('set_logs')
      .select('*')
      .in(
        'session_exercise_id',
        recentSessions?.flatMap(
          s => s.session_exercises?.map(se => se.id) || []
        ) || []
      )
      .order('created_at', { ascending: false })
      .limit(20);

    // Get user age for age-specific recommendations
    const { data: user } = await supabase
      .from('users')
      .select('age')
      .eq('id', user_id)
      .single();

    // Analyze safety metrics
    const safetyMetrics = analyzeSafetyMetrics(
      recentCheckIns || [],
      recentSessions || [],
      recentSetLogs || [],
      user?.age || 16
    );

    // Generate safety alerts
    const safetyAlerts = generateSafetyAlerts(safetyMetrics, user_id);

    // Check if session should be modified
    const sessionModification = shouldModifySession(safetyMetrics);

    // Save alerts to database
    if (safetyAlerts.length > 0) {
      const { error: alertError } = await supabase
        .from('safety_alerts')
        .insert(safetyAlerts);

      if (alertError) {
        console.error('Error saving safety alerts:', alertError);
      }
    }

    const safetyAnalysis = {
      metrics: safetyMetrics,
      alerts: safetyAlerts,
      session_modification: sessionModification,
      analysis_timestamp: new Date().toISOString(),
      user_age: user?.age || 16,
    };

    return NextResponse.json<ApiResponse<typeof safetyAnalysis>>({
      success: true,
      data: safetyAnalysis,
    });
  } catch (error) {
    console.error('Error in safety monitoring:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to analyze safety metrics',
      },
      { status: 500 }
    );
  }
}

// GET /api/safety/monitor - Get current safety status and alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const includeResolved = searchParams.get('include_resolved') === 'true';

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'user_id is required',
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Get active safety alerts
    let query = supabase
      .from('safety_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!includeResolved) {
      query = query.eq('is_resolved', false);
    }

    const { data: alerts, error: alertsError } = await query;

    if (alertsError) {
      console.error('Error fetching safety alerts:', alertsError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to fetch safety alerts',
        },
        { status: 500 }
      );
    }

    // Get recent safety metrics summary
    const { data: recentCheckIns } = await supabase
      .from('daily_check_ins')
      .select('energy_level, muscle_soreness, sleep_hours')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(3);

    const { data: recentSessions } = await supabase
      .from('sessions')
      .select('average_rpe, status')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(3);

    // Calculate summary metrics
    const summaryMetrics = {
      recent_energy: recentCheckIns?.length
        ? recentCheckIns.reduce((sum, ci) => sum + ci.energy_level, 0) /
          recentCheckIns.length
        : 0,
      recent_soreness: recentCheckIns?.length
        ? recentCheckIns.reduce((sum, ci) => sum + ci.muscle_soreness, 0) /
          recentCheckIns.length
        : 0,
      recent_sleep: recentCheckIns?.length
        ? recentCheckIns.reduce((sum, ci) => sum + ci.sleep_hours, 0) /
          recentCheckIns.length
        : 0,
      recent_rpe: recentSessions?.length
        ? recentSessions.reduce((sum, s) => sum + (s.average_rpe || 0), 0) /
          recentSessions.length
        : 0,
      active_alerts: alerts?.filter(a => !a.is_resolved).length || 0,
      total_alerts: alerts?.length || 0,
    };

    const safetyStatus = {
      alerts: alerts || [],
      summary_metrics: summaryMetrics,
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<typeof safetyStatus>>({
      success: true,
      data: safetyStatus,
    });
  } catch (error) {
    console.error('Error getting safety status:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to get safety status',
      },
      { status: 500 }
    );
  }
}

// PUT /api/safety/monitor - Resolve safety alerts
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { alert_ids, user_id } = body;

    if (!alert_ids || !Array.isArray(alert_ids) || alert_ids.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'alert_ids array is required',
        },
        { status: 400 }
      );
    }

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

    // Resolve alerts
    const { error } = await supabase
      .from('safety_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
      })
      .in('id', alert_ids)
      .eq('user_id', user_id);

    if (error) {
      console.error('Error resolving safety alerts:', error);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Failed to resolve safety alerts',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ resolved_count: number }>>({
      success: true,
      data: { resolved_count: alert_ids.length },
      message: 'Safety alerts resolved successfully',
    });
  } catch (error) {
    console.error('Error resolving safety alerts:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to resolve safety alerts',
      },
      { status: 500 }
    );
  }
}
