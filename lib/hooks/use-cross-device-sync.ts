'use client';

import { useState, useEffect, useCallback } from 'react';
import { crossDeviceSync } from '@/lib/services/cross-device-sync';
import { SyncStatus, DeviceInfo } from '@/lib/services/cross-device-sync';

export interface UseCrossDeviceSyncReturn {
  // Sync status
  syncStatus: SyncStatus;
  deviceInfo: DeviceInfo;

  // Sync actions
  syncNow: () => Promise<void>;
  forceSync: () => Promise<void>;
  clearConflicts: () => void;

  // Event handlers

  onSyncStart: (callback: () => void) => void;

  onSyncComplete: (callback: (status: SyncStatus) => void) => void;

  onSyncError: (callback: (error: Error) => void) => void;

  onAchievementUnlocked: (callback: (achievement: any) => void) => void;

  onProgressUpdated: (callback: (progress: any) => void) => void;

  onPreferencesUpdated: (callback: (preferences: any) => void) => void;

  // Utility functions
  isOnline: () => boolean;
  isSyncInProgress: () => boolean;
  getPendingChangesCount: () => number;
  setDeviceName: (name: string) => void;
}

export function useCrossDeviceSync(): UseCrossDeviceSyncReturn {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    crossDeviceSync.getSyncStatus()
  );
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(
    crossDeviceSync.getDeviceInfo()
  );

  // Update sync status when it changes
  useEffect(() => {
    const handleStatusChange = (newStatus: SyncStatus) => {
      setSyncStatus(newStatus);
    };

    crossDeviceSync.on('statusChange', handleStatusChange);

    return () => {
      crossDeviceSync.off('statusChange', handleStatusChange);
    };
  }, []);

  // Update device info periodically
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      setDeviceInfo(crossDeviceSync.getDeviceInfo());
    }, 60000); // Update every minute

    // eslint-disable-next-line no-undef
    return () => clearInterval(interval);
  }, []);

  // Sync now
  const syncNow = useCallback(async () => {
    await crossDeviceSync.syncNow();
  }, []);

  // Force sync
  const forceSync = useCallback(async () => {
    await crossDeviceSync.forceSync();
  }, []);

  // Clear conflicts
  const clearConflicts = useCallback(() => {
    crossDeviceSync.clearConflicts();
  }, []);

  // Event handlers

  const onSyncStart = useCallback((callback: () => void) => {
    crossDeviceSync.on('syncStart', callback);
  }, []);

  const onSyncComplete = useCallback(
    (callback: (status: SyncStatus) => void) => {
      crossDeviceSync.on('syncComplete', callback);
    },
    []
  );

  const onSyncError = useCallback((callback: (error: Error) => void) => {
    crossDeviceSync.on('syncError', callback);
  }, []);

  const onAchievementUnlocked = useCallback(
    (callback: (achievement: any) => void) => {
      crossDeviceSync.on('achievementUnlocked', callback);
    },
    []
  );

  const onProgressUpdated = useCallback((callback: (progress: any) => void) => {
    crossDeviceSync.on('progressUpdated', callback);
  }, []);

  const onPreferencesUpdated = useCallback(
    (callback: (preferences: any) => void) => {
      crossDeviceSync.on('preferencesUpdated', callback);
    },
    []
  );

  // Utility functions
  const isOnline = useCallback(() => {
    return crossDeviceSync.isOnline();
  }, []);

  const isSyncInProgress = useCallback(() => {
    return crossDeviceSync.isSyncInProgress();
  }, []);

  const getPendingChangesCount = useCallback(() => {
    return crossDeviceSync.getPendingChangesCount();
  }, []);

  const setDeviceName = useCallback((name: string) => {
    crossDeviceSync.setDeviceName(name);
    setDeviceInfo(crossDeviceSync.getDeviceInfo());
  }, []);

  return {
    syncStatus,
    deviceInfo,
    syncNow,
    forceSync,
    clearConflicts,
    onSyncStart,
    onSyncComplete,
    onSyncError,
    onAchievementUnlocked,
    onProgressUpdated,
    onPreferencesUpdated,
    isOnline,
    isSyncInProgress,
    getPendingChangesCount,
    setDeviceName,
  };
}
