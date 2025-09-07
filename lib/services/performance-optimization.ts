'use client';

import { DatabaseService, SessionData, CheckInData } from './database-service';

export interface PaginationOptions {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CacheStrategy {
  type: 'memory' | 'localStorage' | 'indexedDB' | 'none';
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size
  evictionPolicy: 'lru' | 'fifo' | 'random';
}

export interface QueryOptimization {
  enableIndexing: boolean;
  enableCompression: boolean;
  enableDeduplication: boolean;
  batchSize: number;
  debounceDelay: number;
}

export interface MemoryManagement {
  enableGarbageCollection: boolean;
  maxMemoryUsage: number; // in MB
  cleanupInterval: number; // in milliseconds
  enableMemoryMonitoring: boolean;
}

export interface PerformanceMetrics {
  queryTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  networkRequests: number;
  dataSize: number;
  lastOptimized: Date;
}

export class PerformanceOptimizationService {
  private databaseService = new DatabaseService();
  private memoryCache: Map<string, { data: any; timestamp: number; accessCount: number }> = new Map();
  private cacheStrategy: CacheStrategy = {
    type: 'memory',
    ttl: 300000, // 5 minutes
    maxSize: 1000,
    evictionPolicy: 'lru',
  };
  private queryOptimization: QueryOptimization = {
    enableIndexing: true,
    enableCompression: true,
    enableDeduplication: true,
    batchSize: 50,
    debounceDelay: 300,
  };
  private memoryManagement: MemoryManagement = {
    enableGarbageCollection: true,
    maxMemoryUsage: 100, // 100MB
    cleanupInterval: 60000, // 1 minute
    enableMemoryMonitoring: true,
  };
  private performanceMetrics: PerformanceMetrics = {
    queryTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    networkRequests: 0,
    dataSize: 0,
    lastOptimized: new Date(),
  };
  private cleanupInterval: number | null = null;
  private debounceTimers: Map<string, number> = new Map();

  constructor() {
    this.initializePerformanceOptimization();
  }

  // Initialize performance optimization
  private initializePerformanceOptimization() {
    // Start cleanup interval
    if (this.memoryManagement.enableGarbageCollection) {
      this.startCleanupInterval();
    }

    // Monitor memory usage
    if (this.memoryManagement.enableMemoryMonitoring) {
      this.startMemoryMonitoring();
    }
  }

  // Start cleanup interval
  private startCleanupInterval() {
    if (this.cleanupInterval) {
      // eslint-disable-next-line no-undef
      clearInterval(this.cleanupInterval);
    }

    // eslint-disable-next-line no-undef
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, this.memoryManagement.cleanupInterval);
  }

  // Start memory monitoring
  private startMemoryMonitoring() {
    // eslint-disable-next-line no-undef
    setInterval(() => {
      this.updateMemoryUsage();
    }, 5000); // Check every 5 seconds
  }

  // Perform cleanup
  private performCleanup() {
    // Clean expired cache entries
    this.cleanExpiredCacheEntries();
    
    // Clean up memory cache if size exceeds limit
    this.cleanMemoryCache();
    
    // Clear debounce timers
    this.clearDebounceTimers();
    
    // Update performance metrics
    this.updatePerformanceMetrics();
  }

  // Clean expired cache entries
  private cleanExpiredCacheEntries() {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (now - value.timestamp > this.cacheStrategy.ttl) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Clean memory cache
  private cleanMemoryCache() {
    if (this.memoryCache.size > this.cacheStrategy.maxSize) {
      const entries = Array.from(this.memoryCache.entries());
      
      switch (this.cacheStrategy.evictionPolicy) {
        case 'lru':
          // Remove least recently used entries
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
          break;
        case 'fifo':
          // Remove first in, first out entries
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
          break;
        case 'random':
          // Remove random entries
          entries.sort(() => Math.random() - 0.5);
          break;
      }
      
      // Remove excess entries
      const toRemove = entries.slice(0, entries.length - this.cacheStrategy.maxSize);
      toRemove.forEach(([key]) => this.memoryCache.delete(key));
    }
  }

  // Clear debounce timers
  private clearDebounceTimers() {
    for (const [key, timer] of this.debounceTimers.entries()) {
      // eslint-disable-next-line no-undef
clearTimeout(timer);
      this.debounceTimers.delete(key);
    }
  }

  // Update memory usage
  private updateMemoryUsage() {
    // eslint-disable-next-line no-undef
    if (performance.memory) {
      // eslint-disable-next-line no-undef
      this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
  }

  // Update performance metrics
  private updatePerformanceMetrics() {
    this.performanceMetrics.cacheHitRate = this.calculateCacheHitRate();
    this.performanceMetrics.dataSize = this.calculateDataSize();
    this.performanceMetrics.lastOptimized = new Date();
  }

  // Calculate cache hit rate
  private calculateCacheHitRate(): number {
    const totalAccesses = Array.from(this.memoryCache.values()).reduce((sum, entry) => sum + entry.accessCount, 0);
    const cacheHits = Array.from(this.memoryCache.values()).reduce((sum, entry) => sum + (entry.accessCount > 1 ? 1 : 0), 0);
    return totalAccesses > 0 ? (cacheHits / totalAccesses) * 100 : 0;
  }

  // Calculate data size
  private calculateDataSize(): number {
    let size = 0;
    for (const [key, value] of this.memoryCache.entries()) {
      size += JSON.stringify(value.data).length;
    }
    return size;
  }

  // Paginate sessions
  async paginateSessions(options: PaginationOptions): Promise<PaginatedResult<SessionData>> {
    const startTime = // eslint-disable-next-line no-undef
performance.now();
    
    try {
      // Check cache first
      const cacheKey = `sessions_${JSON.stringify(options)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.performanceMetrics.queryTime = // eslint-disable-next-line no-undef
performance.now() - startTime;
        return cached;
      }

      // Fetch data from database
      const allSessions = await this.databaseService.getSessions('current-user');
      
      // Apply filters
      let filteredSessions = allSessions;
      if (options.filters) {
        filteredSessions = this.applyFilters(allSessions, options.filters);
      }

      // Apply sorting
      if (options.sortBy) {
        filteredSessions = this.applySorting(filteredSessions, options.sortBy, options.sortOrder || 'asc');
      }

      // Apply pagination
      const totalItems = filteredSessions.length;
      const totalPages = Math.ceil(totalItems / options.pageSize);
      const startIndex = (options.page - 1) * options.pageSize;
      const endIndex = startIndex + options.pageSize;
      const paginatedData = filteredSessions.slice(startIndex, endIndex);

      const result: PaginatedResult<SessionData> = {
        data: paginatedData,
        pagination: {
          page: options.page,
          pageSize: options.pageSize,
          totalItems,
          totalPages,
          hasNextPage: options.page < totalPages,
          hasPreviousPage: options.page > 1,
        },
      };

      // Cache the result
      this.setCache(cacheKey, result);
      
      this.performanceMetrics.queryTime = // eslint-disable-next-line no-undef
performance.now() - startTime;
      return result;
    } catch (error) {
      console.error('Error paginating sessions:', error);
      throw error;
    }
  }

  // Paginate check-ins
  async paginateCheckIns(options: PaginationOptions): Promise<PaginatedResult<CheckInData>> {
    const startTime = // eslint-disable-next-line no-undef
performance.now();
    
    try {
      // Check cache first
      const cacheKey = `checkins_${JSON.stringify(options)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        this.performanceMetrics.queryTime = // eslint-disable-next-line no-undef
performance.now() - startTime;
        return cached;
      }

      // Fetch data from database
      const allCheckIns = await this.databaseService.getCheckIns('current-user');
      
      // Apply filters
      let filteredCheckIns = allCheckIns;
      if (options.filters) {
        filteredCheckIns = this.applyFilters(allCheckIns, options.filters);
      }

      // Apply sorting
      if (options.sortBy) {
        filteredCheckIns = this.applySorting(filteredCheckIns, options.sortBy, options.sortOrder || 'asc');
      }

      // Apply pagination
      const totalItems = filteredCheckIns.length;
      const totalPages = Math.ceil(totalItems / options.pageSize);
      const startIndex = (options.page - 1) * options.pageSize;
      const endIndex = startIndex + options.pageSize;
      const paginatedData = filteredCheckIns.slice(startIndex, endIndex);

      const result: PaginatedResult<CheckInData> = {
        data: paginatedData,
        pagination: {
          page: options.page,
          pageSize: options.pageSize,
          totalItems,
          totalPages,
          hasNextPage: options.page < totalPages,
          hasPreviousPage: options.page > 1,
        },
      };

      // Cache the result
      this.setCache(cacheKey, result);
      
      this.performanceMetrics.queryTime = // eslint-disable-next-line no-undef
performance.now() - startTime;
      return result;
    } catch (error) {
      console.error('Error paginating check-ins:', error);
      throw error;
    }
  }

  // Apply filters
  private applyFilters<T>(data: T[], filters: Record<string, any>): T[] {
    return data.filter(item => {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
          const itemValue = (item as any)[key];
          if (typeof value === 'string') {
            if (!itemValue?.toString().toLowerCase().includes(value.toLowerCase())) {
              return false;
            }
          } else if (typeof value === 'number') {
            if (itemValue !== value) {
              return false;
            }
          } else if (Array.isArray(value)) {
            if (!value.includes(itemValue)) {
              return false;
            }
          }
        }
      }
      return true;
    });
  }

  // Apply sorting
  private applySorting<T>(data: T[], sortBy: string, sortOrder: 'asc' | 'desc'): T[] {
    return data.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Get from cache
  private getFromCache(key: string): any {
    const cached = this.memoryCache.get(key);
    if (cached) {
      cached.accessCount++;
      return cached.data;
    }
    return null;
  }

  // Set cache
  private setCache(key: string, data: any): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1,
    });
  }

  // Debounced query
  debouncedQuery<T>(
    queryFn: () => Promise<T>,
    key: string,
    delay: number = this.queryOptimization.debounceDelay
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // Clear existing timer
      const existingTimer = this.debounceTimers.get(key);
      if (existingTimer) {
        // eslint-disable-next-line no-undef
clearTimeout(existingTimer);
      }

      // Set new timer
      const timer = // eslint-disable-next-line no-undef
setTimeout(async () => {
        try {
          const result = await queryFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
        this.debounceTimers.delete(key);
      }, delay);

      this.debounceTimers.set(key, timer);
    });
  }

  // Batch operations
  async batchOperations<T>(
    operations: Array<() => Promise<T>>,
    batchSize: number = this.queryOptimization.batchSize
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(op => op()));
      results.push(...batchResults);
    }
    
    return results;
  }

  // Optimize queries
  optimizeQuery(query: string): string {
    if (this.queryOptimization.enableCompression) {
      // Remove unnecessary whitespace
      query = query.replace(/\s+/g, ' ').trim();
    }
    
    if (this.queryOptimization.enableDeduplication) {
      // Remove duplicate conditions
      // This is a simplified example - in practice, you'd have more sophisticated logic
      query = query.replace(/(\w+)\s*=\s*\1/g, '$1');
    }
    
    return query;
  }

  // Get performance metrics
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  // Set cache strategy
  setCacheStrategy(strategy: Partial<CacheStrategy>): void {
    this.cacheStrategy = { ...this.cacheStrategy, ...strategy };
  }

  // Set query optimization
  setQueryOptimization(optimization: Partial<QueryOptimization>): void {
    this.queryOptimization = { ...this.queryOptimization, ...optimization };
  }

  // Set memory management
  setMemoryManagement(management: Partial<MemoryManagement>): void {
    this.memoryManagement = { ...this.memoryManagement, ...management };
  }

  // Clear cache
  clearCache(): void {
    this.memoryCache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.memoryCache.size;
  }

  // Get cache hit rate
  getCacheHitRate(): number {
    return this.performanceMetrics.cacheHitRate;
  }

  // Get memory usage
  getMemoryUsage(): number {
    return this.performanceMetrics.memoryUsage;
  }

  // Cleanup
  destroy(): void {
    if (this.cleanupInterval) {
      // eslint-disable-next-line no-undef
clearInterval(this.cleanupInterval);
    }
    this.clearDebounceTimers();
    this.memoryCache.clear();
  }
}

// Export singleton instance
export const performanceOptimization = new PerformanceOptimizationService();
