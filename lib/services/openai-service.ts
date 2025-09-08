'use client';

import { SessionData, CheckInData } from '@/lib/services/database-service';
import { BehaviorInsights } from './behavior-analysis-service';
import { PerformanceForecast } from './performance-prediction-service';

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    sessionId?: string;
    exerciseId?: string;
    phase?: string;
  };
}

export interface ConversationContext {
  userId: string;
  currentPhase: string;
  recentSessions: SessionData[];
  recentCheckIns: CheckInData[];
  behaviorInsights: BehaviorInsights | null;
  performanceForecast: PerformanceForecast | null;
  conversationHistory: ConversationMessage[];
  userPreferences: {
    communicationStyle: 'encouraging' | 'technical' | 'casual' | 'motivational';
    detailLevel: 'brief' | 'moderate' | 'detailed';
    focusAreas: string[];
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  contextVariables: string[];
  maxTokens: number;
  temperature: number;
}

export interface AIResponse {
  content: string;
  confidence: number;
  suggestions: string[];
  followUpQuestions: string[];
  context: {
    phase: string;
    focus: string[];
    intensity: 'low' | 'moderate' | 'high';
  };
}

export interface FormFeedback {
  exercise: string;
  feedback: string;
  corrections: string[];
  improvements: string[];
  safetyNotes: string[];
  nextSteps: string[];
}

export interface MotivationalMessage {
  type: 'achievement' | 'encouragement' | 'reminder' | 'celebration';
  message: string;
  intensity: 'gentle' | 'moderate' | 'strong';
  timing: 'pre-workout' | 'during-workout' | 'post-workout' | 'anytime';
}

export class OpenAIService {
  private static readonly API_BASE_URL = 'https://api.openai.com/v1';
  private static readonly DEFAULT_MODEL = 'gpt-4';
  private static readonly MAX_CONVERSATION_HISTORY = 10;

  // Prompt templates for different use cases
  private static readonly PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
    formFeedback: {
      id: 'form_feedback',
      name: 'Exercise Form Feedback',
      systemPrompt: `You are an expert personal trainer and movement specialist with 15+ years of experience working with teenagers. Your role is to provide constructive, encouraging, and safety-focused feedback on exercise form.

Key principles:
- Always prioritize safety and injury prevention
- Use encouraging, age-appropriate language
- Provide specific, actionable corrections
- Focus on one or two key points at a time
- Celebrate what they're doing well
- Explain the "why" behind corrections
- Keep explanations concise but clear

Communication style: Encouraging, supportive, and educational.`,
      userPromptTemplate: `Please provide form feedback for the following exercise:

Exercise: {exerciseName}
User Level: {userLevel}
Current Phase: {currentPhase}
Recent Performance: {recentPerformance}
Specific Concerns: {concerns}

Please provide:
1. What they're doing well
2. Key corrections needed
3. Safety considerations
4. Next steps for improvement

Keep it encouraging and age-appropriate for a teenager.`,
      contextVariables: [
        'exerciseName',
        'userLevel',
        'currentPhase',
        'recentPerformance',
        'concerns',
      ],
      maxTokens: 300,
      temperature: 0.7,
    },
    motivationalMessage: {
      id: 'motivational_message',
      name: 'Motivational Messaging',
      systemPrompt: `You are a motivational coach specializing in teen fitness. Your role is to provide encouraging, age-appropriate motivational messages that inspire and support young athletes.

Key principles:
- Use positive, empowering language
- Acknowledge their efforts and progress
- Be authentic and relatable
- Avoid clichés and generic phrases
- Match the intensity to their current state
- Focus on growth mindset and personal development
- Keep messages concise and impactful

Communication style: Inspiring, authentic, and supportive.`,
      userPromptTemplate: `Create a motivational message for this situation:

Context: {context}
User State: {userState}
Recent Progress: {recentProgress}
Current Challenge: {currentChallenge}
Message Type: {messageType}
Intensity: {intensity}

Please provide an encouraging, personalized message that will motivate and support them.`,
      contextVariables: [
        'context',
        'userState',
        'recentProgress',
        'currentChallenge',
        'messageType',
        'intensity',
      ],
      maxTokens: 150,
      temperature: 0.8,
    },
    techniqueGuidance: {
      id: 'technique_guidance',
      name: 'Technique Improvement Guidance',
      systemPrompt: `You are a movement specialist and personal trainer with expertise in exercise technique and biomechanics. Your role is to provide detailed, practical guidance for improving exercise technique.

Key principles:
- Focus on movement quality over quantity
- Provide step-by-step instructions
- Explain the biomechanics behind proper form
- Address common mistakes and how to avoid them
- Suggest progressions and regressions
- Emphasize safety and injury prevention
- Use clear, descriptive language

Communication style: Educational, detailed, and practical.`,
      userPromptTemplate: `Provide technique guidance for improving this exercise:

Exercise: {exerciseName}
Current Level: {currentLevel}
Specific Issues: {specificIssues}
Equipment Available: {equipment}
Goals: {goals}

Please provide:
1. Key technique points
2. Common mistakes to avoid
3. Step-by-step improvement process
4. Progressions and regressions
5. Safety considerations`,
      contextVariables: [
        'exerciseName',
        'currentLevel',
        'specificIssues',
        'equipment',
        'goals',
      ],
      maxTokens: 400,
      temperature: 0.6,
    },
    workoutDescription: {
      id: 'workout_description',
      name: 'Personalized Workout Descriptions',
      systemPrompt: `You are a creative fitness writer who specializes in creating engaging, personalized workout descriptions for teenagers. Your role is to make workouts exciting, clear, and motivating.

Key principles:
- Use energetic, engaging language
- Make instructions clear and easy to follow
- Include motivational elements
- Personalize based on user preferences
- Focus on the benefits and purpose
- Use age-appropriate terminology
- Create excitement and anticipation

Communication style: Energetic, clear, and motivating.`,
      userPromptTemplate: `Create a personalized workout description for this session:

Session Type: {sessionType}
Duration: {duration}
Intensity: {intensity}
Focus Areas: {focusAreas}
User Preferences: {userPreferences}
Equipment: {equipment}
Phase: {phase}

Please create an engaging description that explains what they'll be doing and why it's beneficial.`,
      contextVariables: [
        'sessionType',
        'duration',
        'intensity',
        'focusAreas',
        'userPreferences',
        'equipment',
        'phase',
      ],
      maxTokens: 250,
      temperature: 0.8,
    },
    progressCelebration: {
      id: 'progress_celebration',
      name: 'Progress Celebration Messages',
      systemPrompt: `You are a celebration specialist who helps young athletes recognize and appreciate their progress. Your role is to create meaningful, personalized celebration messages that reinforce positive behaviors and achievements.

Key principles:
- Acknowledge specific achievements
- Connect progress to their goals
- Reinforce positive behaviors
- Create excitement for future progress
- Be genuine and specific
- Focus on effort and improvement
- Make them feel proud of their work

Communication style: Celebratory, genuine, and encouraging.`,
      userPromptTemplate: `Create a celebration message for this achievement:

Achievement: {achievement}
Progress Made: {progressMade}
Time Period: {timePeriod}
Goals: {goals}
Challenges Overcome: {challengesOvercome}

Please create a personalized celebration message that acknowledges their specific progress and encourages continued effort.`,
      contextVariables: [
        'achievement',
        'progressMade',
        'timePeriod',
        'goals',
        'challengesOvercome',
      ],
      maxTokens: 200,
      temperature: 0.9,
    },
  };

  // Generate context-aware prompt
  static generateContextAwarePrompt(
    templateId: string,
    context: ConversationContext,
    additionalData: Record<string, any> = {}
  ): string {
    const template = this.PROMPT_TEMPLATES[templateId];
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Build context data
    const contextData = {
      userId: context.userId,
      currentPhase: context.currentPhase,
      userLevel: this.assessUserLevel(context),
      recentPerformance: this.summarizeRecentPerformance(context),
      userPreferences: JSON.stringify(context.userPreferences),
      ...additionalData,
    };

    // Replace template variables
    let userPrompt = template.userPromptTemplate;
    for (const [key, value] of Object.entries(contextData)) {
      userPrompt = userPrompt.replace(
        new RegExp(`{${key}}`, 'g'),
        String(value)
      );
    }

    return userPrompt;
  }

  // Generate conversation with memory
  static async generateConversation(
    userMessage: string,
    context: ConversationContext,
    templateId: string = 'formFeedback'
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.PROMPT_TEMPLATES[templateId].systemPrompt;
      const userPrompt = this.generateContextAwarePrompt(templateId, context, {
        userMessage,
      });

      // Build conversation history
      const messages: ConversationMessage[] = [
        {
          role: 'system',
          content: systemPrompt,
          timestamp: new Date().toISOString(),
        },
        ...context.conversationHistory.slice(-this.MAX_CONVERSATION_HISTORY),
        {
          role: 'user',
          content: userPrompt,
          timestamp: new Date().toISOString(),
        },
      ];

      // Call OpenAI API (mock implementation for now)
      const response = await this.callOpenAIAPI(messages);

      return {
        content: response.content,
        confidence: response.confidence || 0.8,
        suggestions: response.suggestions || [],
        followUpQuestions: response.followUpQuestions || [],
        context: {
          phase: context.currentPhase,
          focus: context.userPreferences.focusAreas,
          intensity: this.determineResponseIntensity(context),
        },
      };
    } catch (error) {
      console.error('Error generating conversation:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  // Generate form feedback
  static async generateFormFeedback(
    exercise: string,
    context: ConversationContext,
    concerns: string[] = []
  ): Promise<FormFeedback> {
    const response = await this.generateConversation(
      `Please provide form feedback for ${exercise}. Concerns: ${concerns.join(', ')}`,
      context,
      'formFeedback'
    );

    return {
      exercise,
      feedback: response.content,
      corrections: this.extractCorrections(response.content),
      improvements: this.extractImprovements(response.content),
      safetyNotes: this.extractSafetyNotes(response.content),
      nextSteps: this.extractNextSteps(response.content),
    };
  }

  // Generate motivational message
  static async generateMotivationalMessage(
    context: ConversationContext,
    messageType: 'achievement' | 'encouragement' | 'reminder' | 'celebration',
    intensity: 'gentle' | 'moderate' | 'strong' = 'moderate'
  ): Promise<MotivationalMessage> {
    const response = await this.generateConversation(
      `Generate a ${messageType} message with ${intensity} intensity`,
      context,
      'motivationalMessage'
    );

    return {
      type: messageType,
      message: response.content,
      intensity,
      timing: this.determineOptimalTiming(context),
    };
  }

  // Generate technique guidance
  static async generateTechniqueGuidance(
    exercise: string,
    context: ConversationContext,
    specificIssues: string[] = []
  ): Promise<string> {
    const response = await this.generateConversation(
      `Provide technique guidance for ${exercise}. Issues: ${specificIssues.join(', ')}`,
      context,
      'techniqueGuidance'
    );

    return response.content;
  }

  // Generate personalized workout description
  static async generateWorkoutDescription(
    sessionData: {
      type: string;
      duration: number;
      intensity: string;
      focusAreas: string[];
      equipment: string[];
    },
    context: ConversationContext
  ): Promise<string> {
    const response = await this.generateConversation(
      `Generate a workout description for ${sessionData.type} session`,
      context,
      'workoutDescription'
    );

    return response.content;
  }

  // Generate progress celebration
  static async generateProgressCelebration(
    achievement: string,
    context: ConversationContext,

    progressData: any
  ): Promise<string> {
    const response = await this.generateConversation(
      `Celebrate this achievement: ${achievement}`,
      context,
      'progressCelebration'
    );

    return response.content;
  }

  // Multi-modal input processing
  static async processMultiModalInput(
    textInput: string,

    imageData?: string,

    audioData?: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    // This would handle multi-modal inputs in a real implementation
    // For now, we'll focus on text processing
    return this.generateConversation(textInput, context);
  }

  // Response quality validation
  static validateResponseQuality(response: AIResponse): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check content length
    if (response.content.length < 10) {
      issues.push('Response too short');
      suggestions.push('Generate more detailed response');
    }

    if (response.content.length > 1000) {
      issues.push('Response too long');
      suggestions.push('Make response more concise');
    }

    // Check confidence level
    if (response.confidence < 0.5) {
      issues.push('Low confidence response');
      suggestions.push('Request clarification or provide more context');
    }

    // Check for appropriate language
    if (this.containsInappropriateLanguage(response.content)) {
      issues.push('Inappropriate language detected');
      suggestions.push('Filter and regenerate response');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
    };
  }

  // Helper methods
  private static async callOpenAIAPI(
    messages: ConversationMessage[]
  ): Promise<any> {
    // Mock implementation - in a real app, this would call the actual OpenAI API
    const mockResponse = {
      content:
        'This is a mock response from OpenAI. In a real implementation, this would be replaced with actual API calls to GPT-4.',
      confidence: 0.85,
      suggestions: [
        'Consider adding more specific feedback',
        'Include safety reminders',
      ],
      followUpQuestions: [
        'How did that feel?',
        'Any discomfort during the exercise?',
      ],
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return mockResponse;
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

  private static summarizeRecentPerformance(
    context: ConversationContext
  ): string {
    if (!context.performanceForecast) return 'No recent performance data';

    const strength = context.performanceForecast.strength;
    const fatigue = context.performanceForecast.fatigue;

    return `Strength: ${strength.trend} (${strength.rate}%/week), Fatigue: ${fatigue.currentFatigue}/10`;
  }

  private static determineResponseIntensity(
    context: ConversationContext
  ): 'low' | 'moderate' | 'high' {
    if (!context.performanceForecast) return 'moderate';

    const fatigue = context.performanceForecast.fatigue.currentFatigue;
    if (fatigue > 7) return 'low';
    if (fatigue < 4) return 'high';
    return 'moderate';
  }

  private static determineOptimalTiming(
    context: ConversationContext
  ): 'pre-workout' | 'during-workout' | 'post-workout' | 'anytime' {
    // This would be determined by context analysis
    return 'anytime';
  }

  private static extractCorrections(content: string): string[] {
    // Simple extraction - in a real implementation, this would use NLP
    const corrections: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (
        line.toLowerCase().includes('correction') ||
        line.toLowerCase().includes('fix')
      ) {
        corrections.push(line.trim());
      }
    }

    return corrections;
  }

  private static extractImprovements(content: string): string[] {
    const improvements: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (
        line.toLowerCase().includes('improve') ||
        line.toLowerCase().includes('better')
      ) {
        improvements.push(line.trim());
      }
    }

    return improvements;
  }

  private static extractSafetyNotes(content: string): string[] {
    const safetyNotes: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (
        line.toLowerCase().includes('safety') ||
        line.toLowerCase().includes('injury') ||
        line.toLowerCase().includes('careful')
      ) {
        safetyNotes.push(line.trim());
      }
    }

    return safetyNotes;
  }

  private static extractNextSteps(content: string): string[] {
    const nextSteps: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (
        line.toLowerCase().includes('next') ||
        line.toLowerCase().includes('step') ||
        line.toLowerCase().includes('practice')
      ) {
        nextSteps.push(line.trim());
      }
    }

    return nextSteps;
  }

  private static containsInappropriateLanguage(content: string): boolean {
    // Simple check - in a real implementation, this would use a content moderation API
    const inappropriateWords = ['bad', 'terrible', 'awful']; // Simplified list
    const lowerContent = content.toLowerCase();

    return inappropriateWords.some(word => lowerContent.includes(word));
  }
}
