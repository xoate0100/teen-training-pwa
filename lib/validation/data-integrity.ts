import {
  SessionData,
  CheckInData,
  ProgressMetrics,
  Achievement,
  Notification,
} from '@/lib/services/database-service';
import {
  validateSession,
  validateCheckIn,
  validateProgressMetrics,
  validateAchievement,
  validateNotification,
} from './schemas';

export interface DataIntegrityResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class DataIntegrityChecker {
  // Check session data integrity
  static checkSession(session: SessionData): DataIntegrityResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate with schema
    const validation = validateSession(session);
    if (!validation.success) {
      errors.push(
        ...validation.error.errors.map(err => `Validation: ${err.message}`)
      );
    }

    // Additional business logic checks
    if (session.exercises.length === 0) {
      errors.push('Session must have at least one exercise');
    }

    // Check RPE consistency
    const calculatedRPE = session.exercises.reduce((total, exercise) => {
      return (
        total +
        exercise.sets.reduce((exerciseTotal, set) => {
          return exerciseTotal + (set.completed ? set.rpe : 0);
        }, 0)
      );
    }, 0);

    if (Math.abs(calculatedRPE - session.totalRPE) > 0.1) {
      warnings.push('Total RPE does not match sum of individual set RPEs');
    }

    // Check duration reasonableness
    if (session.duration < 5) {
      warnings.push('Session duration seems too short');
    }
    if (session.duration > 180) {
      warnings.push('Session duration seems too long');
    }

    // Check date validity
    const sessionDate = new Date(session.date);
    const now = new Date();
    if (sessionDate > now) {
      warnings.push('Session date is in the future');
    }
    if (sessionDate < new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)) {
      warnings.push('Session date is more than a year ago');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Check check-in data integrity
  static checkCheckIn(checkIn: CheckInData): DataIntegrityResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate with schema
    const validation = validateCheckIn(checkIn);
    if (!validation.success) {
      errors.push(
        ...validation.error.errors.map(err => `Validation: ${err.message}`)
      );
    }

    // Check for unusual patterns
    if (checkIn.mood <= 2 && checkIn.energy <= 2) {
      warnings.push('Very low mood and energy - consider rest day');
    }

    if (checkIn.sleep < 4) {
      warnings.push('Very low sleep - consider rest day');
    }

    if (checkIn.sleep > 12) {
      warnings.push('Very high sleep - check if this is correct');
    }

    if (checkIn.soreness >= 8) {
      warnings.push('High soreness - consider lighter training');
    }

    // Check date validity
    const checkInDate = new Date(checkIn.date);
    const now = new Date();
    if (checkInDate > now) {
      warnings.push('Check-in date is in the future');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Check progress metrics integrity
  static checkProgressMetrics(metric: ProgressMetrics): DataIntegrityResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate with schema
    const validation = validateProgressMetrics(metric);
    if (!validation.success) {
      errors.push(
        ...validation.error.errors.map(err => `Validation: ${err.message}`)
      );
    }

    // Check for reasonable values based on metric type
    switch (metric.metric_type) {
      case 'strength':
        if (metric.value > 1000 && metric.unit === 'lbs') {
          warnings.push('Very high strength value - verify accuracy');
        }
        break;
      case 'endurance':
        if (metric.value > 300 && metric.unit === 'minutes') {
          warnings.push('Very long endurance session - verify accuracy');
        }
        break;
      case 'flexibility':
        if (metric.value > 180 && metric.unit === 'degrees') {
          warnings.push('Very high flexibility measurement - verify accuracy');
        }
        break;
      case 'coordination':
        if (metric.value > 100 && metric.unit === 'score') {
          warnings.push('Very high coordination score - verify accuracy');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Check achievement integrity
  static checkAchievement(achievement: Achievement): DataIntegrityResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate with schema
    const validation = validateAchievement(achievement);
    if (!validation.success) {
      errors.push(
        ...validation.error.errors.map(err => `Validation: ${err.message}`)
      );
    }

    // Check progress consistency
    if (achievement.progress > achievement.max_progress) {
      errors.push('Progress cannot exceed max progress');
    }

    if (achievement.progress < 0) {
      errors.push('Progress cannot be negative');
    }

    // Check unlock date
    const unlockDate = new Date(achievement.unlocked_at);
    const now = new Date();
    if (unlockDate > now) {
      warnings.push('Achievement unlock date is in the future');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Check notification integrity
  static checkNotification(notification: Notification): DataIntegrityResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate with schema
    const validation = validateNotification(notification);
    if (!validation.success) {
      errors.push(
        ...validation.error.errors.map(err => `Validation: ${err.message}`)
      );
    }

    // Check message length
    if (notification.message.length > 1000) {
      warnings.push('Notification message is very long');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Check all data for a user
  static async checkUserData(data: {
    sessions: SessionData[];
    checkIns: CheckInData[];
    progressMetrics: ProgressMetrics[];
    achievements: Achievement[];
    notifications: Notification[];
  }): Promise<DataIntegrityResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check sessions
    for (const session of data.sessions) {
      const result = this.checkSession(session);
      errors.push(...result.errors.map(err => `Session ${session.id}: ${err}`));
      warnings.push(
        ...result.warnings.map(warn => `Session ${session.id}: ${warn}`)
      );
    }

    // Check check-ins
    for (const checkIn of data.checkIns) {
      const result = this.checkCheckIn(checkIn);
      errors.push(
        ...result.errors.map(err => `Check-in ${checkIn.date}: ${err}`)
      );
      warnings.push(
        ...result.warnings.map(warn => `Check-in ${checkIn.date}: ${warn}`)
      );
    }

    // Check progress metrics
    for (const metric of data.progressMetrics) {
      const result = this.checkProgressMetrics(metric);
      errors.push(...result.errors.map(err => `Metric ${metric.id}: ${err}`));
      warnings.push(
        ...result.warnings.map(warn => `Metric ${metric.id}: ${warn}`)
      );
    }

    // Check achievements
    for (const achievement of data.achievements) {
      const result = this.checkAchievement(achievement);
      errors.push(
        ...result.errors.map(err => `Achievement ${achievement.id}: ${err}`)
      );
      warnings.push(
        ...result.warnings.map(warn => `Achievement ${achievement.id}: ${warn}`)
      );
    }

    // Check notifications
    for (const notification of data.notifications) {
      const result = this.checkNotification(notification);
      errors.push(
        ...result.errors.map(err => `Notification ${notification.id}: ${err}`)
      );
      warnings.push(
        ...result.warnings.map(
          warn => `Notification ${notification.id}: ${warn}`
        )
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
