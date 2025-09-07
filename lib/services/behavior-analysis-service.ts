'use client';

import { SessionData, CheckInData, ProgressMetrics } from '@/lib/services/database-service';

export interface WorkoutPattern {
  preferredDays: string[];
  preferredTimes: string[];
  sessionDuration: {
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  exercisePreferences: {
    strength: number;
    volleyball: number;
    conditioning: number;
  };
  intensityPattern: {
    averageRPE: number;
    progression: 'linear' | 'periodized' | 'random';
  };
  consistency: {
    weeklyFrequency: number;
    streakLength: number;
    missedSessionRate: number;
  };
}

export interface PerformanceTrend {
  strength: {
    trend: 'improving' | 'plateau' | 'declining';
    rate: number; // percentage change per week
    confidence: number; // 0-1
  };
  endurance: {
    trend: 'improving' | 'plateau' | 'declining';
    rate: number;
    confidence: number;
  };
  skill: {
    trend: 'improving' | 'plateau' | 'declining';
    rate: number;
    confidence: number;
  };
  overall: {
    trend: 'improving' | 'plateau' | 'declining';
    rate: number;
    confidence: number;
  };
}

export interface HabitFormation {
  workoutHabit: {
    strength: number; // 0-1, how strong the habit is
    consistency: number; // 0-1, how consistent they are
    automaticity: number; // 0-1, how automatic the behavior is
  };
  recoveryHabit: {
    sleepQuality: number;
    nutritionConsistency: number;
    stressManagement: number;
  };
  goalAlignment: {
    shortTerm: number; // 0-1, alignment with short-term goals
    longTerm: number; // 0-1, alignment with long-term goals
  };
}

export interface BehaviorInsights {
  patterns: WorkoutPattern;
  trends: PerformanceTrend;
  habits: HabitFormation;
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
}

export class BehaviorAnalysisService {
  // Analyze workout patterns from historical data
  static analyzeWorkoutPatterns(
    sessions: SessionData[],
    // eslint-disable-next-line no-unused-vars
    checkIns: CheckInData[]
  ): WorkoutPattern {
    if (sessions.length === 0) {
      return this.getDefaultPattern();
    }

    // Analyze preferred days
    const dayCounts = this.analyzeDayPreferences(sessions);
    const preferredDays = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day]) => day);

    // Analyze preferred times
    const timeCounts = this.analyzeTimePreferences(sessions);
    const preferredTimes = Object.entries(timeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([time]) => time);

    // Analyze session duration
    const durations = sessions.map(s => s.duration);
    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const durationTrend = this.calculateTrend(durations);

    // Analyze exercise preferences
    const exerciseCounts = this.analyzeExercisePreferences(sessions);
    const totalSessions = sessions.length;
    const exercisePreferences = {
      strength: (exerciseCounts.strength / totalSessions) * 100,
      volleyball: (exerciseCounts.volleyball / totalSessions) * 100,
      conditioning: (exerciseCounts.conditioning / totalSessions) * 100,
    };

    // Analyze intensity pattern
    const rpeValues = sessions.map(s => s.totalRPE);
    const averageRPE = rpeValues.reduce((sum, r) => sum + r, 0) / rpeValues.length;
    const intensityProgression = this.analyzeIntensityProgression(rpeValues);

    // Analyze consistency
    const consistency = this.analyzeConsistency(sessions);

    return {
      preferredDays,
      preferredTimes,
      sessionDuration: {
        average: Math.round(averageDuration),
        trend: durationTrend,
      },
      exercisePreferences,
      intensityPattern: {
        averageRPE: Math.round(averageRPE * 10) / 10,
        progression: intensityProgression,
      },
      consistency,
    };
  }

  // Analyze performance trends
  static analyzePerformanceTrends(
    sessions: SessionData[],
    // eslint-disable-next-line no-unused-vars
    progressMetrics: ProgressMetrics[]
  ): PerformanceTrend {
    if (sessions.length < 3) {
      return this.getDefaultTrends();
    }

    // Analyze strength trends
    const strengthTrend = this.analyzeStrengthTrend(sessions);
    
    // Analyze endurance trends
    const enduranceTrend = this.analyzeEnduranceTrend(sessions, progressMetrics);
    
    // Analyze skill trends
    const skillTrend = this.analyzeSkillTrend(sessions);
    
    // Calculate overall trend
    const overallTrend = this.calculateOverallTrend(strengthTrend, enduranceTrend, skillTrend);

    return {
      strength: strengthTrend,
      endurance: enduranceTrend,
      skill: skillTrend,
      overall: overallTrend,
    };
  }

  // Analyze habit formation
  static analyzeHabitFormation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): HabitFormation {
    // Analyze workout habit strength
    const workoutHabit = this.analyzeWorkoutHabit(sessions);
    
    // Analyze recovery habits
    const recoveryHabit = this.analyzeRecoveryHabit(checkIns);
    
    // Analyze goal alignment
    const goalAlignment = this.analyzeGoalAlignment(sessions, checkIns);

    return {
      workoutHabit,
      recoveryHabit,
      goalAlignment,
    };
  }

  // Generate comprehensive behavior insights
  static generateBehaviorInsights(
    sessions: SessionData[],
    checkIns: CheckInData[],
    progressMetrics: ProgressMetrics[]
  ): BehaviorInsights {
    const patterns = this.analyzeWorkoutPatterns(sessions, checkIns);
    const trends = this.analyzePerformanceTrends(sessions, progressMetrics);
    const habits = this.analyzeHabitFormation(sessions, checkIns);
    
    const recommendations = this.generateRecommendations(patterns, trends, habits);
    const riskFactors = this.identifyRiskFactors(patterns, trends, habits);
    const opportunities = this.identifyOpportunities(patterns, trends, habits);

    return {
      patterns,
      trends,
      habits,
      recommendations,
      riskFactors,
      opportunities,
    };
  }

  // Helper methods
  private static analyzeDayPreferences(sessions: SessionData[]): Record<string, number> {
    const dayCounts: Record<string, number> = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    sessions.forEach(session => {
      const day = new Date(session.date).getDay();
      const dayName = dayNames[day];
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    });
    
    return dayCounts;
  }

  private static analyzeTimePreferences(sessions: SessionData[]): Record<string, number> {
    const timeCounts: Record<string, number> = {
      'Morning (6-12)': 0,
      'Afternoon (12-18)': 0,
      'Evening (18-22)': 0,
      'Night (22-6)': 0,
    };
    
    // For now, we'll use session duration as a proxy for time of day
    // In a real implementation, we'd track actual session times
    sessions.forEach(session => {
      if (session.duration < 30) {
        timeCounts['Morning (6-12)']++;
      } else if (session.duration < 60) {
        timeCounts['Afternoon (12-18)']++;
      } else if (session.duration < 90) {
        timeCounts['Evening (18-22)']++;
      } else {
        timeCounts['Night (22-6)']++;
      }
    });
    
    return timeCounts;
  }

  private static calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  private static analyzeExercisePreferences(sessions: SessionData[]): Record<string, number> {
    const counts = { strength: 0, volleyball: 0, conditioning: 0 };
    
    sessions.forEach(session => {
      counts[session.type]++;
    });
    
    return counts;
  }

  private static analyzeIntensityProgression(rpeValues: number[]): 'linear' | 'periodized' | 'random' {
    if (rpeValues.length < 4) return 'random';
    
    // Simple analysis - in a real implementation, we'd use more sophisticated algorithms
    const trend = this.calculateTrend(rpeValues);
    
    if (trend === 'stable') return 'periodized';
    if (trend === 'increasing' || trend === 'decreasing') return 'linear';
    return 'random';
  }

  private static analyzeConsistency(sessions: SessionData[]): {
    weeklyFrequency: number;
    streakLength: number;
    missedSessionRate: number;
  } {
    const completedSessions = sessions.filter(s => s.completed);
    const totalSessions = sessions.length;
    const missedSessions = totalSessions - completedSessions.length;
    
    // Calculate weekly frequency (sessions per week)
    const weeks = this.calculateWeeks(sessions);
    const weeklyFrequency = weeks > 0 ? completedSessions.length / weeks : 0;
    
    // Calculate current streak
    const streakLength = this.calculateCurrentStreak(completedSessions);
    
    // Calculate missed session rate
    const missedSessionRate = totalSessions > 0 ? (missedSessions / totalSessions) * 100 : 0;
    
    return {
      weeklyFrequency: Math.round(weeklyFrequency * 10) / 10,
      streakLength,
      missedSessionRate: Math.round(missedSessionRate * 10) / 10,
    };
  }

  private static analyzeStrengthTrend(sessions: SessionData[]): {
    trend: 'improving' | 'plateau' | 'declining';
    rate: number;
    confidence: number;
  } {
    // Analyze RPE trends as a proxy for strength progression
    const rpeValues = sessions.map(s => s.totalRPE);
    const trend = this.calculateTrend(rpeValues);
    
    // Calculate rate of change
    const firstHalf = rpeValues.slice(0, Math.floor(rpeValues.length / 2));
    const secondHalf = rpeValues.slice(Math.floor(rpeValues.length / 2));
    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
    const rate = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    // Calculate confidence based on data points
    const confidence = Math.min(sessions.length / 10, 1);
    
    return {
      trend: trend === 'increasing' ? 'improving' : trend === 'decreasing' ? 'declining' : 'plateau',
      rate: Math.round(rate * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
    };
  }

  private static analyzeEnduranceTrend(sessions: SessionData[], progressMetrics: ProgressMetrics[]): {
    trend: 'improving' | 'plateau' | 'declining';
    rate: number;
    confidence: number;
  } {
    // Analyze session duration trends as a proxy for endurance
    const durations = sessions.map(s => s.duration);
    const trend = this.calculateTrend(durations);
    
    const firstHalf = durations.slice(0, Math.floor(durations.length / 2));
    const secondHalf = durations.slice(Math.floor(durations.length / 2));
    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
    const rate = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    const confidence = Math.min(sessions.length / 10, 1);
    
    return {
      trend: trend === 'increasing' ? 'improving' : trend === 'decreasing' ? 'declining' : 'plateau',
      rate: Math.round(rate * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
    };
  }

  private static analyzeSkillTrend(sessions: SessionData[]): {
    trend: 'improving' | 'plateau' | 'declining';
    rate: number;
    confidence: number;
  } {
    // Analyze exercise complexity as a proxy for skill development
    const complexityScores = sessions.map(s => s.exercises.length);
    const trend = this.calculateTrend(complexityScores);
    
    const firstHalf = complexityScores.slice(0, Math.floor(complexityScores.length / 2));
    const secondHalf = complexityScores.slice(Math.floor(complexityScores.length / 2));
    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
    const rate = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    const confidence = Math.min(sessions.length / 10, 1);
    
    return {
      trend: trend === 'increasing' ? 'improving' : trend === 'decreasing' ? 'declining' : 'plateau',
      rate: Math.round(rate * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
    };
  }

  private static calculateOverallTrend(
    strength: any,
    endurance: any,
    skill: any
  ): {
    trend: 'improving' | 'plateau' | 'declining';
    rate: number;
    confidence: number;
  } {
    const trends = [strength.trend, endurance.trend, skill.trend];
    const improving = trends.filter(t => t === 'improving').length;
    const declining = trends.filter(t => t === 'declining').length;
    
    let overallTrend: 'improving' | 'plateau' | 'declining' = 'plateau';
    if (improving > declining) overallTrend = 'improving';
    else if (declining > improving) overallTrend = 'declining';
    
    const avgRate = (strength.rate + endurance.rate + skill.rate) / 3;
    const avgConfidence = (strength.confidence + endurance.confidence + skill.confidence) / 3;
    
    return {
      trend: overallTrend,
      rate: Math.round(avgRate * 10) / 10,
      confidence: Math.round(avgConfidence * 100) / 100,
    };
  }

  private static analyzeWorkoutHabit(sessions: SessionData[]): {
    strength: number;
    consistency: number;
    automaticity: number;
  } {
    const completedSessions = sessions.filter(s => s.completed);
    const totalSessions = sessions.length;
    
    // Habit strength based on completion rate
    const strength = totalSessions > 0 ? completedSessions.length / totalSessions : 0;
    
    // Consistency based on regular intervals
    const consistency = this.calculateConsistencyScore(sessions);
    
    // Automaticity based on session duration consistency
    const durations = completedSessions.map(s => s.duration);
    const durationVariance = this.calculateVariance(durations);
    const automaticity = Math.max(0, 1 - (durationVariance / 1000)); // Normalize variance
    
    return {
      strength: Math.round(strength * 100) / 100,
      consistency: Math.round(consistency * 100) / 100,
      automaticity: Math.round(automaticity * 100) / 100,
    };
  }

  private static analyzeRecoveryHabit(checkIns: CheckInData[]): {
    sleepQuality: number;
    nutritionConsistency: number;
    stressManagement: number;
  } {
    if (checkIns.length === 0) {
      return { sleepQuality: 0, nutritionConsistency: 0, stressManagement: 0 };
    }
    
    // Analyze sleep quality (assuming soreness is inversely related to sleep quality)
    const sleepScores = checkIns.map(c => Math.max(0, 10 - c.soreness));
    const sleepQuality = sleepScores.reduce((sum, s) => sum + s, 0) / sleepScores.length / 10;
    
    // Analyze nutrition consistency (assuming energy levels reflect nutrition)
    const energyScores = checkIns.map(c => c.energy / 10);
    const nutritionConsistency = energyScores.reduce((sum, e) => sum + e, 0) / energyScores.length;
    
    // Analyze stress management (assuming mood reflects stress management)
    const moodScores = checkIns.map(c => c.mood / 10);
    const stressManagement = moodScores.reduce((sum, m) => sum + m, 0) / moodScores.length;
    
    return {
      sleepQuality: Math.round(sleepQuality * 100) / 100,
      nutritionConsistency: Math.round(nutritionConsistency * 100) / 100,
      stressManagement: Math.round(stressManagement * 100) / 100,
    };
  }

  private static analyzeGoalAlignment(sessions: SessionData[], checkIns: CheckInData[]): {
    shortTerm: number;
    longTerm: number;
  } {
    // This is a simplified implementation
    // In a real system, we'd compare against actual user goals
    const completedSessions = sessions.filter(s => s.completed);
    const shortTerm = completedSessions.length > 0 ? 0.8 : 0.3; // Placeholder logic
    const longTerm = checkIns.length > 0 ? 0.7 : 0.2; // Placeholder logic
    
    return {
      shortTerm: Math.round(shortTerm * 100) / 100,
      longTerm: Math.round(longTerm * 100) / 100,
    };
  }

  private static generateRecommendations(
    patterns: WorkoutPattern,
    trends: PerformanceTrend,
    habits: HabitFormation
  ): string[] {
    const recommendations: string[] = [];
    
    // Pattern-based recommendations
    if (patterns.consistency.weeklyFrequency < 3) {
      recommendations.push('Try to increase your workout frequency to at least 3 times per week for better results');
    }
    
    if (patterns.consistency.missedSessionRate > 20) {
      recommendations.push('Consider setting more realistic workout goals to improve consistency');
    }
    
    // Trend-based recommendations
    if (trends.overall.trend === 'plateau' && trends.overall.confidence > 0.7) {
      recommendations.push('Your progress has plateaued. Consider changing your routine or increasing intensity');
    }
    
    if (trends.strength.trend === 'declining') {
      recommendations.push('Focus on proper form and consider deloading to prevent injury');
    }
    
    // Habit-based recommendations
    if (habits.workoutHabit.strength < 0.7) {
      recommendations.push('Build a stronger workout habit by starting with shorter, more manageable sessions');
    }
    
    if (habits.recoveryHabit.sleepQuality < 0.6) {
      recommendations.push('Improve your sleep quality to enhance recovery and performance');
    }
    
    return recommendations;
  }

  private static identifyRiskFactors(
    patterns: WorkoutPattern,
    trends: PerformanceTrend,
    habits: HabitFormation
  ): string[] {
    const riskFactors: string[] = [];
    
    if (patterns.intensityPattern.averageRPE > 8.5) {
      riskFactors.push('High training intensity may lead to overtraining');
    }
    
    if (patterns.consistency.missedSessionRate > 30) {
      riskFactors.push('High missed session rate may indicate unrealistic goals');
    }
    
    if (trends.overall.trend === 'declining' && trends.overall.confidence > 0.8) {
      riskFactors.push('Declining performance trend detected');
    }
    
    if (habits.recoveryHabit.sleepQuality < 0.4) {
      riskFactors.push('Poor sleep quality may impact recovery and performance');
    }
    
    return riskFactors;
  }

  private static identifyOpportunities(
    patterns: WorkoutPattern,
    trends: PerformanceTrend,
    habits: HabitFormation
  ): string[] {
    const opportunities: string[] = [];
    
    if (patterns.consistency.weeklyFrequency >= 4 && patterns.consistency.missedSessionRate < 10) {
      opportunities.push('You have excellent consistency! Consider adding more challenging exercises');
    }
    
    if (trends.overall.trend === 'improving' && trends.overall.confidence > 0.8) {
      opportunities.push('Great progress! You might be ready for more advanced training phases');
    }
    
    if (habits.workoutHabit.strength > 0.9) {
      opportunities.push('Strong workout habit established! Consider setting new, challenging goals');
    }
    
    if (patterns.intensityPattern.progression === 'linear' && patterns.intensityPattern.averageRPE < 7) {
      opportunities.push('You can safely increase training intensity for faster progress');
    }
    
    return opportunities;
  }

  private static calculateWeeks(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;
    
    const dates = sessions.map(s => new Date(s.date)).sort((a, b) => a.getTime() - b.getTime());
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    
    const diffTime = lastDate.getTime() - firstDate.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return Math.max(1, diffWeeks);
  }

  private static calculateCurrentStreak(completedSessions: SessionData[]): number {
    if (completedSessions.length === 0) return 0;
    
    const sortedSessions = completedSessions
      .map(s => new Date(s.date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i]);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private static calculateConsistencyScore(sessions: SessionData[]): number {
    if (sessions.length < 2) return 0;
    
    const intervals: number[] = [];
    const sortedSessions = sessions
      .map(s => new Date(s.date))
      .sort((a, b) => a.getTime() - b.getTime());
    
    for (let i = 1; i < sortedSessions.length; i++) {
      const diff = sortedSessions[i].getTime() - sortedSessions[i - 1].getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      intervals.push(days);
    }
    
    const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    const variance = this.calculateVariance(intervals);
    
    // Lower variance = higher consistency
    const consistency = Math.max(0, 1 - (variance / (avgInterval * avgInterval)));
    
    return Math.round(consistency * 100) / 100;
  }

  private static calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
    
    return variance;
  }

  private static getDefaultPattern(): WorkoutPattern {
    return {
      preferredDays: ['Monday', 'Wednesday', 'Friday'],
      preferredTimes: ['Morning (6-12)', 'Afternoon (12-18)'],
      sessionDuration: { average: 60, trend: 'stable' },
      exercisePreferences: { strength: 40, volleyball: 30, conditioning: 30 },
      intensityPattern: { averageRPE: 7, progression: 'linear' },
      consistency: { weeklyFrequency: 3, streakLength: 0, missedSessionRate: 0 },
    };
  }

  private static getDefaultTrends(): PerformanceTrend {
    return {
      strength: { trend: 'plateau', rate: 0, confidence: 0 },
      endurance: { trend: 'plateau', rate: 0, confidence: 0 },
      skill: { trend: 'plateau', rate: 0, confidence: 0 },
      overall: { trend: 'plateau', rate: 0, confidence: 0 },
    };
  }
}
