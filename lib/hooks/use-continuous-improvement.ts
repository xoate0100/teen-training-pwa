'use client';

import { useState, useEffect, useCallback } from 'react';
import { continuousImprovement } from '@/lib/services/continuous-improvement';
import { 
  FeatureEffectivenessAnalysis, 
  UserFeedbackIntegration, 
  PerformanceOptimization, 
  InnovationPipeline, 
  ContinuousImprovementMetrics 
} from '@/lib/services/continuous-improvement';

export interface UseContinuousImprovementReturn {
  // Feature Effectiveness Analysis
  featureAnalyses: Map<string, FeatureEffectivenessAnalysis>;
  analyzeFeatureEffectiveness: (featureId: string) => Promise<FeatureEffectivenessAnalysis>;
  
  // User Feedback Integration
  feedbackItems: Map<string, UserFeedbackIntegration>;
  integrateUserFeedback: (feedback: Omit<UserFeedbackIntegration, 'feedbackId' | 'lastUpdated'>) => Promise<UserFeedbackIntegration>;
  
  // Performance Optimization
  optimizations: Map<string, PerformanceOptimization>;
  createPerformanceOptimization: (optimization: Omit<PerformanceOptimization, 'optimizationId' | 'lastUpdated'>) => Promise<PerformanceOptimization>;
  updateOptimizationProgress: (optimizationId: string, current: number, status: PerformanceOptimization['status']) => Promise<PerformanceOptimization>;
  
  // Innovation Pipeline
  innovationIdeas: Map<string, InnovationPipeline>;
  addInnovationIdea: (idea: Omit<InnovationPipeline, 'ideaId' | 'lastUpdated'>) => Promise<InnovationPipeline>;
  updateInnovationStatus: (ideaId: string, status: InnovationPipeline['status'], stage: InnovationPipeline['stage']) => Promise<InnovationPipeline>;
  
  // Continuous Improvement Metrics
  metrics: ContinuousImprovementMetrics | null;
  calculateContinuousImprovementMetrics: () => Promise<ContinuousImprovementMetrics>;
  
  // System Management
  destroy: () => void;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useContinuousImprovement(): UseContinuousImprovementReturn {
  const [featureAnalyses, setFeatureAnalyses] = useState<Map<string, FeatureEffectivenessAnalysis>>(new Map());
  const [feedbackItems, setFeedbackItems] = useState<Map<string, UserFeedbackIntegration>>(new Map());
  const [optimizations, setOptimizations] = useState<Map<string, PerformanceOptimization>>(new Map());
  const [innovationIdeas, setInnovationIdeas] = useState<Map<string, InnovationPipeline>>(new Map());
  const [metrics, setMetrics] = useState<ContinuousImprovementMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update data periodically
  useEffect(() => {
    const updateData = () => {
      // Update feature analyses
      const newFeatureAnalyses = new Map();
      const featureIds = ['session_tracking', 'progress_monitoring', 'exercise_recommendations', 'achievement_system'];
      featureIds.forEach(id => {
        const analysis = continuousImprovement.getFeatureEffectivenessAnalysis(id);
        if (analysis) newFeatureAnalyses.set(id, analysis);
      });
      setFeatureAnalyses(newFeatureAnalyses);

      // Update metrics
      const currentMetrics = continuousImprovement.getContinuousImprovementMetrics();
      if (currentMetrics) setMetrics(currentMetrics);
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Feature Effectiveness Analysis
  const analyzeFeatureEffectiveness = useCallback(async (featureId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const analysis = await continuousImprovement.analyzeFeatureEffectiveness(featureId);
      setFeatureAnalyses(prev => new Map(prev).set(featureId, analysis));
      
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze feature effectiveness';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // User Feedback Integration
  const integrateUserFeedback = useCallback(async (feedback: Omit<UserFeedbackIntegration, 'feedbackId' | 'lastUpdated'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const feedbackItem = await continuousImprovement.integrateUserFeedback(feedback);
      setFeedbackItems(prev => new Map(prev).set(feedbackItem.feedbackId, feedbackItem));
      
      return feedbackItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to integrate user feedback';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Performance Optimization
  const createPerformanceOptimization = useCallback(async (optimization: Omit<PerformanceOptimization, 'optimizationId' | 'lastUpdated'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const perfOptimization = await continuousImprovement.createPerformanceOptimization(optimization);
      setOptimizations(prev => new Map(prev).set(perfOptimization.optimizationId, perfOptimization));
      
      return perfOptimization;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create performance optimization';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOptimizationProgress = useCallback(async (optimizationId: string, current: number, status: PerformanceOptimization['status']) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const optimization = await continuousImprovement.updateOptimizationProgress(optimizationId, current, status);
      setOptimizations(prev => new Map(prev).set(optimizationId, optimization));
      
      return optimization;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update optimization progress';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Innovation Pipeline
  const addInnovationIdea = useCallback(async (idea: Omit<InnovationPipeline, 'ideaId' | 'lastUpdated'>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const innovationIdea = await continuousImprovement.addInnovationIdea(idea);
      setInnovationIdeas(prev => new Map(prev).set(innovationIdea.ideaId, innovationIdea));
      
      return innovationIdea;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add innovation idea';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateInnovationStatus = useCallback(async (ideaId: string, status: InnovationPipeline['status'], stage: InnovationPipeline['stage']) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const idea = await continuousImprovement.updateInnovationStatus(ideaId, status, stage);
      setInnovationIdeas(prev => new Map(prev).set(ideaId, idea));
      
      return idea;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update innovation status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Continuous Improvement Metrics
  const calculateContinuousImprovementMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const continuousMetrics = await continuousImprovement.calculateContinuousImprovementMetrics();
      setMetrics(continuousMetrics);
      
      return continuousMetrics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate continuous improvement metrics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Destroy service
  const destroy = useCallback(() => {
    continuousImprovement.destroy();
  }, []);

  return {
    featureAnalyses,
    analyzeFeatureEffectiveness,
    feedbackItems,
    integrateUserFeedback,
    optimizations,
    createPerformanceOptimization,
    updateOptimizationProgress,
    innovationIdeas,
    addInnovationIdea,
    updateInnovationStatus,
    metrics,
    calculateContinuousImprovementMetrics,
    destroy,
    isLoading,
    error,
  };
}
