export interface UserPreferences {
  id: string;
  userId: string;
  visualTheme: {
    preferredColors: string[];
    preferredIntensity: 'subtle' | 'moderate' | 'bold';
    preferredAnimation: 'minimal' | 'standard' | 'extensive';
    preferredLayout: 'compact' | 'comfortable' | 'spacious';
    darkMode: boolean;
    highContrast: boolean;
  };
  interactionStyle: {
    preferredFeedback: 'subtle' | 'moderate' | 'intensive';
    preferredNotifications: 'minimal' | 'standard' | 'frequent';
    preferredHaptics: boolean;
    preferredSounds: boolean;
    preferredMicroInteractions: boolean;
  };
  contentDensity: {
    preferredInformationLevel: 'basic' | 'detailed' | 'comprehensive';
    preferredProgressDisplay: 'simple' | 'detailed' | 'analytical';
    preferredAchievementStyle: 'minimal' | 'celebratory' | 'gamified';
    preferredHelpLevel: 'minimal' | 'contextual' | 'comprehensive';
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    reducedMotion: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    colorBlindSupport: boolean;
  };
  learningPatterns: {
    preferredSessionLength: number; // in minutes
    preferredDifficultyProgression: 'gradual' | 'moderate' | 'aggressive';
    preferredExerciseTypes: string[];
    preferredMotivationStyle: 'encouraging' | 'challenging' | 'supportive';
    preferredGoalSetting: 'short-term' | 'long-term' | 'mixed';
  };
  socialPreferences: {
    shareAchievements: boolean;
    shareProgress: boolean;
    participateInChallenges: boolean;
    receiveSocialNotifications: boolean;
    preferredPrivacyLevel: 'private' | 'friends' | 'public';
  };
  lastUpdated: Date;
  version: number;
}

export interface InteractionEvent {
  id: string;
  userId: string;
  type:
    | 'theme_change'
    | 'layout_adjustment'
    | 'notification_interaction'
    | 'achievement_view'
    | 'session_completion'
    | 'help_request'
    | 'setting_change';
  data: Record<string, any>;
  timestamp: Date;
  context: {
    page: string;
    sessionId?: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
}

export interface PreferenceLearning {
  userId: string;
  themePreferences: {
    colorUsage: Record<string, number>;
    intensityUsage: Record<string, number>;
    animationUsage: Record<string, number>;
    layoutUsage: Record<string, number>;
  };
  interactionPatterns: {
    feedbackPreference: Record<string, number>;
    notificationEngagement: Record<string, number>;
    hapticUsage: number;
    soundUsage: number;
    microInteractionUsage: number;
  };
  contentEngagement: {
    informationLevelUsage: Record<string, number>;
    progressDisplayUsage: Record<string, number>;
    achievementStyleUsage: Record<string, number>;
    helpLevelUsage: Record<string, number>;
  };
  learningBehavior: {
    sessionLengths: number[];
    difficultyProgression: Record<string, number>;
    exerciseTypeEngagement: Record<string, number>;
    motivationStyleResponse: Record<string, number>;
    goalSettingPatterns: Record<string, number>;
  };
  socialBehavior: {
    sharingFrequency: number;
    challengeParticipation: number;
    socialNotificationEngagement: number;
    privacyLevelUsage: Record<string, number>;
  };
  lastAnalyzed: Date;
  confidence: number; // 0-1, how confident we are in the learned preferences
}

export class PersonalizationService {
  private static readonly PREFERENCES_KEY = 'user_preferences';
  private static readonly INTERACTIONS_KEY = 'user_interactions';
  private static readonly LEARNING_KEY = 'preference_learning';
  private static readonly MAX_INTERACTIONS = 1000; // Keep last 1000 interactions
  private static readonly LEARNING_THRESHOLD = 0.7; // Minimum confidence for applying learned preferences

  // Initialize default preferences for a new user
  static initializePreferences(userId: string): UserPreferences {
    const defaultPreferences: UserPreferences = {
      id: `prefs_${userId}_${Date.now()}`,
      userId,
      visualTheme: {
        preferredColors: ['#3b82f6', '#10b981', '#f59e0b'],
        preferredIntensity: 'moderate',
        preferredAnimation: 'standard',
        preferredLayout: 'comfortable',
        darkMode: false,
        highContrast: false,
      },
      interactionStyle: {
        preferredFeedback: 'moderate',
        preferredNotifications: 'standard',
        preferredHaptics: true,
        preferredSounds: true,
        preferredMicroInteractions: true,
      },
      contentDensity: {
        preferredInformationLevel: 'detailed',
        preferredProgressDisplay: 'detailed',
        preferredAchievementStyle: 'celebratory',
        preferredHelpLevel: 'contextual',
      },
      accessibility: {
        fontSize: 'medium',
        reducedMotion: false,
        screenReader: false,
        keyboardNavigation: false,
        colorBlindSupport: false,
      },
      learningPatterns: {
        preferredSessionLength: 45,
        preferredDifficultyProgression: 'moderate',
        preferredExerciseTypes: ['strength', 'volleyball', 'plyometric'],
        preferredMotivationStyle: 'encouraging',
        preferredGoalSetting: 'mixed',
      },
      socialPreferences: {
        shareAchievements: true,
        shareProgress: false,
        participateInChallenges: true,
        receiveSocialNotifications: true,
        preferredPrivacyLevel: 'friends',
      },
      lastUpdated: new Date(),
      version: 1,
    };

    this.savePreferences(defaultPreferences);
    return defaultPreferences;
  }

  // Get user preferences
  static getPreferences(userId: string): UserPreferences | null {
    try {
      const stored = localStorage.getItem(`${this.PREFERENCES_KEY}_${userId}`);
      if (!stored) return null;

      const preferences = JSON.parse(stored);
      return {
        ...preferences,
        lastUpdated: new Date(preferences.lastUpdated),
      };
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return null;
    }
  }

  // Save user preferences
  static savePreferences(preferences: UserPreferences): void {
    try {
      const updatedPreferences = {
        ...preferences,
        lastUpdated: new Date(),
        version: (preferences.version || 1) + 1,
      };

      localStorage.setItem(
        `${this.PREFERENCES_KEY}_${preferences.userId}`,
        JSON.stringify(updatedPreferences)
      );
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  // Update specific preference category
  static updatePreferences(
    userId: string,
    category: keyof UserPreferences,
    updates: Partial<UserPreferences[keyof UserPreferences]>
  ): UserPreferences | null {
    const current = this.getPreferences(userId);
    if (!current) return null;

    const updated = {
      ...current,
      [category]: {
        ...current[category],
        ...updates,
      },
    };

    this.savePreferences(updated);
    return updated;
  }

  // Record user interaction for learning
  static recordInteraction(
    event: Omit<InteractionEvent, 'id' | 'timestamp'>
  ): void {
    try {
      const interaction: InteractionEvent = {
        ...event,
        id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      // Get existing interactions
      const existing = this.getInteractions(event.userId);
      const updated = [interaction, ...existing].slice(
        0,
        this.MAX_INTERACTIONS
      );

      localStorage.setItem(
        `${this.INTERACTIONS_KEY}_${event.userId}`,
        JSON.stringify(updated)
      );

      // Trigger learning analysis
      this.analyzeUserBehavior(event.userId);
    } catch (error) {
      console.error('Error recording interaction:', error);
    }
  }

  // Get user interactions
  static getInteractions(userId: string): InteractionEvent[] {
    try {
      const stored = localStorage.getItem(`${this.INTERACTIONS_KEY}_${userId}`);
      if (!stored) return [];

      const interactions = JSON.parse(stored);
      return interactions.map((interaction: any) => ({
        ...interaction,
        timestamp: new Date(interaction.timestamp),
      }));
    } catch (error) {
      console.error('Error loading interactions:', error);
      return [];
    }
  }

  // Analyze user behavior and learn preferences
  static analyzeUserBehavior(userId: string): PreferenceLearning {
    const interactions = this.getInteractions(userId);
    const learning: PreferenceLearning = {
      userId,
      themePreferences: {
        colorUsage: {},
        intensityUsage: {},
        animationUsage: {},
        layoutUsage: {},
      },
      interactionPatterns: {
        feedbackPreference: {},
        notificationEngagement: {},
        hapticUsage: 0,
        soundUsage: 0,
        microInteractionUsage: 0,
      },
      contentEngagement: {
        informationLevelUsage: {},
        progressDisplayUsage: {},
        achievementStyleUsage: {},
        helpLevelUsage: {},
      },
      learningBehavior: {
        sessionLengths: [],
        difficultyProgression: {},
        exerciseTypeEngagement: {},
        motivationStyleResponse: {},
        goalSettingPatterns: {},
      },
      socialBehavior: {
        sharingFrequency: 0,
        challengeParticipation: 0,
        socialNotificationEngagement: 0,
        privacyLevelUsage: {},
      },
      lastAnalyzed: new Date(),
      confidence: 0,
    };

    // Analyze theme preferences
    const themeInteractions = interactions.filter(
      i => i.type === 'theme_change'
    );
    themeInteractions.forEach(interaction => {
      const { data } = interaction;
      if (data.color) {
        learning.themePreferences.colorUsage[data.color] =
          (learning.themePreferences.colorUsage[data.color] || 0) + 1;
      }
      if (data.intensity) {
        learning.themePreferences.intensityUsage[data.intensity] =
          (learning.themePreferences.intensityUsage[data.intensity] || 0) + 1;
      }
      if (data.animation) {
        learning.themePreferences.animationUsage[data.animation] =
          (learning.themePreferences.animationUsage[data.animation] || 0) + 1;
      }
      if (data.layout) {
        learning.themePreferences.layoutUsage[data.layout] =
          (learning.themePreferences.layoutUsage[data.layout] || 0) + 1;
      }
    });

    // Analyze interaction patterns
    const interactionEvents = interactions.filter(
      i => i.type === 'notification_interaction'
    );
    interactionEvents.forEach(interaction => {
      const { data } = interaction;
      if (data.feedbackType) {
        learning.interactionPatterns.feedbackPreference[data.feedbackType] =
          (learning.interactionPatterns.feedbackPreference[data.feedbackType] ||
            0) + 1;
      }
      if (data.hapticUsed) learning.interactionPatterns.hapticUsage++;
      if (data.soundUsed) learning.interactionPatterns.soundUsage++;
      if (data.microInteractionUsed)
        learning.interactionPatterns.microInteractionUsage++;
    });

    // Analyze content engagement
    const contentInteractions = interactions.filter(
      i => i.type === 'achievement_view' || i.type === 'help_request'
    );
    contentInteractions.forEach(interaction => {
      const { data } = interaction;
      if (data.informationLevel) {
        learning.contentEngagement.informationLevelUsage[
          data.informationLevel
        ] =
          (learning.contentEngagement.informationLevelUsage[
            data.informationLevel
          ] || 0) + 1;
      }
      if (data.progressDisplay) {
        learning.contentEngagement.progressDisplayUsage[data.progressDisplay] =
          (learning.contentEngagement.progressDisplayUsage[
            data.progressDisplay
          ] || 0) + 1;
      }
    });

    // Analyze learning behavior
    const sessionInteractions = interactions.filter(
      i => i.type === 'session_completion'
    );
    sessionInteractions.forEach(interaction => {
      const { data } = interaction;
      if (data.sessionLength) {
        learning.learningBehavior.sessionLengths.push(data.sessionLength);
      }
      if (data.difficulty) {
        learning.learningBehavior.difficultyProgression[data.difficulty] =
          (learning.learningBehavior.difficultyProgression[data.difficulty] ||
            0) + 1;
      }
      if (data.exerciseTypes) {
        data.exerciseTypes.forEach((type: string) => {
          learning.learningBehavior.exerciseTypeEngagement[type] =
            (learning.learningBehavior.exerciseTypeEngagement[type] || 0) + 1;
        });
      }
    });

    // Calculate confidence based on data volume and consistency
    const totalInteractions = interactions.length;
    const uniqueEventTypes = new Set(interactions.map(i => i.type)).size;
    learning.confidence = Math.min(
      1,
      (totalInteractions / 100) * (uniqueEventTypes / 7)
    );

    // Save learning data
    this.saveLearningData(learning);
    return learning;
  }

  // Get learning data
  static getLearningData(userId: string): PreferenceLearning | null {
    try {
      const stored = localStorage.getItem(`${this.LEARNING_KEY}_${userId}`);
      if (!stored) return null;

      const learning = JSON.parse(stored);
      return {
        ...learning,
        lastAnalyzed: new Date(learning.lastAnalyzed),
      };
    } catch (error) {
      console.error('Error loading learning data:', error);
      return null;
    }
  }

  // Save learning data
  static saveLearningData(learning: PreferenceLearning): void {
    try {
      localStorage.setItem(
        `${this.LEARNING_KEY}_${learning.userId}`,
        JSON.stringify(learning)
      );
    } catch (error) {
      console.error('Error saving learning data:', error);
    }
  }

  // Apply learned preferences to user settings
  static applyLearnedPreferences(userId: string): UserPreferences | null {
    const current = this.getPreferences(userId);
    const learning = this.getLearningData(userId);

    if (
      !current ||
      !learning ||
      learning.confidence < this.LEARNING_THRESHOLD
    ) {
      return current;
    }

    const updated = { ...current };

    // Apply learned theme preferences
    const mostUsedColor = this.getMostUsed(
      learning.themePreferences.colorUsage
    );
    if (mostUsedColor) {
      updated.visualTheme.preferredColors = [
        mostUsedColor,
        ...updated.visualTheme.preferredColors.filter(c => c !== mostUsedColor),
      ];
    }

    const mostUsedIntensity = this.getMostUsed(
      learning.themePreferences.intensityUsage
    );
    if (mostUsedIntensity) {
      updated.visualTheme.preferredIntensity = mostUsedIntensity as any;
    }

    const mostUsedAnimation = this.getMostUsed(
      learning.themePreferences.animationUsage
    );
    if (mostUsedAnimation) {
      updated.visualTheme.preferredAnimation = mostUsedAnimation as any;
    }

    const mostUsedLayout = this.getMostUsed(
      learning.themePreferences.layoutUsage
    );
    if (mostUsedLayout) {
      updated.visualTheme.preferredLayout = mostUsedLayout as any;
    }

    // Apply learned interaction preferences
    const mostUsedFeedback = this.getMostUsed(
      learning.interactionPatterns.feedbackPreference
    );
    if (mostUsedFeedback) {
      updated.interactionStyle.preferredFeedback = mostUsedFeedback as any;
    }

    // Apply learned content preferences
    const mostUsedInfoLevel = this.getMostUsed(
      learning.contentEngagement.informationLevelUsage
    );
    if (mostUsedInfoLevel) {
      updated.contentDensity.preferredInformationLevel =
        mostUsedInfoLevel as any;
    }

    const mostUsedProgressDisplay = this.getMostUsed(
      learning.contentEngagement.progressDisplayUsage
    );
    if (mostUsedProgressDisplay) {
      updated.contentDensity.preferredProgressDisplay =
        mostUsedProgressDisplay as any;
    }

    // Apply learned learning patterns
    if (learning.learningBehavior.sessionLengths.length > 0) {
      const avgSessionLength =
        learning.learningBehavior.sessionLengths.reduce((a, b) => a + b, 0) /
        learning.learningBehavior.sessionLengths.length;
      updated.learningPatterns.preferredSessionLength =
        Math.round(avgSessionLength);
    }

    const mostUsedDifficulty = this.getMostUsed(
      learning.learningBehavior.difficultyProgression
    );
    if (mostUsedDifficulty) {
      updated.learningPatterns.preferredDifficultyProgression =
        mostUsedDifficulty as any;
    }

    // Save updated preferences
    this.savePreferences(updated);
    return updated;
  }

  // Helper method to get most used item from usage tracking
  private static getMostUsed(usage: Record<string, number>): string | null {
    const entries = Object.entries(usage);
    if (entries.length === 0) return null;

    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  }

  // Get personalized recommendations based on learned preferences
  static getPersonalizedRecommendations(userId: string): {
    theme: string[];
    interactions: string[];
    content: string[];
    learning: string[];
  } {
    const learning = this.getLearningData(userId);
    if (!learning || learning.confidence < this.LEARNING_THRESHOLD) {
      return {
        theme: ['Try different color schemes to find your preference'],
        interactions: ['Enable haptic feedback for better engagement'],
        content: ['Adjust information density to your comfort level'],
        learning: ['Set personalized goals based on your progress'],
      };
    }

    const recommendations = {
      theme: [] as string[],
      interactions: [] as string[],
      content: [] as string[],
      learning: [] as string[],
    };

    // Theme recommendations
    if (learning.themePreferences.colorUsage['#3b82f6'] > 5) {
      recommendations.theme.push(
        'You seem to prefer blue themes - try our ocean theme'
      );
    }
    if (learning.themePreferences.intensityUsage['bold'] > 3) {
      recommendations.theme.push(
        'You enjoy bold visuals - try our high-contrast theme'
      );
    }

    // Interaction recommendations
    if (learning.interactionPatterns.hapticUsage > 10) {
      recommendations.interactions.push(
        'Keep haptic feedback enabled for better engagement'
      );
    }
    if (learning.interactionPatterns.microInteractionUsage < 5) {
      recommendations.interactions.push(
        'Try enabling micro-interactions for a more engaging experience'
      );
    }

    // Content recommendations
    if (learning.contentEngagement.informationLevelUsage['comprehensive'] > 5) {
      recommendations.content.push(
        'You prefer detailed information - try our analytical progress view'
      );
    }
    if (learning.contentEngagement.achievementStyleUsage['gamified'] > 3) {
      recommendations.content.push(
        'You enjoy gamified elements - explore our achievement system'
      );
    }

    // Learning recommendations
    if (learning.learningBehavior.sessionLengths.length > 0) {
      const avgLength =
        learning.learningBehavior.sessionLengths.reduce((a, b) => a + b, 0) /
        learning.learningBehavior.sessionLengths.length;
      if (avgLength > 60) {
        recommendations.learning.push(
          'You prefer longer sessions - try our extended workout programs'
        );
      } else if (avgLength < 30) {
        recommendations.learning.push(
          'You prefer shorter sessions - try our quick workout options'
        );
      }
    }

    return recommendations;
  }

  // Reset all personalization data for a user
  static resetPersonalization(userId: string): void {
    localStorage.removeItem(`${this.PREFERENCES_KEY}_${userId}`);
    localStorage.removeItem(`${this.INTERACTIONS_KEY}_${userId}`);
    localStorage.removeItem(`${this.LEARNING_KEY}_${userId}`);
  }
}
