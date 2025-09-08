'use client';

import { SessionData, CheckInData } from '@/lib/services/database-service';
import {
  WellnessInsights,
  MoodData,
  SleepData,
  EnergyData,
  RecoveryData,
} from './wellness-analysis-service';

export interface OvertrainingPrediction {
  userId: string;
  timestamp: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  probability: number; // 0-1 scale
  factors: {
    trainingLoad: number;
    recoveryTime: number;
    sleepQuality: number;
    stressLevel: number;
    performanceTrend: number;
  };
  symptoms: string[];
  recommendations: string[];
  timeline: string;
  confidence: number;
}

export interface BurnoutRiskAssessment {
  userId: string;
  timestamp: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  probability: number; // 0-1 scale
  factors: {
    motivation: number;
    enjoyment: number;
    stress: number;
    fatigue: number;
    socialSupport: number;
  };
  warningSigns: string[];
  interventions: string[];
  timeline: string;
  confidence: number;
}

export interface OptimalTrainingLoad {
  userId: string;
  timestamp: string;
  currentLoad: number;
  optimalLoad: number;
  loadRatio: number; // current/optimal
  recommendations: {
    intensity: number; // 1-10 scale
    volume: number; // sessions per week
    duration: number; // minutes per session
    frequency: number; // days per week
  };
  progression: {
    nextWeek: number;
    nextMonth: number;
    nextQuarter: number;
  };
  confidence: number;
}

export interface RecoveryTimeRecommendation {
  userId: string;
  timestamp: string;
  currentRecovery: number; // 1-10 scale
  requiredRecovery: number; // 1-10 scale
  recoveryTime: number; // hours
  factors: {
    sleep: number;
    nutrition: number;
    stress: number;
    hydration: number;
    activeRecovery: number;
  };
  recommendations: string[];
  timeline: string;
  confidence: number;
}

export interface HealthPrediction {
  userId: string;
  timestamp: string;
  overtraining: OvertrainingPrediction;
  burnout: BurnoutRiskAssessment;
  trainingLoad: OptimalTrainingLoad;
  recovery: RecoveryTimeRecommendation;
  overallHealth: {
    score: number; // 1-10 scale
    trend: 'improving' | 'stable' | 'declining';
    riskFactors: string[];
    protectiveFactors: string[];
  };
  alerts: {
    type: 'warning' | 'critical' | 'info';
    message: string;
    action: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  lastUpdated: string;
}

export class PredictiveHealthService {
  // Predict overtraining risk
  static predictOvertrainingRisk(
    wellnessInsights: WellnessInsights,
    sessionData: SessionData[],
    recentSessions: SessionData[]
  ): OvertrainingPrediction {
    const trainingLoad = this.calculateTrainingLoad(recentSessions);
    const recoveryTime = this.calculateRecoveryTime(wellnessInsights);
    const sleepQuality = wellnessInsights.patterns.sleep.averageQuality;
    const stressLevel = this.calculateStressLevel(wellnessInsights);
    const performanceTrend = this.calculatePerformanceTrend(sessionData);

    const riskFactors = {
      trainingLoad,
      recoveryTime,
      sleepQuality,
      stressLevel,
      performanceTrend,
    };

    const probability = this.calculateOvertrainingProbability(riskFactors);
    const riskLevel = this.determineRiskLevel(probability);

    return {
      userId: wellnessInsights.userId,
      timestamp: new Date().toISOString(),
      riskLevel,
      probability,
      factors: riskFactors,
      symptoms: this.identifyOvertrainingSymptoms(riskFactors),
      recommendations: this.generateOvertrainingRecommendations(
        riskLevel,
        riskFactors
      ),
      timeline: this.estimateOvertrainingTimeline(probability),
      confidence: this.calculateOvertrainingConfidence(riskFactors),
    };
  }

  // Assess burnout risk
  static assessBurnoutRisk(
    wellnessInsights: WellnessInsights,
    sessionData: SessionData[],
    checkInData: CheckInData[]
  ): BurnoutRiskAssessment {
    const motivation = this.calculateMotivationLevel(
      wellnessInsights,
      checkInData
    );
    const enjoyment = this.calculateEnjoymentLevel(sessionData, checkInData);
    const stress = this.calculateStressLevel(wellnessInsights);
    const fatigue = this.calculateFatigueLevel(wellnessInsights);
    const socialSupport = this.calculateSocialSupportLevel(checkInData);

    const factors = {
      motivation,
      enjoyment,
      stress,
      fatigue,
      socialSupport,
    };

    const probability = this.calculateBurnoutProbability(factors);
    const riskLevel = this.determineRiskLevel(probability);

    return {
      userId: wellnessInsights.userId,
      timestamp: new Date().toISOString(),
      riskLevel,
      probability,
      factors,
      warningSigns: this.identifyBurnoutWarningSigns(factors),
      interventions: this.generateBurnoutInterventions(riskLevel, factors),
      timeline: this.estimateBurnoutTimeline(probability),
      confidence: this.calculateBurnoutConfidence(factors),
    };
  }

  // Calculate optimal training load
  static calculateOptimalTrainingLoad(
    wellnessInsights: WellnessInsights,
    sessionData: SessionData[],
    userGoals: string[]
  ): OptimalTrainingLoad {
    const currentLoad = this.calculateCurrentTrainingLoad(sessionData);
    const optimalLoad = this.calculateOptimalLoad(wellnessInsights, userGoals);
    const loadRatio = currentLoad / optimalLoad;

    const recommendations = this.generateTrainingLoadRecommendations(
      currentLoad,
      optimalLoad,
      wellnessInsights
    );

    const progression = this.calculateTrainingProgression(
      currentLoad,
      optimalLoad,
      wellnessInsights
    );

    return {
      userId: wellnessInsights.userId,
      timestamp: new Date().toISOString(),
      currentLoad,
      optimalLoad,
      loadRatio,
      recommendations,
      progression,
      confidence: this.calculateTrainingLoadConfidence(wellnessInsights),
    };
  }

  // Recommend recovery time
  static recommendRecoveryTime(
    wellnessInsights: WellnessInsights,
    lastSession: SessionData,
    upcomingSessions: SessionData[]
  ): RecoveryTimeRecommendation {
    const currentRecovery = wellnessInsights.patterns.recovery.averageReadiness;
    const requiredRecovery = this.calculateRequiredRecovery(
      lastSession,
      wellnessInsights
    );
    const recoveryTime = this.calculateRecoveryTimeHours(
      currentRecovery,
      requiredRecovery
    );

    const factors = this.analyzeRecoveryFactors(wellnessInsights);
    const recommendations = this.generateRecoveryRecommendations(
      factors,
      recoveryTime
    );

    return {
      userId: wellnessInsights.userId,
      timestamp: new Date().toISOString(),
      currentRecovery,
      requiredRecovery,
      recoveryTime,
      factors,
      recommendations,
      timeline: this.estimateRecoveryTimeline(recoveryTime),
      confidence: this.calculateRecoveryConfidence(wellnessInsights),
    };
  }

  // Generate comprehensive health prediction
  static generateHealthPrediction(
    wellnessInsights: WellnessInsights,
    sessionData: SessionData[],
    checkInData: CheckInData[],
    userGoals: string[]
  ): HealthPrediction {
    const overtraining = this.predictOvertrainingRisk(
      wellnessInsights,
      sessionData,
      sessionData.slice(-10) // Last 10 sessions
    );

    const burnout = this.assessBurnoutRisk(
      wellnessInsights,
      sessionData,
      checkInData
    );

    const trainingLoad = this.calculateOptimalTrainingLoad(
      wellnessInsights,
      sessionData,
      userGoals
    );

    const recovery = this.recommendRecoveryTime(
      wellnessInsights,
      sessionData[sessionData.length - 1],
      sessionData.slice(-5) // Next 5 sessions
    );

    const overallHealth = this.calculateOverallHealth(
      overtraining,
      burnout,
      trainingLoad,
      recovery
    );

    const alerts = this.generateHealthAlerts(
      overtraining,
      burnout,
      trainingLoad,
      recovery
    );

    return {
      userId: wellnessInsights.userId,
      timestamp: new Date().toISOString(),
      overtraining,
      burnout,
      trainingLoad,
      recovery,
      overallHealth,
      alerts,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Helper methods
  private static calculateTrainingLoad(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;

    // Mock implementation - in a real app, this would calculate actual training load
    const totalDuration = sessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    const avgIntensity =
      sessions.reduce((sum, session) => sum + (session.intensity || 5), 0) /
      sessions.length;

    return (totalDuration / 60) * avgIntensity; // Training load units
  }

  private static calculateRecoveryTime(
    wellnessInsights: WellnessInsights
  ): number {
    return wellnessInsights.patterns.recovery.recoveryTime;
  }

  private static calculateStressLevel(
    wellnessInsights: WellnessInsights
  ): number {
    // Mock implementation - in a real app, this would calculate actual stress
    return 10 - wellnessInsights.patterns.mood.average;
  }

  private static calculatePerformanceTrend(sessions: SessionData[]): number {
    if (sessions.length < 2) return 0;

    // Mock implementation - in a real app, this would calculate actual performance trend
    const recent = sessions.slice(-5);
    const older = sessions.slice(-10, -5);

    if (recent.length === 0 || older.length === 0) return 0;

    const recentAvg =
      recent.reduce((sum, s) => sum + (s.intensity || 5), 0) / recent.length;
    const olderAvg =
      older.reduce((sum, s) => sum + (s.intensity || 5), 0) / older.length;

    return recentAvg - olderAvg;
  }

  private static calculateOvertrainingProbability(factors: any): number {
    // Mock implementation - in a real app, this would use machine learning
    const weights = {
      trainingLoad: 0.3,
      recoveryTime: 0.25,
      sleepQuality: 0.2,
      stressLevel: 0.15,
      performanceTrend: 0.1,
    };

    const normalizedFactors = {
      trainingLoad: Math.min(1, factors.trainingLoad / 100),
      recoveryTime: Math.min(1, factors.recoveryTime / 72),
      sleepQuality: factors.sleepQuality / 10,
      stressLevel: factors.stressLevel / 10,
      performanceTrend: Math.max(0, 1 + factors.performanceTrend / 10),
    };

    return Object.entries(weights).reduce((sum, [key, weight]) => {
      return (
        sum + normalizedFactors[key as keyof typeof normalizedFactors] * weight
      );
    }, 0);
  }

  private static determineRiskLevel(
    probability: number
  ): 'low' | 'moderate' | 'high' | 'critical' {
    if (probability >= 0.8) return 'critical';
    if (probability >= 0.6) return 'high';
    if (probability >= 0.4) return 'moderate';
    return 'low';
  }

  private static identifyOvertrainingSymptoms(factors: any): string[] {
    const symptoms = [];

    if (factors.trainingLoad > 80) {
      symptoms.push('Excessive training volume');
    }

    if (factors.recoveryTime > 48) {
      symptoms.push('Prolonged recovery time');
    }

    if (factors.sleepQuality < 6) {
      symptoms.push('Poor sleep quality');
    }

    if (factors.stressLevel > 7) {
      symptoms.push('High stress levels');
    }

    if (factors.performanceTrend < -0.5) {
      symptoms.push('Declining performance');
    }

    return symptoms;
  }

  private static generateOvertrainingRecommendations(
    riskLevel: string,
    factors: any
  ): string[] {
    const recommendations = [];

    if (riskLevel === 'critical') {
      recommendations.push('Stop training immediately and rest for 1-2 weeks');
      recommendations.push('Consult with a healthcare professional');
    } else if (riskLevel === 'high') {
      recommendations.push('Reduce training volume by 50%');
      recommendations.push('Increase recovery time between sessions');
      recommendations.push('Focus on sleep and nutrition');
    } else if (riskLevel === 'moderate') {
      recommendations.push('Reduce training intensity');
      recommendations.push('Add more recovery days');
      recommendations.push('Monitor symptoms closely');
    } else {
      recommendations.push('Maintain current training load');
      recommendations.push('Continue monitoring wellness metrics');
    }

    return recommendations;
  }

  private static estimateOvertrainingTimeline(probability: number): string {
    if (probability >= 0.8) return 'Immediate risk';
    if (probability >= 0.6) return '1-2 weeks';
    if (probability >= 0.4) return '2-4 weeks';
    return 'Low risk';
  }

  private static calculateOvertrainingConfidence(factors: any): number {
    // Mock implementation - in a real app, this would calculate actual confidence
    return 0.8;
  }

  private static calculateMotivationLevel(
    wellnessInsights: WellnessInsights,
    checkInData: CheckInData[]
  ): number {
    // Mock implementation
    return wellnessInsights.patterns.mood.average * 2;
  }

  private static calculateEnjoymentLevel(
    sessionData: SessionData[],
    checkInData: CheckInData[]
  ): number {
    // Mock implementation
    return 7; // Default enjoyment level
  }

  private static calculateFatigueLevel(
    wellnessInsights: WellnessInsights
  ): number {
    return 10 - wellnessInsights.patterns.energy.average;
  }

  private static calculateSocialSupportLevel(
    checkInData: CheckInData[]
  ): number {
    // Mock implementation
    return 6; // Default social support level
  }

  private static calculateBurnoutProbability(factors: any): number {
    // Mock implementation
    const weights = {
      motivation: 0.25,
      enjoyment: 0.25,
      stress: 0.2,
      fatigue: 0.2,
      socialSupport: 0.1,
    };

    const normalizedFactors = {
      motivation: factors.motivation / 10,
      enjoyment: factors.enjoyment / 10,
      stress: factors.stress / 10,
      fatigue: factors.fatigue / 10,
      socialSupport: factors.socialSupport / 10,
    };

    return Object.entries(weights).reduce((sum, [key, weight]) => {
      return (
        sum + normalizedFactors[key as keyof typeof normalizedFactors] * weight
      );
    }, 0);
  }

  private static identifyBurnoutWarningSigns(factors: any): string[] {
    const signs = [];

    if (factors.motivation < 4) {
      signs.push('Low motivation');
    }

    if (factors.enjoyment < 4) {
      signs.push('Loss of enjoyment');
    }

    if (factors.stress > 7) {
      signs.push('High stress levels');
    }

    if (factors.fatigue > 7) {
      signs.push('Chronic fatigue');
    }

    if (factors.socialSupport < 4) {
      signs.push('Lack of social support');
    }

    return signs;
  }

  private static generateBurnoutInterventions(
    riskLevel: string,
    factors: any
  ): string[] {
    const interventions = [];

    if (riskLevel === 'critical') {
      interventions.push('Take a complete break from training');
      interventions.push('Seek professional help');
      interventions.push('Focus on mental health and recovery');
    } else if (riskLevel === 'high') {
      interventions.push('Reduce training frequency');
      interventions.push('Add variety to workouts');
      interventions.push('Increase social support');
    } else if (riskLevel === 'moderate') {
      interventions.push('Take regular rest days');
      interventions.push('Set realistic goals');
      interventions.push('Practice stress management');
    } else {
      interventions.push('Maintain current routine');
      interventions.push('Monitor for warning signs');
    }

    return interventions;
  }

  private static estimateBurnoutTimeline(probability: number): string {
    if (probability >= 0.8) return 'Immediate risk';
    if (probability >= 0.6) return '2-4 weeks';
    if (probability >= 0.4) return '1-2 months';
    return 'Low risk';
  }

  private static calculateBurnoutConfidence(factors: any): number {
    return 0.8;
  }

  private static calculateCurrentTrainingLoad(sessions: SessionData[]): number {
    return this.calculateTrainingLoad(sessions);
  }

  private static calculateOptimalLoad(
    wellnessInsights: WellnessInsights,
    userGoals: string[]
  ): number {
    // Mock implementation - in a real app, this would calculate actual optimal load
    const baseLoad = 50; // Base training load
    const recoveryFactor =
      wellnessInsights.patterns.recovery.averageReadiness / 10;
    const energyFactor = wellnessInsights.patterns.energy.average / 10;

    return baseLoad * recoveryFactor * energyFactor;
  }

  private static generateTrainingLoadRecommendations(
    currentLoad: number,
    optimalLoad: number,
    wellnessInsights: WellnessInsights
  ): any {
    const ratio = currentLoad / optimalLoad;

    return {
      intensity: Math.min(
        10,
        Math.max(1, wellnessInsights.patterns.recovery.averageReadiness)
      ),
      volume: Math.min(7, Math.max(1, Math.round(optimalLoad / 10))),
      duration: Math.min(120, Math.max(30, Math.round(optimalLoad * 2))),
      frequency: Math.min(7, Math.max(1, Math.round(optimalLoad / 15))),
    };
  }

  private static calculateTrainingProgression(
    currentLoad: number,
    optimalLoad: number,
    wellnessInsights: WellnessInsights
  ): any {
    const progressionRate = 0.1; // 10% increase per week

    return {
      nextWeek: Math.min(optimalLoad, currentLoad * (1 + progressionRate)),
      nextMonth: Math.min(
        optimalLoad,
        currentLoad * Math.pow(1 + progressionRate, 4)
      ),
      nextQuarter: Math.min(
        optimalLoad,
        currentLoad * Math.pow(1 + progressionRate, 12)
      ),
    };
  }

  private static calculateTrainingLoadConfidence(
    wellnessInsights: WellnessInsights
  ): number {
    return 0.8;
  }

  private static calculateRequiredRecovery(
    lastSession: SessionData,
    wellnessInsights: WellnessInsights
  ): number {
    // Mock implementation
    const baseRecovery = 24; // Base 24 hours
    const intensityFactor = (lastSession.intensity || 5) / 10;
    const recoveryFactor =
      wellnessInsights.patterns.recovery.averageReadiness / 10;

    return baseRecovery * intensityFactor * (1 / recoveryFactor);
  }

  private static calculateRecoveryTimeHours(
    currentRecovery: number,
    requiredRecovery: number
  ): number {
    return Math.max(0, requiredRecovery - currentRecovery);
  }

  private static analyzeRecoveryFactors(
    wellnessInsights: WellnessInsights
  ): any {
    return {
      sleep: wellnessInsights.patterns.sleep.averageQuality / 10,
      nutrition: 0.7, // Mock value
      stress: (10 - wellnessInsights.patterns.mood.average) / 10,
      hydration: 0.8, // Mock value
      activeRecovery: 0.6, // Mock value
    };
  }

  private static generateRecoveryRecommendations(
    factors: any,
    recoveryTime: number
  ): string[] {
    const recommendations = [];

    if (factors.sleep < 0.7) {
      recommendations.push('Improve sleep quality and duration');
    }

    if (factors.nutrition < 0.7) {
      recommendations.push('Focus on nutrient-dense foods');
    }

    if (factors.stress > 0.7) {
      recommendations.push('Practice stress management techniques');
    }

    if (factors.hydration < 0.7) {
      recommendations.push('Increase water intake');
    }

    if (factors.activeRecovery < 0.7) {
      recommendations.push('Include active recovery sessions');
    }

    return recommendations;
  }

  private static estimateRecoveryTimeline(recoveryTime: number): string {
    if (recoveryTime <= 0) return 'Ready to train';
    if (recoveryTime <= 12) return 'Ready in 12 hours';
    if (recoveryTime <= 24) return 'Ready in 24 hours';
    if (recoveryTime <= 48) return 'Ready in 48 hours';
    return 'Need more recovery time';
  }

  private static calculateRecoveryConfidence(
    wellnessInsights: WellnessInsights
  ): number {
    return 0.8;
  }

  private static calculateOverallHealth(
    overtraining: OvertrainingPrediction,
    burnout: BurnoutRiskAssessment,
    trainingLoad: OptimalTrainingLoad,
    recovery: RecoveryTimeRecommendation
  ): any {
    const overtrainingScore = 10 - overtraining.probability * 10;
    const burnoutScore = 10 - burnout.probability * 10;
    const trainingScore =
      trainingLoad.loadRatio > 1 ? 10 - (trainingLoad.loadRatio - 1) * 5 : 10;
    const recoveryScore = recovery.currentRecovery;

    const overallScore =
      (overtrainingScore + burnoutScore + trainingScore + recoveryScore) / 4;

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (overallScore > 7) trend = 'improving';
    else if (overallScore < 5) trend = 'declining';

    const riskFactors = [];
    if (
      overtraining.riskLevel === 'high' ||
      overtraining.riskLevel === 'critical'
    ) {
      riskFactors.push('Overtraining risk');
    }
    if (burnout.riskLevel === 'high' || burnout.riskLevel === 'critical') {
      riskFactors.push('Burnout risk');
    }
    if (trainingLoad.loadRatio > 1.2) {
      riskFactors.push('Excessive training load');
    }
    if (recovery.currentRecovery < 5) {
      riskFactors.push('Poor recovery');
    }

    const protectiveFactors = [];
    if (overtraining.riskLevel === 'low')
      protectiveFactors.push('Low overtraining risk');
    if (burnout.riskLevel === 'low') protectiveFactors.push('Low burnout risk');
    if (trainingLoad.loadRatio < 0.8)
      protectiveFactors.push('Appropriate training load');
    if (recovery.currentRecovery > 7) protectiveFactors.push('Good recovery');

    return {
      score: Math.round(overallScore * 10) / 10,
      trend,
      riskFactors,
      protectiveFactors,
    };
  }

  private static generateHealthAlerts(
    overtraining: OvertrainingPrediction,
    burnout: BurnoutRiskAssessment,
    trainingLoad: OptimalTrainingLoad,
    recovery: RecoveryTimeRecommendation
  ): any[] {
    const alerts = [];

    if (overtraining.riskLevel === 'critical') {
      alerts.push({
        type: 'critical',
        message: 'Critical overtraining risk detected',
        action: 'Stop training immediately and seek medical attention',
        priority: 'high',
      });
    } else if (overtraining.riskLevel === 'high') {
      alerts.push({
        type: 'warning',
        message: 'High overtraining risk detected',
        action: 'Reduce training load significantly',
        priority: 'high',
      });
    }

    if (burnout.riskLevel === 'critical') {
      alerts.push({
        type: 'critical',
        message: 'Critical burnout risk detected',
        action: 'Take a complete break from training',
        priority: 'high',
      });
    } else if (burnout.riskLevel === 'high') {
      alerts.push({
        type: 'warning',
        message: 'High burnout risk detected',
        action: 'Reduce training frequency and intensity',
        priority: 'high',
      });
    }

    if (trainingLoad.loadRatio > 1.5) {
      alerts.push({
        type: 'warning',
        message: 'Training load is significantly above optimal',
        action: 'Reduce training volume',
        priority: 'medium',
      });
    }

    if (recovery.currentRecovery < 3) {
      alerts.push({
        type: 'warning',
        message: 'Recovery levels are critically low',
        action: 'Take additional rest days',
        priority: 'high',
      });
    }

    return alerts;
  }
}
