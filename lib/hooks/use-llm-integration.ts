'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  OpenAIService,
  ConversationContext,
  AIResponse,
  FormFeedback,
  MotivationalMessage,
} from '@/lib/services/openai-service';
import {
  CoachingAssistantService,
  CoachingSession,
  RealTimeFeedback,
  TechniqueImprovement,
  GoalOrientedGuidance,
} from '@/lib/services/coaching-assistant-service';
import {
  AdaptiveContentService,
  AdaptiveContent,
  PersonalizedWorkoutDescription,
  ContextualTip,
  ProgressCelebrationMessage,
} from '@/lib/services/adaptive-content-service';
import {
  SessionData,
  CheckInData,
  ProgressMetrics,
} from '@/lib/services/database-service';
import { BehaviorInsights } from '@/lib/services/behavior-analysis-service';
import { PerformanceForecast } from '@/lib/services/performance-prediction-service';

export interface LLMIntegrationState {
  // OpenAI Integration
  conversationHistory: ConversationContext['conversationHistory'];
  lastResponse: AIResponse | null;
  isGenerating: boolean;

  // Coaching Assistant
  activeCoachingSession: CoachingSession | null;
  realTimeFeedback: RealTimeFeedback | null;
  motivationalMessages: MotivationalMessage[];

  // Adaptive Content
  adaptiveContent: AdaptiveContent | null;
  personalizedWorkout: PersonalizedWorkoutDescription | null;
  contextualTips: ContextualTip[];
  progressCelebrations: ProgressCelebrationMessage[];

  // General State
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface LLMIntegrationActions {
  // OpenAI Actions
  sendMessage: (
    message: string,
    context: ConversationContext
  ) => Promise<AIResponse>;
  generateFormFeedback: (
    exercise: string,
    context: ConversationContext,
    concerns?: string[]
  ) => Promise<FormFeedback>;
  generateMotivationalMessage: (
    context: ConversationContext,
    type: 'achievement' | 'encouragement' | 'reminder' | 'celebration',
    intensity?: 'gentle' | 'moderate' | 'strong'
  ) => Promise<MotivationalMessage>;
  generateTechniqueGuidance: (
    exercise: string,
    context: ConversationContext,
    issues?: string[]
  ) => Promise<string>;

  // Coaching Assistant Actions
  startCoachingSession: (
    userId: string,
    type: CoachingSession['type'],
    context: ConversationContext,
    sessionId?: string
  ) => CoachingSession;
  generateRealTimeFeedback: (
    exerciseId: string,
    exerciseName: string,
    formData: any,
    context: ConversationContext
  ) => Promise<RealTimeFeedback>;
  generateTechniqueImprovement: (
    exerciseId: string,
    exerciseName: string,
    currentTechnique: string,
    context: ConversationContext
  ) => Promise<TechniqueImprovement>;
  generateGoalGuidance: (
    userId: string,
    goals: string[],
    context: ConversationContext
  ) => Promise<GoalOrientedGuidance>;

  // Adaptive Content Actions
  generateWorkoutDescription: (
    sessionData: any,
    context: ConversationContext
  ) => Promise<PersonalizedWorkoutDescription>;
  generateContextualTips: (
    context: ConversationContext,
    phase: string,
    sessionType: string
  ) => ContextualTip[];
  generateProgressCelebration: (
    achievement: any,
    context: ConversationContext
  ) => Promise<ProgressCelebrationMessage>;
  generateAdaptiveContent: (
    sessionData: any,
    context: ConversationContext,
    phase: string
  ) => Promise<AdaptiveContent>;

  // General Actions
  refreshAll: () => Promise<void>;
  clearError: () => void;
  updateContext: (newContext: Partial<ConversationContext>) => void;
}

export function useLLMIntegration(
  sessions: SessionData[] = [],
  checkIns: CheckInData[] = [],

  progressMetrics: ProgressMetrics[] = [],
  behaviorInsights: BehaviorInsights | null = null,
  performanceForecast: PerformanceForecast | null = null,
  userId: string = 'default-user',
  currentPhase: string = 'build'
): LLMIntegrationState & LLMIntegrationActions {
  const [state, setState] = useState<LLMIntegrationState>({
    conversationHistory: [],
    lastResponse: null,
    isGenerating: false,
    activeCoachingSession: null,
    realTimeFeedback: null,
    motivationalMessages: [],
    adaptiveContent: null,
    personalizedWorkout: null,
    contextualTips: [],
    progressCelebrations: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  // Create conversation context
  const createConversationContext = useCallback((): ConversationContext => {
    return {
      userId,
      currentPhase,
      recentSessions: sessions.slice(0, 5),
      recentCheckIns: checkIns.slice(0, 3),
      behaviorInsights,
      performanceForecast,
      conversationHistory: state.conversationHistory,
      userPreferences: {
        communicationStyle: 'encouraging',
        detailLevel: 'moderate',
        focusAreas: ['form', 'safety', 'progress'],
      },
    };
  }, [
    userId,
    currentPhase,
    sessions,
    checkIns,
    behaviorInsights,
    performanceForecast,
    state.conversationHistory,
  ]);

  // Send message and get AI response
  const sendMessage = useCallback(
    async (
      message: string,
      context: ConversationContext
    ): Promise<AIResponse> => {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));

      try {
        const response = await OpenAIService.generateConversation(
          message,
          context
        );

        setState(prev => ({
          ...prev,
          lastResponse: response,
          conversationHistory: [
            ...prev.conversationHistory,
            {
              role: 'user',
              content: message,
              timestamp: new Date().toISOString(),
            },
            {
              role: 'assistant',
              content: response.content,
              timestamp: new Date().toISOString(),
            },
          ],
          lastUpdated: new Date().toISOString(),
        }));

        return response;
      } catch (error) {
        console.error('Error sending message:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error ? error.message : 'Failed to send message',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isGenerating: false }));
      }
    },
    []
  );

  // Generate form feedback
  const generateFormFeedback = useCallback(
    async (
      exercise: string,
      context: ConversationContext,
      concerns: string[] = []
    ): Promise<FormFeedback> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const feedback = await OpenAIService.generateFormFeedback(
          exercise,
          context,
          concerns
        );
        setState(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
        return feedback;
      } catch (error) {
        console.error('Error generating form feedback:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate form feedback',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate motivational message
  const generateMotivationalMessage = useCallback(
    async (
      context: ConversationContext,
      type: 'achievement' | 'encouragement' | 'reminder' | 'celebration',
      intensity: 'gentle' | 'moderate' | 'strong' = 'moderate'
    ): Promise<MotivationalMessage> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const message = await OpenAIService.generateMotivationalMessage(
          context,
          type,
          intensity
        );

        setState(prev => ({
          ...prev,
          motivationalMessages: [...prev.motivationalMessages, message],
          lastUpdated: new Date().toISOString(),
        }));

        return message;
      } catch (error) {
        console.error('Error generating motivational message:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate motivational message',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate technique guidance
  const generateTechniqueGuidance = useCallback(
    async (
      exercise: string,
      context: ConversationContext,
      issues: string[] = []
    ): Promise<string> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const guidance = await OpenAIService.generateTechniqueGuidance(
          exercise,
          context,
          issues
        );
        setState(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
        return guidance;
      } catch (error) {
        console.error('Error generating technique guidance:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate technique guidance',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Start coaching session
  const startCoachingSession = useCallback(
    (
      userId: string,
      type: CoachingSession['type'],
      context: ConversationContext,
      sessionId?: string
    ): CoachingSession => {
      const session = CoachingAssistantService.startCoachingSession(
        userId,
        type,
        context,
        sessionId
      );

      setState(prev => ({
        ...prev,
        activeCoachingSession: session,
        lastUpdated: new Date().toISOString(),
      }));

      return session;
    },
    []
  );

  // Generate real-time feedback
  const generateRealTimeFeedback = useCallback(
    async (
      exerciseId: string,
      exerciseName: string,
      formData: any,
      context: ConversationContext
    ): Promise<RealTimeFeedback> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const feedback =
          await CoachingAssistantService.generateRealTimeFormFeedback(
            exerciseId,
            exerciseName,
            formData,
            context
          );

        setState(prev => ({
          ...prev,
          realTimeFeedback: feedback,
          lastUpdated: new Date().toISOString(),
        }));

        return feedback;
      } catch (error) {
        console.error('Error generating real-time feedback:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate real-time feedback',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate technique improvement
  const generateTechniqueImprovement = useCallback(
    async (
      exerciseId: string,
      exerciseName: string,
      currentTechnique: string,
      context: ConversationContext
    ): Promise<TechniqueImprovement> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const improvement =
          await CoachingAssistantService.generateTechniqueImprovement(
            exerciseId,
            exerciseName,
            currentTechnique,
            context
          );

        setState(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
        return improvement;
      } catch (error) {
        console.error('Error generating technique improvement:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate technique improvement',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate goal guidance
  const generateGoalGuidance = useCallback(
    async (
      userId: string,
      goals: string[],
      context: ConversationContext
    ): Promise<GoalOrientedGuidance> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const guidance =
          await CoachingAssistantService.generateGoalOrientedGuidance(
            userId,
            goals,
            context
          );

        setState(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
        return guidance;
      } catch (error) {
        console.error('Error generating goal guidance:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate goal guidance',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate workout description
  const generateWorkoutDescription = useCallback(
    async (
      sessionData: any,
      context: ConversationContext
    ): Promise<PersonalizedWorkoutDescription> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const description =
          await AdaptiveContentService.generatePersonalizedWorkoutDescription(
            sessionData,
            context
          );

        setState(prev => ({
          ...prev,
          personalizedWorkout: description,
          lastUpdated: new Date().toISOString(),
        }));

        return description;
      } catch (error) {
        console.error('Error generating workout description:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate workout description',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate contextual tips
  const generateContextualTips = useCallback(
    (
      context: ConversationContext,
      phase: string,
      sessionType: string
    ): ContextualTip[] => {
      const tips = AdaptiveContentService.generateContextualTips(
        context,
        phase,
        sessionType
      );

      setState(prev => ({
        ...prev,
        contextualTips: tips,
        lastUpdated: new Date().toISOString(),
      }));

      return tips;
    },
    []
  );

  // Generate progress celebration
  const generateProgressCelebration = useCallback(
    async (
      achievement: any,
      context: ConversationContext
    ): Promise<ProgressCelebrationMessage> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const celebration =
          await AdaptiveContentService.generateProgressCelebration(
            achievement,
            context
          );

        setState(prev => ({
          ...prev,
          progressCelebrations: [...prev.progressCelebrations, celebration],
          lastUpdated: new Date().toISOString(),
        }));

        return celebration;
      } catch (error) {
        console.error('Error generating progress celebration:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate progress celebration',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate adaptive content
  const generateAdaptiveContent = useCallback(
    async (
      sessionData: any,
      context: ConversationContext,
      phase: string
    ): Promise<AdaptiveContent> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const content = await AdaptiveContentService.generateAdaptiveContent(
          sessionData,
          context,
          phase
        );

        setState(prev => ({
          ...prev,
          adaptiveContent: content,
          lastUpdated: new Date().toISOString(),
        }));

        return content;
      } catch (error) {
        console.error('Error generating adaptive content:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate adaptive content',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const context = createConversationContext();

      // Generate contextual tips
      generateContextualTips(context, currentPhase, 'strength');

      // Generate motivational message
      await generateMotivationalMessage(context, 'encouragement', 'moderate');

      setState(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
    } catch (error) {
      console.error('Error refreshing LLM integration:', error);
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error ? error.message : 'Failed to refresh data',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [
    createConversationContext,
    generateContextualTips,
    generateMotivationalMessage,
    currentPhase,
  ]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Update context
  const updateContext = useCallback(
    (newContext: Partial<ConversationContext>) => {
      setState(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  // Auto-refresh when data changes
  useEffect(() => {
    if (sessions.length > 0 || checkIns.length > 0) {
      refreshAll();
    }
  }, [sessions.length, checkIns.length, refreshAll]);

  return {
    ...state,
    sendMessage,
    generateFormFeedback,
    generateMotivationalMessage,
    generateTechniqueGuidance,
    startCoachingSession,
    generateRealTimeFeedback,
    generateTechniqueImprovement,
    generateGoalGuidance,
    generateWorkoutDescription,
    generateContextualTips,
    generateProgressCelebration,
    generateAdaptiveContent,
    refreshAll,
    clearError,
    updateContext,
  };
}
