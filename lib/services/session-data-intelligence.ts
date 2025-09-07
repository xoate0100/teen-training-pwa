'use client';

import { DatabaseService, SessionData } from './database-service';

export interface PerformanceMetrics {
  exerciseId: string;
  exerciseName: string;
  sets: SetMetrics[];
  totalVolume: number;
  averageRPE: number;
  maxRPE: number;
  formQuality: number; // 0-10 scale
  consistency: number; // 0-10 scale
  progression: number; // percentage change from previous session
  safetyScore: number; // 0-10 scale
  recommendations: string[];
}

export interface SetMetrics {
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  formQuality: number;
  restTime: number;
  completed: boolean;
  timestamp: Date;
}

export interface FormQualityAssessment {
  exerciseId: string;
  overallScore: number; // 0-10
  techniqueScore: number; // 0-10
  tempoScore: number; // 0-10
  rangeOfMotionScore: number; // 0-10
  stabilityScore: number; // 0-10
  feedback: string[];
  improvements: string[];
  warnings: string[];
}

export interface RPEAnalysis {
  exerciseId: string;
  currentRPE: number;
  targetRPE: number;
  rpeTrend: 'increasing' | 'decreasing' | 'stable';
  loadAdjustment: number; // percentage change needed
  recommendation: string;
  confidence: number; // 0-1
}

export interface SafetyMonitoring {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: SafetyFactor[];
  recommendations: string[];
  warnings: string[];
  shouldStop: boolean;
  alternativeExercises: string[];
}

export interface SafetyFactor {
  type: 'form' | 'fatigue' | 'load' | 'recovery' | 'technique';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: number; // 0-10
}

export interface RealTimeTracking {
  sessionId: string;
  currentExercise: string;
  currentSet: number;
  totalSets: number;
  sessionProgress: number; // percentage
  timeElapsed: number; // minutes
  estimatedTimeRemaining: number; // minutes
  currentRPE: number;
  averageRPE: number;
  formQuality: number;
  safetyScore: number;
  recommendations: string[];
  warnings: string[];
}

export class SessionDataIntelligenceService {
  private databaseService = new DatabaseService();

  // Real-time performance tracking
  async trackPerformance(
    sessionId: string,
    exerciseId: string,
    setData: SetMetrics
  ): Promise<PerformanceMetrics> {
    try {
      // Get session data
      const session = await this.databaseService.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Get exercise data
      const exercise = session.exercises.find(e => e.id === exerciseId);
      if (!exercise) {
        throw new Error('Exercise not found');
      }

      // Calculate performance metrics
      const metrics = await this.calculatePerformanceMetrics(
        exerciseId,
        exercise.sets || [],
        setData
      );

      // Update session with new set data
      const updatedSets = [...(exercise.sets || []), setData];
      const updatedExercise = {
        ...exercise,
        sets: updatedSets,
      };

      // Update session
      const updatedSession = {
        ...session,
        exercises: session.exercises.map(e =>
          e.id === exerciseId ? updatedExercise : e
        ),
      };

      await this.databaseService.saveSession(updatedSession);

      return metrics;
    } catch (error) {
      console.error('Error tracking performance:', error);
      throw new Error('Failed to track performance');
    }
  }

  // Calculate comprehensive performance metrics
  private async calculatePerformanceMetrics(
    exerciseId: string,
    sets: any[],
    newSet: SetMetrics
  ): Promise<PerformanceMetrics> {
    const allSets = [...sets, newSet];
    const completedSets = allSets.filter(s => s.completed);

    // Calculate basic metrics
    const totalVolume = completedSets.reduce(
      (sum, set) => sum + (set.weight * set.reps),
      0
    );
    const averageRPE = completedSets.reduce(
      (sum, set) => sum + set.rpe,
      0
    ) / completedSets.length;
    const maxRPE = Math.max(...completedSets.map(s => s.rpe));

    // Calculate form quality
    const formQuality = await this.assessFormQuality(exerciseId, completedSets);

    // Calculate consistency
    const consistency = this.calculateConsistency(completedSets);

    // Calculate progression
    const progression = await this.calculateProgression(exerciseId, completedSets);

    // Calculate safety score
    const safetyScore = await this.calculateSafetyScore(exerciseId, completedSets);

    // Generate recommendations
    const recommendations = await this.generateRecommendations(
      exerciseId,
      completedSets,
      formQuality,
      consistency,
      progression,
      safetyScore
    );

    return {
      exerciseId,
      exerciseName: exerciseId, // Would be resolved from exercise data
      sets: completedSets,
      totalVolume,
      averageRPE,
      maxRPE,
      formQuality,
      consistency,
      progression,
      safetyScore,
      recommendations,
    };
  }

  // Form quality assessment
  async assessFormQuality(
    exerciseId: string,
    sets: SetMetrics[]
  ): Promise<FormQualityAssessment> {
    // This would integrate with computer vision or manual assessment
    // For now, we'll use a simplified algorithm based on RPE and consistency

    const recentSets = sets.slice(-3); // Last 3 sets
    if (recentSets.length === 0) {
      return {
        exerciseId,
        overallScore: 5,
        techniqueScore: 5,
        tempoScore: 5,
        rangeOfMotionScore: 5,
        stabilityScore: 5,
        feedback: ['No data available for assessment'],
        improvements: ['Focus on proper form'],
        warnings: [],
      };
    }

    // Calculate scores based on RPE consistency and progression
    const rpeVariance = this.calculateVariance(recentSets.map(s => s.rpe));
    const techniqueScore = Math.max(0, 10 - rpeVariance * 2);
    const tempoScore = this.assessTempo(recentSets);
    const rangeOfMotionScore = this.assessRangeOfMotion(recentSets);
    const stabilityScore = this.assessStability(recentSets);

    const overallScore = (techniqueScore + tempoScore + rangeOfMotionScore + stabilityScore) / 4;

    // Generate feedback
    const feedback = this.generateFormFeedback(overallScore, techniqueScore, tempoScore, rangeOfMotionScore, stabilityScore);
    const improvements = this.generateFormImprovements(overallScore, techniqueScore, tempoScore, rangeOfMotionScore, stabilityScore);
    const warnings = this.generateFormWarnings(overallScore, techniqueScore, tempoScore, rangeOfMotionScore, stabilityScore);

    return {
      exerciseId,
      overallScore: Math.round(overallScore * 10) / 10,
      techniqueScore: Math.round(techniqueScore * 10) / 10,
      tempoScore: Math.round(tempoScore * 10) / 10,
      rangeOfMotionScore: Math.round(rangeOfMotionScore * 10) / 10,
      stabilityScore: Math.round(stabilityScore * 10) / 10,
      feedback,
      improvements,
      warnings,
    };
  }

  // RPE-based load adjustment
  async analyzeRPE(
    exerciseId: string,
    currentRPE: number,
    targetRPE: number,
    recentSessions: SessionData[]
  ): Promise<RPEAnalysis> {
    // Get historical RPE data for this exercise
    const historicalRPE = this.getHistoricalRPE(exerciseId, recentSessions);
    
    // Calculate RPE trend
    const rpeTrend = this.calculateRPETrend(historicalRPE, currentRPE);
    
    // Calculate load adjustment needed
    const loadAdjustment = this.calculateLoadAdjustment(currentRPE, targetRPE, rpeTrend);
    
    // Generate recommendation
    const recommendation = this.generateRPERecommendation(
      currentRPE,
      targetRPE,
      rpeTrend,
      loadAdjustment
    );
    
    // Calculate confidence based on data availability
    const confidence = Math.min(1, historicalRPE.length / 5);

    return {
      exerciseId,
      currentRPE,
      targetRPE,
      rpeTrend,
      loadAdjustment,
      recommendation,
      confidence,
    };
  }

  // Safety monitoring integration
  async monitorSafety(
    sessionId: string,
    currentExercise: string,
    currentSet: SetMetrics,
    recentSessions: SessionData[]
  ): Promise<SafetyMonitoring> {
    const safetyFactors: SafetyFactor[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Check form quality
    const formQuality = await this.assessFormQuality(currentExercise, [currentSet]);
    if (formQuality.overallScore < 6) {
      safetyFactors.push({
        type: 'form',
        severity: formQuality.overallScore < 4 ? 'critical' : 'high',
        description: 'Poor form quality detected',
        impact: 10 - formQuality.overallScore,
      });
    }

    // Check fatigue levels
    const fatigueLevel = this.assessFatigueLevel(currentSet, recentSessions);
    if (fatigueLevel > 7) {
      safetyFactors.push({
        type: 'fatigue',
        severity: fatigueLevel > 9 ? 'critical' : 'high',
        description: 'High fatigue levels detected',
        impact: fatigueLevel,
      });
    }

    // Check load progression
    const loadProgression = this.assessLoadProgression(currentExercise, currentSet, recentSessions);
    if (loadProgression > 15) { // More than 15% increase
      safetyFactors.push({
        type: 'load',
        severity: loadProgression > 25 ? 'critical' : 'high',
        description: 'Excessive load progression detected',
        impact: loadProgression / 10,
      });
    }

    // Check recovery status
    const recoveryStatus = this.assessRecoveryStatus(recentSessions);
    if (recoveryStatus < 5) {
      safetyFactors.push({
        type: 'recovery',
        severity: recoveryStatus < 3 ? 'critical' : 'high',
        description: 'Insufficient recovery detected',
        impact: 10 - recoveryStatus,
      });
    }

    // Determine overall risk level
    const criticalFactors = safetyFactors.filter(f => f.severity === 'critical');
    const highFactors = safetyFactors.filter(f => f.severity === 'high');
    
    if (criticalFactors.length > 0) {
      riskLevel = 'critical';
    } else if (highFactors.length > 2) {
      riskLevel = 'high';
    } else if (highFactors.length > 0) {
      riskLevel = 'medium';
    }

    // Generate recommendations and warnings
    const recommendations = this.generateSafetyRecommendations(safetyFactors, riskLevel);
    const warnings = this.generateSafetyWarnings(safetyFactors, riskLevel);
    const shouldStop = riskLevel === 'critical' || (riskLevel === 'high' && criticalFactors.length > 0);
    const alternativeExercises = this.getAlternativeExercises(currentExercise, safetyFactors);

    return {
      riskLevel,
      factors: safetyFactors,
      recommendations,
      warnings,
      shouldStop,
      alternativeExercises,
    };
  }

  // Real-time tracking for active sessions
  async getRealTimeTracking(sessionId: string): Promise<RealTimeTracking> {
    try {
      const session = await this.databaseService.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      const currentExercise = session.exercises.find(e => !e.completed) || session.exercises[0];
      const currentSet = currentExercise?.sets?.length || 0;
      const totalSets = currentExercise?.sets?.length || 0;
      const sessionProgress = this.calculateSessionProgress(session);
      const timeElapsed = this.calculateTimeElapsed(session);
      const estimatedTimeRemaining = this.estimateTimeRemaining(session, sessionProgress);
      
      const currentRPE = currentExercise?.sets?.[currentSet - 1]?.rpe || 0;
      const averageRPE = this.calculateAverageRPE(session);
      const formQuality = await this.assessFormQuality(
        currentExercise?.id || '',
        currentExercise?.sets || []
      );
      const safetyScore = await this.calculateSafetyScore(
        currentExercise?.id || '',
        currentExercise?.sets || []
      );

      const recommendations = await this.generateRealTimeRecommendations(
        session,
        currentExercise,
        formQuality.overallScore,
        safetyScore
      );

      const warnings = this.generateRealTimeWarnings(
        formQuality.overallScore,
        safetyScore,
        currentRPE
      );

      return {
        sessionId,
        currentExercise: currentExercise?.name || 'No exercise',
        currentSet,
        totalSets,
        sessionProgress,
        timeElapsed,
        estimatedTimeRemaining,
        currentRPE,
        averageRPE,
        formQuality: formQuality.overallScore,
        safetyScore,
        recommendations,
        warnings,
      };
    } catch (error) {
      console.error('Error getting real-time tracking:', error);
      throw new Error('Failed to get real-time tracking');
    }
  }

  // Helper methods
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private assessTempo(sets: SetMetrics[]): number {
    // Simplified tempo assessment based on RPE consistency
    const rpeVariance = this.calculateVariance(sets.map(s => s.rpe));
    return Math.max(0, 10 - rpeVariance * 2);
  }

  private assessRangeOfMotion(sets: SetMetrics[]): number {
    // Simplified ROM assessment based on rep consistency
    const repVariance = this.calculateVariance(sets.map(s => s.reps));
    return Math.max(0, 10 - repVariance * 0.5);
  }

  private assessStability(sets: SetMetrics[]): number {
    // Simplified stability assessment based on weight consistency
    const weightVariance = this.calculateVariance(sets.map(s => s.weight));
    return Math.max(0, 10 - weightVariance * 0.1);
  }

  private generateFormFeedback(
    overall: number,
    technique: number,
    tempo: number,
    rom: number,
    stability: number
  ): string[] {
    const feedback: string[] = [];
    
    if (overall >= 8) {
      feedback.push('Excellent form quality!');
    } else if (overall >= 6) {
      feedback.push('Good form with room for improvement');
    } else {
      feedback.push('Form needs attention');
    }

    if (technique < 6) {
      feedback.push('Focus on proper technique');
    }
    if (tempo < 6) {
      feedback.push('Work on consistent tempo');
    }
    if (rom < 6) {
      feedback.push('Improve range of motion');
    }
    if (stability < 6) {
      feedback.push('Focus on stability and control');
    }

    return feedback;
  }

  private generateFormImprovements(
    overall: number,
    technique: number,
    tempo: number,
    rom: number,
    stability: number
  ): string[] {
    const improvements: string[] = [];
    
    if (technique < 7) {
      improvements.push('Practice with lighter weight to perfect technique');
    }
    if (tempo < 7) {
      improvements.push('Use a metronome to maintain consistent tempo');
    }
    if (rom < 7) {
      improvements.push('Focus on full range of motion');
    }
    if (stability < 7) {
      improvements.push('Engage core and maintain stability');
    }

    return improvements;
  }

  private generateFormWarnings(
    overall: number,
    technique: number,
    tempo: number,
    rom: number,
    stability: number
  ): string[] {
    const warnings: string[] = [];
    
    if (overall < 4) {
      warnings.push('Form quality is dangerously low - consider reducing weight');
    }
    if (technique < 4) {
      warnings.push('Poor technique detected - risk of injury');
    }
    if (stability < 4) {
      warnings.push('Lack of stability - consider using support or reducing weight');
    }

    return warnings;
  }

  private calculateConsistency(sets: SetMetrics[]): number {
    if (sets.length < 2) return 5;
    
    const rpeVariance = this.calculateVariance(sets.map(s => s.rpe));
    const repVariance = this.calculateVariance(sets.map(s => s.reps));
    const weightVariance = this.calculateVariance(sets.map(s => s.weight));
    
    const overallVariance = (rpeVariance + repVariance + weightVariance) / 3;
    return Math.max(0, 10 - overallVariance * 2);
  }

  private async calculateProgression(exerciseId: string, sets: SetMetrics[]): Promise<number> {
    // This would compare with previous session data
    // For now, return a mock value
    return 5; // 5% progression
  }

  private async calculateSafetyScore(exerciseId: string, sets: SetMetrics[]): Promise<number> {
    if (sets.length === 0) return 5;
    
    const formQuality = await this.assessFormQuality(exerciseId, sets);
    const consistency = this.calculateConsistency(sets);
    const maxRPE = Math.max(...sets.map(s => s.rpe));
    
    let safetyScore = (formQuality.overallScore + consistency) / 2;
    
    // Penalize for very high RPE
    if (maxRPE > 9) {
      safetyScore -= 2;
    } else if (maxRPE > 8) {
      safetyScore -= 1;
    }
    
    return Math.max(0, Math.min(10, safetyScore));
  }

  private async generateRecommendations(
    exerciseId: string,
    sets: SetMetrics[],
    formQuality: number,
    consistency: number,
    progression: number,
    safetyScore: number
  ): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (formQuality < 7) {
      recommendations.push('Focus on form quality before increasing weight');
    }
    if (consistency < 7) {
      recommendations.push('Work on consistency in your sets');
    }
    if (progression > 10) {
      recommendations.push('Consider a more gradual progression');
    }
    if (safetyScore < 7) {
      recommendations.push('Prioritize safety and reduce intensity if needed');
    }
    
    return recommendations;
  }

  private getHistoricalRPE(exerciseId: string, recentSessions: SessionData[]): number[] {
    const rpeData: number[] = [];
    
    for (const session of recentSessions) {
      for (const exercise of session.exercises) {
        if (exercise.id === exerciseId) {
          for (const set of exercise.sets || []) {
            if (set.completed) {
              rpeData.push(set.rpe);
            }
          }
        }
      }
    }
    
    return rpeData;
  }

  private calculateRPETrend(historicalRPE: number[], currentRPE: number): 'increasing' | 'decreasing' | 'stable' {
    if (historicalRPE.length < 3) return 'stable';
    
    const recent = historicalRPE.slice(-3);
    const avgRecent = recent.reduce((sum, rpe) => sum + rpe, 0) / recent.length;
    
    if (currentRPE > avgRecent + 0.5) return 'increasing';
    if (currentRPE < avgRecent - 0.5) return 'decreasing';
    return 'stable';
  }

  private calculateLoadAdjustment(currentRPE: number, targetRPE: number, trend: string): number {
    const rpeDifference = currentRPE - targetRPE;
    let adjustment = rpeDifference * 5; // 5% per RPE point
    
    // Adjust based on trend
    if (trend === 'increasing') {
      adjustment += 5; // Increase load more conservatively
    } else if (trend === 'decreasing') {
      adjustment -= 5; // Decrease load more aggressively
    }
    
    return Math.max(-20, Math.min(20, adjustment)); // Cap at ±20%
  }

  private generateRPERecommendation(
    currentRPE: number,
    targetRPE: number,
    trend: string,
    adjustment: number
  ): string {
    if (Math.abs(adjustment) < 2) {
      return 'Current load is appropriate for target RPE';
    }
    
    if (adjustment > 0) {
      return `Increase load by ${Math.round(adjustment)}% to reach target RPE`;
    } else {
      return `Decrease load by ${Math.round(Math.abs(adjustment))}% to reach target RPE`;
    }
  }

  private assessFatigueLevel(currentSet: SetMetrics, recentSessions: SessionData[]): number {
    // Simplified fatigue assessment based on RPE and recent session frequency
    const recentSessionsCount = recentSessions.filter(s => 
      new Date(s.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    let fatigueLevel = currentSet.rpe;
    
    // Increase fatigue if too many recent sessions
    if (recentSessionsCount > 4) {
      fatigueLevel += 1;
    }
    
    return Math.min(10, fatigueLevel);
  }

  private assessLoadProgression(exerciseId: string, currentSet: SetMetrics, recentSessions: SessionData[]): number {
    // Find previous session with same exercise
    const previousSession = recentSessions.find(s => 
      s.exercises.some(e => e.id === exerciseId)
    );
    
    if (!previousSession) return 0;
    
    const previousExercise = previousSession.exercises.find(e => e.id === exerciseId);
    if (!previousExercise || !previousExercise.sets || previousExercise.sets.length === 0) return 0;
    
    const previousWeight = previousExercise.sets[previousExercise.sets.length - 1].weight;
    const currentWeight = currentSet.weight;
    
    return ((currentWeight - previousWeight) / previousWeight) * 100;
  }

  private assessRecoveryStatus(recentSessions: SessionData[]): number {
    // Simplified recovery assessment based on session frequency and intensity
    const recentSessionsCount = recentSessions.filter(s => 
      new Date(s.date) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    ).length;
    
    const avgRPE = recentSessions.reduce((sum, s) => sum + s.totalRPE, 0) / recentSessions.length;
    
    let recoveryScore = 10;
    
    // Penalize for too many recent sessions
    if (recentSessionsCount > 2) {
      recoveryScore -= recentSessionsCount * 2;
    }
    
    // Penalize for high intensity
    if (avgRPE > 8) {
      recoveryScore -= 2;
    }
    
    return Math.max(0, recoveryScore);
  }

  private generateSafetyRecommendations(factors: SafetyFactor[], riskLevel: string): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'critical') {
      recommendations.push('STOP immediately and consult a trainer');
    } else if (riskLevel === 'high') {
      recommendations.push('Reduce intensity and focus on form');
    } else if (riskLevel === 'medium') {
      recommendations.push('Monitor form and consider reducing weight');
    }
    
    for (const factor of factors) {
      if (factor.type === 'form') {
        recommendations.push('Focus on proper technique');
      } else if (factor.type === 'fatigue') {
        recommendations.push('Take a break or reduce intensity');
      } else if (factor.type === 'load') {
        recommendations.push('Reduce weight progression');
      } else if (factor.type === 'recovery') {
        recommendations.push('Allow more recovery time');
      }
    }
    
    return recommendations;
  }

  private generateSafetyWarnings(factors: SafetyFactor[], riskLevel: string): string[] {
    const warnings: string[] = [];
    
    if (riskLevel === 'critical') {
      warnings.push('CRITICAL: Stop exercising immediately');
    }
    
    for (const factor of factors) {
      if (factor.severity === 'critical') {
        warnings.push(`CRITICAL: ${factor.description}`);
      } else if (factor.severity === 'high') {
        warnings.push(`WARNING: ${factor.description}`);
      }
    }
    
    return warnings;
  }

  // eslint-disable-next-line no-unused-vars
  private getAlternativeExercises(exerciseId: string, factors: SafetyFactor[]): string[] {
    // This would return alternative exercises based on the current exercise and safety factors
    // For now, return mock alternatives
    return ['Bodyweight squats', 'Assisted pull-ups', 'Light dumbbell exercises'];
  }

  private calculateSessionProgress(session: SessionData): number {
    const totalExercises = session.exercises.length;
    const completedExercises = session.exercises.filter(e => e.completed).length;
    return (completedExercises / totalExercises) * 100;
  }

  private calculateTimeElapsed(session: SessionData): number {
    const startTime = new Date(session.date);
    const now = new Date();
    return Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60)); // minutes
  }

  private estimateTimeRemaining(session: SessionData, progress: number): number {
    if (progress === 0) return 60; // Default 60 minutes
    
    const elapsed = this.calculateTimeElapsed(session);
    const totalEstimated = (elapsed / progress) * 100;
    return Math.max(0, totalEstimated - elapsed);
  }

  private calculateAverageRPE(session: SessionData): number {
    const allRPEs: number[] = [];
    
    for (const exercise of session.exercises) {
      for (const set of exercise.sets || []) {
        if (set.completed) {
          allRPEs.push(set.rpe);
        }
      }
    }
    
    if (allRPEs.length === 0) return 0;
    return allRPEs.reduce((sum, rpe) => sum + rpe, 0) / allRPEs.length;
  }

  // eslint-disable-next-line no-unused-vars
  private async generateRealTimeRecommendations(
    // eslint-disable-next-line no-unused-vars
    session: SessionData,
    // eslint-disable-next-line no-unused-vars
    currentExercise: any,
    // eslint-disable-next-line no-unused-vars
    formQuality: number,
    // eslint-disable-next-line no-unused-vars
    safetyScore: number
  ): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (formQuality < 7) {
      recommendations.push('Focus on form quality');
    }
    if (safetyScore < 7) {
      recommendations.push('Prioritize safety');
    }
    if (currentExercise && currentExercise.sets && currentExercise.sets.length > 0) {
      const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
      if (lastSet.rpe > 8) {
        recommendations.push('Consider reducing weight for next set');
      }
    }
    
    return recommendations;
  }

  private generateRealTimeWarnings(
    formQuality: number,
    safetyScore: number,
    currentRPE: number
  ): string[] {
    const warnings: string[] = [];
    
    if (formQuality < 4) {
      warnings.push('Form quality is dangerously low');
    }
    if (safetyScore < 4) {
      warnings.push('Safety concerns detected');
    }
    if (currentRPE > 9) {
      warnings.push('RPE is extremely high - consider stopping');
    }
    
    return warnings;
  }
}

// Export singleton instance
export const sessionDataIntelligence = new SessionDataIntelligenceService();
