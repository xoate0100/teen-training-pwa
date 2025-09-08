'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Heart,
  Moon,
  Activity,
  TrendingUp,
  Smartphone,
  Watch,
  Headphones,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  Trash2,
  Settings,
  AlertTriangle,
  CheckCircle,
  Battery,
  Clock,
  Target,
  Zap,
} from 'lucide-react';
import { useWearableDeviceIntegration } from '@/lib/hooks/use-wearable-device-integration';
import {
  WearableDevice,
  HeartRateData,
  SleepData,
  ActivityData,
  RecoveryMetrics,
} from '@/lib/services/wearable-device-integration';

export function WearableDeviceDashboard() {
  const {
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
    isSyncing,
    error,
  } = useWearableDeviceIntegration();

  const [heartRateData, setHeartRateData] = useState<HeartRateData[]>([]);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [recoveryMetrics, setRecoveryMetrics] = useState<RecoveryMetrics[]>([]);
  const [latestRecovery, setLatestRecovery] = useState<RecoveryMetrics | null>(
    null
  );
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'fitness_tracker' as const,
    brand: '',
    model: '',
    capabilities: [] as string[],
  });

  // Update data periodically
  useEffect(() => {
    const updateData = () => {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      setHeartRateData(getHeartRateData(weekAgo, today));
      setSleepData(getSleepData(weekAgo, today));
      setActivityData(getActivityData(weekAgo, today));
      setRecoveryMetrics(getRecoveryMetrics(weekAgo, today));
      setLatestRecovery(getLatestRecoveryMetrics());
    };

    updateData();
    const interval = setInterval(updateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [
    getHeartRateData,
    getSleepData,
    getActivityData,
    getRecoveryMetrics,
    getLatestRecoveryMetrics,
  ]);

  // Handle add device
  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.brand || !newDevice.model) return;

    try {
      await connectDevice({
        name: newDevice.name,
        type: newDevice.type,
        brand: newDevice.brand,
        model: newDevice.model,
        capabilities: newDevice.capabilities,
        batteryLevel: 100,
      });

      setNewDevice({
        name: '',
        type: 'fitness_tracker',
        brand: '',
        model: '',
        capabilities: [],
      });
      setShowAddDevice(false);
    } catch (error) {
      console.error('Failed to add device:', error);
    }
  };

  // Handle sync all devices
  const handleSyncAll = async () => {
    try {
      await syncAllDevices();
    } catch (error) {
      console.error('Failed to sync devices:', error);
    }
  };

  // Get device icon
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'fitness_tracker':
        return <Activity className='h-5 w-5' />;
      case 'smartwatch':
        return <Watch className='h-5 w-5' />;
      case 'chest_strap':
        return <Heart className='h-5 w-5' />;
      case 'earbuds':
        return <Headphones className='h-5 w-5' />;
      default:
        return <Smartphone className='h-5 w-5' />;
    }
  };

  // Get device type label
  const getDeviceTypeLabel = (type: string) => {
    switch (type) {
      case 'fitness_tracker':
        return 'Fitness Tracker';
      case 'smartwatch':
        return 'Smartwatch';
      case 'chest_strap':
        return 'Chest Strap';
      case 'earbuds':
        return 'Earbuds';
      default:
        return 'Unknown';
    }
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Format distance
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  // Get recovery score color
  const getRecoveryScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get recovery score badge
  const getRecoveryScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className='space-y-6'>
      {/* Device Management */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Smartphone className='h-5 w-5' />
              Wearable Devices ({devices.length})
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowAddDevice(!showAddDevice)}
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Device
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleSyncAll}
                disabled={isSyncing || connectedDevices.length === 0}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`}
                />
                Sync All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Add Device Form */}
            {showAddDevice && (
              <div className='p-4 border rounded-lg bg-gray-50'>
                <h4 className='font-medium mb-3'>Add New Device</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Device Name
                    </label>
                    <input
                      type='text'
                      value={newDevice.name}
                      onChange={e =>
                        setNewDevice(prev => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className='w-full p-2 border rounded'
                      placeholder='e.g., My Fitness Tracker'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Type
                    </label>
                    <select
                      value={newDevice.type}
                      onChange={e =>
                        setNewDevice(prev => ({
                          ...prev,
                          type: e.target.value as any,
                        }))
                      }
                      className='w-full p-2 border rounded'
                    >
                      <option value='fitness_tracker'>Fitness Tracker</option>
                      <option value='smartwatch'>Smartwatch</option>
                      <option value='chest_strap'>Chest Strap</option>
                      <option value='earbuds'>Earbuds</option>
                    </select>
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Brand
                    </label>
                    <input
                      type='text'
                      value={newDevice.brand}
                      onChange={e =>
                        setNewDevice(prev => ({
                          ...prev,
                          brand: e.target.value,
                        }))
                      }
                      className='w-full p-2 border rounded'
                      placeholder='e.g., Fitbit, Apple, Garmin'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium mb-2 block'>
                      Model
                    </label>
                    <input
                      type='text'
                      value={newDevice.model}
                      onChange={e =>
                        setNewDevice(prev => ({
                          ...prev,
                          model: e.target.value,
                        }))
                      }
                      className='w-full p-2 border rounded'
                      placeholder='e.g., Charge 5, Series 9, Forerunner 945'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <label className='text-sm font-medium mb-2 block'>
                    Capabilities
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    {[
                      'heart_rate',
                      'sleep',
                      'activity',
                      'recovery',
                      'gps',
                      'notifications',
                    ].map(capability => (
                      <label
                        key={capability}
                        className='flex items-center gap-2'
                      >
                        <input
                          type='checkbox'
                          checked={newDevice.capabilities.includes(capability)}
                          onChange={e => {
                            if (e.target.checked) {
                              setNewDevice(prev => ({
                                ...prev,
                                capabilities: [
                                  ...prev.capabilities,
                                  capability,
                                ],
                              }));
                            } else {
                              setNewDevice(prev => ({
                                ...prev,
                                capabilities: prev.capabilities.filter(
                                  c => c !== capability
                                ),
                              }));
                            }
                          }}
                        />
                        <span className='text-sm'>
                          {capability.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className='flex gap-2 mt-4'>
                  <Button
                    onClick={handleAddDevice}
                    disabled={
                      !newDevice.name || !newDevice.brand || !newDevice.model
                    }
                  >
                    Add Device
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => setShowAddDevice(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Device List */}
            <div className='space-y-3'>
              {devices.map(device => (
                <div
                  key={device.id}
                  className='flex items-center justify-between p-3 border rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    {getDeviceIcon(device.type)}
                    <div>
                      <h4 className='font-medium'>{device.name}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {device.brand} {device.model} •{' '}
                        {getDeviceTypeLabel(device.type)}
                      </p>
                      <div className='flex items-center gap-2 mt-1'>
                        {device.connected ? (
                          <Badge className='bg-green-100 text-green-800'>
                            <Wifi className='h-3 w-3 mr-1' />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant='outline'>
                            <WifiOff className='h-3 w-3 mr-1' />
                            Disconnected
                          </Badge>
                        )}
                        <Badge variant='outline'>
                          <Battery className='h-3 w-3 mr-1' />
                          {device.batteryLevel}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    {device.connected && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => syncDevice(device.id)}
                        disabled={isSyncing}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
                        />
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => disconnectDevice(device.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {devices.length === 0 && (
              <div className='text-center text-muted-foreground py-8'>
                No devices connected. Add a device to start tracking your health
                metrics.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Health Metrics Overview */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Heart Rate */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <Heart className='h-4 w-4' />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {heartRateData.length > 0
                ? Math.round(heartRateData[heartRateData.length - 1].bpm)
                : '--'}{' '}
              BPM
            </div>
            <p className='text-xs text-muted-foreground'>
              {heartRateData.length > 0
                ? heartRateData[heartRateData.length - 1].zone.replace('_', ' ')
                : 'No data'}
            </p>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <Moon className='h-4 w-4' />
              Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {sleepData.length > 0
                ? formatDuration(sleepData[sleepData.length - 1].totalSleep)
                : '--'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {sleepData.length > 0
                ? `${Math.round(sleepData[sleepData.length - 1].sleepScore)} score`
                : 'No data'}
            </p>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <Activity className='h-4 w-4' />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {activityData.length > 0
                ? activityData[activityData.length - 1].steps.toLocaleString()
                : '--'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {activityData.length > 0
                ? `${formatDistance(activityData[activityData.length - 1].distance)}`
                : 'No data'}
            </p>
          </CardContent>
        </Card>

        {/* Recovery */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <TrendingUp className='h-4 w-4' />
              Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {latestRecovery ? `${latestRecovery.readinessScore}%` : '--'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {latestRecovery ? `${latestRecovery.hrv}ms HRV` : 'No data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Heart Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Heart className='h-5 w-5' />
              Heart Rate Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {heartRateData.slice(-24).map((data, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    {data.timestamp.toLocaleTimeString()}
                  </span>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium'>{data.bpm} BPM</span>
                    <Badge variant='outline' className='text-xs'>
                      {data.zone.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sleep Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Moon className='h-5 w-5' />
              Sleep Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {sleepData.slice(-7).map((data, index) => (
                <div key={index} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      {data.date.toLocaleDateString()}
                    </span>
                    <Badge className={getRecoveryScoreBadge(data.sleepScore)}>
                      {data.sleepScore} score
                    </Badge>
                  </div>
                  <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
                    <div>Total: {formatDuration(data.totalSleep)}</div>
                    <div>Efficiency: {Math.round(data.sleepEfficiency)}%</div>
                    <div>Deep: {formatDuration(data.deepSleep)}</div>
                    <div>REM: {formatDuration(data.remSleep)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recovery Recommendations */}
      {latestRecovery && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Recovery Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold'>{latestRecovery.hrv}ms</div>
                <p className='text-sm text-muted-foreground'>HRV</p>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>
                  {latestRecovery.restingHeartRate} BPM
                </div>
                <p className='text-sm text-muted-foreground'>Resting HR</p>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold'>
                  {latestRecovery.stressLevel}%
                </div>
                <p className='text-sm text-muted-foreground'>Stress Level</p>
              </div>
            </div>

            <div className='space-y-2'>
              <h4 className='font-medium'>Recommendations:</h4>
              {latestRecovery.recommendations.map((recommendation, index) => (
                <div key={index} className='flex items-start gap-2 text-sm'>
                  <CheckCircle className='h-4 w-4 text-green-600 mt-0.5' />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={config.enableHeartRate}
                  onChange={e =>
                    updateConfig({ enableHeartRate: e.target.checked })
                  }
                />
                <span className='text-sm'>Enable Heart Rate Tracking</span>
              </label>
            </div>
            <div>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={config.enableSleepTracking}
                  onChange={e =>
                    updateConfig({ enableSleepTracking: e.target.checked })
                  }
                />
                <span className='text-sm'>Enable Sleep Tracking</span>
              </label>
            </div>
            <div>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={config.enableActivityTracking}
                  onChange={e =>
                    updateConfig({ enableActivityTracking: e.target.checked })
                  }
                />
                <span className='text-sm'>Enable Activity Tracking</span>
              </label>
            </div>
            <div>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={config.enableRecoveryMetrics}
                  onChange={e =>
                    updateConfig({ enableRecoveryMetrics: e.target.checked })
                  }
                />
                <span className='text-sm'>Enable Recovery Metrics</span>
              </label>
            </div>
            <div>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={config.autoSync}
                  onChange={e => updateConfig({ autoSync: e.target.checked })}
                />
                <span className='text-sm'>Auto Sync</span>
              </label>
            </div>
            <div>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={config.privacyMode}
                  onChange={e =>
                    updateConfig({ privacyMode: e.target.checked })
                  }
                />
                <span className='text-sm'>Privacy Mode</span>
              </label>
            </div>
          </div>

          <div className='mt-4 pt-4 border-t'>
            <Button variant='outline' onClick={clearAllData}>
              <Trash2 className='h-4 w-4 mr-2' />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
