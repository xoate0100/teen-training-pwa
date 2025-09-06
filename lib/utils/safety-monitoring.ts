// Safety monitoring and alert system for teen training PWA

import {
  DailyCheckIn,
  SetLog,
  Session,
  SafetyAlert,
} from '@/lib/types/database';

export interface SafetyMetrics {
  fatigue_level: number; // 1-10 scale
  form_quality: number; // 1-10 scale
  load_progression: number; // percentage increase from baseline
  injury_risk: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface SafetyThresholds {
  max_daily_rpe: number;
  max_weekly_sessions: number;
  max_weight_increase_per_week: number; // percentage
  min_rest_days_per_week: number;
  max_consecutive_high_intensity: number;
}

const DEFAULT_SAFETY_THRESHOLDS: SafetyThresholds = {
  max_daily_rpe: 9,
  max_weekly_sessions: 6,
  max_weight_increase_per_week: 10, // 10% max increase per week
  min_rest_days_per_week: 1,
  max_consecutive_high_intensity: 3,
};

/**
 * Analyze safety metrics based on recent data
 */
export function analyzeSafetyMetrics(
  recentCheckIns: DailyCheckIn[],
  recentSessions: Session[],
  recentSetLogs: SetLog[],
  userAge: number = 16
): SafetyMetrics {
  const recommendations: string[] = [];
  let fatigue_level = 5; // Default moderate fatigue
  let form_quality = 7; // Default good form
  let load_progression = 0;
  let injury_risk: 'low' | 'medium' | 'high' | 'critical' = 'low';

  // Analyze fatigue level
  if (recentCheckIns.length > 0) {
    const avgEnergy =
      recentCheckIns.reduce((sum, check) => sum + check.energy_level, 0) /
      recentCheckIns.length;
    const avgSoreness =
      recentCheckIns.reduce((sum, check) => sum + check.muscle_soreness, 0) /
      recentCheckIns.length;
    const avgSleep =
      recentCheckIns.reduce((sum, check) => sum + check.sleep_hours, 0) /
      recentCheckIns.length;

    // Calculate fatigue score (higher = more fatigue)
    fatigue_level = Math.round(
      (10 - avgEnergy) * 0.4 + // Energy (inverted)
        avgSoreness * 0.3 + // Soreness
        Math.max(0, 8 - avgSleep) * 0.3 // Sleep deficit
    );

    if (fatigue_level > 7) {
      recommendations.push('Consider taking a rest day or reducing intensity');
      injury_risk = 'high';
    } else if (fatigue_level > 5) {
      recommendations.push('Monitor fatigue levels closely');
      injury_risk = 'medium';
    }
  }

  // Analyze form quality based on RPE vs weight progression
  if (recentSetLogs.length > 0) {
    const avgRPE =
      recentSetLogs.reduce((sum, log) => sum + log.rpe, 0) /
      recentSetLogs.length;
    const highRPEPercentage =
      recentSetLogs.filter(log => log.rpe > 8).length / recentSetLogs.length;

    // Form quality decreases with high RPE and rapid progression
    form_quality = Math.max(1, 10 - (avgRPE - 5) * 2 - highRPEPercentage * 5);

    if (form_quality < 4) {
      recommendations.push('Focus on technique over intensity');
      injury_risk = 'high';
    } else if (form_quality < 6) {
      recommendations.push('Consider reducing weight to maintain form');
      injury_risk = 'medium';
    }
  }

  // Analyze load progression
  if (recentSessions.length >= 2) {
    const recentSessionsWithWeights = recentSessions
      .filter(session => session.status === 'completed')
      .slice(-4); // Last 4 sessions

    if (recentSessionsWithWeights.length >= 2) {
      // Calculate average weight progression
      const weightProgression = calculateWeightProgression(recentSetLogs);
      load_progression = weightProgression;

      if (
        load_progression >
        DEFAULT_SAFETY_THRESHOLDS.max_weight_increase_per_week
      ) {
        recommendations.push('Weight progression too rapid - reduce increases');
        injury_risk = 'high';
      }
    }
  }

  // Check for overtraining patterns
  const overtrainingScore = checkOvertrainingPatterns(
    recentSessions,
    recentCheckIns
  );
  if (overtrainingScore > 0.7) {
    recommendations.push(
      'Signs of overtraining detected - take additional rest'
    );
    injury_risk = 'critical';
  }

  // Age-specific recommendations
  if (userAge < 16) {
    recommendations.push('Focus on movement quality and technique');
    if (load_progression > 5) {
      recommendations.push('Reduce weight progression for younger athletes');
    }
  }

  return {
    fatigue_level,
    form_quality,
    load_progression,
    injury_risk,
    recommendations,
  };
}

/**
 * Calculate weight progression percentage
 */
function calculateWeightProgression(setLogs: SetLog[]): number {
  if (setLogs.length < 4) return 0;

  // Group by exercise and calculate progression
  const exerciseWeights: Record<string, number[]> = {};

  setLogs.forEach(log => {
    // This would need to be enhanced to track exercise IDs properly
    const exerciseKey = 'exercise'; // Simplified for now
    if (!exerciseWeights[exerciseKey]) {
      exerciseWeights[exerciseKey] = [];
    }
    if (log.weight_used) {
      exerciseWeights[exerciseKey].push(log.weight_used);
    }
  });

  let totalProgression = 0;
  let exerciseCount = 0;

  Object.values(exerciseWeights).forEach(weights => {
    if (weights.length >= 2) {
      const firstWeight = weights[0];
      const lastWeight = weights[weights.length - 1];
      const progression = ((lastWeight - firstWeight) / firstWeight) * 100;
      totalProgression += progression;
      exerciseCount++;
    }
  });

  return exerciseCount > 0 ? totalProgression / exerciseCount : 0;
}

/**
 * Check for overtraining patterns
 */
function checkOvertrainingPatterns(
  sessions: Session[],
  checkIns: DailyCheckIn[]
): number {
  let overtrainingScore = 0;

  // Check session frequency
  const recentSessions = sessions.filter(
    s => new Date(s.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  if (recentSessions.length > DEFAULT_SAFETY_THRESHOLDS.max_weekly_sessions) {
    overtrainingScore += 0.3;
  }

  // Check for consecutive high-intensity sessions
  let consecutiveHighIntensity = 0;
  let maxConsecutive = 0;

  recentSessions.forEach(session => {
    if (session.average_rpe && session.average_rpe > 7) {
      consecutiveHighIntensity++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveHighIntensity);
    } else {
      consecutiveHighIntensity = 0;
    }
  });

  if (
    maxConsecutive > DEFAULT_SAFETY_THRESHOLDS.max_consecutive_high_intensity
  ) {
    overtrainingScore += 0.4;
  }

  // Check wellness trends
  if (checkIns.length >= 3) {
    const recentCheckIns = checkIns.slice(-3);
    const decliningEnergy = recentCheckIns.every(
      (check, index) =>
        index === 0 ||
        check.energy_level < recentCheckIns[index - 1].energy_level
    );

    const increasingSoreness = recentCheckIns.every(
      (check, index) =>
        index === 0 ||
        check.muscle_soreness >= recentCheckIns[index - 1].muscle_soreness
    );

    if (decliningEnergy) overtrainingScore += 0.2;
    if (increasingSoreness) overtrainingScore += 0.1;
  }

  return Math.min(overtrainingScore, 1.0);
}

/**
 * Generate safety alerts based on metrics
 */
export function generateSafetyAlerts(
  metrics: SafetyMetrics,
  userId: string
): Omit<SafetyAlert, 'id' | 'created_at'>[] {
  const alerts: Omit<SafetyAlert, 'id' | 'created_at'>[] = [];

  // Fatigue alerts
  if (metrics.fatigue_level > 8) {
    alerts.push({
      user_id: userId,
      alert_type: 'fatigue',
      severity: 'critical',
      message: 'High fatigue levels detected. Consider taking a rest day.',
      is_resolved: false,
    });
  } else if (metrics.fatigue_level > 6) {
    alerts.push({
      user_id: userId,
      alert_type: 'fatigue',
      severity: 'high',
      message:
        'Elevated fatigue levels. Monitor closely and reduce intensity if needed.',
      is_resolved: false,
    });
  }

  // Form quality alerts
  if (metrics.form_quality < 3) {
    alerts.push({
      user_id: userId,
      alert_type: 'form',
      severity: 'critical',
      message:
        'Poor form quality detected. Stop current exercise and focus on technique.',
      is_resolved: false,
    });
  } else if (metrics.form_quality < 5) {
    alerts.push({
      user_id: userId,
      alert_type: 'form',
      severity: 'high',
      message:
        'Form quality declining. Reduce weight and focus on proper technique.',
      is_resolved: false,
    });
  }

  // Load progression alerts
  if (metrics.load_progression > 15) {
    alerts.push({
      user_id: userId,
      alert_type: 'load',
      severity: 'critical',
      message: 'Weight progression too rapid. Risk of injury is high.',
      is_resolved: false,
    });
  } else if (metrics.load_progression > 10) {
    alerts.push({
      user_id: userId,
      alert_type: 'load',
      severity: 'high',
      message: 'Weight progression is high. Monitor for signs of overuse.',
      is_resolved: false,
    });
  }

  // Injury risk alerts
  if (metrics.injury_risk === 'critical') {
    alerts.push({
      user_id: userId,
      alert_type: 'injury_risk',
      severity: 'critical',
      message:
        'High injury risk detected. Consider consulting a healthcare professional.',
      is_resolved: false,
    });
  } else if (metrics.injury_risk === 'high') {
    alerts.push({
      user_id: userId,
      alert_type: 'injury_risk',
      severity: 'high',
      message:
        'Elevated injury risk. Take additional precautions and rest if needed.',
      is_resolved: false,
    });
  }

  return alerts;
}

/**
 * Check if session should be modified based on safety metrics
 */
export function shouldModifySession(metrics: SafetyMetrics): {
  should_modify: boolean;
  modifications: {
    reduce_intensity: boolean;
    reduce_volume: boolean;
    add_rest: boolean;
    focus_on_form: boolean;
  };
} {
  const modifications = {
    reduce_intensity: false,
    reduce_volume: false,
    add_rest: false,
    focus_on_form: false,
  };

  let should_modify = false;

  if (metrics.fatigue_level > 6) {
    modifications.reduce_intensity = true;
    modifications.reduce_volume = true;
    should_modify = true;
  }

  if (metrics.form_quality < 5) {
    modifications.focus_on_form = true;
    modifications.reduce_intensity = true;
    should_modify = true;
  }

  if (metrics.injury_risk === 'high' || metrics.injury_risk === 'critical') {
    modifications.add_rest = true;
    modifications.reduce_intensity = true;
    modifications.reduce_volume = true;
    should_modify = true;
  }

  return {
    should_modify,
    modifications,
  };
}
