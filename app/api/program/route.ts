import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client'
import { generateWeeklySchedule, getProgramPhase, calculateExerciseProgression, getRestTimeRecommendation } from '@/lib/utils/program-logic'
import { ApiResponse } from '@/lib/types/database'

// GET /api/program - Get program information and schedules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const week = parseInt(searchParams.get('week') || '1')
    const userId = searchParams.get('user_id')

    if (week < 1 || week > 11) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Week must be between 1 and 11'
      }, { status: 400 })
    }

    // Get program phase information
    const phase = getProgramPhase(week)
    
    // Generate weekly schedule
    const schedule = generateWeeklySchedule(week)

    // Get user's recent performance data for progression calculations
    let progressionData = null
    if (userId) {
      const supabase = createSupabaseServerClient()
      
      // Get recent sessions and set logs for progression calculations
      const { data: recentSessions } = await supabase
        .from('sessions')
        .select(`
          id,
          session_exercises (
            id,
            exercise_id,
            weight,
            set_logs (weight_used, rpe)
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('date', { ascending: false })
        .limit(5)

      if (recentSessions && recentSessions.length > 0) {
        progressionData = {
          recent_sessions: recentSessions.length,
          average_rpe: calculateAverageRPE(recentSessions),
          weight_progression: calculateWeightProgression(recentSessions)
        }
      }
    }

    const programData = {
      week,
      phase,
      schedule,
      progression_data: progressionData,
      total_weeks: 11,
      current_phase: phase.phase,
      intensity: phase.intensity,
      volume: phase.volume,
      focus: phase.focus,
      notes: phase.notes
    }

    return NextResponse.json<ApiResponse<typeof programData>>({
      success: true,
      data: programData
    })

  } catch (error) {
    console.error('Error getting program data:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to get program data'
    }, { status: 500 })
  }
}

// POST /api/program - Generate personalized program modifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, week, wellness_data, preferences } = body

    if (!user_id || !week) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'user_id and week are required'
      }, { status: 400 })
    }

    if (week < 1 || week > 11) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Week must be between 1 and 11'
      }, { status: 400 })
    }

    // Get base program
    const baseSchedule = generateWeeklySchedule(week)
    const phase = getProgramPhase(week)

    // Apply wellness-based modifications
    let modifiedSchedule = baseSchedule
    if (wellness_data) {
      modifiedSchedule = baseSchedule.map(session => 
        modifySessionForWellness(session, wellness_data)
      )
    }

    // Apply user preferences
    if (preferences) {
      modifiedSchedule = applyUserPreferences(modifiedSchedule, preferences)
    }

    // Get exercise progressions for the week
    const exerciseProgressions = await getExerciseProgressions(user_id, week)

    const personalizedProgram = {
      week,
      phase,
      schedule: modifiedSchedule,
      exercise_progressions: exerciseProgressions,
      modifications_applied: {
        wellness_based: !!wellness_data,
        preference_based: !!preferences
      }
    }

    return NextResponse.json<ApiResponse<typeof personalizedProgram>>({
      success: true,
      data: personalizedProgram
    })

  } catch (error) {
    console.error('Error generating personalized program:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to generate personalized program'
    }, { status: 500 })
  }
}

/**
 * Calculate average RPE from recent sessions
 */
function calculateAverageRPE(sessions: any[]): number {
  let totalRPE = 0
  let totalSets = 0

  sessions.forEach(session => {
    session.session_exercises?.forEach((exercise: any) => {
      exercise.set_logs?.forEach((log: any) => {
        totalRPE += log.rpe
        totalSets++
      })
    })
  })

  return totalSets > 0 ? totalRPE / totalSets : 0
}

/**
 * Calculate weight progression from recent sessions
 */
function calculateWeightProgression(sessions: any[]): Record<string, number> {
  const progressions: Record<string, number> = {}

  sessions.forEach(session => {
    session.session_exercises?.forEach((exercise: any) => {
      const logs = exercise.set_logs || []
      if (logs.length >= 2) {
        const firstWeight = logs[0].weight_used || 0
        const lastWeight = logs[logs.length - 1].weight_used || 0
        if (firstWeight > 0) {
          const progression = ((lastWeight - firstWeight) / firstWeight) * 100
          progressions[exercise.exercise_id] = progression
        }
      }
    })
  })

  return progressions
}

/**
 * Modify session based on wellness data
 */
function modifySessionForWellness(session: any, wellnessData: any) {
  const modifications = { ...session }

  // Adjust duration based on energy and sleep
  if (wellnessData.energy_level < 4 || wellnessData.sleep_hours < 6) {
    modifications.duration_minutes = Math.round(modifications.duration_minutes * 0.8)
  }

  // Adjust intensity based on muscle soreness
  if (wellnessData.muscle_soreness > 3) {
    modifications.intensity_modifier *= 0.7
  }

  // Adjust based on mood
  if (wellnessData.mood < 3) {
    modifications.intensity_modifier *= 0.8
    // Add more encouraging exercises
    modifications.exercises = [...modifications.exercises, 'fun_movement', 'dance_break']
  }

  return modifications
}

/**
 * Apply user preferences to schedule
 */
function applyUserPreferences(schedule: any[], preferences: any) {
  return schedule.map(session => {
    const modified = { ...session }

    // Adjust duration based on preference
    if (preferences.workout_duration) {
      modified.duration_minutes = Math.min(
        modified.duration_minutes,
        preferences.workout_duration
      )
    }

    // Filter exercises based on available equipment
    if (preferences.equipment_available) {
      modified.exercises = modified.exercises.filter((exercise: string) => 
        preferences.equipment_available.includes(exercise) || 
        exercise === 'none'
      )
    }

    // Adjust timing based on preferences
    if (preferences.preferred_times) {
      // This would be used for scheduling, not modification
      modified.preferred_time = preferences.preferred_times[0]
    }

    return modified
  })
}

/**
 * Get exercise progressions for a specific week
 */
async function getExerciseProgressions(userId: string, week: number) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Get recent performance data
    const { data: recentSessions } = await supabase
      .from('sessions')
      .select(`
        id,
        session_exercises (
          id,
          exercise_id,
          weight,
          set_logs (weight_used, rpe)
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('date', { ascending: false })
      .limit(3)

    if (!recentSessions || recentSessions.length === 0) {
      return {}
    }

    const progressions: Record<string, any> = {}

    // Calculate progression for each exercise
    recentSessions.forEach(session => {
      session.session_exercises?.forEach((exercise: any) => {
        const logs = exercise.set_logs || []
        if (logs.length > 0) {
          const lastLog = logs[logs.length - 1]
          const currentWeight = lastLog.weight_used || 0
          const lastRPE = lastLog.rpe || 5

          // Calculate progression based on RPE and program phase
          const progression = calculateExerciseProgression(
            currentWeight,
            lastRPE,
            week,
            {
              exercise_id: exercise.exercise_id,
              base_weight: currentWeight,
              progression_rate: 5, // 5% increase per 2 weeks
              max_increase: 20, // Maximum 20% increase
              rpe_threshold: 7 // Don't progress if RPE > 7
            }
          )

          progressions[exercise.exercise_id] = {
            current_weight: currentWeight,
            recommended_weight: progression,
            increase: progression - currentWeight,
            increase_percentage: currentWeight > 0 ? ((progression - currentWeight) / currentWeight) * 100 : 0,
            last_rpe: lastRPE,
            should_progress: lastRPE <= 7
          }
        }
      })
    })

    return progressions

  } catch (error) {
    console.error('Error getting exercise progressions:', error)
    return {}
  }
}
