'use client';

export interface HeartRateData {
  timestamp: Date;
  bpm: number;
  zone: 'rest' | 'fat_burn' | 'cardio' | 'peak';
  resting: boolean;
  active: boolean;
  recovery: boolean;
}

export interface SleepData {
  date: Date;
  totalSleep: number; // in minutes
  deepSleep: number; // in minutes
  lightSleep: number; // in minutes
  remSleep: number; // in minutes
  awakeTime: number; // in minutes
  sleepEfficiency: number; // percentage
  sleepScore: number; // 0-100
  bedTime: Date;
  wakeTime: Date;
  interruptions: number;
}

export interface ActivityData {
  date: Date;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  distance: number; // in meters
  floors: number;
  intensity: 'low' | 'moderate' | 'high';
  activityType: string;
  duration: number; // in minutes
}

export interface RecoveryMetrics {
  date: Date;
  hrv: number; // Heart Rate Variability
  restingHeartRate: number;
  sleepQuality: number; // 0-100
  stressLevel: number; // 0-100
  readinessScore: number; // 0-100
  recoveryTime: number; // hours
  trainingLoad: number;
  fatigueLevel: number; // 0-100
  recommendations: string[];
}

export interface WearableDevice {
  id: string;
  name: string;
  type: 'fitness_tracker' | 'smartwatch' | 'chest_strap' | 'earbuds';
  brand: string;
  model: string;
  capabilities: string[];
  batteryLevel: number;
  connected: boolean;
  lastSync: Date;
}

export interface DeviceIntegrationConfig {
  enableHeartRate: boolean;
  enableSleepTracking: boolean;
  enableActivityTracking: boolean;
  enableRecoveryMetrics: boolean;
  syncInterval: number; // in minutes
  dataRetentionDays: number;
  privacyMode: boolean;
  autoSync: boolean;
}

export class WearableDeviceIntegrationService {
  private devices: Map<string, WearableDevice> = new Map();
  private heartRateData: HeartRateData[] = [];
  private sleepData: SleepData[] = [];
  private activityData: ActivityData[] = [];
  private recoveryMetrics: RecoveryMetrics[] = [];
  private config: DeviceIntegrationConfig = {
    enableHeartRate: true,
    enableSleepTracking: true,
    enableActivityTracking: true,
    enableRecoveryMetrics: true,
    syncInterval: 5,
    dataRetentionDays: 30,
    privacyMode: false,
    autoSync: true,
  };
  private syncInterval: number | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeService();
  }

  // Initialize the service
  private initializeService() {
    this.loadStoredData();
    this.startAutoSync();
    this.setupEventListeners();
  }

  // Load stored data from localStorage
  private loadStoredData() {
    try {
      const storedHeartRate = localStorage.getItem('wearable_heart_rate');
      if (storedHeartRate) {
        this.heartRateData = JSON.parse(storedHeartRate).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }

      const storedSleep = localStorage.getItem('wearable_sleep');
      if (storedSleep) {
        this.sleepData = JSON.parse(storedSleep).map((item: any) => ({
          ...item,
          date: new Date(item.date),
          bedTime: new Date(item.bedTime),
          wakeTime: new Date(item.wakeTime),
        }));
      }

      const storedActivity = localStorage.getItem('wearable_activity');
      if (storedActivity) {
        this.activityData = JSON.parse(storedActivity).map((item: any) => ({
          ...item,
          date: new Date(item.date),
        }));
      }

      const storedRecovery = localStorage.getItem('wearable_recovery');
      if (storedRecovery) {
        this.recoveryMetrics = JSON.parse(storedRecovery).map((item: any) => ({
          ...item,
          date: new Date(item.date),
        }));
      }

      const storedDevices = localStorage.getItem('wearable_devices');
      if (storedDevices) {
        const devices = JSON.parse(storedDevices);
        devices.forEach((device: any) => {
          this.devices.set(device.id, {
            ...device,
            lastSync: new Date(device.lastSync),
          });
        });
      }
    } catch (error) {
      console.error('Error loading stored wearable data:', error);
    }
  }

  // Save data to localStorage
  private saveData() {
    try {
      localStorage.setItem(
        'wearable_heart_rate',
        JSON.stringify(this.heartRateData)
      );
      localStorage.setItem('wearable_sleep', JSON.stringify(this.sleepData));
      localStorage.setItem(
        'wearable_activity',
        JSON.stringify(this.activityData)
      );
      localStorage.setItem(
        'wearable_recovery',
        JSON.stringify(this.recoveryMetrics)
      );
      localStorage.setItem(
        'wearable_devices',
        JSON.stringify([...this.devices.values()])
      );
    } catch (error) {
      console.error('Error saving wearable data:', error);
    }
  }

  // Start auto-sync
  private startAutoSync() {
    if (this.config.autoSync && this.syncInterval === null) {
      this.syncInterval = setInterval(
        () => {
          this.syncAllDevices();
        },
        this.config.syncInterval * 60 * 1000
      );
    }
  }

  // Stop auto-sync
  private stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Setup event listeners
  private setupEventListeners() {
    // Listen for visibility changes to sync when app becomes visible
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.config.autoSync) {
          this.syncAllDevices();
        }
      });
    }
  }

  // Add event listener
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  // Remove event listener
  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Emit event
  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Connect device
  async connectDevice(
    device: Omit<WearableDevice, 'id' | 'connected' | 'lastSync'>
  ): Promise<string> {
    const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newDevice: WearableDevice = {
      ...device,
      id: deviceId,
      connected: true,
      lastSync: new Date(),
    };

    this.devices.set(deviceId, newDevice);
    this.saveData();
    this.emit('deviceConnected', newDevice);

    return deviceId;
  }

  // Disconnect device
  disconnectDevice(deviceId: string): void {
    const device = this.devices.get(deviceId);
    if (device) {
      device.connected = false;
      this.devices.set(deviceId, device);
      this.saveData();
      this.emit('deviceDisconnected', device);
    }
  }

  // Get all devices
  getDevices(): WearableDevice[] {
    return [...this.devices.values()];
  }

  // Get connected devices
  getConnectedDevices(): WearableDevice[] {
    return [...this.devices.values()].filter(device => device.connected);
  }

  // Sync all devices
  async syncAllDevices(): Promise<void> {
    const connectedDevices = this.getConnectedDevices();

    for (const device of connectedDevices) {
      try {
        await this.syncDevice(device.id);
      } catch (error) {
        console.error(`Error syncing device ${device.id}:`, error);
        this.emit('syncError', { deviceId: device.id, error });
      }
    }
  }

  // Sync specific device
  async syncDevice(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device || !device.connected) {
      throw new Error('Device not found or not connected');
    }

    this.emit('syncStart', { deviceId });

    try {
      // Simulate device sync - in real implementation, this would connect to device APIs
      await this.simulateDeviceSync(device);

      device.lastSync = new Date();
      this.devices.set(deviceId, device);
      this.saveData();

      this.emit('syncComplete', { deviceId });
    } catch (error) {
      this.emit('syncError', { deviceId, error });
      throw error;
    }
  }

  // Simulate device sync (replace with real device integration)
  private async simulateDeviceSync(device: WearableDevice): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Generate sample data based on device capabilities
    if (
      device.capabilities.includes('heart_rate') &&
      this.config.enableHeartRate
    ) {
      this.generateHeartRateData(device, today);
    }

    if (
      device.capabilities.includes('sleep') &&
      this.config.enableSleepTracking
    ) {
      this.generateSleepData(device, today);
    }

    if (
      device.capabilities.includes('activity') &&
      this.config.enableActivityTracking
    ) {
      this.generateActivityData(device, today);
    }

    if (
      device.capabilities.includes('recovery') &&
      this.config.enableRecoveryMetrics
    ) {
      this.generateRecoveryMetrics(device, today);
    }
  }

  // Generate sample heart rate data
  private generateHeartRateData(device: WearableDevice, date: Date): void {
    const baseBPM = 70 + Math.random() * 20; // 70-90 BPM base
    const dataPoints = 24; // One per hour

    for (let i = 0; i < dataPoints; i++) {
      const timestamp = new Date(date.getTime() + i * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 20; // ±10 BPM variation
      const bpm = Math.max(50, Math.min(200, baseBPM + variation));

      const heartRateData: HeartRateData = {
        timestamp,
        bpm: Math.round(bpm),
        zone: this.getHeartRateZone(bpm),
        resting: i < 6 || i > 22, // Resting during sleep hours
        active: i >= 8 && i <= 18, // Active during day
        recovery: i >= 19 && i <= 21, // Recovery in evening
      };

      this.heartRateData.push(heartRateData);
    }

    // Clean old data
    this.cleanOldData('heartRate');
  }

  // Generate sample sleep data
  private generateSleepData(device: WearableDevice, date: Date): void {
    const totalSleep = 420 + Math.random() * 120; // 7-9 hours
    const deepSleep = totalSleep * (0.15 + Math.random() * 0.1); // 15-25%
    const lightSleep = totalSleep * (0.45 + Math.random() * 0.1); // 45-55%
    const remSleep = totalSleep * (0.15 + Math.random() * 0.1); // 15-25%
    const awakeTime = totalSleep * (0.05 + Math.random() * 0.05); // 5-10%

    const bedTime = new Date(date.getTime() - totalSleep * 60 * 1000);
    const wakeTime = new Date(date);

    const sleepData: SleepData = {
      date,
      totalSleep: Math.round(totalSleep),
      deepSleep: Math.round(deepSleep),
      lightSleep: Math.round(lightSleep),
      remSleep: Math.round(remSleep),
      awakeTime: Math.round(awakeTime),
      sleepEfficiency: 80 + Math.random() * 15, // 80-95%
      sleepScore: 70 + Math.random() * 25, // 70-95
      bedTime,
      wakeTime,
      interruptions: Math.floor(Math.random() * 5),
    };

    this.sleepData.push(sleepData);
    this.cleanOldData('sleep');
  }

  // Generate sample activity data
  private generateActivityData(device: WearableDevice, date: Date): void {
    const steps = 8000 + Math.random() * 4000; // 8k-12k steps
    const caloriesBurned = 2000 + Math.random() * 500; // 2000-2500 calories
    const activeMinutes = 30 + Math.random() * 60; // 30-90 minutes
    const distance = steps * 0.7; // Approximate distance in meters
    const floors = Math.floor(Math.random() * 20); // 0-20 floors

    const activityData: ActivityData = {
      date,
      steps: Math.round(steps),
      caloriesBurned: Math.round(caloriesBurned),
      activeMinutes: Math.round(activeMinutes),
      distance: Math.round(distance),
      floors,
      intensity: this.getActivityIntensity(activeMinutes),
      activityType: this.getRandomActivityType(),
      duration: Math.round(activeMinutes),
    };

    this.activityData.push(activityData);
    this.cleanOldData('activity');
  }

  // Generate sample recovery metrics
  private generateRecoveryMetrics(device: WearableDevice, date: Date): void {
    const hrv = 30 + Math.random() * 20; // 30-50 ms
    const restingHeartRate = 55 + Math.random() * 15; // 55-70 BPM
    const sleepQuality = 70 + Math.random() * 25; // 70-95
    const stressLevel = 20 + Math.random() * 40; // 20-60
    const readinessScore = 60 + Math.random() * 35; // 60-95
    const recoveryTime = 12 + Math.random() * 12; // 12-24 hours
    const trainingLoad = 20 + Math.random() * 60; // 20-80
    const fatigueLevel = 10 + Math.random() * 50; // 10-60

    const recommendations = this.generateRecoveryRecommendations(
      hrv,
      restingHeartRate,
      sleepQuality,
      stressLevel,
      readinessScore
    );

    const recoveryMetrics: RecoveryMetrics = {
      date,
      hrv: Math.round(hrv * 10) / 10,
      restingHeartRate: Math.round(restingHeartRate),
      sleepQuality: Math.round(sleepQuality),
      stressLevel: Math.round(stressLevel),
      readinessScore: Math.round(readinessScore),
      recoveryTime: Math.round(recoveryTime * 10) / 10,
      trainingLoad: Math.round(trainingLoad),
      fatigueLevel: Math.round(fatigueLevel),
      recommendations,
    };

    this.recoveryMetrics.push(recoveryMetrics);
    this.cleanOldData('recovery');
  }

  // Get heart rate zone
  private getHeartRateZone(
    bpm: number
  ): 'rest' | 'fat_burn' | 'cardio' | 'peak' {
    if (bpm < 100) return 'rest';
    if (bpm < 130) return 'fat_burn';
    if (bpm < 160) return 'cardio';
    return 'peak';
  }

  // Get activity intensity
  private getActivityIntensity(
    activeMinutes: number
  ): 'low' | 'moderate' | 'high' {
    if (activeMinutes < 30) return 'low';
    if (activeMinutes < 60) return 'moderate';
    return 'high';
  }

  // Get random activity type
  private getRandomActivityType(): string {
    const activities = [
      'walking',
      'running',
      'cycling',
      'swimming',
      'strength_training',
      'yoga',
      'dancing',
      'sports',
      'hiking',
      'other',
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  // Generate recovery recommendations
  private generateRecoveryRecommendations(
    hrv: number,
    restingHeartRate: number,
    sleepQuality: number,
    stressLevel: number,
    readinessScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (hrv < 25) {
      recommendations.push('Consider taking a rest day - HRV is low');
    }
    if (restingHeartRate > 70) {
      recommendations.push(
        'Focus on recovery - resting heart rate is elevated'
      );
    }
    if (sleepQuality < 80) {
      recommendations.push('Improve sleep hygiene for better recovery');
    }
    if (stressLevel > 60) {
      recommendations.push('Practice stress management techniques');
    }
    if (readinessScore < 70) {
      recommendations.push('Reduce training intensity today');
    }
    if (recommendations.length === 0) {
      recommendations.push('Great recovery metrics - ready for training!');
    }

    return recommendations;
  }

  // Clean old data
  private cleanOldData(
    type: 'heartRate' | 'sleep' | 'activity' | 'recovery'
  ): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.dataRetentionDays);

    switch (type) {
      case 'heartRate':
        this.heartRateData = this.heartRateData.filter(
          data => data.timestamp >= cutoffDate
        );
        break;
      case 'sleep':
        this.sleepData = this.sleepData.filter(data => data.date >= cutoffDate);
        break;
      case 'activity':
        this.activityData = this.activityData.filter(
          data => data.date >= cutoffDate
        );
        break;
      case 'recovery':
        this.recoveryMetrics = this.recoveryMetrics.filter(
          data => data.date >= cutoffDate
        );
        break;
    }
  }

  // Get heart rate data
  getHeartRateData(startDate?: Date, endDate?: Date): HeartRateData[] {
    let data = [...this.heartRateData];

    if (startDate) {
      data = data.filter(item => item.timestamp >= startDate);
    }
    if (endDate) {
      data = data.filter(item => item.timestamp <= endDate);
    }

    return data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Get sleep data
  getSleepData(startDate?: Date, endDate?: Date): SleepData[] {
    let data = [...this.sleepData];

    if (startDate) {
      data = data.filter(item => item.date >= startDate);
    }
    if (endDate) {
      data = data.filter(item => item.date <= endDate);
    }

    return data.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Get activity data
  getActivityData(startDate?: Date, endDate?: Date): ActivityData[] {
    let data = [...this.activityData];

    if (startDate) {
      data = data.filter(item => item.date >= startDate);
    }
    if (endDate) {
      data = data.filter(item => item.date <= endDate);
    }

    return data.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Get recovery metrics
  getRecoveryMetrics(startDate?: Date, endDate?: Date): RecoveryMetrics[] {
    let data = [...this.recoveryMetrics];

    if (startDate) {
      data = data.filter(item => item.date >= startDate);
    }
    if (endDate) {
      data = data.filter(item => item.date <= endDate);
    }

    return data.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Get latest recovery metrics
  getLatestRecoveryMetrics(): RecoveryMetrics | null {
    if (this.recoveryMetrics.length === 0) return null;

    return this.recoveryMetrics[this.recoveryMetrics.length - 1];
  }

  // Update configuration
  updateConfig(config: Partial<DeviceIntegrationConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.autoSync !== undefined) {
      if (config.autoSync) {
        this.startAutoSync();
      } else {
        this.stopAutoSync();
      }
    }
  }

  // Get configuration
  getConfig(): DeviceIntegrationConfig {
    return { ...this.config };
  }

  // Clear all data
  clearAllData(): void {
    this.heartRateData = [];
    this.sleepData = [];
    this.activityData = [];
    this.recoveryMetrics = [];
    this.saveData();
    this.emit('dataCleared');
  }

  // Destroy service
  destroy(): void {
    this.stopAutoSync();
    this.eventListeners.clear();
  }
}

// Export singleton instance
export const wearableDeviceIntegration = new WearableDeviceIntegrationService();
