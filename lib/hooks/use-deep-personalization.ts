'use client';

import { useState, useEffect, useCallback } from 'react';
import { deepPersonalization } from '@/lib/services/deep-personalization';
import {
  LearningStyleProfile,
  MotivationProfile,
  ChallengeLevelProfile,
  SupportSystemProfile,
  PersonalizationInsights,
} from '@/lib/services/deep-personalization';

export interface UseDeepPersonalizationReturn {
  // Learning Style Analysis
  learningStyleProfile: LearningStyleProfile | null;
  analyzeLearningStyle: (userId: string) => Promise<LearningStyleProfile>;

  // Motivation Pattern Recognition
  motivationProfile: MotivationProfile | null;
  analyzeMotivationPatterns: (userId: string) => Promise<MotivationProfile>;

  // Challenge Level Optimization
  challengeLevelProfile: ChallengeLevelProfile | null;
  analyzeChallengeLevel: (userId: string) => Promise<ChallengeLevelProfile>;

  // Support System Customization
  supportSystemProfile: SupportSystemProfile | null;
  analyzeSupportSystem: (userId: string) => Promise<SupportSystemProfile>;

  // Personalization Insights
  personalizationInsights: PersonalizationInsights | null;
  generatePersonalizationInsights: (
    userId: string
  ) => Promise<PersonalizationInsights>;

  // System Management
  destroy: () => void;

  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useDeepPersonalization(): UseDeepPersonalizationReturn {
  const [learningStyleProfile, setLearningStyleProfile] =
    useState<LearningStyleProfile | null>(null);
  const [motivationProfile, setMotivationProfile] =
    useState<MotivationProfile | null>(null);
  const [challengeLevelProfile, setChallengeLevelProfile] =
    useState<ChallengeLevelProfile | null>(null);
  const [supportSystemProfile, setSupportSystemProfile] =
    useState<SupportSystemProfile | null>(null);
  const [personalizationInsights, setPersonalizationInsights] =
    useState<PersonalizationInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update data periodically
  useEffect(() => {
    const updateData = () => {
      setLearningStyleProfile(
        deepPersonalization.getLearningStyleProfile('current-user')
      );
      setMotivationProfile(
        deepPersonalization.getMotivationProfile('current-user')
      );
      setChallengeLevelProfile(
        deepPersonalization.getChallengeLevelProfile('current-user')
      );
      setSupportSystemProfile(
        deepPersonalization.getSupportSystemProfile('current-user')
      );
      setPersonalizationInsights(
        deepPersonalization.getPersonalizationInsights('current-user')
      );
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Analyze learning style
  const analyzeLearningStyle = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const profile = await deepPersonalization.analyzeLearningStyle(userId);
      setLearningStyleProfile(profile);

      return profile;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to analyze learning style';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze motivation patterns
  const analyzeMotivationPatterns = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const profile =
        await deepPersonalization.analyzeMotivationPatterns(userId);
      setMotivationProfile(profile);

      return profile;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to analyze motivation patterns';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze challenge level
  const analyzeChallengeLevel = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const profile = await deepPersonalization.analyzeChallengeLevel(userId);
      setChallengeLevelProfile(profile);

      return profile;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to analyze challenge level';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze support system
  const analyzeSupportSystem = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const profile = await deepPersonalization.analyzeSupportSystem(userId);
      setSupportSystemProfile(profile);

      return profile;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to analyze support system';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate personalization insights
  const generatePersonalizationInsights = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const insights =
          await deepPersonalization.generatePersonalizationInsights(userId);
        setPersonalizationInsights(insights);

        return insights;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to generate personalization insights';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Destroy service
  const destroy = useCallback(() => {
    deepPersonalization.destroy();
  }, []);

  return {
    learningStyleProfile,
    analyzeLearningStyle,
    motivationProfile,
    analyzeMotivationPatterns,
    challengeLevelProfile,
    analyzeChallengeLevel,
    supportSystemProfile,
    analyzeSupportSystem,
    personalizationInsights,
    generatePersonalizationInsights,
    destroy,
    isLoading,
    error,
  };
}
