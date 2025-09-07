'use client';

import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/lib/services/analytics-service';
import { 
  UserEngagementMetrics, 
  PerformanceImprovementTracking, 
  FeatureUsageAnalysis, 
  SuccessRateMonitoring 
} from '@/lib/services/analytics-service';

export interface UseAnalyticsReturn {
  // User Engagement Metrics
  userEngagementMetrics: UserEngagementMetrics | null;
  generateUserEngagementMetrics: (userId: string) => Promise<UserEngagementMetrics>;
  
  // Performance Improvement Tracking
  performanceImprovementTracking: PerformanceImprovementTracking | null;
  generatePerformanceImprovementTracking: (userId: string) => Promise<PerformanceImprovementTracking>;
  
  // Feature Usage Analysis
  featureUsageAnalysis: FeatureUsageAnalysis | null;
  generateFeatureUsageAnalysis: (featureId: string) => Promise<FeatureUsageAnalysis>;
  
  // Success Rate Monitoring
  successRateMonitoring: SuccessRateMonitoring | null;
  generateSuccessRateMonitoring: (metricId: string) => Promise<SuccessRateMonitoring>;
  
  // System Management
  destroy: () => void;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [userEngagementMetrics, setUserEngagementMetrics] = useState<UserEngagementMetrics | null>(null);
  const [performanceImprovementTracking, setPerformanceImprovementTracking] = useState<PerformanceImprovementTracking | null>(null);
  const [featureUsageAnalysis, setFeatureUsageAnalysis] = useState<FeatureUsageAnalysis | null>(null);
  const [successRateMonitoring, setSuccessRateMonitoring] = useState<SuccessRateMonitoring | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update data periodically
  useEffect(() => {
    const updateData = () => {
      setUserEngagementMetrics(analyticsService.getUserEngagementMetrics('current-user'));
      setPerformanceImprovementTracking(analyticsService.getPerformanceImprovementTracking('current-user'));
      setFeatureUsageAnalysis(analyticsService.getFeatureUsageAnalysis('session_tracking'));
      setSuccessRateMonitoring(analyticsService.getSuccessRateMonitoring('user_engagement'));
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Generate user engagement metrics
  const generateUserEngagementMetrics = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const metrics = await analyticsService.generateUserEngagementMetrics(userId);
      setUserEngagementMetrics(metrics);
      
      return metrics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate user engagement metrics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate performance improvement tracking
  const generatePerformanceImprovementTracking = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const tracking = await analyticsService.generatePerformanceImprovementTracking(userId);
      setPerformanceImprovementTracking(tracking);
      
      return tracking;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate performance improvement tracking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate feature usage analysis
  const generateFeatureUsageAnalysis = useCallback(async (featureId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const analysis = await analyticsService.generateFeatureUsageAnalysis(featureId);
      setFeatureUsageAnalysis(analysis);
      
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate feature usage analysis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate success rate monitoring
  const generateSuccessRateMonitoring = useCallback(async (metricId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const monitoring = await analyticsService.generateSuccessRateMonitoring(metricId);
      setSuccessRateMonitoring(monitoring);
      
      return monitoring;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate success rate monitoring';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Destroy service
  const destroy = useCallback(() => {
    analyticsService.destroy();
  }, []);

  return {
    userEngagementMetrics,
    generateUserEngagementMetrics,
    performanceImprovementTracking,
    generatePerformanceImprovementTracking,
    featureUsageAnalysis,
    generateFeatureUsageAnalysis,
    successRateMonitoring,
    generateSuccessRateMonitoring,
    destroy,
    isLoading,
    error,
  };
}
