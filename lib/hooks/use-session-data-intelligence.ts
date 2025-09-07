'use client';

import { useState, useEffect, useCallback } from 'react';
import { sessionDataIntelligence } from '@/lib/services/session-data-intelligence';
import { 
  PerformanceMetrics, 
  FormQualityAssessment, 
  RPEAnalysis, 
  SafetyMonitoring, 
  RealTimeTracking,
  SetMetrics 
} from '@/lib/services/session-data-intelligence';

export interface UseSessionDataIntelligenceReturn {
  // Real-time tracking
  realTimeTracking: RealTimeTracking | null;
  isTracking: boolean;
  
  // Performance metrics
  performanceMetrics: PerformanceMetrics | null;
  isCalculatingMetrics: boolean;
  
  // Form quality assessment
  formQuality: FormQualityAssessment | null;
  isAssessingForm: boolean;
  
  // RPE analysis
  rpeAnalysis: RPEAnalysis | null;
  isAnalyzingRPE: boolean;
  
  // Safety monitoring
  safetyMonitoring: SafetyMonitoring | null;
  isMonitoringSafety: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  trackPerformance: (sessionId: string, exerciseId: string, setData: SetMetrics) => Promise<void>;
  assessFormQuality: (exerciseId: string, sets: SetMetrics[]) => Promise<void>;
  analyzeRPE: (exerciseId: string, currentRPE: number, targetRPE: number) => Promise<void>;
  monitorSafety: (sessionId: string, currentExercise: string, currentSet: SetMetrics) => Promise<void>;
  getRealTimeTracking: (sessionId: string) => Promise<void>;
  
  // Utility functions
  startTracking: (sessionId: string) => void;
  stopTracking: () => void;
  updateSetData: (setData: SetMetrics) => void;
}

export function useSessionDataIntelligence(): UseSessionDataIntelligenceReturn {
  // State
  const [realTimeTracking, setRealTimeTracking] = useState<RealTimeTracking | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [formQuality, setFormQuality] = useState<FormQualityAssessment | null>(null);
  const [rpeAnalysis, setRpeAnalysis] = useState<RPEAnalysis | null>(null);
  const [safetyMonitoring, setSafetyMonitoring] = useState<SafetyMonitoring | null>(null);
  
  // Loading states
  const [isTracking, setIsTracking] = useState(false);
  const [isCalculatingMetrics, setIsCalculatingMetrics] = useState(false);
  const [isAssessingForm, setIsAssessingForm] = useState(false);
  const [isAnalyzingRPE, setIsAnalyzingRPE] = useState(false);
  const [isMonitoringSafety, setIsMonitoringSafety] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Current session tracking
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [trackingInterval, setTrackingInterval] = useState<number | null>(null);

  // Track performance
  // eslint-disable-next-line no-unused-vars
  const trackPerformance = useCallback(async (
    // eslint-disable-next-line no-unused-vars
    sessionId: string,
    // eslint-disable-next-line no-unused-vars
    exerciseId: string,
    // eslint-disable-next-line no-unused-vars
    setData: SetMetrics
  ) => {
    setIsCalculatingMetrics(true);
    setError(null);

    try {
      const metrics = await sessionDataIntelligence.trackPerformance(
        sessionId,
        exerciseId,
        setData
      );
      setPerformanceMetrics(metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track performance');
    } finally {
      setIsCalculatingMetrics(false);
    }
  }, []);

  // Assess form quality
  // eslint-disable-next-line no-unused-vars
  const assessFormQuality = useCallback(async (
    // eslint-disable-next-line no-unused-vars
    exerciseId: string,
    // eslint-disable-next-line no-unused-vars
    sets: SetMetrics[]
  ) => {
    setIsAssessingForm(true);
    setError(null);

    try {
      const assessment = await sessionDataIntelligence.assessFormQuality(
        exerciseId,
        sets
      );
      setFormQuality(assessment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess form quality');
    } finally {
      setIsAssessingForm(false);
    }
  }, []);

  // Analyze RPE
  // eslint-disable-next-line no-unused-vars
  const analyzeRPE = useCallback(async (
    // eslint-disable-next-line no-unused-vars
    exerciseId: string,
    // eslint-disable-next-line no-unused-vars
    currentRPE: number,
    // eslint-disable-next-line no-unused-vars
    targetRPE: number
  ) => {
    setIsAnalyzingRPE(true);
    setError(null);

    try {
      // Get recent sessions for analysis
      const recentSessions = []; // This would be fetched from the database
      const analysis = await sessionDataIntelligence.analyzeRPE(
        exerciseId,
        currentRPE,
        targetRPE,
        recentSessions
      );
      setRpeAnalysis(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze RPE');
    } finally {
      setIsAnalyzingRPE(false);
    }
  }, []);

  // Monitor safety
  // eslint-disable-next-line no-unused-vars
  const monitorSafety = useCallback(async (
    // eslint-disable-next-line no-unused-vars
    sessionId: string,
    // eslint-disable-next-line no-unused-vars
    currentExercise: string,
    // eslint-disable-next-line no-unused-vars
    currentSet: SetMetrics
  ) => {
    setIsMonitoringSafety(true);
    setError(null);

    try {
      // Get recent sessions for safety analysis
      const recentSessions = []; // This would be fetched from the database
      const monitoring = await sessionDataIntelligence.monitorSafety(
        sessionId,
        currentExercise,
        currentSet,
        recentSessions
      );
      setSafetyMonitoring(monitoring);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to monitor safety');
    } finally {
      setIsMonitoringSafety(false);
    }
  }, []);

  // Get real-time tracking
  // eslint-disable-next-line no-unused-vars
  const getRealTimeTracking = useCallback(async (sessionId: string) => {
    setIsTracking(true);
    setError(null);

    try {
      const tracking = await sessionDataIntelligence.getRealTimeTracking(sessionId);
      setRealTimeTracking(tracking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get real-time tracking');
    } finally {
      setIsTracking(false);
    }
  }, []);

  // Start tracking
  const startTracking = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsTracking(true);
    
    // Get initial tracking data
    getRealTimeTracking(sessionId);
    
    // Set up interval for continuous tracking
    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      getRealTimeTracking(sessionId);
    }, 5000); // Update every 5 seconds
    
    setTrackingInterval(interval);
  }, [getRealTimeTracking]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    setCurrentSessionId(null);
    setIsTracking(false);
    
    if (trackingInterval) {
      // eslint-disable-next-line no-undef
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
  }, [trackingInterval]);

  // Update set data
  // eslint-disable-next-line no-unused-vars
  const updateSetData = useCallback((setData: SetMetrics) => {
    if (currentSessionId && realTimeTracking) {
      // This would update the current set data and trigger performance tracking
      // Implementation would depend on the specific UI requirements
    }
  }, [currentSessionId, realTimeTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingInterval) {
        // eslint-disable-next-line no-undef
        clearInterval(trackingInterval);
      }
    };
  }, [trackingInterval]);

  return {
    // Real-time tracking
    realTimeTracking,
    isTracking,
    
    // Performance metrics
    performanceMetrics,
    isCalculatingMetrics,
    
    // Form quality assessment
    formQuality,
    isAssessingForm,
    
    // RPE analysis
    rpeAnalysis,
    isAnalyzingRPE,
    
    // Safety monitoring
    safetyMonitoring,
    isMonitoringSafety,
    
    // Error state
    error,
    
    // Actions
    trackPerformance,
    assessFormQuality,
    analyzeRPE,
    monitorSafety,
    getRealTimeTracking,
    
    // Utility functions
    startTracking,
    stopTracking,
    updateSetData,
  };
}
