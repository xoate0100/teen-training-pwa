'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  BehaviorAnalysisService,
  BehaviorInsights,
} from '@/lib/services/behavior-analysis-service';
import {
  PerformancePredictionService,
  PerformanceForecast,
} from '@/lib/services/performance-prediction-service';
import {
  AdaptiveRecommendationService,
  AdaptiveRecommendations,
} from '@/lib/services/adaptive-recommendation-service';
import {
  SessionData,
  CheckInData,
  ProgressMetrics,
} from '@/lib/services/database-service';

export interface AIIntelligenceState {
  behaviorInsights: BehaviorInsights | null;
  performanceForecast: PerformanceForecast | null;
  adaptiveRecommendations: AdaptiveRecommendations | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface AIIntelligenceActions {
  refreshAll: () => Promise<void>;
  refreshBehaviorAnalysis: () => Promise<void>;
  refreshPerformancePrediction: () => Promise<void>;
  refreshAdaptiveRecommendations: () => Promise<void>;
  updateUserData: (
    sessions: SessionData[],
    checkIns: CheckInData[],
    progressMetrics: ProgressMetrics[]
  ) => void;
}

export function useAIIntelligence(
  sessions: SessionData[] = [],
  checkIns: CheckInData[] = [],
  progressMetrics: ProgressMetrics[] = [],
  currentPhase: string = 'build',
  availableEquipment: string[] = []
): AIIntelligenceState & AIIntelligenceActions {
  const [state, setState] = useState<AIIntelligenceState>({
    behaviorInsights: null,
    performanceForecast: null,
    adaptiveRecommendations: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  // Update user data and trigger analysis
  const updateUserData = useCallback(
    (
      newSessions: SessionData[],

      newCheckIns: CheckInData[],

      newProgressMetrics: ProgressMetrics[]
    ) => {
      // This would typically trigger a re-analysis
      // For now, we'll just update the state
      setState(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  // Refresh behavior analysis
  const refreshBehaviorAnalysis = useCallback(async () => {
    if (sessions.length === 0 && checkIns.length === 0) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const behaviorInsights = BehaviorAnalysisService.generateBehaviorInsights(
        sessions,
        checkIns,
        progressMetrics
      );

      setState(prev => ({
        ...prev,
        behaviorInsights,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error ? error.message : 'Failed to analyze behavior',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [sessions, checkIns, progressMetrics]);

  // Refresh performance prediction
  const refreshPerformancePrediction = useCallback(async () => {
    if (sessions.length === 0) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const performanceForecast =
        PerformancePredictionService.generatePerformanceForecast(
          sessions,
          checkIns,
          progressMetrics,
          100, // Default goal strength
          currentPhase
        );

      setState(prev => ({
        ...prev,
        performanceForecast,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error predicting performance:', error);
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to predict performance',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [sessions, checkIns, progressMetrics, currentPhase]);

  // Refresh adaptive recommendations
  const refreshAdaptiveRecommendations = useCallback(async () => {
    if (!state.behaviorInsights || !state.performanceForecast) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const adaptiveRecommendations =
        AdaptiveRecommendationService.generateAdaptiveRecommendations(
          state.behaviorInsights,
          state.performanceForecast,
          currentPhase,
          availableEquipment
        );

      setState(prev => ({
        ...prev,
        adaptiveRecommendations,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error generating adaptive recommendations:', error);
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate recommendations',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [
    state.behaviorInsights,
    state.performanceForecast,
    currentPhase,
    availableEquipment,
  ]);

  // Refresh all AI intelligence
  const refreshAll = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Run all analyses in parallel
      await Promise.all([
        refreshBehaviorAnalysis(),
        refreshPerformancePrediction(),
      ]);

      // Wait for the state to update, then refresh recommendations
      setTimeout(() => {
        refreshAdaptiveRecommendations();
      }, 100);
    } catch (error) {
      console.error('Error refreshing AI intelligence:', error);
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to refresh AI intelligence',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [
    refreshBehaviorAnalysis,
    refreshPerformancePrediction,
    refreshAdaptiveRecommendations,
  ]);

  // Auto-refresh when data changes
  useEffect(() => {
    if (sessions.length > 0 || checkIns.length > 0) {
      refreshAll();
    }
  }, [sessions.length, checkIns.length, refreshAll]);

  // Auto-refresh recommendations when insights change
  useEffect(() => {
    if (
      state.behaviorInsights &&
      state.performanceForecast &&
      !state.adaptiveRecommendations
    ) {
      refreshAdaptiveRecommendations();
    }
  }, [
    state.behaviorInsights,
    state.performanceForecast,
    state.adaptiveRecommendations,
    refreshAdaptiveRecommendations,
  ]);

  return {
    ...state,
    refreshAll,
    refreshBehaviorAnalysis,
    refreshPerformancePrediction,
    refreshAdaptiveRecommendations,
    updateUserData,
  };
}

// Specialized hooks for specific AI features
export function useBehaviorAnalysis(
  sessions: SessionData[],
  checkIns: CheckInData[],
  progressMetrics: ProgressMetrics[]
) {
  const [insights, setInsights] = useState<BehaviorInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    if (sessions.length === 0 && checkIns.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const behaviorInsights = BehaviorAnalysisService.generateBehaviorInsights(
        sessions,
        checkIns,
        progressMetrics
      );
      setInsights(behaviorInsights);
    } catch (err) {
      console.error('Error analyzing behavior:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to analyze behavior'
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessions, checkIns, progressMetrics]);

  useEffect(() => {
    analyze();
  }, [analyze]);

  return { insights, isLoading, error, refresh: analyze };
}

export function usePerformancePrediction(
  sessions: SessionData[],
  checkIns: CheckInData[],
  progressMetrics: ProgressMetrics[],
  currentPhase: string = 'build',
  goalStrength: number = 100
) {
  const [forecast, setForecast] = useState<PerformanceForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = useCallback(async () => {
    if (sessions.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const performanceForecast =
        PerformancePredictionService.generatePerformanceForecast(
          sessions,
          checkIns,
          progressMetrics,
          goalStrength,
          currentPhase
        );
      setForecast(performanceForecast);
    } catch (err) {
      console.error('Error predicting performance:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to predict performance'
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessions, checkIns, progressMetrics, goalStrength, currentPhase]);

  useEffect(() => {
    predict();
  }, [predict]);

  return { forecast, isLoading, error, refresh: predict };
}

export function useAdaptiveRecommendations(
  behaviorInsights: BehaviorInsights | null,
  performanceForecast: PerformanceForecast | null,
  currentPhase: string = 'build',
  availableEquipment: string[] = []
) {
  const [recommendations, setRecommendations] =
    useState<AdaptiveRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!behaviorInsights || !performanceForecast) return;

    setIsLoading(true);
    setError(null);

    try {
      const adaptiveRecommendations =
        AdaptiveRecommendationService.generateAdaptiveRecommendations(
          behaviorInsights,
          performanceForecast,
          currentPhase,
          availableEquipment
        );
      setRecommendations(adaptiveRecommendations);
    } catch (err) {
      console.error('Error generating adaptive recommendations:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate recommendations'
      );
    } finally {
      setIsLoading(false);
    }
  }, [behaviorInsights, performanceForecast, currentPhase, availableEquipment]);

  useEffect(() => {
    generate();
  }, [generate]);

  return { recommendations, isLoading, error, refresh: generate };
}
