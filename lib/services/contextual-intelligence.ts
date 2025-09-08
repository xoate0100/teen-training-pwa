'use client';

import { DatabaseService, SessionData, CheckInData } from './database-service';

export interface EnvironmentalContext {
  userId: string;
  location: {
    type: 'home' | 'gym' | 'outdoor' | 'studio' | 'unknown';
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    address?: string;
    timezone: string;
  };
  weather: {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'unknown';
    temperature: number; // Celsius
    humidity: number; // Percentage
    windSpeed: number; // km/h
    airQuality: 'excellent' | 'good' | 'moderate' | 'poor' | 'hazardous';
    uvIndex: number; // 0-11
  };
  timeOfDay: {
    hour: number;
    period: 'early_morning' | 'morning' | 'afternoon' | 'evening' | 'night';
    isWeekend: boolean;
    season: 'spring' | 'summer' | 'autumn' | 'winter';
  };
  lastUpdated: Date;
  confidence: number;
}

export interface TimeBasedOptimization {
  userId: string;
  optimalTrainingTimes: {
    strength: string[]; // Array of optimal time periods
    volleyball: string[];
    plyometric: string[];
    recovery: string[];
  };
  energyPatterns: {
    timeOfDay: Record<string, number>; // Energy level by hour
    dayOfWeek: Record<string, number>; // Energy level by day
    seasonal: Record<string, number>; // Energy level by season
  };
  performancePatterns: {
    timeOfDay: Record<string, number>; // Performance by hour
    dayOfWeek: Record<string, number>; // Performance by day
    seasonal: Record<string, number>; // Performance by season
  };
  adaptationRecommendations: {
    timeAdjustments: string[];
    intensityModifications: string[];
    exerciseSelections: string[];
  };
  lastUpdated: Date;
  confidence: number;
}

export interface SocialContext {
  userId: string;
  socialPresence: {
    isAlone: boolean;
    groupSize: number;
    groupType: 'family' | 'friends' | 'teammates' | 'strangers' | 'mixed';
    socialDynamics: {
      leadership: number; // 0-1 scale
      collaboration: number; // 0-1 scale
      competition: number; // 0-1 scale
      support: number; // 0-1 scale
    };
  };
  socialInfluence: {
    peerPressure: number; // 0-1 scale
    socialMotivation: number; // 0-1 scale
    socialAnxiety: number; // 0-1 scale
    socialSupport: number; // 0-1 scale
  };
  socialPreferences: {
    preferredGroupSize: number;
    preferredGroupType: string;
    socialInteractionLevel: 'low' | 'medium' | 'high';
    socialFeedbackPreference: 'public' | 'private' | 'mixed';
  };
  lastUpdated: Date;
  confidence: number;
}

export interface EmotionalState {
  userId: string;
  currentMood: {
    primary:
      | 'happy'
      | 'sad'
      | 'angry'
      | 'anxious'
      | 'excited'
      | 'calm'
      | 'frustrated'
      | 'motivated'
      | 'tired'
      | 'confident';
    secondary?: string;
    intensity: number; // 0-1 scale
    stability: number; // 0-1 scale
  };
  emotionalTriggers: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  emotionalPatterns: {
    timeOfDay: Record<string, string>; // Mood by hour
    dayOfWeek: Record<string, string>; // Mood by day
    seasonal: Record<string, string>; // Mood by season
    weather: Record<string, string>; // Mood by weather
  };
  emotionalRegulation: {
    copingStrategies: string[];
    stressLevel: number; // 0-1 scale
    resilience: number; // 0-1 scale
    emotionalIntelligence: number; // 0-1 scale
  };
  lastUpdated: Date;
  confidence: number;
}

export interface ContextualInsights {
  userId: string;
  insights: {
    type: 'environmental' | 'temporal' | 'social' | 'emotional' | 'combined';
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
    priority: 'high' | 'medium' | 'low';
    recommendations: string[];
    contextFactors: string[];
  }[];
  lastUpdated: Date;
}

export class ContextualIntelligenceService {
  private databaseService = new DatabaseService();
  private environmentalContexts: Map<string, EnvironmentalContext> = new Map();
  private timeBasedOptimizations: Map<string, TimeBasedOptimization> =
    new Map();
  private socialContexts: Map<string, SocialContext> = new Map();
  private emotionalStates: Map<string, EmotionalState> = new Map();
  private contextualInsights: Map<string, ContextualInsights> = new Map();
  private contextualAnalysisInterval: number | null = null;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    this.startContextualAnalysis();
    this.loadStoredData();
  }

  // Environmental Factor Consideration
  async analyzeEnvironmentalContext(
    userId: string
  ): Promise<EnvironmentalContext> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 3) {
        return this.getDefaultEnvironmentalContext(userId);
      }

      const context = await this.calculateEnvironmentalContext(
        userId,
        sessions,
        checkIns
      );
      this.environmentalContexts.set(userId, context);

      return context;
    } catch (error) {
      console.error('Error analyzing environmental context:', error);
      throw error;
    }
  }

  private async calculateEnvironmentalContext(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<EnvironmentalContext> {
    // Analyze location patterns
    const location = this.analyzeLocationPatterns(sessions, checkIns);

    // Analyze weather patterns
    const weather = this.analyzeWeatherPatterns(sessions, checkIns);

    // Analyze time patterns
    const timeOfDay = this.analyzeTimePatterns(sessions, checkIns);

    const confidence = this.calculateEnvironmentalConfidence(
      sessions,
      checkIns
    );

    return {
      userId,
      location,
      weather,
      timeOfDay,
      lastUpdated: new Date(),
      confidence,
    };
  }

  private analyzeLocationPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): EnvironmentalContext['location'] {
    // Analyze location type based on session data
    const locationTypes = sessions.map(s => s.type || 'unknown');
    const mostCommonType = this.getMostCommonValue(locationTypes);

    // Map session types to location types
    const locationTypeMap: Record<
      string,
      EnvironmentalContext['location']['type']
    > = {
      individual: 'home',
      group: 'gym',
      team: 'gym',
      outdoor: 'outdoor',
      recovery: 'home',
      strength: 'gym',
      volleyball: 'gym',
      plyometric: 'gym',
    };

    return {
      type: locationTypeMap[mostCommonType] || 'unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  private analyzeWeatherPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): EnvironmentalContext['weather'] {
    // Simulate weather analysis based on session data and check-ins
    const weatherMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('weather') ||
        c.notes?.toLowerCase().includes('rain') ||
        c.notes?.toLowerCase().includes('sun') ||
        c.notes?.toLowerCase().includes('wind') ||
        c.notes?.toLowerCase().includes('cold') ||
        c.notes?.toLowerCase().includes('hot')
    ).length;

    const totalCheckIns = checkIns.length;
    const weatherAwareness =
      totalCheckIns > 0 ? weatherMentions / totalCheckIns : 0.3;

    // Simulate weather conditions based on awareness
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'] as const;
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      condition,
      temperature: 20 + Math.random() * 15, // 20-35°C
      humidity: 40 + Math.random() * 40, // 40-80%
      windSpeed: Math.random() * 20, // 0-20 km/h
      airQuality: 'good' as const,
      uvIndex: Math.floor(Math.random() * 8), // 0-7
    };
  }

  private analyzeTimePatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): EnvironmentalContext['timeOfDay'] {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const month = now.getMonth();

    // Determine time period
    let period: EnvironmentalContext['timeOfDay']['period'];
    if (hour < 6) period = 'early_morning';
    else if (hour < 12) period = 'morning';
    else if (hour < 17) period = 'afternoon';
    else if (hour < 21) period = 'evening';
    else period = 'night';

    // Determine season
    let season: EnvironmentalContext['timeOfDay']['season'];
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';

    return {
      hour,
      period,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      season,
    };
  }

  private calculateEnvironmentalConfidence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    const dataPoints = sessions.length + checkIns.length;
    const consistency = this.calculateDataConsistency(sessions, checkIns);
    return Math.min(1, (dataPoints / 10) * consistency);
  }

  private getDefaultEnvironmentalContext(userId: string): EnvironmentalContext {
    return {
      userId,
      location: {
        type: 'home',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      weather: {
        condition: 'unknown',
        temperature: 20,
        humidity: 50,
        windSpeed: 5,
        airQuality: 'good',
        uvIndex: 3,
      },
      timeOfDay: {
        hour: new Date().getHours(),
        period: 'afternoon',
        isWeekend: false,
        season: 'spring',
      },
      lastUpdated: new Date(),
      confidence: 0.3,
    };
  }

  // Time-based Optimization
  async analyzeTimeBasedOptimization(
    userId: string
  ): Promise<TimeBasedOptimization> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 5) {
        return this.getDefaultTimeBasedOptimization(userId);
      }

      const optimization = await this.calculateTimeBasedOptimization(
        userId,
        sessions,
        checkIns
      );
      this.timeBasedOptimizations.set(userId, optimization);

      return optimization;
    } catch (error) {
      console.error('Error analyzing time-based optimization:', error);
      throw error;
    }
  }

  private async calculateTimeBasedOptimization(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<TimeBasedOptimization> {
    // Analyze optimal training times
    const optimalTrainingTimes = this.analyzeOptimalTrainingTimes(
      sessions,
      checkIns
    );

    // Analyze energy patterns
    const energyPatterns = this.analyzeEnergyPatterns(sessions, checkIns);

    // Analyze performance patterns
    const performancePatterns = this.analyzePerformancePatterns(
      sessions,
      checkIns
    );

    // Generate adaptation recommendations
    const adaptationRecommendations = this.generateAdaptationRecommendations(
      optimalTrainingTimes,
      energyPatterns,
      performancePatterns
    );

    const confidence = this.calculateTimeBasedConfidence(sessions, checkIns);

    return {
      userId,
      optimalTrainingTimes,
      energyPatterns,
      performancePatterns,
      adaptationRecommendations,
      lastUpdated: new Date(),
      confidence,
    };
  }

  private analyzeOptimalTrainingTimes(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): TimeBasedOptimization['optimalTrainingTimes'] {
    // Analyze optimal times for each session type
    const sessionTypeTimes = this.groupSessionsByTypeAndTime(sessions);

    const strength = this.findOptimalTimes(sessionTypeTimes.strength || []);
    const volleyball = this.findOptimalTimes(sessionTypeTimes.volleyball || []);
    const plyometric = this.findOptimalTimes(sessionTypeTimes.plyometric || []);
    const recovery = this.findOptimalTimes(sessionTypeTimes.recovery || []);

    return {
      strength,
      volleyball,
      plyometric,
      recovery,
    };
  }

  private groupSessionsByTypeAndTime(
    sessions: SessionData[]
  ): Record<string, SessionData[]> {
    const grouped: Record<string, SessionData[]> = {};

    sessions.forEach(session => {
      const type = session.type || 'unknown';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(session);
    });

    return grouped;
  }

  private findOptimalTimes(sessions: SessionData[]): string[] {
    if (sessions.length === 0) return ['morning', 'afternoon'];

    const hourCounts: Record<number, number> = {};

    sessions.forEach(session => {
      const hour = new Date(session.date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Find hours with highest session counts
    const sortedHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([hour]) => parseInt(hour));

    return sortedHours.map(hour => {
      if (hour < 6) return 'early_morning';
      if (hour < 12) return 'morning';
      if (hour < 17) return 'afternoon';
      if (hour < 21) return 'evening';
      return 'night';
    });
  }

  private analyzeEnergyPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): TimeBasedOptimization['energyPatterns'] {
    // Analyze energy levels by time of day
    const timeOfDay = this.analyzeEnergyByTimeOfDay(sessions, checkIns);

    // Analyze energy levels by day of week
    const dayOfWeek = this.analyzeEnergyByDayOfWeek(sessions, checkIns);

    // Analyze energy levels by season
    const seasonal = this.analyzeEnergyBySeason(sessions, checkIns);

    return {
      timeOfDay,
      dayOfWeek,
      seasonal,
    };
  }

  private analyzeEnergyByTimeOfDay(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, number> {
    const energyByHour: Record<number, number[]> = {};

    sessions.forEach(session => {
      const hour = new Date(session.date).getHours();
      const sessionCheckIn = checkIns.find(
        c =>
          Math.abs(c.date.getTime() - session.date.getTime()) <
          24 * 60 * 60 * 1000
      );

      const energy = sessionCheckIn
        ? (sessionCheckIn.motivation || 5) / 10
        : 0.5;

      if (!energyByHour[hour]) {
        energyByHour[hour] = [];
      }
      energyByHour[hour].push(energy);
    });

    const timeOfDay: Record<string, number> = {};
    const timeSlots = {
      early_morning: [0, 1, 2, 3, 4, 5],
      morning: [6, 7, 8, 9, 10, 11],
      afternoon: [12, 13, 14, 15, 16, 17],
      evening: [18, 19, 20, 21, 22, 23],
      night: [0, 1, 2, 3, 4, 5],
    };

    Object.entries(timeSlots).forEach(([period, hours]) => {
      const periodEnergies: number[] = [];
      hours.forEach(hour => {
        if (energyByHour[hour]) {
          periodEnergies.push(...energyByHour[hour]);
        }
      });

      timeOfDay[period] =
        periodEnergies.length > 0
          ? periodEnergies.reduce((sum, e) => sum + e, 0) /
            periodEnergies.length
          : 0.5;
    });

    return timeOfDay;
  }

  private analyzeEnergyByDayOfWeek(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, number> {
    const energyByDay: Record<number, number[]> = {};

    sessions.forEach(session => {
      const day = new Date(session.date).getDay();
      const sessionCheckIn = checkIns.find(
        c =>
          Math.abs(c.date.getTime() - session.date.getTime()) <
          24 * 60 * 60 * 1000
      );

      const energy = sessionCheckIn
        ? (sessionCheckIn.motivation || 5) / 10
        : 0.5;

      if (!energyByDay[day]) {
        energyByDay[day] = [];
      }
      energyByDay[day].push(energy);
    });

    const dayOfWeek: Record<string, number> = {};
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    dayNames.forEach((dayName, dayIndex) => {
      dayOfWeek[dayName] = energyByDay[dayIndex]
        ? energyByDay[dayIndex].reduce((sum, e) => sum + e, 0) /
          energyByDay[dayIndex].length
        : 0.5;
    });

    return dayOfWeek;
  }

  private analyzeEnergyBySeason(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, number> {
    const energyBySeason: Record<string, number[]> = {};

    sessions.forEach(session => {
      const month = new Date(session.date).getMonth();
      let season: string;

      if (month >= 2 && month <= 4) season = 'spring';
      else if (month >= 5 && month <= 7) season = 'summer';
      else if (month >= 8 && month <= 10) season = 'autumn';
      else season = 'winter';

      const sessionCheckIn = checkIns.find(
        c =>
          Math.abs(c.date.getTime() - session.date.getTime()) <
          24 * 60 * 60 * 1000
      );

      const energy = sessionCheckIn
        ? (sessionCheckIn.motivation || 5) / 10
        : 0.5;

      if (!energyBySeason[season]) {
        energyBySeason[season] = [];
      }
      energyBySeason[season].push(energy);
    });

    const seasonal: Record<string, number> = {};
    const seasons = ['spring', 'summer', 'autumn', 'winter'];

    seasons.forEach(season => {
      seasonal[season] = energyBySeason[season]
        ? energyBySeason[season].reduce((sum, e) => sum + e, 0) /
          energyBySeason[season].length
        : 0.5;
    });

    return seasonal;
  }

  private analyzePerformancePatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): TimeBasedOptimization['performancePatterns'] {
    // Similar to energy patterns but based on actual performance metrics
    const timeOfDay = this.analyzePerformanceByTimeOfDay(sessions, checkIns);
    const dayOfWeek = this.analyzePerformanceByDayOfWeek(sessions, checkIns);
    const seasonal = this.analyzePerformanceBySeason(sessions, checkIns);

    return {
      timeOfDay,
      dayOfWeek,
      seasonal,
    };
  }

  private analyzePerformanceByTimeOfDay(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, number> {
    // Calculate performance based on session duration and intensity
    const performanceByHour: Record<number, number[]> = {};

    sessions.forEach(session => {
      const hour = new Date(session.date).getHours();
      const duration = session.duration || 60;
      const intensity =
        session.exercises.reduce((sum, exercise) => {
          return (
            sum +
            exercise.sets.reduce((setSum, set) => setSum + (set.rpe || 5), 0) /
              exercise.sets.length
          );
        }, 0) / session.exercises.length;

      const performance = (duration / 60) * (intensity / 10); // Normalized performance score

      if (!performanceByHour[hour]) {
        performanceByHour[hour] = [];
      }
      performanceByHour[hour].push(performance);
    });

    const timeOfDay: Record<string, number> = {};
    const timeSlots = {
      early_morning: [0, 1, 2, 3, 4, 5],
      morning: [6, 7, 8, 9, 10, 11],
      afternoon: [12, 13, 14, 15, 16, 17],
      evening: [18, 19, 20, 21, 22, 23],
      night: [0, 1, 2, 3, 4, 5],
    };

    Object.entries(timeSlots).forEach(([period, hours]) => {
      const periodPerformances: number[] = [];
      hours.forEach(hour => {
        if (performanceByHour[hour]) {
          periodPerformances.push(...performanceByHour[hour]);
        }
      });

      timeOfDay[period] =
        periodPerformances.length > 0
          ? periodPerformances.reduce((sum, p) => sum + p, 0) /
            periodPerformances.length
          : 0.5;
    });

    return timeOfDay;
  }

  private analyzePerformanceByDayOfWeek(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, number> {
    const performanceByDay: Record<number, number[]> = {};

    sessions.forEach(session => {
      const day = new Date(session.date).getDay();
      const duration = session.duration || 60;
      const intensity =
        session.exercises.reduce((sum, exercise) => {
          return (
            sum +
            exercise.sets.reduce((setSum, set) => setSum + (set.rpe || 5), 0) /
              exercise.sets.length
          );
        }, 0) / session.exercises.length;

      const performance = (duration / 60) * (intensity / 10);

      if (!performanceByDay[day]) {
        performanceByDay[day] = [];
      }
      performanceByDay[day].push(performance);
    });

    const dayOfWeek: Record<string, number> = {};
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    dayNames.forEach((dayName, dayIndex) => {
      dayOfWeek[dayName] = performanceByDay[dayIndex]
        ? performanceByDay[dayIndex].reduce((sum, p) => sum + p, 0) /
          performanceByDay[dayIndex].length
        : 0.5;
    });

    return dayOfWeek;
  }

  private analyzePerformanceBySeason(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, number> {
    const performanceBySeason: Record<string, number[]> = {};

    sessions.forEach(session => {
      const month = new Date(session.date).getMonth();
      let season: string;

      if (month >= 2 && month <= 4) season = 'spring';
      else if (month >= 5 && month <= 7) season = 'summer';
      else if (month >= 8 && month <= 10) season = 'autumn';
      else season = 'winter';

      const duration = session.duration || 60;
      const intensity =
        session.exercises.reduce((sum, exercise) => {
          return (
            sum +
            exercise.sets.reduce((setSum, set) => setSum + (set.rpe || 5), 0) /
              exercise.sets.length
          );
        }, 0) / session.exercises.length;

      const performance = (duration / 60) * (intensity / 10);

      if (!performanceBySeason[season]) {
        performanceBySeason[season] = [];
      }
      performanceBySeason[season].push(performance);
    });

    const seasonal: Record<string, number> = {};
    const seasons = ['spring', 'summer', 'autumn', 'winter'];

    seasons.forEach(season => {
      seasonal[season] = performanceBySeason[season]
        ? performanceBySeason[season].reduce((sum, p) => sum + p, 0) /
          performanceBySeason[season].length
        : 0.5;
    });

    return seasonal;
  }

  private generateAdaptationRecommendations(
    optimalTrainingTimes: TimeBasedOptimization['optimalTrainingTimes'],
    energyPatterns: TimeBasedOptimization['energyPatterns'],
    performancePatterns: TimeBasedOptimization['performancePatterns']
  ): TimeBasedOptimization['adaptationRecommendations'] {
    const timeAdjustments: string[] = [];
    const intensityModifications: string[] = [];
    const exerciseSelections: string[] = [];

    // Generate time-based recommendations
    Object.entries(optimalTrainingTimes).forEach(([type, times]) => {
      if (times.length > 0) {
        timeAdjustments.push(
          `Schedule ${type} sessions during ${times.join(' and ')} for optimal performance`
        );
      }
    });

    // Generate intensity recommendations based on energy patterns
    const avgEnergy =
      Object.values(energyPatterns.timeOfDay).reduce((sum, e) => sum + e, 0) /
      Object.values(energyPatterns.timeOfDay).length;
    if (avgEnergy > 0.7) {
      intensityModifications.push(
        'High energy periods detected - consider increasing training intensity'
      );
    } else if (avgEnergy < 0.4) {
      intensityModifications.push(
        'Low energy periods detected - consider reducing training intensity or adding recovery sessions'
      );
    }

    // Generate exercise selection recommendations
    const highPerformanceTimes = Object.entries(performancePatterns.timeOfDay)
      .filter(([, performance]) => performance > 0.7)
      .map(([time]) => time);

    if (highPerformanceTimes.length > 0) {
      exerciseSelections.push(
        `Focus on challenging exercises during ${highPerformanceTimes.join(' and ')}`
      );
    }

    return {
      timeAdjustments,
      intensityModifications,
      exerciseSelections,
    };
  }

  private calculateTimeBasedConfidence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    const dataPoints = sessions.length + checkIns.length;
    const consistency = this.calculateDataConsistency(sessions, checkIns);
    return Math.min(1, (dataPoints / 15) * consistency);
  }

  private getDefaultTimeBasedOptimization(
    userId: string
  ): TimeBasedOptimization {
    return {
      userId,
      optimalTrainingTimes: {
        strength: ['morning', 'afternoon'],
        volleyball: ['afternoon', 'evening'],
        plyometric: ['morning'],
        recovery: ['evening'],
      },
      energyPatterns: {
        timeOfDay: {
          early_morning: 0.3,
          morning: 0.7,
          afternoon: 0.8,
          evening: 0.6,
          night: 0.4,
        },
        dayOfWeek: {
          monday: 0.6,
          tuesday: 0.7,
          wednesday: 0.8,
          thursday: 0.7,
          friday: 0.6,
          saturday: 0.9,
          sunday: 0.5,
        },
        seasonal: { spring: 0.7, summer: 0.8, autumn: 0.6, winter: 0.5 },
      },
      performancePatterns: {
        timeOfDay: {
          early_morning: 0.4,
          morning: 0.7,
          afternoon: 0.8,
          evening: 0.6,
          night: 0.3,
        },
        dayOfWeek: {
          monday: 0.6,
          tuesday: 0.7,
          wednesday: 0.8,
          thursday: 0.7,
          friday: 0.6,
          saturday: 0.9,
          sunday: 0.5,
        },
        seasonal: { spring: 0.7, summer: 0.8, autumn: 0.6, winter: 0.5 },
      },
      adaptationRecommendations: {
        timeAdjustments: ['Schedule training during peak energy hours'],
        intensityModifications: [
          'Adjust intensity based on daily energy levels',
        ],
        exerciseSelections: [
          'Select exercises based on time of day performance',
        ],
      },
      lastUpdated: new Date(),
      confidence: 0.3,
    };
  }

  // Helper methods
  private getMostCommonValue<T>(array: T[]): T {
    const counts: Record<string, number> = {};
    array.forEach(item => {
      const key = String(item);
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0][0] as T;
  }

  private calculateDataConsistency(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    if (sessions.length < 3) return 0.5;

    const durations = sessions.map(s => s.duration || 60);
    const avgDuration =
      durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const variance =
      durations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) /
      durations.length;
    const coefficient = Math.sqrt(variance) / avgDuration;

    return Math.max(0, 1 - coefficient);
  }

  // Data persistence
  private loadStoredData(): void {
    try {
      const storedEnvironmental = localStorage.getItem(
        'environmental_contexts'
      );
      if (storedEnvironmental) {
        const contexts = JSON.parse(storedEnvironmental);
        Object.entries(contexts).forEach(([key, value]) => {
          this.environmentalContexts.set(key, {
            ...value,
            lastUpdated: new Date(value.lastUpdated),
          });
        });
      }

      const storedTimeBased = localStorage.getItem('time_based_optimizations');
      if (storedTimeBased) {
        const optimizations = JSON.parse(storedTimeBased);
        Object.entries(optimizations).forEach(([key, value]) => {
          this.timeBasedOptimizations.set(key, {
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
        'environmental_contexts',
        JSON.stringify(Object.fromEntries(this.environmentalContexts))
      );
      localStorage.setItem(
        'time_based_optimizations',
        JSON.stringify(Object.fromEntries(this.timeBasedOptimizations))
      );
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Public getters
  getEnvironmentalContext(userId: string): EnvironmentalContext | null {
    return this.environmentalContexts.get(userId) || null;
  }

  getTimeBasedOptimization(userId: string): TimeBasedOptimization | null {
    return this.timeBasedOptimizations.get(userId) || null;
  }

  // Start contextual analysis
  private startContextualAnalysis(): void {
    this.contextualAnalysisInterval = setInterval(() => {
      this.performContextualAnalysis();
    }, 300000); // Every 5 minutes
  }

  private async performContextualAnalysis(): Promise<void> {
    try {
      const userIds = ['current-user']; // In a real app, this would be dynamic

      for (const userId of userIds) {
        await this.analyzeEnvironmentalContext(userId);
        await this.analyzeTimeBasedOptimization(userId);
      }
    } catch (error) {
      console.error('Error in contextual analysis:', error);
    }
  }

  // Social Context Awareness
  async analyzeSocialContext(userId: string): Promise<SocialContext> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 3) {
        return this.getDefaultSocialContext(userId);
      }

      const context = await this.calculateSocialContext(
        userId,
        sessions,
        checkIns
      );
      this.socialContexts.set(userId, context);

      return context;
    } catch (error) {
      console.error('Error analyzing social context:', error);
      throw error;
    }
  }

  private async calculateSocialContext(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<SocialContext> {
    // Analyze social presence
    const socialPresence = this.analyzeSocialPresence(sessions, checkIns);

    // Analyze social influence
    const socialInfluence = this.analyzeSocialInfluence(sessions, checkIns);

    // Analyze social preferences
    const socialPreferences = this.analyzeSocialPreferences(sessions, checkIns);

    const confidence = this.calculateSocialConfidence(sessions, checkIns);

    return {
      userId,
      socialPresence,
      socialInfluence,
      socialPreferences,
      lastUpdated: new Date(),
      confidence,
    };
  }

  private analyzeSocialPresence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SocialContext['socialPresence'] {
    // Analyze group vs individual sessions
    const groupSessions = sessions.filter(
      s => s.type === 'group' || s.type === 'team'
    ).length;
    const individualSessions = sessions.filter(
      s => s.type === 'individual' || s.type === 'solo'
    ).length;
    const totalSessions = sessions.length;

    const isAlone = individualSessions > groupSessions;
    const groupSize = isAlone
      ? 1
      : Math.max(2, Math.floor(Math.random() * 5) + 2);

    // Determine group type based on session data
    let groupType: SocialContext['socialPresence']['groupType'] = 'mixed';
    if (groupSessions > 0) {
      const teamSessions = sessions.filter(s => s.type === 'team').length;
      const groupOnlySessions = sessions.filter(s => s.type === 'group').length;

      if (teamSessions > groupOnlySessions) {
        groupType = 'teammates';
      } else if (groupOnlySessions > 0) {
        groupType = 'friends';
      }
    }

    // Analyze social dynamics
    const socialDynamics = this.analyzeSocialDynamics(sessions, checkIns);

    return {
      isAlone,
      groupSize: isAlone ? 1 : groupSize,
      groupType,
      socialDynamics,
    };
  }

  private analyzeSocialDynamics(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SocialContext['socialPresence']['socialDynamics'] {
    // Analyze leadership patterns
    const leadership = this.analyzeLeadershipPatterns(sessions, checkIns);

    // Analyze collaboration patterns
    const collaboration = this.analyzeCollaborationPatterns(sessions, checkIns);

    // Analyze competition patterns
    const competition = this.analyzeCompetitionPatterns(sessions, checkIns);

    // Analyze support patterns
    const support = this.analyzeSupportPatterns(sessions, checkIns);

    return {
      leadership,
      collaboration,
      competition,
      support,
    };
  }

  private analyzeLeadershipPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze leadership based on session notes and check-ins
    const leadershipMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('lead') ||
        c.notes?.toLowerCase().includes('guide') ||
        c.notes?.toLowerCase().includes('teach') ||
        c.notes?.toLowerCase().includes('instruct')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? leadershipMentions / totalCheckIns : 0.3;
  }

  private analyzeCollaborationPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze collaboration based on group sessions and notes
    const groupSessions = sessions.filter(
      s => s.type === 'group' || s.type === 'team'
    ).length;
    const collaborationMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('team') ||
        c.notes?.toLowerCase().includes('together') ||
        c.notes?.toLowerCase().includes('partner') ||
        c.notes?.toLowerCase().includes('collaborate')
    ).length;

    const totalSessions = sessions.length;
    const totalCheckIns = checkIns.length;

    const sessionRatio = totalSessions > 0 ? groupSessions / totalSessions : 0;
    const checkInRatio =
      totalCheckIns > 0 ? collaborationMentions / totalCheckIns : 0;

    return (sessionRatio + checkInRatio) / 2;
  }

  private analyzeCompetitionPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze competition based on session types and notes
    const competitiveSessions = sessions.filter(s =>
      s.exercises.some(
        ex =>
          ex.name.toLowerCase().includes('competition') ||
          ex.name.toLowerCase().includes('race') ||
          ex.name.toLowerCase().includes('challenge')
      )
    ).length;

    const competitionMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('compete') ||
        c.notes?.toLowerCase().includes('win') ||
        c.notes?.toLowerCase().includes('beat') ||
        c.notes?.toLowerCase().includes('score')
    ).length;

    const totalSessions = sessions.length;
    const totalCheckIns = checkIns.length;

    const sessionRatio =
      totalSessions > 0 ? competitiveSessions / totalSessions : 0;
    const checkInRatio =
      totalCheckIns > 0 ? competitionMentions / totalCheckIns : 0;

    return (sessionRatio + checkInRatio) / 2;
  }

  private analyzeSupportPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze support patterns based on notes and session types
    const supportMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('support') ||
        c.notes?.toLowerCase().includes('help') ||
        c.notes?.toLowerCase().includes('encourage') ||
        c.notes?.toLowerCase().includes('motivate')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? supportMentions / totalCheckIns : 0.4;
  }

  private analyzeSocialInfluence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SocialContext['socialInfluence'] {
    // Analyze peer pressure
    const peerPressure = this.analyzePeerPressure(sessions, checkIns);

    // Analyze social motivation
    const socialMotivation = this.analyzeSocialMotivation(sessions, checkIns);

    // Analyze social anxiety
    const socialAnxiety = this.analyzeSocialAnxiety(sessions, checkIns);

    // Analyze social support
    const socialSupport = this.analyzeSocialSupport(sessions, checkIns);

    return {
      peerPressure,
      socialMotivation,
      socialAnxiety,
      socialSupport,
    };
  }

  private analyzePeerPressure(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze peer pressure based on notes and session patterns
    const pressureMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('pressure') ||
        c.notes?.toLowerCase().includes('expect') ||
        c.notes?.toLowerCase().includes('should') ||
        c.notes?.toLowerCase().includes('must')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? pressureMentions / totalCheckIns : 0.2;
  }

  private analyzeSocialMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze social motivation based on group sessions and notes
    const groupSessions = sessions.filter(
      s => s.type === 'group' || s.type === 'team'
    ).length;
    const socialMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('friend') ||
        c.notes?.toLowerCase().includes('group') ||
        c.notes?.toLowerCase().includes('team') ||
        c.notes?.toLowerCase().includes('social')
    ).length;

    const totalSessions = sessions.length;
    const totalCheckIns = checkIns.length;

    const sessionRatio = totalSessions > 0 ? groupSessions / totalSessions : 0;
    const checkInRatio = totalCheckIns > 0 ? socialMentions / totalCheckIns : 0;

    return (sessionRatio + checkInRatio) / 2;
  }

  private analyzeSocialAnxiety(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze social anxiety based on notes and session patterns
    const anxietyMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('anxious') ||
        c.notes?.toLowerCase().includes('nervous') ||
        c.notes?.toLowerCase().includes('worried') ||
        c.notes?.toLowerCase().includes('uncomfortable')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? anxietyMentions / totalCheckIns : 0.1;
  }

  private analyzeSocialSupport(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze social support based on notes and session types
    const supportMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('support') ||
        c.notes?.toLowerCase().includes('help') ||
        c.notes?.toLowerCase().includes('encourage') ||
        c.notes?.toLowerCase().includes('motivate')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? supportMentions / totalCheckIns : 0.4;
  }

  private analyzeSocialPreferences(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SocialContext['socialPreferences'] {
    // Analyze preferred group size
    const groupSessions = sessions.filter(
      s => s.type === 'group' || s.type === 'team'
    );
    const preferredGroupSize =
      groupSessions.length > 0 ? Math.floor(Math.random() * 4) + 2 : 1;

    // Analyze preferred group type
    const teamSessions = sessions.filter(s => s.type === 'team').length;
    const groupOnlySessions = sessions.filter(s => s.type === 'group').length;
    const preferredGroupType =
      teamSessions > groupOnlySessions ? 'teammates' : 'friends';

    // Analyze social interaction level
    const socialMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('social') ||
        c.notes?.toLowerCase().includes('interact') ||
        c.notes?.toLowerCase().includes('talk') ||
        c.notes?.toLowerCase().includes('chat')
    ).length;

    const totalCheckIns = checkIns.length;
    const socialRatio =
      totalCheckIns > 0 ? socialMentions / totalCheckIns : 0.3;

    let socialInteractionLevel: SocialContext['socialPreferences']['socialInteractionLevel'];
    if (socialRatio > 0.6) socialInteractionLevel = 'high';
    else if (socialRatio > 0.3) socialInteractionLevel = 'medium';
    else socialInteractionLevel = 'low';

    // Analyze social feedback preference
    const publicMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('share') ||
        c.notes?.toLowerCase().includes('post') ||
        c.notes?.toLowerCase().includes('public')
    ).length;

    const privateMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('private') ||
        c.notes?.toLowerCase().includes('personal') ||
        c.notes?.toLowerCase().includes('alone')
    ).length;

    let socialFeedbackPreference: SocialContext['socialPreferences']['socialFeedbackPreference'];
    if (publicMentions > privateMentions) socialFeedbackPreference = 'public';
    else if (privateMentions > publicMentions)
      socialFeedbackPreference = 'private';
    else socialFeedbackPreference = 'mixed';

    return {
      preferredGroupSize,
      preferredGroupType,
      socialInteractionLevel,
      socialFeedbackPreference,
    };
  }

  private calculateSocialConfidence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    const dataPoints = sessions.length + checkIns.length;
    const consistency = this.calculateDataConsistency(sessions, checkIns);
    return Math.min(1, (dataPoints / 10) * consistency);
  }

  private getDefaultSocialContext(userId: string): SocialContext {
    return {
      userId,
      socialPresence: {
        isAlone: true,
        groupSize: 1,
        groupType: 'mixed',
        socialDynamics: {
          leadership: 0.3,
          collaboration: 0.4,
          competition: 0.2,
          support: 0.4,
        },
      },
      socialInfluence: {
        peerPressure: 0.2,
        socialMotivation: 0.4,
        socialAnxiety: 0.1,
        socialSupport: 0.4,
      },
      socialPreferences: {
        preferredGroupSize: 2,
        preferredGroupType: 'friends',
        socialInteractionLevel: 'medium',
        socialFeedbackPreference: 'mixed',
      },
      lastUpdated: new Date(),
      confidence: 0.3,
    };
  }

  // Emotional State Integration
  async analyzeEmotionalState(userId: string): Promise<EmotionalState> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 3) {
        return this.getDefaultEmotionalState(userId);
      }

      const state = await this.calculateEmotionalState(
        userId,
        sessions,
        checkIns
      );
      this.emotionalStates.set(userId, state);

      return state;
    } catch (error) {
      console.error('Error analyzing emotional state:', error);
      throw error;
    }
  }

  private async calculateEmotionalState(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<EmotionalState> {
    // Analyze current mood
    const currentMood = this.analyzeCurrentMood(sessions, checkIns);

    // Analyze emotional triggers
    const emotionalTriggers = this.analyzeEmotionalTriggers(sessions, checkIns);

    // Analyze emotional patterns
    const emotionalPatterns = this.analyzeEmotionalPatterns(sessions, checkIns);

    // Analyze emotional regulation
    const emotionalRegulation = this.analyzeEmotionalRegulation(
      sessions,
      checkIns
    );

    const confidence = this.calculateEmotionalConfidence(sessions, checkIns);

    return {
      userId,
      currentMood,
      emotionalTriggers,
      emotionalPatterns,
      emotionalRegulation,
      lastUpdated: new Date(),
      confidence,
    };
  }

  private analyzeCurrentMood(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): EmotionalState['currentMood'] {
    // Analyze mood from recent check-ins
    const recentCheckIns = checkIns.slice(-5);
    if (recentCheckIns.length === 0) {
      return {
        primary: 'calm',
        intensity: 0.5,
        stability: 0.5,
      };
    }

    // Analyze mood from notes
    const moodKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'awesome', 'amazing'],
      sad: ['sad', 'down', 'depressed', 'blue', 'low'],
      angry: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense'],
      excited: ['excited', 'pumped', 'energized', 'thrilled'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene'],
      frustrated: ['frustrated', 'annoyed', 'irritated', 'bothered'],
      motivated: ['motivated', 'inspired', 'determined', 'focused'],
      tired: ['tired', 'exhausted', 'drained', 'fatigued'],
      confident: ['confident', 'proud', 'strong', 'capable'],
    };

    const moodCounts: Record<string, number> = {};
    recentCheckIns.forEach(checkIn => {
      if (checkIn.notes) {
        const notes = checkIn.notes.toLowerCase();
        Object.entries(moodKeywords).forEach(([mood, keywords]) => {
          keywords.forEach(keyword => {
            if (notes.includes(keyword)) {
              moodCounts[mood] = (moodCounts[mood] || 0) + 1;
            }
          });
        });
      }
    });

    // Determine primary mood
    const primaryMood =
      (Object.entries(moodCounts).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0] as EmotionalState['currentMood']['primary']) || 'calm';

    // Calculate intensity based on motivation levels
    const avgMotivation =
      recentCheckIns.reduce((sum, c) => sum + (c.motivation || 5), 0) /
      recentCheckIns.length;
    const intensity = avgMotivation / 10;

    // Calculate stability based on mood consistency
    const moodValues = recentCheckIns.map(c => c.mood || 'neutral');
    const uniqueMoods = new Set(moodValues);
    const stability =
      1 - (uniqueMoods.size - 1) / Math.max(1, moodValues.length - 1);

    return {
      primary: primaryMood,
      intensity,
      stability,
    };
  }

  private analyzeEmotionalTriggers(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): EmotionalState['emotionalTriggers'] {
    // Analyze positive triggers
    const positiveTriggers = this.identifyPositiveTriggers(sessions, checkIns);

    // Analyze negative triggers
    const negativeTriggers = this.identifyNegativeTriggers(sessions, checkIns);

    // Analyze neutral triggers
    const neutralTriggers = this.identifyNeutralTriggers(sessions, checkIns);

    return {
      positive: positiveTriggers,
      negative: negativeTriggers,
      neutral: neutralTriggers,
    };
  }

  private identifyPositiveTriggers(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): string[] {
    const triggers: string[] = [];

    // Analyze high motivation sessions
    const highMotivationSessions = checkIns.filter(
      c => (c.motivation || 5) > 7
    );

    highMotivationSessions.forEach(checkIn => {
      if (checkIn.notes?.toLowerCase().includes('music'))
        triggers.push('music');
      if (checkIn.notes?.toLowerCase().includes('friend'))
        triggers.push('social_support');
      if (checkIn.notes?.toLowerCase().includes('goal'))
        triggers.push('goal_achievement');
      if (checkIn.notes?.toLowerCase().includes('progress'))
        triggers.push('progress_visible');
      if (checkIn.notes?.toLowerCase().includes('sun'))
        triggers.push('sunny_weather');
      if (checkIn.notes?.toLowerCase().includes('morning'))
        triggers.push('morning_time');
    });

    return [...new Set(triggers)];
  }

  private identifyNegativeTriggers(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): string[] {
    const triggers: string[] = [];

    // Analyze low motivation sessions
    const lowMotivationSessions = checkIns.filter(c => (c.motivation || 5) < 4);

    lowMotivationSessions.forEach(checkIn => {
      if (checkIn.notes?.toLowerCase().includes('tired'))
        triggers.push('fatigue');
      if (checkIn.notes?.toLowerCase().includes('stress'))
        triggers.push('stress');
      if (checkIn.notes?.toLowerCase().includes('bored'))
        triggers.push('monotony');
      if (checkIn.notes?.toLowerCase().includes('difficult'))
        triggers.push('difficulty');
      if (checkIn.notes?.toLowerCase().includes('rain'))
        triggers.push('bad_weather');
      if (checkIn.notes?.toLowerCase().includes('night'))
        triggers.push('late_time');
    });

    return [...new Set(triggers)];
  }

  private identifyNeutralTriggers(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): string[] {
    const triggers: string[] = [];

    // Analyze medium motivation sessions
    const mediumMotivationSessions = checkIns.filter(c => {
      const motivation = c.motivation || 5;
      return motivation >= 4 && motivation <= 7;
    });

    mediumMotivationSessions.forEach(checkIn => {
      if (checkIn.notes?.toLowerCase().includes('routine'))
        triggers.push('routine');
      if (checkIn.notes?.toLowerCase().includes('schedule'))
        triggers.push('scheduled_time');
      if (checkIn.notes?.toLowerCase().includes('habit'))
        triggers.push('habit_formation');
      if (checkIn.notes?.toLowerCase().includes('indoor'))
        triggers.push('indoor_environment');
    });

    return [...new Set(triggers)];
  }

  private analyzeEmotionalPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): EmotionalState['emotionalPatterns'] {
    // Analyze mood by time of day
    const timeOfDay = this.analyzeMoodByTimeOfDay(sessions, checkIns);

    // Analyze mood by day of week
    const dayOfWeek = this.analyzeMoodByDayOfWeek(sessions, checkIns);

    // Analyze mood by season
    const seasonal = this.analyzeMoodBySeason(sessions, checkIns);

    // Analyze mood by weather
    const weather = this.analyzeMoodByWeather(sessions, checkIns);

    return {
      timeOfDay,
      dayOfWeek,
      seasonal,
      weather,
    };
  }

  private analyzeMoodByTimeOfDay(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, string> {
    const moodByHour: Record<number, string[]> = {};

    checkIns.forEach(checkIn => {
      const hour = new Date(checkIn.date).getHours();
      const mood = checkIn.mood || 'neutral';

      if (!moodByHour[hour]) {
        moodByHour[hour] = [];
      }
      moodByHour[hour].push(mood);
    });

    const timeOfDay: Record<string, string> = {};
    const timeSlots = {
      early_morning: [0, 1, 2, 3, 4, 5],
      morning: [6, 7, 8, 9, 10, 11],
      afternoon: [12, 13, 14, 15, 16, 17],
      evening: [18, 19, 20, 21, 22, 23],
      night: [0, 1, 2, 3, 4, 5],
    };

    Object.entries(timeSlots).forEach(([period, hours]) => {
      const periodMoods: string[] = [];
      hours.forEach(hour => {
        if (moodByHour[hour]) {
          periodMoods.push(...moodByHour[hour]);
        }
      });

      timeOfDay[period] =
        periodMoods.length > 0
          ? this.getMostCommonValue(periodMoods)
          : 'neutral';
    });

    return timeOfDay;
  }

  private analyzeMoodByDayOfWeek(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, string> {
    const moodByDay: Record<number, string[]> = {};

    checkIns.forEach(checkIn => {
      const day = new Date(checkIn.date).getDay();
      const mood = checkIn.mood || 'neutral';

      if (!moodByDay[day]) {
        moodByDay[day] = [];
      }
      moodByDay[day].push(mood);
    });

    const dayOfWeek: Record<string, string> = {};
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    dayNames.forEach((dayName, dayIndex) => {
      dayOfWeek[dayName] = moodByDay[dayIndex]
        ? this.getMostCommonValue(moodByDay[dayIndex])
        : 'neutral';
    });

    return dayOfWeek;
  }

  private analyzeMoodBySeason(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, string> {
    const moodBySeason: Record<string, string[]> = {};

    checkIns.forEach(checkIn => {
      const month = new Date(checkIn.date).getMonth();
      let season: string;

      if (month >= 2 && month <= 4) season = 'spring';
      else if (month >= 5 && month <= 7) season = 'summer';
      else if (month >= 8 && month <= 10) season = 'autumn';
      else season = 'winter';

      const mood = checkIn.mood || 'neutral';

      if (!moodBySeason[season]) {
        moodBySeason[season] = [];
      }
      moodBySeason[season].push(mood);
    });

    const seasonal: Record<string, string> = {};
    const seasons = ['spring', 'summer', 'autumn', 'winter'];

    seasons.forEach(season => {
      seasonal[season] = moodBySeason[season]
        ? this.getMostCommonValue(moodBySeason[season])
        : 'neutral';
    });

    return seasonal;
  }

  private analyzeMoodByWeather(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, string> {
    // Simulate weather-based mood analysis
    const weather: Record<string, string> = {
      sunny: 'happy',
      cloudy: 'neutral',
      rainy: 'sad',
      snowy: 'calm',
      windy: 'anxious',
    };

    return weather;
  }

  private analyzeEmotionalRegulation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): EmotionalState['emotionalRegulation'] {
    // Analyze coping strategies
    const copingStrategies = this.identifyCopingStrategies(sessions, checkIns);

    // Analyze stress level
    const stressLevel = this.calculateStressLevel(sessions, checkIns);

    // Analyze resilience
    const resilience = this.calculateResilience(sessions, checkIns);

    // Analyze emotional intelligence
    const emotionalIntelligence = this.calculateEmotionalIntelligence(
      sessions,
      checkIns
    );

    return {
      copingStrategies,
      stressLevel,
      resilience,
      emotionalIntelligence,
    };
  }

  private identifyCopingStrategies(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): string[] {
    const strategies: string[] = [];

    checkIns.forEach(checkIn => {
      if (checkIn.notes?.toLowerCase().includes('breath'))
        strategies.push('breathing_exercises');
      if (checkIn.notes?.toLowerCase().includes('music'))
        strategies.push('music_therapy');
      if (checkIn.notes?.toLowerCase().includes('walk'))
        strategies.push('physical_activity');
      if (checkIn.notes?.toLowerCase().includes('talk'))
        strategies.push('social_support');
      if (checkIn.notes?.toLowerCase().includes('meditate'))
        strategies.push('meditation');
      if (checkIn.notes?.toLowerCase().includes('journal'))
        strategies.push('journaling');
    });

    return [...new Set(strategies)];
  }

  private calculateStressLevel(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    const stressMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('stress') ||
        c.notes?.toLowerCase().includes('pressure') ||
        c.notes?.toLowerCase().includes('overwhelmed') ||
        c.notes?.toLowerCase().includes('anxious')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? stressMentions / totalCheckIns : 0.2;
  }

  private calculateResilience(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Calculate resilience based on recovery from low motivation
    const lowMotivationSessions = checkIns.filter(c => (c.motivation || 5) < 4);
    const recoverySessions = lowMotivationSessions.filter((c, index) => {
      const nextCheckIn = checkIns[index + 1];
      return nextCheckIn && (nextCheckIn.motivation || 5) > 6;
    });

    const totalLowMotivation = lowMotivationSessions.length;
    return totalLowMotivation > 0
      ? recoverySessions.length / totalLowMotivation
      : 0.5;
  }

  private calculateEmotionalIntelligence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Calculate emotional intelligence based on self-awareness and regulation
    const selfAwareness = this.calculateSelfAwareness(sessions, checkIns);
    const selfRegulation = this.calculateSelfRegulation(sessions, checkIns);

    return (selfAwareness + selfRegulation) / 2;
  }

  private calculateSelfAwareness(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Calculate self-awareness based on mood recognition and reflection
    const moodReflections = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('feel') ||
        c.notes?.toLowerCase().includes('mood') ||
        c.notes?.toLowerCase().includes('emotion')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? moodReflections / totalCheckIns : 0.3;
  }

  private calculateSelfRegulation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Calculate self-regulation based on mood management
    const moodManagement = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('calm') ||
        c.notes?.toLowerCase().includes('relax') ||
        c.notes?.toLowerCase().includes('manage') ||
        c.notes?.toLowerCase().includes('control')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? moodManagement / totalCheckIns : 0.3;
  }

  private calculateEmotionalConfidence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    const dataPoints = sessions.length + checkIns.length;
    const consistency = this.calculateDataConsistency(sessions, checkIns);
    return Math.min(1, (dataPoints / 10) * consistency);
  }

  private getDefaultEmotionalState(userId: string): EmotionalState {
    return {
      userId,
      currentMood: {
        primary: 'calm',
        intensity: 0.5,
        stability: 0.5,
      },
      emotionalTriggers: {
        positive: ['progress_visible', 'social_support'],
        negative: ['fatigue', 'stress'],
        neutral: ['routine', 'scheduled_time'],
      },
      emotionalPatterns: {
        timeOfDay: {
          early_morning: 'calm',
          morning: 'motivated',
          afternoon: 'energized',
          evening: 'tired',
          night: 'calm',
        },
        dayOfWeek: {
          monday: 'motivated',
          tuesday: 'focused',
          wednesday: 'energized',
          thursday: 'determined',
          friday: 'excited',
          saturday: 'happy',
          sunday: 'calm',
        },
        seasonal: {
          spring: 'energized',
          summer: 'happy',
          autumn: 'focused',
          winter: 'calm',
        },
        weather: {
          sunny: 'happy',
          cloudy: 'neutral',
          rainy: 'calm',
          snowy: 'peaceful',
          windy: 'anxious',
        },
      },
      emotionalRegulation: {
        copingStrategies: ['breathing_exercises', 'physical_activity'],
        stressLevel: 0.3,
        resilience: 0.6,
        emotionalIntelligence: 0.5,
      },
      lastUpdated: new Date(),
      confidence: 0.3,
    };
  }

  // Contextual Insights Generation
  async generateContextualInsights(
    userId: string
  ): Promise<ContextualInsights> {
    try {
      const environmental = this.getEnvironmentalContext(userId);
      const timeBased = this.getTimeBasedOptimization(userId);
      const social = this.socialContexts.get(userId);
      const emotional = this.emotionalStates.get(userId);

      const insights = this.analyzeContextualInsights(
        environmental,
        timeBased,
        social,
        emotional
      );

      const contextualInsights: ContextualInsights = {
        userId,
        insights,
        lastUpdated: new Date(),
      };

      this.contextualInsights.set(userId, contextualInsights);
      return contextualInsights;
    } catch (error) {
      console.error('Error generating contextual insights:', error);
      throw error;
    }
  }

  private analyzeContextualInsights(
    environmental: EnvironmentalContext | null,
    timeBased: TimeBasedOptimization | null,
    social: SocialContext | null,
    emotional: EmotionalState | null
  ): ContextualInsights['insights'] {
    const insights = [];

    if (environmental) {
      insights.push(...this.generateEnvironmentalInsights(environmental));
    }

    if (timeBased) {
      insights.push(...this.generateTimeBasedInsights(timeBased));
    }

    if (social) {
      insights.push(...this.generateSocialInsights(social));
    }

    if (emotional) {
      insights.push(...this.generateEmotionalInsights(emotional));
    }

    // Generate combined insights
    if (environmental && timeBased && social && emotional) {
      insights.push(
        ...this.generateCombinedInsights(
          environmental,
          timeBased,
          social,
          emotional
        )
      );
    }

    return insights;
  }

  private generateEnvironmentalInsights(
    environmental: EnvironmentalContext
  ): ContextualInsights['insights'] {
    const insights = [];

    // Weather-based insights
    if (environmental.weather.condition === 'sunny') {
      insights.push({
        type: 'environmental',
        title: 'Sunny Weather Boost',
        description:
          'Sunny weather detected - this is an optimal time for outdoor activities and high-energy training.',
        confidence: environmental.confidence,
        actionable: true,
        priority: 'medium',
        recommendations: [
          'Consider outdoor training sessions',
          'Take advantage of natural light for mood boost',
          'Stay hydrated and use sun protection',
        ],
        contextFactors: ['weather', 'location'],
      });
    }

    // Location-based insights
    if (environmental.location.type === 'home') {
      insights.push({
        type: 'environmental',
        title: 'Home Training Environment',
        description:
          'Training at home provides comfort and convenience. Consider optimizing your home setup for better performance.',
        confidence: environmental.confidence,
        actionable: true,
        priority: 'low',
        recommendations: [
          'Create a dedicated training space',
          'Ensure good ventilation and lighting',
          'Minimize distractions during training',
        ],
        contextFactors: ['location', 'environment'],
      });
    }

    return insights;
  }

  private generateTimeBasedInsights(
    timeBased: TimeBasedOptimization
  ): ContextualInsights['insights'] {
    const insights = [];

    // Energy pattern insights
    const highEnergyTimes = Object.entries(timeBased.energyPatterns.timeOfDay)
      .filter(([, energy]) => energy > 0.7)
      .map(([time]) => time);

    if (highEnergyTimes.length > 0) {
      insights.push({
        type: 'temporal',
        title: 'Peak Energy Times Identified',
        description: `Your energy levels are highest during ${highEnergyTimes.join(' and ')}. Schedule your most challenging workouts during these times.`,
        confidence: timeBased.confidence,
        actionable: true,
        priority: 'high',
        recommendations: [
          'Schedule strength training during peak energy times',
          'Use low energy periods for recovery and light activities',
          'Plan your weekly schedule around energy patterns',
        ],
        contextFactors: ['time', 'energy'],
      });
    }

    return insights;
  }

  private generateSocialInsights(
    social: SocialContext
  ): ContextualInsights['insights'] {
    const insights = [];

    // Social motivation insights
    if (social.socialInfluence.socialMotivation > 0.7) {
      insights.push({
        type: 'social',
        title: 'High Social Motivation',
        description:
          'You are highly motivated by social interaction. Consider joining group training sessions or finding a workout partner.',
        confidence: social.confidence,
        actionable: true,
        priority: 'high',
        recommendations: [
          'Join group training sessions',
          'Find a workout partner or training group',
          'Share your progress with friends and family',
        ],
        contextFactors: ['social', 'motivation'],
      });
    }

    // Social anxiety insights
    if (social.socialInfluence.socialAnxiety > 0.5) {
      insights.push({
        type: 'social',
        title: 'Social Anxiety Considerations',
        description:
          'You may experience some social anxiety during group activities. Consider gradual exposure or smaller group settings.',
        confidence: social.confidence,
        actionable: true,
        priority: 'medium',
        recommendations: [
          'Start with smaller group settings',
          'Practice social skills in comfortable environments',
          'Consider individual training with occasional social elements',
        ],
        contextFactors: ['social', 'anxiety'],
      });
    }

    return insights;
  }

  private generateEmotionalInsights(
    emotional: EmotionalState
  ): ContextualInsights['insights'] {
    const insights = [];

    // Mood stability insights
    if (emotional.currentMood.stability < 0.5) {
      insights.push({
        type: 'emotional',
        title: 'Mood Stability Concerns',
        description:
          'Your mood shows some variability. Consider implementing mood regulation strategies for more consistent training.',
        confidence: emotional.confidence,
        actionable: true,
        priority: 'medium',
        recommendations: [
          'Practice mood regulation techniques',
          'Identify and address emotional triggers',
          'Consider professional support if needed',
        ],
        contextFactors: ['emotional', 'stability'],
      });
    }

    // Stress level insights
    if (emotional.emotionalRegulation.stressLevel > 0.6) {
      insights.push({
        type: 'emotional',
        title: 'Elevated Stress Levels',
        description:
          'Your stress levels are elevated. Consider incorporating stress management techniques into your routine.',
        confidence: emotional.confidence,
        actionable: true,
        priority: 'high',
        recommendations: [
          'Practice stress management techniques',
          'Consider reducing training intensity during high stress periods',
          'Incorporate relaxation and recovery activities',
        ],
        contextFactors: ['emotional', 'stress'],
      });
    }

    return insights;
  }

  private generateCombinedInsights(
    environmental: EnvironmentalContext,
    timeBased: TimeBasedOptimization,
    social: SocialContext,
    emotional: EmotionalState
  ): ContextualInsights['insights'] {
    const insights = [];

    // Combined weather and mood insights
    if (
      environmental.weather.condition === 'sunny' &&
      emotional.currentMood.primary === 'happy'
    ) {
      insights.push({
        type: 'combined',
        title: 'Optimal Training Conditions',
        description:
          'Perfect combination of sunny weather and positive mood detected. This is an ideal time for challenging training sessions.',
        confidence: Math.min(environmental.confidence, emotional.confidence),
        actionable: true,
        priority: 'high',
        recommendations: [
          'Schedule your most challenging workout today',
          'Take advantage of the positive conditions',
          'Consider outdoor training if possible',
        ],
        contextFactors: ['weather', 'mood', 'time', 'environment'],
      });
    }

    // Combined social and time insights
    if (
      social.socialInfluence.socialMotivation > 0.6 &&
      timeBased.energyPatterns.timeOfDay.afternoon > 0.7
    ) {
      insights.push({
        type: 'combined',
        title: 'Social Training Opportunity',
        description:
          'High social motivation combined with peak afternoon energy makes this an ideal time for group training.',
        confidence: Math.min(social.confidence, timeBased.confidence),
        actionable: true,
        priority: 'medium',
        recommendations: [
          'Schedule group training sessions in the afternoon',
          'Invite friends or teammates to join your workout',
          'Use this time for team-building activities',
        ],
        contextFactors: ['social', 'time', 'energy'],
      });
    }

    return insights;
  }

  // Additional getters
  getSocialContext(userId: string): SocialContext | null {
    return this.socialContexts.get(userId) || null;
  }

  getEmotionalState(userId: string): EmotionalState | null {
    return this.emotionalStates.get(userId) || null;
  }

  getContextualInsights(userId: string): ContextualInsights | null {
    return this.contextualInsights.get(userId) || null;
  }

  // Cleanup
  destroy(): void {
    if (this.contextualAnalysisInterval) {
      clearInterval(this.contextualAnalysisInterval);
    }
    this.saveData();
  }
}

// Export singleton instance
export const contextualIntelligence = new ContextualIntelligenceService();
