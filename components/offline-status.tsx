'use client';

import { useState, useEffect } from 'react';
import { useValidation } from '@/lib/hooks/use-validation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function OfflineStatus() {
  const { getOfflineStatus, needsSync, getStorageInfo } = useValidation();
  const [status, setStatus] = useState(getOfflineStatus());
  const [storageInfo, setStorageInfo] = useState(getStorageInfo());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(getOfflineStatus());
      setStorageInfo(getStorageInfo());
    };

    // Update status on online/offline events
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    // Update status periodically
    const interval = window.setInterval(updateStatus, 5000);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      window.clearInterval(interval);
    };
  }, [getOfflineStatus, getStorageInfo]);

  const handleSyncClick = () => {
    if (needsSync()) {
      toast.info('Sync will happen automatically when you perform actions');
    } else {
      toast.success('All data is up to date');
    }
  };

  const getStatusIcon = () => {
    if (status.isOffline) {
      return <WifiOff className='w-4 h-4 text-red-500' />;
    }
    if (needsSync()) {
      return <RefreshCw className='w-4 h-4 text-yellow-500' />;
    }
    return <Wifi className='w-4 h-4 text-green-500' />;
  };

  const getStatusText = () => {
    if (status.isOffline) {
      return 'Offline';
    }
    if (needsSync()) {
      return 'Sync Pending';
    }
    return 'Online';
  };

  const getStatusVariant = () => {
    if (status.isOffline) {
      return 'destructive' as const;
    }
    if (needsSync()) {
      return 'secondary' as const;
    }
    return 'default' as const;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageColor = () => {
    if (storageInfo.percentage > 90) return 'text-red-500';
    if (storageInfo.percentage > 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className='relative'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setShowDetails(!showDetails)}
        className='flex items-center gap-2'
      >
        {getStatusIcon()}
        <span className='hidden sm:inline'>{getStatusText()}</span>
        {needsSync() && (
          <Badge variant='secondary' className='ml-1'>
            {status.queuedItems}
          </Badge>
        )}
      </Button>

      {showDetails && (
        <Card className='absolute right-0 top-12 w-80 z-50 shadow-lg'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg flex items-center gap-2'>
              {getStatusIcon()}
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Connection Status */}
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Status</span>
              <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
            </div>

            {/* Last Sync */}
            {status.lastSync && (
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Last Sync</span>
                <span className='text-sm text-muted-foreground'>
                  {new Date(status.lastSync).toLocaleString()}
                </span>
              </div>
            )}

            {/* Queued Items */}
            {status.queuedItems > 0 && (
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Pending Sync</span>
                <Badge variant='secondary'>{status.queuedItems} items</Badge>
              </div>
            )}

            {/* Storage Usage */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Storage Usage</span>
                <span className={`text-sm font-medium ${getStorageColor()}`}>
                  {storageInfo.percentage.toFixed(1)}%
                </span>
              </div>
              <div className='w-full bg-muted rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all ${
                    storageInfo.percentage > 90
                      ? 'bg-red-500'
                      : storageInfo.percentage > 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                />
              </div>
              <div className='text-xs text-muted-foreground'>
                {formatBytes(storageInfo.used)} /{' '}
                {formatBytes(storageInfo.used + storageInfo.available)}
              </div>
            </div>

            {/* Warnings */}
            {status.isOffline && (
              <div className='flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <AlertTriangle className='w-4 h-4 text-yellow-600 mt-0.5' />
                <div className='text-sm'>
                  <p className='font-medium text-yellow-800'>Offline Mode</p>
                  <p className='text-yellow-700'>
                    Your data will be saved locally and synced when connection
                    is restored.
                  </p>
                </div>
              </div>
            )}

            {needsSync() && !status.isOffline && (
              <div className='flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <RefreshCw className='w-4 h-4 text-blue-600 mt-0.5' />
                <div className='text-sm'>
                  <p className='font-medium text-blue-800'>Sync Pending</p>
                  <p className='text-blue-700'>
                    {status.queuedItems} items waiting to sync.
                  </p>
                </div>
              </div>
            )}

            {!status.isOffline && !needsSync() && (
              <div className='flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg'>
                <CheckCircle className='w-4 h-4 text-green-600 mt-0.5' />
                <div className='text-sm'>
                  <p className='font-medium text-green-800'>All Up to Date</p>
                  <p className='text-green-700'>
                    Your data is synced and current.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className='flex gap-2 pt-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleSyncClick}
                className='flex-1'
                disabled={status.isOffline}
              >
                <RefreshCw className='w-4 h-4 mr-2' />
                {needsSync() ? 'Sync Now' : 'Check Sync'}
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
