'use client';

import { useState, useEffect, useCallback } from 'react';
import { offlineFirstService } from '@/lib/services/offline-first-service';
import {
  OfflineCache,
  PendingChange,
  SyncStrategy,
} from '@/lib/services/offline-first-service';

export interface UseOfflineFirstReturn {
  // Cache status
  cache: OfflineCache;
  isOnline: boolean;
  pendingChangesCount: number;

  // Cache actions
  cacheSessionData: (session: any) => Promise<void>;
  cacheCheckInData: (checkIn: any) => void;
  getCachedSessions: () => any[];
  getCachedCheckIns: () => any[];
  clearCache: () => void;

  // Sync actions
  forceSync: () => Promise<void>;
  syncPendingChanges: () => Promise<void>;

  // Sync strategy
  setSyncStrategy: (strategy: Partial<SyncStrategy>) => void;

  // Event handlers
  onOnline: (callback: () => void) => void;
  onOffline: (callback: () => void) => void;
  onPendingChangeAdded: (callback: (change: PendingChange) => void) => void;
  onSyncError: (callback: (error: any) => void) => void;
  onCacheCleared: (callback: () => void) => void;
}

export function useOfflineFirst(): UseOfflineFirstReturn {
  const [cache, setCache] = useState<OfflineCache>(
    offlineFirstService.getCacheStatus()
  );
  const [isOnline, setIsOnline] = useState<boolean>(
    offlineFirstService.isOnlineStatus()
  );
  const [pendingChangesCount, setPendingChangesCount] = useState<number>(
    offlineFirstService.getPendingChangesCount()
  );

  // Update cache status periodically
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      setCache(offlineFirstService.getCacheStatus());
      setIsOnline(offlineFirstService.isOnlineStatus());
      setPendingChangesCount(offlineFirstService.getPendingChangesCount());
    }, 5000); // Update every 5 seconds

    // eslint-disable-next-line no-undef
    return () => clearInterval(interval);
  }, []);

  // Cache session data
  const cacheSessionData = useCallback(async (session: any) => {
    await offlineFirstService.cacheSessionData(session);
    setCache(offlineFirstService.getCacheStatus());
  }, []);

  // Cache check-in data
  const cacheCheckInData = useCallback((checkIn: any) => {
    offlineFirstService.cacheCheckInData(checkIn);
    setCache(offlineFirstService.getCacheStatus());
  }, []);

  // Get cached sessions
  const getCachedSessions = useCallback(() => {
    return offlineFirstService.getCachedSessions();
  }, []);

  // Get cached check-ins
  const getCachedCheckIns = useCallback(() => {
    return offlineFirstService.getCachedCheckIns();
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    offlineFirstService.clearCache();
    setCache(offlineFirstService.getCacheStatus());
  }, []);

  // Force sync
  const forceSync = useCallback(async () => {
    await offlineFirstService.forceSync();
    setCache(offlineFirstService.getCacheStatus());
  }, []);

  // Sync pending changes
  const syncPendingChanges = useCallback(async () => {
    await offlineFirstService.syncPendingChanges();
    setCache(offlineFirstService.getCacheStatus());
  }, []);

  // Set sync strategy
  const setSyncStrategy = useCallback((strategy: Partial<SyncStrategy>) => {
    offlineFirstService.setSyncStrategy(strategy);
  }, []);

  // Event handlers
  const onOnline = useCallback((callback: () => void) => {
    offlineFirstService.on('online', callback);
  }, []);

  const onOffline = useCallback((callback: () => void) => {
    offlineFirstService.on('offline', callback);
  }, []);

  const onPendingChangeAdded = useCallback(
    (callback: (change: PendingChange) => void) => {
      offlineFirstService.on('pendingChangeAdded', callback);
    },
    []
  );

  const onSyncError = useCallback((callback: (error: any) => void) => {
    offlineFirstService.on('syncError', callback);
  }, []);

  const onCacheCleared = useCallback((callback: () => void) => {
    offlineFirstService.on('cacheCleared', callback);
  }, []);

  return {
    cache,
    isOnline,
    pendingChangesCount,
    cacheSessionData,
    cacheCheckInData,
    getCachedSessions,
    getCachedCheckIns,
    clearCache,
    forceSync,
    syncPendingChanges,
    setSyncStrategy,
    onOnline,
    onOffline,
    onPendingChangeAdded,
    onSyncError,
    onCacheCleared,
  };
}
