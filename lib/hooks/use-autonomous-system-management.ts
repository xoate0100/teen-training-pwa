'use client';

import { useState, useEffect, useCallback } from 'react';
import { autonomousSystemManagement } from '@/lib/services/autonomous-system-management';
import {
  ModelPerformanceMetrics,
  ParameterTuningResult,
  ABTestConfig,
  ABTestResult,
  LearningPattern,
  SystemHealthMetrics,
  AutomationRule,
  UserBehaviorPattern,
  PreferenceEvolution,
  GoalAdaptation,
  PerformanceOptimizationLoop,
} from '@/lib/services/autonomous-system-management';

export interface UseAutonomousSystemManagementReturn {
  // Model Performance
  modelMetrics: ModelPerformanceMetrics[];
  monitorModelPerformance: (
    modelId: string,
    modelName: string
  ) => Promise<ModelPerformanceMetrics>;

  // Parameter Tuning
  parameterHistory: ParameterTuningResult[];
  tuneParameters: (modelId: string) => Promise<ParameterTuningResult[]>;

  // A/B Testing
  abTests: ABTestConfig[];
  abTestResults: ABTestResult[];
  createABTest: (
    config: Omit<
      ABTestConfig,
      'testId' | 'startDate' | 'status' | 'currentSampleSize'
    >
  ) => Promise<string>;
  runABTest: (testId: string, userId: string) => Promise<any>;

  // Learning Patterns
  learningPatterns: LearningPattern[];
  getLearningPatterns: (userId: string) => LearningPattern[];

  // System Health
  systemHealth: SystemHealthMetrics | null;

  // Automation Rules
  automationRules: AutomationRule[];
  createAutomationRule: (
    rule: Omit<AutomationRule, 'id' | 'lastTriggered' | 'successRate'>
  ) => Promise<string>;
  evaluateAutomationRules: () => Promise<void>;

  // Adaptive Learning System
  behaviorPatterns: UserBehaviorPattern[];
  preferenceEvolutions: PreferenceEvolution[];
  goalAdaptations: GoalAdaptation[];
  optimizationLoops: PerformanceOptimizationLoop[];
  getBehaviorPatterns: (userId: string) => UserBehaviorPattern[];
  getPreferenceEvolutions: (userId: string) => PreferenceEvolution[];
  getGoalAdaptations: (userId: string) => GoalAdaptation[];
  getOptimizationLoops: (userId: string) => PerformanceOptimizationLoop[];

  // System Management
  destroy: () => void;

  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useAutonomousSystemManagement(): UseAutonomousSystemManagementReturn {
  const [modelMetrics, setModelMetrics] = useState<ModelPerformanceMetrics[]>(
    []
  );
  const [parameterHistory, setParameterHistory] = useState<
    ParameterTuningResult[]
  >([]);
  const [abTests, setABTests] = useState<ABTestConfig[]>([]);
  const [abTestResults, setABTestResults] = useState<ABTestResult[]>([]);
  const [learningPatterns, setLearningPatterns] = useState<LearningPattern[]>(
    []
  );
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetrics | null>(
    null
  );
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [behaviorPatterns, setBehaviorPatterns] = useState<
    UserBehaviorPattern[]
  >([]);
  const [preferenceEvolutions, setPreferenceEvolutions] = useState<
    PreferenceEvolution[]
  >([]);
  const [goalAdaptations, setGoalAdaptations] = useState<GoalAdaptation[]>([]);
  const [optimizationLoops, setOptimizationLoops] = useState<
    PerformanceOptimizationLoop[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update data periodically
  useEffect(() => {
    const updateData = () => {
      setModelMetrics(autonomousSystemManagement.getModelMetrics());
      setParameterHistory(autonomousSystemManagement.getParameterHistory());
      setABTests(autonomousSystemManagement.getABTests());
      setABTestResults(autonomousSystemManagement.getABTestResults());
      setLearningPatterns(
        autonomousSystemManagement.getLearningPatterns('current-user')
      );
      setSystemHealth(autonomousSystemManagement.getSystemHealth());
      setAutomationRules(autonomousSystemManagement.getAutomationRules());
      setBehaviorPatterns(
        autonomousSystemManagement.getBehaviorPatterns('current-user')
      );
      setPreferenceEvolutions(
        autonomousSystemManagement.getPreferenceEvolutions('current-user')
      );
      setGoalAdaptations(
        autonomousSystemManagement.getGoalAdaptations('current-user')
      );
      setOptimizationLoops(
        autonomousSystemManagement.getOptimizationLoops('current-user')
      );
    };

    updateData();
    const interval = setInterval(updateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Monitor model performance
  const monitorModelPerformance = useCallback(
    async (modelId: string, modelName: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const metrics =
          await autonomousSystemManagement.monitorModelPerformance(
            modelId,
            modelName
          );
        setModelMetrics(autonomousSystemManagement.getModelMetrics());

        return metrics;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to monitor model performance';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Tune parameters
  const tuneParameters = useCallback(async (modelId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const results = await autonomousSystemManagement.tuneParameters(modelId);
      setParameterHistory(autonomousSystemManagement.getParameterHistory());

      return results;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to tune parameters';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create A/B test
  const createABTest = useCallback(
    async (
      config: Omit<
        ABTestConfig,
        'testId' | 'startDate' | 'status' | 'currentSampleSize'
      >
    ) => {
      try {
        setError(null);

        const testId = await autonomousSystemManagement.createABTest(config);
        setABTests(autonomousSystemManagement.getABTests());

        return testId;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create A/B test';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Run A/B test
  const runABTest = useCallback(async (testId: string, userId: string) => {
    try {
      setError(null);

      const result = await autonomousSystemManagement.runABTest(testId, userId);
      setABTests(autonomousSystemManagement.getABTests());
      setABTestResults(autonomousSystemManagement.getABTestResults());

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to run A/B test';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Get learning patterns
  const getLearningPatterns = useCallback((userId: string) => {
    return autonomousSystemManagement.getLearningPatterns(userId);
  }, []);

  // Get behavior patterns
  const getBehaviorPatterns = useCallback((userId: string) => {
    return autonomousSystemManagement.getBehaviorPatterns(userId);
  }, []);

  // Get preference evolutions
  const getPreferenceEvolutions = useCallback((userId: string) => {
    return autonomousSystemManagement.getPreferenceEvolutions(userId);
  }, []);

  // Get goal adaptations
  const getGoalAdaptations = useCallback((userId: string) => {
    return autonomousSystemManagement.getGoalAdaptations(userId);
  }, []);

  // Get optimization loops
  const getOptimizationLoops = useCallback((userId: string) => {
    return autonomousSystemManagement.getOptimizationLoops(userId);
  }, []);

  // Create automation rule
  const createAutomationRule = useCallback(
    async (
      rule: Omit<AutomationRule, 'id' | 'lastTriggered' | 'successRate'>
    ) => {
      try {
        setError(null);

        const ruleId =
          await autonomousSystemManagement.createAutomationRule(rule);
        setAutomationRules(autonomousSystemManagement.getAutomationRules());

        return ruleId;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to create automation rule';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // Evaluate automation rules
  const evaluateAutomationRules = useCallback(async () => {
    try {
      setError(null);

      await autonomousSystemManagement.evaluateAutomationRules();
      setAutomationRules(autonomousSystemManagement.getAutomationRules());
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to evaluate automation rules';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Destroy service
  const destroy = useCallback(() => {
    autonomousSystemManagement.destroy();
  }, []);

  return {
    modelMetrics,
    monitorModelPerformance,
    parameterHistory,
    tuneParameters,
    abTests,
    abTestResults,
    createABTest,
    runABTest,
    learningPatterns,
    getLearningPatterns,
    systemHealth,
    automationRules,
    createAutomationRule,
    evaluateAutomationRules,
    behaviorPatterns,
    preferenceEvolutions,
    goalAdaptations,
    optimizationLoops,
    getBehaviorPatterns,
    getPreferenceEvolutions,
    getGoalAdaptations,
    getOptimizationLoops,
    destroy,
    isLoading,
    error,
  };
}
