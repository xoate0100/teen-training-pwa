'use client';

import { SessionData, CheckInData } from '@/lib/services/database-service';

export interface ProgramConfig {
  startDate: string;
  totalWeeks: number;
  deloadWeekInterval: number; // Every N weeks
  deloadWeekDuration: number; // How many weeks of deload
  sessionFrequency: number; // Sessions per week
  restDays: number[]; // Days of week (0-6) for rest
}

export interface WeekCalculation {
  currentWeek: number;
  currentDay: number;
  isDeloadWeek: boolean;
  isRestDay: boolean;
  nextSessionDate: string | null;
  missedSessions: number;
  programProgress: number; // Percentage
  weekStartDate: string;
  weekEndDate: string;
  sessionsThisWeek: SessionData[];
  recommendedIntensity: 'low' | 'moderate' | 'high';
}

export interface SessionRecommendation {
  shouldTrain: boolean;
  reason: string;
  recommendedType: 'strength' | 'volleyball' | 'conditioning' | 'rest';
  intensity: 'low' | 'moderate' | 'high';
  duration: number; // minutes
  focus: string[];
  warnings: string[];
}

export class WeekCalculationService {
  private static readonly DEFAULT_CONFIG: ProgramConfig = {
    startDate: new Date().toISOString().split('T')[0],
    totalWeeks: 12,
    deloadWeekInterval: 4,
    deloadWeekDuration: 1,
    sessionFrequency: 3,
    restDays: [0, 6], // Sunday and Saturday
  };

  // Calculate current week and day based on program start date
  static calculateCurrentWeek(
    programStartDate: string,
    currentDate: string = new Date().toISOString().split('T')[0]
  ): { week: number; day: number } {
    const start = new Date(programStartDate);
    const current = new Date(currentDate);

    // Calculate days since start
    const timeDiff = current.getTime() - start.getTime();
    const daysSinceStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // Calculate week and day
    const week = Math.floor(daysSinceStart / 7) + 1;
    const day = (daysSinceStart % 7) + 1;

    return { week, day };
  }

  // Check if current week is a deload week
  static isDeloadWeek(
    week: number,
    config: ProgramConfig = this.DEFAULT_CONFIG
  ): boolean {
    const deloadCycle = config.deloadWeekInterval + config.deloadWeekDuration;
    const cyclePosition = ((week - 1) % deloadCycle) + 1;
    return cyclePosition > config.deloadWeekInterval;
  }

  // Check if current day is a rest day
  static isRestDay(
    dayOfWeek: number,
    config: ProgramConfig = this.DEFAULT_CONFIG
  ): boolean {
    return config.restDays.includes(dayOfWeek);
  }

  // Calculate next session date
  static calculateNextSessionDate(
    currentDate: string,
    sessions: SessionData[],
    config: ProgramConfig = this.DEFAULT_CONFIG
  ): string | null {
    const current = new Date(currentDate);
    const sessionsThisWeek = this.getSessionsForWeek(sessions, currentDate);

    // If we haven't reached the session frequency for this week, find next available day
    if (sessionsThisWeek.length < config.sessionFrequency) {
      for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(current);
        nextDate.setDate(current.getDate() + i);
        const dayOfWeek = nextDate.getDay();

        if (!this.isRestDay(dayOfWeek, config)) {
          return nextDate.toISOString().split('T')[0];
        }
      }
    }

    // If we've completed this week's sessions, find next week's first session
    const nextWeekStart = new Date(current);
    nextWeekStart.setDate(current.getDate() + (7 - current.getDay()));

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(nextWeekStart);
      checkDate.setDate(nextWeekStart.getDate() + i);
      const dayOfWeek = checkDate.getDay();

      if (!this.isRestDay(dayOfWeek, config)) {
        return checkDate.toISOString().split('T')[0];
      }
    }

    return null;
  }

  // Get sessions for a specific week
  static getSessionsForWeek(
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

  // Calculate missed sessions
  static calculateMissedSessions(
    sessions: SessionData[],
    programStartDate: string,
    config: ProgramConfig = this.DEFAULT_CONFIG
  ): number {
    const { week: currentWeek } = this.calculateCurrentWeek(programStartDate);
    const expectedSessions = (currentWeek - 1) * config.sessionFrequency;
    const actualSessions = sessions.filter(s => s.completed).length;

    return Math.max(0, expectedSessions - actualSessions);
  }

  // Calculate program progress percentage
  static calculateProgramProgress(
    currentWeek: number,
    config: ProgramConfig = this.DEFAULT_CONFIG
  ): number {
    return Math.min(100, (currentWeek / config.totalWeeks) * 100);
  }

  // Get week start and end dates
  static getWeekDates(
    weekNumber: number,
    programStartDate: string
  ): { startDate: string; endDate: string } {
    const start = new Date(programStartDate);
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + (weekNumber - 1) * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return {
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
    };
  }

  // Calculate recommended intensity based on various factors
  static calculateRecommendedIntensity(
    weekCalculation: WeekCalculation,
    recentCheckIns: CheckInData[],
    recentSessions: SessionData[]
  ): 'low' | 'moderate' | 'high' {
    // Base intensity on week type
    if (weekCalculation.isDeloadWeek) {
      return 'low';
    }

    // Check recent wellness data
    const recentCheckIn = recentCheckIns[0];
    if (recentCheckIn) {
      const avgWellness = (recentCheckIn.mood + recentCheckIn.energy) / 2;
      if (avgWellness <= 4) return 'low';
      if (avgWellness <= 6) return 'moderate';
    }

    // Check recent session intensity
    const recentSession = recentSessions[0];
    if (recentSession) {
      const avgRPE = recentSession.totalRPE / recentSession.exercises.length;
      if (avgRPE >= 8) return 'low'; // High RPE last session, go lighter
      if (avgRPE <= 5) return 'high'; // Low RPE last session, can go harder
    }

    // Check missed sessions
    if (weekCalculation.missedSessions > 2) return 'low';

    // Default to moderate
    return 'moderate';
  }

  // Generate comprehensive week calculation
  static calculateWeek(
    programStartDate: string,
    sessions: SessionData[],
    checkIns: CheckInData[] = [],
    config: ProgramConfig = this.DEFAULT_CONFIG,
    currentDate: string = new Date().toISOString().split('T')[0]
  ): WeekCalculation {
    const { week: currentWeek, day: currentDay } = this.calculateCurrentWeek(
      programStartDate,
      currentDate
    );

    const isDeloadWeek = this.isDeloadWeek(currentWeek, config);
    const isRestDay = this.isRestDay(new Date(currentDate).getDay(), config);
    const nextSessionDate = this.calculateNextSessionDate(
      currentDate,
      sessions,
      config
    );
    const missedSessions = this.calculateMissedSessions(
      sessions,
      programStartDate,
      config
    );
    const programProgress = this.calculateProgramProgress(currentWeek, config);
    const weekDates = this.getWeekDates(currentWeek, programStartDate);
    const sessionsThisWeek = this.getSessionsForWeek(sessions, currentDate);

    const weekCalculation: WeekCalculation = {
      currentWeek,
      currentDay,
      isDeloadWeek,
      isRestDay,
      nextSessionDate,
      missedSessions,
      programProgress,
      weekStartDate: weekDates.startDate,
      weekEndDate: weekDates.endDate,
      sessionsThisWeek,
      recommendedIntensity: 'moderate',
    };

    // Calculate recommended intensity
    weekCalculation.recommendedIntensity = this.calculateRecommendedIntensity(
      weekCalculation,
      checkIns,
      sessions
    );

    return weekCalculation;
  }

  // Generate session recommendation
  static generateSessionRecommendation(
    weekCalculation: WeekCalculation,
    recentCheckIns: CheckInData[],

    recentSessions: SessionData[]
  ): SessionRecommendation {
    const shouldTrain = !weekCalculation.isRestDay;
    let reason = '';
    let recommendedType: 'strength' | 'volleyball' | 'conditioning' | 'rest' =
      'strength';
    let intensity = weekCalculation.recommendedIntensity;
    let duration = 60; // Default 60 minutes
    let focus: string[] = [];
    const warnings: string[] = [];

    // Determine if should train
    if (weekCalculation.isRestDay) {
      reason = 'Rest day scheduled';
      recommendedType = 'rest';
    } else if (weekCalculation.sessionsThisWeek.length >= 3) {
      reason = 'Weekly session limit reached';
      recommendedType = 'rest';
    } else if (weekCalculation.missedSessions > 3) {
      reason = 'Too many missed sessions - consider rest';
      recommendedType = 'rest';
    } else {
      reason = 'Ready for training';
    }

    // Determine session type based on week and progress
    if (weekCalculation.isDeloadWeek) {
      recommendedType = 'conditioning';
      intensity = 'low';
      duration = 45;
      focus = ['mobility', 'light cardio', 'recovery'];
    } else {
      // Alternate between strength and volleyball based on week
      if (weekCalculation.currentWeek % 2 === 0) {
        recommendedType = 'volleyball';
        focus = ['skills', 'agility', 'coordination'];
      } else {
        recommendedType = 'strength';
        focus = ['compound movements', 'progressive overload'];
      }
    }

    // Adjust based on recent wellness
    const recentCheckIn = recentCheckIns[0];
    if (recentCheckIn) {
      if (recentCheckIn.soreness >= 7) {
        warnings.push('High soreness detected - consider lighter session');
        intensity = 'low';
        duration = Math.min(duration, 45);
      }

      if (recentCheckIn.sleep < 6) {
        warnings.push('Poor sleep quality - monitor fatigue');
        intensity = 'moderate';
      }

      if (recentCheckIn.energy <= 3) {
        warnings.push('Low energy - consider postponing session');
        recommendedType = 'rest';
        reason = 'Low energy levels detected';
      }
    }

    // Adjust duration based on intensity
    if (intensity === 'low') duration = 45;
    else if (intensity === 'high') duration = 90;

    return {
      shouldTrain,
      reason,
      recommendedType,
      intensity,
      duration,
      focus,
      warnings,
    };
  }

  // Get program configuration for a user
  static getProgramConfig(userId: string): ProgramConfig {
    // In a real implementation, this would fetch from database
    // For now, return default config
    return { ...this.DEFAULT_CONFIG };
  }

  // Update program configuration
  static updateProgramConfig(
    userId: string,
    config: Partial<ProgramConfig>
  ): ProgramConfig {
    // In a real implementation, this would save to database
    const currentConfig = this.getProgramConfig(userId);
    return { ...currentConfig, ...config };
  }
}
