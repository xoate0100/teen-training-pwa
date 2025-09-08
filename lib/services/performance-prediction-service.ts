'use client';

import {
  SessionData,
  CheckInData,
  ProgressMetrics,
} from '@/lib/services/database-service';

export interface StrengthProgression {
  currentLevel: number;
  predictedLevel: number;
  timeToGoal: number; // weeks
  confidence: number; // 0-1
  factors: {
    trainingFrequency: number;
    intensity: number;
    consistency: number;
    recovery: number;
  };
}

export interface FatiguePrediction {
  currentFatigue: number; // 0-10
  predictedFatigue: number; // 0-10
  timeToRecovery: number; // days
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface InjuryRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  factors: {
    trainingLoad: number;
    recoveryQuality: number;
    formConsistency: number;
    previousInjuries: number;
  };
  recommendations: string[];
  preventionStrategies: string[];
}

export interface OptimalLoadCalculation {
  recommendedRPE: number; // 1-10
  recommendedDuration: number; // minutes
  recommendedFrequency: number; // sessions per week
  progressionRate: number; // percentage increase per week
  deloadFrequency: number; // weeks between deloads
}

export interface PerformanceForecast {
  strength: StrengthProgression;
  fatigue: FatiguePrediction;
  injuryRisk: InjuryRiskAssessment;
  optimalLoad: OptimalLoadCalculation;
  nextSessionRecommendation: {
    type: 'strength' | 'volleyball' | 'conditioning' | 'rest';
    intensity: 'low' | 'moderate' | 'high';
    duration: number;
    focus: string[];
  };
}

export class PerformancePredictionService {
  // Predict strength progression
  static predictStrengthProgression(
    sessions: SessionData[],
    checkIns: CheckInData[],
    goalStrength: number
  ): StrengthProgression {
    if (sessions.length < 3) {
      return this.getDefaultStrengthProgression();
    }

    const strengthSessions = sessions.filter(
      s => s.type === 'strength' && s.completed
    );
    if (strengthSessions.length < 2) {
      return this.getDefaultStrengthProgression();
    }

    // Calculate current strength level based on RPE and volume
    const currentLevel = this.calculateCurrentStrengthLevel(strengthSessions);

    // Analyze training factors
    const factors = this.analyzeTrainingFactors(sessions, checkIns);

    // Predict progression based on historical data
    const progressionRate = this.calculateProgressionRate(
      strengthSessions,
      factors
    );

    // Calculate predicted level and time to goal
    const predictedLevel = currentLevel * (1 + progressionRate);
    const timeToGoal =
      goalStrength > currentLevel
        ? Math.ceil(
            (goalStrength - currentLevel) / (currentLevel * progressionRate)
          )
        : 0;

    // Calculate confidence based on data quality and consistency
    const confidence = this.calculatePredictionConfidence(
      strengthSessions,
      factors
    );

    return {
      currentLevel: Math.round(currentLevel * 100) / 100,
      predictedLevel: Math.round(predictedLevel * 100) / 100,
      timeToGoal,
      confidence: Math.round(confidence * 100) / 100,
      factors,
    };
  }

  // Predict fatigue levels
  static predictFatigueLevels(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): FatiguePrediction {
    if (sessions.length < 3 || checkIns.length < 2) {
      return this.getDefaultFatiguePrediction();
    }

    // Calculate current fatigue based on recent sessions and check-ins
    const currentFatigue = this.calculateCurrentFatigue(sessions, checkIns);

    // Predict future fatigue based on training load and recovery
    const predictedFatigue = this.calculatePredictedFatigue(
      sessions,
      checkIns,
      currentFatigue
    );

    // Calculate time to recovery
    const timeToRecovery = this.calculateTimeToRecovery(
      predictedFatigue,
      checkIns
    );

    // Assess risk level
    const riskLevel = this.assessFatigueRiskLevel(predictedFatigue);

    // Generate recommendations
    const recommendations = this.generateFatigueRecommendations(
      predictedFatigue,
      riskLevel
    );

    return {
      currentFatigue: Math.round(currentFatigue * 10) / 10,
      predictedFatigue: Math.round(predictedFatigue * 10) / 10,
      timeToRecovery,
      riskLevel,
      recommendations,
    };
  }

  // Assess injury risk
  static assessInjuryRisk(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): InjuryRiskAssessment {
    // Analyze training load
    const trainingLoad = this.calculateTrainingLoad(sessions);

    // Analyze recovery quality
    const recoveryQuality = this.calculateRecoveryQuality(checkIns);

    // Analyze form consistency (based on RPE variance)
    const formConsistency = this.calculateFormConsistency(sessions);

    // Analyze previous injuries (placeholder - would need injury history data)
    const previousInjuries = 0; // Placeholder

    // Calculate overall risk score
    const riskScore = this.calculateRiskScore(
      trainingLoad,
      recoveryQuality,
      formConsistency,
      previousInjuries
    );

    // Determine risk level
    const overallRisk =
      riskScore < 30 ? 'low' : riskScore < 70 ? 'medium' : 'high';

    // Generate recommendations and prevention strategies
    const recommendations = this.generateInjuryRiskRecommendations(
      overallRisk,
      {
        trainingLoad,
        recoveryQuality,
        formConsistency,
        previousInjuries,
      }
    );

    const preventionStrategies = this.generatePreventionStrategies(
      overallRisk,
      {
        trainingLoad,
        recoveryQuality,
        formConsistency,
        previousInjuries,
      }
    );

    return {
      overallRisk,
      riskScore: Math.round(riskScore),
      factors: {
        trainingLoad: Math.round(trainingLoad * 100) / 100,
        recoveryQuality: Math.round(recoveryQuality * 100) / 100,
        formConsistency: Math.round(formConsistency * 100) / 100,
        previousInjuries,
      },
      recommendations,
      preventionStrategies,
    };
  }

  // Calculate optimal training load
  static calculateOptimalLoad(
    sessions: SessionData[],
    checkIns: CheckInData[],
    currentPhase: string
  ): OptimalLoadCalculation {
    if (sessions.length < 2) {
      return this.getDefaultOptimalLoad();
    }

    // Analyze current training patterns
    const currentRPE = this.calculateAverageRPE(sessions);
    const currentDuration = this.calculateAverageDuration(sessions);
    const currentFrequency = this.calculateTrainingFrequency(sessions);

    // Adjust based on phase
    const phaseMultipliers = this.getPhaseMultipliers(currentPhase);

    // Calculate recommended values
    const recommendedRPE = Math.min(
      10,
      Math.max(1, currentRPE * phaseMultipliers.rpe)
    );
    const recommendedDuration = Math.round(
      currentDuration * phaseMultipliers.duration
    );
    const recommendedFrequency = Math.round(
      currentFrequency * phaseMultipliers.frequency
    );

    // Calculate progression rate based on current performance
    const progressionRate = this.calculateProgressionRate(sessions, {
      trainingFrequency: currentFrequency,
      intensity: currentRPE / 10,
      consistency: this.calculateConsistency(sessions),
      recovery: this.calculateRecoveryQuality(checkIns),
    });

    // Calculate deload frequency
    const deloadFrequency = this.calculateDeloadFrequency(
      sessions,
      currentPhase
    );

    return {
      recommendedRPE: Math.round(recommendedRPE * 10) / 10,
      recommendedDuration,
      recommendedFrequency,
      progressionRate: Math.round(progressionRate * 100) / 100,
      deloadFrequency,
    };
  }

  // Generate comprehensive performance forecast
  static generatePerformanceForecast(
    sessions: SessionData[],
    checkIns: CheckInData[],
    progressMetrics: ProgressMetrics[],
    goalStrength: number = 100,
    currentPhase: string = 'build'
  ): PerformanceForecast {
    const strength = this.predictStrengthProgression(
      sessions,
      checkIns,
      goalStrength
    );
    const fatigue = this.predictFatigueLevels(sessions, checkIns);
    const injuryRisk = this.assessInjuryRisk(sessions, checkIns);
    const optimalLoad = this.calculateOptimalLoad(
      sessions,
      checkIns,
      currentPhase
    );

    const nextSessionRecommendation = this.generateNextSessionRecommendation(
      strength,
      fatigue,
      injuryRisk,
      optimalLoad,
      currentPhase
    );

    return {
      strength,
      fatigue,
      injuryRisk,
      optimalLoad,
      nextSessionRecommendation,
    };
  }

  // Helper methods
  private static calculateCurrentStrengthLevel(
    sessions: SessionData[]
  ): number {
    if (sessions.length === 0) return 0;

    // Use RPE and volume as proxies for strength level
    const totalVolume = sessions.reduce((sum, session) => {
      return (
        sum +
        session.exercises.reduce((exerciseSum, exercise) => {
          return (
            exerciseSum +
            exercise.sets.reduce((setSum, set) => {
              return setSum + set.reps * (set.weight || 0);
            }, 0)
          );
        }, 0)
      );
    }, 0);

    const avgRPE =
      sessions.reduce((sum, s) => sum + s.totalRPE, 0) / sessions.length;
    const avgVolume = totalVolume / sessions.length;

    // Normalize to a 0-100 scale
    const strengthLevel = Math.min(100, (avgVolume * avgRPE) / 100);

    return strengthLevel;
  }

  private static analyzeTrainingFactors(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): {
    trainingFrequency: number;
    intensity: number;
    consistency: number;
    recovery: number;
  } {
    const trainingFrequency = this.calculateTrainingFrequency(sessions);
    const intensity = this.calculateAverageRPE(sessions) / 10;
    const consistency = this.calculateConsistency(sessions);
    const recovery = this.calculateRecoveryQuality(checkIns);

    return {
      trainingFrequency: Math.round(trainingFrequency * 10) / 10,
      intensity: Math.round(intensity * 100) / 100,
      consistency: Math.round(consistency * 100) / 100,
      recovery: Math.round(recovery * 100) / 100,
    };
  }

  private static calculateProgressionRate(
    sessions: SessionData[],

    factors: {
      trainingFrequency: number;
      intensity: number;
      consistency: number;
      recovery: number;
    }
  ): number {
    // Base progression rate
    const baseRate = 0.02; // 2% per week

    // Adjust based on factors
    const frequencyMultiplier = Math.min(1.5, factors.trainingFrequency / 3);
    const intensityMultiplier = Math.min(1.3, factors.intensity * 1.5);
    const consistencyMultiplier = factors.consistency;
    const recoveryMultiplier = factors.recovery;

    const adjustedRate =
      baseRate *
      frequencyMultiplier *
      intensityMultiplier *
      consistencyMultiplier *
      recoveryMultiplier;

    return Math.min(0.1, Math.max(0.005, adjustedRate)); // Cap between 0.5% and 10%
  }

  private static calculatePredictionConfidence(
    sessions: SessionData[],
    factors: {
      trainingFrequency: number;
      intensity: number;
      consistency: number;
      recovery: number;
    }
  ): number {
    // Base confidence on data quality
    let confidence = Math.min(1, sessions.length / 10); // More data = higher confidence

    // Adjust based on consistency
    confidence *= factors.consistency;

    // Adjust based on recovery quality
    confidence *= factors.recovery;

    return Math.max(0.1, Math.min(1, confidence));
  }

  private static calculateCurrentFatigue(
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): number {
    if (sessions.length === 0 || checkIns.length === 0) return 5;

    // Use recent check-ins for fatigue assessment
    const recentCheckIns = checkIns.slice(0, 3);
    const avgSoreness =
      recentCheckIns.reduce((sum, c) => sum + c.soreness, 0) /
      recentCheckIns.length;
    const avgEnergy =
      recentCheckIns.reduce((sum, c) => sum + c.energy, 0) /
      recentCheckIns.length;

    // Calculate fatigue as combination of soreness and low energy
    const fatigue = (avgSoreness + (10 - avgEnergy)) / 2;

    return Math.min(10, Math.max(0, fatigue));
  }

  private static calculatePredictedFatigue(
    sessions: SessionData[],
    checkIns: CheckInData[],
    currentFatigue: number
  ): number {
    // Analyze recent training load
    const recentSessions = sessions.slice(0, 5);
    const avgRPE =
      recentSessions.reduce((sum, s) => sum + s.totalRPE, 0) /
      recentSessions.length;
    const avgDuration =
      recentSessions.reduce((sum, s) => sum + s.duration, 0) /
      recentSessions.length;

    // Predict fatigue based on training load and recovery
    const trainingLoad = (avgRPE * avgDuration) / 100;
    const recoveryQuality = this.calculateRecoveryQuality(checkIns);

    const predictedFatigue =
      currentFatigue + trainingLoad * (1 - recoveryQuality);

    return Math.min(10, Math.max(0, predictedFatigue));
  }

  private static calculateTimeToRecovery(
    predictedFatigue: number,
    checkIns: CheckInData[]
  ): number {
    if (predictedFatigue <= 3) return 0;

    const recoveryQuality = this.calculateRecoveryQuality(checkIns);
    const baseRecoveryTime = (predictedFatigue - 3) * 2; // 2 days per fatigue point above 3
    const adjustedRecoveryTime = baseRecoveryTime / (recoveryQuality + 0.1); // Better recovery = faster recovery

    return Math.ceil(adjustedRecoveryTime);
  }

  private static assessFatigueRiskLevel(
    predictedFatigue: number
  ): 'low' | 'medium' | 'high' {
    if (predictedFatigue <= 4) return 'low';
    if (predictedFatigue <= 7) return 'medium';
    return 'high';
  }

  private static generateFatigueRecommendations(
    predictedFatigue: number,
    riskLevel: 'low' | 'medium' | 'high'
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'high') {
      recommendations.push(
        'Consider taking a rest day or reducing training intensity'
      );
      recommendations.push(
        'Focus on sleep quality and nutrition for better recovery'
      );
      recommendations.push(
        'Consider light stretching or mobility work instead of intense training'
      );
    } else if (riskLevel === 'medium') {
      recommendations.push(
        'Monitor your energy levels closely during training'
      );
      recommendations.push('Ensure adequate sleep and nutrition');
      recommendations.push('Consider reducing training volume slightly');
    } else {
      recommendations.push('Your fatigue levels are manageable');
      recommendations.push('Continue with your current training plan');
    }

    return recommendations;
  }

  private static calculateTrainingLoad(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;

    const recentSessions = sessions.slice(0, 7); // Last week
    const totalLoad = recentSessions.reduce((sum, session) => {
      return sum + session.totalRPE * session.duration;
    }, 0);

    return totalLoad / recentSessions.length;
  }

  private static calculateRecoveryQuality(checkIns: CheckInData[]): number {
    if (checkIns.length === 0) return 0.5;

    const recentCheckIns = checkIns.slice(0, 3);
    const avgSoreness =
      recentCheckIns.reduce((sum, c) => sum + c.soreness, 0) /
      recentCheckIns.length;
    const avgEnergy =
      recentCheckIns.reduce((sum, c) => sum + c.energy, 0) /
      recentCheckIns.length;
    const avgMood =
      recentCheckIns.reduce((sum, c) => sum + c.mood, 0) /
      recentCheckIns.length;

    // Recovery quality is inverse of soreness and positive correlation with energy and mood
    const recoveryQuality = (10 - avgSoreness + avgEnergy + avgMood) / 30;

    return Math.min(1, Math.max(0, recoveryQuality));
  }

  private static calculateFormConsistency(sessions: SessionData[]): number {
    if (sessions.length < 3) return 0.5;

    const rpeValues = sessions.map(s => s.totalRPE);
    const mean = rpeValues.reduce((sum, r) => sum + r, 0) / rpeValues.length;
    const variance =
      rpeValues.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
      rpeValues.length;
    const standardDeviation = Math.sqrt(variance);

    // Lower standard deviation = higher consistency
    const consistency = Math.max(0, 1 - standardDeviation / 5);

    return consistency;
  }

  private static calculateRiskScore(
    trainingLoad: number,
    recoveryQuality: number,
    formConsistency: number,
    previousInjuries: number
  ): number {
    // Weighted risk factors
    const trainingLoadRisk = Math.min(40, trainingLoad / 10);
    const recoveryRisk = (1 - recoveryQuality) * 30;
    const formRisk = (1 - formConsistency) * 20;
    const injuryRisk = previousInjuries * 10;

    const totalRisk = trainingLoadRisk + recoveryRisk + formRisk + injuryRisk;

    return Math.min(100, Math.max(0, totalRisk));
  }

  private static generateInjuryRiskRecommendations(
    riskLevel: 'low' | 'medium' | 'high',
    factors: {
      trainingLoad: number;
      recoveryQuality: number;
      formConsistency: number;
      previousInjuries: number;
    }
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'high') {
      recommendations.push('Reduce training intensity immediately');
      recommendations.push('Focus on proper form and technique');
      recommendations.push('Increase recovery time between sessions');
      recommendations.push(
        'Consider consulting a sports medicine professional'
      );
    } else if (riskLevel === 'medium') {
      recommendations.push('Monitor training load carefully');
      recommendations.push('Ensure adequate warm-up and cool-down');
      recommendations.push('Focus on recovery and sleep quality');
    } else {
      recommendations.push('Continue with current training approach');
      recommendations.push('Maintain focus on proper form');
    }

    return recommendations;
  }

  private static generatePreventionStrategies(
    riskLevel: 'low' | 'medium' | 'high',
    factors: {
      trainingLoad: number;
      recoveryQuality: number;
      formConsistency: number;
      previousInjuries: number;
    }
  ): string[] {
    const strategies: string[] = [];

    strategies.push('Implement proper warm-up routine');
    strategies.push('Include mobility and flexibility work');
    strategies.push('Progressive overload with proper form');

    if (factors.recoveryQuality < 0.7) {
      strategies.push('Improve sleep quality and nutrition');
      strategies.push('Include active recovery sessions');
    }

    if (factors.formConsistency < 0.8) {
      strategies.push('Focus on technique before increasing load');
      strategies.push('Consider working with a coach');
    }

    return strategies;
  }

  private static calculateAverageRPE(sessions: SessionData[]): number {
    if (sessions.length === 0) return 7;
    return sessions.reduce((sum, s) => sum + s.totalRPE, 0) / sessions.length;
  }

  private static calculateAverageDuration(sessions: SessionData[]): number {
    if (sessions.length === 0) return 60;
    return sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
  }

  private static calculateTrainingFrequency(sessions: SessionData[]): number {
    if (sessions.length === 0) return 3;

    const weeks = this.calculateWeeks(sessions);
    return sessions.length / weeks;
  }

  private static calculateConsistency(sessions: SessionData[]): number {
    if (sessions.length < 2) return 0.5;

    const intervals: number[] = [];
    const sortedSessions = sessions
      .map(s => new Date(s.date))
      .sort((a, b) => a.getTime() - b.getTime());

    for (let i = 1; i < sortedSessions.length; i++) {
      const diff =
        sortedSessions[i].getTime() - sortedSessions[i - 1].getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      intervals.push(days);
    }

    const mean = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    const variance =
      intervals.reduce((sum, i) => sum + Math.pow(i - mean, 2), 0) /
      intervals.length;
    const standardDeviation = Math.sqrt(variance);

    return Math.max(0, 1 - standardDeviation / mean);
  }

  private static calculateWeeks(sessions: SessionData[]): number {
    if (sessions.length === 0) return 1;

    const dates = sessions
      .map(s => new Date(s.date))
      .sort((a, b) => a.getTime() - b.getTime());
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    const diffTime = lastDate.getTime() - firstDate.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

    return Math.max(1, diffWeeks);
  }

  private static getPhaseMultipliers(phase: string): {
    rpe: number;
    duration: number;
    frequency: number;
  } {
    const multipliers = {
      foundation: { rpe: 0.8, duration: 0.9, frequency: 0.8 },
      build: { rpe: 1.0, duration: 1.0, frequency: 1.0 },
      peak: { rpe: 1.2, duration: 1.1, frequency: 1.1 },
      deload: { rpe: 0.6, duration: 0.7, frequency: 0.8 },
    };

    return multipliers[phase as keyof typeof multipliers] || multipliers.build;
  }

  private static calculateDeloadFrequency(
    sessions: SessionData[],
    phase: string
  ): number {
    const phaseDeloadFrequencies = {
      foundation: 6,
      build: 4,
      peak: 3,
      deload: 1,
    };

    return (
      phaseDeloadFrequencies[phase as keyof typeof phaseDeloadFrequencies] || 4
    );
  }

  private static generateNextSessionRecommendation(
    strength: StrengthProgression,
    fatigue: FatiguePrediction,
    injuryRisk: InjuryRiskAssessment,
    optimalLoad: OptimalLoadCalculation,
    currentPhase: string
  ): {
    type: 'strength' | 'volleyball' | 'conditioning' | 'rest';
    intensity: 'low' | 'moderate' | 'high';
    duration: number;
    focus: string[];
  } {
    // Determine if rest is needed
    if (fatigue.riskLevel === 'high' || injuryRisk.overallRisk === 'high') {
      return {
        type: 'rest',
        intensity: 'low',
        duration: 0,
        focus: ['Recovery', 'Mobility', 'Light stretching'],
      };
    }

    // Determine session type based on phase and fatigue
    let type: 'strength' | 'volleyball' | 'conditioning' = 'strength';
    if (currentPhase === 'foundation' && fatigue.currentFatigue > 6) {
      type = 'conditioning';
    } else if (currentPhase === 'peak' && fatigue.currentFatigue < 4) {
      type = 'strength';
    }

    // Determine intensity
    let intensity: 'low' | 'moderate' | 'high' = 'moderate';
    if (fatigue.riskLevel === 'low' && injuryRisk.overallRisk === 'low') {
      intensity = 'high';
    } else if (
      fatigue.riskLevel === 'high' ||
      injuryRisk.overallRisk === 'high'
    ) {
      intensity = 'low';
    }

    // Determine duration
    const duration = Math.round(
      optimalLoad.recommendedDuration *
        (intensity === 'high' ? 1.1 : intensity === 'low' ? 0.8 : 1.0)
    );

    // Determine focus areas
    const focus: string[] = [];
    if (strength.confidence < 0.7) focus.push('Form improvement');
    if (fatigue.currentFatigue > 5) focus.push('Recovery');
    if (injuryRisk.overallRisk === 'medium') focus.push('Injury prevention');
    if (currentPhase === 'peak') focus.push('Performance');

    return {
      type,
      intensity,
      duration,
      focus,
    };
  }

  private static getDefaultStrengthProgression(): StrengthProgression {
    return {
      currentLevel: 50,
      predictedLevel: 50,
      timeToGoal: 0,
      confidence: 0,
      factors: {
        trainingFrequency: 3,
        intensity: 0.7,
        consistency: 0.8,
        recovery: 0.7,
      },
    };
  }

  private static getDefaultFatiguePrediction(): FatiguePrediction {
    return {
      currentFatigue: 5,
      predictedFatigue: 5,
      timeToRecovery: 0,
      riskLevel: 'low',
      recommendations: ['Monitor your energy levels'],
    };
  }

  private static getDefaultOptimalLoad(): OptimalLoadCalculation {
    return {
      recommendedRPE: 7,
      recommendedDuration: 60,
      recommendedFrequency: 3,
      progressionRate: 0.02,
      deloadFrequency: 4,
    };
  }
}
