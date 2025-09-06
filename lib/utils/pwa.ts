// PWA utilities for service worker management and offline functionality

export interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  hasServiceWorker: boolean;
  pendingSync: boolean;
  lastSync: Date | null;
}

export interface PendingData {
  id: string;
  type: 'session' | 'checkin' | 'progress';
  data: any;
  timestamp: Date;
}

class PWAManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isOnline = navigator.onLine;
  private listeners: Array<(status: PWAStatus) => void> = [];

  constructor() {
    this.init();
  }

  private async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Listen for service worker updates
    if (this.registration) {
      this.registration.addEventListener(
        'updatefound',
        this.handleUpdate.bind(this)
      );
    }
  }

  private handleOnline() {
    this.isOnline = true;
    this.notifyListeners();
    this.triggerBackgroundSync();
  }

  private handleOffline() {
    this.isOnline = false;
    this.notifyListeners();
  }

  private handleUpdate() {
    if (this.registration?.waiting) {
      // Notify user about update
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    const status = this.getStatus();
    this.listeners.forEach(listener => listener(status));
  }

  /**
   * Get current PWA status
   */
  getStatus(): PWAStatus {
    return {
      isInstalled: this.isInstalled(),
      isOnline: this.isOnline,
      hasServiceWorker: !!this.registration,
      pendingSync: this.hasPendingSync(),
      lastSync: this.getLastSync(),
    };
  }

  /**
   * Check if app is installed as PWA
   */
  isInstalled(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  /**
   * Check if there's pending sync data
   */
  hasPendingSync(): boolean {
    // This would typically check IndexedDB for pending data
    return false;
  }

  /**
   * Get last sync timestamp
   */
  getLastSync(): Date | null {
    const lastSync = localStorage.getItem('lastSync');
    return lastSync ? new Date(lastSync) : null;
  }

  /**
   * Subscribe to PWA status changes
   */
  subscribe(listener: (status: PWAStatus) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Install PWA
   */
  async install(): Promise<boolean> {
    if (!this.registration?.waiting) {
      return false;
    }

    try {
      // Send message to service worker to skip waiting
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Reload the page
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  }

  /**
   * Trigger background sync
   */
  async triggerBackgroundSync(): Promise<void> {
    if (!this.registration || !this.isOnline) {
      return;
    }

    try {
      // Register sync events
      await this.registration.sync.register('session-sync');
      await this.registration.sync.register('checkin-sync');
      await this.registration.sync.register('progress-sync');

      // Update last sync time
      localStorage.setItem('lastSync', new Date().toISOString());
      this.notifyListeners();
    } catch (error) {
      console.error('Error triggering background sync:', error);
    }
  }

  /**
   * Save data for offline sync
   */
  async saveForSync(
    type: 'session' | 'checkin' | 'progress',
    data: any
  ): Promise<void> {
    const pendingData: PendingData = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date(),
    };

    try {
      // Save to IndexedDB
      await this.saveToIndexedDB(pendingData);

      // If online, try to sync immediately
      if (this.isOnline) {
        await this.syncData(pendingData);
      }
    } catch (error) {
      console.error('Error saving data for sync:', error);
    }
  }

  /**
   * Save data to IndexedDB
   */
  private async saveToIndexedDB(data: PendingData): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TeenTrainingPWA', 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['pendingData'], 'readwrite');
        const store = transaction.objectStore('pendingData');
        const addRequest = store.add(data);

        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject(addRequest.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('pendingData')) {
          const store = db.createObjectStore('pendingData', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  /**
   * Sync data to server
   */
  private async syncData(data: PendingData): Promise<void> {
    try {
      let endpoint = '';
      let method = 'POST';

      switch (data.type) {
        case 'session':
          endpoint = '/api/sessions';
          break;
        case 'checkin':
          endpoint = '/api/check-ins';
          break;
        case 'progress':
          endpoint = '/api/progress';
          break;
        default:
          throw new Error(`Unknown data type: ${data.type}`);
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.data),
      });

      if (response.ok) {
        // Remove from IndexedDB
        await this.removeFromIndexedDB(data.id);
        console.log(`Successfully synced ${data.type} data`);
      } else {
        throw new Error(`Sync failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error syncing ${data.type} data:`, error);
      throw error;
    }
  }

  /**
   * Remove data from IndexedDB
   */
  private async removeFromIndexedDB(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TeenTrainingPWA', 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['pendingData'], 'readwrite');
        const store = transaction.objectStore('pendingData');
        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };
    });
  }

  /**
   * Get pending data count
   */
  async getPendingDataCount(): Promise<{
    sessions: number;
    checkins: number;
    progress: number;
  }> {
    try {
      const pendingData = await this.getAllPendingData();

      return {
        sessions: pendingData.filter(d => d.type === 'session').length,
        checkins: pendingData.filter(d => d.type === 'checkin').length,
        progress: pendingData.filter(d => d.type === 'progress').length,
      };
    } catch (error) {
      console.error('Error getting pending data count:', error);
      return { sessions: 0, checkins: 0, progress: 0 };
    }
  }

  /**
   * Get all pending data
   */
  private async getAllPendingData(): Promise<PendingData[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TeenTrainingPWA', 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['pendingData'], 'readonly');
        const store = transaction.objectStore('pendingData');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = () => reject(getAllRequest.error);
      };
    });
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  /**
   * Show notification
   */
  async showNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<void> {
    if (!this.registration) {
      return;
    }

    const hasPermission = await this.requestNotificationPermission();
    if (!hasPermission) {
      return;
    }

    this.registration.showNotification(title, {
      icon: '/placeholder-logo.png',
      badge: '/placeholder-logo.png',
      ...options,
    });
  }
}

// Export singleton instance
export const pwaManager = new PWAManager();

// Export the class for testing
export { PWAManager };
