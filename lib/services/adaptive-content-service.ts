'use client';

// eslint-disable-next-line no-unused-vars
import { SessionData, CheckInData } from '@/lib/services/database-service';
// eslint-disable-next-line no-unused-vars
import { BehaviorInsights } from './behavior-analysis-service';
// eslint-disable-next-line no-unused-vars
import { PerformanceForecast } from './performance-prediction-service';
import { OpenAIService, ConversationContext } from './openai-service';

export interface PersonalizedWorkoutDescription {
  title: string;
  overview: string;
  instructions: string[];
  tips: string[];
  motivation: string;
  safetyNotes: string[];
  equipment: string[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DynamicInstruction {
  exerciseId: string;
  exerciseName: string;
  instruction: string;
  variations: string[];
  progressions: string[];
  regressions: string[];
  cues: string[];
  commonMistakes: string[];
  safetyTips: string[];
}

export interface ContextualTip {
  id: string;
  category: 'form' | 'motivation' | 'safety' | 'recovery' | 'nutrition';
  title: string;
  content: string;
  relevance: number; // 0-1
  timing: 'pre-workout' | 'during-workout' | 'post-workout' | 'anytime';
  priority: 'low' | 'medium' | 'high';
}

export interface ProgressCelebrationMessage {
  type: 'milestone' | 'achievement' | 'improvement' | 'consistency';
  title: string;
  message: string;
  visual: {
    emoji: string;
    color: string;
    animation?: string;
  };
  shareable: boolean;
  personalization: {
    userName?: string;
    specificAchievement?: string;
    nextGoal?: string;
  };
}

export interface AdaptiveContent {
  workoutDescriptions: PersonalizedWorkoutDescription[];
  dynamicInstructions: DynamicInstruction[];
  contextualTips: ContextualTip[];
  progressCelebrations: ProgressCelebrationMessage[];
  personalizedContent: {
    motivationalQuotes: string[];
    techniqueReminders: string[];
    goalReminders: string[];
    recoveryTips: string[];
  };
}

export class AdaptiveContentService {
  // Generate personalized workout descriptions
  static async generatePersonalizedWorkoutDescription(
    sessionData: {
      type: 'strength' | 'volleyball' | 'conditioning';
      duration: number;
      intensity: 'low' | 'moderate' | 'high';
      exercises: Array<{
        name: string;
        sets: number;
        reps: number;
        weight?: number;
      }>;
      equipment: string[];
    },
    context: ConversationContext
  ): Promise<PersonalizedWorkoutDescription> {
    try {
      const description = await OpenAIService.generateWorkoutDescription(
        {
          type: sessionData.type,
          duration: sessionData.duration,
          intensity: sessionData.intensity,
          focusAreas: this.extractFocusAreas(sessionData),
          equipment: sessionData.equipment,
        },
        context
      );

      return {
        title: this.generateWorkoutTitle(sessionData, context),
        overview: description,
        instructions: this.generateInstructions(sessionData, context),
        tips: this.generateWorkoutTips(sessionData, context),
        motivation: this.generateMotivation(sessionData, context),
        safetyNotes: this.generateSafetyNotes(sessionData, context),
        equipment: sessionData.equipment,
        duration: sessionData.duration,
        difficulty: this.assessDifficulty(sessionData, context),
      };
    } catch (error) {
      console.error('Error generating workout description:', error);
      throw new Error('Failed to generate workout description');
    }
  }

  // Generate dynamic instructions for exercises
  static async generateDynamicInstructions(
    exercises: Array<{
      id: string;
      name: string;
      type: string;
      difficulty: string;
    }>,
    context: ConversationContext
  ): Promise<DynamicInstruction[]> {
    const instructions: DynamicInstruction[] = [];

    for (const exercise of exercises) {
      try {
        const techniqueGuidance = await OpenAIService.generateTechniqueGuidance(
          exercise.name,
          context,
          []
        );

        const instruction: DynamicInstruction = {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          instruction: techniqueGuidance,
          variations: this.generateVariations(exercise, context),
          progressions: this.generateProgressions(exercise, context),
          regressions: this.generateRegressions(exercise, context),
          cues: this.generateCues(exercise, context),
          commonMistakes: this.generateCommonMistakes(exercise, context),
          safetyTips: this.generateSafetyTips(exercise, context),
        };

        instructions.push(instruction);
      } catch (error) {
        console.error(`Error generating instruction for ${exercise.name}:`, error);
        // Add fallback instruction
        instructions.push(this.generateFallbackInstruction(exercise));
      }
    }

    return instructions;
  }

  // Generate contextual tips
  static generateContextualTips(
    context: ConversationContext,
    currentPhase: string,
    sessionType: string
  ): ContextualTip[] {
    const tips: ContextualTip[] = [];

    // Form tips
    tips.push(...this.generateFormTips(context, currentPhase));

    // Motivation tips
    tips.push(...this.generateMotivationTips(context, sessionType));

    // Safety tips
    tips.push(...this.generateSafetyTips(context, currentPhase));

    // Recovery tips
    tips.push(...this.generateRecoveryTips(context));

    // Nutrition tips
    tips.push(...this.generateNutritionTips(context));

    // Sort by relevance and priority
    return tips
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10); // Limit to top 10 tips
  }

  // Generate progress celebration messages
  static async generateProgressCelebration(
    achievement: {
      type: 'milestone' | 'achievement' | 'improvement' | 'consistency';
      description: string;
      value?: number;
      unit?: string;
    },
    context: ConversationContext
  ): Promise<ProgressCelebrationMessage> {
    try {
      const celebrationMessage = await OpenAIService.generateProgressCelebration(
        achievement.description,
        context,
        achievement
      );

      return {
        type: achievement.type,
        title: this.generateCelebrationTitle(achievement),
        message: celebrationMessage,
        visual: this.generateCelebrationVisual(achievement),
        shareable: this.shouldBeShareable(achievement, context),
        personalization: {
          userName: context.userId,
          specificAchievement: achievement.description,
          nextGoal: this.suggestNextGoal(context),
        },
      };
    } catch (error) {
      console.error('Error generating progress celebration:', error);
      return this.generateFallbackCelebration(achievement);
    }
  }

  // Generate comprehensive adaptive content
  static async generateAdaptiveContent(
    sessionData: any,
    context: ConversationContext,
    currentPhase: string
  ): Promise<AdaptiveContent> {
    try {
      const workoutDescriptions = await Promise.all([
        this.generatePersonalizedWorkoutDescription(sessionData, context),
      ]);

      const dynamicInstructions = await this.generateDynamicInstructions(
        sessionData.exercises || [],
        context
      );

      const contextualTips = this.generateContextualTips(
        context,
        currentPhase,
        sessionData.type
      );

      const progressCelebrations = await this.generateProgressCelebrations(
        context,
        sessionData
      );

      const personalizedContent = this.generatePersonalizedContent(context);

      return {
        workoutDescriptions,
        dynamicInstructions,
        contextualTips,
        progressCelebrations,
        personalizedContent,
      };
    } catch (error) {
      console.error('Error generating adaptive content:', error);
      throw new Error('Failed to generate adaptive content');
    }
  }

  // Helper methods
  private static extractFocusAreas(sessionData: any): string[] {
    const focusAreas: string[] = [];
    
    if (sessionData.type === 'strength') {
      focusAreas.push('strength building', 'muscle development');
    } else if (sessionData.type === 'volleyball') {
      focusAreas.push('sport-specific skills', 'agility', 'coordination');
    } else if (sessionData.type === 'conditioning') {
      focusAreas.push('cardiovascular fitness', 'endurance');
    }
    
    return focusAreas;
  }

  private static generateWorkoutTitle(sessionData: any, context: ConversationContext): string {
    const intensity = sessionData.intensity;
    const type = sessionData.type;
    const duration = sessionData.duration;
    
    const intensityAdjectives = {
      low: 'Gentle',
      moderate: 'Balanced',
      high: 'Intense',
    };
    
    const typeNames = {
      strength: 'Strength Training',
      volleyball: 'Volleyball Skills',
      conditioning: 'Conditioning',
    };
    
    return `${intensityAdjectives[intensity]} ${typeNames[type]} (${duration} min)`;
  }

  private static generateInstructions(sessionData: any, context: ConversationContext): string[] {
    const instructions: string[] = [];
    
    instructions.push(`Complete ${sessionData.exercises.length} exercises`);
    instructions.push(`Rest 60-90 seconds between sets`);
    instructions.push(`Focus on proper form throughout`);
    
    if (sessionData.intensity === 'high') {
      instructions.push('Push yourself but maintain good form');
    } else if (sessionData.intensity === 'low') {
      instructions.push('Focus on movement quality over intensity');
    }
    
    return instructions;
  }

  private static generateWorkoutTips(sessionData: any, context: ConversationContext): string[] {
    const tips: string[] = [];
    
    tips.push('Warm up properly before starting');
    tips.push('Stay hydrated throughout the workout');
    tips.push('Listen to your body and adjust as needed');
    
    if (sessionData.type === 'strength') {
      tips.push('Focus on controlled movements');
      tips.push('Breathe properly during each rep');
    } else if (sessionData.type === 'volleyball') {
      tips.push('Practice sport-specific movements');
      tips.push('Focus on coordination and timing');
    }
    
    return tips;
  }

  private static generateMotivation(sessionData: any, context: ConversationContext): string {
    const motivationalMessages = [
      "You've got this! Every rep counts towards your goals.",
      "Push through the challenge - you're stronger than you think.",
      "Focus on progress, not perfection. You're doing great!",
      "This workout will make you stronger and more confident.",
    ];
    
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  }

  private static generateSafetyNotes(sessionData: any, context: ConversationContext): string[] {
    const safetyNotes: string[] = [];
    
    safetyNotes.push('Stop if you feel any pain or discomfort');
    safetyNotes.push('Use proper form to prevent injury');
    safetyNotes.push('Start with lighter weights if needed');
    
    if (sessionData.intensity === 'high') {
      safetyNotes.push('Be extra careful with form at high intensity');
    }
    
    return safetyNotes;
  }

  private static assessDifficulty(sessionData: any, context: ConversationContext): 'beginner' | 'intermediate' | 'advanced' {
    if (!context.behaviorInsights) return 'beginner';
    
    const userLevel = this.assessUserLevel(context);
    const intensity = sessionData.intensity;
    
    if (userLevel === 'beginner' || intensity === 'low') return 'beginner';
    if (userLevel === 'advanced' && intensity === 'high') return 'advanced';
    return 'intermediate';
  }

  private static assessUserLevel(context: ConversationContext): string {
    if (!context.behaviorInsights) return 'beginner';
    
    const consistency = context.behaviorInsights.patterns.consistency.weeklyFrequency;
    const experience = context.behaviorInsights.habits.workoutHabit.strength;
    
    if (consistency >= 4 && experience >= 0.8) return 'advanced';
    if (consistency >= 3 && experience >= 0.6) return 'intermediate';
    return 'beginner';
  }

  private static generateVariations(exercise: any, context: ConversationContext): string[] {
    const variations: string[] = [];
    
    if (exercise.name.toLowerCase().includes('squat')) {
      variations.push('Goblet Squat', 'Jump Squat', 'Single-leg Squat');
    } else if (exercise.name.toLowerCase().includes('push')) {
      variations.push('Incline Push-up', 'Decline Push-up', 'Diamond Push-up');
    } else if (exercise.name.toLowerCase().includes('plank')) {
      variations.push('Side Plank', 'Plank Up-downs', 'Plank Jacks');
    }
    
    return variations;
  }

  private static generateProgressions(exercise: any, context: ConversationContext): string[] {
    const progressions: string[] = [];
    
    if (exercise.difficulty === 'beginner') {
      progressions.push('Increase reps', 'Add weight', 'Try advanced variation');
    } else if (exercise.difficulty === 'intermediate') {
      progressions.push('Increase weight', 'Add complexity', 'Reduce rest time');
    }
    
    return progressions;
  }

  private static generateRegressions(exercise: any, context: ConversationContext): string[] {
    const regressions: string[] = [];
    
    if (exercise.difficulty === 'advanced') {
      regressions.push('Reduce weight', 'Simplify movement', 'Increase rest time');
    } else if (exercise.difficulty === 'intermediate') {
      regressions.push('Use lighter weight', 'Focus on form', 'Take more rest');
    }
    
    return regressions;
  }

  private static generateCues(exercise: any, context: ConversationContext): string[] {
    const cues: string[] = [];
    
    if (exercise.name.toLowerCase().includes('squat')) {
      cues.push('Chest up', 'Knees out', 'Weight on heels');
    } else if (exercise.name.toLowerCase().includes('push')) {
      cues.push('Straight body', 'Full range of motion', 'Engage core');
    } else if (exercise.name.toLowerCase().includes('plank')) {
      cues.push('Straight line', 'Engage core', 'Breathe normally');
    }
    
    return cues;
  }

  private static generateCommonMistakes(exercise: any, context: ConversationContext): string[] {
    const mistakes: string[] = [];
    
    if (exercise.name.toLowerCase().includes('squat')) {
      mistakes.push('Knees caving in', 'Heels lifting', 'Leaning too far forward');
    } else if (exercise.name.toLowerCase().includes('push')) {
      mistakes.push('Sagging hips', 'Incomplete range of motion', 'Flaring elbows');
    }
    
    return mistakes;
  }

  private static generateExerciseSafetyTips(exercise: any, context: ConversationContext): string[] {
    const safetyTips: string[] = [];
    
    safetyTips.push('Stop if you feel pain');
    safetyTips.push('Maintain proper form');
    safetyTips.push('Start with lighter weight');
    
    if (exercise.name.toLowerCase().includes('squat')) {
      safetyTips.push('Keep knees tracking over toes');
    } else if (exercise.name.toLowerCase().includes('push')) {
      safetyTips.push('Keep core engaged throughout');
    }
    
    return safetyTips;
  }

  private static generateFallbackInstruction(exercise: any): DynamicInstruction {
    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      instruction: `Perform ${exercise.name} with proper form`,
      variations: [],
      progressions: [],
      regressions: [],
      cues: ['Focus on form', 'Breathe properly'],
      commonMistakes: ['Poor form', 'Rushing the movement'],
      safetyTips: ['Stop if you feel pain', 'Maintain proper form'],
    };
  }

  private static generateFormTips(context: ConversationContext, currentPhase: string): ContextualTip[] {
    return [
      {
        id: 'form_tip_1',
        category: 'form',
        title: 'Focus on Form',
        content: 'Quality over quantity - proper form prevents injury and maximizes results',
        relevance: 0.9,
        timing: 'during-workout',
        priority: 'high',
      },
      {
        id: 'form_tip_2',
        category: 'form',
        title: 'Controlled Movements',
        content: 'Slow and controlled movements are more effective than fast, sloppy ones',
        relevance: 0.8,
        timing: 'during-workout',
        priority: 'medium',
      },
    ];
  }

  private static generateMotivationTips(context: ConversationContext, sessionType: string): ContextualTip[] {
    return [
      {
        id: 'motivation_tip_1',
        category: 'motivation',
        title: 'You\'ve Got This!',
        content: 'Every workout brings you closer to your goals',
        relevance: 0.7,
        timing: 'pre-workout',
        priority: 'medium',
      },
      {
        id: 'motivation_tip_2',
        category: 'motivation',
        title: 'Progress Over Perfection',
        content: 'Focus on getting better each day, not being perfect',
        relevance: 0.8,
        timing: 'anytime',
        priority: 'high',
      },
    ];
  }

  private static generateSafetyTips(context: ConversationContext, currentPhase: string): ContextualTip[] {
    return [
      {
        id: 'safety_tip_1',
        category: 'safety',
        title: 'Listen to Your Body',
        content: 'Stop if you feel pain or excessive discomfort',
        relevance: 0.9,
        timing: 'during-workout',
        priority: 'high',
      },
      {
        id: 'safety_tip_2',
        category: 'safety',
        title: 'Warm Up Properly',
        content: 'Always warm up before intense exercise to prevent injury',
        relevance: 0.8,
        timing: 'pre-workout',
        priority: 'high',
      },
    ];
  }

  private static generateRecoveryTips(context: ConversationContext): ContextualTip[] {
    return [
      {
        id: 'recovery_tip_1',
        category: 'recovery',
        title: 'Rest and Recovery',
        content: 'Adequate rest is essential for muscle growth and injury prevention',
        relevance: 0.7,
        timing: 'post-workout',
        priority: 'medium',
      },
      {
        id: 'recovery_tip_2',
        category: 'recovery',
        title: 'Sleep Quality',
        content: 'Aim for 8-9 hours of quality sleep for optimal recovery',
        relevance: 0.8,
        timing: 'anytime',
        priority: 'high',
      },
    ];
  }

  private static generateNutritionTips(context: ConversationContext): ContextualTip[] {
    return [
      {
        id: 'nutrition_tip_1',
        category: 'nutrition',
        title: 'Stay Hydrated',
        content: 'Drink water before, during, and after your workout',
        relevance: 0.8,
        timing: 'anytime',
        priority: 'high',
      },
      {
        id: 'nutrition_tip_2',
        category: 'nutrition',
        title: 'Post-Workout Nutrition',
        content: 'Eat protein and carbs within 30 minutes after your workout',
        relevance: 0.7,
        timing: 'post-workout',
        priority: 'medium',
      },
    ];
  }

  private static async generateProgressCelebrations(
    context: ConversationContext,
    sessionData: any
  ): Promise<ProgressCelebrationMessage[]> {
    // Mock implementation - in a real app, this would generate based on actual achievements
    return [
      {
        type: 'milestone',
        title: 'Great Work!',
        message: 'You completed another workout session!',
        visual: {
          emoji: '🎉',
          color: 'green',
        },
        shareable: true,
        personalization: {
          userName: context.userId,
        },
      },
    ];
  }

  private static generatePersonalizedContent(context: ConversationContext): AdaptiveContent['personalizedContent'] {
    return {
      motivationalQuotes: [
        'Every expert was once a beginner',
        'The only bad workout is the one that didn\'t happen',
        'Progress, not perfection',
        'You are stronger than you think',
      ],
      techniqueReminders: [
        'Keep your core engaged',
        'Breathe properly during each rep',
        'Focus on the mind-muscle connection',
        'Control the weight, don\'t let it control you',
      ],
      goalReminders: [
        'Remember why you started',
        'Every workout brings you closer to your goals',
        'Consistency is key to success',
        'Small steps lead to big changes',
      ],
      recoveryTips: [
        'Get enough sleep for recovery',
        'Stay hydrated throughout the day',
        'Stretch after your workout',
        'Listen to your body and rest when needed',
      ],
    };
  }

  private static generateCelebrationTitle(achievement: any): string {
    const titles = {
      milestone: 'Milestone Achieved!',
      achievement: 'Amazing Achievement!',
      improvement: 'Great Improvement!',
      consistency: 'Consistency Champion!',
    };
    
    return titles[achievement.type] || 'Congratulations!';
  }

  private static generateCelebrationVisual(achievement: any): ProgressCelebrationMessage['visual'] {
    const visuals = {
      milestone: { emoji: '🏆', color: 'gold' },
      achievement: { emoji: '🎯', color: 'blue' },
      improvement: { emoji: '📈', color: 'green' },
      consistency: { emoji: '🔥', color: 'orange' },
    };
    
    return visuals[achievement.type] || { emoji: '🎉', color: 'purple' };
  }

  private static shouldBeShareable(achievement: any, context: ConversationContext): boolean {
    // Simple logic - in a real app, this would be more sophisticated
    return achievement.type === 'milestone' || achievement.type === 'achievement';
  }

  private static suggestNextGoal(context: ConversationContext): string {
    // Mock implementation - in a real app, this would be based on user goals and progress
    return 'Complete 5 workouts this week';
  }

  private static generateFallbackCelebration(achievement: any): ProgressCelebrationMessage {
    return {
      type: achievement.type,
      title: 'Congratulations!',
      message: `Great job on ${achievement.description}!`,
      visual: {
        emoji: '🎉',
        color: 'purple',
      },
      shareable: false,
      personalization: {
        userName: 'athlete',
        specificAchievement: achievement.description,
      },
    };
  }
}
