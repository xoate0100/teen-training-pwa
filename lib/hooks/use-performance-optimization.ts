'use client';

import { useState, useEffect, useCallback } from 'react';
import { performanceOptimization } from '@/lib/services/performance-optimization';
import {
  PaginationOptions,
  PaginatedResult,
  CacheStrategy,
  QueryOptimization,
  MemoryManagement,
  PerformanceMetrics,
} from '@/lib/services/performance-optimization';
import { SessionData, CheckInData } from '@/lib/services/database-service';

export interface UsePerformanceOptimizationReturn {
  // Performance metrics
  metrics: PerformanceMetrics;

  // Pagination
  paginateSessions: (
    options: PaginationOptions
  ) => Promise<PaginatedResult<SessionData>>;
  paginateCheckIns: (
    options: PaginationOptions
  ) => Promise<PaginatedResult<CheckInData>>;

  // Cache management
  clearCache: () => void;
  getCacheSize: () => number;
  getCacheHitRate: () => number;

  // Memory management
  getMemoryUsage: () => number;

  // Configuration
  setCacheStrategy: (strategy: Partial<CacheStrategy>) => void;
  setQueryOptimization: (optimization: Partial<QueryOptimization>) => void;
  setMemoryManagement: (management: Partial<MemoryManagement>) => void;

  // Debounced queries
  debouncedQuery: <T>(
    queryFn: () => Promise<T>,
    key: string,
    delay?: number
  ) => Promise<T>;

  // Batch operations
  batchOperations: <T>(
    operations: Array<() => Promise<T>>,
    batchSize?: number
  ) => Promise<T[]>;
}

export function usePerformanceOptimization(): UsePerformanceOptimizationReturn {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(
    performanceOptimization.getPerformanceMetrics()
  );

  // Update metrics periodically
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      setMetrics(performanceOptimization.getPerformanceMetrics());
    }, 5000); // Update every 5 seconds

    // eslint-disable-next-line no-undef
    return () => clearInterval(interval);
  }, []);

  // Paginate sessions
  const paginateSessions = useCallback(async (options: PaginationOptions) => {
    return await performanceOptimization.paginateSessions(options);
  }, []);

  // Paginate check-ins
  const paginateCheckIns = useCallback(async (options: PaginationOptions) => {
    return await performanceOptimization.paginateCheckIns(options);
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    performanceOptimization.clearCache();
    setMetrics(performanceOptimization.getPerformanceMetrics());
  }, []);

  // Get cache size
  const getCacheSize = useCallback(() => {
    return performanceOptimization.getCacheSize();
  }, []);

  // Get cache hit rate
  const getCacheHitRate = useCallback(() => {
    return performanceOptimization.getCacheHitRate();
  }, []);

  // Get memory usage
  const getMemoryUsage = useCallback(() => {
    return performanceOptimization.getMemoryUsage();
  }, []);

  // Set cache strategy
  const setCacheStrategy = useCallback((strategy: Partial<CacheStrategy>) => {
    performanceOptimization.setCacheStrategy(strategy);
  }, []);

  // Set query optimization
  const setQueryOptimization = useCallback(
    (optimization: Partial<QueryOptimization>) => {
      performanceOptimization.setQueryOptimization(optimization);
    },
    []
  );

  // Set memory management
  const setMemoryManagement = useCallback(
    (management: Partial<MemoryManagement>) => {
      performanceOptimization.setMemoryManagement(management);
    },
    []
  );

  // Debounced query
  const debouncedQuery = useCallback(
    <T>(queryFn: () => Promise<T>, key: string, delay?: number) => {
      return performanceOptimization.debouncedQuery(queryFn, key, delay);
    },
    []
  );

  // Batch operations
  const batchOperations = useCallback(
    <T>(operations: Array<() => Promise<T>>, batchSize?: number) => {
      return performanceOptimization.batchOperations(operations, batchSize);
    },
    []
  );

  return {
    metrics,
    paginateSessions,
    paginateCheckIns,
    clearCache,
    getCacheSize,
    getCacheHitRate,
    getMemoryUsage,
    setCacheStrategy,
    setQueryOptimization,
    setMemoryManagement,
    debouncedQuery,
    batchOperations,
  };
}
