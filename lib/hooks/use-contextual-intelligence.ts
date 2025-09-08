'use client';

import { useState, useEffect, useCallback } from 'react';
import { contextualIntelligence } from '@/lib/services/contextual-intelligence';
import {
  EnvironmentalContext,
  TimeBasedOptimization,
  SocialContext,
  EmotionalState,
  ContextualInsights,
} from '@/lib/services/contextual-intelligence';

export interface UseContextualIntelligenceReturn {
  // Environmental Factor Consideration
  environmentalContext: EnvironmentalContext | null;
  analyzeEnvironmentalContext: (
    userId: string
  ) => Promise<EnvironmentalContext>;

  // Time-based Optimization
  timeBasedOptimization: TimeBasedOptimization | null;
  analyzeTimeBasedOptimization: (
    userId: string
  ) => Promise<TimeBasedOptimization>;

  // Social Context Awareness
  socialContext: SocialContext | null;
  analyzeSocialContext: (userId: string) => Promise<SocialContext>;

  // Emotional State Integration
  emotionalState: EmotionalState | null;
  analyzeEmotionalState: (userId: string) => Promise<EmotionalState>;

  // Contextual Insights
  contextualInsights: ContextualInsights | null;
  generateContextualInsights: (userId: string) => Promise<ContextualInsights>;

  // System Management
  destroy: () => void;

  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useContextualIntelligence(): UseContextualIntelligenceReturn {
  const [environmentalContext, setEnvironmentalContext] =
    useState<EnvironmentalContext | null>(null);
  const [timeBasedOptimization, setTimeBasedOptimization] =
    useState<TimeBasedOptimization | null>(null);
  const [socialContext, setSocialContext] = useState<SocialContext | null>(
    null
  );
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(
    null
  );
  const [contextualInsights, setContextualInsights] =
    useState<ContextualInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update data periodically
  useEffect(() => {
    const updateData = () => {
      setEnvironmentalContext(
        contextualIntelligence.getEnvironmentalContext('current-user')
      );
      setTimeBasedOptimization(
        contextualIntelligence.getTimeBasedOptimization('current-user')
      );
      setSocialContext(contextualIntelligence.getSocialContext('current-user'));
      setEmotionalState(
        contextualIntelligence.getEmotionalState('current-user')
      );
      setContextualInsights(
        contextualIntelligence.getContextualInsights('current-user')
      );
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Analyze environmental context
  const analyzeEnvironmentalContext = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const context =
        await contextualIntelligence.analyzeEnvironmentalContext(userId);
      setEnvironmentalContext(context);

      return context;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to analyze environmental context';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze time-based optimization
  const analyzeTimeBasedOptimization = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const optimization =
        await contextualIntelligence.analyzeTimeBasedOptimization(userId);
      setTimeBasedOptimization(optimization);

      return optimization;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to analyze time-based optimization';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze social context
  const analyzeSocialContext = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const context = await contextualIntelligence.analyzeSocialContext(userId);
      setSocialContext(context);

      return context;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to analyze social context';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze emotional state
  const analyzeEmotionalState = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const state = await contextualIntelligence.analyzeEmotionalState(userId);
      setEmotionalState(state);

      return state;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to analyze emotional state';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate contextual insights
  const generateContextualInsights = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const insights =
        await contextualIntelligence.generateContextualInsights(userId);
      setContextualInsights(insights);

      return insights;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate contextual insights';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Destroy service
  const destroy = useCallback(() => {
    contextualIntelligence.destroy();
  }, []);

  return {
    environmentalContext,
    analyzeEnvironmentalContext,
    timeBasedOptimization,
    analyzeTimeBasedOptimization,
    socialContext,
    analyzeSocialContext,
    emotionalState,
    analyzeEmotionalState,
    contextualInsights,
    generateContextualInsights,
    destroy,
    isLoading,
    error,
  };
}
