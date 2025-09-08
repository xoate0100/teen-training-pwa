'use client';

import { DatabaseService, SessionData, CheckInData } from './database-service';

export interface UserEngagementMetrics {
  userId: string;
  sessionFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
    streak: number;
    longestStreak: number;
  };
  sessionDuration: {
    average: number;
    median: number;
    total: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
  featureUsage: {
    feature: string;
    usageCount: number;
    lastUsed: Date;
    frequency: number; // uses per week
    satisfaction: number; // 1-10 scale
  }[];
  appInteraction: {
    dailyActiveMinutes: number;
    weeklyActiveMinutes: number;
    monthlyActiveMinutes: number;
    sessionCount: number;
    bounceRate: number;
  };
  retention: {
    day1: number;
    day7: number;
    day30: number;
    day90: number;
    churnRisk: number; // 0-1 scale
  };
  lastUpdated: Date;
}

export interface PerformanceImprovementTracking {
  userId: string;
  strengthProgress: {
    exercise: string;
    initialWeight: number;
    currentWeight: number;
    improvement: number; // percentage
    progressionRate: number; // weight added per week
    plateauDetected: boolean;
    plateauDuration: number; // days
  }[];
  skillDevelopment: {
    skill: string;
    initialLevel: number;
    currentLevel: number;
    improvement: number; // percentage
    learningRate: number; // level gained per week
    masteryProgress: number; // 0-1 scale
  }[];
  enduranceProgress: {
    exercise: string;
    initialDuration: number;
    currentDuration: number;
    improvement: number; // percentage
    enduranceGain: number; // minutes added per week
  }[];
  overallProgress: {
    totalImprovement: number; // weighted average
    consistency: number; // 0-1 scale
    motivation: number; // average motivation score
    satisfaction: number; // average satisfaction score
  };
  lastUpdated: Date;
}

export interface FeatureUsageAnalysis {
  featureId: string;
  featureName: string;
  totalUsers: number;
  activeUsers: number;
  usageFrequency: number; // uses per user per week
  userSatisfaction: number; // average satisfaction score
  completionRate: number; // percentage of users who complete the feature
  dropoffPoints: {
    step: string;
    dropoffRate: number;
    commonReasons: string[];
  }[];
  performanceMetrics: {
    loadTime: number; // milliseconds
    errorRate: number; // percentage
    crashRate: number; // percentage
    userRating: number; // 1-5 scale
  };
  trends: {
    period: 'daily' | 'weekly' | 'monthly';
    usage: number[];
    satisfaction: number[];
    completion: number[];
  }[];
  lastUpdated: Date;
}

export interface SuccessRateMonitoring {
  metricId: string;
  metricName: string;
  category:
    | 'user_engagement'
    | 'performance'
    | 'retention'
    | 'satisfaction'
    | 'technical';
  currentValue: number;
  targetValue: number;
  successRate: number; // percentage
  trend: 'improving' | 'stable' | 'declining';
  confidence: number; // 0-1 scale
  factors: {
    factor: string;
    impact: number; // -1 to 1 scale
    description: string;
  }[];
  recommendations: {
    action: string;
    priority: 'high' | 'medium' | 'low';
    expectedImpact: number; // percentage improvement
    effort: 'low' | 'medium' | 'high';
  }[];
  lastUpdated: Date;
}

export interface ResearchDataCollection {
  userId: string;
  anonymousId: string;
  performanceData: {
    sessionType: string;
    duration: number;
    intensity: number;
    exercises: string[];
    improvements: number[];
    date: Date;
  }[];
  trainingEffectiveness: {
    program: string;
    phase: string;
    duration: number;
    adherence: number; // percentage
    outcomes: {
      strength: number;
      skill: number;
      endurance: number;
      satisfaction: number;
    };
  }[];
  userSatisfaction: {
    feature: string;
    rating: number; // 1-5 scale
    feedback: string;
    timestamp: Date;
  }[];
  longTermOutcomes: {
    period: '3_months' | '6_months' | '1_year';
    goals: {
      goal: string;
      achieved: boolean;
      progress: number; // percentage
    }[];
    healthMetrics: {
      weight: number;
      bodyFat: number;
      muscleMass: number;
      cardiovascular: number;
    };
    psychologicalMetrics: {
      confidence: number;
      motivation: number;
      stress: number;
      sleep: number;
    };
  }[];
  lastUpdated: Date;
}

export interface ContinuousImprovementLoop {
  loopId: string;
  name: string;
  category: 'feature' | 'performance' | 'user_experience' | 'technical';
  status: 'active' | 'paused' | 'completed' | 'failed';
  metrics: {
    metric: string;
    currentValue: number;
    targetValue: number;
    improvement: number; // percentage
  }[];
  iterations: {
    iteration: number;
    changes: string[];
    results: {
      metric: string;
      before: number;
      after: number;
      improvement: number;
    }[];
    timestamp: Date;
  }[];
  nextActions: {
    action: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
    expectedOutcome: string;
  }[];
  lastUpdated: Date;
}

export class AnalyticsService {
  private databaseService = new DatabaseService();
  private engagementMetrics: Map<string, UserEngagementMetrics> = new Map();
  private performanceTracking: Map<string, PerformanceImprovementTracking> =
    new Map();
  private featureUsage: Map<string, FeatureUsageAnalysis> = new Map();
  private successRates: Map<string, SuccessRateMonitoring> = new Map();
  private researchData: Map<string, ResearchDataCollection> = new Map();
  private improvementLoops: Map<string, ContinuousImprovementLoop> = new Map();
  private analyticsInterval: number | null = null;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    this.startAnalyticsCollection();
    this.loadStoredData();
  }

  // User Engagement Metrics
  async generateUserEngagementMetrics(
    userId: string
  ): Promise<UserEngagementMetrics> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 3) {
        return this.getDefaultEngagementMetrics(userId);
      }

      const metrics = await this.calculateUserEngagementMetrics(
        userId,
        sessions,
        checkIns
      );
      this.engagementMetrics.set(userId, metrics);

      return metrics;
    } catch (error) {
      console.error('Error generating user engagement metrics:', error);
      throw error;
    }
  }

  private async calculateUserEngagementMetrics(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<UserEngagementMetrics> {
    // Calculate session frequency
    const sessionFrequency = this.calculateSessionFrequency(sessions);

    // Calculate session duration metrics
    const sessionDuration = this.calculateSessionDurationMetrics(sessions);

    // Calculate feature usage
    const featureUsage = this.calculateFeatureUsage(sessions, checkIns);

    // Calculate app interaction
    const appInteraction = this.calculateAppInteraction(sessions, checkIns);

    // Calculate retention metrics
    const retention = this.calculateRetentionMetrics(sessions, checkIns);

    return {
      userId,
      sessionFrequency,
      sessionDuration,
      featureUsage,
      appInteraction,
      retention,
      lastUpdated: new Date(),
    };
  }

  private calculateSessionFrequency(
    sessions: SessionData[]
  ): UserEngagementMetrics['sessionFrequency'] {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailySessions = sessions.filter(s => s.date >= oneDayAgo).length;
    const weeklySessions = sessions.filter(s => s.date >= oneWeekAgo).length;
    const monthlySessions = sessions.filter(s => s.date >= oneMonthAgo).length;

    // Calculate current streak
    const sortedSessions = sessions.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      if (lastDate === null) {
        lastDate = sessionDate;
        tempStreak = 1;
        currentStreak = 1;
      } else {
        const daysDiff = Math.floor(
          (lastDate.getTime() - sessionDate.getTime()) / (24 * 60 * 60 * 1000)
        );
        if (daysDiff === 1) {
          tempStreak++;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          if (currentStreak === tempStreak - 1) {
            currentStreak = tempStreak;
          }
        } else if (daysDiff > 1) {
          tempStreak = 1;
        }
        lastDate = sessionDate;
      }
    }

    return {
      daily: dailySessions,
      weekly: weeklySessions,
      monthly: monthlySessions,
      streak: currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
    };
  }

  private calculateSessionDurationMetrics(
    sessions: SessionData[]
  ): UserEngagementMetrics['sessionDuration'] {
    const durations = sessions.map(s => s.duration || 60);
    const total = durations.reduce((sum, d) => sum + d, 0);
    const average = total / durations.length;
    const median = this.calculateMedian(durations);

    // Calculate trend
    const recentSessions = sessions.slice(-10);
    const olderSessions = sessions.slice(-20, -10);

    const recentAvg =
      recentSessions.reduce((sum, s) => sum + (s.duration || 60), 0) /
      recentSessions.length;
    const olderAvg =
      olderSessions.length > 0
        ? olderSessions.reduce((sum, s) => sum + (s.duration || 60), 0) /
          olderSessions.length
        : recentAvg;

    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    if (recentAvg > olderAvg * 1.1) trend = 'increasing';
    else if (recentAvg < olderAvg * 0.9) trend = 'decreasing';

    return {
      average,
      median,
      total,
      trend,
    };
  }

  private calculateFeatureUsage(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): UserEngagementMetrics['featureUsage'] {
    const features = [
      {
        name: 'Session Tracking',
        usageCount: sessions.length,
        lastUsed: sessions[0]?.date,
        frequency: sessions.length / 4,
        satisfaction: 8,
      },
      {
        name: 'Check-ins',
        usageCount: checkIns.length,
        lastUsed: checkIns[0]?.date,
        frequency: checkIns.length / 4,
        satisfaction: 7,
      },
      {
        name: 'Progress Tracking',
        usageCount: sessions.filter(s => s.exercises.length > 0).length,
        lastUsed: sessions[0]?.date,
        frequency: sessions.length / 4,
        satisfaction: 8,
      },
      {
        name: 'Goal Setting',
        usageCount: checkIns.filter(c => c.notes?.includes('goal')).length,
        lastUsed: checkIns[0]?.date,
        frequency: checkIns.length / 8,
        satisfaction: 6,
      },
    ];

    return features.map(feature => ({
      feature: feature.name,
      usageCount: feature.usageCount,
      lastUsed: feature.lastUsed || new Date(),
      frequency: feature.frequency,
      satisfaction: feature.satisfaction,
    }));
  }

  private calculateAppInteraction(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): UserEngagementMetrics['appInteraction'] {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailySessions = sessions.filter(s => s.date >= oneDayAgo);
    const weeklySessions = sessions.filter(s => s.date >= oneWeekAgo);
    const monthlySessions = sessions.filter(s => s.date >= oneMonthAgo);

    const dailyActiveMinutes = dailySessions.reduce(
      (sum, s) => sum + (s.duration || 60),
      0
    );
    const weeklyActiveMinutes = weeklySessions.reduce(
      (sum, s) => sum + (s.duration || 60),
      0
    );
    const monthlyActiveMinutes = monthlySessions.reduce(
      (sum, s) => sum + (s.duration || 60),
      0
    );

    // Calculate bounce rate (sessions less than 5 minutes)
    const shortSessions = sessions.filter(s => (s.duration || 60) < 5).length;
    const bounceRate =
      sessions.length > 0 ? shortSessions / sessions.length : 0;

    return {
      dailyActiveMinutes,
      weeklyActiveMinutes,
      monthlyActiveMinutes,
      sessionCount: sessions.length,
      bounceRate,
    };
  }

  private calculateRetentionMetrics(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): UserEngagementMetrics['retention'] {
    const now = new Date();
    const firstSession = sessions[0]?.date;

    if (!firstSession) {
      return {
        day1: 0,
        day7: 0,
        day30: 0,
        day90: 0,
        churnRisk: 1,
      };
    }

    const daysSinceFirst = Math.floor(
      (now.getTime() - firstSession.getTime()) / (24 * 60 * 60 * 1000)
    );
    const lastSession = sessions[sessions.length - 1]?.date;
    const daysSinceLast = lastSession
      ? Math.floor(
          (now.getTime() - lastSession.getTime()) / (24 * 60 * 60 * 1000)
        )
      : 0;

    // Calculate retention rates (simplified)
    const day1 = daysSinceFirst >= 1 ? 1 : 0;
    const day7 = daysSinceFirst >= 7 ? 1 : 0;
    const day30 = daysSinceFirst >= 30 ? 1 : 0;
    const day90 = daysSinceFirst >= 90 ? 1 : 0;

    // Calculate churn risk based on recent activity
    let churnRisk = 0;
    if (daysSinceLast > 7) churnRisk += 0.3;
    if (daysSinceLast > 14) churnRisk += 0.4;
    if (daysSinceLast > 30) churnRisk += 0.3;
    if (sessions.length < 5) churnRisk += 0.2;

    return {
      day1,
      day7,
      day30,
      day90,
      churnRisk: Math.min(churnRisk, 1),
    };
  }

  private calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private getDefaultEngagementMetrics(userId: string): UserEngagementMetrics {
    return {
      userId,
      sessionFrequency: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        streak: 0,
        longestStreak: 0,
      },
      sessionDuration: {
        average: 0,
        median: 0,
        total: 0,
        trend: 'stable',
      },
      featureUsage: [],
      appInteraction: {
        dailyActiveMinutes: 0,
        weeklyActiveMinutes: 0,
        monthlyActiveMinutes: 0,
        sessionCount: 0,
        bounceRate: 0,
      },
      retention: {
        day1: 0,
        day7: 0,
        day30: 0,
        day90: 0,
        churnRisk: 1,
      },
      lastUpdated: new Date(),
    };
  }

  // Performance Improvement Tracking
  async generatePerformanceImprovementTracking(
    userId: string
  ): Promise<PerformanceImprovementTracking> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 5) {
        return this.getDefaultPerformanceTracking(userId);
      }

      const tracking = await this.calculatePerformanceImprovementTracking(
        userId,
        sessions,
        checkIns
      );
      this.performanceTracking.set(userId, tracking);

      return tracking;
    } catch (error) {
      console.error(
        'Error generating performance improvement tracking:',
        error
      );
      throw error;
    }
  }

  private async calculatePerformanceImprovementTracking(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<PerformanceImprovementTracking> {
    // Calculate strength progress
    const strengthProgress = this.calculateStrengthProgress(sessions);

    // Calculate skill development
    const skillDevelopment = this.calculateSkillDevelopment(sessions, checkIns);

    // Calculate endurance progress
    const enduranceProgress = this.calculateEnduranceProgress(sessions);

    // Calculate overall progress
    const overallProgress = this.calculateOverallProgress(sessions, checkIns);

    return {
      userId,
      strengthProgress,
      skillDevelopment,
      enduranceProgress,
      overallProgress,
      lastUpdated: new Date(),
    };
  }

  private calculateStrengthProgress(
    sessions: SessionData[]
  ): PerformanceImprovementTracking['strengthProgress'] {
    const strengthExercises = [
      'Squats',
      'Push-ups',
      'Plunges',
      'Planks',
      'Burpees',
    ];
    const progress: PerformanceImprovementTracking['strengthProgress'] = [];

    for (const exercise of strengthExercises) {
      const exerciseSessions = sessions.filter(s =>
        s.exercises.some(e =>
          e.name.toLowerCase().includes(exercise.toLowerCase())
        )
      );

      if (exerciseSessions.length < 2) continue;

      const weights = exerciseSessions
        .map(session => {
          const exercise = session.exercises.find(e =>
            e.name.toLowerCase().includes(exercise.toLowerCase())
          );
          return exercise
            ? exercise.sets.reduce((sum, set) => sum + (set.weight || 0), 0) /
                exercise.sets.length
            : 0;
        })
        .filter(w => w > 0);

      if (weights.length < 2) continue;

      const initialWeight = weights[0];
      const currentWeight = weights[weights.length - 1];
      const improvement =
        ((currentWeight - initialWeight) / initialWeight) * 100;

      // Calculate progression rate
      const timeSpan =
        (exerciseSessions[exerciseSessions.length - 1].date.getTime() -
          exerciseSessions[0].date.getTime()) /
        (7 * 24 * 60 * 60 * 1000);
      const progressionRate =
        timeSpan > 0 ? (currentWeight - initialWeight) / timeSpan : 0;

      // Detect plateau (no improvement in last 2 weeks)
      const recentWeights = weights.slice(-4);
      const plateauDetected =
        recentWeights.length >= 2 &&
        Math.abs(recentWeights[recentWeights.length - 1] - recentWeights[0]) <
          recentWeights[0] * 0.05;

      progress.push({
        exercise,
        initialWeight,
        currentWeight,
        improvement,
        progressionRate,
        plateauDetected,
        plateauDuration: plateauDetected ? 14 : 0,
      });
    }

    return progress;
  }

  private calculateSkillDevelopment(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): PerformanceImprovementTracking['skillDevelopment'] {
    const skills = [
      'Volleyball',
      'Plyometric',
      'Coordination',
      'Balance',
      'Flexibility',
    ];
    const development: PerformanceImprovementTracking['skillDevelopment'] = [];

    for (const skill of skills) {
      const skillSessions = sessions.filter(
        s =>
          s.type?.toLowerCase().includes(skill.toLowerCase()) ||
          s.exercises.some(e =>
            e.name.toLowerCase().includes(skill.toLowerCase())
          )
      );

      if (skillSessions.length < 2) continue;

      // Calculate skill level based on session complexity and duration
      const skillLevels = skillSessions.map(session => {
        const duration = session.duration || 60;
        const intensity =
          session.exercises.reduce((sum, exercise) => {
            return (
              sum +
              exercise.sets.reduce(
                (setSum, set) => setSum + (set.rpe || 5),
                0
              ) /
                exercise.sets.length
            );
          }, 0) / session.exercises.length;
        return (duration / 60) * (intensity / 10) * 10; // Scale to 1-10
      });

      const initialLevel = skillLevels[0];
      const currentLevel = skillLevels[skillLevels.length - 1];
      const improvement = ((currentLevel - initialLevel) / initialLevel) * 100;

      // Calculate learning rate
      const timeSpan =
        (skillSessions[skillSessions.length - 1].date.getTime() -
          skillSessions[0].date.getTime()) /
        (7 * 24 * 60 * 60 * 1000);
      const learningRate =
        timeSpan > 0 ? (currentLevel - initialLevel) / timeSpan : 0;

      // Calculate mastery progress
      const masteryProgress = Math.min(currentLevel / 10, 1);

      development.push({
        skill,
        initialLevel,
        currentLevel,
        improvement,
        learningRate,
        masteryProgress,
      });
    }

    return development;
  }

  private calculateEnduranceProgress(
    sessions: SessionData[]
  ): PerformanceImprovementTracking['enduranceProgress'] {
    const enduranceExercises = [
      'Running',
      'Cycling',
      'Swimming',
      'Rowing',
      'Cardio',
    ];
    const progress: PerformanceImprovementTracking['enduranceProgress'] = [];

    for (const exercise of enduranceExercises) {
      const exerciseSessions = sessions.filter(s =>
        s.exercises.some(e =>
          e.name.toLowerCase().includes(exercise.toLowerCase())
        )
      );

      if (exerciseSessions.length < 2) continue;

      const durations = exerciseSessions.map(session => session.duration || 60);
      const initialDuration = durations[0];
      const currentDuration = durations[durations.length - 1];
      const improvement =
        ((currentDuration - initialDuration) / initialDuration) * 100;

      // Calculate endurance gain
      const timeSpan =
        (exerciseSessions[exerciseSessions.length - 1].date.getTime() -
          exerciseSessions[0].date.getTime()) /
        (7 * 24 * 60 * 60 * 1000);
      const enduranceGain =
        timeSpan > 0 ? (currentDuration - initialDuration) / timeSpan : 0;

      progress.push({
        exercise,
        initialDuration,
        currentDuration,
        improvement,
        enduranceGain,
      });
    }

    return progress;
  }

  private calculateOverallProgress(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): PerformanceImprovementTracking['overallProgress'] {
    // Calculate total improvement (weighted average of all metrics)
    const strengthProgress = this.calculateStrengthProgress(sessions);
    const skillDevelopment = this.calculateSkillDevelopment(sessions, checkIns);
    const enduranceProgress = this.calculateEnduranceProgress(sessions);

    const allImprovements = [
      ...strengthProgress.map(s => s.improvement),
      ...skillDevelopment.map(s => s.improvement),
      ...enduranceProgress.map(s => s.improvement),
    ];

    const totalImprovement =
      allImprovements.length > 0
        ? allImprovements.reduce((sum, imp) => sum + imp, 0) /
          allImprovements.length
        : 0;

    // Calculate consistency (based on session frequency and regularity)
    const sessionDates = sessions.map(s => s.date).sort();
    const consistency = this.calculateConsistency(sessionDates);

    // Calculate average motivation
    const motivations = checkIns.map(c => c.motivation || 5);
    const motivation =
      motivations.length > 0
        ? motivations.reduce((sum, m) => sum + m, 0) / motivations.length
        : 5;

    // Calculate average satisfaction (based on check-in ratings)
    const satisfactions = checkIns.map(c => c.rating || 5);
    const satisfaction =
      satisfactions.length > 0
        ? satisfactions.reduce((sum, s) => sum + s, 0) / satisfactions.length
        : 5;

    return {
      totalImprovement,
      consistency,
      motivation,
      satisfaction,
    };
  }

  private calculateConsistency(sessionDates: Date[]): number {
    if (sessionDates.length < 2) return 0;

    const intervals: number[] = [];
    for (let i = 1; i < sessionDates.length; i++) {
      const interval =
        (sessionDates[i].getTime() - sessionDates[i - 1].getTime()) /
        (24 * 60 * 60 * 1000);
      intervals.push(interval);
    }

    const averageInterval =
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const variance =
      intervals.reduce(
        (sum, interval) => sum + Math.pow(interval - averageInterval, 2),
        0
      ) / intervals.length;
    const standardDeviation = Math.sqrt(variance);

    // Consistency is higher when standard deviation is lower
    return Math.max(0, 1 - standardDeviation / averageInterval);
  }

  private getDefaultPerformanceTracking(
    userId: string
  ): PerformanceImprovementTracking {
    return {
      userId,
      strengthProgress: [],
      skillDevelopment: [],
      enduranceProgress: [],
      overallProgress: {
        totalImprovement: 0,
        consistency: 0,
        motivation: 5,
        satisfaction: 5,
      },
      lastUpdated: new Date(),
    };
  }

  // Data persistence
  private loadStoredData(): void {
    try {
      const storedEngagement = localStorage.getItem('engagement_metrics');
      if (storedEngagement) {
        const metrics = JSON.parse(storedEngagement);
        Object.entries(metrics).forEach(([key, value]) => {
          this.engagementMetrics.set(key, {
            ...value,
            lastUpdated: new Date(value.lastUpdated),
          });
        });
      }

      const storedPerformance = localStorage.getItem('performance_tracking');
      if (storedPerformance) {
        const tracking = JSON.parse(storedPerformance);
        Object.entries(tracking).forEach(([key, value]) => {
          this.performanceTracking.set(key, {
            ...value,
            lastUpdated: new Date(value.lastUpdated),
          });
        });
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem(
        'engagement_metrics',
        JSON.stringify(Object.fromEntries(this.engagementMetrics))
      );
      localStorage.setItem(
        'performance_tracking',
        JSON.stringify(Object.fromEntries(this.performanceTracking))
      );
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Public getters
  getUserEngagementMetrics(userId: string): UserEngagementMetrics | null {
    return this.engagementMetrics.get(userId) || null;
  }

  getPerformanceImprovementTracking(
    userId: string
  ): PerformanceImprovementTracking | null {
    return this.performanceTracking.get(userId) || null;
  }

  // Start analytics collection
  private startAnalyticsCollection(): void {
    this.analyticsInterval = setInterval(() => {
      this.performAnalyticsCollection();
    }, 300000); // Every 5 minutes
  }

  private async performAnalyticsCollection(): Promise<void> {
    try {
      const userIds = ['current-user']; // In a real app, this would be dynamic

      for (const userId of userIds) {
        await this.generateUserEngagementMetrics(userId);
        await this.generatePerformanceImprovementTracking(userId);
      }
    } catch (error) {
      console.error('Error in analytics collection:', error);
    }
  }

  // Feature Usage Analysis
  async generateFeatureUsageAnalysis(
    featureId: string
  ): Promise<FeatureUsageAnalysis> {
    try {
      const sessions = await this.databaseService.getSessions('current-user');
      const checkIns = await this.databaseService.getCheckIns('current-user');

      const analysis = await this.calculateFeatureUsageAnalysis(
        featureId,
        sessions,
        checkIns
      );
      this.featureUsage.set(featureId, analysis);

      return analysis;
    } catch (error) {
      console.error('Error generating feature usage analysis:', error);
      throw error;
    }
  }

  private async calculateFeatureUsageAnalysis(
    featureId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<FeatureUsageAnalysis> {
    const featureName = this.getFeatureName(featureId);
    const totalUsers = 1; // In a real app, this would be the total user count
    const activeUsers = this.calculateActiveUsers(
      featureId,
      sessions,
      checkIns
    );
    const usageFrequency = this.calculateUsageFrequency(
      featureId,
      sessions,
      checkIns
    );
    const userSatisfaction = this.calculateUserSatisfaction(
      featureId,
      checkIns
    );
    const completionRate = this.calculateCompletionRate(
      featureId,
      sessions,
      checkIns
    );
    const dropoffPoints = this.calculateDropoffPoints(
      featureId,
      sessions,
      checkIns
    );
    const performanceMetrics = this.calculatePerformanceMetrics(featureId);
    const trends = this.calculateTrends(featureId, sessions, checkIns);

    return {
      featureId,
      featureName,
      totalUsers,
      activeUsers,
      usageFrequency,
      userSatisfaction,
      completionRate,
      dropoffPoints,
      performanceMetrics,
      trends,
      lastUpdated: new Date(),
    };
  }

  private getFeatureName(featureId: string): string {
    const featureNames: Record<string, string> = {
      session_tracking: 'Session Tracking',
      progress_monitoring: 'Progress Monitoring',
      goal_setting: 'Goal Setting',
      social_features: 'Social Features',
      ai_coaching: 'AI Coaching',
      predictive_insights: 'Predictive Insights',
      contextual_intelligence: 'Contextual Intelligence',
      deep_personalization: 'Deep Personalization',
    };
    return featureNames[featureId] || featureId;
  }

  private calculateActiveUsers(
    featureId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Simplified calculation - in a real app, this would track actual user usage
    switch (featureId) {
      case 'session_tracking':
        return sessions.length > 0 ? 1 : 0;
      case 'progress_monitoring':
        return sessions.filter(s => s.exercises.length > 0).length > 0 ? 1 : 0;
      case 'goal_setting':
        return checkIns.filter(c => c.notes?.includes('goal')).length > 0
          ? 1
          : 0;
      case 'social_features':
        return sessions.filter(s => s.type === 'group' || s.type === 'team')
          .length > 0
          ? 1
          : 0;
      default:
        return 1;
    }
  }

  private calculateUsageFrequency(
    featureId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let usageCount = 0;
    switch (featureId) {
      case 'session_tracking':
        usageCount = sessions.filter(s => s.date >= oneWeekAgo).length;
        break;
      case 'progress_monitoring':
        usageCount = sessions.filter(
          s => s.date >= oneWeekAgo && s.exercises.length > 0
        ).length;
        break;
      case 'goal_setting':
        usageCount = checkIns.filter(
          c => c.date >= oneWeekAgo && c.notes?.includes('goal')
        ).length;
        break;
      case 'social_features':
        usageCount = sessions.filter(
          s => s.date >= oneWeekAgo && (s.type === 'group' || s.type === 'team')
        ).length;
        break;
      default:
        usageCount = 1;
    }

    return usageCount;
  }

  private calculateUserSatisfaction(
    featureId: string,
    checkIns: CheckInData[]
  ): number {
    // Simplified calculation based on check-in ratings
    const ratings = checkIns.map(c => c.rating || 5);
    return ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 5;
  }

  private calculateCompletionRate(
    featureId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Simplified calculation - in a real app, this would track actual completion rates
    switch (featureId) {
      case 'session_tracking':
        return sessions.length > 0 ? 0.9 : 0;
      case 'progress_monitoring':
        return (
          sessions.filter(s => s.exercises.length > 0).length /
          Math.max(sessions.length, 1)
        );
      case 'goal_setting':
        return (
          checkIns.filter(c => c.notes?.includes('goal')).length /
          Math.max(checkIns.length, 1)
        );
      case 'social_features':
        return (
          sessions.filter(s => s.type === 'group' || s.type === 'team').length /
          Math.max(sessions.length, 1)
        );
      default:
        return 0.8;
    }
  }

  private calculateDropoffPoints(
    featureId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): FeatureUsageAnalysis['dropoffPoints'] {
    // Simplified dropoff analysis
    return [
      {
        step: 'Initial Setup',
        dropoffRate: 0.1,
        commonReasons: ['Complex setup process', 'Too many options'],
      },
      {
        step: 'First Use',
        dropoffRate: 0.2,
        commonReasons: ['Unclear instructions', 'Poor user experience'],
      },
      {
        step: 'Regular Usage',
        dropoffRate: 0.15,
        commonReasons: ['Lack of motivation', 'Competing priorities'],
      },
    ];
  }

  private calculatePerformanceMetrics(
    featureId: string
  ): FeatureUsageAnalysis['performanceMetrics'] {
    // Simplified performance metrics
    return {
      loadTime: Math.random() * 1000 + 500, // 500-1500ms
      errorRate: Math.random() * 0.05, // 0-5%
      crashRate: Math.random() * 0.01, // 0-1%
      userRating: 3 + Math.random() * 2, // 3-5 scale
    };
  }

  private calculateTrends(
    featureId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): FeatureUsageAnalysis['trends'] {
    // Simplified trend calculation
    const now = new Date();
    const dailyData = [];
    const weeklyData = [];
    const monthlyData = [];

    // Generate mock trend data
    for (let i = 0; i < 7; i++) {
      dailyData.push(Math.random() * 10 + 5);
    }
    for (let i = 0; i < 4; i++) {
      weeklyData.push(Math.random() * 50 + 20);
    }
    for (let i = 0; i < 6; i++) {
      monthlyData.push(Math.random() * 200 + 100);
    }

    return [
      {
        period: 'daily',
        usage: dailyData,
        satisfaction: dailyData.map(() => 3 + Math.random() * 2),
        completion: dailyData.map(() => 0.7 + Math.random() * 0.3),
      },
      {
        period: 'weekly',
        usage: weeklyData,
        satisfaction: weeklyData.map(() => 3 + Math.random() * 2),
        completion: weeklyData.map(() => 0.7 + Math.random() * 0.3),
      },
      {
        period: 'monthly',
        usage: monthlyData,
        satisfaction: monthlyData.map(() => 3 + Math.random() * 2),
        completion: monthlyData.map(() => 0.7 + Math.random() * 0.3),
      },
    ];
  }

  // Success Rate Monitoring
  async generateSuccessRateMonitoring(
    metricId: string
  ): Promise<SuccessRateMonitoring> {
    try {
      const sessions = await this.databaseService.getSessions('current-user');
      const checkIns = await this.databaseService.getCheckIns('current-user');

      const monitoring = await this.calculateSuccessRateMonitoring(
        metricId,
        sessions,
        checkIns
      );
      this.successRates.set(metricId, monitoring);

      return monitoring;
    } catch (error) {
      console.error('Error generating success rate monitoring:', error);
      throw error;
    }
  }

  private async calculateSuccessRateMonitoring(
    metricId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<SuccessRateMonitoring> {
    const metricName = this.getMetricName(metricId);
    const category = this.getMetricCategory(metricId);
    const currentValue = this.calculateCurrentValue(
      metricId,
      sessions,
      checkIns
    );
    const targetValue = this.getTargetValue(metricId);
    const successRate = (currentValue / targetValue) * 100;
    const trend = this.calculateTrend(metricId, sessions, checkIns);
    const confidence = this.calculateConfidence(metricId, sessions, checkIns);
    const factors = this.identifyFactors(metricId, sessions, checkIns);
    const recommendations = this.generateRecommendations(
      metricId,
      currentValue,
      targetValue,
      successRate
    );

    return {
      metricId,
      metricName,
      category,
      currentValue,
      targetValue,
      successRate,
      trend,
      confidence,
      factors,
      recommendations,
      lastUpdated: new Date(),
    };
  }

  private getMetricName(metricId: string): string {
    const metricNames: Record<string, string> = {
      user_engagement: 'User Engagement',
      session_frequency: 'Session Frequency',
      performance_improvement: 'Performance Improvement',
      user_retention: 'User Retention',
      feature_adoption: 'Feature Adoption',
      user_satisfaction: 'User Satisfaction',
      app_performance: 'App Performance',
      data_quality: 'Data Quality',
    };
    return metricNames[metricId] || metricId;
  }

  private getMetricCategory(
    metricId: string
  ): SuccessRateMonitoring['category'] {
    const categories: Record<string, SuccessRateMonitoring['category']> = {
      user_engagement: 'user_engagement',
      session_frequency: 'user_engagement',
      performance_improvement: 'performance',
      user_retention: 'retention',
      feature_adoption: 'user_engagement',
      user_satisfaction: 'satisfaction',
      app_performance: 'technical',
      data_quality: 'technical',
    };
    return categories[metricId] || 'user_engagement';
  }

  private calculateCurrentValue(
    metricId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    switch (metricId) {
      case 'user_engagement':
        return sessions.length > 0 ? 0.8 : 0.2;
      case 'session_frequency':
        return sessions.length / 7; // sessions per week
      case 'performance_improvement':
        return this.calculatePerformanceImprovement(sessions);
      case 'user_retention':
        return this.calculateUserRetention(sessions);
      case 'feature_adoption':
        return 0.7; // 70% adoption rate
      case 'user_satisfaction':
        const ratings = checkIns.map(c => c.rating || 5);
        return ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 5;
      case 'app_performance':
        return 0.95; // 95% uptime
      case 'data_quality':
        return 0.9; // 90% data quality
      default:
        return 0.5;
    }
  }

  private getTargetValue(metricId: string): number {
    const targets: Record<string, number> = {
      user_engagement: 0.8,
      session_frequency: 3, // 3 sessions per week
      performance_improvement: 0.2, // 20% improvement
      user_retention: 0.7, // 70% retention
      feature_adoption: 0.8, // 80% adoption
      user_satisfaction: 4, // 4/5 rating
      app_performance: 0.99, // 99% uptime
      data_quality: 0.95, // 95% data quality
    };
    return targets[metricId] || 1;
  }

  private calculatePerformanceImprovement(sessions: SessionData[]): number {
    if (sessions.length < 2) return 0;

    const recentSessions = sessions.slice(-5);
    const olderSessions = sessions.slice(-10, -5);

    if (olderSessions.length === 0) return 0;

    const recentAvg =
      recentSessions.reduce((sum, s) => sum + (s.duration || 60), 0) /
      recentSessions.length;
    const olderAvg =
      olderSessions.reduce((sum, s) => sum + (s.duration || 60), 0) /
      olderSessions.length;

    return (recentAvg - olderAvg) / olderAvg;
  }

  private calculateUserRetention(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;

    const now = new Date();
    const lastSession = sessions[sessions.length - 1].date;
    const daysSinceLastSession =
      (now.getTime() - lastSession.getTime()) / (24 * 60 * 60 * 1000);

    // Retention decreases with time since last session
    return Math.max(0, 1 - daysSinceLastSession / 30);
  }

  private calculateTrend(
    metricId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SuccessRateMonitoring['trend'] {
    // Simplified trend calculation
    const currentValue = this.calculateCurrentValue(
      metricId,
      sessions,
      checkIns
    );
    const targetValue = this.getTargetValue(metricId);

    if (currentValue >= targetValue * 1.1) return 'improving';
    if (currentValue <= targetValue * 0.9) return 'declining';
    return 'stable';
  }

  private calculateConfidence(
    metricId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Confidence based on data availability and consistency
    const dataPoints = sessions.length + checkIns.length;
    const consistency = this.calculateConsistency(sessions.map(s => s.date));

    return Math.min(1, (dataPoints / 20) * consistency);
  }

  private identifyFactors(
    metricId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SuccessRateMonitoring['factors'] {
    // Simplified factor identification
    return [
      {
        factor: 'User Motivation',
        impact: 0.3,
        description: 'Higher motivation leads to better engagement',
      },
      {
        factor: 'Feature Usability',
        impact: 0.4,
        description: 'Easy-to-use features increase adoption',
      },
      {
        factor: 'Performance Quality',
        impact: 0.2,
        description: 'Good performance improves user satisfaction',
      },
      {
        factor: 'Social Support',
        impact: 0.1,
        description: 'Social features enhance retention',
      },
    ];
  }

  private generateRecommendations(
    metricId: string,
    currentValue: number,
    targetValue: number,
    successRate: number
  ): SuccessRateMonitoring['recommendations'] {
    const recommendations: SuccessRateMonitoring['recommendations'] = [];

    if (successRate < 80) {
      recommendations.push({
        action: 'Improve user onboarding',
        priority: 'high',
        expectedImpact: 15,
        effort: 'medium',
      });
    }

    if (successRate < 60) {
      recommendations.push({
        action: 'Add user feedback system',
        priority: 'high',
        expectedImpact: 20,
        effort: 'low',
      });
    }

    if (successRate < 40) {
      recommendations.push({
        action: 'Redesign core features',
        priority: 'high',
        expectedImpact: 30,
        effort: 'high',
      });
    }

    return recommendations;
  }

  // Additional getters
  getFeatureUsageAnalysis(featureId: string): FeatureUsageAnalysis | null {
    return this.featureUsage.get(featureId) || null;
  }

  getSuccessRateMonitoring(metricId: string): SuccessRateMonitoring | null {
    return this.successRates.get(metricId) || null;
  }

  // Cleanup
  destroy(): void {
    if (this.analyticsInterval) {
      clearInterval(this.analyticsInterval);
    }
    this.saveData();
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
