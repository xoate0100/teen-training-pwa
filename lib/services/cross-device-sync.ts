'use client';

import { DatabaseService, SessionData, CheckInData } from './database-service';

export interface SyncEvent {
  id: string;
  type: 'session_update' | 'checkin_update' | 'achievement_unlock' | 'progress_update' | 'user_preference_change';
  userId: string;
  data: any;
  timestamp: Date;
  deviceId: string;
  version: number;
  conflictResolution?: ConflictResolution;
}

export interface ConflictResolution {
  type: 'last_write_wins' | 'merge' | 'user_choice' | 'automatic';
  resolvedData: any;
  reason: string;
  timestamp: Date;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: Date | null;
  pendingChanges: number;
  conflicts: ConflictResolution[];
  syncInProgress: boolean;
  error: string | null;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  lastSeen: Date;
  isActive: boolean;
  version: string;
}

export interface SyncQueue {
  events: SyncEvent[];
  priority: 'high' | 'medium' | 'low';
  retryCount: number;
  maxRetries: number;
  nextRetry: Date | null;
}

export class CrossDeviceSyncService {
  private databaseService = new DatabaseService();
  private syncQueue: SyncQueue[] = [];
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    lastSyncTime: null,
    pendingChanges: 0,
    conflicts: [],
    syncInProgress: false,
    error: null,
  };
  private deviceId: string;
  private syncInterval: number | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.deviceId = this.generateDeviceId();
    this.initializeSync();
  }

  // Initialize sync service
  private initializeSync() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Start periodic sync
    this.startPeriodicSync();

    // Listen for visibility changes to sync when app becomes visible
    // eslint-disable-next-line no-undef
    // eslint-disable-next-line no-undef
    document.addEventListener('visibilitychange', () => {
      // eslint-disable-next-line no-undef
      if (!document.hidden) {
        this.syncNow();
      }
    });
  }

  // Generate unique device ID
  private generateDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  // Handle online event
  private handleOnline() {
    this.syncStatus.isOnline = true;
    this.syncStatus.error = null;
    this.emit('statusChange', this.syncStatus);
    this.syncNow();
  }

  // Handle offline event
  private handleOffline() {
    this.syncStatus.isOnline = false;
    this.emit('statusChange', this.syncStatus);
  }

  // Start periodic sync
  private startPeriodicSync() {
    if (this.syncInterval) {
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line no-undef
clearInterval(this.syncInterval);
    }

    // eslint-disable-next-line no-undef
    this.syncInterval = // eslint-disable-next-line no-undef
setInterval(() => {
      if (this.syncStatus.isOnline && !this.syncStatus.syncInProgress) {
        this.syncNow();
      }
    }, 30000); // Sync every 30 seconds
  }

  // Sync now
  async syncNow(): Promise<void> {
    if (this.syncStatus.syncInProgress || !this.syncStatus.isOnline) {
      return;
    }

    this.syncStatus.syncInProgress = true;
    this.syncStatus.error = null;
    this.emit('syncStart');

    try {
      // Process sync queue
      await this.processSyncQueue();

      // Sync all data
      await this.syncAllData();

      this.syncStatus.lastSyncTime = new Date();
      this.syncStatus.pendingChanges = 0;
      this.emit('syncComplete', this.syncStatus);
    } catch (error) {
      this.syncStatus.error = error instanceof Error ? error.message : 'Sync failed';
      this.emit('syncError', error);
    } finally {
      this.syncStatus.syncInProgress = false;
      this.emit('syncEnd');
    }
  }

  // Process sync queue
  private async processSyncQueue(): Promise<void> {
    const highPriorityQueue = this.syncQueue.filter(q => q.priority === 'high');
    const mediumPriorityQueue = this.syncQueue.filter(q => q.priority === 'medium');
    const lowPriorityQueue = this.syncQueue.filter(q => q.priority === 'low');

    // Process queues in priority order
    await this.processQueue(highPriorityQueue);
    await this.processQueue(mediumPriorityQueue);
    await this.processQueue(lowPriorityQueue);
  }

  // Process a specific queue
  private async processQueue(queue: SyncQueue[]): Promise<void> {
    for (const syncQueue of queue) {
      try {
        await this.processSyncEvents(syncQueue.events);
        this.removeFromSyncQueue(syncQueue);
      } catch (error) {
        syncQueue.retryCount++;
        if (syncQueue.retryCount >= syncQueue.maxRetries) {
          this.removeFromSyncQueue(syncQueue);
          this.emit('syncError', new Error(`Max retries exceeded for queue: ${error}`));
        } else {
          syncQueue.nextRetry = new Date(Date.now() + Math.pow(2, syncQueue.retryCount) * 1000);
        }
      }
    }
  }

  // Process sync events
  private async processSyncEvents(events: SyncEvent[]): Promise<void> {
    for (const event of events) {
      await this.processSyncEvent(event);
    }
  }

  // Process individual sync event
  // eslint-disable-next-line no-unused-vars
  private async processSyncEvent(event: SyncEvent): Promise<void> {
    try {
      switch (event.type) {
        case 'session_update':
          await this.syncSessionUpdate(event);
          break;
        case 'checkin_update':
          await this.syncCheckInUpdate(event);
          break;
        case 'achievement_unlock':
          await this.syncAchievementUnlock(event);
          break;
        case 'progress_update':
          await this.syncProgressUpdate(event);
          break;
        case 'user_preference_change':
          await this.syncUserPreferenceChange(event);
          break;
        default:
          console.warn('Unknown sync event type:', event.type);
      }
    } catch (error) {
      console.error('Error processing sync event:', error);
      throw error;
    }
  }

  // Sync session update
  private async syncSessionUpdate(event: SyncEvent): Promise<void> {
    const sessionData = event.data as SessionData;
    
    // Check for conflicts
    const existingSession = await this.databaseService.getSession(sessionData.id);
    if (existingSession && existingSession.version > event.version) {
      // Conflict detected - resolve it
      const resolution = await this.resolveSessionConflict(existingSession, sessionData, event);
      if (resolution) {
        await this.databaseService.saveSession(resolution.resolvedData);
        this.syncStatus.conflicts.push(resolution);
      }
    } else {
      // No conflict or newer version - save directly
      await this.databaseService.saveSession(sessionData);
    }
  }

  // Sync check-in update
  private async syncCheckInUpdate(event: SyncEvent): Promise<void> {
    const checkInData = event.data as CheckInData;
    
    // Check for conflicts
    const existingCheckIn = await this.databaseService.getCheckIn(checkInData.id);
    if (existingCheckIn && existingCheckIn.version > event.version) {
      // Conflict detected - resolve it
      const resolution = await this.resolveCheckInConflict(existingCheckIn, checkInData, event);
      if (resolution) {
        await this.databaseService.saveCheckIn(resolution.resolvedData);
        this.syncStatus.conflicts.push(resolution);
      }
    } else {
      // No conflict or newer version - save directly
      await this.databaseService.saveCheckIn(checkInData);
    }
  }

  // Sync achievement unlock
  private async syncAchievementUnlock(event: SyncEvent): Promise<void> {
    // Achievements are typically additive, so we can merge them
    const achievement = event.data;
    await this.databaseService.unlockAchievement(event.userId, achievement.id);
    this.emit('achievementUnlocked', achievement);
  }

  // Sync progress update
  private async syncProgressUpdate(event: SyncEvent): Promise<void> {
    const progressData = event.data;
    
    // Progress updates are typically additive, so we can merge them
    await this.databaseService.updateProgress(event.userId, progressData);
    this.emit('progressUpdated', progressData);
  }

  // Sync user preference change
  private async syncUserPreferenceChange(event: SyncEvent): Promise<void> {
    const preferenceData = event.data;
    
    // User preferences typically use last-write-wins
    await this.databaseService.updateUserPreferences(event.userId, preferenceData);
    this.emit('preferencesUpdated', preferenceData);
  }

  // Resolve session conflict
  private async resolveSessionConflict(
    existing: SessionData,
    incoming: SessionData,
    event: SyncEvent
  ): Promise<ConflictResolution | null> {
    // Use last-write-wins for sessions
    if (incoming.updatedAt > existing.updatedAt) {
      return {
        type: 'last_write_wins',
        resolvedData: incoming,
        reason: 'Incoming session is newer',
        timestamp: new Date(),
      };
    } else {
      return {
        type: 'last_write_wins',
        resolvedData: existing,
        reason: 'Existing session is newer',
        timestamp: new Date(),
      };
    }
  }

  // Resolve check-in conflict
  private async resolveCheckInConflict(
    existing: CheckInData,
    incoming: CheckInData,
    event: SyncEvent
  ): Promise<ConflictResolution | null> {
    // Use last-write-wins for check-ins
    if (incoming.updatedAt > existing.updatedAt) {
      return {
        type: 'last_write_wins',
        resolvedData: incoming,
        reason: 'Incoming check-in is newer',
        timestamp: new Date(),
      };
    } else {
      return {
        type: 'last_write_wins',
        resolvedData: existing,
        reason: 'Existing check-in is newer',
        timestamp: new Date(),
      };
    }
  }

  // Sync all data
  private async syncAllData(): Promise<void> {
    // This would sync all user data from the server
    // For now, we'll implement a basic version
    const userId = this.getCurrentUserId();
    if (!userId) return;

    // Sync sessions
    await this.syncSessions(userId);
    
    // Sync check-ins
    await this.syncCheckIns(userId);
    
    // Sync achievements
    await this.syncAchievements(userId);
    
    // Sync progress
    await this.syncProgress(userId);
  }

  // Sync sessions
  private async syncSessions(userId: string): Promise<void> {
    // This would fetch latest sessions from server
    // For now, we'll use local data
    const sessions = await this.databaseService.getSessions(userId);
    this.emit('sessionsSynced', sessions);
  }

  // Sync check-ins
  private async syncCheckIns(userId: string): Promise<void> {
    // This would fetch latest check-ins from server
    // For now, we'll use local data
    const checkIns = await this.databaseService.getCheckIns(userId);
    this.emit('checkInsSynced', checkIns);
  }

  // Sync achievements
  private async syncAchievements(userId: string): Promise<void> {
    // This would fetch latest achievements from server
    // For now, we'll use local data
    const achievements = await this.databaseService.getAchievements(userId);
    this.emit('achievementsSynced', achievements);
  }

  // Sync progress
  private async syncProgress(userId: string): Promise<void> {
    // This would fetch latest progress from server
    // For now, we'll use local data
    const progress = await this.databaseService.getProgress(userId);
    this.emit('progressSynced', progress);
  }

  // Queue sync event
  // eslint-disable-next-line no-unused-vars
  queueSyncEvent(event: Omit<SyncEvent, 'id' | 'timestamp' | 'deviceId' | 'version'>): void {
    const syncEvent: SyncEvent = {
      ...event,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      deviceId: this.deviceId,
      version: 1,
    };

    const priority = this.getEventPriority(event.type);
    const syncQueue: SyncQueue = {
      events: [syncEvent],
      priority,
      retryCount: 0,
      maxRetries: 3,
      nextRetry: null,
    };

    this.syncQueue.push(syncQueue);
    this.syncStatus.pendingChanges++;
    this.emit('statusChange', this.syncStatus);

    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      this.syncNow();
    }
  }

  // Get event priority
  private getEventPriority(type: string): 'high' | 'medium' | 'low' {
    switch (type) {
      case 'achievement_unlock':
      case 'progress_update':
        return 'high';
      case 'session_update':
      case 'checkin_update':
        return 'medium';
      case 'user_preference_change':
        return 'low';
      default:
        return 'medium';
    }
  }

  // Remove from sync queue
  private removeFromSyncQueue(syncQueue: SyncQueue): void {
    const index = this.syncQueue.indexOf(syncQueue);
    if (index > -1) {
      this.syncQueue.splice(index, 1);
      this.syncStatus.pendingChanges = Math.max(0, this.syncStatus.pendingChanges - 1);
      this.emit('statusChange', this.syncStatus);
    }
  }

  // Get current user ID
  private getCurrentUserId(): string | null {
    // This would get the current user ID from your auth system
    return localStorage.getItem('currentUserId');
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

  // Public API methods
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  getDeviceInfo(): DeviceInfo {
    return {
      id: this.deviceId,
      name: this.getDeviceName(),
      type: this.getDeviceType(),
      lastSeen: new Date(),
      isActive: true,
      version: '1.0.0',
    };
  }

  getDeviceName(): string {
    return localStorage.getItem('deviceName') || 'Unknown Device';
  }

  setDeviceName(name: string): void {
    localStorage.setItem('deviceName', name);
  }

  getDeviceType(): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'mobile';
    } else if (/Tablet|iPad/.test(userAgent)) {
      return 'tablet';
    } else if (/Windows|Mac|Linux/.test(userAgent)) {
      return 'desktop';
    }
    return 'unknown';
  }

  // Force sync
  async forceSync(): Promise<void> {
    await this.syncNow();
  }

  // Clear conflicts
  clearConflicts(): void {
    this.syncStatus.conflicts = [];
    this.emit('statusChange', this.syncStatus);
  }

  // Get pending changes count
  getPendingChangesCount(): number {
    return this.syncStatus.pendingChanges;
  }

  // Check if sync is in progress
  isSyncInProgress(): boolean {
    return this.syncStatus.syncInProgress;
  }

  // Check if online
  isOnline(): boolean {
    return this.syncStatus.isOnline;
  }

  // Cleanup
  destroy(): void {
    if (this.syncInterval) {
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line no-undef
clearInterval(this.syncInterval);
    }
    this.eventListeners.clear();
  }
}

// Export singleton instance
export const crossDeviceSync = new CrossDeviceSyncService();
