'use client';

import { DatabaseService } from './database-service'; // eslint-disable-next-line no-unused-vars

export interface ExerciseRecommendation {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  muscleGroups: string[];
  description: string;
  instructions: string[];
  tips: string[];
  alternatives: string[];
  progression: {
    next: string[];
    prerequisites: string[];
  };
  metadata: {
    popularity: number;
    effectiveness: number;
    safety: number;
    lastUpdated: Date;
  };
}

export interface RecommendationContext {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  availableEquipment: string[];
  targetMuscleGroups: string[];
  sessionType: 'strength' | 'volleyball' | 'plyometric' | 'recovery';
  previousExercises: string[];
  preferences: {
    difficulty: 'easy' | 'moderate' | 'challenging';
    duration: 'short' | 'medium' | 'long';
    intensity: 'low' | 'medium' | 'high';
  };
  limitations: {
    injuries: string[];
    restrictions: string[];
  };
}

export interface SmartRecommendationEngine {
  getRecommendations(context: RecommendationContext, count: number): Promise<ExerciseRecommendation[]>; // eslint-disable-next-line no-unused-vars
  getAlternativeExercises(exerciseId: string, context: RecommendationContext): Promise<ExerciseRecommendation[]>; // eslint-disable-next-line no-unused-vars
  getProgressionExercises(exerciseId: string, context: RecommendationContext): Promise<ExerciseRecommendation[]>; // eslint-disable-next-line no-unused-vars
  analyzeExerciseCompatibility(exerciseId: string, context: RecommendationContext): Promise<{ // eslint-disable-next-line no-unused-vars
    compatibility: number;
    reasons: string[];
    warnings: string[];
  }>;
}

export interface ExerciseDatabase {
  exercises: Map<string, ExerciseRecommendation>;
  categories: Map<string, string[]>;
  equipment: Map<string, string[]>;
  muscleGroups: Map<string, string[]>;
  progressions: Map<string, string[]>;
}

export class ExerciseDBIntegrationService {
  private databaseService = new DatabaseService();
  private exerciseDatabase: ExerciseDatabase = {
    exercises: new Map(),
    categories: new Map(),
    equipment: new Map(),
    muscleGroups: new Map(),
    progressions: new Map(),
  };
  private recommendationEngine: SmartRecommendationEngine;

  constructor() {
    this.recommendationEngine = new SmartRecommendationEngineImpl(this.exerciseDatabase);
    this.initializeExerciseDatabase();
  }

  // Initialize exercise database
  private async initializeExerciseDatabase() {
    try {
      // Load exercises from external API or local data
      await this.loadExercises();
      this.buildIndexes();
    } catch (error) {
      console.error('Error initializing exercise database:', error);
    }
  }

  // Load exercises from external source
  private async loadExercises() {
    // This would typically load from an external API like ExerciseDB
    // For now, we'll create a comprehensive local database
    const exercises = this.createLocalExerciseDatabase();
    
    exercises.forEach(exercise => {
      this.exerciseDatabase.exercises.set(exercise.id, exercise);
    });
  }

  // Create local exercise database
  private createLocalExerciseDatabase(): ExerciseRecommendation[] {
    return [
      // Strength Training Exercises
      {
        id: 'squat',
        name: 'Bodyweight Squat',
        category: 'strength',
        difficulty: 'beginner',
        equipment: ['none'],
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        description: 'A fundamental lower body exercise that targets the quadriceps, glutes, and hamstrings.',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body by bending at the hips and knees',
          'Keep your chest up and core engaged',
          'Lower until thighs are parallel to the ground',
          'Push through heels to return to starting position'
        ],
        tips: [
          'Keep your knees in line with your toes',
          'Don\'t let your knees cave inward',
          'Maintain a neutral spine throughout the movement'
        ],
        alternatives: ['goblet-squat', 'jump-squat', 'single-leg-squat'],
        progression: {
          next: ['goblet-squat', 'weighted-squat'],
          prerequisites: []
        },
        metadata: {
          popularity: 95,
          effectiveness: 90,
          safety: 85,
          lastUpdated: new Date()
        }
      },
      {
        id: 'push-up',
        name: 'Push-up',
        category: 'strength',
        difficulty: 'beginner',
        equipment: ['none'],
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        description: 'A classic upper body exercise that builds chest, shoulder, and tricep strength.',
        instructions: [
          'Start in plank position with hands slightly wider than shoulders',
          'Lower your body until chest nearly touches the ground',
          'Keep your body in a straight line',
          'Push up to starting position',
          'Maintain core engagement throughout'
        ],
        tips: [
          'Keep your body in a straight line',
          'Don\'t let your hips sag or pike up',
          'Breathe out on the way up'
        ],
        alternatives: ['knee-push-up', 'incline-push-up', 'diamond-push-up'],
        progression: {
          next: ['diamond-push-up', 'decline-push-up'],
          prerequisites: []
        },
        metadata: {
          popularity: 90,
          effectiveness: 85,
          safety: 80,
          lastUpdated: new Date()
        }
      },
      // Volleyball Skills Exercises
      {
        id: 'wall-sit',
        name: 'Wall Sit',
        category: 'volleyball',
        difficulty: 'beginner',
        equipment: ['wall'],
        muscleGroups: ['quadriceps', 'glutes'],
        description: 'An isometric exercise that builds leg endurance and stability for volleyball.',
        instructions: [
          'Stand with your back against a wall',
          'Slide down until your thighs are parallel to the ground',
          'Keep your back flat against the wall',
          'Hold the position for the specified time',
          'Push through heels to return to standing'
        ],
        tips: [
          'Keep your knees at 90 degrees',
          'Don\'t let your knees go past your toes',
          'Breathe normally throughout the hold'
        ],
        alternatives: ['single-leg-wall-sit', 'weighted-wall-sit'],
        progression: {
          next: ['single-leg-wall-sit', 'weighted-wall-sit'],
          prerequisites: []
        },
        metadata: {
          popularity: 75,
          effectiveness: 80,
          safety: 90,
          lastUpdated: new Date()
        }
      },
      // Plyometric Exercises
      {
        id: 'jump-squat',
        name: 'Jump Squat',
        category: 'plyometric',
        difficulty: 'intermediate',
        equipment: ['none'],
        muscleGroups: ['quadriceps', 'glutes', 'calves'],
        description: 'An explosive movement that builds power and athleticism.',
        instructions: [
          'Start in squat position',
          'Explosively jump up as high as possible',
          'Land softly on the balls of your feet',
          'Immediately return to squat position',
          'Repeat for specified reps'
        ],
        tips: [
          'Land softly to reduce impact',
          'Keep your knees in line with your toes',
          'Use your arms to help generate power'
        ],
        alternatives: ['box-jump', 'tuck-jump', 'single-leg-hop'],
        progression: {
          next: ['box-jump', 'tuck-jump'],
          prerequisites: ['squat']
        },
        metadata: {
          popularity: 80,
          effectiveness: 85,
          safety: 70,
          lastUpdated: new Date()
        }
      },
      // Recovery Exercises
      {
        id: 'cat-cow',
        name: 'Cat-Cow Stretch',
        category: 'recovery',
        difficulty: 'beginner',
        equipment: ['none'],
        muscleGroups: ['spine', 'core'],
        description: 'A gentle spinal mobility exercise for recovery and flexibility.',
        instructions: [
          'Start on hands and knees',
          'Arch your back and look up (cow position)',
          'Round your back and tuck your chin (cat position)',
          'Move slowly between positions',
          'Repeat for specified reps'
        ],
        tips: [
          'Move slowly and controlled',
          'Focus on spinal movement',
          'Breathe with the movement'
        ],
        alternatives: ['child-pose', 'spinal-twist'],
        progression: {
          next: ['spinal-twist', 'thread-the-needle'],
          prerequisites: []
        },
        metadata: {
          popularity: 70,
          effectiveness: 75,
          safety: 95,
          lastUpdated: new Date()
        }
      }
    ];
  }

  // Build indexes for efficient searching
  private buildIndexes() {
    // Build category index
    for (const [id, exercise] of this.exerciseDatabase.exercises) {
      if (!this.exerciseDatabase.categories.has(exercise.category)) {
        this.exerciseDatabase.categories.set(exercise.category, []);
      }
      this.exerciseDatabase.categories.get(exercise.category)!.push(id);
    }

    // Build equipment index
    for (const [id, exercise] of this.exerciseDatabase.exercises) {
      exercise.equipment.forEach(equipment => {
        if (!this.exerciseDatabase.equipment.has(equipment)) {
          this.exerciseDatabase.equipment.set(equipment, []);
        }
        this.exerciseDatabase.equipment.get(equipment)!.push(id);
      });
    }

    // Build muscle group index
    for (const [id, exercise] of this.exerciseDatabase.exercises) {
      exercise.muscleGroups.forEach(muscleGroup => {
        if (!this.exerciseDatabase.muscleGroups.has(muscleGroup)) {
          this.exerciseDatabase.muscleGroups.set(muscleGroup, []);
        }
        this.exerciseDatabase.muscleGroups.get(muscleGroup)!.push(id);
      });
    }

    // Build progression index
    for (const [id, exercise] of this.exerciseDatabase.exercises) {
      exercise.progression.next.forEach(nextExercise => {
        if (!this.exerciseDatabase.progressions.has(nextExercise)) {
          this.exerciseDatabase.progressions.set(nextExercise, []);
        }
        this.exerciseDatabase.progressions.get(nextExercise)!.push(id);
      });
    }
  }

  // Get smart recommendations
  async getSmartRecommendations(context: RecommendationContext, count: number = 5): Promise<ExerciseRecommendation[]> {
    return await this.recommendationEngine.getRecommendations(context, count);
  }

  // Get alternative exercises
  async getAlternativeExercises(exerciseId: string, context: RecommendationContext): Promise<ExerciseRecommendation[]> {
    return await this.recommendationEngine.getAlternativeExercises(exerciseId, context);
  }

  // Get progression exercises
  async getProgressionExercises(exerciseId: string, context: RecommendationContext): Promise<ExerciseRecommendation[]> {
    return await this.recommendationEngine.getProgressionExercises(exerciseId, context);
  }

  // Analyze exercise compatibility
  async analyzeExerciseCompatibility(exerciseId: string, context: RecommendationContext) {
    return await this.recommendationEngine.analyzeExerciseCompatibility(exerciseId, context);
  }

  // Search exercises
  async searchExercises(query: string, filters?: {
    category?: string;
    difficulty?: string;
    equipment?: string[];
    muscleGroups?: string[];
  }): Promise<ExerciseRecommendation[]> {
    const results: ExerciseRecommendation[] = [];
    const queryLower = query.toLowerCase();

    for (const [id, exercise] of this.exerciseDatabase.exercises) {
      // Text search
      const matchesText = exercise.name.toLowerCase().includes(queryLower) ||
                         exercise.description.toLowerCase().includes(queryLower) ||
                         exercise.category.toLowerCase().includes(queryLower);

      if (!matchesText) continue;

      // Apply filters
      if (filters) {
        if (filters.category && exercise.category !== filters.category) continue;
        if (filters.difficulty && exercise.difficulty !== filters.difficulty) continue;
        if (filters.equipment && !filters.equipment.some(eq => exercise.equipment.includes(eq))) continue;
        if (filters.muscleGroups && !filters.muscleGroups.some(mg => exercise.muscleGroups.includes(mg))) continue;
      }

      results.push(exercise);
    }

    // Sort by relevance (popularity and effectiveness)
    return results.sort((a, b) => {
      const scoreA = a.metadata.popularity + a.metadata.effectiveness;
      const scoreB = b.metadata.popularity + b.metadata.effectiveness;
      return scoreB - scoreA;
    });
  }

  // Get exercise by ID
  getExerciseById(id: string): ExerciseRecommendation | undefined {
    return this.exerciseDatabase.exercises.get(id);
  }

  // Get exercises by category
  getExercisesByCategory(category: string): ExerciseRecommendation[] {
    const exerciseIds = this.exerciseDatabase.categories.get(category) || [];
    return exerciseIds.map(id => this.exerciseDatabase.exercises.get(id)!); // eslint-disable-next-line no-unused-vars
  }

  // Get exercises by equipment
  getExercisesByEquipment(equipment: string): ExerciseRecommendation[] {
    const exerciseIds = this.exerciseDatabase.equipment.get(equipment) || [];
    return exerciseIds.map(id => this.exerciseDatabase.exercises.get(id)!); // eslint-disable-next-line no-unused-vars
  }

  // Get exercises by muscle group
  getExercisesByMuscleGroup(muscleGroup: string): ExerciseRecommendation[] {
    const exerciseIds = this.exerciseDatabase.muscleGroups.get(muscleGroup) || [];
    return exerciseIds.map(id => this.exerciseDatabase.exercises.get(id)!); // eslint-disable-next-line no-unused-vars
  }

  // Get all categories
  getAllCategories(): string[] {
    return Array.from(this.exerciseDatabase.categories.keys());
  }

  // Get all equipment
  getAllEquipment(): string[] {
    return Array.from(this.exerciseDatabase.equipment.keys());
  }

  // Get all muscle groups
  getAllMuscleGroups(): string[] {
    return Array.from(this.exerciseDatabase.muscleGroups.keys());
  }
}

// Smart Recommendation Engine Implementation
class SmartRecommendationEngineImpl implements SmartRecommendationEngine {
  constructor(private exerciseDatabase: ExerciseDatabase) {}

  async getRecommendations(context: RecommendationContext, count: number): Promise<ExerciseRecommendation[]> {
    const candidates: { exercise: ExerciseRecommendation; score: number }[] = [];

    for (const [id, exercise] of this.exerciseDatabase.exercises) {
      const score = this.calculateRecommendationScore(exercise, context);
      if (score > 0) {
        candidates.push({ exercise, score });
      }
    }

    // Sort by score and return top recommendations
    candidates.sort((a, b) => b.score - a.score);
    return candidates.slice(0, count).map(c => c.exercise);
  }

  async getAlternativeExercises(exerciseId: string, context: RecommendationContext): Promise<ExerciseRecommendation[]> {
    const exercise = this.exerciseDatabase.exercises.get(exerciseId);
    if (!exercise) return [];

    const alternatives: ExerciseRecommendation[] = [];
    
    // Get exercises with similar muscle groups
    for (const [id, altExercise] of this.exerciseDatabase.exercises) {
      if (id === exerciseId) continue;
      
      const commonMuscleGroups = exercise.muscleGroups.filter(mg => 
        altExercise.muscleGroups.includes(mg)
      );
      
      if (commonMuscleGroups.length > 0) {
        alternatives.push(altExercise);
      }
    }

    // Sort by similarity and return top alternatives
    return alternatives
      .sort((a, b) => {
        const scoreA = this.calculateRecommendationScore(a, context);
        const scoreB = this.calculateRecommendationScore(b, context);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }

  async getProgressionExercises(exerciseId: string, context: RecommendationContext): Promise<ExerciseRecommendation[]> {
    const exercise = this.exerciseDatabase.exercises.get(exerciseId);
    if (!exercise) return [];

    const progressions: ExerciseRecommendation[] = [];
    
    for (const nextId of exercise.progression.next) {
      const nextExercise = this.exerciseDatabase.exercises.get(nextId);
      if (nextExercise) {
        progressions.push(nextExercise);
      }
    }

    return progressions;
  }

  async analyzeExerciseCompatibility(exerciseId: string, context: RecommendationContext) {
    const exercise = this.exerciseDatabase.exercises.get(exerciseId);
    if (!exercise) {
      return {
        compatibility: 0,
        reasons: ['Exercise not found'],
        warnings: []
      };
    }

    let compatibility = 100;
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Check difficulty compatibility
    if (exercise.difficulty === 'advanced' && context.userLevel === 'beginner') {
      compatibility -= 30;
      warnings.push('Exercise may be too advanced for your current level');
    }

    // Check equipment availability
    const missingEquipment = exercise.equipment.filter(eq => 
      !context.availableEquipment.includes(eq) && eq !== 'none'
    );
    if (missingEquipment.length > 0) {
      compatibility -= 20;
      warnings.push(`Missing equipment: ${missingEquipment.join(', ')}`);
    }

    // Check injury compatibility
    const incompatibleInjuries = exercise.muscleGroups.filter(mg =>
      context.limitations.injuries.some(injury => 
        injury.toLowerCase().includes(mg.toLowerCase())
      )
    );
    if (incompatibleInjuries.length > 0) {
      compatibility -= 40;
      warnings.push(`May aggravate injuries: ${incompatibleInjuries.join(', ')}`);
    }

    // Check session type compatibility
    if (exercise.category !== context.sessionType) {
      compatibility -= 10;
      reasons.push(`Exercise category (${exercise.category}) doesn't match session type (${context.sessionType})`);
    }

    // Check muscle group targeting
    const targetMuscleGroups = exercise.muscleGroups.filter(mg =>
      context.targetMuscleGroups.includes(mg)
    );
    if (targetMuscleGroups.length > 0) {
      compatibility += 20;
      reasons.push(`Targets desired muscle groups: ${targetMuscleGroups.join(', ')}`);
    }

    // Check if exercise was recently used
    if (context.previousExercises.includes(exerciseId)) {
      compatibility -= 15;
      reasons.push('Exercise was recently used');
    }

    return {
      compatibility: Math.max(0, Math.min(100, compatibility)),
      reasons,
      warnings
    };
  }

  private calculateRecommendationScore(exercise: ExerciseRecommendation, context: RecommendationContext): number {
    let score = 0;

    // Base score from metadata
    score += exercise.metadata.popularity * 0.3;
    score += exercise.metadata.effectiveness * 0.4;
    score += exercise.metadata.safety * 0.3;

    // Difficulty bonus
    if (exercise.difficulty === context.userLevel) {
      score += 20;
    } else if (exercise.difficulty === 'beginner' && context.userLevel === 'intermediate') {
      score += 10;
    } else if (exercise.difficulty === 'intermediate' && context.userLevel === 'advanced') {
      score += 10;
    }

    // Equipment availability bonus
    const availableEquipment = exercise.equipment.filter(eq => 
      context.availableEquipment.includes(eq) || eq === 'none'
    );
    if (availableEquipment.length === exercise.equipment.length) {
      score += 15;
    }

    // Muscle group targeting bonus
    const targetMuscleGroups = exercise.muscleGroups.filter(mg =>
      context.targetMuscleGroups.includes(mg)
    );
    score += targetMuscleGroups.length * 10;

    // Session type bonus
    if (exercise.category === context.sessionType) {
      score += 25;
    }

    // Avoid recently used exercises
    if (context.previousExercises.includes(exercise.id)) {
      score -= 30;
    }

    // Injury compatibility penalty
    const incompatibleInjuries = exercise.muscleGroups.filter(mg =>
      context.limitations.injuries.some(injury => 
        injury.toLowerCase().includes(mg.toLowerCase())
      )
    );
    score -= incompatibleInjuries.length * 20;

    return score;
  }
}

// Export singleton instance
export const exerciseDBIntegration = new ExerciseDBIntegrationService();
