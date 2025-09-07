'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Database, 
  MemoryStick, 
  Clock, 
  RefreshCw,
  Trash2
} from 'lucide-react';
import { usePerformanceOptimization } from '@/lib/hooks/use-performance-optimization';

export function PerformanceOptimizationDashboard() {
  const {
    metrics,
    // paginateSessions,
    // paginateCheckIns,
    clearCache,
    getCacheSize,
    // getCacheHitRate,
    // getMemoryUsage,
    setCacheStrategy,
    setQueryOptimization,
    // setMemoryManagement,
    // debouncedQuery,
    // batchOperations,
  } = usePerformanceOptimization();

  const [isExpanded, setIsExpanded] = useState(false);
  const [cacheStrategy, setCacheStrategyState] = useState<'memory' | 'localStorage' | 'indexedDB' | 'none'>('memory');
  const [evictionPolicy, setEvictionPolicy] = useState<'lru' | 'fifo' | 'random'>('lru');
  const [batchSize, setBatchSize] = useState(50);
  const [debounceDelay, setDebounceDelay] = useState(300);

  // Update configuration when state changes
  useEffect(() => {
    setCacheStrategy({
      type: cacheStrategy,
      evictionPolicy: evictionPolicy,
    });
  }, [cacheStrategy, evictionPolicy]);

  useEffect(() => {
    setQueryOptimization({
      batchSize: batchSize,
      debounceDelay: debounceDelay,
    });
  }, [batchSize, debounceDelay]);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // const getPerformanceColor = (value: number, threshold: number) => {
  //   if (value <= threshold * 0.5) return 'text-green-600';
  //   if (value <= threshold) return 'text-yellow-600';
  //   return 'text-red-600';
  // };

  const getPerformanceBadge = (value: number, threshold: number) => {
    if (value <= threshold * 0.5) return 'bg-green-100 text-green-800';
    if (value <= threshold) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-4">
      {/* Main Performance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Optimization
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
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(metrics.queryTime)}</div>
                <p className="text-sm text-muted-foreground">Query Time</p>
                <Badge className={getPerformanceBadge(metrics.queryTime, 1000)}>
                  {metrics.queryTime < 500 ? 'Excellent' : metrics.queryTime < 1000 ? 'Good' : 'Slow'}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
                <Badge className={getPerformanceBadge(100 - metrics.cacheHitRate, 50)}>
                  {metrics.cacheHitRate > 80 ? 'Excellent' : metrics.cacheHitRate > 60 ? 'Good' : 'Poor'}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatBytes(metrics.memoryUsage)}</div>
                <p className="text-sm text-muted-foreground">Memory Usage</p>
                <Badge className={getPerformanceBadge(metrics.memoryUsage, 100)}>
                  {metrics.memoryUsage < 50 ? 'Low' : metrics.memoryUsage < 100 ? 'Medium' : 'High'}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{metrics.networkRequests}</div>
                <p className="text-sm text-muted-foreground">Network Requests</p>
                <Badge className={getPerformanceBadge(metrics.networkRequests, 100)}>
                  {metrics.networkRequests < 50 ? 'Low' : metrics.networkRequests < 100 ? 'Medium' : 'High'}
                </Badge>
              </div>
            </div>

            {/* Cache Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{getCacheSize()}</div>
                <p className="text-sm text-muted-foreground">Cache Entries</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatBytes(metrics.dataSize)}</div>
                <p className="text-sm text-muted-foreground">Data Size</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(metrics.queryTime)}</div>
                <p className="text-sm text-muted-foreground">Avg Query Time</p>
              </div>
            </div>

            {/* Performance Alerts */}
            {metrics.queryTime > 1000 && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Query time is slow ({formatTime(metrics.queryTime)}). Consider optimizing queries or increasing cache size.
                </AlertDescription>
              </Alert>
            )}

            {metrics.cacheHitRate < 50 && (
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  Cache hit rate is low ({metrics.cacheHitRate.toFixed(1)}%). Consider adjusting cache strategy.
                </AlertDescription>
              </Alert>
            )}

            {metrics.memoryUsage > 100 && (
              <Alert variant="destructive">
                <MemoryStick className="h-4 w-4" />
                <AlertDescription>
                  Memory usage is high ({formatBytes(metrics.memoryUsage)}). Consider clearing cache or reducing data size.
                </AlertDescription>
              </Alert>
            )}

            {/* Expanded View */}
            {isExpanded && (
              <div className="space-y-4 pt-4 border-t">
                {/* Cache Strategy Configuration */}
                <div>
                  <h4 className="font-medium mb-2">Cache Strategy</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Cache Type</label>
                      <select
                        value={cacheStrategy}
                        onChange={(e) => setCacheStrategyState(e.target.value as any)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="memory">Memory</option>
                        <option value="localStorage">Local Storage</option>
                        <option value="indexedDB">IndexedDB</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Eviction Policy</label>
                      <select
                        value={evictionPolicy}
                        onChange={(e) => setEvictionPolicy(e.target.value as any)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="lru">Least Recently Used</option>
                        <option value="fifo">First In, First Out</option>
                        <option value="random">Random</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Query Optimization Configuration */}
                <div>
                  <h4 className="font-medium mb-2">Query Optimization</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Batch Size</label>
                      <input
                        type="number"
                        value={batchSize}
                        onChange={(e) => setBatchSize(parseInt(e.target.value))}
                        className="w-full p-2 border rounded"
                        min="1"
                        max="1000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Debounce Delay (ms)</label>
                      <input
                        type="number"
                        value={debounceDelay}
                        onChange={(e) => setDebounceDelay(parseInt(e.target.value))}
                        className="w-full p-2 border rounded"
                        min="0"
                        max="5000"
                      />
                    </div>
                  </div>
                </div>

                {/* Performance Actions */}
                <div>
                  <h4 className="font-medium mb-2">Performance Actions</h4>
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
                        // Force garbage collection if available
                        if (window.gc) {
                          window.gc();
                        }
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Force GC
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Optimize performance
                        setQueryOptimization({
                          enableIndexing: true,
                          enableCompression: true,
                          enableDeduplication: true,
                        });
                      }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Optimize
                    </Button>
                  </div>
                </div>

                {/* Performance Metrics Chart */}
                <div>
                  <h4 className="font-medium mb-2">Performance Trends</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Query Time</span>
                        <span className="text-sm text-muted-foreground">{formatTime(metrics.queryTime)}</span>
                      </div>
                      <Progress value={Math.min(100, (metrics.queryTime / 1000) * 100)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Cache Hit Rate</span>
                        <span className="text-sm text-muted-foreground">{metrics.cacheHitRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={metrics.cacheHitRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Memory Usage</span>
                        <span className="text-sm text-muted-foreground">{formatBytes(metrics.memoryUsage)}</span>
                      </div>
                      <Progress value={Math.min(100, (metrics.memoryUsage / 100) * 100)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Data Size</span>
                        <span className="text-sm text-muted-foreground">{formatBytes(metrics.dataSize)}</span>
                      </div>
                      <Progress value={Math.min(100, (metrics.dataSize / (1024 * 1024)) * 100)} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
