'use client';

import { DatabaseService, SessionData, CheckInData } from './database-service';

export interface OfflineCache {
  sessions: SessionData[];
  checkIns: CheckInData[];
  lastSyncTime: Date | null;
  pendingChanges: PendingChange[];
  cacheSize: number;
  maxCacheSize: number;
}

export interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: 'sessions' | 'checkins' | 'progress' | 'achievements';
  data: any;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
}

export interface SyncStrategy {
  type: 'immediate' | 'background' | 'manual';
  interval: number; // milliseconds
  maxRetries: number;
  retryDelay: number; // milliseconds
}

export interface ConflictResolution {
  id: string;
  type: 'last_write_wins' | 'merge' | 'user_choice' | 'automatic';
  localData: any;
  remoteData: any;
  resolvedData: any;
  timestamp: Date;
  reason: string;
}

export class OfflineFirstService {
  private databaseService = new DatabaseService();
  private cache: OfflineCache = {
    sessions: [],
    checkIns: [],
    lastSyncTime: null,
    pendingChanges: [],
    cacheSize: 0,
    maxCacheSize: 50 * 1024 * 1024, // 50MB
  };
  private syncStrategy: SyncStrategy = {
    type: 'background',
    interval: 30000, // 30 seconds
    maxRetries: 3,
    retryDelay: 1000,
  };
  private syncInterval: number | null = null;
  private isOnline: boolean = navigator.onLine;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeOfflineService();
  }

  // Initialize offline service
  private initializeOfflineService() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Load cache from localStorage
    this.loadCacheFromStorage();

    // Start background sync
    this.startBackgroundSync();

    // Listen for visibility changes to sync when app becomes visible
    // eslint-disable-next-line no-undef
    document.addEventListener('visibilitychange', () => {
      // eslint-disable-next-line no-undef
      if (!document.hidden && this.isOnline) {
        this.syncPendingChanges();
      }
    });
  }

  // Handle online event
  private handleOnline() {
    this.isOnline = true;
    this.emit('online');
    this.syncPendingChanges();
  }

  // Handle offline event
  private handleOffline() {
    this.isOnline = false;
    this.emit('offline');
  }

  // Load cache from localStorage
  private loadCacheFromStorage() {
    try {
      const cached = localStorage.getItem('offlineCache');
      if (cached) {
        const parsedCache = JSON.parse(cached);
        this.cache = {
          ...this.cache,
          ...parsedCache,
          sessions: parsedCache.sessions || [],
          checkIns: parsedCache.checkIns || [],
          lastSyncTime: parsedCache.lastSyncTime ? new Date(parsedCache.lastSyncTime) : null,
          pendingChanges: parsedCache.pendingChanges || [],
        };
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  }

  // Save cache to localStorage
  private saveCacheToStorage() {
    try {
      const cacheToSave = {
        ...this.cache,
        lastSyncTime: this.cache.lastSyncTime?.toISOString(),
      };
      localStorage.setItem('offlineCache', JSON.stringify(cacheToSave));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  // Start background sync
  private startBackgroundSync() {
    if (this.syncInterval) {
      // eslint-disable-next-line no-undef
clearInterval(this.syncInterval);
    }

    if (this.syncStrategy.type === 'background') {
      this.syncInterval = // eslint-disable-next-line no-undef
setInterval(() => {
        if (this.isOnline && this.cache.pendingChanges.length > 0) {
          this.syncPendingChanges();
        }
      }, this.syncStrategy.interval);
    }
  }

  // Sync pending changes
  async syncPendingChanges(): Promise<void> {
    if (!this.isOnline || this.cache.pendingChanges.length === 0) {
      return;
    }

    const changesToSync = [...this.cache.pendingChanges];
    
    for (const change of changesToSync) {
      try {
        await this.processPendingChange(change);
        this.removePendingChange(change.id);
      } catch (error) {
        console.error('Error syncing change:', error);
        change.retryCount++;
        
        if (change.retryCount >= change.maxRetries) {
          this.removePendingChange(change.id);
          this.emit('syncError', { change, error });
        } else {
          // Reschedule for retry
          setTimeout(() => {
            this.syncPendingChanges();
          }, this.syncStrategy.retryDelay * Math.pow(2, change.retryCount));
        }
      }
    }

    this.saveCacheToStorage();
  }

  // Process pending change
  private async processPendingChange(change: PendingChange): Promise<void> {
    switch (change.type) {
      case 'create':
        await this.createData(change.table, change.data);
        break;
      case 'update':
        await this.updateData(change.table, change.data);
        break;
      case 'delete':
        await this.deleteData(change.table, change.data.id);
        break;
    }
  }

  // Create data
  private async createData(table: string, data: any): Promise<void> {
    switch (table) {
      case 'sessions':
        await this.databaseService.saveSession(data);
        break;
      case 'checkins':
        await this.databaseService.saveCheckIn(data);
        break;
      case 'progress':
        await this.databaseService.updateProgress(data.userId, data);
        break;
      case 'achievements':
        await this.databaseService.unlockAchievement(data.userId, data.id);
        break;
    }
  }

  // Update data
  private async updateData(table: string, data: any): Promise<void> {
    switch (table) {
      case 'sessions':
        await this.databaseService.updateSession(data);
        break;
      case 'checkins':
        await this.databaseService.updateCheckIn(data);
        break;
      case 'progress':
        await this.databaseService.updateProgress(data.userId, data);
        break;
    }
  }

  // Delete data
  private async deleteData(table: string, id: string): Promise<void> {
    switch (table) {
      case 'sessions':
        await this.databaseService.deleteSession(id);
        break;
      case 'checkins':
        await this.databaseService.deleteCheckIn(id);
        break;
    }
  }

  // Add pending change
  addPendingChange(change: Omit<PendingChange, 'id' | 'timestamp' | 'retryCount'>): void {
    const pendingChange: PendingChange = {
      ...change,
      id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: this.syncStrategy.maxRetries,
    };

    this.cache.pendingChanges.push(pendingChange);
    this.saveCacheToStorage();
    this.emit('pendingChangeAdded', pendingChange);

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncPendingChanges();
    }
  }

  // Remove pending change
  private removePendingChange(id: string): void {
    const index = this.cache.pendingChanges.findIndex(c => c.id === id);
    if (index > -1) {
      this.cache.pendingChanges.splice(index, 1);
      this.saveCacheToStorage();
    }
  }

  // Cache session data
  async cacheSessionData(session: SessionData): Promise<void> {
    // Check cache size
    if (this.cache.cacheSize > this.cache.maxCacheSize) {
      await this.cleanupCache();
    }

    // Add to cache
    const existingIndex = this.cache.sessions.findIndex(s => s.id === session.id);
    if (existingIndex > -1) {
      this.cache.sessions[existingIndex] = session;
    } else {
      this.cache.sessions.push(session);
    }

    this.cache.cacheSize += JSON.stringify(session).length;
    this.saveCacheToStorage();
    this.emit('sessionCached', session);
  }

  // Cache check-in data
  async cacheCheckInData(checkIn: CheckInData): Promise<void> {
    // Check cache size
    if (this.cache.cacheSize > this.cache.maxCacheSize) {
      await this.cleanupCache();
    }

    // Add to cache
    const existingIndex = this.cache.checkIns.findIndex(c => c.id === checkIn.id);
    if (existingIndex > -1) {
      this.cache.checkIns[existingIndex] = checkIn;
    } else {
      this.cache.checkIns.push(checkIn);
    }

    this.cache.cacheSize += JSON.stringify(checkIn).length;
    this.saveCacheToStorage();
    this.emit('checkInCached', checkIn);
  }

  // Get cached sessions
  getCachedSessions(): SessionData[] {
    return [...this.cache.sessions];
  }

  // Get cached check-ins
  getCachedCheckIns(): CheckInData[] {
    return [...this.cache.checkIns];
  }

  // Get pending changes
  getPendingChanges(): PendingChange[] {
    return [...this.cache.pendingChanges];
  }

  // Get cache status
  getCacheStatus(): OfflineCache {
    return { ...this.cache };
  }

  // Cleanup cache
  private async cleanupCache(): Promise<void> {
    // Remove oldest entries to make space
    const sortedSessions = this.cache.sessions.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const sortedCheckIns = this.cache.checkIns.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Remove oldest 25% of each type
    const sessionsToRemove = Math.floor(sortedSessions.length * 0.25);
    const checkInsToRemove = Math.floor(sortedCheckIns.length * 0.25);

    this.cache.sessions = sortedSessions.slice(sessionsToRemove);
    this.cache.checkIns = sortedCheckIns.slice(checkInsToRemove);

    // Recalculate cache size
    this.cache.cacheSize = this.calculateCacheSize();
    this.saveCacheToStorage();
  }

  // Calculate cache size
  private calculateCacheSize(): number {
    let size = 0;
    size += this.cache.sessions.reduce((sum, session) => sum + JSON.stringify(session).length, 0);
    size += this.cache.checkIns.reduce((sum, checkIn) => sum + JSON.stringify(checkIn).length, 0);
    size += this.cache.pendingChanges.reduce((sum, change) => sum + JSON.stringify(change).length, 0);
    return size;
  }

  // Sync strategy management
  setSyncStrategy(strategy: Partial<SyncStrategy>): void {
    this.syncStrategy = { ...this.syncStrategy, ...strategy };
    this.startBackgroundSync();
  }

  // Force sync
  async forceSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    await this.syncPendingChanges();
  }

  // Clear cache
  clearCache(): void {
    this.cache = {
      sessions: [],
      checkIns: [],
      lastSyncTime: null,
      pendingChanges: [],
      cacheSize: 0,
      maxCacheSize: this.cache.maxCacheSize,
    };
    this.saveCacheToStorage();
    this.emit('cacheCleared');
  }

  // Check if online
  isOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Get pending changes count
  getPendingChangesCount(): number {
    return this.cache.pendingChanges.length;
  }

  // Event emitter methods
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Cleanup
  destroy(): void {
    if (this.syncInterval) {
      // eslint-disable-next-line no-undef
clearInterval(this.syncInterval);
    }
    this.eventListeners.clear();
  }
}

// Export singleton instance
export const offlineFirstService = new OfflineFirstService();
