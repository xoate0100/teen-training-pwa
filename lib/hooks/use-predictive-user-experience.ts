'use client';

import { useState, useEffect, useCallback } from 'react';
import { predictiveUserExperience } from '@/lib/services/predictive-user-experience';
import {
  AnticipatoryInterfaceChange,
  ProactiveContentDelivery,
  SmartRecommendationTiming,
  PersonalizedLearningPath,
} from '@/lib/services/predictive-user-experience';

export interface UsePredictiveUserExperienceReturn {
  // Anticipatory Interface Changes
  anticipatoryChanges: AnticipatoryInterfaceChange[];
  generateAnticipatoryChanges: (
    userId: string
  ) => Promise<AnticipatoryInterfaceChange[]>;

  // Proactive Content Delivery
  proactiveContent: ProactiveContentDelivery[];
  generateProactiveContent: (
    userId: string
  ) => Promise<ProactiveContentDelivery[]>;

  // Smart Recommendation Timing
  smartRecommendations: SmartRecommendationTiming[];
  generateSmartRecommendations: (
    userId: string
  ) => Promise<SmartRecommendationTiming[]>;

  // Personalized Learning Paths
  learningPaths: PersonalizedLearningPath[];
  generateLearningPaths: (
    userId: string
  ) => Promise<PersonalizedLearningPath[]>;

  // System Management
  destroy: () => void;

  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function usePredictiveUserExperience(): UsePredictiveUserExperienceReturn {
  const [anticipatoryChanges, setAnticipatoryChanges] = useState<
    AnticipatoryInterfaceChange[]
  >([]);
  const [proactiveContent, setProactiveContent] = useState<
    ProactiveContentDelivery[]
  >([]);
  const [smartRecommendations, setSmartRecommendations] = useState<
    SmartRecommendationTiming[]
  >([]);
  const [learningPaths, setLearningPaths] = useState<
    PersonalizedLearningPath[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update data periodically
  useEffect(() => {
    const updateData = () => {
      setAnticipatoryChanges(
        predictiveUserExperience.getAnticipatoryChanges('current-user')
      );
      setProactiveContent(
        predictiveUserExperience.getProactiveContent('current-user')
      );
      setSmartRecommendations(
        predictiveUserExperience.getSmartRecommendations('current-user')
      );
      setLearningPaths(
        predictiveUserExperience.getLearningPaths('current-user')
      );
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Generate anticipatory interface changes
  const generateAnticipatoryChanges = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const changes =
        await predictiveUserExperience.generateAnticipatoryInterfaceChanges(
          userId
        );
      setAnticipatoryChanges(changes);

      return changes;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate anticipatory interface changes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate proactive content
  const generateProactiveContent = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const content =
        await predictiveUserExperience.generateProactiveContent(userId);
      setProactiveContent(content);

      return content;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate proactive content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate smart recommendations
  const generateSmartRecommendations = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const recommendations =
        await predictiveUserExperience.generateSmartRecommendations(userId);
      setSmartRecommendations(recommendations);

      return recommendations;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate smart recommendations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate personalized learning paths
  const generateLearningPaths = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const paths =
        await predictiveUserExperience.generatePersonalizedLearningPaths(
          userId
        );
      setLearningPaths(paths);

      return paths;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate personalized learning paths';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Destroy service
  const destroy = useCallback(() => {
    predictiveUserExperience.destroy();
  }, []);

  return {
    anticipatoryChanges,
    generateAnticipatoryChanges,
    proactiveContent,
    generateProactiveContent,
    smartRecommendations,
    generateSmartRecommendations,
    learningPaths,
    generateLearningPaths,
    destroy,
    isLoading,
    error,
  };
}
