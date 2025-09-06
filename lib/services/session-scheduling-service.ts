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
          intensity: this.calculateOptimalIntensity(sessionType, checkIns, sessions),
          priority: this.calculatePriority(sessionsThisWeek.length, userPreferences.maxSessionsPerWeek),
          reason: this.generateSessionReason(sessionType, optimalTiming.factors),
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
      const avgEnergy = recentCheckIns.reduce((sum, c) => sum + c.energy, 0) / recentCheckIns.length;
      
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
      const avgSleep = recentSleep.reduce((sum, s) => sum + s, 0) / recentSleep.length;
      
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
      
      const avgSessionTime = sessionTimes.reduce((sum, t) => sum + t, 0) / sessionTimes.length;
      bestTime = `${Math.round(avgSessionTime).toString().padStart(2, '0')}:00`;
      confidence += 10;
      factors.push('Consistent with recent schedule');
    }

    // Check day of week patterns
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    
    if (dayOfWeek === 1) { // Monday
      bestTime = '18:00';
      factors.push('Monday motivation');
    } else if (dayOfWeek === 5) { // Friday
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
    // eslint-disable-next-line no-unused-vars
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
        (targetDate.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24)
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
    const strengthSessions = recentSessions.filter(s => s.type === 'strength').length;
    const volleyballSessions = recentSessions.filter(s => s.type === 'volleyball').length;
    const conditioningSessions = recentSessions.filter(s => s.type === 'conditioning').length;

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
  static generateSessionReason(
    sessionType: string,
    factors: string[]
  ): string {
    const reasons = {
      strength: 'Build strength and muscle',
      volleyball: 'Improve skills and athleticism',
      conditioning: 'Enhance cardiovascular fitness',
      rest: 'Recovery and regeneration',
    };

    let reason = reasons[sessionType as keyof typeof reasons] || 'Maintain fitness';
    
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
}
