'use client';

import { SessionData } from '@/lib/services/database-service';
import { BehaviorInsights } from './behavior-analysis-service';
import { PerformanceForecast } from './performance-prediction-service';

export interface ExerciseRecommendation {
  name: string;
  type: 'strength' | 'volleyball' | 'conditioning';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscles: string[];
  equipment: string[];
  estimatedDuration: number; // minutes
  rpeRange: [number, number]; // [min, max]
  progression: {
    reps: number;
    sets: number;
    weight?: number;
    restTime: number; // seconds
  };
  alternatives: string[];
  notes: string[];
}

export interface SessionRecommendation {
  type: 'strength' | 'volleyball' | 'conditioning' | 'rest';
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  exercises: ExerciseRecommendation[];
  warmUp: string[];
  coolDown: string[];
  focus: string[];
  warnings: string[];
  expectedRPE: number;
}

export interface PersonalizedAdjustments {
  repAdjustments: {
    exercise: string;
    currentReps: number;
    recommendedReps: number;
    reason: string;
  }[];
  weightAdjustments: {
    exercise: string;
    currentWeight: number;
    recommendedWeight: number;
    reason: string;
  }[];
  restTimeAdjustments: {
    exercise: string;
    currentRest: number;
    recommendedRest: number;
    reason: string;
  }[];
  sessionModifications: {
    type: 'add' | 'remove' | 'modify';
    exercise: string;
    reason: string;
  }[];
}

export interface RestTimeOptimization {
  exercise: string;
  currentRestTime: number; // seconds
  recommendedRestTime: number; // seconds
  reason: string;
  factors: {
    intensity: number;
    muscleGroup: string;
    recovery: number;
    experience: number;
  };
}

export interface SessionIntensityModulation {
  currentIntensity: number; // 1-10
  recommendedIntensity: number; // 1-10
  modulation: 'increase' | 'decrease' | 'maintain';
  reason: string;
  factors: {
    fatigue: number;
    recovery: number;
    progress: number;
    phase: string;
  };
}

export interface AdaptiveRecommendations {
  exerciseRecommendations: ExerciseRecommendation[];
  sessionRecommendation: SessionRecommendation;
  personalizedAdjustments: PersonalizedAdjustments;
  restTimeOptimization: RestTimeOptimization[];
  intensityModulation: SessionIntensityModulation;
  nextSessionFocus: string[];
  longTermGoals: string[];
}

export class AdaptiveRecommendationService {
  // Generate personalized exercise recommendations
  static generateExerciseRecommendations(
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast,
    currentPhase: string,
    availableEquipment: string[] = []
  ): ExerciseRecommendation[] {
    const recommendations: ExerciseRecommendation[] = [];
    
    // Analyze user preferences and patterns
    const preferences = this.analyzeUserPreferences(behaviorInsights);
    const currentLevel = this.assessCurrentLevel(behaviorInsights, performanceForecast);
    // eslint-disable-next-line no-unused-vars
    const focusAreas = this.identifyFocusAreas(behaviorInsights, performanceForecast);
    
    // Generate recommendations based on phase and preferences
    if (currentPhase === 'foundation') {
      recommendations.push(...this.generateFoundationExercises(preferences, currentLevel, availableEquipment));
    } else if (currentPhase === 'build') {
      recommendations.push(...this.generateBuildExercises(preferences, currentLevel, availableEquipment));
    } else if (currentPhase === 'peak') {
      recommendations.push(...this.generatePeakExercises(preferences, currentLevel, availableEquipment));
    } else if (currentPhase === 'deload') {
      recommendations.push(...this.generateDeloadExercises(preferences, currentLevel, availableEquipment));
    }
    
    // Filter by available equipment
    const filteredRecommendations = recommendations.filter(rec => 
      rec.equipment.every(eq => availableEquipment.includes(eq) || eq === 'bodyweight')
    );
    
    // Sort by relevance and difficulty
    return this.sortRecommendations(filteredRecommendations, preferences, currentLevel);
  }

  // Generate complete session recommendation
  static generateSessionRecommendation(
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast,
    currentPhase: string,
    availableEquipment: string[] = []
  ): SessionRecommendation {
    const exerciseRecommendations = this.generateExerciseRecommendations(
      behaviorInsights,
      performanceForecast,
      currentPhase,
      availableEquipment
    );
    
    // Determine session type based on phase and fatigue
    const sessionType = this.determineSessionType(performanceForecast, currentPhase);
    
    // Calculate optimal duration
    const duration = this.calculateOptimalDuration(behaviorInsights, performanceForecast, currentPhase);
    
    // Determine intensity level
    const intensity = this.determineIntensityLevel(performanceForecast, currentPhase);
    
    // Select exercises for the session
    const selectedExercises = this.selectExercisesForSession(
      exerciseRecommendations,
      duration,
      intensity,
      behaviorInsights.patterns.exercisePreferences
    );
    
    // Generate warm-up and cool-down
    const warmUp = this.generateWarmUp(sessionType, intensity);
    const coolDown = this.generateCoolDown(sessionType, intensity);
    
    // Identify focus areas
    const focus = this.identifySessionFocus(behaviorInsights, performanceForecast, currentPhase);
    
    // Generate warnings
    const warnings = this.generateWarnings(performanceForecast, behaviorInsights);
    
    // Calculate expected RPE
    const expectedRPE = this.calculateExpectedRPE(selectedExercises, intensity);
    
    return {
      type: sessionType,
      duration,
      intensity,
      exercises: selectedExercises,
      warmUp,
      coolDown,
      focus,
      warnings,
      expectedRPE,
    };
  }

  // Generate personalized adjustments for current session
  static generatePersonalizedAdjustments(
    currentSession: SessionData,
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast
  ): PersonalizedAdjustments {
    const repAdjustments = this.calculateRepAdjustments(currentSession, behaviorInsights, performanceForecast);
    const weightAdjustments = this.calculateWeightAdjustments(currentSession, behaviorInsights, performanceForecast);
    const restTimeAdjustments = this.calculateRestTimeAdjustments(currentSession, behaviorInsights, performanceForecast);
    const sessionModifications = this.calculateSessionModifications(currentSession, behaviorInsights, performanceForecast);
    
    return {
      repAdjustments,
      weightAdjustments,
      restTimeAdjustments,
      sessionModifications,
    };
  }

  // Optimize rest times between exercises
  static optimizeRestTimes(
    exercises: ExerciseRecommendation[],
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast
  ): RestTimeOptimization[] {
    return exercises.map(exercise => {
      const currentRestTime = exercise.progression.restTime;
      const recommendedRestTime = this.calculateOptimalRestTime(exercise, behaviorInsights, performanceForecast);
      
      return {
        exercise: exercise.name,
        currentRestTime,
        recommendedRestTime,
        reason: this.getRestTimeReason(exercise, recommendedRestTime, currentRestTime),
        factors: {
          intensity: this.calculateExerciseIntensity(exercise),
          muscleGroup: exercise.targetMuscles[0] || 'general',
          recovery: performanceForecast.fatigue.currentFatigue / 10,
          experience: this.assessExperienceLevel(behaviorInsights),
        },
      };
    });
  }

  // Modulate session intensity based on current state
  static modulateSessionIntensity(
    currentIntensity: number,
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast,
    currentPhase: string
  ): SessionIntensityModulation {
    const recommendedIntensity = this.calculateRecommendedIntensity(
      currentIntensity,
      behaviorInsights,
      performanceForecast,
      currentPhase
    );
    
    let modulation: 'increase' | 'decrease' | 'maintain' = 'maintain';
    if (recommendedIntensity > currentIntensity + 0.5) modulation = 'increase';
    else if (recommendedIntensity < currentIntensity - 0.5) modulation = 'decrease';
    
    return {
      currentIntensity,
      recommendedIntensity: Math.round(recommendedIntensity * 10) / 10,
      modulation,
      reason: this.getIntensityModulationReason(recommendedIntensity, currentIntensity, performanceForecast),
      factors: {
        fatigue: performanceForecast.fatigue.currentFatigue / 10,
        recovery: performanceForecast.fatigue.timeToRecovery / 7, // Normalize to 0-1
        progress: performanceForecast.strength.confidence,
        phase: currentPhase,
      },
    };
  }

  // Generate comprehensive adaptive recommendations
  static generateAdaptiveRecommendations(
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast,
    currentPhase: string,
    availableEquipment: string[] = []
  ): AdaptiveRecommendations {
    const exerciseRecommendations = this.generateExerciseRecommendations(
      behaviorInsights,
      performanceForecast,
      currentPhase,
      availableEquipment
    );
    
    const sessionRecommendation = this.generateSessionRecommendation(
      behaviorInsights,
      performanceForecast,
      currentPhase,
      availableEquipment
    );
    
    const personalizedAdjustments = this.generatePersonalizedAdjustments(
      sessionRecommendation as any, // Type conversion for compatibility
      behaviorInsights,
      performanceForecast
    );
    
    const restTimeOptimization = this.optimizeRestTimes(
      exerciseRecommendations,
      behaviorInsights,
      performanceForecast
    );
    
    const intensityModulation = this.modulateSessionIntensity(
      sessionRecommendation.expectedRPE,
      behaviorInsights,
      performanceForecast,
      currentPhase
    );
    
    const nextSessionFocus = this.identifyNextSessionFocus(behaviorInsights, performanceForecast, currentPhase);
    const longTermGoals = this.generateLongTermGoals(behaviorInsights, performanceForecast);
    
    return {
      exerciseRecommendations,
      sessionRecommendation,
      personalizedAdjustments,
      restTimeOptimization,
      intensityModulation,
      nextSessionFocus,
      longTermGoals,
    };
  }

  // Helper methods
  private static analyzeUserPreferences(behaviorInsights: BehaviorInsights): {
    preferredTypes: string[];
    preferredIntensity: number;
    preferredDuration: number;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  } {
    const patterns = behaviorInsights.patterns;
    
    // Determine preferred exercise types
    const preferredTypes = Object.entries(patterns.exercisePreferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([type]) => type);
    
    // Determine preferred intensity
    const preferredIntensity = patterns.intensityPattern.averageRPE / 10;
    
    // Determine preferred duration
    const preferredDuration = patterns.sessionDuration.average;
    
    // Determine experience level
    let experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (patterns.consistency.weeklyFrequency >= 4 && patterns.consistency.streakLength >= 30) {
      experienceLevel = 'advanced';
    } else if (patterns.consistency.weeklyFrequency >= 3 && patterns.consistency.streakLength >= 14) {
      experienceLevel = 'intermediate';
    }
    
    return {
      preferredTypes,
      preferredIntensity: Math.round(preferredIntensity * 100) / 100,
      preferredDuration: Math.round(preferredDuration),
      experienceLevel,
    };
  }

  private static assessCurrentLevel(
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast
  ): 'beginner' | 'intermediate' | 'advanced' {
    const strengthLevel = performanceForecast.strength.currentLevel;
    const consistency = behaviorInsights.patterns.consistency.weeklyFrequency;
    const experience = behaviorInsights.habits.workoutHabit.strength;
    
    if (strengthLevel >= 70 && consistency >= 4 && experience >= 0.8) {
      return 'advanced';
    } else if (strengthLevel >= 40 && consistency >= 3 && experience >= 0.6) {
      return 'intermediate';
    }
    
    return 'beginner';
  }

  private static identifyFocusAreas(
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast
  ): string[] {
    const focusAreas: string[] = [];
    
    // Based on performance trends
    if (performanceForecast.strength.trend === 'plateau') {
      focusAreas.push('Progressive overload');
    }
    
    if (performanceForecast.fatigue.riskLevel === 'high') {
      focusAreas.push('Recovery');
    }
    
    if (performanceForecast.injuryRisk.overallRisk === 'medium' || performanceForecast.injuryRisk.overallRisk === 'high') {
      focusAreas.push('Injury prevention');
    }
    
    // Based on behavior patterns
    if (behaviorInsights.patterns.consistency.missedSessionRate > 20) {
      focusAreas.push('Consistency');
    }
    
    if (behaviorInsights.habits.recoveryHabit.sleepQuality < 0.6) {
      focusAreas.push('Sleep quality');
    }
    
    return focusAreas;
  }

  private static generateFoundationExercises(
    preferences: any,
    currentLevel: string,
    availableEquipment: string[]
  ): ExerciseRecommendation[] {
    const exercises: ExerciseRecommendation[] = [
      {
        name: 'Bodyweight Squats',
        type: 'strength',
        difficulty: 'beginner',
        targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
        equipment: ['bodyweight'],
        estimatedDuration: 10,
        rpeRange: [4, 6],
        progression: { reps: 15, sets: 3, restTime: 60 },
        alternatives: ['Goblet Squats', 'Wall Sits'],
        notes: ['Focus on proper form', 'Keep knees tracking over toes'],
      },
      {
        name: 'Push-ups',
        type: 'strength',
        difficulty: 'beginner',
        targetMuscles: ['chest', 'shoulders', 'triceps'],
        equipment: ['bodyweight'],
        estimatedDuration: 10,
        rpeRange: [4, 6],
        progression: { reps: 10, sets: 3, restTime: 60 },
        alternatives: ['Knee Push-ups', 'Incline Push-ups'],
        notes: ['Maintain straight body line', 'Full range of motion'],
      },
      {
        name: 'Plank',
        type: 'strength',
        difficulty: 'beginner',
        targetMuscles: ['core', 'shoulders'],
        equipment: ['bodyweight'],
        estimatedDuration: 5,
        rpeRange: [3, 5],
        progression: { reps: 1, sets: 3, restTime: 60 },
        alternatives: ['Side Plank', 'Dead Bug'],
        notes: ['Keep core engaged', 'Maintain neutral spine'],
      },
    ];
    
    return exercises.filter(ex => ex.equipment.every(eq => availableEquipment.includes(eq) || eq === 'bodyweight'));
  }

  private static generateBuildExercises(
    preferences: any,
    currentLevel: string,
    availableEquipment: string[]
  ): ExerciseRecommendation[] {
    const exercises: ExerciseRecommendation[] = [
      {
        name: 'Barbell Squats',
        type: 'strength',
        difficulty: 'intermediate',
        targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
        equipment: ['barbell', 'weights'],
        estimatedDuration: 15,
        rpeRange: [6, 8],
        progression: { reps: 8, sets: 4, weight: 50, restTime: 90 },
        alternatives: ['Front Squats', 'Bulgarian Split Squats'],
        notes: ['Progressive overload', 'Full depth'],
      },
      {
        name: 'Bench Press',
        type: 'strength',
        difficulty: 'intermediate',
        targetMuscles: ['chest', 'shoulders', 'triceps'],
        equipment: ['barbell', 'bench', 'weights'],
        estimatedDuration: 15,
        rpeRange: [6, 8],
        progression: { reps: 8, sets: 4, weight: 40, restTime: 90 },
        alternatives: ['Dumbbell Press', 'Incline Press'],
        notes: ['Control the weight', 'Full range of motion'],
      },
      {
        name: 'Deadlifts',
        type: 'strength',
        difficulty: 'intermediate',
        targetMuscles: ['hamstrings', 'glutes', 'back'],
        equipment: ['barbell', 'weights'],
        estimatedDuration: 15,
        rpeRange: [7, 9],
        progression: { reps: 5, sets: 3, weight: 60, restTime: 120 },
        alternatives: ['Romanian Deadlifts', 'Trap Bar Deadlifts'],
        notes: ['Keep back straight', 'Hip hinge movement'],
      },
    ];
    
    return exercises.filter(ex => ex.equipment.every(eq => availableEquipment.includes(eq)));
  }

  private static generatePeakExercises(
    preferences: any,
    currentLevel: string,
    availableEquipment: string[]
  ): ExerciseRecommendation[] {
    const exercises: ExerciseRecommendation[] = [
      {
        name: 'Heavy Squats',
        type: 'strength',
        difficulty: 'advanced',
        targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
        equipment: ['barbell', 'weights', 'squat rack'],
        estimatedDuration: 20,
        rpeRange: [8, 10],
        progression: { reps: 3, sets: 5, weight: 80, restTime: 180 },
        alternatives: ['Pause Squats', 'Box Squats'],
        notes: ['Maximum effort', 'Perfect form required'],
      },
      {
        name: 'Heavy Bench Press',
        type: 'strength',
        difficulty: 'advanced',
        targetMuscles: ['chest', 'shoulders', 'triceps'],
        equipment: ['barbell', 'bench', 'weights'],
        estimatedDuration: 20,
        rpeRange: [8, 10],
        progression: { reps: 3, sets: 5, weight: 70, restTime: 180 },
        alternatives: ['Close Grip Press', 'Floor Press'],
        notes: ['Spotter recommended', 'High intensity'],
      },
    ];
    
    return exercises.filter(ex => ex.equipment.every(eq => availableEquipment.includes(eq)));
  }

  private static generateDeloadExercises(
    preferences: any,
    currentLevel: string,
    availableEquipment: string[]
  ): ExerciseRecommendation[] {
    const exercises: ExerciseRecommendation[] = [
      {
        name: 'Light Squats',
        type: 'strength',
        difficulty: 'beginner',
        targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
        equipment: ['barbell', 'weights'],
        estimatedDuration: 10,
        rpeRange: [3, 5],
        progression: { reps: 12, sets: 3, weight: 30, restTime: 60 },
        alternatives: ['Bodyweight Squats', 'Goblet Squats'],
        notes: ['Focus on movement quality', 'Active recovery'],
      },
      {
        name: 'Mobility Work',
        type: 'conditioning',
        difficulty: 'beginner',
        targetMuscles: ['full body'],
        equipment: ['bodyweight'],
        estimatedDuration: 20,
        rpeRange: [2, 4],
        progression: { reps: 1, sets: 1, restTime: 0 },
        alternatives: ['Yoga', 'Stretching'],
        notes: ['Recovery focused', 'Movement quality'],
      },
    ];
    
    return exercises.filter(ex => ex.equipment.every(eq => availableEquipment.includes(eq) || eq === 'bodyweight'));
  }

  private static sortRecommendations(
    recommendations: ExerciseRecommendation[],
    preferences: any,
    currentLevel: string
  ): ExerciseRecommendation[] {
    return recommendations.sort((a, b) => {
      // Prioritize by preferred types
      const aTypeMatch = preferences.preferredTypes.includes(a.type) ? 1 : 0;
      const bTypeMatch = preferences.preferredTypes.includes(b.type) ? 1 : 0;
      
      if (aTypeMatch !== bTypeMatch) return bTypeMatch - aTypeMatch;
      
      // Then by difficulty appropriateness
      const aDifficultyMatch = this.getDifficultyScore(a.difficulty, currentLevel);
      const bDifficultyMatch = this.getDifficultyScore(b.difficulty, currentLevel);
      
      return bDifficultyMatch - aDifficultyMatch;
    });
  }

  private static getDifficultyScore(difficulty: string, currentLevel: string): number {
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const levelMap = { beginner: 1, intermediate: 2, advanced: 3 };
    
    const diffScore = difficultyMap[difficulty as keyof typeof difficultyMap];
    const levelScore = levelMap[currentLevel as keyof typeof levelMap];
    
    // Closer match = higher score
    return 3 - Math.abs(diffScore - levelScore);
  }

  private static determineSessionType(
    performanceForecast: PerformanceForecast,
    currentPhase: string
  ): 'strength' | 'volleyball' | 'conditioning' | 'rest' {
    if (performanceForecast.fatigue.riskLevel === 'high' || performanceForecast.injuryRisk.overallRisk === 'high') {
      return 'rest';
    }
    
    if (currentPhase === 'deload') {
      return 'conditioning';
    }
    
    if (currentPhase === 'peak') {
      return 'strength';
    }
    
    return 'strength'; // Default
  }

  private static calculateOptimalDuration(
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast,
    currentPhase: string
  ): number {
    const baseDuration = behaviorInsights.patterns.sessionDuration.average;
    
    // Adjust based on fatigue
    if (performanceForecast.fatigue.riskLevel === 'high') {
      return Math.round(baseDuration * 0.7);
    } else if (performanceForecast.fatigue.riskLevel === 'low') {
      return Math.round(baseDuration * 1.1);
    }
    
    // Adjust based on phase
    const phaseMultipliers = {
      foundation: 0.9,
      build: 1.0,
      peak: 1.1,
      deload: 0.8,
    };
    
    const multiplier = phaseMultipliers[currentPhase as keyof typeof phaseMultipliers] || 1.0;
    return Math.round(baseDuration * multiplier);
  }

  private static determineIntensityLevel(
    performanceForecast: PerformanceForecast,
    currentPhase: string
  ): 'low' | 'moderate' | 'high' {
    if (performanceForecast.fatigue.riskLevel === 'high' || performanceForecast.injuryRisk.overallRisk === 'high') {
      return 'low';
    }
    
    if (currentPhase === 'peak' && performanceForecast.fatigue.riskLevel === 'low') {
      return 'high';
    }
    
    if (currentPhase === 'deload') {
      return 'low';
    }
    
    return 'moderate';
  }

  private static selectExercisesForSession(
    recommendations: ExerciseRecommendation[],
    duration: number,
    intensity: string,
    preferences: any
  ): ExerciseRecommendation[] {
    const maxExercises = Math.floor(duration / 15); // ~15 minutes per exercise
    const selectedExercises: ExerciseRecommendation[] = [];
    
    // Prioritize by preferences and intensity
    const sortedRecommendations = recommendations.sort((a, b) => {
      const aPreference = preferences[a.type] || 0;
      const bPreference = preferences[b.type] || 0;
      return bPreference - aPreference;
    });
    
    // Select exercises based on duration and intensity
    let totalDuration = 0;
    for (const exercise of sortedRecommendations) {
      if (totalDuration + exercise.estimatedDuration <= duration && selectedExercises.length < maxExercises) {
        selectedExercises.push(exercise);
        totalDuration += exercise.estimatedDuration;
      }
    }
    
    return selectedExercises;
  }

  private static generateWarmUp(sessionType: string, /* eslint-disable-next-line no-unused-vars */ intensity: string): string[] {
    const warmUps = {
      strength: ['Dynamic stretching', 'Light cardio', 'Movement prep'],
      volleyball: ['Ball handling', 'Dynamic warm-up', 'Sport-specific movements'],
      conditioning: ['Light jogging', 'Dynamic stretching', 'Movement prep'],
      rest: ['Gentle stretching', 'Breathing exercises', 'Mobility work'],
    };
    
    return warmUps[sessionType as keyof typeof warmUps] || warmUps.strength;
  }

  private static generateCoolDown(sessionType: string, /* eslint-disable-next-line no-unused-vars */ intensity: string): string[] {
    const coolDowns = {
      strength: ['Static stretching', 'Foam rolling', 'Deep breathing'],
      volleyball: ['Static stretching', 'Ball handling', 'Recovery walk'],
      conditioning: ['Light walking', 'Static stretching', 'Hydration'],
      rest: ['Gentle stretching', 'Meditation', 'Breathing exercises'],
    };
    
    return coolDowns[sessionType as keyof typeof coolDowns] || coolDowns.strength;
  }

  private static identifySessionFocus(
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast,
    currentPhase: string
  ): string[] {
    const focus: string[] = [];
    
    if (currentPhase === 'foundation') {
      focus.push('Form development', 'Movement patterns');
    } else if (currentPhase === 'build') {
      focus.push('Progressive overload', 'Strength building');
    } else if (currentPhase === 'peak') {
      focus.push('Performance', 'Maximal strength');
    } else if (currentPhase === 'deload') {
      focus.push('Recovery', 'Movement quality');
    }
    
    if (performanceForecast.fatigue.riskLevel === 'high') {
      focus.push('Recovery');
    }
    
    if (performanceForecast.injuryRisk.overallRisk === 'medium' || performanceForecast.injuryRisk.overallRisk === 'high') {
      focus.push('Injury prevention');
    }
    
    return focus;
  }

  private static generateWarnings(
    performanceForecast: PerformanceForecast,
    behaviorInsights: BehaviorInsights
  ): string[] {
    const warnings: string[] = [];
    
    if (performanceForecast.fatigue.riskLevel === 'high') {
      warnings.push('High fatigue detected - consider reducing intensity');
    }
    
    if (performanceForecast.injuryRisk.overallRisk === 'high') {
      warnings.push('High injury risk - focus on form and consider rest');
    }
    
    if (behaviorInsights.patterns.consistency.missedSessionRate > 30) {
      warnings.push('High missed session rate - consider more realistic goals');
    }
    
    return warnings;
  }

  private static calculateExpectedRPE(exercises: ExerciseRecommendation[], intensity: string): number {
    if (exercises.length === 0) return 5;
    
    const intensityMultipliers = { low: 0.7, moderate: 1.0, high: 1.3 };
    const multiplier = intensityMultipliers[intensity as keyof typeof intensityMultipliers] || 1.0;
    
    const avgRPE = exercises.reduce((sum, ex) => {
      const midRPE = (ex.rpeRange[0] + ex.rpeRange[1]) / 2;
      return sum + midRPE;
    }, 0) / exercises.length;
    
    return Math.round(avgRPE * multiplier * 10) / 10;
  }

  // Additional helper methods for adjustments and optimizations
  private static calculateRepAdjustments(
    // eslint-disable-next-line no-unused-vars
    currentSession: SessionData,
    // eslint-disable-next-line no-unused-vars
    behaviorInsights: BehaviorInsights,
    // eslint-disable-next-line no-unused-vars
    performanceForecast: PerformanceForecast
  ): any[] {
    // Implementation for rep adjustments
    return [];
  }

  private static calculateWeightAdjustments(
    // eslint-disable-next-line no-unused-vars
    currentSession: SessionData,
    // eslint-disable-next-line no-unused-vars
    behaviorInsights: BehaviorInsights,
    // eslint-disable-next-line no-unused-vars
    performanceForecast: PerformanceForecast
  ): any[] {
    // Implementation for weight adjustments
    return [];
  }

  private static calculateRestTimeAdjustments(
    // eslint-disable-next-line no-unused-vars
    currentSession: SessionData,
    // eslint-disable-next-line no-unused-vars
    behaviorInsights: BehaviorInsights,
    // eslint-disable-next-line no-unused-vars
    performanceForecast: PerformanceForecast
  ): any[] {
    // Implementation for rest time adjustments
    return [];
  }

  private static calculateSessionModifications(
    // eslint-disable-next-line no-unused-vars
    currentSession: SessionData,
    // eslint-disable-next-line no-unused-vars
    behaviorInsights: BehaviorInsights,
    // eslint-disable-next-line no-unused-vars
    performanceForecast: PerformanceForecast
  ): any[] {
    // Implementation for session modifications
    return [];
  }

  private static calculateOptimalRestTime(
    exercise: ExerciseRecommendation,
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast
  ): number {
    // Base rest time
    let restTime = exercise.progression.restTime;
    
    // Adjust based on fatigue
    if (performanceForecast.fatigue.currentFatigue > 7) {
      restTime *= 1.2;
    }
    
    // Adjust based on intensity
    const avgRPE = (exercise.rpeRange[0] + exercise.rpeRange[1]) / 2;
    if (avgRPE > 8) {
      restTime *= 1.3;
    }
    
    return Math.round(restTime);
  }

  private static getRestTimeReason(
    exercise: ExerciseRecommendation,
    recommended: number,
    current: number
  ): string {
    if (recommended > current) {
      return 'Increased rest time for better recovery';
    } else if (recommended < current) {
      return 'Reduced rest time to maintain intensity';
    }
    return 'Rest time is optimal';
  }

  private static calculateExerciseIntensity(exercise: ExerciseRecommendation): number {
    return (exercise.rpeRange[0] + exercise.rpeRange[1]) / 2 / 10;
  }

  private static assessExperienceLevel(behaviorInsights: BehaviorInsights): number {
    return behaviorInsights.habits.workoutHabit.strength;
  }

  private static calculateRecommendedIntensity(
    currentIntensity: number,
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast,
    currentPhase: string
  ): number {
    let recommended = currentIntensity;
    
    // Adjust based on fatigue
    if (performanceForecast.fatigue.riskLevel === 'high') {
      recommended *= 0.8;
    } else if (performanceForecast.fatigue.riskLevel === 'low') {
      recommended *= 1.1;
    }
    
    // Adjust based on phase
    const phaseMultipliers = {
      foundation: 0.8,
      build: 1.0,
      peak: 1.2,
      deload: 0.6,
    };
    
    const multiplier = phaseMultipliers[currentPhase as keyof typeof phaseMultipliers] || 1.0;
    recommended *= multiplier;
    
    return Math.min(10, Math.max(1, recommended));
  }

  private static getIntensityModulationReason(
    recommended: number,
    current: number,
    // eslint-disable-next-line no-unused-vars
    performanceForecast: PerformanceForecast
  ): string {
    if (recommended > current) {
      return 'Increase intensity for better progress';
    } else if (recommended < current) {
      return 'Reduce intensity to prevent overtraining';
    }
    return 'Maintain current intensity';
  }

  private static identifyNextSessionFocus(
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast,
    // eslint-disable-next-line no-unused-vars
    currentPhase: string
  ): string[] {
    const focus: string[] = [];
    
    if (performanceForecast.strength.trend === 'plateau') {
      focus.push('Progressive overload');
    }
    
    if (performanceForecast.fatigue.riskLevel === 'high') {
      focus.push('Recovery');
    }
    
    if (behaviorInsights.patterns.consistency.missedSessionRate > 20) {
      focus.push('Consistency');
    }
    
    return focus;
  }

  private static generateLongTermGoals(
    behaviorInsights: BehaviorInsights,
    performanceForecast: PerformanceForecast
  ): string[] {
    const goals: string[] = [];
    
    if (performanceForecast.strength.currentLevel < 50) {
      goals.push('Build foundational strength');
    } else if (performanceForecast.strength.currentLevel < 80) {
      goals.push('Develop intermediate strength');
    } else {
      goals.push('Achieve advanced strength levels');
    }
    
    if (behaviorInsights.patterns.consistency.weeklyFrequency < 4) {
      goals.push('Increase training frequency');
    }
    
    if (behaviorInsights.habits.recoveryHabit.sleepQuality < 0.7) {
      goals.push('Improve recovery habits');
    }
    
    return goals;
  }
}
