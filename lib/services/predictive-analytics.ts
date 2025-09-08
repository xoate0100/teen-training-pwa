'use client';

import { DatabaseService, SessionData, CheckInData } from './database-service';

export interface PerformanceForecast {
  userId: string;
  exerciseId: string;
  exerciseName: string;
  currentMax: number;
  predictedMax: number;
  confidence: number;
  timeframe: number; // days
  factors: {
    historicalProgress: number;
    consistency: number;
    recovery: number;
    nutrition: number;
    sleep: number;
    stress: number;
  };
  recommendations: string[];
  riskFactors: string[];
}

export interface SkillDevelopmentTrajectory {
  userId: string;
  skillArea: string;
  currentLevel: number;
  targetLevel: number;
  estimatedTimeToTarget: number; // days
  milestones: {
    level: number;
    description: string;
    estimatedDate: Date;
    prerequisites: string[];
  }[];
  learningCurve: {
    phase: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    characteristics: string[];
    focusAreas: string[];
    expectedProgress: number;
  };
}

export interface GoalAchievementTimeline {
  userId: string;
  goalId: string;
  goalDescription: string;
  currentProgress: number;
  targetValue: number;
  estimatedCompletionDate: Date;
  confidence: number;
  milestones: {
    date: Date;
    targetValue: number;
    description: string;
  }[];
  blockers: {
    type: 'consistency' | 'recovery' | 'technique' | 'motivation' | 'external';
    description: string;
    impact: number;
    solutions: string[];
  }[];
}

export interface PlateauDetection {
  userId: string;
  exerciseId: string;
  exerciseName: string;
  plateauStartDate: Date;
  plateauDuration: number; // days
  severity: 'low' | 'medium' | 'high';
  causes: {
    type:
      | 'overtraining'
      | 'undertraining'
      | 'poor_recovery'
      | 'technique'
      | 'nutrition'
      | 'motivation';
    description: string;
    confidence: number;
  }[];
  recommendations: {
    type:
      | 'deload'
      | 'variation'
      | 'technique'
      | 'recovery'
      | 'nutrition'
      | 'motivation';
    description: string;
    priority: number;
    expectedOutcome: string;
  }[];
}

export interface RiskAssessment {
  userId: string;
  assessmentDate: Date;
  overallRisk: number; // 0-100
  riskFactors: {
    type: 'injury' | 'overtraining' | 'burnout' | 'plateau' | 'motivation';
    level: 'low' | 'medium' | 'high' | 'critical';
    score: number;
    description: string;
    contributingFactors: string[];
    mitigationStrategies: string[];
  }[];
  recommendations: {
    priority: 'immediate' | 'short_term' | 'long_term';
    action: string;
    expectedImpact: string;
  }[];
}

export interface OptimizationRecommendation {
  userId: string;
  type: 'training_load' | 'schedule' | 'exercise_selection' | 'recovery';
  currentState: any;
  recommendedState: any;
  expectedImprovement: number; // percentage
  implementationDifficulty: 'easy' | 'medium' | 'hard';
  timeToImplement: number; // days
  description: string;
  steps: string[];
}

export class PredictiveAnalyticsService {
  private databaseService = new DatabaseService();
  private forecastCache: Map<string, PerformanceForecast[]> = new Map();
  private trajectoryCache: Map<string, SkillDevelopmentTrajectory[]> =
    new Map();
  private goalCache: Map<string, GoalAchievementTimeline[]> = new Map();
  private plateauCache: Map<string, PlateauDetection[]> = new Map();
  private riskCache: Map<string, RiskAssessment> = new Map();

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    // Initialize any required services or configurations
  }

  // Performance Forecasting
  async generatePerformanceForecast(
    userId: string,
    exerciseId: string,
    timeframe: number = 30
  ): Promise<PerformanceForecast> {
    const cacheKey = `${userId}_${exerciseId}_${timeframe}`;

    // Check cache first
    if (this.forecastCache.has(cacheKey)) {
      const cached = this.forecastCache.get(cacheKey);
      if (cached && cached.length > 0) {
        return cached[0];
      }
    }

    try {
      // Get historical data
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      // Filter data for specific exercise
      const exerciseSessions = sessions.filter(session =>
        session.exercises.some(ex => ex.id === exerciseId)
      );

      if (exerciseSessions.length < 3) {
        throw new Error('Insufficient data for forecasting');
      }

      // Extract performance data
      const performanceData = this.extractPerformanceData(
        exerciseSessions,
        exerciseId
      );

      // Calculate current max
      const currentMax = Math.max(...performanceData.map(d => d.maxWeight));

      // Generate forecast
      const forecast = await this.calculatePerformanceForecast(
        performanceData,
        currentMax,
        timeframe,
        checkIns
      );

      // Cache the result
      this.forecastCache.set(cacheKey, [forecast]);

      return forecast;
    } catch (error) {
      console.error('Error generating performance forecast:', error);
      throw error;
    }
  }

  // Skill Development Trajectory
  async generateSkillDevelopmentTrajectory(
    userId: string,
    skillArea: string
  ): Promise<SkillDevelopmentTrajectory> {
    const cacheKey = `${userId}_${skillArea}`;

    // Check cache first
    if (this.trajectoryCache.has(cacheKey)) {
      const cached = this.trajectoryCache.get(cacheKey);
      if (cached && cached.length > 0) {
        return cached[0];
      }
    }

    try {
      // Get user data
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      // Analyze skill progression
      const trajectory = await this.calculateSkillTrajectory(
        sessions,
        checkIns,
        skillArea
      );

      // Cache the result
      this.trajectoryCache.set(cacheKey, [trajectory]);

      return trajectory;
    } catch (error) {
      console.error('Error generating skill trajectory:', error);
      throw error;
    }
  }

  // Goal Achievement Timeline
  async generateGoalAchievementTimeline(
    userId: string,
    goalId: string,
    goalDescription: string,
    targetValue: number
  ): Promise<GoalAchievementTimeline> {
    const cacheKey = `${userId}_${goalId}`;

    // Check cache first
    if (this.goalCache.has(cacheKey)) {
      const cached = this.goalCache.get(cacheKey);
      if (cached && cached.length > 0) {
        return cached[0];
      }
    }

    try {
      // Get user data
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      // Calculate current progress
      const currentProgress = this.calculateCurrentProgress(
        sessions,
        checkIns,
        goalId
      );

      // Generate timeline
      const timeline = await this.calculateGoalTimeline(
        currentProgress,
        targetValue,
        sessions,
        checkIns
      );

      // Cache the result
      this.goalCache.set(cacheKey, [timeline]);

      return timeline;
    } catch (error) {
      console.error('Error generating goal timeline:', error);
      throw error;
    }
  }

  // Plateau Detection
  async detectPlateaus(userId: string): Promise<PlateauDetection[]> {
    const cacheKey = userId;

    // Check cache first
    if (this.plateauCache.has(cacheKey)) {
      return this.plateauCache.get(cacheKey)!;
    }

    try {
      // Get user data
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      // Detect plateaus
      const plateaus = await this.analyzePlateaus(sessions, checkIns);

      // Cache the result
      this.plateauCache.set(cacheKey, plateaus);

      return plateaus;
    } catch (error) {
      console.error('Error detecting plateaus:', error);
      throw error;
    }
  }

  // Risk Assessment
  async generateRiskAssessment(userId: string): Promise<RiskAssessment> {
    const cacheKey = userId;

    // Check cache first
    if (this.riskCache.has(cacheKey)) {
      return this.riskCache.get(cacheKey)!;
    }

    try {
      // Get user data
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      // Generate risk assessment
      const assessment = await this.calculateRiskAssessment(sessions, checkIns);

      // Cache the result
      this.riskCache.set(cacheKey, assessment);

      return assessment;
    } catch (error) {
      console.error('Error generating risk assessment:', error);
      throw error;
    }
  }

  // Optimization Recommendations
  async generateOptimizationRecommendations(
    userId: string
  ): Promise<OptimizationRecommendation[]> {
    try {
      // Get user data
      const sessions = await this.databaseService.getSessions(userId);
      const checkIns = await this.databaseService.getCheckIns(userId);

      // Generate recommendations
      const recommendations = await this.calculateOptimizationRecommendations(
        sessions,
        checkIns
      );

      return recommendations;
    } catch (error) {
      console.error('Error generating optimization recommendations:', error);
      throw error;
    }
  }

  // Helper Methods
  private extractPerformanceData(sessions: SessionData[], exerciseId: string) {
    const performanceData: Array<{
      date: Date;
      maxWeight: number;
      reps: number;
      sets: number;
      rpe: number;
    }> = [];

    sessions.forEach(session => {
      const exercise = session.exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
        const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);
        const avgRPE =
          exercise.sets.reduce((sum, set) => sum + (set.rpe || 0), 0) /
          exercise.sets.length;

        performanceData.push({
          date: new Date(session.date),
          maxWeight,
          reps: totalReps,
          sets: exercise.sets.length,
          rpe: avgRPE,
        });
      }
    });

    return performanceData.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private async calculatePerformanceForecast(
    performanceData: any[],
    currentMax: number,
    timeframe: number,
    checkIns: CheckInData[]
  ): Promise<PerformanceForecast> {
    // Calculate trend
    const trend = this.calculateTrend(performanceData);

    // Calculate factors
    const factors = this.calculatePerformanceFactors(performanceData, checkIns);

    // Predict future performance
    const predictedMax = this.predictFuturePerformance(
      currentMax,
      trend,
      factors,
      timeframe
    );

    // Calculate confidence
    const confidence = this.calculateConfidence(performanceData, factors);

    // Generate recommendations
    const recommendations = this.generatePerformanceRecommendations(
      factors,
      predictedMax
    );

    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(factors);

    return {
      userId: 'current-user',
      exerciseId: performanceData[0]?.exerciseId || 'unknown',
      exerciseName: 'Exercise',
      currentMax,
      predictedMax,
      confidence,
      timeframe,
      factors,
      recommendations,
      riskFactors,
    };
  }

  private calculateTrend(performanceData: any[]): number {
    if (performanceData.length < 2) return 0;

    const firstHalf = performanceData.slice(
      0,
      Math.floor(performanceData.length / 2)
    );
    const secondHalf = performanceData.slice(
      Math.floor(performanceData.length / 2)
    );

    const firstAvg =
      firstHalf.reduce((sum, d) => sum + d.maxWeight, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, d) => sum + d.maxWeight, 0) / secondHalf.length;

    return (secondAvg - firstAvg) / firstAvg;
  }

  private calculatePerformanceFactors(
    performanceData: any[],
    checkIns: CheckInData[]
  ) {
    // Calculate historical progress
    const historicalProgress = this.calculateTrend(performanceData);

    // Calculate consistency
    const consistency = this.calculateConsistency(performanceData);

    // Calculate recovery metrics
    const recovery = this.calculateRecoveryMetrics(checkIns);

    // Calculate nutrition score
    const nutrition = this.calculateNutritionScore(checkIns);

    // Calculate sleep quality
    const sleep = this.calculateSleepQuality(checkIns);

    // Calculate stress level
    const stress = this.calculateStressLevel(checkIns);

    return {
      historicalProgress: Math.max(0, Math.min(1, historicalProgress + 0.5)),
      consistency: Math.max(0, Math.min(1, consistency)),
      recovery: Math.max(0, Math.min(1, recovery)),
      nutrition: Math.max(0, Math.min(1, nutrition)),
      sleep: Math.max(0, Math.min(1, sleep)),
      stress: Math.max(0, Math.min(1, 1 - stress)), // Invert stress for positive impact
    };
  }

  private calculateConsistency(performanceData: any[]): number {
    if (performanceData.length < 3) return 0.5;

    const intervals = [];
    for (let i = 1; i < performanceData.length; i++) {
      const interval =
        performanceData[i].date.getTime() -
        performanceData[i - 1].date.getTime();
      intervals.push(interval);
    }

    const avgInterval =
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const variance =
      intervals.reduce(
        (sum, interval) => sum + Math.pow(interval - avgInterval, 2),
        0
      ) / intervals.length;
    const coefficient = Math.sqrt(variance) / avgInterval;

    return Math.max(0, 1 - coefficient);
  }

  private calculateRecoveryMetrics(checkIns: CheckInData[]): number {
    if (checkIns.length === 0) return 0.5;

    const recentCheckIns = checkIns.slice(-7); // Last 7 days
    const avgRecovery =
      recentCheckIns.reduce(
        (sum, checkIn) => sum + (checkIn.recovery || 5),
        0
      ) / recentCheckIns.length;

    return avgRecovery / 10; // Normalize to 0-1
  }

  private calculateNutritionScore(checkIns: CheckInData[]): number {
    if (checkIns.length === 0) return 0.5;

    const recentCheckIns = checkIns.slice(-7);
    const avgNutrition =
      recentCheckIns.reduce(
        (sum, checkIn) => sum + (checkIn.nutrition || 5),
        0
      ) / recentCheckIns.length;

    return avgNutrition / 10;
  }

  private calculateSleepQuality(checkIns: CheckInData[]): number {
    if (checkIns.length === 0) return 0.5;

    const recentCheckIns = checkIns.slice(-7);
    const avgSleep =
      recentCheckIns.reduce((sum, checkIn) => sum + (checkIn.sleep || 5), 0) /
      recentCheckIns.length;

    return avgSleep / 10;
  }

  private calculateStressLevel(checkIns: CheckInData[]): number {
    if (checkIns.length === 0) return 0.5;

    const recentCheckIns = checkIns.slice(-7);
    const avgStress =
      recentCheckIns.reduce((sum, checkIn) => sum + (checkIn.stress || 5), 0) /
      recentCheckIns.length;

    return avgStress / 10;
  }

  private predictFuturePerformance(
    currentMax: number,
    trend: number,
    factors: any,
    timeframe: number
  ): number {
    // Weighted average of factors
    const factorWeight =
      factors.historicalProgress * 0.3 +
      factors.consistency * 0.2 +
      factors.recovery * 0.2 +
      factors.nutrition * 0.1 +
      factors.sleep * 0.1 +
      factors.stress * 0.1;

    // Calculate predicted improvement
    const improvementRate = trend * factorWeight;
    const predictedImprovement =
      currentMax * improvementRate * (timeframe / 30); // Monthly rate

    return Math.max(currentMax, currentMax + predictedImprovement);
  }

  private calculateConfidence(performanceData: any[], factors: any): number {
    const dataPoints = performanceData.length;
    const dataQuality = Math.min(1, dataPoints / 10); // More data = higher confidence

    const factorConsistency =
      Object.values(factors).reduce(
        (sum: number, factor: number) => sum + factor,
        0
      ) / Object.keys(factors).length;

    return (dataQuality * 0.7 + factorConsistency * 0.3) * 100;
  }

  private generatePerformanceRecommendations(
    factors: any,
    predictedMax: number
  ): string[] {
    const recommendations: string[] = [];

    if (factors.consistency < 0.6) {
      recommendations.push(
        'Focus on consistent training schedule to improve progress'
      );
    }

    if (factors.recovery < 0.6) {
      recommendations.push('Prioritize recovery with adequate rest and sleep');
    }

    if (factors.nutrition < 0.6) {
      recommendations.push('Optimize nutrition to support strength gains');
    }

    if (factors.sleep < 0.6) {
      recommendations.push(
        'Improve sleep quality for better recovery and performance'
      );
    }

    if (factors.stress < 0.6) {
      recommendations.push(
        'Manage stress levels to optimize training adaptation'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Great job! Keep up the consistent training and recovery'
      );
    }

    return recommendations;
  }

  private identifyRiskFactors(factors: any): string[] {
    const riskFactors: string[] = [];

    if (factors.consistency < 0.4) {
      riskFactors.push('Inconsistent training may lead to suboptimal progress');
    }

    if (factors.recovery < 0.4) {
      riskFactors.push('Poor recovery may increase injury risk');
    }

    if (factors.stress > 0.8) {
      riskFactors.push(
        'High stress levels may impair performance and recovery'
      );
    }

    return riskFactors;
  }

  // Additional helper methods for other calculations would go here...
  private async calculateSkillTrajectory(
    sessions: SessionData[],
    checkIns: CheckInData[],
    skillArea: string
  ): Promise<SkillDevelopmentTrajectory> {
    // Implementation for skill trajectory calculation
    return {
      userId: 'current-user',
      skillArea,
      currentLevel: 3,
      targetLevel: 7,
      estimatedTimeToTarget: 180,
      milestones: [],
      learningCurve: {
        phase: 'intermediate',
        characteristics: ['Consistent practice', 'Technique refinement'],
        focusAreas: ['Form improvement', 'Progressive overload'],
        expectedProgress: 0.1,
      },
    };
  }

  private calculateCurrentProgress(
    sessions: SessionData[],
    checkIns: CheckInData[],
    goalId: string
  ): number {
    // Implementation for current progress calculation
    return 0.6; // 60% progress
  }

  private async calculateGoalTimeline(
    currentProgress: number,
    targetValue: number,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<GoalAchievementTimeline> {
    // Implementation for goal timeline calculation
    return {
      userId: 'current-user',
      goalId: 'goal-1',
      goalDescription: 'Sample Goal',
      currentProgress,
      targetValue,
      estimatedCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      confidence: 0.8,
      milestones: [],
      blockers: [],
    };
  }

  private async analyzePlateaus(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<PlateauDetection[]> {
    // Implementation for plateau detection
    return [];
  }

  private async calculateRiskAssessment(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<RiskAssessment> {
    const riskFactors: RiskAssessment['riskFactors'] = [];
    let overallRisk = 0;

    // Injury Risk Assessment
    const injuryRisk = this.assessInjuryRisk(sessions, checkIns);
    if (injuryRisk.score > 0) {
      riskFactors.push(injuryRisk);
      overallRisk += injuryRisk.score * 0.3;
    }

    // Overtraining Detection
    const overtrainingRisk = this.assessOvertrainingRisk(sessions, checkIns);
    if (overtrainingRisk.score > 0) {
      riskFactors.push(overtrainingRisk);
      overallRisk += overtrainingRisk.score * 0.25;
    }

    // Burnout Prevention
    const burnoutRisk = this.assessBurnoutRisk(sessions, checkIns);
    if (burnoutRisk.score > 0) {
      riskFactors.push(burnoutRisk);
      overallRisk += burnoutRisk.score * 0.2;
    }

    // Recovery Optimization
    const recoveryRisk = this.assessRecoveryRisk(sessions, checkIns);
    if (recoveryRisk.score > 0) {
      riskFactors.push(recoveryRisk);
      overallRisk += recoveryRisk.score * 0.25;
    }

    // Generate recommendations based on risk factors
    const recommendations = this.generateRiskRecommendations(
      riskFactors,
      overallRisk
    );

    return {
      userId: 'current-user',
      assessmentDate: new Date(),
      overallRisk: Math.min(100, Math.round(overallRisk)),
      riskFactors,
      recommendations,
    };
  }

  private async calculateOptimizationRecommendations(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];

    // Training Load Optimization
    const trainingLoadRec = this.optimizeTrainingLoad(sessions, checkIns);
    if (trainingLoadRec) {
      recommendations.push(trainingLoadRec);
    }

    // Schedule Efficiency Improvements
    const scheduleRec = this.optimizeSchedule(sessions, checkIns);
    if (scheduleRec) {
      recommendations.push(scheduleRec);
    }

    // Exercise Selection Optimization
    const exerciseRec = this.optimizeExerciseSelection(sessions, checkIns);
    if (exerciseRec) {
      recommendations.push(exerciseRec);
    }

    // Recovery Strategy Enhancement
    const recoveryRec = this.optimizeRecoveryStrategy(sessions, checkIns);
    if (recoveryRec) {
      recommendations.push(recoveryRec);
    }

    return recommendations;
  }

  private optimizeTrainingLoad(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): OptimizationRecommendation | null {
    const recentSessions = sessions.slice(-14); // Last 2 weeks
    if (recentSessions.length < 7) return null;

    const currentLoad = this.calculateWeeklyLoad(recentSessions);
    const loadProgression = this.calculateLoadProgression(recentSessions);
    const avgRecovery = this.calculateAverageRecovery(checkIns.slice(-7));

    let recommendedLoad = currentLoad;
    let improvement = 0;
    let description = '';
    let steps: string[] = [];

    if (loadProgression > 0.2 && avgRecovery < 6) {
      // Reduce load due to rapid progression and poor recovery
      recommendedLoad = currentLoad * 0.85;
      improvement = 15;
      description =
        'Reduce training load to prevent overtraining and improve recovery';
      steps = [
        'Reduce weekly training volume by 15%',
        'Focus on technique over intensity',
        'Implement deload week every 4-6 weeks',
        'Monitor recovery scores daily',
      ];
    } else if (loadProgression < -0.1 && avgRecovery > 7) {
      // Increase load due to declining progression and good recovery
      recommendedLoad = currentLoad * 1.1;
      improvement = 10;
      description = 'Gradually increase training load to optimize progress';
      steps = [
        'Increase weekly training volume by 10%',
        'Add one additional set per exercise',
        'Progressive overload on main lifts',
        'Monitor performance and recovery',
      ];
    } else if (Math.abs(loadProgression) < 0.05) {
      // Maintain current load with slight variation
      recommendedLoad = currentLoad * 1.05;
      improvement = 5;
      description =
        'Add slight variation to training load for continued adaptation';
      steps = [
        'Add 5% to weekly training volume',
        'Vary exercise selection slightly',
        'Maintain current progression rate',
        'Continue monitoring recovery',
      ];
    } else {
      return null; // No optimization needed
    }

    return {
      userId: 'current-user',
      type: 'training_load',
      currentState: { weeklyLoad: currentLoad, progression: loadProgression },
      recommendedState: { weeklyLoad: recommendedLoad, targetProgression: 0.1 },
      expectedImprovement: improvement,
      implementationDifficulty: improvement > 10 ? 'medium' : 'easy',
      timeToImplement: 7,
      description,
      steps,
    };
  }

  private optimizeSchedule(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): OptimizationRecommendation | null {
    const recentSessions = sessions.slice(-30); // Last 30 days
    if (recentSessions.length < 10) return null;

    const currentFrequency = this.calculateTrainingFrequency(recentSessions);
    const consistency = this.calculateSessionConsistency(recentSessions);
    const avgRecovery = this.calculateAverageRecovery(checkIns.slice(-7));

    let recommendedFrequency = currentFrequency;
    let improvement = 0;
    let description = '';
    let steps: string[] = [];

    if (currentFrequency > 6 && avgRecovery < 6) {
      // Reduce frequency due to overtraining
      recommendedFrequency = 4;
      improvement = 20;
      description =
        'Reduce training frequency to improve recovery and prevent burnout';
      steps = [
        'Reduce to 4 training sessions per week',
        'Add 2-3 rest days between sessions',
        'Focus on quality over quantity',
        'Implement active recovery on rest days',
      ];
    } else if (currentFrequency < 3 && avgRecovery > 7) {
      // Increase frequency due to undertraining
      recommendedFrequency = 4;
      improvement = 15;
      description = 'Increase training frequency to optimize progress';
      steps = [
        'Increase to 4 training sessions per week',
        'Maintain 48-72 hours between similar sessions',
        'Gradually build up training volume',
        'Monitor recovery and adjust as needed',
      ];
    } else if (consistency < 0.6) {
      // Improve consistency
      improvement = 10;
      description = 'Improve training consistency for better results';
      steps = [
        'Set specific training days and times',
        'Create workout reminders and notifications',
        'Start with shorter, more manageable sessions',
        'Track attendance and celebrate consistency',
      ];
    } else {
      return null; // No optimization needed
    }

    return {
      userId: 'current-user',
      type: 'schedule',
      currentState: { frequency: currentFrequency, consistency },
      recommendedState: {
        frequency: recommendedFrequency,
        targetConsistency: 0.8,
      },
      expectedImprovement: improvement,
      implementationDifficulty: 'easy',
      timeToImplement: 3,
      description,
      steps,
    };
  }

  private optimizeExerciseSelection(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): OptimizationRecommendation | null {
    const recentSessions = sessions.slice(-14);
    if (recentSessions.length < 7) return null;

    const exerciseVariety = this.calculateExerciseVariety(recentSessions);
    const performanceTrend = this.calculatePerformanceTrend(recentSessions);
    const plateauRisk = this.assessPlateauRisk(recentSessions);

    let improvement = 0;
    let description = '';
    let steps: string[] = [];

    if (exerciseVariety < 0.3) {
      // Low variety - add more exercises
      improvement = 15;
      description =
        'Increase exercise variety to prevent plateaus and improve overall fitness';
      steps = [
        'Add 2-3 new exercises to your routine',
        'Rotate exercises every 4-6 weeks',
        'Include different movement patterns',
        'Focus on compound movements',
      ];
    } else if (plateauRisk > 0.7) {
      // High plateau risk - modify exercises
      improvement = 20;
      description = 'Modify exercise selection to break through plateaus';
      steps = [
        'Change exercise variations (e.g., barbell to dumbbell)',
        'Modify rep ranges and tempos',
        'Add supersets or drop sets',
        'Focus on weak points and imbalances',
      ];
    } else if (performanceTrend < -0.05) {
      // Declining performance - simplify selection
      improvement = 10;
      description = 'Simplify exercise selection to focus on fundamentals';
      steps = [
        'Reduce to 4-6 core exercises',
        'Focus on compound movements',
        'Master basic movement patterns',
        'Gradually add complexity back',
      ];
    } else {
      return null; // No optimization needed
    }

    return {
      userId: 'current-user',
      type: 'exercise_selection',
      currentState: { variety: exerciseVariety, plateauRisk, performanceTrend },
      recommendedState: {
        targetVariety: 0.5,
        targetPlateauRisk: 0.3,
        targetPerformanceTrend: 0.05,
      },
      expectedImprovement: improvement,
      implementationDifficulty: 'medium',
      timeToImplement: 14,
      description,
      steps,
    };
  }

  private optimizeRecoveryStrategy(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): OptimizationRecommendation | null {
    const recentCheckIns = checkIns.slice(-14);
    if (recentCheckIns.length < 7) return null;

    const avgRecovery = this.calculateAverageRecovery(recentCheckIns);
    const avgSleep = this.calculateAverageSleep(recentCheckIns);
    const avgStress = this.calculateAverageStress(recentCheckIns);
    const avgNutrition = this.calculateAverageNutrition(recentCheckIns);

    let improvement = 0;
    let description = '';
    let steps: string[] = [];

    if (avgRecovery < 6) {
      improvement = 25;
      description =
        'Improve recovery strategies to enhance performance and prevent burnout';

      if (avgSleep < 6) {
        steps.push('Prioritize 7-9 hours of quality sleep per night');
        steps.push('Create consistent sleep schedule');
        steps.push('Optimize sleep environment (dark, cool, quiet)');
      }

      if (avgStress > 7) {
        steps.push(
          'Implement stress management techniques (meditation, breathing)'
        );
        steps.push('Take regular breaks during the day');
        steps.push('Practice relaxation techniques before bed');
      }

      if (avgNutrition < 6) {
        steps.push('Focus on balanced nutrition with adequate protein');
        steps.push('Stay hydrated throughout the day');
        steps.push('Consider post-workout nutrition timing');
      }

      steps.push('Implement active recovery (light walking, stretching)');
      steps.push('Consider massage or foam rolling');
    } else if (avgRecovery > 8) {
      improvement = 10;
      description =
        'Maintain excellent recovery practices and consider increasing training load';
      steps = [
        'Continue current recovery practices',
        'Consider increasing training intensity',
        'Monitor for signs of undertraining',
        'Maintain current sleep and nutrition habits',
      ];
    } else {
      return null; // No optimization needed
    }

    return {
      userId: 'current-user',
      type: 'recovery',
      currentState: {
        recovery: avgRecovery,
        sleep: avgSleep,
        stress: avgStress,
        nutrition: avgNutrition,
      },
      recommendedState: {
        targetRecovery: 8,
        targetSleep: 8,
        targetStress: 4,
        targetNutrition: 8,
      },
      expectedImprovement: improvement,
      implementationDifficulty: 'medium',
      timeToImplement: 21,
      description,
      steps,
    };
  }

  // Helper methods for optimization calculations
  private calculateAverageRecovery(checkIns: CheckInData[]): number {
    if (checkIns.length === 0) return 5;
    return (
      checkIns.reduce((sum, checkIn) => sum + (checkIn.recovery || 5), 0) /
      checkIns.length
    );
  }

  private calculateAverageSleep(checkIns: CheckInData[]): number {
    if (checkIns.length === 0) return 5;
    return (
      checkIns.reduce((sum, checkIn) => sum + (checkIn.sleep || 5), 0) /
      checkIns.length
    );
  }

  private calculateAverageStress(checkIns: CheckInData[]): number {
    if (checkIns.length === 0) return 5;
    return (
      checkIns.reduce((sum, checkIn) => sum + (checkIn.stress || 5), 0) /
      checkIns.length
    );
  }

  private calculateAverageNutrition(checkIns: CheckInData[]): number {
    if (checkIns.length === 0) return 5;
    return (
      checkIns.reduce((sum, checkIn) => sum + (checkIn.nutrition || 5), 0) /
      checkIns.length
    );
  }

  private calculateExerciseVariety(sessions: SessionData[]): number {
    const exerciseSet = new Set();
    sessions.forEach(session => {
      session.exercises.forEach(exercise => {
        exerciseSet.add(exercise.name);
      });
    });

    // Normalize by number of sessions
    return exerciseSet.size / (sessions.length * 3); // Assuming 3 exercises per session average
  }

  private assessPlateauRisk(sessions: SessionData[]): number {
    if (sessions.length < 7) return 0;

    const performanceTrend = this.calculatePerformanceTrend(sessions);
    const exerciseVariety = this.calculateExerciseVariety(sessions);

    // Higher plateau risk if performance is declining and variety is low
    return Math.max(0, (1 - performanceTrend) * (1 - exerciseVariety));
  }

  // Risk Assessment Methods
  private assessInjuryRisk(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): RiskAssessment['riskFactors'][0] {
    let score = 0;
    const contributingFactors: string[] = [];
    const mitigationStrategies: string[] = [];

    // Analyze training load progression
    const recentSessions = sessions.slice(-14); // Last 2 weeks
    if (recentSessions.length >= 7) {
      const loadProgression = this.calculateLoadProgression(recentSessions);
      if (loadProgression > 0.2) {
        // >20% increase per week
        score += 30;
        contributingFactors.push('Rapid training load increase');
        mitigationStrategies.push('Reduce training load by 10-15%');
      }
    }

    // Analyze RPE trends
    const avgRPE = this.calculateAverageRPE(recentSessions);
    if (avgRPE > 8.5) {
      score += 25;
      contributingFactors.push('Consistently high perceived exertion');
      mitigationStrategies.push('Reduce intensity and focus on technique');
    }

    // Analyze recovery patterns
    const recentCheckIns = checkIns.slice(-7);
    const avgRecovery =
      recentCheckIns.reduce(
        (sum, checkIn) => sum + (checkIn.recovery || 5),
        0
      ) / recentCheckIns.length;
    if (avgRecovery < 6) {
      score += 20;
      contributingFactors.push('Poor recovery scores');
      mitigationStrategies.push('Improve sleep quality and stress management');
    }

    const level =
      score < 20
        ? 'low'
        : score < 40
          ? 'medium'
          : score < 60
            ? 'high'
            : 'critical';

    return {
      type: 'injury',
      level,
      score: Math.min(100, score),
      description: `Injury risk assessment based on training patterns and recovery metrics`,
      contributingFactors,
      mitigationStrategies,
    };
  }

  private assessOvertrainingRisk(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): RiskAssessment['riskFactors'][0] {
    let score = 0;
    const contributingFactors: string[] = [];
    const mitigationStrategies: string[] = [];

    // Analyze training frequency
    const trainingFrequency = this.calculateTrainingFrequency(sessions);
    if (trainingFrequency > 6) {
      // More than 6 sessions per week
      score += 20;
      contributingFactors.push('High training frequency');
      mitigationStrategies.push(
        'Reduce training frequency to 4-5 sessions per week'
      );
    }

    // Analyze performance trends
    const performanceTrend = this.calculatePerformanceTrend(sessions);
    if (performanceTrend < -0.05) {
      // Declining performance
      score += 30;
      contributingFactors.push('Declining performance indicators');
      mitigationStrategies.push('Take 3-5 days complete rest');
    }

    const level =
      score < 20
        ? 'low'
        : score < 40
          ? 'medium'
          : score < 60
            ? 'high'
            : 'critical';

    return {
      type: 'overtraining',
      level,
      score: Math.min(100, score),
      description: `Overtraining risk assessment based on training load and recovery patterns`,
      contributingFactors,
      mitigationStrategies,
    };
  }

  private assessBurnoutRisk(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): RiskAssessment['riskFactors'][0] {
    let score = 0;
    const contributingFactors: string[] = [];
    const mitigationStrategies: string[] = [];

    // Analyze motivation trends
    const motivationTrend = this.calculateMotivationTrend(checkIns);
    if (motivationTrend < -0.1) {
      // Declining motivation
      score += 25;
      contributingFactors.push('Declining motivation levels');
      mitigationStrategies.push('Take a break and reassess goals');
    }

    // Analyze session consistency
    const sessionConsistency = this.calculateSessionConsistency(sessions);
    if (sessionConsistency < 0.6) {
      score += 20;
      contributingFactors.push('Inconsistent training attendance');
      mitigationStrategies.push(
        'Simplify training routine and set smaller goals'
      );
    }

    const level =
      score < 20
        ? 'low'
        : score < 40
          ? 'medium'
          : score < 60
            ? 'high'
            : 'critical';

    return {
      type: 'burnout',
      level,
      score: Math.min(100, score),
      description: `Burnout risk assessment based on motivation, consistency, and psychological factors`,
      contributingFactors,
      mitigationStrategies,
    };
  }

  private assessRecoveryRisk(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): RiskAssessment['riskFactors'][0] {
    let score = 0;
    const contributingFactors: string[] = [];
    const mitigationStrategies: string[] = [];

    // Analyze recovery scores
    const recentCheckIns = checkIns.slice(-7);
    const avgRecovery =
      recentCheckIns.reduce(
        (sum, checkIn) => sum + (checkIn.recovery || 5),
        0
      ) / recentCheckIns.length;
    if (avgRecovery < 6) {
      score += 30;
      contributingFactors.push('Consistently low recovery scores');
      mitigationStrategies.push(
        'Implement active recovery and improve sleep hygiene'
      );
    }

    // Analyze sleep patterns
    const avgSleep =
      recentCheckIns.reduce((sum, checkIn) => sum + (checkIn.sleep || 5), 0) /
      recentCheckIns.length;
    if (avgSleep < 6) {
      score += 25;
      contributingFactors.push('Insufficient sleep duration');
      mitigationStrategies.push(
        'Prioritize 7-9 hours of quality sleep per night'
      );
    }

    const level =
      score < 20
        ? 'low'
        : score < 40
          ? 'medium'
          : score < 60
            ? 'high'
            : 'critical';

    return {
      type: 'recovery',
      level,
      score: Math.min(100, score),
      description: `Recovery risk assessment based on sleep, stress, nutrition, and training balance`,
      contributingFactors,
      mitigationStrategies,
    };
  }

  // Helper methods for risk assessment calculations
  private calculateLoadProgression(sessions: SessionData[]): number {
    if (sessions.length < 7) return 0;

    const firstWeek = sessions.slice(0, 7);
    const secondWeek = sessions.slice(7);

    const firstWeekLoad = this.calculateWeeklyLoad(firstWeek);
    const secondWeekLoad = this.calculateWeeklyLoad(secondWeek);

    return (secondWeekLoad - firstWeekLoad) / firstWeekLoad;
  }

  private calculateWeeklyLoad(sessions: SessionData[]): number {
    return sessions.reduce((total, session) => {
      const sessionLoad = session.exercises.reduce(
        (exerciseTotal, exercise) => {
          return (
            exerciseTotal +
            exercise.sets.reduce((setTotal, set) => {
              return setTotal + set.weight * set.reps * (set.rpe || 5);
            }, 0)
          );
        },
        0
      );
      return total + sessionLoad;
    }, 0);
  }

  private calculateAverageRPE(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;

    const allRPEs = sessions.flatMap(session =>
      session.exercises.flatMap(exercise =>
        exercise.sets.map(set => set.rpe || 5)
      )
    );

    return allRPEs.reduce((sum, rpe) => sum + rpe, 0) / allRPEs.length;
  }

  private calculateTrainingFrequency(sessions: SessionData[]): number {
    const recentSessions = sessions.slice(-30); // Last 30 days
    return recentSessions.length / 4.3; // Sessions per week
  }

  private calculatePerformanceTrend(sessions: SessionData[]): number {
    if (sessions.length < 7) return 0;

    const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2));
    const secondHalf = sessions.slice(Math.floor(sessions.length / 2));

    const firstAvg = this.calculateAverageIntensity(firstHalf);
    const secondAvg = this.calculateAverageIntensity(secondHalf);

    return (secondAvg - firstAvg) / firstAvg;
  }

  private calculateAverageIntensity(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;

    const allIntensities = sessions.flatMap(session =>
      session.exercises.flatMap(exercise =>
        exercise.sets.map(set => set.rpe || 5)
      )
    );

    return (
      allIntensities.reduce((sum, intensity) => sum + intensity, 0) /
      allIntensities.length
    );
  }

  private calculateMotivationTrend(checkIns: CheckInData[]): number {
    if (checkIns.length < 7) return 0;

    const firstHalf = checkIns.slice(0, Math.floor(checkIns.length / 2));
    const secondHalf = checkIns.slice(Math.floor(checkIns.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, checkIn) => sum + (checkIn.motivation || 5), 0) /
      firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, checkIn) => sum + (checkIn.motivation || 5), 0) /
      secondHalf.length;

    return (secondAvg - firstAvg) / firstAvg;
  }

  private calculateSessionConsistency(sessions: SessionData[]): number {
    if (sessions.length < 7) return 0.5;

    const intervals = [];
    for (let i = 1; i < sessions.length; i++) {
      const interval =
        sessions[i].date.getTime() - sessions[i - 1].date.getTime();
      intervals.push(interval);
    }

    const avgInterval =
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const variance =
      intervals.reduce(
        (sum, interval) => sum + Math.pow(interval - avgInterval, 2),
        0
      ) / intervals.length;
    const coefficient = Math.sqrt(variance) / avgInterval;

    return Math.max(0, 1 - coefficient);
  }

  private generateRiskRecommendations(
    riskFactors: RiskAssessment['riskFactors'],
    overallRisk: number
  ): RiskAssessment['recommendations'] {
    const recommendations: RiskAssessment['recommendations'] = [];

    if (overallRisk >= 80) {
      recommendations.push({
        priority: 'immediate',
        action:
          'Take immediate action to reduce training load and focus on recovery',
        expectedImpact: 'Prevent potential injury or burnout',
      });
    } else if (overallRisk >= 60) {
      recommendations.push({
        priority: 'short_term',
        action: 'Reduce training intensity and implement recovery strategies',
        expectedImpact: 'Lower risk levels within 1-2 weeks',
      });
    } else if (overallRisk >= 40) {
      recommendations.push({
        priority: 'long_term',
        action: 'Monitor risk factors and make gradual adjustments',
        expectedImpact: 'Maintain healthy training balance',
      });
    } else {
      recommendations.push({
        priority: 'long_term',
        action: 'Continue current approach with regular monitoring',
        expectedImpact: 'Maintain optimal training conditions',
      });
    }

    return recommendations;
  }

  // Clear caches
  clearCache(): void {
    this.forecastCache.clear();
    this.trajectoryCache.clear();
    this.goalCache.clear();
    this.plateauCache.clear();
    this.riskCache.clear();
  }
}

// Export singleton instance
export const predictiveAnalytics = new PredictiveAnalyticsService();
