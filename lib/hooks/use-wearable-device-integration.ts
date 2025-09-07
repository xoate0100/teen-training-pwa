'use client';

import { useState, useEffect, useCallback } from 'react';
import { wearableDeviceIntegration } from '@/lib/services/wearable-device-integration';
import { 
  WearableDevice, 
  HeartRateData, 
  SleepData, 
  ActivityData, 
  RecoveryMetrics,
  DeviceIntegrationConfig 
} from '@/lib/services/wearable-device-integration';

export interface UseWearableDeviceIntegrationReturn {
  // Device management
  devices: WearableDevice[];
  connectedDevices: WearableDevice[];
  connectDevice: (device: Omit<WearableDevice, 'id' | 'connected' | 'lastSync'>) => Promise<string>;
  disconnectDevice: (deviceId: string) => void;
  syncDevice: (deviceId: string) => Promise<void>;
  syncAllDevices: () => Promise<void>;
  
  // Data access
  getHeartRateData: (startDate?: Date, endDate?: Date) => HeartRateData[];
  getSleepData: (startDate?: Date, endDate?: Date) => SleepData[];
  getActivityData: (startDate?: Date, endDate?: Date) => ActivityData[];
  getRecoveryMetrics: (startDate?: Date, endDate?: Date) => RecoveryMetrics[];
  getLatestRecoveryMetrics: () => RecoveryMetrics | null;
  
  // Configuration
  config: DeviceIntegrationConfig;
  updateConfig: (config: Partial<DeviceIntegrationConfig>) => void;
  
  // Data management
  clearAllData: () => void;
  
  // Event handlers
  onDeviceConnected: (callback: (device: WearableDevice) => void) => void;
  onDeviceDisconnected: (callback: (device: WearableDevice) => void) => void;
  onSyncStart: (callback: (data: { deviceId: string }) => void) => void;
  onSyncComplete: (callback: (data: { deviceId: string }) => void) => void;
  onSyncError: (callback: (data: { deviceId: string; error: any }) => void) => void;
  onDataCleared: (callback: () => void) => void;
  
  // Loading states
  isSyncing: boolean;
  error: string | null;
}

export function useWearableDeviceIntegration(): UseWearableDeviceIntegrationReturn {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>([]);
  const [config, setConfig] = useState<DeviceIntegrationConfig>(wearableDeviceIntegration.getConfig());
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update devices when they change
  useEffect(() => {
    const updateDevices = () => {
      setDevices(wearableDeviceIntegration.getDevices());
      setConnectedDevices(wearableDeviceIntegration.getConnectedDevices());
    };

    updateDevices();
    
    // Update devices every 5 seconds
    const interval = setInterval(updateDevices, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Connect device
  const connectDevice = useCallback(async (device: Omit<WearableDevice, 'id' | 'connected' | 'lastSync'>) => {
    try {
      setError(null);
      const deviceId = await wearableDeviceIntegration.connectDevice(device);
      setDevices(wearableDeviceIntegration.getDevices());
      setConnectedDevices(wearableDeviceIntegration.getConnectedDevices());
      return deviceId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect device';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Disconnect device
  const disconnectDevice = useCallback((deviceId: string) => {
    wearableDeviceIntegration.disconnectDevice(deviceId);
    setDevices(wearableDeviceIntegration.getDevices());
    setConnectedDevices(wearableDeviceIntegration.getConnectedDevices());
  }, []);

  // Sync device
  const syncDevice = useCallback(async (deviceId: string) => {
    try {
      setIsSyncing(true);
      setError(null);
      await wearableDeviceIntegration.syncDevice(deviceId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync device';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync all devices
  const syncAllDevices = useCallback(async () => {
    try {
      setIsSyncing(true);
      setError(null);
      await wearableDeviceIntegration.syncAllDevices();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync devices';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Get heart rate data
  const getHeartRateData = useCallback((startDate?: Date, endDate?: Date) => {
    return wearableDeviceIntegration.getHeartRateData(startDate, endDate);
  }, []);

  // Get sleep data
  const getSleepData = useCallback((startDate?: Date, endDate?: Date) => {
    return wearableDeviceIntegration.getSleepData(startDate, endDate);
  }, []);

  // Get activity data
  const getActivityData = useCallback((startDate?: Date, endDate?: Date) => {
    return wearableDeviceIntegration.getActivityData(startDate, endDate);
  }, []);

  // Get recovery metrics
  const getRecoveryMetrics = useCallback((startDate?: Date, endDate?: Date) => {
    return wearableDeviceIntegration.getRecoveryMetrics(startDate, endDate);
  }, []);

  // Get latest recovery metrics
  const getLatestRecoveryMetrics = useCallback(() => {
    return wearableDeviceIntegration.getLatestRecoveryMetrics();
  }, []);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<DeviceIntegrationConfig>) => {
    wearableDeviceIntegration.updateConfig(newConfig);
    setConfig(wearableDeviceIntegration.getConfig());
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    wearableDeviceIntegration.clearAllData();
  }, []);

  // Event handlers
  const onDeviceConnected = useCallback((callback: (device: WearableDevice) => void) => {
    wearableDeviceIntegration.on('deviceConnected', callback);
  }, []);

  const onDeviceDisconnected = useCallback((callback: (device: WearableDevice) => void) => {
    wearableDeviceIntegration.on('deviceDisconnected', callback);
  }, []);

  const onSyncStart = useCallback((callback: (data: { deviceId: string }) => void) => {
    wearableDeviceIntegration.on('syncStart', callback);
  }, []);

  const onSyncComplete = useCallback((callback: (data: { deviceId: string }) => void) => {
    wearableDeviceIntegration.on('syncComplete', callback);
  }, []);

  const onSyncError = useCallback((callback: (data: { deviceId: string; error: any }) => void) => {
    wearableDeviceIntegration.on('syncError', callback);
  }, []);

  const onDataCleared = useCallback((callback: () => void) => {
    wearableDeviceIntegration.on('dataCleared', callback);
  }, []);

  return {
    devices,
    connectedDevices,
    connectDevice,
    disconnectDevice,
    syncDevice,
    syncAllDevices,
    getHeartRateData,
    getSleepData,
    getActivityData,
    getRecoveryMetrics,
    getLatestRecoveryMetrics,
    config,
    updateConfig,
    clearAllData,
    onDeviceConnected,
    onDeviceDisconnected,
    onSyncStart,
    onSyncComplete,
    onSyncError,
    onDataCleared,
    isSyncing,
    error,
  };
}
