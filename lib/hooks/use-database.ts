'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  databaseService,
  SessionData,
  CheckInData,
  ProgressMetrics,
  Achievement,
  Notification,
} from '@/lib/services/database-service';
import { useUser } from '@/lib/contexts/user-context';
import { toast } from 'sonner';

export function useDatabase() {
  const { currentUser } = useUser();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setError(null);

      const [
        sessionsData,
        checkInsData,
        metricsData,
        achievementsData,
        notificationsData,
      ] = await Promise.all([
        databaseService.getSessions(currentUser.id),
        databaseService.getCheckIns(currentUser.id),
        databaseService.getProgressMetrics(currentUser.id),
        databaseService.getAchievements(currentUser.id),
        databaseService.getNotifications(currentUser.id),
      ]);

      setSessions(sessionsData);
      setCheckIns(checkInsData);
      setProgressMetrics(metricsData);
      setAchievements(achievementsData);
      setNotifications(notificationsData);
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

    const achievementsSubscription = databaseService.subscribeToAchievements(
      newAchievements => setAchievements(newAchievements),
      currentUser.id
    );

    const notificationsSubscription = databaseService.subscribeToNotifications(
      newNotifications => setNotifications(newNotifications),
      currentUser.id
    );

    const progressMetricsSubscription =
      databaseService.subscribeToProgressMetrics(
        newMetrics => setProgressMetrics(newMetrics),
        currentUser.id
      );

    return () => {
      sessionsSubscription?.unsubscribe();
      checkInsSubscription?.unsubscribe();
      achievementsSubscription?.unsubscribe();
      notificationsSubscription?.unsubscribe();
      progressMetricsSubscription?.unsubscribe();
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

  // Achievement operations
  const saveAchievement = useCallback(
    async (achievement: Omit<Achievement, 'user_id'>) => {
      try {
        const savedAchievement =
          await databaseService.saveAchievement(achievement);
        setAchievements(prev => {
          const existingIndex = prev.findIndex(
            a => a.id === savedAchievement.id
          );
          if (existingIndex >= 0) {
            const newAchievements = [...prev];
            newAchievements[existingIndex] = savedAchievement;
            return newAchievements;
          }
          return [savedAchievement, ...prev];
        });
        toast.success('Achievement unlocked! 🎉');
        return savedAchievement;
      } catch (err) {
        console.error('Error saving achievement:', err);
        toast.error('Failed to save achievement');
        throw err;
      }
    },
    []
  );

  // Notification operations
  const createNotification = useCallback(
    async (notification: Omit<Notification, 'user_id'>) => {
      try {
        const savedNotification =
          await databaseService.createNotification(notification);
        setNotifications(prev => [savedNotification, ...prev]);
        return savedNotification;
      } catch (err) {
        console.error('Error creating notification:', err);
        toast.error('Failed to create notification');
        throw err;
      }
    },
    []
  );

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await databaseService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to mark notification as read');
      throw err;
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await databaseService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to mark all notifications as read');
      throw err;
    }
  }, []);

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
    achievements,
    notifications,
    isLoading,
    error,

    // Session operations
    saveSession,
    deleteSession,

    // Check-in operations
    saveCheckIn,

    // Progress metrics operations
    saveProgressMetric,

    // Achievement operations
    saveAchievement,

    // Notification operations
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,

    // Utility operations
    migrateFromLocalStorage,
    refreshData,
  };
}
