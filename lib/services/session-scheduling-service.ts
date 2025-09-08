'use client';

import { SessionData, CheckInData } from '@/lib/services/database-service';

export interface SessionSchedule {
  id: string;
  date: string;
  time: string;
  type: 'strength' | 'volleyball' | 'conditioning' | 'rest';
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  priority: 'high' | 'medium' | 'low';
  reason: string;
  conflicts: ScheduleConflict[];
  optimal: boolean;
}

export interface ScheduleConflict {
  type: 'time' | 'energy' | 'recovery' | 'social' | 'work';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

export interface OptimalTiming {
  bestTime: string;
  confidence: number; // 0-100
  factors: string[];
  alternatives: string[];
}

export interface RecoveryRecommendation {
  shouldRest: boolean;
  reason: string;
  alternativeActivity: string | null;
  duration: number; // minutes
}

export interface MissedSessionRecovery {
  missedSessionId: string;
  originalDate: string;
  recoveryDate: string;
  recoveryTime: string;
  adjustedIntensity: 'low' | 'moderate' | 'high';
  reason: string;
  conflicts: ScheduleConflict[];
  optimal: boolean;
}

export interface AutomaticSchedule {
  weekStart: string;
  weekEnd: string;
  sessions: SessionSchedule[];
  conflicts: ScheduleConflict[];
  recoveryDays: string[];
  optimal: boolean;
  adjustments: string[];
}

export interface ConflictResolution {
  conflictId: string;
  resolution:
    | 'reschedule'
    | 'adjust_time'
    | 'reduce_intensity'
    | 'postpone'
    | 'skip';
  newDate?: string;
  newTime?: string;
  newIntensity?: 'low' | 'moderate' | 'high';
  reason: string;
  impact: 'low' | 'medium' | 'high';
}

export class SessionSchedulingService {
  // Predict next session based on current data
  static predictNextSession(
    currentDate: string,
    sessions: SessionData[],
    checkIns: CheckInData[],
    userPreferences: {
      preferredTimes: string[];
      availableDays: number[];
      maxSessionsPerWeek: number;
    } = {
      preferredTimes: ['18:00', '19:00', '20:00'],
      availableDays: [1, 2, 3, 4, 5], // Monday to Friday
      maxSessionsPerWeek: 3,
    }
  ): SessionSchedule | null {
    const current = new Date(currentDate);
    const sessionsThisWeek = this.getSessionsForWeek(sessions, currentDate);

    // Check if we've reached weekly limit
    if (sessionsThisWeek.length >= userPreferences.maxSessionsPerWeek) {
      return null;
    }

    // Find next available day
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(current);
      nextDate.setDate(current.getDate() + i);
      const dayOfWeek = nextDate.getDay();

      if (userPreferences.availableDays.includes(dayOfWeek)) {
        const optimalTiming = this.calculateOptimalTiming(
          nextDate.toISOString().split('T')[0],
          checkIns,
          sessions
        );

        const conflicts = this.detectConflicts(
          nextDate.toISOString().split('T')[0],
          optimalTiming.bestTime,
          checkIns,
          sessions
        );

        const sessionType = this.recommendSessionType(
          nextDate.toISOString().split('T')[0],
          sessions,
          checkIns
        );

        return {
          id: `session_${Date.now()}`,
          date: nextDate.toISOString().split('T')[0],
          time: optimalTiming.bestTime,
          type: sessionType,
          duration: this.calculateOptimalDuration(sessionType, checkIns),
          intensity: this.calculateOptimalIntensity(
            sessionType,
            checkIns,
            sessions
          ),
          priority: this.calculatePriority(
            sessionsThisWeek.length,
            userPreferences.maxSessionsPerWeek
          ),
          reason: this.generateSessionReason(
            sessionType,
            optimalTiming.factors
          ),
          conflicts,
          optimal: conflicts.length === 0,
        };
      }
    }

    return null;
  }

  // Calculate optimal timing for a session
  static calculateOptimalTiming(
    date: string,
    checkIns: CheckInData[],
    sessions: SessionData[]
  ): OptimalTiming {
    const factors: string[] = [];
    let bestTime = '18:00'; // Default evening time
    let confidence = 50;

    // Check recent energy patterns
    const recentCheckIns = checkIns.slice(0, 7);
    if (recentCheckIns.length > 0) {
      const avgEnergy =
        recentCheckIns.reduce((sum, c) => sum + c.energy, 0) /
        recentCheckIns.length;

      if (avgEnergy >= 7) {
        bestTime = '18:00';
        confidence += 20;
        factors.push('High energy levels');
      } else if (avgEnergy >= 5) {
        bestTime = '19:00';
        confidence += 10;
        factors.push('Moderate energy levels');
      } else {
        bestTime = '20:00';
        confidence -= 10;
        factors.push('Lower energy levels - later session');
      }
    }

    // Check sleep patterns
    const recentSleep = recentCheckIns.map(c => c.sleep);
    if (recentSleep.length > 0) {
      const avgSleep =
        recentSleep.reduce((sum, s) => sum + s, 0) / recentSleep.length;

      if (avgSleep >= 8) {
        confidence += 15;
        factors.push('Good sleep quality');
      } else if (avgSleep < 6) {
        confidence -= 20;
        factors.push('Poor sleep - consider rest day');
      }
    }

    // Check recent session timing patterns
    const recentSessions = sessions.slice(0, 5);
    if (recentSessions.length > 0) {
      const sessionTimes = recentSessions.map(s => {
        const sessionDate = new Date(s.date);
        return sessionDate.getHours();
      });

      const avgSessionTime =
        sessionTimes.reduce((sum, t) => sum + t, 0) / sessionTimes.length;
      bestTime = `${Math.round(avgSessionTime).toString().padStart(2, '0')}:00`;
      confidence += 10;
      factors.push('Consistent with recent schedule');
    }

    // Check day of week patterns
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    if (dayOfWeek === 1) {
      // Monday
      bestTime = '18:00';
      factors.push('Monday motivation');
    } else if (dayOfWeek === 5) {
      // Friday
      bestTime = '17:00';
      factors.push('Friday energy');
    }

    return {
      bestTime,
      confidence: Math.min(100, Math.max(0, confidence)),
      factors,
      alternatives: this.generateTimeAlternatives(bestTime),
    };
  }

  // Detect potential conflicts
  static detectConflicts(
    date: string,
    time: string,
    checkIns: CheckInData[],
    sessions: SessionData[]
  ): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];
    const targetDate = new Date(date);

    const targetTime = new Date(`${date}T${time}`);

    // Check for energy conflicts
    const recentCheckIn = checkIns.find(c => c.date === date);
    if (recentCheckIn) {
      if (recentCheckIn.energy <= 3) {
        conflicts.push({
          type: 'energy',
          severity: 'high',
          description: 'Very low energy levels',
          suggestion: 'Consider postponing or reducing intensity',
        });
      } else if (recentCheckIn.energy <= 5) {
        conflicts.push({
          type: 'energy',
          severity: 'medium',
          description: 'Low energy levels',
          suggestion: 'Consider lighter session or later time',
        });
      }
    }

    // Check for recovery conflicts
    const recentSessions = sessions.slice(0, 3);
    if (recentSessions.length > 0) {
      const lastSession = recentSessions[0];
      const lastSessionDate = new Date(lastSession.date);
      const daysSinceLastSession = Math.floor(
        (targetDate.getTime() - lastSessionDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastSession < 1) {
        conflicts.push({
          type: 'recovery',
          severity: 'high',
          description: 'Insufficient recovery time',
          suggestion: 'Wait at least 24 hours between sessions',
        });
      } else if (daysSinceLastSession < 2 && lastSession.totalRPE > 7) {
        conflicts.push({
          type: 'recovery',
          severity: 'medium',
          description: 'High intensity session recently',
          suggestion: 'Consider lighter session or additional rest',
        });
      }
    }

    // Check for soreness conflicts
    if (recentCheckIn && recentCheckIn.soreness >= 7) {
      conflicts.push({
        type: 'recovery',
        severity: 'high',
        description: 'High soreness levels',
        suggestion: 'Consider rest day or very light session',
      });
    }

    return conflicts;
  }

  // Recommend session type based on current data
  static recommendSessionType(
    date: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): 'strength' | 'volleyball' | 'conditioning' | 'rest' {
    const recentCheckIn = checkIns.find(c => c.date === date);
    const recentSessions = sessions.slice(0, 7);

    // Check if rest is needed
    if (recentCheckIn) {
      if (recentCheckIn.energy <= 3 || recentCheckIn.soreness >= 8) {
        return 'rest';
      }
    }

    // Check recent session distribution
    const strengthSessions = recentSessions.filter(
      s => s.type === 'strength'
    ).length;
    const volleyballSessions = recentSessions.filter(
      s => s.type === 'volleyball'
    ).length;
    const conditioningSessions = recentSessions.filter(
      s => s.type === 'conditioning'
    ).length;

    // Balance session types
    if (strengthSessions === 0) return 'strength';
    if (volleyballSessions === 0) return 'volleyball';
    if (conditioningSessions === 0) return 'conditioning';

    // Default to strength if all types are balanced
    return 'strength';
  }

  // Calculate optimal duration for session type
  static calculateOptimalDuration(
    sessionType: string,
    checkIns: CheckInData[]
  ): number {
    const recentCheckIn = checkIns[0];
    let baseDuration = 60; // Default 60 minutes

    switch (sessionType) {
      case 'strength':
        baseDuration = 75;
        break;
      case 'volleyball':
        baseDuration = 90;
        break;
      case 'conditioning':
        baseDuration = 45;
        break;
      case 'rest':
        return 0;
    }

    // Adjust based on energy levels
    if (recentCheckIn) {
      if (recentCheckIn.energy <= 5) {
        baseDuration *= 0.8; // Reduce duration for low energy
      } else if (recentCheckIn.energy >= 8) {
        baseDuration *= 1.1; // Increase duration for high energy
      }
    }

    return Math.round(baseDuration);
  }

  // Calculate optimal intensity
  static calculateOptimalIntensity(
    sessionType: string,
    checkIns: CheckInData[],
    sessions: SessionData[]
  ): 'low' | 'moderate' | 'high' {
    const recentCheckIn = checkIns[0];
    const recentSession = sessions[0];

    // Base intensity on session type
    let baseIntensity: 'low' | 'moderate' | 'high' = 'moderate';

    if (sessionType === 'conditioning') baseIntensity = 'high';
    else if (sessionType === 'strength') baseIntensity = 'moderate';
    else if (sessionType === 'volleyball') baseIntensity = 'moderate';

    // Adjust based on energy
    if (recentCheckIn) {
      if (recentCheckIn.energy <= 4) {
        baseIntensity = 'low';
      } else if (recentCheckIn.energy >= 8) {
        baseIntensity = 'high';
      }
    }

    // Adjust based on recent session intensity
    if (recentSession) {
      const avgRPE = recentSession.totalRPE / recentSession.exercises.length;
      if (avgRPE >= 8) {
        baseIntensity = 'low'; // Go lighter after high intensity
      } else if (avgRPE <= 5) {
        baseIntensity = 'high'; // Go harder after low intensity
      }
    }

    return baseIntensity;
  }

  // Calculate session priority
  static calculatePriority(
    currentWeekSessions: number,
    maxSessionsPerWeek: number
  ): 'high' | 'medium' | 'low' {
    const remainingSessions = maxSessionsPerWeek - currentWeekSessions;

    if (remainingSessions <= 1) return 'high';
    if (remainingSessions <= 2) return 'medium';
    return 'low';
  }

  // Generate session reason
  static generateSessionReason(sessionType: string, factors: string[]): string {
    const reasons = {
      strength: 'Build strength and muscle',
      volleyball: 'Improve skills and athleticism',
      conditioning: 'Enhance cardiovascular fitness',
      rest: 'Recovery and regeneration',
    };

    let reason =
      reasons[sessionType as keyof typeof reasons] || 'Maintain fitness';

    if (factors.length > 0) {
      reason += ` (${factors.join(', ')})`;
    }

    return reason;
  }

  // Generate time alternatives
  static generateTimeAlternatives(bestTime: string): string[] {
    const time = parseInt(bestTime.split(':')[0]);
    const alternatives: string[] = [];

    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue; // Skip the best time itself
      const alternativeTime = time + i;
      if (alternativeTime >= 6 && alternativeTime <= 22) {
        alternatives.push(`${alternativeTime.toString().padStart(2, '0')}:00`);
      }
    }

    return alternatives;
  }

  // Get sessions for a specific week
  private static getSessionsForWeek(
    sessions: SessionData[],
    dateInWeek: string
  ): SessionData[] {
    const targetDate = new Date(dateInWeek);
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - targetDate.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });
  }

  // Generate recovery recommendation
  static generateRecoveryRecommendation(
    checkIns: CheckInData[],
    sessions: SessionData[]
  ): RecoveryRecommendation {
    const recentCheckIn = checkIns[0];
    const recentSession = sessions[0];

    if (!recentCheckIn) {
      return {
        shouldRest: false,
        reason: 'No recent check-in data',
        alternativeActivity: null,
        duration: 0,
      };
    }

    // Check multiple factors for rest recommendation
    const shouldRest =
      recentCheckIn.energy <= 3 ||
      recentCheckIn.soreness >= 8 ||
      recentCheckIn.sleep < 5 ||
      (recentSession && recentSession.totalRPE >= 8);

    let reason = '';
    let alternativeActivity: string | null = null;
    let duration = 0;

    if (shouldRest) {
      if (recentCheckIn.energy <= 3) {
        reason = 'Very low energy levels';
        alternativeActivity = 'Light walking or stretching';
        duration = 20;
      } else if (recentCheckIn.soreness >= 8) {
        reason = 'High soreness levels';
        alternativeActivity = 'Mobility work or foam rolling';
        duration = 30;
      } else if (recentCheckIn.sleep < 5) {
        reason = 'Poor sleep quality';
        alternativeActivity = 'Gentle yoga or meditation';
        duration = 15;
      } else {
        reason = 'High intensity session recently';
        alternativeActivity = 'Active recovery or light cardio';
        duration = 30;
      }
    }

    return {
      shouldRest,
      reason,
      alternativeActivity,
      duration,
    };
  }

  // ===== PHASE 4.1.2: INTELLIGENT SESSION MANAGEMENT =====

  // Automatic session scheduling for entire week
  static generateAutomaticSchedule(
    weekStart: string,
    sessions: SessionData[],
    checkIns: CheckInData[],
    userPreferences: {
      preferredTimes: string[];
      availableDays: number[];
      maxSessionsPerWeek: number;
      preferredSessionTypes: string[];
    } = {
      preferredTimes: ['18:00', '19:00', '20:00'],
      availableDays: [1, 2, 3, 4, 5], // Monday to Friday
      maxSessionsPerWeek: 3,
      preferredSessionTypes: ['strength', 'volleyball', 'conditioning'],
    }
  ): AutomaticSchedule {
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);

    const scheduledSessions: SessionSchedule[] = [];
    const allConflicts: ScheduleConflict[] = [];
    const recoveryDays: string[] = [];
    const adjustments: string[] = [];

    // Get existing sessions for this week
    const existingSessions = this.getSessionsForWeek(sessions, weekStart);

    // Plan each day of the week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStartDate);
      currentDate.setDate(weekStartDate.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      const dateStr = currentDate.toISOString().split('T')[0];

      // Check if this is a recovery day
      const recoveryRecommendation = this.generateRecoveryRecommendation(
        checkIns.filter(c => c.date === dateStr),
        sessions
      );

      if (recoveryRecommendation.shouldRest) {
        recoveryDays.push(dateStr);
        adjustments.push(
          `Recovery day scheduled for ${dateStr}: ${recoveryRecommendation.reason}`
        );
        continue;
      }

      // Check if user prefers this day
      if (!userPreferences.availableDays.includes(dayOfWeek)) {
        continue;
      }

      // Check if we've reached weekly limit
      if (scheduledSessions.length >= userPreferences.maxSessionsPerWeek) {
        break;
      }

      // Check if session already exists for this day
      const existingSession = existingSessions.find(s => s.date === dateStr);
      if (existingSession) {
        continue;
      }

      // Generate session for this day
      const sessionType = this.recommendSessionType(
        dateStr,
        sessions,
        checkIns
      );
      const optimalTiming = this.calculateOptimalTiming(
        dateStr,
        checkIns,
        sessions
      );
      const conflicts = this.detectConflicts(
        dateStr,
        optimalTiming.bestTime,
        checkIns,
        sessions
      );

      const session: SessionSchedule = {
        id: `session_${dateStr}_${Date.now()}`,
        date: dateStr,
        time: optimalTiming.bestTime,
        type: sessionType,
        duration: this.calculateOptimalDuration(sessionType, checkIns),
        intensity: this.calculateOptimalIntensity(
          sessionType,
          checkIns,
          sessions
        ),
        priority: this.calculatePriority(
          scheduledSessions.length,
          userPreferences.maxSessionsPerWeek
        ),
        reason: this.generateSessionReason(sessionType, optimalTiming.factors),
        conflicts,
        optimal: conflicts.length === 0,
      };

      scheduledSessions.push(session);
      allConflicts.push(...conflicts);

      if (conflicts.length > 0) {
        adjustments.push(
          `Conflicts detected for ${dateStr}: ${conflicts.map(c => c.description).join(', ')}`
        );
      }
    }

    return {
      weekStart: weekStartDate.toISOString().split('T')[0],
      weekEnd: weekEndDate.toISOString().split('T')[0],
      sessions: scheduledSessions,
      conflicts: allConflicts,
      recoveryDays,
      optimal: allConflicts.length === 0,
      adjustments,
    };
  }

  // Conflict resolution algorithms
  static resolveConflicts(
    schedule: AutomaticSchedule,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): ConflictResolution[] {
    const resolutions: ConflictResolution[] = [];

    for (const session of schedule.sessions) {
      if (session.conflicts.length === 0) continue;

      for (let i = 0; i < session.conflicts.length; i++) {
        const conflict = session.conflicts[i];
        const resolution = this.generateConflictResolution(
          session,
          conflict,
          sessions,
          checkIns
        );
        resolutions.push(resolution);
      }
    }

    return resolutions;
  }

  // Generate resolution for specific conflict
  private static generateConflictResolution(
    session: SessionSchedule,
    conflict: ScheduleConflict,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): ConflictResolution {
    let resolution: ConflictResolution['resolution'] = 'reschedule';
    let newDate: string | undefined;
    let newTime: string | undefined;
    let newIntensity: 'low' | 'moderate' | 'high' | undefined;
    let reason = '';
    let impact: 'low' | 'medium' | 'high' = 'medium';

    switch (conflict.type) {
      case 'energy':
        if (conflict.severity === 'high') {
          resolution = 'postpone';
          newDate = this.findNextAvailableDate(
            session.date,
            sessions,
            checkIns
          );
          reason = 'Low energy levels require postponement';
          impact = 'high';
        } else {
          resolution = 'reduce_intensity';
          newIntensity = 'low';
          reason = 'Reducing intensity due to low energy';
          impact = 'medium';
        }
        break;

      case 'recovery':
        if (conflict.severity === 'high') {
          resolution = 'postpone';
          newDate = this.findNextAvailableDate(
            session.date,
            sessions,
            checkIns
          );
          reason = 'Insufficient recovery time';
          impact = 'high';
        } else {
          resolution = 'adjust_time';
          newTime = this.findOptimalTime(session.date, checkIns, sessions);
          reason = 'Adjusting time for better recovery';
          impact = 'low';
        }
        break;

      case 'time':
        resolution = 'adjust_time';
        newTime = this.findOptimalTime(session.date, checkIns, sessions);
        reason = 'Time conflict detected, adjusting schedule';
        impact = 'low';
        break;

      case 'social':
      case 'work':
        resolution = 'reschedule';
        newDate = this.findNextAvailableDate(session.date, sessions, checkIns);
        reason = 'Social/work conflict, rescheduling';
        impact = 'medium';
        break;

      default:
        resolution = 'skip';
        reason = 'Unable to resolve conflict, skipping session';
        impact = 'high';
    }

    return {
      conflictId: `${session.id}_${conflict.type}_${Date.now()}`,
      resolution,
      newDate,
      newTime,
      newIntensity,
      reason,
      impact,
    };
  }

  // Find next available date for rescheduling
  private static findNextAvailableDate(
    originalDate: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): string {
    const original = new Date(originalDate);

    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(original);
      nextDate.setDate(original.getDate() + i);
      const dateStr = nextDate.toISOString().split('T')[0];

      // Check if date is available
      const existingSession = sessions.find(s => s.date === dateStr);
      if (existingSession) continue;

      // Check for conflicts
      const conflicts = this.detectConflicts(
        dateStr,
        '18:00',
        checkIns,
        sessions
      );
      if (conflicts.length === 0) {
        return dateStr;
      }
    }

    return originalDate; // Fallback to original date
  }

  // Find optimal time for a given date
  private static findOptimalTime(
    date: string,
    checkIns: CheckInData[],
    sessions: SessionData[]
  ): string {
    const optimalTiming = this.calculateOptimalTiming(date, checkIns, sessions);
    return optimalTiming.bestTime;
  }

  // Missed session recovery
  static generateMissedSessionRecovery(
    missedSessionId: string,
    originalDate: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): MissedSessionRecovery | null {
    const original = new Date(originalDate);
    const daysSinceMissed = Math.floor(
      (Date.now() - original.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Don't recover sessions older than 7 days
    if (daysSinceMissed > 7) {
      return null;
    }

    // Find next available date
    const recoveryDate = this.findNextAvailableDate(
      originalDate,
      sessions,
      checkIns
    );
    const recoveryTime = this.findOptimalTime(recoveryDate, checkIns, sessions);

    // Adjust intensity based on time since missed session
    let adjustedIntensity: 'low' | 'moderate' | 'high' = 'moderate';
    if (daysSinceMissed >= 3) {
      adjustedIntensity = 'low';
    } else if (daysSinceMissed <= 1) {
      adjustedIntensity = 'high';
    }

    // Check for conflicts
    const conflicts = this.detectConflicts(
      recoveryDate,
      recoveryTime,
      checkIns,
      sessions
    );

    return {
      missedSessionId,
      originalDate,
      recoveryDate,
      recoveryTime,
      adjustedIntensity,
      reason: `Recovery session for missed ${originalDate} (${daysSinceMissed} days ago)`,
      conflicts,
      optimal: conflicts.length === 0,
    };
  }

  // Optimal timing recommendations
  static generateOptimalTimingRecommendations(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): {
    bestTimes: { time: string; confidence: number; factors: string[] }[];
    weeklyPattern: { day: string; avgTime: string; success: number }[];
    energyPatterns: {
      time: string;
      avgEnergy: number;
      recommendation: string;
    }[];
    recoveryPatterns: {
      day: string;
      avgRecovery: number;
      recommendation: string;
    }[];
  } {
    // Analyze best times based on historical data
    const bestTimes = this.analyzeBestTimes(sessions, checkIns);

    // Analyze weekly patterns
    const weeklyPattern = this.analyzeWeeklyPatterns(sessions);

    // Analyze energy patterns
    const energyPatterns = this.analyzeEnergyPatterns(checkIns);

    // Analyze recovery patterns
    const recoveryPatterns = this.analyzeRecoveryPatterns(sessions, checkIns);

    return {
      bestTimes,
      weeklyPattern,
      energyPatterns,
      recoveryPatterns,
    };
  }

  // Analyze best times based on historical performance
  private static analyzeBestTimes(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): { time: string; confidence: number; factors: string[] }[] {
    const timePerformance: Record<
      string,
      { count: number; avgRPE: number; completion: number }
    > = {};

    // Group sessions by hour
    for (const session of sessions) {
      const sessionDate = new Date(session.date);
      const hour = sessionDate.getHours();
      const timeKey = `${hour.toString().padStart(2, '0')}:00`;

      if (!timePerformance[timeKey]) {
        timePerformance[timeKey] = { count: 0, avgRPE: 0, completion: 0 };
      }

      timePerformance[timeKey].count++;
      timePerformance[timeKey].avgRPE += session.totalRPE;
      timePerformance[timeKey].completion += session.completed ? 1 : 0;
    }

    // Calculate averages and confidence
    const results = Object.entries(timePerformance).map(([time, data]) => {
      const avgRPE = data.avgRPE / data.count;
      const completionRate = data.completion / data.count;

      let confidence = 50;
      const factors: string[] = [];

      if (completionRate >= 0.9) {
        confidence += 30;
        factors.push('High completion rate');
      }

      if (avgRPE >= 6 && avgRPE <= 8) {
        confidence += 20;
        factors.push('Optimal intensity range');
      }

      if (data.count >= 5) {
        confidence += 10;
        factors.push('Sufficient data points');
      }

      return {
        time,
        confidence: Math.min(100, confidence),
        factors,
      };
    });

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  // Analyze weekly patterns
  private static analyzeWeeklyPatterns(
    sessions: SessionData[]
  ): { day: string; avgTime: string; success: number }[] {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayPatterns: Record<
      number,
      { times: number[]; completed: number; total: number }
    > = {};

    for (const session of sessions) {
      const sessionDate = new Date(session.date);
      const dayOfWeek = sessionDate.getDay();
      const hour = sessionDate.getHours();

      if (!dayPatterns[dayOfWeek]) {
        dayPatterns[dayOfWeek] = { times: [], completed: 0, total: 0 };
      }

      dayPatterns[dayOfWeek].times.push(hour);
      dayPatterns[dayOfWeek].total++;
      if (session.completed) {
        dayPatterns[dayOfWeek].completed++;
      }
    }

    return Object.entries(dayPatterns).map(([day, data]) => {
      const avgHour = Math.round(
        data.times.reduce((sum, h) => sum + h, 0) / data.times.length
      );
      const successRate = (data.completed / data.total) * 100;

      return {
        day: dayNames[parseInt(day)],
        avgTime: `${avgHour.toString().padStart(2, '0')}:00`,
        success: Math.round(successRate),
      };
    });
  }

  // Analyze energy patterns
  private static analyzeEnergyPatterns(
    checkIns: CheckInData[]
  ): { time: string; avgEnergy: number; recommendation: string }[] {
    const timeEnergy: Record<string, number[]> = {};

    for (const checkIn of checkIns) {
      const checkInDate = new Date(checkIn.date);
      const hour = checkInDate.getHours();
      const timeKey = `${hour.toString().padStart(2, '0')}:00`;

      if (!timeEnergy[timeKey]) {
        timeEnergy[timeKey] = [];
      }

      timeEnergy[timeKey].push(checkIn.energy);
    }

    return Object.entries(timeEnergy).map(([time, energies]) => {
      const avgEnergy =
        energies.reduce((sum, e) => sum + e, 0) / energies.length;

      let recommendation = '';
      if (avgEnergy >= 7) {
        recommendation = 'Optimal time for high-intensity sessions';
      } else if (avgEnergy >= 5) {
        recommendation = 'Good time for moderate sessions';
      } else {
        recommendation = 'Consider lighter sessions or rest';
      }

      return {
        time,
        avgEnergy: Math.round(avgEnergy * 10) / 10,
        recommendation,
      };
    });
  }

  // Analyze recovery patterns
  private static analyzeRecoveryPatterns(
    sessions: SessionData[],

    checkIns: CheckInData[]
  ): { day: string; avgRecovery: number; recommendation: string }[] {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayRecovery: Record<
      number,
      { energy: number[]; soreness: number[]; sleep: number[] }
    > = {};

    for (const checkIn of checkIns) {
      const checkInDate = new Date(checkIn.date);
      const dayOfWeek = checkInDate.getDay();

      if (!dayRecovery[dayOfWeek]) {
        dayRecovery[dayOfWeek] = { energy: [], soreness: [], sleep: [] };
      }

      dayRecovery[dayOfWeek].energy.push(checkIn.energy);
      dayRecovery[dayOfWeek].soreness.push(checkIn.soreness);
      dayRecovery[dayOfWeek].sleep.push(checkIn.sleep);
    }

    return Object.entries(dayRecovery).map(([day, data]) => {
      const avgEnergy =
        data.energy.reduce((sum, e) => sum + e, 0) / data.energy.length;
      const avgSoreness =
        data.soreness.reduce((sum, s) => sum + s, 0) / data.soreness.length;
      const avgSleep =
        data.sleep.reduce((sum, s) => sum + s, 0) / data.sleep.length;

      const recoveryScore = (avgEnergy + (10 - avgSoreness) + avgSleep) / 3;

      let recommendation = '';
      if (recoveryScore >= 7) {
        recommendation = 'Excellent recovery day - ideal for intense sessions';
      } else if (recoveryScore >= 5) {
        recommendation = 'Good recovery - suitable for moderate sessions';
      } else {
        recommendation = 'Poor recovery - consider rest or light activity';
      }

      return {
        day: dayNames[parseInt(day)],
        avgRecovery: Math.round(recoveryScore * 10) / 10,
        recommendation,
      };
    });
  }
}
