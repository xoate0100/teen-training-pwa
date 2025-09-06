'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  databaseService,
  SessionData,
  CheckInData,
  ProgressMetrics,
} from '@/lib/services/database-service';
import { useUser } from '@/lib/contexts/user-context';
import { toast } from 'sonner';

export function useDatabase() {
  const { currentUser } = useUser();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setError(null);

      const [sessionsData, checkInsData, metricsData] = await Promise.all([
        databaseService.getSessions(currentUser.id),
        databaseService.getCheckIns(currentUser.id),
        databaseService.getProgressMetrics(currentUser.id),
      ]);

      setSessions(sessionsData);
      setCheckIns(checkInsData);
      setProgressMetrics(metricsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Load data on mount and when user changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!currentUser) return;

    const sessionsSubscription = databaseService.subscribeToSessions(
      newSessions => setSessions(newSessions),
      currentUser.id
    );

    const checkInsSubscription = databaseService.subscribeToCheckIns(
      newCheckIns => setCheckIns(newCheckIns),
      currentUser.id
    );

    return () => {
      sessionsSubscription?.unsubscribe();
      checkInsSubscription?.unsubscribe();
    };
  }, [currentUser]);

  // Session operations
  const saveSession = useCallback(
    async (session: Omit<SessionData, 'user_id'>) => {
      try {
        const savedSession = await databaseService.saveSession(session);
        setSessions(prev => {
          const existingIndex = prev.findIndex(s => s.id === savedSession.id);
          if (existingIndex >= 0) {
            const newSessions = [...prev];
            newSessions[existingIndex] = savedSession;
            return newSessions;
          }
          return [savedSession, ...prev];
        });
        toast.success('Session saved successfully');
        return savedSession;
      } catch (err) {
        console.error('Error saving session:', err);
        toast.error('Failed to save session');
        throw err;
      }
    },
    []
  );

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await databaseService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast.success('Session deleted successfully');
    } catch (err) {
      console.error('Error deleting session:', err);
      toast.error('Failed to delete session');
      throw err;
    }
  }, []);

  // Check-in operations
  const saveCheckIn = useCallback(
    async (checkIn: Omit<CheckInData, 'user_id'>) => {
      try {
        const savedCheckIn = await databaseService.saveCheckIn(checkIn);
        setCheckIns(prev => {
          const existingIndex = prev.findIndex(
            c => c.date === savedCheckIn.date
          );
          if (existingIndex >= 0) {
            const newCheckIns = [...prev];
            newCheckIns[existingIndex] = savedCheckIn;
            return newCheckIns;
          }
          return [savedCheckIn, ...prev];
        });
        toast.success('Check-in saved successfully');
        return savedCheckIn;
      } catch (err) {
        console.error('Error saving check-in:', err);
        toast.error('Failed to save check-in');
        throw err;
      }
    },
    []
  );

  // Progress metrics operations
  const saveProgressMetric = useCallback(
    async (metric: Omit<ProgressMetrics, 'user_id'>) => {
      try {
        const savedMetric = await databaseService.saveProgressMetric(metric);
        setProgressMetrics(prev => {
          const existingIndex = prev.findIndex(m => m.id === savedMetric.id);
          if (existingIndex >= 0) {
            const newMetrics = [...prev];
            newMetrics[existingIndex] = savedMetric;
            return newMetrics;
          }
          return [savedMetric, ...prev];
        });
        toast.success('Progress metric saved successfully');
        return savedMetric;
      } catch (err) {
        console.error('Error saving progress metric:', err);
        toast.error('Failed to save progress metric');
        throw err;
      }
    },
    []
  );

  // Data migration
  const migrateFromLocalStorage = useCallback(async () => {
    try {
      await databaseService.migrateFromLocalStorage();
      await loadData();
      toast.success('Data migrated successfully');
    } catch (err) {
      console.error('Error migrating data:', err);
      toast.error('Failed to migrate data');
      throw err;
    }
  }, [loadData]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    // Data
    sessions,
    checkIns,
    progressMetrics,
    isLoading,
    error,

    // Session operations
    saveSession,
    deleteSession,

    // Check-in operations
    saveCheckIn,

    // Progress metrics operations
    saveProgressMetric,

    // Utility operations
    migrateFromLocalStorage,
    refreshData,
  };
}
