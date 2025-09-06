// 11-week periodization program logic for teen training PWA

export interface ProgramPhase {
  week: number;
  phase: 'foundation' | 'strength' | 'power' | 'peak' | 'deload';
  intensity: number; // 1-10 scale
  volume: number; // 1-10 scale
  focus: string;
  notes: string;
}

export interface WeeklySchedule {
  week: number;
  day: number;
  session_type: 'am' | 'pm';
  focus: string;
  exercises: string[];
  duration_minutes: number;
  intensity_modifier: number;
}

export interface ExerciseProgression {
  exercise_id: string;
  base_weight: number;
  progression_rate: number; // percentage increase per 2 weeks
  max_increase: number; // maximum percentage increase
  rpe_threshold: number; // if RPE > this, don't progress
}

/**
 * Get the program phase for a specific week
 */
export function getProgramPhase(week: number): ProgramPhase {
  if (week >= 1 && week <= 2) {
    return {
      week,
      phase: 'foundation',
      intensity: 4,
      volume: 6,
      focus: 'Movement patterns and technique',
      notes: 'Focus on learning proper form and building movement competency',
    };
  } else if (week >= 3 && week <= 4) {
    return {
      week,
      phase: 'strength',
      intensity: 6,
      volume: 7,
      focus: 'Building strength base',
      notes: 'Increase load while maintaining good form',
    };
  } else if (week === 5) {
    return {
      week,
      phase: 'deload',
      intensity: 3,
      volume: 4,
      focus: 'Recovery and technique refinement',
      notes: 'Reduced intensity to allow for recovery and prevent overtraining',
    };
  } else if (week >= 6 && week <= 7) {
    return {
      week,
      phase: 'strength',
      intensity: 7,
      volume: 8,
      focus: 'Progressive strength development',
      notes: 'Continue building strength with increased intensity',
    };
  } else if (week === 8) {
    return {
      week,
      phase: 'deload',
      intensity: 3,
      volume: 4,
      focus: 'Recovery and preparation for power phase',
      notes: 'Second deload week to prepare for power development',
    };
  } else if (week >= 9 && week <= 10) {
    return {
      week,
      phase: 'power',
      intensity: 8,
      volume: 6,
      focus: 'Power development and sport-specific training',
      notes: 'High intensity, lower volume power training',
    };
  } else if (week === 11) {
    return {
      week,
      phase: 'peak',
      intensity: 9,
      volume: 5,
      focus: 'Peak performance and testing',
      notes: 'Highest intensity week with performance testing',
    };
  } else {
    throw new Error(`Invalid week number: ${week}. Program is 11 weeks long.`);
  }
}

/**
 * Generate weekly schedule matrix (6 days per week, AM/PM sessions)
 */
export function generateWeeklySchedule(week: number): WeeklySchedule[] {
  const phase = getProgramPhase(week);
  const schedules: WeeklySchedule[] = [];

  // Monday AM - Lower body emphasis
  schedules.push({
    week,
    day: 1,
    session_type: 'am',
    focus: 'Lower body strength',
    exercises: ['squat', 'deadlift', 'lunges', 'calf_raises'],
    duration_minutes: phase.phase === 'deload' ? 30 : 45,
    intensity_modifier: phase.intensity / 10,
  });

  // Tuesday AM - Upper body emphasis
  schedules.push({
    week,
    day: 2,
    session_type: 'am',
    focus: 'Upper body strength',
    exercises: ['push_ups', 'pull_ups', 'shoulder_press', 'rows'],
    duration_minutes: phase.phase === 'deload' ? 30 : 45,
    intensity_modifier: phase.intensity / 10,
  });

  // Wednesday AM - Full body strength endurance
  schedules.push({
    week,
    day: 3,
    session_type: 'am',
    focus: 'Full body endurance',
    exercises: [
      'burpees',
      'mountain_climbers',
      'jumping_jacks',
      'plank_variations',
    ],
    duration_minutes: phase.phase === 'deload' ? 25 : 40,
    intensity_modifier: phase.intensity / 10,
  });

  // Thursday AM - Lower body emphasis (variation)
  schedules.push({
    week,
    day: 4,
    session_type: 'am',
    focus: 'Lower body power',
    exercises: [
      'jump_squats',
      'box_jumps',
      'lateral_bounds',
      'single_leg_work',
    ],
    duration_minutes: phase.phase === 'deload' ? 30 : 45,
    intensity_modifier: phase.intensity / 10,
  });

  // Friday AM - Upper body emphasis (variation)
  schedules.push({
    week,
    day: 5,
    session_type: 'am',
    focus: 'Upper body power',
    exercises: [
      'explosive_push_ups',
      'medicine_ball_throws',
      'battle_ropes',
      'core_work',
    ],
    duration_minutes: phase.phase === 'deload' ? 30 : 45,
    intensity_modifier: phase.intensity / 10,
  });

  // Saturday AM - Skills & conditioning
  schedules.push({
    week,
    day: 6,
    session_type: 'am',
    focus: 'Sport-specific skills',
    exercises: [
      'agility_drills',
      'sprint_work',
      'sport_specific_movements',
      'mobility',
    ],
    duration_minutes: phase.phase === 'deload' ? 25 : 40,
    intensity_modifier: phase.intensity / 10,
  });

  // PM sessions for power phase (weeks 9-11)
  if (week >= 9) {
    schedules.push({
      week,
      day: 1,
      session_type: 'pm',
      focus: 'Plyometric training',
      exercises: [
        'depth_jumps',
        'reactive_jumps',
        'lateral_plyos',
        'landing_mechanics',
      ],
      duration_minutes: 30,
      intensity_modifier: 0.8,
    });

    schedules.push({
      week,
      day: 3,
      session_type: 'pm',
      focus: 'Speed and agility',
      exercises: [
        'sprint_intervals',
        'change_of_direction',
        'reaction_drills',
        'coordination',
      ],
      duration_minutes: 30,
      intensity_modifier: 0.8,
    });

    schedules.push({
      week,
      day: 5,
      session_type: 'pm',
      focus: 'Recovery and mobility',
      exercises: [
        'foam_rolling',
        'dynamic_stretching',
        'yoga_flows',
        'breathing_exercises',
      ],
      duration_minutes: 25,
      intensity_modifier: 0.3,
    });
  }

  return schedules;
}

/**
 * Calculate exercise progression based on RPE and program phase
 */
export function calculateExerciseProgression(
  currentWeight: number,
  rpe: number,
  week: number,
  baseProgression: ExerciseProgression
): number {
  const phase = getProgramPhase(week);

  // Don't progress if RPE is too high
  if (rpe > baseProgression.rpe_threshold) {
    return currentWeight;
  }

  // Don't progress during deload weeks
  if (phase.phase === 'deload') {
    return currentWeight * 0.8; // Reduce weight by 20%
  }

  // Calculate progression based on phase
  let progressionRate = baseProgression.progression_rate;

  if (phase.phase === 'foundation') {
    progressionRate *= 0.5; // Slower progression in foundation phase
  } else if (phase.phase === 'power' || phase.phase === 'peak') {
    progressionRate *= 1.5; // Faster progression in power/peak phases
  }

  // Apply intensity modifier
  progressionRate *= phase.intensity / 10;

  // Calculate new weight
  const increase = currentWeight * (progressionRate / 100);
  const newWeight = currentWeight + increase;

  // Apply maximum increase limit
  const maxIncrease = currentWeight * (baseProgression.max_increase / 100);
  const finalWeight = Math.min(newWeight, currentWeight + maxIncrease);

  return Math.round(finalWeight * 100) / 100; // Round to 2 decimal places
}

/**
 * Generate rest time recommendations based on exercise type and intensity
 */
export function getRestTimeRecommendation(
  exerciseType: string,
  intensity: number,
  phase: ProgramPhase
): number {
  const baseRestTimes: Record<string, number> = {
    squat: 120,
    deadlift: 180,
    push_ups: 60,
    pull_ups: 90,
    jump_squats: 90,
    box_jumps: 120,
    sprint: 180,
    plank: 30,
    mobility: 0,
  };

  let restTime = baseRestTimes[exerciseType] || 60;

  // Adjust based on intensity
  restTime *= intensity / 10;

  // Adjust based on phase
  if (phase.phase === 'deload') {
    restTime *= 1.5; // More rest during deload
  } else if (phase.phase === 'power' || phase.phase === 'peak') {
    restTime *= 1.2; // Slightly more rest for high intensity
  }

  return Math.round(restTime);
}

/**
 * Check if user should take a micro-deload based on recent performance
 */
export function shouldTakeMicroDeload(
  recentRPEs: number[],
  recentSessions: number,
  currentWeek: number
): boolean {
  // Don't suggest micro-deload during planned deload weeks
  if (currentWeek === 5 || currentWeek === 8) {
    return false;
  }

  // Check for high RPE trend
  if (recentRPEs.length >= 3) {
    const avgRPE =
      recentRPEs.reduce((sum, rpe) => sum + rpe, 0) / recentRPEs.length;
    if (avgRPE > 8) {
      return true;
    }
  }

  // Check for high session frequency without recovery
  if (recentSessions >= 5 && recentRPEs.some(rpe => rpe > 7)) {
    return true;
  }

  return false;
}

/**
 * Generate session modifications based on wellness data
 */
export function modifySessionForWellness(
  baseSession: WeeklySchedule,
  wellnessData: {
    mood: number;
    energy_level: number;
    sleep_hours: number;
    muscle_soreness: number;
  }
): WeeklySchedule {
  const modifications = { ...baseSession };

  // Adjust duration based on energy and sleep
  if (wellnessData.energy_level < 4 || wellnessData.sleep_hours < 6) {
    modifications.duration_minutes = Math.round(
      modifications.duration_minutes * 0.8
    );
  }

  // Adjust intensity based on muscle soreness
  if (wellnessData.muscle_soreness > 3) {
    modifications.intensity_modifier *= 0.7;
  }

  // Adjust based on mood
  if (wellnessData.mood < 3) {
    modifications.intensity_modifier *= 0.8;
    // Add more encouraging exercises
    modifications.exercises = [
      ...modifications.exercises,
      'fun_movement',
      'dance_break',
    ];
  }

  return modifications;
}
