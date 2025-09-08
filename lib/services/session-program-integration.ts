'use client';

import { DatabaseService, SessionData, CheckInData } from './database-service';
import { ProgramPhaseService, PhaseAnalysis } from './program-phase-service';
// import { useUser } from '@/lib/contexts/user-context';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  load?: string;
  instructions: string[];
  phase: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  equipment: string[];
  muscleGroups: string[];
  rpe: number;
  restTime: number; // seconds
  progression: {
    type: 'linear' | 'double_progression' | 'wave' | 'periodized';
    increment: number;
    frequency: number; // sessions between increments
  };
}

export interface SessionProgram {
  id: string;
  name: string;
  type: 'strength' | 'volleyball' | 'conditioning' | 'recovery';
  phase: string;
  week: number;
  day: number;
  exercises: Exercise[];
  estimatedDuration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  volume: 'low' | 'moderate' | 'high';
  focus: string[];
  adaptations: {
    basedOn: 'phase' | 'progress' | 'wellness' | 'performance';
    adjustments: Record<string, any>;
  };
}

export interface SessionContext {
  user: any;
  currentWeek: number;
  currentPhase: PhaseAnalysis;
  recentSessions: SessionData[];
  recentCheckIns: CheckInData[];
  performanceMetrics: any[];
  availableEquipment: string[];
  userPreferences: any;
}

export interface ExerciseProgression {
  exerciseId: string;
  currentLoad: number;
  currentReps: number;
  progressionType: string;
  nextLoad: number;
  nextReps: number;
  progressionReason: string;
  confidence: number; // 0-1
}

export class SessionProgramIntegration {
  private databaseService = new DatabaseService();

  // Real-time program data fetching
  async fetchProgramData(userId: string): Promise<SessionContext> {
    try {
      const [sessions, checkIns, performanceMetrics] = await Promise.all([
        this.databaseService.getSessions(userId),
        this.databaseService.getCheckIns(userId),
        this.databaseService.getProgressMetrics(userId),
      ]);

      // Get user data (this would come from user context in real implementation)
      const user = { id: userId, current_week: 6 }; // Mock user data
      const currentWeek = user.current_week || 1;

      // Analyze current phase
      const currentPhase = ProgramPhaseService.analyzePhase(
        currentWeek,
        sessions,
        checkIns
      );

      return {
        user,
        currentWeek,
        currentPhase,
        recentSessions: sessions.slice(0, 10), // Last 10 sessions
        recentCheckIns: checkIns.slice(0, 7), // Last 7 days
        performanceMetrics,
        availableEquipment: ['bodyweight', 'dumbbells', 'resistance_bands'], // Mock equipment
        userPreferences: {}, // Would come from personalization service
      };
    } catch (error) {
      console.error('Error fetching program data:', error);
      throw new Error('Failed to fetch program data');
    }
  }

  // Dynamic exercise generation based on program phase
  generateExercises(context: SessionContext, sessionType: string): Exercise[] {
    const { currentPhase, recentSessions, availableEquipment } = context;
    const phase = currentPhase.currentPhase;

    // Base exercises by session type and phase
    const baseExercises = this.getBaseExercises(sessionType, phase.id);

    // Apply phase-specific adaptations
    const adaptedExercises = this.adaptExercisesForPhase(baseExercises, phase);

    // Apply progress-based progression
    const progressedExercises = this.applyProgressBasedProgression(
      adaptedExercises,
      recentSessions
    );

    // Filter by available equipment
    const filteredExercises = this.filterByEquipment(
      progressedExercises,
      availableEquipment
    );

    // Apply intensity and volume adjustments
    const finalExercises = this.applyIntensityVolumeAdjustments(
      filteredExercises,
      currentPhase.intensityAdjustments,
      currentPhase.volumeAdjustments
    );

    return finalExercises;
  }

  // Phase-specific workout adaptation
  adaptExercisesForPhase(exercises: Exercise[], phase: any): Exercise[] {
    return exercises.map(exercise => {
      const adapted = { ...exercise };

      switch (phase.id) {
        case 'foundation':
          // Reduce intensity, focus on form
          adapted.rpe = Math.max(4, adapted.rpe - 2);
          adapted.restTime = Math.min(120, adapted.restTime + 30);
          adapted.instructions.unshift('Focus on perfect form and control');
          break;

        case 'strength':
          // Increase intensity, focus on progressive overload
          adapted.rpe = Math.min(9, adapted.rpe + 1);
          adapted.restTime = Math.max(180, adapted.restTime + 60);
          adapted.instructions.unshift('Focus on progressive overload');
          break;

        case 'hypertrophy':
          // Moderate intensity, higher volume
          adapted.rpe = Math.min(8, adapted.rpe + 0.5);
          adapted.sets = Math.ceil(adapted.sets * 1.2);
          adapted.restTime = Math.max(90, adapted.restTime - 30);
          adapted.instructions.unshift(
            'Focus on muscle growth and time under tension'
          );
          break;

        case 'power':
          // High intensity, low volume, explosive movements
          adapted.rpe = Math.min(9, adapted.rpe + 1.5);
          adapted.sets = Math.ceil(adapted.sets * 0.8);
          adapted.restTime = Math.max(240, adapted.restTime + 60);
          adapted.instructions.unshift('Focus on explosive power and speed');
          break;

        case 'deload':
          // Low intensity, recovery focus
          adapted.rpe = Math.max(3, adapted.rpe - 3);
          adapted.sets = Math.ceil(adapted.sets * 0.6);
          adapted.restTime = Math.max(120, adapted.restTime + 30);
          adapted.instructions.unshift('Focus on recovery and mobility');
          break;
      }

      return adapted;
    });
  }

  // Progress-based exercise progression
  applyProgressBasedProgression(
    exercises: Exercise[],
    recentSessions: SessionData[]
  ): Exercise[] {
    return exercises.map(exercise => {
      const progression = this.calculateExerciseProgression(
        exercise,
        recentSessions
      );

      if (progression.confidence > 0.7) {
        return {
          ...exercise,
          reps: progression.nextReps.toString(),
          load: progression.nextLoad
            ? `${progression.nextLoad} lbs`
            : exercise.load,
          progression: {
            ...exercise.progression,
            increment: progression.nextLoad - progression.currentLoad,
          },
        };
      }

      return exercise;
    });
  }

  // Calculate exercise progression based on recent performance
  calculateExerciseProgression(
    exercise: Exercise,
    recentSessions: SessionData[]
  ): ExerciseProgression {
    const exerciseHistory = this.getExerciseHistory(
      exercise.id,
      recentSessions
    );

    if (exerciseHistory.length < 3) {
      return {
        exerciseId: exercise.id,
        currentLoad: this.extractLoad(exercise.load || '0'),
        currentReps: this.extractReps(exercise.reps),
        progressionType: 'linear',
        nextLoad: this.extractLoad(exercise.load || '0'),
        nextReps: this.extractReps(exercise.reps),
        progressionReason: 'Insufficient data for progression',
        confidence: 0,
      };
    }

    // Analyze performance trends
    const recentPerformance = exerciseHistory.slice(0, 3);
    const avgRPE =
      recentPerformance.reduce((sum, perf) => sum + perf.rpe, 0) /
      recentPerformance.length;
    const avgLoad =
      recentPerformance.reduce((sum, perf) => sum + perf.load, 0) /
      recentPerformance.length;
    const avgReps =
      recentPerformance.reduce((sum, perf) => sum + perf.reps, 0) /
      recentPerformance.length;

    // Determine progression based on RPE and consistency
    let nextLoad = avgLoad;
    const nextReps = avgReps;
    let progressionReason = '';

    if (avgRPE < 7 && recentPerformance.length >= 2) {
      // Can progress - RPE is low and consistent
      nextLoad = avgLoad * 1.05; // 5% increase
      progressionReason = 'RPE consistently low, ready for progression';
    } else if (avgRPE > 8) {
      // Reduce load - RPE too high
      nextLoad = avgLoad * 0.95; // 5% decrease
      progressionReason = 'RPE too high, reducing load for safety';
    } else {
      // Maintain current load
      progressionReason = 'Maintaining current load based on RPE';
    }

    return {
      exerciseId: exercise.id,
      currentLoad: avgLoad,
      currentReps: avgReps,
      progressionType: 'linear',
      nextLoad,
      nextReps,
      progressionReason,
      confidence: avgRPE < 7 ? 0.8 : 0.3,
    };
  }

  // Get exercise history from recent sessions
  getExerciseHistory(exerciseId: string, recentSessions: SessionData[]) {
    const history: Array<{ load: number; reps: number; rpe: number }> = [];

    for (const session of recentSessions) {
      for (const exercise of session.exercises) {
        if (exercise.name.toLowerCase().includes(exerciseId.toLowerCase())) {
          for (const set of exercise.sets) {
            if (set.completed) {
              history.push({
                load: set.weight || 0,
                reps: set.reps,
                rpe: set.rpe,
              });
            }
          }
        }
      }
    }

    return history;
  }

  // Extract load from string (e.g., "25 lbs" -> 25)
  extractLoad(loadStr: string): number {
    const match = loadStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  // Extract reps from string (e.g., "10-12" -> 10)
  extractReps(repsStr: string): number {
    const match = repsStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  // Filter exercises by available equipment
  filterByEquipment(
    exercises: Exercise[],
    availableEquipment: string[]
  ): Exercise[] {
    return exercises.filter(exercise =>
      exercise.equipment.every(equip => availableEquipment.includes(equip))
    );
  }

  // Apply intensity and volume adjustments
  applyIntensityVolumeAdjustments(
    exercises: Exercise[],
    intensityAdjustments: any,
    volumeAdjustments: any
  ): Exercise[] {
    return exercises.map(exercise => ({
      ...exercise,
      sets: Math.ceil(exercise.sets * volumeAdjustments.sets),
      reps: this.adjustReps(exercise.reps, volumeAdjustments.reps),
      restTime: Math.ceil(exercise.restTime * volumeAdjustments.rest),
      rpe: Math.min(10, exercise.rpe * intensityAdjustments.strength),
    }));
  }

  // Adjust reps based on volume multiplier
  adjustReps(repsStr: string, multiplier: number): string {
    const match = repsStr.match(/(\d+)-?(\d+)?/);
    if (!match) return repsStr;

    const minReps = parseInt(match[1]);
    const maxReps = match[2] ? parseInt(match[2]) : minReps;

    const newMinReps = Math.ceil(minReps * multiplier);
    const newMaxReps = Math.ceil(maxReps * multiplier);

    return newMaxReps > newMinReps
      ? `${newMinReps}-${newMaxReps}`
      : newMinReps.toString();
  }

  // Get base exercises by session type and phase
  getBaseExercises(sessionType: string, phaseId: string): Exercise[] {
    const baseExercises: Record<string, Exercise[]> = {
      strength: [
        {
          id: 'goblet-squats',
          name: 'Goblet Squats',
          sets: 3,
          reps: '10-12',
          load: '25 lbs',
          instructions: [
            'Hold dumbbell at chest level',
            'Squat down keeping chest up',
            'Drive through heels to stand',
            'Control the descent (3 seconds down)',
          ],
          phase: phaseId,
          difficulty: 'beginner',
          equipment: ['dumbbells'],
          muscleGroups: ['quadriceps', 'glutes', 'core'],
          rpe: 6,
          restTime: 90,
          progression: {
            type: 'linear',
            increment: 5,
            frequency: 2,
          },
        },
        {
          id: 'push-ups',
          name: 'Push-ups',
          sets: 3,
          reps: '8-10',
          instructions: [
            'Start in plank position',
            'Lower chest to floor',
            'Push back to start position',
            'Keep core tight throughout',
          ],
          phase: phaseId,
          difficulty: 'beginner',
          equipment: ['bodyweight'],
          muscleGroups: ['chest', 'shoulders', 'triceps'],
          rpe: 7,
          restTime: 60,
          progression: {
            type: 'linear',
            increment: 1,
            frequency: 1,
          },
        },
        {
          id: 'single-leg-glute-bridges',
          name: 'Single-Leg Glute Bridges',
          sets: 3,
          reps: '8 each leg',
          instructions: [
            'Lie on back, one foot on ground',
            'Lift other leg straight up',
            'Drive through heel to lift hips',
            'Squeeze glutes at the top',
          ],
          phase: phaseId,
          difficulty: 'beginner',
          equipment: ['bodyweight'],
          muscleGroups: ['glutes', 'hamstrings', 'core'],
          rpe: 6,
          restTime: 60,
          progression: {
            type: 'linear',
            increment: 1,
            frequency: 2,
          },
        },
        {
          id: 'plank-hold',
          name: 'Plank Hold',
          sets: 3,
          reps: '30-45 sec',
          instructions: [
            'Start in forearm plank',
            'Keep body in straight line',
            'Breathe normally',
            'Focus on core engagement',
          ],
          phase: phaseId,
          difficulty: 'beginner',
          equipment: ['bodyweight'],
          muscleGroups: ['core', 'shoulders'],
          rpe: 6,
          restTime: 60,
          progression: {
            type: 'linear',
            increment: 5,
            frequency: 1,
          },
        },
      ],
      volleyball: [
        {
          id: 'lateral-jumps',
          name: 'Lateral Jumps',
          sets: 3,
          reps: '10 each side',
          instructions: [
            'Stand with feet shoulder-width apart',
            'Jump laterally to one side',
            'Land softly and immediately jump back',
            'Keep core engaged throughout',
          ],
          phase: phaseId,
          difficulty: 'intermediate',
          equipment: ['bodyweight'],
          muscleGroups: ['legs', 'glutes', 'core'],
          rpe: 7,
          restTime: 60,
          progression: {
            type: 'linear',
            increment: 2,
            frequency: 1,
          },
        },
        {
          id: 'medicine-ball-slams',
          name: 'Medicine Ball Slams',
          sets: 3,
          reps: '8-10',
          load: '8-12 lbs',
          instructions: [
            'Hold medicine ball overhead',
            'Slam ball down with force',
            'Catch ball on bounce',
            'Explode back to starting position',
          ],
          phase: phaseId,
          difficulty: 'intermediate',
          equipment: ['medicine_ball'],
          muscleGroups: ['core', 'shoulders', 'legs'],
          rpe: 8,
          restTime: 90,
          progression: {
            type: 'linear',
            increment: 2,
            frequency: 2,
          },
        },
      ],
      conditioning: [
        {
          id: 'burpees',
          name: 'Burpees',
          sets: 3,
          reps: '8-10',
          instructions: [
            'Start standing',
            'Drop to push-up position',
            'Perform push-up',
            'Jump feet to hands',
            'Jump up with arms overhead',
          ],
          phase: phaseId,
          difficulty: 'intermediate',
          equipment: ['bodyweight'],
          muscleGroups: ['full_body'],
          rpe: 8,
          restTime: 120,
          progression: {
            type: 'linear',
            increment: 1,
            frequency: 2,
          },
        },
      ],
      recovery: [
        {
          id: 'cat-cow-stretch',
          name: 'Cat-Cow Stretch',
          sets: 2,
          reps: '10 reps',
          instructions: [
            'Start on hands and knees',
            'Arch back and look up (cow)',
            'Round back and look down (cat)',
            'Move slowly and controlled',
          ],
          phase: phaseId,
          difficulty: 'beginner',
          equipment: ['bodyweight'],
          muscleGroups: ['spine', 'core'],
          rpe: 3,
          restTime: 30,
          progression: {
            type: 'linear',
            increment: 0,
            frequency: 0,
          },
        },
      ],
    };

    return baseExercises[sessionType] || [];
  }

  // Generate complete session program
  async generateSessionProgram(
    userId: string,
    sessionType: string,

    customizations?: Record<string, any>
  ): Promise<SessionProgram> {
    const context = await this.fetchProgramData(userId);
    const exercises = this.generateExercises(context, sessionType);

    const sessionProgram: SessionProgram = {
      id: `session-${Date.now()}`,
      name: `${sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Training`,
      type: sessionType as any,
      phase: context.currentPhase.currentPhase.id,
      week: context.currentWeek,
      day: this.getCurrentDay(context),
      exercises,
      estimatedDuration: this.calculateEstimatedDuration(exercises),
      intensity: context.currentPhase.currentPhase.intensity,
      volume: context.currentPhase.currentPhase.volume,
      focus: context.currentPhase.currentPhase.focus,
      adaptations: {
        basedOn: 'phase',
        adjustments: {
          intensity: context.currentPhase.intensityAdjustments,
          volume: context.currentPhase.volumeAdjustments,
        },
      },
    };

    return sessionProgram;
  }

  // Get current day of the week

  getCurrentDay(context: SessionContext): number {
    const today = new Date();
    return today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  }

  // Calculate estimated session duration
  calculateEstimatedDuration(exercises: Exercise[]): number {
    let totalTime = 0;

    for (const exercise of exercises) {
      const exerciseTime = (exercise.sets * exercise.restTime) / 60; // Convert to minutes
      totalTime += exerciseTime;
    }

    // Add warm-up and cool-down time
    return Math.ceil(totalTime + 10); // 10 minutes for warm-up/cool-down
  }

  // Save session data with program integration
  async saveSessionWithProgram(
    sessionData: Partial<SessionData>,
    programContext: SessionContext
  ): Promise<SessionData> {
    // Add program context to session data
    const enrichedSessionData = {
      ...sessionData,
      program_phase: programContext.currentPhase.currentPhase.id,
      program_week: programContext.currentWeek,
      adaptations_applied:
        programContext.currentPhase.phaseSpecificRecommendations,
    } as SessionData;

    return await this.databaseService.saveSession(enrichedSessionData);
  }

  // Get session recommendations based on program analysis
  getSessionRecommendations(context: SessionContext): string[] {
    const { currentPhase, recentCheckIns } = context;
    const recommendations: string[] = [];

    // Phase-specific recommendations
    recommendations.push(...currentPhase.phaseSpecificRecommendations);

    // Wellness-based recommendations
    if (recentCheckIns.length > 0) {
      const latestCheckIn = recentCheckIns[0];

      if (latestCheckIn.energy < 5) {
        recommendations.push('Consider reducing intensity due to low energy');
      }

      if (latestCheckIn.soreness > 7) {
        recommendations.push('Focus on recovery and mobility work');
      }

      if (latestCheckIn.mood < 3) {
        recommendations.push('Consider lighter session to boost mood');
      }
    }

    return recommendations;
  }
}

// Export singleton instance
export const sessionProgramIntegration = new SessionProgramIntegration();
