'use client';

import { useState, useEffect, useCallback } from 'react';
import { researchDataCollection } from '@/lib/services/research-data-collection';
import { 
  AnonymousPerformanceData, 
  TrainingEffectivenessStudy, 
  UserSatisfactionMetrics, 
  LongTermOutcomeTracking 
} from '@/lib/services/research-data-collection';

export interface UseResearchDataCollectionReturn {
  // Anonymous Performance Data
  anonymousPerformanceData: AnonymousPerformanceData[];
  collectAnonymousPerformanceData: (userId: string) => Promise<AnonymousPerformanceData[]>;
  
  // Training Effectiveness Studies
  trainingEffectivenessStudy: TrainingEffectivenessStudy | null;
  createTrainingEffectivenessStudy: (studyData: Omit<TrainingEffectivenessStudy, 'studyId' | 'lastUpdated'>) => Promise<TrainingEffectivenessStudy>;
  analyzeTrainingEffectiveness: (studyId: string, participantData: AnonymousPerformanceData[]) => Promise<TrainingEffectivenessStudy>;
  
  // User Satisfaction Metrics
  userSatisfactionMetrics: UserSatisfactionMetrics | null;
  collectUserSatisfactionMetrics: (userId: string, surveyType: UserSatisfactionMetrics['surveyType']) => Promise<UserSatisfactionMetrics>;
  
  // Long-term Outcome Tracking
  longTermOutcomes: LongTermOutcomeTracking | null;
  trackLongTermOutcomes: (userId: string, trackingPeriod: LongTermOutcomeTracking['trackingPeriod']) => Promise<LongTermOutcomeTracking>;
  
  // System Management
  destroy: () => void;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useResearchDataCollection(): UseResearchDataCollectionReturn {
  const [anonymousPerformanceData, setAnonymousPerformanceData] = useState<AnonymousPerformanceData[]>([]);
  const [trainingEffectivenessStudy, setTrainingEffectivenessStudy] = useState<TrainingEffectivenessStudy | null>(null);
  const [userSatisfactionMetrics, setUserSatisfactionMetrics] = useState<UserSatisfactionMetrics | null>(null);
  const [longTermOutcomes, setLongTermOutcomes] = useState<LongTermOutcomeTracking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update data periodically
  useEffect(() => {
    const updateData = () => {
      setAnonymousPerformanceData(researchDataCollection.getAnonymousPerformanceData('current-user'));
      setUserSatisfactionMetrics(researchDataCollection.getUserSatisfactionMetrics('current-user'));
      setLongTermOutcomes(researchDataCollection.getLongTermOutcomes('current-user'));
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Collect anonymous performance data
  const collectAnonymousPerformanceData = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await researchDataCollection.collectAnonymousPerformanceData(userId);
      setAnonymousPerformanceData(data);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to collect anonymous performance data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create training effectiveness study
  const createTrainingEffectivenessStudy = useCallback(async (studyData: Omit<TrainingEffectivenessStudy, 'studyId' | 'lastUpdated'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const study = await researchDataCollection.createTrainingEffectivenessStudy(studyData);
      setTrainingEffectivenessStudy(study);
      
      return study;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create training effectiveness study';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze training effectiveness
  const analyzeTrainingEffectiveness = useCallback(async (studyId: string, participantData: AnonymousPerformanceData[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const study = await researchDataCollection.analyzeTrainingEffectiveness(studyId, participantData);
      setTrainingEffectivenessStudy(study);
      
      return study;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze training effectiveness';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Collect user satisfaction metrics
  const collectUserSatisfactionMetrics = useCallback(async (userId: string, surveyType: UserSatisfactionMetrics['surveyType']) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const metrics = await researchDataCollection.collectUserSatisfactionMetrics(userId, surveyType);
      setUserSatisfactionMetrics(metrics);
      
      return metrics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to collect user satisfaction metrics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Track long-term outcomes
  const trackLongTermOutcomes = useCallback(async (userId: string, trackingPeriod: LongTermOutcomeTracking['trackingPeriod']) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const outcomes = await researchDataCollection.trackLongTermOutcomes(userId, trackingPeriod);
      setLongTermOutcomes(outcomes);
      
      return outcomes;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track long-term outcomes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Destroy service
  const destroy = useCallback(() => {
    researchDataCollection.destroy();
  }, []);

  return {
    anonymousPerformanceData,
    collectAnonymousPerformanceData,
    trainingEffectivenessStudy,
    createTrainingEffectivenessStudy,
    analyzeTrainingEffectiveness,
    userSatisfactionMetrics,
    collectUserSatisfactionMetrics,
    longTermOutcomes,
    trackLongTermOutcomes,
    destroy,
    isLoading,
    error,
  };
}
