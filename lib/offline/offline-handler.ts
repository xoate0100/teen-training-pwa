'use client';

import {
  SessionData,
  CheckInData,
  ProgressMetrics,
  Achievement,
  Notification,
} from '@/lib/services/database-service';

export interface OfflineData {
  sessions: SessionData[];
  checkIns: CheckInData[];
  progressMetrics: ProgressMetrics[];
  achievements: Achievement[];
  notifications: Notification[];
  lastSync: string;
}

export class OfflineHandler {
  private static readonly STORAGE_KEY = 'teen-training-offline-data';
  private static readonly SYNC_QUEUE_KEY = 'teen-training-sync-queue';

  // Check if device is online
  static isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine;
  }

  // Save data for offline use
  static saveOfflineData(data: OfflineData): void {
    try {
      const dataToStore = {
        ...data,
        lastSync: new Date().toISOString(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  // Load offline data
  static loadOfflineData(): OfflineData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored) as OfflineData;

      // Check if data is not too old (7 days)
      const lastSync = new Date(data.lastSync);
      const now = new Date();
      const daysDiff =
        (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff > 7) {
        console.warn('Offline data is too old, clearing cache');
        this.clearOfflineData();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to load offline data:', error);
      return null;
    }
  }

  // Clear offline data
  static clearOfflineData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }

  // Queue data for sync when online
  static queueForSync(
    type:
      | 'session'
      | 'checkIn'
      | 'progressMetric'
      | 'achievement'
      | 'notification',
    data: any
  ): void {
    try {
      const queue = this.getSyncQueue();
      queue.push({
        type,
        data,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9),
      });
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to queue data for sync:', error);
    }
  }

  // Get sync queue
  static getSyncQueue(): Array<{
    type: string;
    data: any;
    timestamp: string;
    id: string;
  }> {
    try {
      const stored = localStorage.getItem(this.SYNC_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      return [];
    }
  }

  // Clear sync queue
  static clearSyncQueue(): void {
    try {
      localStorage.removeItem(this.SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Failed to clear sync queue:', error);
    }
  }

  // Process sync queue when back online
  static async processSyncQueue(syncFunctions: {
    // eslint-disable-next-line no-unused-vars
    syncSession: (data: any) => Promise<void>;
    // eslint-disable-next-line no-unused-vars
    syncCheckIn: (data: any) => Promise<void>;
    // eslint-disable-next-line no-unused-vars
    syncProgressMetric: (data: any) => Promise<void>;
    // eslint-disable-next-line no-unused-vars
    syncAchievement: (data: any) => Promise<void>;
    // eslint-disable-next-line no-unused-vars
    syncNotification: (data: any) => Promise<void>;
  }): Promise<{ success: number; failed: number }> {
    const queue = this.getSyncQueue();
    let success = 0;
    let failed = 0;

    for (const item of queue) {
      try {
        switch (item.type) {
          case 'session':
            await syncFunctions.syncSession(item.data);
            break;
          case 'checkIn':
            await syncFunctions.syncCheckIn(item.data);
            break;
          case 'progressMetric':
            await syncFunctions.syncProgressMetric(item.data);
            break;
          case 'achievement':
            await syncFunctions.syncAchievement(item.data);
            break;
          case 'notification':
            await syncFunctions.syncNotification(item.data);
            break;
          default:
            console.warn(`Unknown sync type: ${item.type}`);
        }
        success++;
      } catch (error) {
        console.error(`Failed to sync ${item.type}:`, error);
        failed++;
      }
    }

    // Clear queue after processing
    this.clearSyncQueue();
    return { success, failed };
  }

  // Get offline status message
  static getOfflineStatus(): {
    isOffline: boolean;
    lastSync: string | null;
    queuedItems: number;
  } {
    const isOffline = !this.isOnline();
    const offlineData = this.loadOfflineData();
    const queue = this.getSyncQueue();

    return {
      isOffline,
      lastSync: offlineData?.lastSync || null,
      queuedItems: queue.length,
    };
  }

  // Check if data needs sync
  static needsSync(): boolean {
    const queue = this.getSyncQueue();
    return queue.length > 0;
  }

  // Get storage usage info
  static getStorageInfo(): {
    used: number;
    available: number;
    percentage: number;
  } {
    try {
      let used = 0;
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          used += localStorage[key].length;
        }
      }

      // Estimate available space (most browsers have 5-10MB limit)
      const estimatedLimit = 5 * 1024 * 1024; // 5MB
      const available = Math.max(0, estimatedLimit - used);
      const percentage = (used / estimatedLimit) * 100;

      return {
        used,
        available,
        percentage: Math.min(percentage, 100),
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}
