'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  PersonalizationService,
  UserPreferences,
  InteractionEvent,
  PreferenceLearning,
} from '@/lib/services/personalization-service';

interface PersonalizationContextType {
  preferences: UserPreferences | null;
  learning: PreferenceLearning | null;
  isLoading: boolean;
  updatePreferences: (category: keyof UserPreferences, updates: any) => void;
  recordInteraction: (
    event: Omit<InteractionEvent, 'id' | 'timestamp' | 'userId'>
  ) => void;
  applyLearnedPreferences: () => void;
  getRecommendations: () => {
    theme: string[];
    interactions: string[];
    content: string[];
    learning: string[];
  };
  resetPersonalization: () => void;
}

const PersonalizationContext = createContext<
  PersonalizationContextType | undefined
>(undefined);

interface PersonalizationProviderProps {
  children: ReactNode;
  userId: string;
}

export function PersonalizationProvider({
  children,
  userId,
}: PersonalizationProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [learning, setLearning] = useState<PreferenceLearning | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize preferences on mount
  useEffect(() => {
    const initializePersonalization = async () => {
      try {
        setIsLoading(true);

        // Get or create user preferences
        let userPreferences = PersonalizationService.getPreferences(userId);
        if (!userPreferences) {
          userPreferences =
            PersonalizationService.initializePreferences(userId);
        }

        // Get learning data
        const learningData = PersonalizationService.getLearningData(userId);

        // Apply learned preferences if confidence is high enough
        const updatedPreferences =
          PersonalizationService.applyLearnedPreferences(userId);

        setPreferences(updatedPreferences || userPreferences);
        setLearning(learningData);
      } catch (error) {
        console.error('Error initializing personalization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      initializePersonalization();
    }
  }, [userId]);

  // Update preferences
  const updatePreferences = (category: keyof UserPreferences, updates: any) => {
    if (!userId) return;

    const updated = PersonalizationService.updatePreferences(
      userId,
      category,
      updates
    );
    if (updated) {
      setPreferences(updated);

      // Record the preference change as an interaction
      recordInteraction({
        type: 'setting_change',
        data: { category, updates },
        context: {
          page: window.location.pathname,
          deviceType:
            window.innerWidth < 768
              ? 'mobile'
              : window.innerWidth < 1024
                ? 'tablet'
                : 'desktop',
          timeOfDay: getTimeOfDay(),
        },
      });
    }
  };

  // Record user interaction
  const recordInteraction = (
    event: Omit<InteractionEvent, 'id' | 'timestamp' | 'userId'>
  ) => {
    if (!userId) return;

    PersonalizationService.recordInteraction({
      ...event,
      userId,
    });

    // Update learning data after recording interaction
    const updatedLearning = PersonalizationService.getLearningData(userId);
    setLearning(updatedLearning);
  };

  // Apply learned preferences
  const applyLearnedPreferences = () => {
    if (!userId) return;

    const updated = PersonalizationService.applyLearnedPreferences(userId);
    if (updated) {
      setPreferences(updated);
    }
  };

  // Get personalized recommendations
  const getRecommendations = () => {
    if (!userId) {
      return {
        theme: [],
        interactions: [],
        content: [],
        learning: [],
      };
    }

    return PersonalizationService.getPersonalizedRecommendations(userId);
  };

  // Reset personalization data
  const resetPersonalization = () => {
    if (!userId) return;

    PersonalizationService.resetPersonalization(userId);
    const newPreferences = PersonalizationService.initializePreferences(userId);
    setPreferences(newPreferences);
    setLearning(null);
  };

  // Helper function to determine time of day
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const value: PersonalizationContextType = {
    preferences,
    learning,
    isLoading,
    updatePreferences,
    recordInteraction,
    applyLearnedPreferences,
    getRecommendations,
    resetPersonalization,
  };

  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error(
      'usePersonalization must be used within a PersonalizationProvider'
    );
  }
  return context;
}

// Hook for getting personalized styles based on user preferences
export function usePersonalizedStyles() {
  const { preferences } = usePersonalization();

  if (!preferences) {
    return {
      theme: 'default',
      intensity: 'moderate',
      animation: 'standard',
      layout: 'comfortable',
      fontSize: 'medium',
      reducedMotion: false,
    };
  }

  return {
    theme: preferences.visualTheme.preferredColors[0] || '#3b82f6',
    intensity: preferences.visualTheme.preferredIntensity,
    animation: preferences.visualTheme.preferredAnimation,
    layout: preferences.visualTheme.preferredLayout,
    fontSize: preferences.accessibility.fontSize,
    reducedMotion: preferences.accessibility.reducedMotion,
    highContrast: preferences.visualTheme.highContrast,
    darkMode: preferences.visualTheme.darkMode,
  };
}

// Hook for getting personalized content density
export function usePersonalizedContent() {
  const { preferences } = usePersonalization();

  if (!preferences) {
    return {
      informationLevel: 'detailed',
      progressDisplay: 'detailed',
      achievementStyle: 'celebratory',
      helpLevel: 'contextual',
    };
  }

  return {
    informationLevel: preferences.contentDensity.preferredInformationLevel,
    progressDisplay: preferences.contentDensity.preferredProgressDisplay,
    achievementStyle: preferences.contentDensity.preferredAchievementStyle,
    helpLevel: preferences.contentDensity.preferredHelpLevel,
  };
}

// Hook for getting personalized interaction settings
export function usePersonalizedInteractions() {
  const { preferences } = usePersonalization();

  if (!preferences) {
    return {
      feedback: 'moderate',
      notifications: 'standard',
      haptics: true,
      sounds: true,
      microInteractions: true,
    };
  }

  return {
    feedback: preferences.interactionStyle.preferredFeedback,
    notifications: preferences.interactionStyle.preferredNotifications,
    haptics: preferences.interactionStyle.preferredHaptics,
    sounds: preferences.interactionStyle.preferredSounds,
    microInteractions: preferences.interactionStyle.preferredMicroInteractions,
  };
}
