'use client';

import { DatabaseService, SessionData, CheckInData } from './database-service';

export interface LearningStyleProfile {
  userId: string;
  visualPreference: number; // 0-1 scale
  auditoryPreference: number; // 0-1 scale
  kinestheticPreference: number; // 0-1 scale
  readingPreference: number; // 0-1 scale
  socialPreference: number; // 0-1 scale
  individualPreference: number; // 0-1 scale
  sequentialPreference: number; // 0-1 scale
  globalPreference: number; // 0-1 scale
  activePreference: number; // 0-1 scale
  reflectivePreference: number; // 0-1 scale
  lastUpdated: Date;
  confidence: number;
  adaptationHistory: {
    date: Date;
    changes: any;
    reason: string;
  }[];
}

export interface MotivationProfile {
  userId: string;
  intrinsicMotivation: number; // 0-1 scale
  extrinsicMotivation: number; // 0-1 scale
  achievementMotivation: number; // 0-1 scale
  socialMotivation: number; // 0-1 scale
  masteryMotivation: number; // 0-1 scale
  performanceMotivation: number; // 0-1 scale
  autonomyMotivation: number; // 0-1 scale
  competenceMotivation: number; // 0-1 scale
  relatednessMotivation: number; // 0-1 scale
  lastUpdated: Date;
  confidence: number;
  patterns: {
    timeOfDay: Record<string, number>;
    dayOfWeek: Record<string, number>;
    sessionType: Record<string, number>;
    mood: Record<string, number>;
    weather: Record<string, number>;
  };
  triggers: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
}

export interface ChallengeLevelProfile {
  userId: string;
  currentLevel: number; // 1-10 scale
  optimalLevel: number; // 1-10 scale
  adaptationRate: number; // How quickly user adapts to new challenges
  comfortZone: {
    min: number;
    max: number;
  };
  stretchZone: {
    min: number;
    max: number;
  };
  panicZone: {
    min: number;
    max: number;
  };
  lastUpdated: Date;
  confidence: number;
  progressionHistory: {
    date: Date;
    level: number;
    performance: number;
    adaptation: number;
  }[];
}

export interface SupportSystemProfile {
  userId: string;
  preferredSupportTypes: {
    instructional: number; // 0-1 scale
    motivational: number; // 0-1 scale
    technical: number; // 0-1 scale
    social: number; // 0-1 scale
    emotional: number; // 0-1 scale
  };
  communicationStyle: {
    direct: number; // 0-1 scale
    encouraging: number; // 0-1 scale
    detailed: number; // 0-1 scale
    concise: number; // 0-1 scale
    casual: number; // 0-1 scale
    formal: number; // 0-1 scale
  };
  feedbackPreferences: {
    frequency: 'immediate' | 'end_of_session' | 'daily' | 'weekly';
    detail: 'minimal' | 'moderate' | 'comprehensive';
    tone: 'positive' | 'constructive' | 'neutral' | 'critical';
    format: 'text' | 'visual' | 'audio' | 'mixed';
  };
  lastUpdated: Date;
  confidence: number;
}

export interface PersonalizationInsights {
  userId: string;
  insights: {
    type: 'learning_style' | 'motivation' | 'challenge' | 'support' | 'general';
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
    priority: 'high' | 'medium' | 'low';
    recommendations: string[];
  }[];
  lastUpdated: Date;
}

export class DeepPersonalizationService {
  private databaseService = new DatabaseService();
  private learningStyleProfiles: Map<string, LearningStyleProfile> = new Map();
  private motivationProfiles: Map<string, MotivationProfile> = new Map();
  private challengeLevelProfiles: Map<string, ChallengeLevelProfile> =
    new Map();
  private supportSystemProfiles: Map<string, SupportSystemProfile> = new Map();
  private personalizationInsights: Map<string, PersonalizationInsights> =
    new Map();
  private personalizationInterval: number | null = null;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    this.startPersonalizationAnalysis();
    this.loadStoredData();
  }

  // Individual Learning Style Adaptation
  async analyzeLearningStyle(userId: string): Promise<LearningStyleProfile> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 5) {
        return this.getDefaultLearningStyleProfile(userId);
      }

      const profile = await this.calculateLearningStyleProfile(
        userId,
        sessions,
        checkIns
      );
      this.learningStyleProfiles.set(userId, profile);

      return profile;
    } catch (error) {
      console.error('Error analyzing learning style:', error);
      throw error;
    }
  }

  private async calculateLearningStyleProfile(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<LearningStyleProfile> {
    // Analyze visual preferences from session types and exercises
    const visualPreference = this.calculateVisualPreference(sessions);

    // Analyze auditory preferences from feedback and instructions
    const auditoryPreference = this.calculateAuditoryPreference(
      sessions,
      checkIns
    );

    // Analyze kinesthetic preferences from exercise selection
    const kinestheticPreference = this.calculateKinestheticPreference(sessions);

    // Analyze reading preferences from text-based content
    const readingPreference = this.calculateReadingPreference(
      sessions,
      checkIns
    );

    // Analyze social preferences from group activities
    const socialPreference = this.calculateSocialPreference(sessions, checkIns);

    // Analyze individual vs group preferences
    const individualPreference = this.calculateIndividualPreference(
      sessions,
      checkIns
    );

    // Analyze sequential vs global learning preferences
    const sequentialPreference = this.calculateSequentialPreference(sessions);
    const globalPreference = 1 - sequentialPreference;

    // Analyze active vs reflective preferences
    const activePreference = this.calculateActivePreference(sessions, checkIns);
    const reflectivePreference = 1 - activePreference;

    const confidence = this.calculateLearningStyleConfidence(
      sessions,
      checkIns
    );

    return {
      userId,
      visualPreference,
      auditoryPreference,
      kinestheticPreference,
      readingPreference,
      socialPreference,
      individualPreference,
      sequentialPreference,
      globalPreference,
      activePreference,
      reflectivePreference,
      lastUpdated: new Date(),
      confidence,
      adaptationHistory: [],
    };
  }

  private calculateVisualPreference(sessions: SessionData[]): number {
    // Analyze preference for visual exercises and demonstrations
    const visualExercises = sessions
      .flatMap(s => s.exercises)
      .filter(
        ex =>
          ex.name.toLowerCase().includes('visual') ||
          ex.name.toLowerCase().includes('mirror') ||
          ex.name.toLowerCase().includes('form')
      );

    const totalExercises = sessions.flatMap(s => s.exercises).length;
    return totalExercises > 0 ? visualExercises.length / totalExercises : 0.5;
  }

  private calculateAuditoryPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for audio feedback and instructions
    const audioFeedback = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('audio') ||
        c.notes?.toLowerCase().includes('music') ||
        c.notes?.toLowerCase().includes('sound')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? audioFeedback / totalCheckIns : 0.5;
  }

  private calculateKinestheticPreference(sessions: SessionData[]): number {
    // Analyze preference for hands-on, physical exercises
    const physicalExercises = sessions
      .flatMap(s => s.exercises)
      .filter(
        ex =>
          ex.name.toLowerCase().includes('squat') ||
          ex.name.toLowerCase().includes('push') ||
          ex.name.toLowerCase().includes('pull') ||
          ex.name.toLowerCase().includes('jump')
      );

    const totalExercises = sessions.flatMap(s => s.exercises).length;
    return totalExercises > 0 ? physicalExercises.length / totalExercises : 0.5;
  }

  private calculateReadingPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for text-based instructions and feedback
    const textFeedback = checkIns.filter(
      c => c.notes && c.notes.length > 50
    ).length;
    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? textFeedback / totalCheckIns : 0.5;
  }

  private calculateSocialPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for group activities and social interaction
    const groupSessions = sessions.filter(
      s => s.type === 'group' || s.type === 'team'
    ).length;
    const totalSessions = sessions.length;
    return totalSessions > 0 ? groupSessions / totalSessions : 0.5;
  }

  private calculateIndividualPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for individual vs group activities
    const individualSessions = sessions.filter(
      s => s.type === 'individual' || s.type === 'solo'
    ).length;
    const totalSessions = sessions.length;
    return totalSessions > 0 ? individualSessions / totalSessions : 0.5;
  }

  private calculateSequentialPreference(sessions: SessionData[]): number {
    // Analyze preference for step-by-step vs holistic learning
    const sequentialSessions = sessions.filter(s =>
      s.exercises.some(
        ex =>
          ex.name.toLowerCase().includes('progression') ||
          ex.name.toLowerCase().includes('sequence')
      )
    ).length;

    const totalSessions = sessions.length;
    return totalSessions > 0 ? sequentialSessions / totalSessions : 0.5;
  }

  private calculateActivePreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for active vs reflective learning
    const activeSessions = sessions.filter(
      s => s.duration && s.duration > 45
    ).length;
    const totalSessions = sessions.length;
    return totalSessions > 0 ? activeSessions / totalSessions : 0.5;
  }

  private calculateLearningStyleConfidence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Calculate confidence based on data availability and consistency
    const dataPoints = sessions.length + checkIns.length;
    const consistency = this.calculateDataConsistency(sessions, checkIns);
    return Math.min(1, (dataPoints / 20) * consistency);
  }

  private calculateDataConsistency(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Calculate how consistent the data is
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

  private getDefaultLearningStyleProfile(userId: string): LearningStyleProfile {
    return {
      userId,
      visualPreference: 0.5,
      auditoryPreference: 0.5,
      kinestheticPreference: 0.5,
      readingPreference: 0.5,
      socialPreference: 0.5,
      individualPreference: 0.5,
      sequentialPreference: 0.5,
      globalPreference: 0.5,
      activePreference: 0.5,
      reflectivePreference: 0.5,
      lastUpdated: new Date(),
      confidence: 0.3,
      adaptationHistory: [],
    };
  }

  // Motivation Pattern Recognition
  async analyzeMotivationPatterns(userId: string): Promise<MotivationProfile> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 5) {
        return this.getDefaultMotivationProfile(userId);
      }

      const profile = await this.calculateMotivationProfile(
        userId,
        sessions,
        checkIns
      );
      this.motivationProfiles.set(userId, profile);

      return profile;
    } catch (error) {
      console.error('Error analyzing motivation patterns:', error);
      throw error;
    }
  }

  private async calculateMotivationProfile(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<MotivationProfile> {
    // Analyze intrinsic motivation (internal drive)
    const intrinsicMotivation = this.calculateIntrinsicMotivation(
      sessions,
      checkIns
    );

    // Analyze extrinsic motivation (external rewards)
    const extrinsicMotivation = this.calculateExtrinsicMotivation(
      sessions,
      checkIns
    );

    // Analyze achievement motivation
    const achievementMotivation = this.calculateAchievementMotivation(
      sessions,
      checkIns
    );

    // Analyze social motivation
    const socialMotivation = this.calculateSocialMotivation(sessions, checkIns);

    // Analyze mastery motivation
    const masteryMotivation = this.calculateMasteryMotivation(
      sessions,
      checkIns
    );

    // Analyze performance motivation
    const performanceMotivation = this.calculatePerformanceMotivation(
      sessions,
      checkIns
    );

    // Analyze autonomy motivation
    const autonomyMotivation = this.calculateAutonomyMotivation(
      sessions,
      checkIns
    );

    // Analyze competence motivation
    const competenceMotivation = this.calculateCompetenceMotivation(
      sessions,
      checkIns
    );

    // Analyze relatedness motivation
    const relatednessMotivation = this.calculateRelatednessMotivation(
      sessions,
      checkIns
    );

    const confidence = this.calculateMotivationConfidence(sessions, checkIns);

    // Analyze patterns
    const patterns = this.analyzeMotivationPatterns(sessions, checkIns);
    const triggers = this.analyzeMotivationTriggers(sessions, checkIns);

    return {
      userId,
      intrinsicMotivation,
      extrinsicMotivation,
      achievementMotivation,
      socialMotivation,
      masteryMotivation,
      performanceMotivation,
      autonomyMotivation,
      competenceMotivation,
      relatednessMotivation,
      lastUpdated: new Date(),
      confidence,
      patterns,
      triggers,
    };
  }

  private calculateIntrinsicMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze internal motivation based on session consistency and enjoyment
    const consistentSessions = sessions.filter(
      s => s.duration && s.duration > 30
    ).length;
    const totalSessions = sessions.length;
    const consistency =
      totalSessions > 0 ? consistentSessions / totalSessions : 0.5;

    const enjoyment =
      checkIns.reduce((sum, c) => sum + (c.motivation || 5), 0) /
      checkIns.length /
      10;

    return (consistency + enjoyment) / 2;
  }

  private calculateExtrinsicMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze external motivation based on achievement mentions and rewards
    const achievementMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('reward') ||
        c.notes?.toLowerCase().includes('achievement') ||
        c.notes?.toLowerCase().includes('badge')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? achievementMentions / totalCheckIns : 0.3;
  }

  private calculateAchievementMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze achievement motivation based on goal-oriented behavior
    const goalSessions = sessions.filter(s =>
      s.exercises.some(
        ex =>
          ex.name.toLowerCase().includes('goal') ||
          ex.name.toLowerCase().includes('target')
      )
    ).length;

    const totalSessions = sessions.length;
    return totalSessions > 0 ? goalSessions / totalSessions : 0.5;
  }

  private calculateSocialMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze social motivation based on group activities and social mentions
    const groupSessions = sessions.filter(
      s => s.type === 'group' || s.type === 'team'
    ).length;
    const socialMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('friend') ||
        c.notes?.toLowerCase().includes('team') ||
        c.notes?.toLowerCase().includes('group')
    ).length;

    const totalSessions = sessions.length;
    const totalCheckIns = checkIns.length;

    const groupRatio = totalSessions > 0 ? groupSessions / totalSessions : 0;
    const socialRatio = totalCheckIns > 0 ? socialMentions / totalCheckIns : 0;

    return (groupRatio + socialRatio) / 2;
  }

  private calculateMasteryMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze mastery motivation based on skill development focus
    const skillSessions = sessions.filter(s =>
      s.exercises.some(
        ex =>
          ex.name.toLowerCase().includes('skill') ||
          ex.name.toLowerCase().includes('technique') ||
          ex.name.toLowerCase().includes('form')
      )
    ).length;

    const totalSessions = sessions.length;
    return totalSessions > 0 ? skillSessions / totalSessions : 0.5;
  }

  private calculatePerformanceMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze performance motivation based on competitive elements
    const competitiveSessions = sessions.filter(s =>
      s.exercises.some(
        ex =>
          ex.name.toLowerCase().includes('competition') ||
          ex.name.toLowerCase().includes('race') ||
          ex.name.toLowerCase().includes('challenge')
      )
    ).length;

    const totalSessions = sessions.length;
    return totalSessions > 0 ? competitiveSessions / totalSessions : 0.3;
  }

  private calculateAutonomyMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze autonomy motivation based on self-directed activities
    const selfDirectedSessions = sessions.filter(
      s => s.type === 'individual' || s.type === 'solo'
    ).length;
    const totalSessions = sessions.length;
    return totalSessions > 0 ? selfDirectedSessions / totalSessions : 0.5;
  }

  private calculateCompetenceMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze competence motivation based on skill progression
    const progressionSessions = sessions.filter(s =>
      s.exercises.some(
        ex =>
          ex.name.toLowerCase().includes('progression') ||
          ex.name.toLowerCase().includes('advance') ||
          ex.name.toLowerCase().includes('improve')
      )
    ).length;

    const totalSessions = sessions.length;
    return totalSessions > 0 ? progressionSessions / totalSessions : 0.5;
  }

  private calculateRelatednessMotivation(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze relatedness motivation based on connection and belonging
    const connectionMentions = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('connect') ||
        c.notes?.toLowerCase().includes('belong') ||
        c.notes?.toLowerCase().includes('support')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? connectionMentions / totalCheckIns : 0.4;
  }

  private calculateMotivationConfidence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    const dataPoints = sessions.length + checkIns.length;
    const consistency = this.calculateDataConsistency(sessions, checkIns);
    return Math.min(1, (dataPoints / 15) * consistency);
  }

  private analyzeMotivationPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): MotivationProfile['patterns'] {
    // Analyze time-based patterns
    const timeOfDay = this.analyzeTimeOfDayPatterns(sessions);
    const dayOfWeek = this.analyzeDayOfWeekPatterns(sessions);
    const sessionType = this.analyzeSessionTypePatterns(sessions);
    const mood = this.analyzeMoodPatterns(checkIns);
    const weather = this.analyzeWeatherPatterns(sessions, checkIns);

    return {
      timeOfDay,
      dayOfWeek,
      sessionType,
      mood,
      weather,
    };
  }

  private analyzeTimeOfDayPatterns(
    sessions: SessionData[]
  ): Record<string, number> {
    const timeSlots = {
      early_morning: 0,
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };

    sessions.forEach(session => {
      const hour = new Date(session.date).getHours();
      if (hour < 6) timeSlots.early_morning++;
      else if (hour < 12) timeSlots.morning++;
      else if (hour < 17) timeSlots.afternoon++;
      else if (hour < 21) timeSlots.evening++;
      else timeSlots.night++;
    });

    const total = sessions.length;
    Object.keys(timeSlots).forEach(key => {
      timeSlots[key] = total > 0 ? timeSlots[key] / total : 0;
    });

    return timeSlots;
  }

  private analyzeDayOfWeekPatterns(
    sessions: SessionData[]
  ): Record<string, number> {
    const days = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    };

    sessions.forEach(session => {
      const day = new Date(session.date).getDay();
      const dayNames = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      days[dayNames[day]]++;
    });

    const total = sessions.length;
    Object.keys(days).forEach(key => {
      days[key] = total > 0 ? days[key] / total : 0;
    });

    return days;
  }

  private analyzeSessionTypePatterns(
    sessions: SessionData[]
  ): Record<string, number> {
    const types = {
      strength: 0,
      volleyball: 0,
      plyometric: 0,
      recovery: 0,
      individual: 0,
      group: 0,
    };

    sessions.forEach(session => {
      if (session.type) {
        types[session.type] = (types[session.type] || 0) + 1;
      }
    });

    const total = sessions.length;
    Object.keys(types).forEach(key => {
      types[key] = total > 0 ? types[key] / total : 0;
    });

    return types;
  }

  private analyzeMoodPatterns(checkIns: CheckInData[]): Record<string, number> {
    const moods = {
      motivated: 0,
      tired: 0,
      excited: 0,
      stressed: 0,
      confident: 0,
      frustrated: 0,
    };

    checkIns.forEach(checkIn => {
      const mood = checkIn.mood || 'neutral';
      if (moods[mood]) {
        moods[mood]++;
      }
    });

    const total = checkIns.length;
    Object.keys(moods).forEach(key => {
      moods[key] = total > 0 ? moods[key] / total : 0;
    });

    return moods;
  }

  private analyzeWeatherPatterns(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Record<string, number> {
    // Simulate weather analysis based on session data
    const weather = {
      sunny: 0.3,
      cloudy: 0.3,
      rainy: 0.2,
      snowy: 0.1,
      windy: 0.1,
    };

    return weather;
  }

  private analyzeMotivationTriggers(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): MotivationProfile['triggers'] {
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
    });

    return [...new Set(triggers)];
  }

  private getDefaultMotivationProfile(userId: string): MotivationProfile {
    return {
      userId,
      intrinsicMotivation: 0.5,
      extrinsicMotivation: 0.3,
      achievementMotivation: 0.5,
      socialMotivation: 0.4,
      masteryMotivation: 0.5,
      performanceMotivation: 0.3,
      autonomyMotivation: 0.5,
      competenceMotivation: 0.5,
      relatednessMotivation: 0.4,
      lastUpdated: new Date(),
      confidence: 0.3,
      patterns: {
        timeOfDay: {
          early_morning: 0.2,
          morning: 0.3,
          afternoon: 0.3,
          evening: 0.2,
          night: 0,
        },
        dayOfWeek: {
          monday: 0.15,
          tuesday: 0.15,
          wednesday: 0.15,
          thursday: 0.15,
          friday: 0.15,
          saturday: 0.15,
          sunday: 0.1,
        },
        sessionType: {
          strength: 0.3,
          volleyball: 0.3,
          plyometric: 0.2,
          recovery: 0.2,
          individual: 0.5,
          group: 0.5,
        },
        mood: {
          motivated: 0.3,
          tired: 0.2,
          excited: 0.2,
          stressed: 0.1,
          confident: 0.1,
          frustrated: 0.1,
        },
        weather: {
          sunny: 0.3,
          cloudy: 0.3,
          rainy: 0.2,
          snowy: 0.1,
          windy: 0.1,
        },
      },
      triggers: {
        positive: ['progress_visible', 'goal_achievement'],
        negative: ['fatigue', 'stress'],
        neutral: ['routine', 'scheduled_time'],
      },
    };
  }

  // Data persistence
  private loadStoredData(): void {
    try {
      const storedLearningStyles = localStorage.getItem(
        'learning_style_profiles'
      );
      if (storedLearningStyles) {
        const profiles = JSON.parse(storedLearningStyles);
        Object.entries(profiles).forEach(([key, value]) => {
          this.learningStyleProfiles.set(key, {
            ...value,
            lastUpdated: new Date(value.lastUpdated),
          });
        });
      }

      const storedMotivationProfiles = localStorage.getItem(
        'motivation_profiles'
      );
      if (storedMotivationProfiles) {
        const profiles = JSON.parse(storedMotivationProfiles);
        Object.entries(profiles).forEach(([key, value]) => {
          this.motivationProfiles.set(key, {
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
        'learning_style_profiles',
        JSON.stringify(Object.fromEntries(this.learningStyleProfiles))
      );
      localStorage.setItem(
        'motivation_profiles',
        JSON.stringify(Object.fromEntries(this.motivationProfiles))
      );
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Public getters
  getLearningStyleProfile(userId: string): LearningStyleProfile | null {
    return this.learningStyleProfiles.get(userId) || null;
  }

  getMotivationProfile(userId: string): MotivationProfile | null {
    return this.motivationProfiles.get(userId) || null;
  }

  // Challenge Level Optimization
  async analyzeChallengeLevel(userId: string): Promise<ChallengeLevelProfile> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 5) {
        return this.getDefaultChallengeLevelProfile(userId);
      }

      const profile = await this.calculateChallengeLevelProfile(
        userId,
        sessions,
        checkIns
      );
      this.challengeLevelProfiles.set(userId, profile);

      return profile;
    } catch (error) {
      console.error('Error analyzing challenge level:', error);
      throw error;
    }
  }

  private async calculateChallengeLevelProfile(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<ChallengeLevelProfile> {
    // Calculate current challenge level based on recent performance
    const currentLevel = this.calculateCurrentChallengeLevel(
      sessions,
      checkIns
    );

    // Calculate optimal challenge level
    const optimalLevel = this.calculateOptimalChallengeLevel(
      sessions,
      checkIns
    );

    // Calculate adaptation rate
    const adaptationRate = this.calculateAdaptationRate(sessions, checkIns);

    // Calculate comfort, stretch, and panic zones
    const comfortZone = this.calculateComfortZone(sessions, checkIns);
    const stretchZone = this.calculateStretchZone(sessions, checkIns);
    const panicZone = this.calculatePanicZone(sessions, checkIns);

    const confidence = this.calculateChallengeLevelConfidence(
      sessions,
      checkIns
    );

    // Analyze progression history
    const progressionHistory = this.analyzeProgressionHistory(
      sessions,
      checkIns
    );

    return {
      userId,
      currentLevel,
      optimalLevel,
      adaptationRate,
      comfortZone,
      stretchZone,
      panicZone,
      lastUpdated: new Date(),
      confidence,
      progressionHistory,
    };
  }

  private calculateCurrentChallengeLevel(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Calculate based on recent session intensity and performance
    const recentSessions = sessions.slice(-5);
    if (recentSessions.length === 0) return 5;

    const avgIntensity =
      recentSessions.reduce((sum, session) => {
        const sessionIntensity =
          session.exercises.reduce((exSum, exercise) => {
            const exerciseIntensity =
              exercise.sets.reduce((setSum, set) => {
                return setSum + (set.rpe || 5);
              }, 0) / exercise.sets.length;
            return exSum + exerciseIntensity;
          }, 0) / session.exercises.length;
        return sum + sessionIntensity;
      }, 0) / recentSessions.length;

    // Convert RPE (1-10) to challenge level (1-10)
    return Math.min(10, Math.max(1, avgIntensity));
  }

  private calculateOptimalChallengeLevel(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Calculate optimal level based on performance and motivation
    const performance = this.calculatePerformanceScore(sessions, checkIns);
    const motivation =
      checkIns.reduce((sum, c) => sum + (c.motivation || 5), 0) /
      checkIns.length /
      10;

    // Optimal level is where performance and motivation are both high
    const optimalLevel = (performance + motivation) * 5; // Scale to 1-10
    return Math.min(10, Math.max(1, optimalLevel));
  }

  private calculateAdaptationRate(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Calculate how quickly user adapts to new challenges
    if (sessions.length < 10) return 0.5;

    const recentSessions = sessions.slice(-10);
    const olderSessions = sessions.slice(-20, -10);

    if (olderSessions.length === 0) return 0.5;

    const recentPerformance = this.calculatePerformanceScore(
      recentSessions,
      checkIns.slice(-10)
    );
    const olderPerformance = this.calculatePerformanceScore(
      olderSessions,
      checkIns.slice(-20, -10)
    );

    const improvement = recentPerformance - olderPerformance;
    return Math.min(1, Math.max(0, (improvement + 1) / 2)); // Normalize to 0-1
  }

  private calculateComfortZone(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): { min: number; max: number } {
    // Calculate comfort zone based on consistent performance
    const performances = this.calculateSessionPerformances(sessions, checkIns);
    const avgPerformance =
      performances.reduce((sum, p) => sum + p, 0) / performances.length;
    const stdDev = this.calculateStandardDeviation(performances);

    const min = Math.max(1, avgPerformance - stdDev);
    const max = Math.min(10, avgPerformance + stdDev);

    return { min, max };
  }

  private calculateStretchZone(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): { min: number; max: number } {
    // Calculate stretch zone (comfort zone + 1-2 levels)
    const comfortZone = this.calculateComfortZone(sessions, checkIns);
    const min = Math.min(10, comfortZone.max + 1);
    const max = Math.min(10, comfortZone.max + 2);

    return { min, max };
  }

  private calculatePanicZone(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): { min: number; max: number } {
    // Calculate panic zone (stretch zone + 2+ levels)
    const stretchZone = this.calculateStretchZone(sessions, checkIns);
    const min = Math.min(10, stretchZone.max + 1);
    const max = 10;

    return { min, max };
  }

  private calculateChallengeLevelConfidence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    const dataPoints = sessions.length + checkIns.length;
    const consistency = this.calculateDataConsistency(sessions, checkIns);
    return Math.min(1, (dataPoints / 15) * consistency);
  }

  private analyzeProgressionHistory(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): ChallengeLevelProfile['progressionHistory'] {
    const history = [];
    const chunkSize = Math.max(1, Math.floor(sessions.length / 10));

    for (let i = 0; i < sessions.length; i += chunkSize) {
      const chunk = sessions.slice(i, i + chunkSize);
      const checkInChunk = checkIns.slice(i, i + chunkSize);

      if (chunk.length > 0) {
        const level = this.calculateCurrentChallengeLevel(chunk, checkInChunk);
        const performance = this.calculatePerformanceScore(chunk, checkInChunk);
        const adaptation = this.calculateAdaptationRate(chunk, checkInChunk);

        history.push({
          date: chunk[chunk.length - 1].date,
          level,
          performance,
          adaptation,
        });
      }
    }

    return history;
  }

  private calculateSessionPerformances(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number[] {
    return sessions.map(session => {
      const sessionCheckIn = checkIns.find(
        c =>
          Math.abs(c.date.getTime() - session.date.getTime()) <
          24 * 60 * 60 * 1000
      );

      const intensity =
        session.exercises.reduce((sum, exercise) => {
          return (
            sum +
            exercise.sets.reduce((setSum, set) => setSum + (set.rpe || 5), 0) /
              exercise.sets.length
          );
        }, 0) / session.exercises.length;

      const motivation = sessionCheckIn
        ? (sessionCheckIn.motivation || 5) / 10
        : 0.5;
      const duration = (session.duration || 60) / 60; // Normalize to hours

      return (intensity + motivation + duration) / 3;
    });
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    return Math.sqrt(variance);
  }

  private calculatePerformanceScore(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    if (sessions.length === 0) return 0.5;

    const sessionScore = sessions.length > 0 ? 0.8 : 0.2;
    const checkInScore =
      checkIns.length > 0
        ? checkIns.reduce((sum, c) => sum + (c.motivation || 5), 0) /
          checkIns.length /
          10
        : 0.5;

    return (sessionScore + checkInScore) / 2;
  }

  private getDefaultChallengeLevelProfile(
    userId: string
  ): ChallengeLevelProfile {
    return {
      userId,
      currentLevel: 5,
      optimalLevel: 6,
      adaptationRate: 0.5,
      comfortZone: { min: 3, max: 7 },
      stretchZone: { min: 8, max: 9 },
      panicZone: { min: 10, max: 10 },
      lastUpdated: new Date(),
      confidence: 0.3,
      progressionHistory: [],
    };
  }

  // Support System Customization
  async analyzeSupportSystem(userId: string): Promise<SupportSystemProfile> {
    try {
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      if (sessions.length < 5) {
        return this.getDefaultSupportSystemProfile(userId);
      }

      const profile = await this.calculateSupportSystemProfile(
        userId,
        sessions,
        checkIns
      );
      this.supportSystemProfiles.set(userId, profile);

      return profile;
    } catch (error) {
      console.error('Error analyzing support system:', error);
      throw error;
    }
  }

  private async calculateSupportSystemProfile(
    userId: string,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<SupportSystemProfile> {
    // Analyze preferred support types
    const preferredSupportTypes = this.analyzePreferredSupportTypes(
      sessions,
      checkIns
    );

    // Analyze communication style
    const communicationStyle = this.analyzeCommunicationStyle(
      sessions,
      checkIns
    );

    // Analyze feedback preferences
    const feedbackPreferences = this.analyzeFeedbackPreferences(
      sessions,
      checkIns
    );

    const confidence = this.calculateSupportSystemConfidence(
      sessions,
      checkIns
    );

    return {
      userId,
      preferredSupportTypes,
      communicationStyle,
      feedbackPreferences,
      lastUpdated: new Date(),
      confidence,
    };
  }

  private analyzePreferredSupportTypes(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SupportSystemProfile['preferredSupportTypes'] {
    // Analyze instructional support preference
    const instructionalSupport = this.calculateInstructionalSupportPreference(
      sessions,
      checkIns
    );

    // Analyze motivational support preference
    const motivationalSupport = this.calculateMotivationalSupportPreference(
      sessions,
      checkIns
    );

    // Analyze technical support preference
    const technicalSupport = this.calculateTechnicalSupportPreference(
      sessions,
      checkIns
    );

    // Analyze social support preference
    const socialSupport = this.calculateSocialSupportPreference(
      sessions,
      checkIns
    );

    // Analyze emotional support preference
    const emotionalSupport = this.calculateEmotionalSupportPreference(
      sessions,
      checkIns
    );

    return {
      instructional: instructionalSupport,
      motivational: motivationalSupport,
      technical: technicalSupport,
      social: socialSupport,
      emotional: emotionalSupport,
    };
  }

  private calculateInstructionalSupportPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for instructional content
    const instructionalSessions = sessions.filter(s =>
      s.exercises.some(
        ex =>
          ex.name.toLowerCase().includes('instruction') ||
          ex.name.toLowerCase().includes('tutorial') ||
          ex.name.toLowerCase().includes('guide')
      )
    ).length;

    const totalSessions = sessions.length;
    return totalSessions > 0 ? instructionalSessions / totalSessions : 0.5;
  }

  private calculateMotivationalSupportPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for motivational content
    const motivationalCheckIns = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('motivation') ||
        c.notes?.toLowerCase().includes('encourage') ||
        c.notes?.toLowerCase().includes('inspire')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? motivationalCheckIns / totalCheckIns : 0.5;
  }

  private calculateTechnicalSupportPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for technical support
    const technicalSessions = sessions.filter(s =>
      s.exercises.some(
        ex =>
          ex.name.toLowerCase().includes('technical') ||
          ex.name.toLowerCase().includes('form') ||
          ex.name.toLowerCase().includes('technique')
      )
    ).length;

    const totalSessions = sessions.length;
    return totalSessions > 0 ? technicalSessions / totalSessions : 0.5;
  }

  private calculateSocialSupportPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for social support
    const socialSessions = sessions.filter(
      s => s.type === 'group' || s.type === 'team'
    ).length;
    const socialCheckIns = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('friend') ||
        c.notes?.toLowerCase().includes('team') ||
        c.notes?.toLowerCase().includes('group')
    ).length;

    const totalSessions = sessions.length;
    const totalCheckIns = checkIns.length;

    const sessionRatio = totalSessions > 0 ? socialSessions / totalSessions : 0;
    const checkInRatio = totalCheckIns > 0 ? socialCheckIns / totalCheckIns : 0;

    return (sessionRatio + checkInRatio) / 2;
  }

  private calculateEmotionalSupportPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for emotional support
    const emotionalCheckIns = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('emotion') ||
        c.notes?.toLowerCase().includes('feel') ||
        c.notes?.toLowerCase().includes('support')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? emotionalCheckIns / totalCheckIns : 0.4;
  }

  private analyzeCommunicationStyle(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SupportSystemProfile['communicationStyle'] {
    // Analyze direct vs indirect communication preference
    const direct = this.calculateDirectCommunicationPreference(
      sessions,
      checkIns
    );
    const encouraging = this.calculateEncouragingCommunicationPreference(
      sessions,
      checkIns
    );
    const detailed = this.calculateDetailedCommunicationPreference(
      sessions,
      checkIns
    );
    const concise = 1 - detailed; // Inverse of detailed
    const casual = this.calculateCasualCommunicationPreference(
      sessions,
      checkIns
    );
    const formal = 1 - casual; // Inverse of casual

    return {
      direct,
      encouraging,
      detailed,
      concise,
      casual,
      formal,
    };
  }

  private calculateDirectCommunicationPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for direct communication
    const directCheckIns = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('direct') ||
        c.notes?.toLowerCase().includes('straight') ||
        c.notes?.toLowerCase().includes('clear')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? directCheckIns / totalCheckIns : 0.5;
  }

  private calculateEncouragingCommunicationPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for encouraging communication
    const encouragingCheckIns = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('great') ||
        c.notes?.toLowerCase().includes('good') ||
        c.notes?.toLowerCase().includes('excellent') ||
        c.notes?.toLowerCase().includes('amazing')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? encouragingCheckIns / totalCheckIns : 0.6;
  }

  private calculateDetailedCommunicationPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for detailed communication
    const detailedCheckIns = checkIns.filter(
      c => c.notes && c.notes.length > 100
    ).length;
    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? detailedCheckIns / totalCheckIns : 0.5;
  }

  private calculateCasualCommunicationPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    // Analyze preference for casual communication
    const casualCheckIns = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('hey') ||
        c.notes?.toLowerCase().includes('cool') ||
        c.notes?.toLowerCase().includes('awesome') ||
        c.notes?.toLowerCase().includes('nice')
    ).length;

    const totalCheckIns = checkIns.length;
    return totalCheckIns > 0 ? casualCheckIns / totalCheckIns : 0.5;
  }

  private analyzeFeedbackPreferences(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SupportSystemProfile['feedbackPreferences'] {
    // Analyze feedback frequency preference
    const frequency = this.analyzeFeedbackFrequencyPreference(
      sessions,
      checkIns
    );

    // Analyze feedback detail preference
    const detail = this.analyzeFeedbackDetailPreference(sessions, checkIns);

    // Analyze feedback tone preference
    const tone = this.analyzeFeedbackTonePreference(sessions, checkIns);

    // Analyze feedback format preference
    const format = this.analyzeFeedbackFormatPreference(sessions, checkIns);

    return {
      frequency,
      detail,
      tone,
      format,
    };
  }

  private analyzeFeedbackFrequencyPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SupportSystemProfile['feedbackPreferences']['frequency'] {
    // Analyze how often user wants feedback
    const sessionFrequency = sessions.length / 7; // Sessions per week
    const checkInFrequency = checkIns.length / 7; // Check-ins per week

    const totalFrequency = (sessionFrequency + checkInFrequency) / 2;

    if (totalFrequency > 5) return 'immediate';
    if (totalFrequency > 2) return 'end_of_session';
    if (totalFrequency > 1) return 'daily';
    return 'weekly';
  }

  private analyzeFeedbackDetailPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SupportSystemProfile['feedbackPreferences']['detail'] {
    // Analyze preference for detailed feedback
    const detailedCheckIns = checkIns.filter(
      c => c.notes && c.notes.length > 50
    ).length;
    const totalCheckIns = checkIns.length;
    const detailRatio =
      totalCheckIns > 0 ? detailedCheckIns / totalCheckIns : 0.5;

    if (detailRatio > 0.7) return 'comprehensive';
    if (detailRatio > 0.3) return 'moderate';
    return 'minimal';
  }

  private analyzeFeedbackTonePreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SupportSystemProfile['feedbackPreferences']['tone'] {
    // Analyze preference for feedback tone
    const positiveCheckIns = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('great') ||
        c.notes?.toLowerCase().includes('good') ||
        c.notes?.toLowerCase().includes('excellent')
    ).length;

    const constructiveCheckIns = checkIns.filter(
      c =>
        c.notes?.toLowerCase().includes('improve') ||
        c.notes?.toLowerCase().includes('better') ||
        c.notes?.toLowerCase().includes('enhance')
    ).length;

    const totalCheckIns = checkIns.length;
    if (totalCheckIns === 0) return 'positive';

    const positiveRatio = positiveCheckIns / totalCheckIns;
    const constructiveRatio = constructiveCheckIns / totalCheckIns;

    if (positiveRatio > 0.5) return 'positive';
    if (constructiveRatio > 0.3) return 'constructive';
    return 'neutral';
  }

  private analyzeFeedbackFormatPreference(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): SupportSystemProfile['feedbackPreferences']['format'] {
    // Analyze preference for feedback format
    const textCheckIns = checkIns.filter(
      c => c.notes && c.notes.length > 0
    ).length;
    const totalCheckIns = checkIns.length;

    if (totalCheckIns === 0) return 'text';

    const textRatio = textCheckIns / totalCheckIns;

    if (textRatio > 0.8) return 'text';
    if (textRatio > 0.4) return 'mixed';
    return 'visual';
  }

  private calculateSupportSystemConfidence(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    const dataPoints = sessions.length + checkIns.length;
    const consistency = this.calculateDataConsistency(sessions, checkIns);
    return Math.min(1, (dataPoints / 15) * consistency);
  }

  private getDefaultSupportSystemProfile(userId: string): SupportSystemProfile {
    return {
      userId,
      preferredSupportTypes: {
        instructional: 0.5,
        motivational: 0.6,
        technical: 0.4,
        social: 0.5,
        emotional: 0.4,
      },
      communicationStyle: {
        direct: 0.5,
        encouraging: 0.7,
        detailed: 0.5,
        concise: 0.5,
        casual: 0.5,
        formal: 0.5,
      },
      feedbackPreferences: {
        frequency: 'daily',
        detail: 'moderate',
        tone: 'positive',
        format: 'text',
      },
      lastUpdated: new Date(),
      confidence: 0.3,
    };
  }

  // Personalization Insights Generation
  async generatePersonalizationInsights(
    userId: string
  ): Promise<PersonalizationInsights> {
    try {
      const learningStyle = this.getLearningStyleProfile(userId);
      const motivation = this.getMotivationProfile(userId);
      const challengeLevel = this.challengeLevelProfiles.get(userId);
      const supportSystem = this.supportSystemProfiles.get(userId);

      const insights = this.analyzePersonalizationInsights(
        learningStyle,
        motivation,
        challengeLevel,
        supportSystem
      );

      const personalizationInsights: PersonalizationInsights = {
        userId,
        insights,
        lastUpdated: new Date(),
      };

      this.personalizationInsights.set(userId, personalizationInsights);
      return personalizationInsights;
    } catch (error) {
      console.error('Error generating personalization insights:', error);
      throw error;
    }
  }

  private analyzePersonalizationInsights(
    learningStyle: LearningStyleProfile | null,
    motivation: MotivationProfile | null,
    challengeLevel: ChallengeLevelProfile | null,
    supportSystem: SupportSystemProfile | null
  ): PersonalizationInsights['insights'] {
    const insights = [];

    if (learningStyle) {
      insights.push(...this.generateLearningStyleInsights(learningStyle));
    }

    if (motivation) {
      insights.push(...this.generateMotivationInsights(motivation));
    }

    if (challengeLevel) {
      insights.push(...this.generateChallengeLevelInsights(challengeLevel));
    }

    if (supportSystem) {
      insights.push(...this.generateSupportSystemInsights(supportSystem));
    }

    return insights;
  }

  private generateLearningStyleInsights(
    learningStyle: LearningStyleProfile
  ): PersonalizationInsights['insights'] {
    const insights = [];

    // Visual learning insight
    if (learningStyle.visualPreference > 0.7) {
      insights.push({
        type: 'learning_style',
        title: 'Visual Learning Preference',
        description:
          'You show a strong preference for visual learning methods. Consider using more diagrams, videos, and visual demonstrations in your training.',
        confidence: learningStyle.confidence,
        actionable: true,
        priority: 'high',
        recommendations: [
          'Use video demonstrations for new exercises',
          'Include visual progress charts',
          'Add form check videos to your routine',
        ],
      });
    }

    // Kinesthetic learning insight
    if (learningStyle.kinestheticPreference > 0.7) {
      insights.push({
        type: 'learning_style',
        title: 'Kinesthetic Learning Preference',
        description:
          'You learn best through hands-on practice and physical movement. Focus on practical exercises and immediate application.',
        confidence: learningStyle.confidence,
        actionable: true,
        priority: 'high',
        recommendations: [
          'Practice exercises immediately after learning',
          'Use physical cues and body awareness',
          'Focus on movement patterns and muscle memory',
        ],
      });
    }

    return insights;
  }

  private generateMotivationInsights(
    motivation: MotivationProfile
  ): PersonalizationInsights['insights'] {
    const insights = [];

    // Intrinsic motivation insight
    if (motivation.intrinsicMotivation > 0.7) {
      insights.push({
        type: 'motivation',
        title: 'High Intrinsic Motivation',
        description:
          'You are highly motivated by internal factors. Focus on personal growth and self-improvement goals.',
        confidence: motivation.confidence,
        actionable: true,
        priority: 'medium',
        recommendations: [
          'Set personal mastery goals',
          'Track personal progress and improvements',
          'Focus on the joy of movement and exercise',
        ],
      });
    }

    // Social motivation insight
    if (motivation.socialMotivation > 0.7) {
      insights.push({
        type: 'motivation',
        title: 'Social Motivation Preference',
        description:
          'You are motivated by social interaction and group activities. Consider joining group training sessions or finding a workout partner.',
        confidence: motivation.confidence,
        actionable: true,
        priority: 'high',
        recommendations: [
          'Join group training sessions',
          'Find a workout partner or training group',
          'Share your progress with friends and family',
        ],
      });
    }

    return insights;
  }

  private generateChallengeLevelInsights(
    challengeLevel: ChallengeLevelProfile
  ): PersonalizationInsights['insights'] {
    const insights = [];

    // Challenge level mismatch insight
    if (
      Math.abs(challengeLevel.currentLevel - challengeLevel.optimalLevel) > 2
    ) {
      insights.push({
        type: 'challenge',
        title: 'Challenge Level Mismatch',
        description: `Your current challenge level (${challengeLevel.currentLevel.toFixed(1)}) differs significantly from your optimal level (${challengeLevel.optimalLevel.toFixed(1)}). Consider adjusting your training intensity.`,
        confidence: challengeLevel.confidence,
        actionable: true,
        priority: 'high',
        recommendations: [
          'Gradually adjust training intensity',
          'Monitor your performance and motivation',
          'Stay within your stretch zone for optimal growth',
        ],
      });
    }

    return insights;
  }

  private generateSupportSystemInsights(
    supportSystem: SupportSystemProfile
  ): PersonalizationInsights['insights'] {
    const insights = [];

    // Communication style insight
    if (supportSystem.communicationStyle.encouraging > 0.7) {
      insights.push({
        type: 'support',
        title: 'Encouraging Communication Preference',
        description:
          'You respond well to encouraging and positive communication. The system will focus on providing uplifting feedback and motivation.',
        confidence: supportSystem.confidence,
        actionable: true,
        priority: 'medium',
        recommendations: [
          'Enable positive reinforcement features',
          'Use encouraging language in feedback',
          'Celebrate small wins and progress',
        ],
      });
    }

    return insights;
  }

  // Start personalization analysis
  private startPersonalizationAnalysis(): void {
    this.personalizationInterval = setInterval(() => {
      this.performPersonalizationAnalysis();
    }, 300000); // Every 5 minutes
  }

  private async performPersonalizationAnalysis(): Promise<void> {
    try {
      // Analyze learning styles for all users
      const userIds = ['current-user']; // In a real app, this would be dynamic

      for (const userId of userIds) {
        await this.analyzeLearningStyle(userId);
        await this.analyzeMotivationPatterns(userId);
        await this.analyzeChallengeLevel(userId);
        await this.analyzeSupportSystem(userId);
        await this.generatePersonalizationInsights(userId);
      }
    } catch (error) {
      console.error('Error in personalization analysis:', error);
    }
  }

  // Additional getters
  getChallengeLevelProfile(userId: string): ChallengeLevelProfile | null {
    return this.challengeLevelProfiles.get(userId) || null;
  }

  getSupportSystemProfile(userId: string): SupportSystemProfile | null {
    return this.supportSystemProfiles.get(userId) || null;
  }

  getPersonalizationInsights(userId: string): PersonalizationInsights | null {
    return this.personalizationInsights.get(userId) || null;
  }

  // Cleanup
  destroy(): void {
    if (this.personalizationInterval) {
      clearInterval(this.personalizationInterval);
    }
    this.saveData();
  }
}

// Export singleton instance
export const deepPersonalization = new DeepPersonalizationService();
