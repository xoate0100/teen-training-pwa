'use client';

/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import {
  WellnessAnalysisService,
  WellnessInsights,
  MoodData,
  SleepData,
  EnergyData,
  RecoveryData,
} from '@/lib/services/wellness-analysis-service';
import {
  SessionModificationService,
  SessionModificationEngine,
} from '@/lib/services/session-modification-service';
import {
  PredictiveHealthService,
  HealthPrediction,
} from '@/lib/services/predictive-health-service';
import {
  SessionData,
  CheckInData,
  ExerciseData,
} from '@/lib/services/database-service';

export interface WellnessIntelligenceState {
  // Wellness Analysis
  wellnessInsights: WellnessInsights | null;
  moodAnalysis: any;
  sleepAnalysis: any;
  energyAnalysis: any;
  recoveryAnalysis: any;

  // Session Modification
  sessionModificationEngine: SessionModificationEngine | null;
  realTimeAdjustments: any[];
  safetyProtocols: any[];

  // Predictive Health
  healthPrediction: HealthPrediction | null;
  overtrainingPrediction: any;
  burnoutAssessment: any;
  optimalTrainingLoad: any;
  recoveryRecommendations: any;

  // General State
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface WellnessIntelligenceActions {
  // Wellness Analysis Actions

  analyzeMoodPatterns: (moodData: MoodData[]) => Promise<any>;
  analyzeSleepQuality: (sleepData: SleepData[]) => Promise<any>;
  analyzeEnergyLevels: (energyData: EnergyData[]) => Promise<any>;
  analyzeRecoveryOptimization: (
    recoveryData: RecoveryData[],
    sessionData: SessionData[]
  ) => Promise<any>;
  generateWellnessInsights: (
    moodData: MoodData[],
    sleepData: SleepData[],
    energyData: EnergyData[],
    recoveryData: RecoveryData[],
    sessionData: SessionData[]
  ) => Promise<WellnessInsights>;

  // Session Modification Actions
  generateRealTimeAdjustments: (
    sessionData: SessionData,
    wellnessInsights: WellnessInsights,
    currentExercise: ExerciseData,
    currentSet: number,
    performanceData: any
  ) => Promise<any[]>;
  scaleSessionIntensity: (
    sessionData: SessionData,
    wellnessInsights: WellnessInsights
  ) => Promise<any>;
  generateExerciseSubstitutions: (
    sessionData: SessionData,
    wellnessInsights: WellnessInsights,
    availableExercises: ExerciseData[]
  ) => Promise<any[]>;
  activateSafetyProtocols: (
    sessionData: SessionData,
    wellnessInsights: WellnessInsights,
    performanceData: any
  ) => Promise<any[]>;
  createSessionModificationEngine: (
    sessionData: SessionData,
    wellnessInsights: WellnessInsights,
    availableExercises: ExerciseData[]
  ) => Promise<SessionModificationEngine>;

  // Predictive Health Actions
  predictOvertrainingRisk: (
    wellnessInsights: WellnessInsights,
    sessionData: SessionData[],
    recentSessions: SessionData[]
  ) => Promise<any>;
  assessBurnoutRisk: (
    wellnessInsights: WellnessInsights,
    sessionData: SessionData[],
    checkInData: CheckInData[]
  ) => Promise<any>;
  calculateOptimalTrainingLoad: (
    wellnessInsights: WellnessInsights,
    sessionData: SessionData[],
    userGoals: string[]
  ) => Promise<any>;
  recommendRecoveryTime: (
    wellnessInsights: WellnessInsights,
    lastSession: SessionData,
    upcomingSessions: SessionData[]
  ) => Promise<any>;
  generateHealthPrediction: (
    wellnessInsights: WellnessInsights,
    sessionData: SessionData[],
    checkInData: CheckInData[],
    userGoals: string[]
  ) => Promise<HealthPrediction>;

  // General Actions
  refreshAll: () => Promise<void>;
  clearError: () => void;
  updateWellnessData: (newData: {
    mood?: MoodData[];
    sleep?: SleepData[];
    energy?: EnergyData[];
    recovery?: RecoveryData[];
  }) => void;
}

export function useWellnessIntelligence(
  sessions: SessionData[] = [],
  checkIns: CheckInData[] = [],
  moodData: MoodData[] = [],
  sleepData: SleepData[] = [],
  energyData: EnergyData[] = [],
  recoveryData: RecoveryData[] = [],
  availableExercises: ExerciseData[] = [],
  userGoals: string[] = [],
  userId: string = 'default-user'
): WellnessIntelligenceState & WellnessIntelligenceActions {
  const [state, setState] = useState<WellnessIntelligenceState>({
    wellnessInsights: null,
    moodAnalysis: null,
    sleepAnalysis: null,
    energyAnalysis: null,
    recoveryAnalysis: null,
    sessionModificationEngine: null,
    realTimeAdjustments: [],
    safetyProtocols: [],
    healthPrediction: null,
    overtrainingPrediction: null,
    burnoutAssessment: null,
    optimalTrainingLoad: null,
    recoveryRecommendations: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  // Analyze mood patterns
  const analyzeMoodPatterns = useCallback(
    async (moodData: MoodData[]): Promise<any> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const analysis = WellnessAnalysisService.analyzeMoodPatterns(moodData);

        setState(prev => ({
          ...prev,
          moodAnalysis: analysis,
          lastUpdated: new Date().toISOString(),
        }));

        return analysis;
      } catch (error) {
        console.error('Error analyzing mood patterns:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to analyze mood patterns',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Analyze sleep quality
  const analyzeSleepQuality = useCallback(
    async (sleepData: SleepData[]): Promise<any> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const analysis = WellnessAnalysisService.analyzeSleepQuality(sleepData);

        setState(prev => ({
          ...prev,
          sleepAnalysis: analysis,
          lastUpdated: new Date().toISOString(),
        }));

        return analysis;
      } catch (error) {
        console.error('Error analyzing sleep quality:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to analyze sleep quality',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Analyze energy levels
  const analyzeEnergyLevels = useCallback(
    async (energyData: EnergyData[]): Promise<any> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const analysis =
          WellnessAnalysisService.analyzeEnergyLevels(energyData);

        setState(prev => ({
          ...prev,
          energyAnalysis: analysis,
          lastUpdated: new Date().toISOString(),
        }));

        return analysis;
      } catch (error) {
        console.error('Error analyzing energy levels:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to analyze energy levels',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Analyze recovery optimization
  const analyzeRecoveryOptimization = useCallback(
    async (
      recoveryData: RecoveryData[],
      sessionData: SessionData[]
    ): Promise<any> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const analysis = WellnessAnalysisService.analyzeRecoveryOptimization(
          recoveryData,
          sessionData
        );

        setState(prev => ({
          ...prev,
          recoveryAnalysis: analysis,
          lastUpdated: new Date().toISOString(),
        }));

        return analysis;
      } catch (error) {
        console.error('Error analyzing recovery optimization:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to analyze recovery optimization',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate comprehensive wellness insights
  const generateWellnessInsights = useCallback(
    async (
      moodData: MoodData[],
      sleepData: SleepData[],
      energyData: EnergyData[],
      recoveryData: RecoveryData[],
      sessionData: SessionData[]
    ): Promise<WellnessInsights> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const insights = WellnessAnalysisService.generateWellnessInsights(
          moodData,
          sleepData,
          energyData,
          recoveryData,
          sessionData
        );

        setState(prev => ({
          ...prev,
          wellnessInsights: insights,
          lastUpdated: new Date().toISOString(),
        }));

        return insights;
      } catch (error) {
        console.error('Error generating wellness insights:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate wellness insights',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate real-time adjustments
  const generateRealTimeAdjustments = useCallback(
    async (
      sessionData: SessionData,
      wellnessInsights: WellnessInsights,
      currentExercise: ExerciseData,
      currentSet: number,
      performanceData: any
    ): Promise<any[]> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const adjustments =
          SessionModificationService.generateRealTimeAdjustments(
            sessionData,
            wellnessInsights,
            currentExercise,
            currentSet,
            performanceData
          );

        setState(prev => ({
          ...prev,
          realTimeAdjustments: adjustments,
          lastUpdated: new Date().toISOString(),
        }));

        return adjustments;
      } catch (error) {
        console.error('Error generating real-time adjustments:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate real-time adjustments',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Scale session intensity
  const scaleSessionIntensity = useCallback(
    async (
      sessionData: SessionData,
      wellnessInsights: WellnessInsights
    ): Promise<any> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const scaling = SessionModificationService.scaleSessionIntensity(
          sessionData,
          wellnessInsights
        );

        setState(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
        return scaling;
      } catch (error) {
        console.error('Error scaling session intensity:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to scale session intensity',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate exercise substitutions
  const generateExerciseSubstitutions = useCallback(
    async (
      sessionData: SessionData,
      wellnessInsights: WellnessInsights,
      availableExercises: ExerciseData[]
    ): Promise<any[]> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const substitutions =
          SessionModificationService.generateExerciseSubstitutions(
            sessionData,
            wellnessInsights,
            availableExercises
          );

        setState(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
        return substitutions;
      } catch (error) {
        console.error('Error generating exercise substitutions:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate exercise substitutions',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Activate safety protocols
  const activateSafetyProtocols = useCallback(
    async (
      sessionData: SessionData,
      wellnessInsights: WellnessInsights,
      performanceData: any
    ): Promise<any[]> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const protocols = SessionModificationService.activateSafetyProtocols(
          sessionData,
          wellnessInsights,
          performanceData
        );

        setState(prev => ({
          ...prev,
          safetyProtocols: protocols,
          lastUpdated: new Date().toISOString(),
        }));

        return protocols;
      } catch (error) {
        console.error('Error activating safety protocols:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to activate safety protocols',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Create session modification engine
  const createSessionModificationEngine = useCallback(
    async (
      sessionData: SessionData,
      wellnessInsights: WellnessInsights,
      availableExercises: ExerciseData[]
    ): Promise<SessionModificationEngine> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const engine =
          SessionModificationService.createSessionModificationEngine(
            sessionData,
            wellnessInsights,
            availableExercises
          );

        setState(prev => ({
          ...prev,
          sessionModificationEngine: engine,
          lastUpdated: new Date().toISOString(),
        }));

        return engine;
      } catch (error) {
        console.error('Error creating session modification engine:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create session modification engine',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Predict overtraining risk
  const predictOvertrainingRisk = useCallback(
    async (
      wellnessInsights: WellnessInsights,
      sessionData: SessionData[],
      recentSessions: SessionData[]
    ): Promise<any> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const prediction = PredictiveHealthService.predictOvertrainingRisk(
          wellnessInsights,
          sessionData,
          recentSessions
        );

        setState(prev => ({
          ...prev,
          overtrainingPrediction: prediction,
          lastUpdated: new Date().toISOString(),
        }));

        return prediction;
      } catch (error) {
        console.error('Error predicting overtraining risk:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to predict overtraining risk',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Assess burnout risk
  const assessBurnoutRisk = useCallback(
    async (
      wellnessInsights: WellnessInsights,
      sessionData: SessionData[],
      checkInData: CheckInData[]
    ): Promise<any> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const assessment = PredictiveHealthService.assessBurnoutRisk(
          wellnessInsights,
          sessionData,
          checkInData
        );

        setState(prev => ({
          ...prev,
          burnoutAssessment: assessment,
          lastUpdated: new Date().toISOString(),
        }));

        return assessment;
      } catch (error) {
        console.error('Error assessing burnout risk:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to assess burnout risk',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Calculate optimal training load
  const calculateOptimalTrainingLoad = useCallback(
    async (
      wellnessInsights: WellnessInsights,
      sessionData: SessionData[],
      userGoals: string[]
    ): Promise<any> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const load = PredictiveHealthService.calculateOptimalTrainingLoad(
          wellnessInsights,
          sessionData,
          userGoals
        );

        setState(prev => ({
          ...prev,
          optimalTrainingLoad: load,
          lastUpdated: new Date().toISOString(),
        }));

        return load;
      } catch (error) {
        console.error('Error calculating optimal training load:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to calculate optimal training load',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Recommend recovery time
  const recommendRecoveryTime = useCallback(
    async (
      wellnessInsights: WellnessInsights,
      lastSession: SessionData,
      upcomingSessions: SessionData[]
    ): Promise<any> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const recommendation = PredictiveHealthService.recommendRecoveryTime(
          wellnessInsights,
          lastSession,
          upcomingSessions
        );

        setState(prev => ({
          ...prev,
          recoveryRecommendations: recommendation,
          lastUpdated: new Date().toISOString(),
        }));

        return recommendation;
      } catch (error) {
        console.error('Error recommending recovery time:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to recommend recovery time',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Generate comprehensive health prediction
  const generateHealthPrediction = useCallback(
    async (
      wellnessInsights: WellnessInsights,
      sessionData: SessionData[],
      checkInData: CheckInData[],
      userGoals: string[]
    ): Promise<HealthPrediction> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const prediction = PredictiveHealthService.generateHealthPrediction(
          wellnessInsights,
          sessionData,
          checkInData,
          userGoals
        );

        setState(prev => ({
          ...prev,
          healthPrediction: prediction,
          lastUpdated: new Date().toISOString(),
        }));

        return prediction;
      } catch (error) {
        console.error('Error generating health prediction:', error);
        setState(prev => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate health prediction',
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Generate wellness insights if we have data
      if (
        moodData.length > 0 ||
        sleepData.length > 0 ||
        energyData.length > 0 ||
        recoveryData.length > 0
      ) {
        const insights = await generateWellnessInsights(
          moodData,
          sleepData,
          energyData,
          recoveryData,
          sessions
        );

        // Generate health prediction if we have insights
        if (insights) {
          await generateHealthPrediction(
            insights,
            sessions,
            checkIns,
            userGoals
          );
        }
      }

      setState(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
    } catch (error) {
      console.error('Error refreshing wellness intelligence:', error);
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error ? error.message : 'Failed to refresh data',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [
    moodData,
    sleepData,
    energyData,
    recoveryData,
    sessions,
    checkIns,
    userGoals,
    generateWellnessInsights,
    generateHealthPrediction,
  ]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Update wellness data
  const updateWellnessData = useCallback(
    (newData: {
      mood?: MoodData[];
      sleep?: SleepData[];
      energy?: EnergyData[];
      recovery?: RecoveryData[];
    }) => {
      setState(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
      }));
    },
    []
  );

  // Auto-refresh when data changes
  useEffect(() => {
    if (
      moodData.length > 0 ||
      sleepData.length > 0 ||
      energyData.length > 0 ||
      recoveryData.length > 0
    ) {
      refreshAll();
    }
  }, [
    moodData.length,
    sleepData.length,
    energyData.length,
    recoveryData.length,
    refreshAll,
  ]);

  return {
    ...state,
    analyzeMoodPatterns,
    analyzeSleepQuality,
    analyzeEnergyLevels,
    analyzeRecoveryOptimization,
    generateWellnessInsights,
    generateRealTimeAdjustments,
    scaleSessionIntensity,
    generateExerciseSubstitutions,
    activateSafetyProtocols,
    createSessionModificationEngine,
    predictOvertrainingRisk,
    assessBurnoutRisk,
    calculateOptimalTrainingLoad,
    recommendRecoveryTime,
    generateHealthPrediction,
    refreshAll,
    clearError,
    updateWellnessData,
  };
}
