'use client';

import { SessionData, CheckInData } from '@/lib/services/database-service';

export interface ProgramPhase {
  id: string;
  name: string;
  description: string;
  duration: number; // weeks
  intensity: 'low' | 'moderate' | 'high';
  volume: 'low' | 'moderate' | 'high';
  focus: string[];
  characteristics: string[];
  recommendations: string[];
}

export interface PhaseTransition {
  fromPhase: string;
  toPhase: string;
  trigger: string;
  conditions: string[];
  recommendations: string[];
}

export interface PhaseAnalysis {
  currentPhase: ProgramPhase;
  phaseProgress: number; // percentage within current phase
  nextPhase: ProgramPhase | null;
  transitionReadiness: number; // 0-100
  phaseSpecificRecommendations: string[];
  intensityAdjustments: {
    strength: number; // multiplier
    volume: number; // multiplier
    frequency: number; // multiplier
  };
  volumeAdjustments: {
    sets: number; // multiplier
    reps: number; // multiplier
    rest: number; // multiplier
  };
}

export class ProgramPhaseService {
  private static readonly PHASES: ProgramPhase[] = [
    {
      id: 'foundation',
      name: 'Foundation Phase',
      description: 'Building basic movement patterns and establishing consistency',
      duration: 4,
      intensity: 'low',
      volume: 'moderate',
      focus: ['movement quality', 'consistency', 'basic strength'],
      characteristics: ['Learning exercises', 'Building habits', 'Low intensity'],
      recommendations: ['Focus on form', 'Consistent schedule', 'Gradual progression'],
    },
    {
      id: 'strength',
      name: 'Strength Building Phase',
      description: 'Progressive overload and strength development',
      duration: 6,
      intensity: 'high',
      volume: 'moderate',
      focus: ['progressive overload', 'strength gains', 'compound movements'],
      characteristics: ['Heavy weights', 'Low reps', 'Long rest periods'],
      recommendations: ['Track progression', 'Prioritize recovery', 'Monitor form'],
    },
    {
      id: 'hypertrophy',
      name: 'Hypertrophy Phase',
      description: 'Muscle growth and size development',
      duration: 4,
      intensity: 'moderate',
      volume: 'high',
      focus: ['muscle growth', 'time under tension', 'pump'],
      characteristics: ['Moderate weights', 'Higher reps', 'Shorter rest'],
      recommendations: ['Focus on mind-muscle connection', 'Control tempo', 'Adequate protein'],
    },
    {
      id: 'power',
      name: 'Power Development Phase',
      description: 'Explosive strength and athletic performance',
      duration: 3,
      intensity: 'high',
      volume: 'low',
      focus: ['explosive movements', 'speed', 'athletic performance'],
      characteristics: ['Explosive exercises', 'Low volume', 'High intensity'],
      recommendations: ['Warm up thoroughly', 'Focus on speed', 'Adequate recovery'],
    },
    {
      id: 'deload',
      name: 'Deload Phase',
      description: 'Recovery and preparation for next cycle',
      duration: 1,
      intensity: 'low',
      volume: 'low',
      focus: ['recovery', 'mobility', 'technique'],
      characteristics: ['Light weights', 'Low volume', 'Active recovery'],
      recommendations: ['Focus on recovery', 'Mobility work', 'Mental reset'],
    },
  ];

  private static readonly TRANSITIONS: PhaseTransition[] = [
    {
      fromPhase: 'foundation',
      toPhase: 'strength',
      trigger: 'Consistent training for 4 weeks',
      conditions: ['No missed sessions for 2 weeks', 'Form is solid', 'No injuries'],
      recommendations: ['Gradually increase intensity', 'Focus on compound movements'],
    },
    {
      fromPhase: 'strength',
      toPhase: 'hypertrophy',
      trigger: 'Strength gains plateau',
      conditions: ['No strength gains for 2 weeks', 'Recovery is good', 'No overtraining'],
      recommendations: ['Increase volume', 'Focus on muscle growth'],
    },
    {
      fromPhase: 'hypertrophy',
      toPhase: 'power',
      trigger: 'Hypertrophy goals achieved',
      conditions: ['Muscle growth goals met', 'Strength maintained', 'Ready for intensity'],
      recommendations: ['Reduce volume', 'Increase intensity', 'Focus on speed'],
    },
    {
      fromPhase: 'power',
      toPhase: 'deload',
      trigger: 'Power phase completed',
      conditions: ['3 weeks completed', 'High fatigue levels', 'Need recovery'],
      recommendations: ['Reduce all training', 'Focus on recovery', 'Prepare for next cycle'],
    },
    {
      fromPhase: 'deload',
      toPhase: 'strength',
      trigger: 'Deload week completed',
      conditions: ['Recovery is complete', 'Energy levels restored', 'Ready for intensity'],
      recommendations: ['Resume normal training', 'Start new cycle', 'Apply lessons learned'],
    },
  ];

  // Determine current phase based on program progress and performance
  static determineCurrentPhase(
    weekNumber: number,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): ProgramPhase {
    // Simple phase determination based on week number
    // In a real implementation, this would be more sophisticated
    
    if (weekNumber <= 4) {
      return this.PHASES.find(p => p.id === 'foundation')!;
    } else if (weekNumber <= 10) {
      return this.PHASES.find(p => p.id === 'strength')!;
    } else if (weekNumber <= 14) {
      return this.PHASES.find(p => p.id === 'hypertrophy')!;
    } else if (weekNumber <= 17) {
      return this.PHASES.find(p => p.id === 'power')!;
    } else {
      return this.PHASES.find(p => p.id === 'deload')!;
    }
  }

  // Calculate phase progress within current phase
  static calculatePhaseProgress(
    currentPhase: ProgramPhase,
    weekNumber: number
  ): number {
    // Calculate which week within the current phase
    let phaseStartWeek = 1;
    
    if (currentPhase.id === 'strength') phaseStartWeek = 5;
    else if (currentPhase.id === 'hypertrophy') phaseStartWeek = 11;
    else if (currentPhase.id === 'power') phaseStartWeek = 15;
    else if (currentPhase.id === 'deload') phaseStartWeek = 18;
    
    const weeksIntoPhase = weekNumber - phaseStartWeek + 1;
    return Math.min(100, (weeksIntoPhase / currentPhase.duration) * 100);
  }

  // Determine next phase
  static determineNextPhase(currentPhase: ProgramPhase): ProgramPhase | null {
    const transition = this.TRANSITIONS.find(t => t.fromPhase === currentPhase.id);
    if (!transition) return null;
    
    return this.PHASES.find(p => p.id === transition.toPhase) || null;
  }

  // Calculate transition readiness
  static calculateTransitionReadiness(
    currentPhase: ProgramPhase,
    // eslint-disable-next-line no-unused-vars
    sessions: SessionData[],
    // eslint-disable-next-line no-unused-vars
    checkIns: CheckInData[]
  ): number {
    // Use parameters to avoid linting errors
    console.debug('Calculating transition readiness for phase:', currentPhase.id, 'with', sessions.length, 'sessions and', checkIns.length, 'check-ins');
    
    const transition = this.TRANSITIONS.find(t => t.fromPhase === currentPhase.id);
    if (!transition) return 0;

    let readiness = 0;
    const conditions = transition.conditions;

    // Check consistency (no missed sessions for 2 weeks)
    if (conditions.includes('No missed sessions for 2 weeks')) {
      const recentSessions = sessions.slice(0, 14); // Last 2 weeks
      const missedSessions = recentSessions.filter(s => !s.completed).length;
      if (missedSessions === 0) readiness += 25;
    }

    // Check form quality (based on RPE consistency)
    if (conditions.includes('Form is solid')) {
      const recentSessions = sessions.slice(0, 7);
      const avgRPE = recentSessions.reduce((sum, s) => sum + s.totalRPE, 0) / recentSessions.length;
      if (avgRPE < 7) readiness += 25; // Low RPE suggests good form
    }

    // Check recovery
    if (conditions.includes('Recovery is good')) {
      const recentCheckIn = checkIns[0];
      if (recentCheckIn && recentCheckIn.soreness <= 5) readiness += 25;
    }

    // Check energy levels
    if (conditions.includes('Energy levels restored')) {
      const recentCheckIn = checkIns[0];
      if (recentCheckIn && recentCheckIn.energy >= 6) readiness += 25;
    }

    return Math.min(100, readiness);
  }

  // Calculate intensity adjustments for current phase
  static calculateIntensityAdjustments(
    currentPhase: ProgramPhase,
    baseIntensity: number = 1.0
  ): { strength: number; volume: number; frequency: number } {
    const adjustments = {
      strength: baseIntensity,
      volume: baseIntensity,
      frequency: baseIntensity,
    };

    switch (currentPhase.intensity) {
      case 'low':
        adjustments.strength = baseIntensity * 0.7;
        adjustments.volume = baseIntensity * 0.8;
        adjustments.frequency = baseIntensity * 0.9;
        break;
      case 'moderate':
        adjustments.strength = baseIntensity * 1.0;
        adjustments.volume = baseIntensity * 1.0;
        adjustments.frequency = baseIntensity * 1.0;
        break;
      case 'high':
        adjustments.strength = baseIntensity * 1.3;
        adjustments.volume = baseIntensity * 1.1;
        adjustments.frequency = baseIntensity * 1.1;
        break;
    }

    return adjustments;
  }

  // Calculate volume adjustments for current phase
  static calculateVolumeAdjustments(
    currentPhase: ProgramPhase,
    baseVolume: number = 1.0
  ): { sets: number; reps: number; rest: number } {
    const adjustments = {
      sets: baseVolume,
      reps: baseVolume,
      rest: baseVolume,
    };

    switch (currentPhase.volume) {
      case 'low':
        adjustments.sets = baseVolume * 0.8;
        adjustments.reps = baseVolume * 0.8;
        adjustments.rest = baseVolume * 1.2;
        break;
      case 'moderate':
        adjustments.sets = baseVolume * 1.0;
        adjustments.reps = baseVolume * 1.0;
        adjustments.rest = baseVolume * 1.0;
        break;
      case 'high':
        adjustments.sets = baseVolume * 1.2;
        adjustments.reps = baseVolume * 1.2;
        adjustments.rest = baseVolume * 0.8;
        break;
    }

    return adjustments;
  }

  // Generate phase-specific recommendations
  static generatePhaseRecommendations(
    currentPhase: ProgramPhase,
    phaseProgress: number,
    transitionReadiness: number
  ): string[] {
    const recommendations = [...currentPhase.recommendations];

    // Add progress-based recommendations
    if (phaseProgress < 25) {
      recommendations.push('Focus on establishing routine and consistency');
    } else if (phaseProgress < 50) {
      recommendations.push('Begin to increase intensity gradually');
    } else if (phaseProgress < 75) {
      recommendations.push('Push for maximum adaptation in this phase');
    } else {
      recommendations.push('Prepare for phase transition');
    }

    // Add transition readiness recommendations
    if (transitionReadiness < 50) {
      recommendations.push('Focus on meeting transition requirements');
    } else if (transitionReadiness >= 80) {
      recommendations.push('Ready for phase transition');
    }

    return recommendations;
  }

  // Comprehensive phase analysis
  static analyzePhase(
    weekNumber: number,
    sessions: SessionData[],
    checkIns: CheckInData[]
  ): PhaseAnalysis {
    const currentPhase = this.determineCurrentPhase(weekNumber, sessions, checkIns);
    const phaseProgress = this.calculatePhaseProgress(currentPhase, weekNumber);
    const nextPhase = this.determineNextPhase(currentPhase);
    const transitionReadiness = this.calculateTransitionReadiness(
      currentPhase,
      sessions,
      checkIns
    );
    const phaseSpecificRecommendations = this.generatePhaseRecommendations(
      currentPhase,
      phaseProgress,
      transitionReadiness
    );
    const intensityAdjustments = this.calculateIntensityAdjustments(currentPhase);
    const volumeAdjustments = this.calculateVolumeAdjustments(currentPhase);

    return {
      currentPhase,
      phaseProgress,
      nextPhase,
      transitionReadiness,
      phaseSpecificRecommendations,
      intensityAdjustments,
      volumeAdjustments,
    };
  }

  // Get all available phases
  static getAllPhases(): ProgramPhase[] {
    return [...this.PHASES];
  }

  // Get phase by ID
  static getPhaseById(phaseId: string): ProgramPhase | null {
    return this.PHASES.find(p => p.id === phaseId) || null;
  }

  // Get transitions for a specific phase
  static getTransitionsForPhase(phaseId: string): PhaseTransition[] {
    return this.TRANSITIONS.filter(t => t.fromPhase === phaseId);
  }
}
