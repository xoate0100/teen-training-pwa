'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from './use-database';
import { useUser } from '@/lib/contexts/user-context';
import { useWeekCalculation } from './use-week-calculation';
import {
  SessionSchedulingService,
  SessionSchedule,
  OptimalTiming,
  RecoveryRecommendation,
} from '@/lib/services/session-scheduling-service';
import {
  ProgramPhaseService,
  PhaseAnalysis,
} from '@/lib/services/program-phase-service';

export function useSmartScheduling() {
  const { currentUser } = useUser();
  const { sessions, checkIns } = useDatabase();
  const { weekCalculation, getCurrentWeekInfo } = useWeekCalculation();

  const [nextSession, setNextSession] = useState<SessionSchedule | null>(null);
  const [optimalTiming, setOptimalTiming] = useState<OptimalTiming | null>(
    null
  );
  const [recoveryRecommendation, setRecoveryRecommendation] =
    useState<RecoveryRecommendation | null>(null);
  const [phaseAnalysis, setPhaseAnalysis] = useState<PhaseAnalysis | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate next session recommendation
  const calculateNextSession = useCallback(async () => {
    if (!currentUser || !weekCalculation) return;

    try {
      setIsLoading(true);
      setError(null);

      const nextSessionRec = SessionSchedulingService.predictNextSession(
        new Date().toISOString().split('T')[0],
        sessions,
        checkIns
      );

      setNextSession(nextSessionRec);

      // Calculate optimal timing for next session
      if (nextSessionRec) {
        const timing = SessionSchedulingService.calculateOptimalTiming(
          nextSessionRec.date,
          checkIns,
          sessions
        );
        setOptimalTiming(timing);
      }

      // Generate recovery recommendation
      const recovery = SessionSchedulingService.generateRecoveryRecommendation(
        checkIns,
        sessions
      );
      setRecoveryRecommendation(recovery);
    } catch (err) {
      console.error('Error calculating next session:', err);
      setError('Failed to calculate next session');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, weekCalculation, sessions, checkIns]);

  // Analyze current program phase
  const analyzePhase = useCallback(async () => {
    if (!weekCalculation) return;

    try {
      const weekInfo = getCurrentWeekInfo();
      const analysis = ProgramPhaseService.analyzePhase(
        weekInfo.week,
        sessions,
        checkIns
      );
      setPhaseAnalysis(analysis);
    } catch (err) {
      console.error('Error analyzing phase:', err);
      setError('Failed to analyze program phase');
    }
  }, [weekCalculation, sessions, checkIns, getCurrentWeekInfo]);

  // Get session recommendations for the week
  const getWeeklyRecommendations = useCallback((): SessionSchedule[] => {
    if (!weekCalculation) return [];

    const recommendations: SessionSchedule[] = [];
    const weekStart = new Date(weekCalculation.weekStartDate);
    const weekEnd = new Date(weekCalculation.weekEndDate);

    // Generate recommendations for each day of the week
    for (
      let d = new Date(weekStart);
      d <= weekEnd;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split('T')[0];
      const sessionRec = SessionSchedulingService.predictNextSession(
        dateStr,
        sessions,
        checkIns
      );

      if (sessionRec) {
        recommendations.push(sessionRec);
      }
    }

    return recommendations;
  }, [weekCalculation, sessions, checkIns]);

  // Check if today is optimal for training
  const isOptimalTrainingDay = useCallback((): boolean => {
    if (!nextSession || !recoveryRecommendation) return false;

    const today = new Date().toISOString().split('T')[0];
    return (
      nextSession.date === today &&
      !recoveryRecommendation.shouldRest &&
      nextSession.conflicts.length === 0
    );
  }, [nextSession, recoveryRecommendation]);

  // Get training readiness score
  const getTrainingReadiness = useCallback((): number => {
    if (!recoveryRecommendation || !nextSession) return 0;

    let score = 100;

    // Reduce score based on recovery factors
    if (recoveryRecommendation.shouldRest) {
      score -= 50;
    }

    // Reduce score based on conflicts
    if (nextSession.conflicts.length > 0) {
      const highSeverityConflicts = nextSession.conflicts.filter(
        c => c.severity === 'high'
      ).length;
      const mediumSeverityConflicts = nextSession.conflicts.filter(
        c => c.severity === 'medium'
      ).length;

      score -= highSeverityConflicts * 30;
      score -= mediumSeverityConflicts * 15;
    }

    // Reduce score based on energy levels
    const recentCheckIn = checkIns[0];
    if (recentCheckIn) {
      if (recentCheckIn.energy <= 3) score -= 40;
      else if (recentCheckIn.energy <= 5) score -= 20;
      else if (recentCheckIn.energy >= 8) score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }, [recoveryRecommendation, nextSession, checkIns]);

  // Get intensity recommendations
  const getIntensityRecommendations = useCallback(() => {
    if (!phaseAnalysis || !nextSession) return null;

    return {
      recommended: nextSession.intensity,
      phaseAdjustment: phaseAnalysis.intensityAdjustments,
      volumeAdjustment: phaseAnalysis.volumeAdjustments,
      phaseSpecific: phaseAnalysis.currentPhase.intensity,
    };
  }, [phaseAnalysis, nextSession]);

  // Get focus areas for next session
  const getSessionFocus = useCallback((): string[] => {
    if (!phaseAnalysis || !nextSession) return [];

    const phaseFocus = phaseAnalysis.currentPhase.focus;
    const sessionTypeFocus = {
      strength: ['compound movements', 'progressive overload'],
      volleyball: ['skills', 'agility', 'coordination'],
      conditioning: ['cardiovascular fitness', 'endurance'],
      rest: ['recovery', 'mobility'],
    };

    return [...phaseFocus, ...(sessionTypeFocus[nextSession.type] || [])];
  }, [phaseAnalysis, nextSession]);

  // Get warnings and alerts
  const getWarnings = useCallback((): string[] => {
    const warnings: string[] = [];

    if (recoveryRecommendation?.shouldRest) {
      warnings.push(`Rest recommended: ${recoveryRecommendation.reason}`);
    }

    if (nextSession?.conflicts.length > 0) {
      nextSession.conflicts.forEach(conflict => {
        warnings.push(`${conflict.type}: ${conflict.description}`);
      });
    }

    if (phaseAnalysis?.transitionReadiness >= 80) {
      warnings.push('Ready for phase transition');
    }

    return warnings;
  }, [recoveryRecommendation, nextSession, phaseAnalysis]);

  // Refresh all calculations
  const refreshAll = useCallback(async () => {
    await Promise.all([calculateNextSession(), analyzePhase()]);
  }, [calculateNextSession, analyzePhase]);

  // Load initial data
  useEffect(() => {
    if (weekCalculation) {
      refreshAll();
    }
  }, [weekCalculation, refreshAll]);

  return {
    // Data
    nextSession,
    optimalTiming,
    recoveryRecommendation,
    phaseAnalysis,
    isLoading,
    error,

    // Actions
    refreshAll,
    getWeeklyRecommendations,

    // Getters
    isOptimalTrainingDay,
    getTrainingReadiness,
    getIntensityRecommendations,
    getSessionFocus,
    getWarnings,

    // Computed values
    weeklyRecommendations: getWeeklyRecommendations(),
    trainingReadiness: getTrainingReadiness(),
    intensityRecommendations: getIntensityRecommendations(),
    sessionFocus: getSessionFocus(),
    warnings: getWarnings(),
  };
}
