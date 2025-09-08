'use client';

import { SessionData, CheckInData } from '@/lib/services/database-service';

import { BehaviorInsights } from './behavior-analysis-service';

import { PerformanceForecast } from './performance-prediction-service';
import {
  OpenAIService,
  ConversationContext,
  MotivationalMessage,
} from './openai-service';

export interface CoachingSession {
  id: string;
  userId: string;
  sessionId?: string;
  type:
    | 'form_feedback'
    | 'motivational'
    | 'technique_guidance'
    | 'progress_celebration'
    | 'general';
  startTime: string;
  endTime?: string;
  messages: CoachingMessage[];
  context: ConversationContext;
  status: 'active' | 'completed' | 'paused';
}

export interface CoachingMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  type: 'text' | 'form_feedback' | 'motivational' | 'technique' | 'celebration';
  metadata?: {
    exerciseId?: string;
    formScore?: number;
    confidence?: number;
    suggestions?: string[];
  };
}

export interface RealTimeFeedback {
  exerciseId: string;
  exerciseName: string;
  feedback: string;
  corrections: string[];
  safetyAlerts: string[];
  encouragement: string;
  nextSteps: string[];
  confidence: number;
  timestamp: string;
}

export interface MotivationalSystem {
  triggers: {
    achievement: string[];
    encouragement: string[];
    reminder: string[];
    celebration: string[];
  };
  messages: MotivationalMessage[];
  lastSent: Record<string, string>;
  frequency: {
    daily: number;
    weekly: number;
    perSession: number;
  };
}

export interface TechniqueImprovement {
  exerciseId: string;
  exerciseName: string;
  currentTechnique: string;
  targetTechnique: string;
  improvementPlan: {
    steps: string[];
    timeline: string;
    checkpoints: string[];
  };
  progress: {
    completed: string[];
    current: string;
    next: string;
  };
}

export interface GoalOrientedGuidance {
  userId: string;
  currentGoals: string[];
  progress: {
    goal: string;
    progress: number; // 0-100
    timeline: string;
    nextMilestone: string;
  }[];
  guidance: {
    goal: string;
    advice: string;
    actions: string[];
    timeline: string;
  }[];
}

export class CoachingAssistantService {
  private static coachingSessions: Map<string, CoachingSession> = new Map();
  private static motivationalSystem: MotivationalSystem = {
    triggers: {
      achievement: ['session_completed', 'pr_achieved', 'streak_milestone'],
      encouragement: ['low_energy', 'struggling', 'plateau'],
      reminder: ['missed_session', 'inconsistent_training'],
      celebration: ['goal_achieved', 'program_completed', 'major_milestone'],
    },
    messages: [],
    lastSent: {},
    frequency: {
      daily: 3,
      weekly: 10,
      perSession: 2,
    },
  };

  // Start a new coaching session
  static startCoachingSession(
    userId: string,
    type: CoachingSession['type'],
    context: ConversationContext,
    sessionId?: string
  ): CoachingSession {
    const coachingSession: CoachingSession = {
      id: this.generateSessionId(),
      userId,
      sessionId,
      type,
      startTime: new Date().toISOString(),
      messages: [],
      context,
      status: 'active',
    };

    this.coachingSessions.set(coachingSession.id, coachingSession);
    return coachingSession;
  }

  // Generate real-time form feedback
  static async generateRealTimeFormFeedback(
    exerciseId: string,
    exerciseName: string,
    formData: any,
    context: ConversationContext
  ): Promise<RealTimeFeedback> {
    try {
      const formFeedback = await OpenAIService.generateFormFeedback(
        exerciseName,
        context,
        formData.concerns || []
      );

      const feedback: RealTimeFeedback = {
        exerciseId,
        exerciseName,
        feedback: formFeedback.feedback,
        corrections: formFeedback.corrections,
        safetyAlerts: formFeedback.safetyNotes,
        encouragement: this.generateEncouragement(formFeedback.feedback),
        nextSteps: formFeedback.nextSteps,
        confidence: this.calculateFormConfidence(formData),
        timestamp: new Date().toISOString(),
      };

      return feedback;
    } catch (error) {
      console.error('Error generating form feedback:', error);
      throw new Error('Failed to generate form feedback');
    }
  }

  // Generate motivational messaging
  static async generateMotivationalMessaging(
    context: ConversationContext,
    trigger: string,
    intensity: 'gentle' | 'moderate' | 'strong' = 'moderate'
  ): Promise<MotivationalMessage | null> {
    try {
      // Check if we should send a message based on frequency limits
      if (!this.shouldSendMotivationalMessage(context.userId, trigger)) {
        return null;
      }

      const messageType = this.determineMessageType(trigger);
      const motivationalMessage =
        await OpenAIService.generateMotivationalMessage(
          context,
          messageType,
          intensity
        );

      // Update last sent time
      this.motivationalSystem.lastSent[`${context.userId}_${trigger}`] =
        new Date().toISOString();

      return motivationalMessage;
    } catch (error) {
      console.error('Error generating motivational message:', error);
      return null;
    }
  }

  // Generate technique improvement suggestions
  static async generateTechniqueImprovement(
    exerciseId: string,
    exerciseName: string,
    currentTechnique: string,
    context: ConversationContext
  ): Promise<TechniqueImprovement> {
    try {
      const techniqueGuidance = await OpenAIService.generateTechniqueGuidance(
        exerciseName,
        context,
        [currentTechnique]
      );

      const improvement: TechniqueImprovement = {
        exerciseId,
        exerciseName,
        currentTechnique,
        targetTechnique: this.extractTargetTechnique(techniqueGuidance),
        improvementPlan: {
          steps: this.extractImprovementSteps(techniqueGuidance),
          timeline: this.estimateImprovementTimeline(currentTechnique, context),
          checkpoints: this.generateCheckpoints(techniqueGuidance),
        },
        progress: {
          completed: [],
          current: this.extractCurrentStep(techniqueGuidance),
          next: this.extractNextStep(techniqueGuidance),
        },
      };

      return improvement;
    } catch (error) {
      console.error('Error generating technique improvement:', error);
      throw new Error('Failed to generate technique improvement');
    }
  }

  // Generate goal-oriented guidance
  static async generateGoalOrientedGuidance(
    userId: string,
    currentGoals: string[],
    context: ConversationContext
  ): Promise<GoalOrientedGuidance> {
    try {
      const progress = await this.calculateGoalProgress(currentGoals, context);
      const guidance = await this.generateGoalGuidance(
        currentGoals,
        progress,
        context
      );

      return {
        userId,
        currentGoals,
        progress,
        guidance,
      };
    } catch (error) {
      console.error('Error generating goal guidance:', error);
      throw new Error('Failed to generate goal guidance');
    }
  }

  // Process coaching conversation
  static async processCoachingConversation(
    sessionId: string,
    userMessage: string,
    context: ConversationContext
  ): Promise<CoachingMessage> {
    const session = this.coachingSessions.get(sessionId);
    if (!session) {
      throw new Error('Coaching session not found');
    }

    // Add user message to session
    const userMessageObj: CoachingMessage = {
      id: this.generateMessageId(),
      sessionId,
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    session.messages.push(userMessageObj);

    // Generate AI response
    const aiResponse = await OpenAIService.generateConversation(
      userMessage,
      context,
      this.determinePromptTemplate(session.type)
    );

    // Add AI response to session
    const aiMessage: CoachingMessage = {
      id: this.generateMessageId(),
      sessionId,
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date().toISOString(),
      type: this.determineMessageType(session.type),
      metadata: {
        confidence: aiResponse.confidence,
        suggestions: aiResponse.suggestions,
      },
    };

    session.messages.push(aiMessage);

    return aiMessage;
  }

  // Get coaching session
  static getCoachingSession(sessionId: string): CoachingSession | undefined {
    return this.coachingSessions.get(sessionId);
  }

  // End coaching session
  static endCoachingSession(sessionId: string): CoachingSession | undefined {
    const session = this.coachingSessions.get(sessionId);
    if (session) {
      session.status = 'completed';
      session.endTime = new Date().toISOString();
    }
    return session;
  }

  // Get motivational system status
  static getMotivationalSystemStatus(userId: string): {
    canSendMessage: boolean;
    lastSent: Record<string, string>;
    frequency: typeof this.motivationalSystem.frequency;
  } {
    return {
      canSendMessage: this.canSendMotivationalMessage(userId),
      lastSent: this.motivationalSystem.lastSent,
      frequency: this.motivationalSystem.frequency,
    };
  }

  // Helper methods
  private static generateSessionId(): string {
    return `coaching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static shouldSendMotivationalMessage(
    userId: string,
    trigger: string
  ): boolean {
    const key = `${userId}_${trigger}`;
    const lastSent = this.motivationalSystem.lastSent[key];

    if (!lastSent) return true;

    const timeSinceLastSent = Date.now() - new Date(lastSent).getTime();
    const minInterval = 30 * 60 * 1000; // 30 minutes

    return timeSinceLastSent > minInterval;
  }

  private static canSendMotivationalMessage(userId: string): boolean {
    const today = new Date().toDateString();
    const userMessages = Object.keys(this.motivationalSystem.lastSent)
      .filter(key => key.startsWith(userId))
      .map(key => this.motivationalSystem.lastSent[key])
      .filter(timestamp => new Date(timestamp).toDateString() === today);

    return userMessages.length < this.motivationalSystem.frequency.daily;
  }

  private static determineMessageType(
    trigger: string
  ): 'achievement' | 'encouragement' | 'reminder' | 'celebration' {
    if (this.motivationalSystem.triggers.achievement.includes(trigger))
      return 'achievement';
    if (this.motivationalSystem.triggers.encouragement.includes(trigger))
      return 'encouragement';
    if (this.motivationalSystem.triggers.reminder.includes(trigger))
      return 'reminder';
    if (this.motivationalSystem.triggers.celebration.includes(trigger))
      return 'celebration';
    return 'encouragement';
  }

  private static determinePromptTemplate(
    sessionType: CoachingSession['type']
  ): string {
    const templateMap = {
      form_feedback: 'formFeedback',
      motivational: 'motivationalMessage',
      technique_guidance: 'techniqueGuidance',
      progress_celebration: 'progressCelebration',
      general: 'formFeedback',
    };

    return templateMap[sessionType] || 'formFeedback';
  }

  private static determineCoachingMessageType(
    sessionType: CoachingSession['type']
  ): CoachingMessage['type'] {
    const typeMap = {
      form_feedback: 'form_feedback',
      motivational: 'motivational',
      technique_guidance: 'technique',
      progress_celebration: 'celebration',
      general: 'text',
    };

    return typeMap[sessionType] || 'text';
  }

  private static generateEncouragement(feedback: string): string {
    // Extract encouraging phrases from feedback
    const encouragingPhrases = [
      'Great job!',
      "You're doing well!",
      'Keep it up!',
      'Nice work!',
      'Excellent effort!',
    ];

    return encouragingPhrases[
      Math.floor(Math.random() * encouragingPhrases.length)
    ];
  }

  private static calculateFormConfidence(formData: any): number {
    // Simple confidence calculation based on form data
    if (!formData || !formData.scores) return 0.5;

    const scores = formData.scores;
    const avgScore =
      scores.reduce((sum: number, score: number) => sum + score, 0) /
      scores.length;

    return Math.min(1, Math.max(0, avgScore / 10));
  }

  private static extractTargetTechnique(guidance: string): string {
    // Simple extraction - in a real implementation, this would use NLP
    const lines = guidance.split('\n');
    for (const line of lines) {
      if (
        line.toLowerCase().includes('target') ||
        line.toLowerCase().includes('goal')
      ) {
        return line.trim();
      }
    }
    return 'Improve overall technique';
  }

  private static extractImprovementSteps(guidance: string): string[] {
    const steps: string[] = [];
    const lines = guidance.split('\n');

    for (const line of lines) {
      if (line.match(/^\d+\./) || line.toLowerCase().includes('step')) {
        steps.push(line.trim());
      }
    }

    return steps.length > 0
      ? steps
      : ['Practice regularly', 'Focus on form', 'Seek feedback'];
  }

  private static estimateImprovementTimeline(
    currentTechnique: string,
    context: ConversationContext
  ): string {
    // Simple estimation based on user level and technique complexity
    const userLevel = this.assessUserLevel(context);
    const complexity = this.assessTechniqueComplexity(currentTechnique);

    if (userLevel === 'beginner' && complexity === 'high') return '4-6 weeks';
    if (userLevel === 'intermediate' && complexity === 'medium')
      return '2-3 weeks';
    if (userLevel === 'advanced' && complexity === 'low') return '1-2 weeks';

    return '2-4 weeks';
  }

  private static generateCheckpoints(guidance: string): string[] {
    return [
      'Week 1: Focus on basic movement',
      'Week 2: Add complexity',
      'Week 3: Refine technique',
      'Week 4: Master the movement',
    ];
  }

  private static extractCurrentStep(guidance: string): string {
    const steps = this.extractImprovementSteps(guidance);
    return steps[0] || 'Start with basic movement';
  }

  private static extractNextStep(guidance: string): string {
    const steps = this.extractImprovementSteps(guidance);
    return steps[1] || 'Progress to next level';
  }

  private static assessUserLevel(context: ConversationContext): string {
    if (!context.behaviorInsights) return 'beginner';

    const consistency =
      context.behaviorInsights.patterns.consistency.weeklyFrequency;
    const experience = context.behaviorInsights.habits.workoutHabit.strength;

    if (consistency >= 4 && experience >= 0.8) return 'advanced';
    if (consistency >= 3 && experience >= 0.6) return 'intermediate';
    return 'beginner';
  }

  private static assessTechniqueComplexity(
    technique: string
  ): 'low' | 'medium' | 'high' {
    const complexExercises = ['squat', 'deadlift', 'clean', 'snatch'];
    const mediumExercises = ['bench press', 'overhead press', 'row'];

    const lowerTechnique = technique.toLowerCase();

    if (complexExercises.some(ex => lowerTechnique.includes(ex))) return 'high';
    if (mediumExercises.some(ex => lowerTechnique.includes(ex)))
      return 'medium';
    return 'low';
  }

  private static async calculateGoalProgress(
    goals: string[],
    context: ConversationContext
  ): Promise<GoalOrientedGuidance['progress']> {
    // Mock implementation - in a real app, this would analyze actual progress data
    return goals.map(goal => ({
      goal,
      progress: Math.floor(Math.random() * 100),
      timeline: '4-8 weeks',
      nextMilestone: `Complete ${goal} milestone`,
    }));
  }

  private static async generateGoalGuidance(
    goals: string[],
    progress: GoalOrientedGuidance['progress'],
    context: ConversationContext
  ): Promise<GoalOrientedGuidance['guidance']> {
    // Mock implementation - in a real app, this would generate personalized guidance
    return goals.map(goal => ({
      goal,
      advice: `Focus on consistent practice for ${goal}`,
      actions: ['Practice regularly', 'Track progress', 'Stay motivated'],
      timeline: '2-4 weeks',
    }));
  }
}
