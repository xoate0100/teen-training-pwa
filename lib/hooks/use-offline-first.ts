'use client';

import { useState, useEffect, useCallback } from 'react';
import { offlineFirstService } from '@/lib/services/offline-first-service';
import { OfflineCache, PendingChange, SyncStrategy } from '@/lib/services/offline-first-service';

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
  onOnline: (callback: () => void) => void; // eslint-disable-next-line no-unused-vars
  onOffline: (callback: () => void) => void; // eslint-disable-next-line no-unused-vars
  onPendingChangeAdded: (callback: (change: PendingChange) => void) => void; // eslint-disable-next-line no-unused-vars
  onSyncError: (callback: (error: any) => void) => void; // eslint-disable-next-line no-unused-vars
  onCacheCleared: (callback: () => void) => void; // eslint-disable-next-line no-unused-vars
}

export function useOfflineFirst(): UseOfflineFirstReturn {
  const [cache, setCache] = useState<OfflineCache>(offlineFirstService.getCacheStatus());
  const [isOnline, setIsOnline] = useState<boolean>(offlineFirstService.isOnlineStatus());
  const [pendingChangesCount, setPendingChangesCount] = useState<number>(offlineFirstService.getPendingChangesCount());

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
  const cacheSessionData = useCallback(async (session: any) => { // eslint-disable-next-line no-unused-vars
    await offlineFirstService.cacheSessionData(session);
    setCache(offlineFirstService.getCacheStatus());
  }, []);

  // Cache check-in data
  const cacheCheckInData = useCallback((checkIn: any) => { // eslint-disable-next-line no-unused-vars
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
  const setSyncStrategy = useCallback((strategy: Partial<SyncStrategy>) => { // eslint-disable-next-line no-unused-vars
    offlineFirstService.setSyncStrategy(strategy);
  }, []);

  // Event handlers
  const onOnline = useCallback((callback: () => void) => { // eslint-disable-next-line no-unused-vars
    offlineFirstService.on('online', callback);
  }, []);

  const onOffline = useCallback((callback: () => void) => { // eslint-disable-next-line no-unused-vars
    offlineFirstService.on('offline', callback);
  }, []);

  const onPendingChangeAdded = useCallback((callback: (change: PendingChange) => void) => { // eslint-disable-next-line no-unused-vars
    offlineFirstService.on('pendingChangeAdded', callback);
  }, []);

  const onSyncError = useCallback((callback: (error: any) => void) => { // eslint-disable-next-line no-unused-vars
    offlineFirstService.on('syncError', callback);
  }, []);

  const onCacheCleared = useCallback((callback: () => void) => { // eslint-disable-next-line no-unused-vars
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
