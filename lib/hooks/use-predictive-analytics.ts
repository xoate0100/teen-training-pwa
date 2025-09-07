'use client';

import { useState, useEffect, useCallback } from 'react';
import { predictiveAnalytics } from '@/lib/services/predictive-analytics';
import { 
  PerformanceForecast, 
  SkillDevelopmentTrajectory, 
  GoalAchievementTimeline, 
  PlateauDetection, 
  RiskAssessment, 
  OptimizationRecommendation 
} from '@/lib/services/predictive-analytics';

export interface UsePredictiveAnalyticsReturn {
  // Performance Forecasting
  performanceForecasts: PerformanceForecast[];
  generatePerformanceForecast: (exerciseId: string, timeframe?: number) => Promise<PerformanceForecast>;
  
  // Skill Development
  skillTrajectories: SkillDevelopmentTrajectory[];
  generateSkillTrajectory: (skillArea: string) => Promise<SkillDevelopmentTrajectory>;
  
  // Goal Achievement
  goalTimelines: GoalAchievementTimeline[];
  generateGoalTimeline: (goalId: string, goalDescription: string, targetValue: number) => Promise<GoalAchievementTimeline>;
  
  // Plateau Detection
  plateaus: PlateauDetection[];
  detectPlateaus: () => Promise<PlateauDetection[]>;
  
  // Risk Assessment
  riskAssessment: RiskAssessment | null;
  generateRiskAssessment: () => Promise<RiskAssessment>;
  
  // Optimization Recommendations
  optimizationRecommendations: OptimizationRecommendation[];
  generateOptimizationRecommendations: () => Promise<OptimizationRecommendation[]>;
  
  // Cache management
  clearCache: () => void;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function usePredictiveAnalytics(): UsePredictiveAnalyticsReturn {
  const [performanceForecasts, setPerformanceForecasts] = useState<PerformanceForecast[]>([]);
  const [skillTrajectories, setSkillTrajectories] = useState<SkillDevelopmentTrajectory[]>([]);
  const [goalTimelines, setGoalTimelines] = useState<GoalAchievementTimeline[]>([]);
  const [plateaus, setPlateaus] = useState<PlateauDetection[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate performance forecast
  const generatePerformanceForecast = useCallback(async (exerciseId: string, timeframe: number = 30) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const forecast = await predictiveAnalytics.generatePerformanceForecast('current-user', exerciseId, timeframe);
      
      setPerformanceForecasts(prev => {
        const filtered = prev.filter(f => f.exerciseId !== exerciseId);
        return [...filtered, forecast];
      });
      
      return forecast;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate performance forecast';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate skill development trajectory
  const generateSkillTrajectory = useCallback(async (skillArea: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const trajectory = await predictiveAnalytics.generateSkillDevelopmentTrajectory('current-user', skillArea);
      
      setSkillTrajectories(prev => {
        const filtered = prev.filter(t => t.skillArea !== skillArea);
        return [...filtered, trajectory];
      });
      
      return trajectory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate skill trajectory';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate goal achievement timeline
  const generateGoalTimeline = useCallback(async (goalId: string, goalDescription: string, targetValue: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const timeline = await predictiveAnalytics.generateGoalAchievementTimeline('current-user', goalId, goalDescription, targetValue);
      
      setGoalTimelines(prev => {
        const filtered = prev.filter(t => t.goalId !== goalId);
        return [...filtered, timeline];
      });
      
      return timeline;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate goal timeline';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Detect plateaus
  const detectPlateaus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const detectedPlateaus = await predictiveAnalytics.detectPlateaus('current-user');
      setPlateaus(detectedPlateaus);
      
      return detectedPlateaus;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to detect plateaus';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate risk assessment
  const generateRiskAssessment = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const assessment = await predictiveAnalytics.generateRiskAssessment('current-user');
      setRiskAssessment(assessment);
      
      return assessment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate risk assessment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate optimization recommendations
  const generateOptimizationRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const recommendations = await predictiveAnalytics.generateOptimizationRecommendations('current-user');
      setOptimizationRecommendations(recommendations);
      
      return recommendations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate optimization recommendations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    predictiveAnalytics.clearCache();
    setPerformanceForecasts([]);
    setSkillTrajectories([]);
    setGoalTimelines([]);
    setPlateaus([]);
    setRiskAssessment(null);
    setOptimizationRecommendations([]);
  }, []);

  return {
    performanceForecasts,
    generatePerformanceForecast,
    skillTrajectories,
    generateSkillTrajectory,
    goalTimelines,
    generateGoalTimeline,
    plateaus,
    detectPlateaus,
    riskAssessment,
    generateRiskAssessment,
    optimizationRecommendations,
    generateOptimizationRecommendations,
    clearCache,
    isLoading,
    error,
  };
}
