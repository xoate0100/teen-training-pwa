'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDatabase } from './use-database';
import { useUser } from '@/lib/contexts/user-context';
import {
  WeekCalculationService,
  WeekCalculation,
  SessionRecommendation,
  ProgramConfig,
} from '@/lib/services/week-calculation-service';

export function useWeekCalculation() {
  const { currentUser } = useUser();
  const { sessions, checkIns } = useDatabase();
  const [weekCalculation, setWeekCalculation] =
    useState<WeekCalculation | null>(null);
  const [sessionRecommendation, setSessionRecommendation] =
    useState<SessionRecommendation | null>(null);
  const [programConfig, setProgramConfig] = useState<ProgramConfig | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load program configuration
  const loadProgramConfig = useCallback(async () => {
    if (!currentUser) return;

    try {
      const config = WeekCalculationService.getProgramConfig(currentUser.id);
      setProgramConfig(config);
    } catch (err) {
      console.error('Error loading program config:', err);
      setError('Failed to load program configuration');
    }
  }, [currentUser]);

  // Calculate current week and generate recommendations
  const calculateWeek = useCallback(async () => {
    if (!currentUser || !programConfig) return;

    try {
      setIsLoading(true);
      setError(null);

      // Calculate week information
      const calculation = WeekCalculationService.calculateWeek(
        programConfig.startDate,
        sessions,
        checkIns,
        programConfig
      );

      setWeekCalculation(calculation);

      // Generate session recommendation
      const recommendation =
        WeekCalculationService.generateSessionRecommendation(
          calculation,
          checkIns,
          sessions
        );

      setSessionRecommendation(recommendation);
    } catch (err) {
      console.error('Error calculating week:', err);
      setError('Failed to calculate week information');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, programConfig, sessions, checkIns]);

  // Update program configuration
  const updateProgramConfig = useCallback(
    async (newConfig: Partial<ProgramConfig>) => {
      if (!currentUser) return;

      try {
        const updatedConfig = WeekCalculationService.updateProgramConfig(
          currentUser.id,
          newConfig
        );
        setProgramConfig(updatedConfig);

        // Recalculate week with new config
        await calculateWeek();
      } catch (err) {
        console.error('Error updating program config:', err);
        setError('Failed to update program configuration');
      }
    },
    [currentUser, calculateWeek]
  );

  // Get next session date
  const getNextSessionDate = useCallback((): string | null => {
    if (!weekCalculation) return null;
    return weekCalculation.nextSessionDate;
  }, [weekCalculation]);

  // Check if today is a training day
  const isTrainingDay = useCallback((): boolean => {
    if (!weekCalculation) return false;
    return (
      !weekCalculation.isRestDay && weekCalculation.sessionsThisWeek.length < 3
    );
  }, [weekCalculation]);

  // Get missed sessions count
  const getMissedSessions = useCallback((): number => {
    if (!weekCalculation) return 0;
    return weekCalculation.missedSessions;
  }, [weekCalculation]);

  // Get program progress percentage
  const getProgramProgress = useCallback((): number => {
    if (!weekCalculation) return 0;
    return weekCalculation.programProgress;
  }, [weekCalculation]);

  // Check if current week is deload week
  const isDeloadWeek = useCallback((): boolean => {
    if (!weekCalculation) return false;
    return weekCalculation.isDeloadWeek;
  }, [weekCalculation]);

  // Get recommended intensity
  const getRecommendedIntensity = useCallback(():
    | 'low'
    | 'moderate'
    | 'high' => {
    if (!weekCalculation) return 'moderate';
    return weekCalculation.recommendedIntensity;
  }, [weekCalculation]);

  // Get sessions for current week
  const getSessionsThisWeek = useCallback(() => {
    if (!weekCalculation) return [];
    return weekCalculation.sessionsThisWeek;
  }, [weekCalculation]);

  // Get week start and end dates
  const getWeekDates = useCallback(() => {
    if (!weekCalculation) return { startDate: '', endDate: '' };
    return {
      startDate: weekCalculation.weekStartDate,
      endDate: weekCalculation.weekEndDate,
    };
  }, [weekCalculation]);

  // Get current week and day numbers
  const getCurrentWeekInfo = useCallback(() => {
    if (!weekCalculation) return { week: 0, day: 0 };
    return {
      week: weekCalculation.currentWeek,
      day: weekCalculation.currentDay,
    };
  }, [weekCalculation]);

  // Refresh calculations
  const refreshCalculations = useCallback(async () => {
    await calculateWeek();
  }, [calculateWeek]);

  // Load initial data
  useEffect(() => {
    loadProgramConfig();
  }, [loadProgramConfig]);

  // Calculate week when data changes
  useEffect(() => {
    if (programConfig) {
      calculateWeek();
    }
  }, [programConfig, calculateWeek]);

  return {
    // Data
    weekCalculation,
    sessionRecommendation,
    programConfig,
    isLoading,
    error,

    // Actions
    updateProgramConfig,
    refreshCalculations,

    // Getters
    getNextSessionDate,
    isTrainingDay,
    getMissedSessions,
    getProgramProgress,
    isDeloadWeek,
    getRecommendedIntensity,
    getSessionsThisWeek,
    getWeekDates,
    getCurrentWeekInfo,
  };
}
