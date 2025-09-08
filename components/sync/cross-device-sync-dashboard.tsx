'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Settings,
  Sync,
  Cloud,
  Shield,
} from 'lucide-react';
import { useCrossDeviceSync } from '@/lib/hooks/use-cross-device-sync';

export function CrossDeviceSyncDashboard() {
  const {
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
  } = useCrossDeviceSync();

  const [isExpanded, setIsExpanded] = useState(false);
  const [syncHistory, setSyncHistory] = useState<
    Array<{ time: Date; status: string; message: string }>
  >([]);

  // Set up event listeners
  useEffect(() => {
    const handleSyncStart = () => {
      setSyncHistory(prev => [
        ...prev,
        {
          time: new Date(),
          status: 'started',
          message: 'Sync started',
        },
      ]);
    };

    const handleSyncComplete = (status: any) => {
      setSyncHistory(prev => [
        ...prev,
        {
          time: new Date(),
          status: 'completed',
          message: 'Sync completed successfully',
        },
      ]);
    };

    const handleSyncError = (error: Error) => {
      setSyncHistory(prev => [
        ...prev,
        {
          time: new Date(),
          status: 'error',
          message: `Sync failed: ${error.message}`,
        },
      ]);
    };

    const handleAchievementUnlocked = (achievement: any) => {
      setSyncHistory(prev => [
        ...prev,
        {
          time: new Date(),
          status: 'achievement',
          message: `Achievement unlocked: ${achievement.name}`,
        },
      ]);
    };

    const handleProgressUpdated = (progress: any) => {
      setSyncHistory(prev => [
        ...prev,
        {
          time: new Date(),
          status: 'progress',
          message: 'Progress updated',
        },
      ]);
    };

    const handlePreferencesUpdated = (preferences: any) => {
      setSyncHistory(prev => [
        ...prev,
        {
          time: new Date(),
          status: 'preferences',
          message: 'Preferences updated',
        },
      ]);
    };

    onSyncStart(handleSyncStart);
    onSyncComplete(handleSyncComplete);
    onSyncError(handleSyncError);
    onAchievementUnlocked(handleAchievementUnlocked);
    onProgressUpdated(handleProgressUpdated);
    onPreferencesUpdated(handlePreferencesUpdated);

    return () => {
      // Cleanup event listeners
      onSyncStart(() => {});
      onSyncComplete(() => {});
      onSyncError(() => {});
      onAchievementUnlocked(() => {});
      onProgressUpdated(() => {});
      onPreferencesUpdated(() => {});
    };
  }, [
    onSyncStart,
    onSyncComplete,
    onSyncError,
    onAchievementUnlocked,
    onProgressUpdated,
    onPreferencesUpdated,
  ]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className='h-5 w-5' />;
      case 'tablet':
        return <Tablet className='h-5 w-5' />;
      case 'desktop':
        return <Monitor className='h-5 w-5' />;
      default:
        return <Settings className='h-5 w-5' />;
    }
  };

  const getStatusIcon = () => {
    if (syncStatus.syncInProgress) {
      return <RefreshCw className='h-5 w-5 animate-spin' />;
    } else if (syncStatus.isOnline) {
      return <Wifi className='h-5 w-5 text-green-600' />;
    } else {
      return <WifiOff className='h-5 w-5 text-red-600' />;
    }
  };

  const getStatusColor = () => {
    if (syncStatus.syncInProgress) {
      return 'bg-blue-100 text-blue-800';
    } else if (syncStatus.isOnline) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = () => {
    if (syncStatus.syncInProgress) {
      return 'Syncing...';
    } else if (syncStatus.isOnline) {
      return 'Online';
    } else {
      return 'Offline';
    }
  };

  const formatLastSyncTime = (time: Date | null) => {
    if (!time) return 'Never';
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className='space-y-4'>
      {/* Main Sync Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Cloud className='h-5 w-5' />
              Cross-Device Sync
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Status Overview */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                {getStatusIcon()}
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium'>{getStatusText()}</span>
                    <Badge className={getStatusColor()}>
                      {syncStatus.isOnline ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Last sync: {formatLastSyncTime(syncStatus.lastSyncTime)}
                  </p>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={syncNow}
                  disabled={!isOnline() || isSyncInProgress()}
                >
                  <Sync className='h-4 w-4 mr-2' />
                  Sync Now
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={forceSync}
                  disabled={!isOnline() || isSyncInProgress()}
                >
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Force Sync
                </Button>
              </div>
            </div>

            {/* Pending Changes */}
            {getPendingChangesCount() > 0 && (
              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4 text-orange-600' />
                <span className='text-sm text-orange-600'>
                  {getPendingChangesCount()} pending changes
                </span>
              </div>
            )}

            {/* Conflicts */}
            {syncStatus.conflicts.length > 0 && (
              <Alert>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>
                  {syncStatus.conflicts.length} sync conflicts detected.
                  <Button
                    variant='link'
                    size='sm'
                    onClick={clearConflicts}
                    className='ml-2'
                  >
                    Clear conflicts
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Error */}
            {syncStatus.error && (
              <Alert variant='destructive'>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>
                  Sync error: {syncStatus.error}
                </AlertDescription>
              </Alert>
            )}

            {/* Expanded View */}
            {isExpanded && (
              <div className='space-y-4 pt-4 border-t'>
                {/* Device Info */}
                <div>
                  <h4 className='font-medium mb-2'>Device Information</h4>
                  <div className='flex items-center gap-2 p-3 bg-muted rounded-lg'>
                    {getDeviceIcon(deviceInfo.type)}
                    <div>
                      <p className='font-medium'>{deviceInfo.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        {deviceInfo.type} • {deviceInfo.version}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sync Progress */}
                {syncStatus.syncInProgress && (
                  <div>
                    <h4 className='font-medium mb-2'>Sync Progress</h4>
                    <Progress value={50} className='h-2' />
                    <p className='text-sm text-muted-foreground mt-1'>
                      Syncing data across devices...
                    </p>
                  </div>
                )}

                {/* Sync History */}
                {syncHistory.length > 0 && (
                  <div>
                    <h4 className='font-medium mb-2'>Recent Activity</h4>
                    <div className='space-y-2 max-h-40 overflow-y-auto'>
                      {syncHistory
                        .slice(-5)
                        .reverse()
                        .map((entry, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-2 text-sm'
                          >
                            <div className='flex items-center gap-1'>
                              {entry.status === 'completed' && (
                                <CheckCircle className='h-4 w-4 text-green-600' />
                              )}
                              {entry.status === 'error' && (
                                <AlertTriangle className='h-4 w-4 text-red-600' />
                              )}
                              {entry.status === 'started' && (
                                <RefreshCw className='h-4 w-4 text-blue-600' />
                              )}
                              {entry.status === 'achievement' && (
                                <Shield className='h-4 w-4 text-purple-600' />
                              )}
                              {entry.status === 'progress' && (
                                <Progress className='h-4 w-4 text-blue-600' />
                              )}
                              {entry.status === 'preferences' && (
                                <Settings className='h-4 w-4 text-gray-600' />
                              )}
                            </div>
                            <span className='text-muted-foreground'>
                              {entry.time.toLocaleTimeString()}
                            </span>
                            <span>{entry.message}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
