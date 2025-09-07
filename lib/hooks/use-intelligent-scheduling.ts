'use client';

import { useState, useEffect, useCallback } from 'react';
import { intelligentSessionManager } from '@/lib/services/intelligent-session-manager';
import { AutomaticSchedule, ConflictResolution, MissedSessionRecovery } from '@/lib/services/session-scheduling-service';

export interface UseIntelligentSchedulingReturn {
  // Schedule data
  currentWeekSchedule: AutomaticSchedule | null;
  nextWeekSchedule: AutomaticSchedule | null;
  missedSessions: MissedSessionRecovery[];
  timingRecommendations: any;
  conflicts: ConflictResolution[];

  // Loading states
  isLoading: boolean;
  isGeneratingSchedule: boolean;
  isResolvingConflicts: boolean;
  isHandlingMissedSessions: boolean;

  // Error states
  error: string | null;

  // Actions
  // eslint-disable-next-line no-unused-vars
  generateWeeklySchedule: (weekStart: string, userPreferences?: any) => Promise<void>;
  resolveConflicts: () => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  handleMissedSessions: (missedSessionIds: string[]) => Promise<void>;
  applyResolutions: () => Promise<void>;
  saveSchedule: () => Promise<void>;
  refreshDashboard: () => Promise<void>;

  // Schedule management
  // eslint-disable-next-line no-unused-vars
  updateSession: (sessionId: string, updates: Partial<any>) => void;
  // eslint-disable-next-line no-unused-vars
  removeSession: (sessionId: string) => void;
  // eslint-disable-next-line no-unused-vars
  addSession: (session: any) => void;
}

export function useIntelligentScheduling(userId: string): UseIntelligentSchedulingReturn {
  // State
  const [currentWeekSchedule, setCurrentWeekSchedule] = useState<AutomaticSchedule | null>(null);
  const [nextWeekSchedule, setNextWeekSchedule] = useState<AutomaticSchedule | null>(null);
  const [missedSessions, setMissedSessions] = useState<MissedSessionRecovery[]>([]);
  const [timingRecommendations, setTimingRecommendations] = useState<any>(null);
  const [conflicts, setConflicts] = useState<ConflictResolution[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [isResolvingConflicts, setIsResolvingConflicts] = useState(false);
  const [isHandlingMissedSessions, setIsHandlingMissedSessions] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data on mount
  useEffect(() => {
    if (userId) {
      refreshDashboard();
    }
  }, [userId, refreshDashboard]);

  // Refresh dashboard data
  const refreshDashboard = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const dashboardData = await intelligentSessionManager.getSessionManagementDashboard(userId);
      
      setCurrentWeekSchedule(dashboardData.currentWeekSchedule);
      setNextWeekSchedule(dashboardData.nextWeekSchedule);
      setMissedSessions(dashboardData.missedSessions);
      setTimingRecommendations(dashboardData.timingRecommendations);
      setConflicts(dashboardData.conflicts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Generate weekly schedule
  // eslint-disable-next-line no-unused-vars
  const generateWeeklySchedule = useCallback(async (weekStart: string, userPreferences?: any) => {
    if (!userId) return;

    setIsGeneratingSchedule(true);
    setError(null);

    try {
      const schedule = await intelligentSessionManager.generateWeeklySchedule(
        userId,
        weekStart,
        userPreferences
      );

      // Determine if this is current week or next week
      const today = new Date();
      const weekStartDate = new Date(weekStart);
      const isCurrentWeek = weekStartDate <= today && today <= new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000);

      if (isCurrentWeek) {
        setCurrentWeekSchedule(schedule);
      } else {
        setNextWeekSchedule(schedule);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate weekly schedule');
    } finally {
      setIsGeneratingSchedule(false);
    }
  }, [userId]);

  // Resolve conflicts
  const resolveConflicts = useCallback(async () => {
    if (!currentWeekSchedule || !userId) return;

    setIsResolvingConflicts(true);
    setError(null);

    try {
      const resolutions = await intelligentSessionManager.resolveScheduleConflicts(
        currentWeekSchedule,
        userId
      );
      setConflicts(resolutions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve conflicts');
    } finally {
      setIsResolvingConflicts(false);
    }
  }, [currentWeekSchedule, userId]);

  // Handle missed sessions
  const handleMissedSessions = useCallback(async (missedSessionIds: string[]) => {
    if (!userId) return;

    setIsHandlingMissedSessions(true);
    setError(null);

    try {
      const recoveries = await intelligentSessionManager.handleMissedSessions(
        userId,
        missedSessionIds
      );
      setMissedSessions(prev => [...prev, ...recoveries]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to handle missed sessions');
    } finally {
      setIsHandlingMissedSessions(false);
    }
  }, [userId]);

  // Apply conflict resolutions
  const applyResolutions = useCallback(async () => {
    if (!currentWeekSchedule || conflicts.length === 0) return;

    try {
      const updatedSchedule = await intelligentSessionManager.applyConflictResolutions(
        currentWeekSchedule,
        conflicts
      );
      setCurrentWeekSchedule(updatedSchedule);
      setConflicts([]); // Clear resolved conflicts
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply resolutions');
    }
  }, [currentWeekSchedule, conflicts]);

  // Save schedule to database
  const saveSchedule = useCallback(async () => {
    if (!currentWeekSchedule || !userId) return;

    try {
      await intelligentSessionManager.saveResolvedSchedule(currentWeekSchedule, userId);
      // Refresh dashboard after saving
      await refreshDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save schedule');
    }
  }, [currentWeekSchedule, userId, refreshDashboard]);

  // Update session in current schedule
  // eslint-disable-next-line no-unused-vars
  const updateSession = useCallback((sessionId: string, updates: Partial<any>) => {
    if (!currentWeekSchedule) return;

    setCurrentWeekSchedule(prev => {
      if (!prev) return null;

      const updatedSessions = prev.sessions.map(session =>
        session.id === sessionId ? { ...session, ...updates } : session
      );

      return {
        ...prev,
        sessions: updatedSessions,
      };
    });
  }, [currentWeekSchedule]);

  // Remove session from current schedule
  // eslint-disable-next-line no-unused-vars
  const removeSession = useCallback((sessionId: string) => {
    if (!currentWeekSchedule) return;

    setCurrentWeekSchedule(prev => {
      if (!prev) return null;

      const updatedSessions = prev.sessions.filter(session => session.id !== sessionId);

      return {
        ...prev,
        sessions: updatedSessions,
      };
    });
  }, [currentWeekSchedule]);

  // Add session to current schedule
  // eslint-disable-next-line no-unused-vars
  const addSession = useCallback((session: any) => {
    if (!currentWeekSchedule) return;

    setCurrentWeekSchedule(prev => {
      if (!prev) return null;

      return {
        ...prev,
        sessions: [...prev.sessions, session],
      };
    });
  }, [currentWeekSchedule]);

  return {
    // Schedule data
    currentWeekSchedule,
    nextWeekSchedule,
    missedSessions,
    timingRecommendations,
    conflicts,

    // Loading states
    isLoading,
    isGeneratingSchedule,
    isResolvingConflicts,
    isHandlingMissedSessions,

    // Error state
    error,

    // Actions
    generateWeeklySchedule,
    resolveConflicts,
    handleMissedSessions,
    applyResolutions,
    saveSchedule,
    refreshDashboard,

    // Schedule management
    updateSession,
    removeSession,
    addSession,
  };
}
