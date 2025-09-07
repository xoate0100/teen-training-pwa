'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  Clock,
  Database,
  Sync,
  Trash2,
  Cloud,
  CloudOff
} from 'lucide-react';
import { useOfflineFirst } from '@/lib/hooks/use-offline-first';

export function OfflineFirstDashboard() {
  const {
    cache,
    isOnline,
    pendingChangesCount,
    cacheSessionData,
    cacheCheckInData,
    getCachedSessions,
    getCachedCheckIns,
    clearCache,
    forceSync,
    syncPendingChanges,
    setSyncStrategy,
    onOnline,
    onOffline,
    onPendingChangeAdded,
    onSyncError,
    onCacheCleared,
  } = useOfflineFirst();

  const [isExpanded, setIsExpanded] = useState(false);
  const [syncHistory, setSyncHistory] = useState<Array<{ time: Date; status: string; message: string }>>([]);
  const [syncStrategy, setSyncStrategyState] = useState<'immediate' | 'background' | 'manual'>('background');

  // Set up event listeners
  useEffect(() => {
    const handleOnline = () => {
      setSyncHistory(prev => [...prev, { 
        time: new Date(), 
        status: 'online', 
        message: 'Connection restored' 
      }]);
    };

    const handleOffline = () => {
      setSyncHistory(prev => [...prev, { 
        time: new Date(), 
        status: 'offline', 
        message: 'Connection lost' 
      }]);
    };

    const handlePendingChangeAdded = (change: any) => {
      setSyncHistory(prev => [...prev, { 
        time: new Date(), 
        status: 'pending', 
        message: `Pending change added: ${change.type}` 
      }]);
    };

    const handleSyncError = (error: any) => {
      setSyncHistory(prev => [...prev, { 
        time: new Date(), 
        status: 'error', 
        message: `Sync error: ${error.message || 'Unknown error'}` 
      }]);
    };

    const handleCacheCleared = () => {
      setSyncHistory(prev => [...prev, { 
        time: new Date(), 
        status: 'cleared', 
        message: 'Cache cleared' 
      }]);
    };

    onOnline(handleOnline);
    onOffline(handleOffline);
    onPendingChangeAdded(handlePendingChangeAdded);
    onSyncError(handleSyncError);
    onCacheCleared(handleCacheCleared);

    return () => {
      // Cleanup event listeners
      onOnline(() => {});
      onOffline(() => {});
      onPendingChangeAdded(() => {});
      onSyncError(() => {});
      onCacheCleared(() => {});
    };
  }, [onOnline, onOffline, onPendingChangeAdded, onSyncError, onCacheCleared]);

  const getStatusIcon = () => {
    if (isOnline) {
      return <Wifi className="h-5 w-5 text-green-600" />;
    } else {
      return <WifiOff className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    if (isOnline) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = () => {
    if (isOnline) {
      return 'Online';
    } else {
      return 'Offline';
    }
  };

  const formatCacheSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
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

  const handleSyncStrategyChange = (strategy: 'immediate' | 'background' | 'manual') => {
    setSyncStrategyState(strategy);
    setSyncStrategy({ type: strategy });
  };

  return (
    <div className="space-y-4">
      {/* Main Offline Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Offline-First Architecture
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status Overview */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getStatusText()}</span>
                    <Badge className={getStatusColor()}>
                      {isOnline ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last sync: {formatLastSyncTime(cache.lastSyncTime)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={syncPendingChanges}
                  disabled={!isOnline}
                >
                  <Sync className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={forceSync}
                  disabled={!isOnline}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Force Sync
                </Button>
              </div>
            </div>

            {/* Cache Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{cache.sessions.length}</div>
                <p className="text-sm text-muted-foreground">Cached Sessions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{cache.checkIns.length}</div>
                <p className="text-sm text-muted-foreground">Cached Check-ins</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCacheSize(cache.cacheSize)}</div>
                <p className="text-sm text-muted-foreground">Cache Size</p>
              </div>
            </div>

            {/* Pending Changes */}
            {pendingChangesCount > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-600">
                  {pendingChangesCount} pending changes
                </span>
              </div>
            )}

            {/* Cache Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Cache Usage</span>
                <span className="text-sm text-muted-foreground">
                  {formatCacheSize(cache.cacheSize)} / {formatCacheSize(cache.maxCacheSize)}
                </span>
              </div>
              <Progress 
                value={(cache.cacheSize / cache.maxCacheSize) * 100} 
                className="h-2" 
              />
            </div>

            {/* Expanded View */}
            {isExpanded && (
              <div className="space-y-4 pt-4 border-t">
                {/* Sync Strategy */}
                <div>
                  <h4 className="font-medium mb-2">Sync Strategy</h4>
                  <div className="flex gap-2">
                    <Button
                      variant={syncStrategy === 'immediate' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSyncStrategyChange('immediate')}
                    >
                      Immediate
                    </Button>
                    <Button
                      variant={syncStrategy === 'background' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSyncStrategyChange('background')}
                    >
                      Background
                    </Button>
                    <Button
                      variant={syncStrategy === 'manual' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSyncStrategyChange('manual')}
                    >
                      Manual
                    </Button>
                  </div>
                </div>

                {/* Cache Management */}
                <div>
                  <h4 className="font-medium mb-2">Cache Management</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCache}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const sessions = getCachedSessions();
                        const checkIns = getCachedCheckIns();
                        console.log('Cached Sessions:', sessions);
                        console.log('Cached Check-ins:', checkIns);
                      }}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Export Cache
                    </Button>
                  </div>
                </div>

                {/* Sync History */}
                {syncHistory.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recent Activity</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {syncHistory.slice(-5).reverse().map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            {entry.status === 'online' && <Wifi className="h-4 w-4 text-green-600" />}
                            {entry.status === 'offline' && <WifiOff className="h-4 w-4 text-red-600" />}
                            {entry.status === 'pending' && <Clock className="h-4 w-4 text-orange-600" />}
                            {entry.status === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {entry.status === 'cleared' && <Trash2 className="h-4 w-4 text-gray-600" />}
                          </div>
                          <span className="text-muted-foreground">
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
