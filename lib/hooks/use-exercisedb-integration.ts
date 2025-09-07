'use client';

import { useState, useEffect, useCallback } from 'react';
import { exerciseDBIntegration } from '@/lib/services/exercisedb-integration';
import { 
  ExerciseRecommendation, 
  RecommendationContext 
} from '@/lib/services/exercisedb-integration';

export interface UseExerciseDBIntegrationReturn {
  // Exercise data
  exercises: ExerciseRecommendation[];
  categories: string[];
  equipment: string[];
  muscleGroups: string[];
  
  // Recommendations
  recommendations: ExerciseRecommendation[];
  alternativeExercises: ExerciseRecommendation[];
  progressionExercises: ExerciseRecommendation[];
  
  // Search and filtering
  searchExercises: (query: string, filters?: any) => Promise<ExerciseRecommendation[]>; // eslint-disable-next-line no-unused-vars
  getExercisesByCategory: (category: string) => ExerciseRecommendation[]; // eslint-disable-next-line no-unused-vars
  getExercisesByEquipment: (equipment: string) => ExerciseRecommendation[]; // eslint-disable-next-line no-unused-vars
  getExercisesByMuscleGroup: (muscleGroup: string) => ExerciseRecommendation[]; // eslint-disable-next-line no-unused-vars
  
  // Smart recommendations
  getSmartRecommendations: (context: RecommendationContext, count?: number) => Promise<ExerciseRecommendation[]>; // eslint-disable-next-line no-unused-vars
  getAlternativeExercises: (exerciseId: string, context: RecommendationContext) => Promise<ExerciseRecommendation[]>; // eslint-disable-next-line no-unused-vars
  getProgressionExercises: (exerciseId: string, context: RecommendationContext) => Promise<ExerciseRecommendation[]>; // eslint-disable-next-line no-unused-vars
  analyzeExerciseCompatibility: (exerciseId: string, context: RecommendationContext) => Promise<any>; // eslint-disable-next-line no-unused-vars
  
  // Utility functions
  getExerciseById: (id: string) => ExerciseRecommendation | undefined; // eslint-disable-next-line no-unused-vars
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useExerciseDBIntegration(): UseExerciseDBIntegrationReturn {
  const [exercises, setExercises] = useState<ExerciseRecommendation[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<ExerciseRecommendation[]>([]);
  const [alternativeExercises, setAlternativeExercises] = useState<ExerciseRecommendation[]>([]);
  const [progressionExercises, setProgressionExercises] = useState<ExerciseRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Get all available data
        const allCategories = exerciseDBIntegration.getAllCategories();
        const allEquipment = exerciseDBIntegration.getAllEquipment();
        const allMuscleGroups = exerciseDBIntegration.getAllMuscleGroups();
        
        setCategories(allCategories);
        setEquipment(allEquipment);
        setMuscleGroups(allMuscleGroups);
        
        // Get some initial exercises
        const initialExercises = await exerciseDBIntegration.searchExercises('');
        setExercises(initialExercises);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize exercise data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Search exercises
  const searchExercises = useCallback(async (query: string, filters?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const results = await exerciseDBIntegration.searchExercises(query, filters);
      setExercises(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get exercises by category
  const getExercisesByCategory = useCallback((category: string) => {
    return exerciseDBIntegration.getExercisesByCategory(category);
  }, []);

  // Get exercises by equipment
  const getExercisesByEquipment = useCallback((equipment: string) => {
    return exerciseDBIntegration.getExercisesByEquipment(equipment);
  }, []);

  // Get exercises by muscle group
  const getExercisesByMuscleGroup = useCallback((muscleGroup: string) => {
    return exerciseDBIntegration.getExercisesByMuscleGroup(muscleGroup);
  }, []);

  // Get smart recommendations
  const getSmartRecommendations = useCallback(async (context: RecommendationContext, count: number = 5) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const results = await exerciseDBIntegration.getSmartRecommendations(context, count);
      setRecommendations(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get alternative exercises
  const getAlternativeExercises = useCallback(async (exerciseId: string, context: RecommendationContext) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const results = await exerciseDBIntegration.getAlternativeExercises(exerciseId, context);
      setAlternativeExercises(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get alternative exercises');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get progression exercises
  const getProgressionExercises = useCallback(async (exerciseId: string, context: RecommendationContext) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const results = await exerciseDBIntegration.getProgressionExercises(exerciseId, context);
      setProgressionExercises(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get progression exercises');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze exercise compatibility
  const analyzeExerciseCompatibility = useCallback(async (exerciseId: string, context: RecommendationContext) => {
    try {
      setError(null);
      return await exerciseDBIntegration.analyzeExerciseCompatibility(exerciseId, context);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze compatibility');
      return {
        compatibility: 0,
        reasons: ['Analysis failed'],
        warnings: []
      };
    }
  }, []);

  // Get exercise by ID
  const getExerciseById = useCallback((id: string) => {
    return exerciseDBIntegration.getExerciseById(id);
  }, []);

  return {
    exercises,
    categories,
    equipment,
    muscleGroups,
    recommendations,
    alternativeExercises,
    progressionExercises,
    searchExercises,
    getExercisesByCategory,
    getExercisesByEquipment,
    getExercisesByMuscleGroup,
    getSmartRecommendations,
    getAlternativeExercises,
    getProgressionExercises,
    analyzeExerciseCompatibility,
    getExerciseById,
    isLoading,
    error,
  };
}
