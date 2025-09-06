// ExerciseDB API integration for accessing 5000+ exercises
// This service provides access to a comprehensive exercise database

export interface ExerciseDBExercise {
  id: number;
  name: string;
  description: string;
  category: string;
  muscle_groups: string[];
  equipment: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  video_url?: string;
  image_url?: string;
  alternative_names?: string[];
  tips?: string[];
  common_mistakes?: string[];
  variations?: string[];
}

export interface ExerciseDBSearchParams {
  category?: string;
  muscle_group?: string;
  equipment?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ExerciseDBResponse {
  exercises: ExerciseDBExercise[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

class ExerciseDBService {
  private apiKey: string;
  private baseUrl: string = 'https://api.exercisedb.io/v1';
  private cache: Map<string, ExerciseDBResponse> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getCacheKey(params: ExerciseDBSearchParams): string {
    return JSON.stringify(params);
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private setCache(key: string, data: ExerciseDBResponse): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private getCache(key: string): ExerciseDBResponse | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key) || null;
    }
    return null;
  }

  /**
   * Search exercises with various filters
   */
  async searchExercises(
    params: ExerciseDBSearchParams = {}
  ): Promise<ExerciseDBResponse> {
    const cacheKey = this.getCacheKey(params);
    const cached = this.getCache(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const searchParams = new URLSearchParams();

      if (params.category) searchParams.append('category', params.category);
      if (params.muscle_group)
        searchParams.append('muscle_group', params.muscle_group);
      if (params.equipment) searchParams.append('equipment', params.equipment);
      if (params.difficulty)
        searchParams.append('difficulty', params.difficulty);
      if (params.search) searchParams.append('search', params.search);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());

      const response = await fetch(
        `${this.baseUrl}/exercises?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `ExerciseDB API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Transform the response to match our interface
      const transformedData: ExerciseDBResponse = {
        exercises: data.exercises.map((ex: any) => this.transformExercise(ex)),
        total: data.total,
        page: data.page || 1,
        limit: data.limit || 20,
        total_pages: Math.ceil(data.total / (data.limit || 20)),
      };

      this.setCache(cacheKey, transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error fetching exercises from ExerciseDB:', error);
      throw error;
    }
  }

  /**
   * Get a specific exercise by ID
   */
  async getExerciseById(id: number): Promise<ExerciseDBExercise | null> {
    try {
      const response = await fetch(`${this.baseUrl}/exercises/${id}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(
          `ExerciseDB API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return this.transformExercise(data);
    } catch (error) {
      console.error(`Error fetching exercise ${id} from ExerciseDB:`, error);
      throw error;
    }
  }

  /**
   * Get exercises by category
   */
  async getExercisesByCategory(
    category: string,
    limit: number = 50
  ): Promise<ExerciseDBExercise[]> {
    const response = await this.searchExercises({ category, limit });
    return response.exercises;
  }

  /**
   * Get exercises by muscle group
   */
  async getExercisesByMuscleGroup(
    muscleGroup: string,
    limit: number = 50
  ): Promise<ExerciseDBExercise[]> {
    const response = await this.searchExercises({
      muscle_group: muscleGroup,
      limit,
    });
    return response.exercises;
  }

  /**
   * Get exercises by equipment
   */
  async getExercisesByEquipment(
    equipment: string,
    limit: number = 50
  ): Promise<ExerciseDBExercise[]> {
    const response = await this.searchExercises({ equipment, limit });
    return response.exercises;
  }

  /**
   * Get exercises by difficulty level
   */
  async getExercisesByDifficulty(
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    limit: number = 50
  ): Promise<ExerciseDBExercise[]> {
    const response = await this.searchExercises({ difficulty, limit });
    return response.exercises;
  }

  /**
   * Search exercises by name or description
   */
  async searchExercisesByName(
    searchTerm: string,
    limit: number = 20
  ): Promise<ExerciseDBExercise[]> {
    const response = await this.searchExercises({ search: searchTerm, limit });
    return response.exercises;
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `ExerciseDB API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories from ExerciseDB:', error);
      throw error;
    }
  }

  /**
   * Get all available muscle groups
   */
  async getMuscleGroups(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/muscle-groups`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `ExerciseDB API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.muscle_groups || [];
    } catch (error) {
      console.error('Error fetching muscle groups from ExerciseDB:', error);
      throw error;
    }
  }

  /**
   * Get all available equipment
   */
  async getEquipment(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/equipment`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `ExerciseDB API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.equipment || [];
    } catch (error) {
      console.error('Error fetching equipment from ExerciseDB:', error);
      throw error;
    }
  }

  /**
   * Transform ExerciseDB exercise to our internal format
   */
  private transformExercise(exercise: any): ExerciseDBExercise {
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description || '',
      category: exercise.category || 'General',
      muscle_groups: exercise.muscle_groups || [],
      equipment: exercise.equipment || [],
      difficulty_level: this.mapDifficultyLevel(exercise.difficulty_level),
      instructions: exercise.instructions || [],
      video_url: exercise.video_url,
      image_url: exercise.image_url,
      alternative_names: exercise.alternative_names || [],
      tips: exercise.tips || [],
      common_mistakes: exercise.common_mistakes || [],
      variations: exercise.variations || [],
    };
  }

  /**
   * Map ExerciseDB difficulty levels to our internal format
   */
  private mapDifficultyLevel(
    level: string
  ): 'beginner' | 'intermediate' | 'advanced' {
    const levelMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
      beginner: 'beginner',
      easy: 'beginner',
      '1': 'beginner',
      intermediate: 'intermediate',
      medium: 'intermediate',
      '2': 'intermediate',
      advanced: 'advanced',
      hard: 'advanced',
      expert: 'advanced',
      '3': 'advanced',
    };

    return levelMap[level?.toLowerCase()] || 'beginner';
  }

  /**
   * Sync exercises to local database
   */
  async syncExercisesToDatabase(
    supabase: any,
    batchSize: number = 100
  ): Promise<{ synced: number; errors: number }> {
    let synced = 0;
    let errors = 0;
    let page = 1;

    try {
      while (true) {
        const response = await this.searchExercises({
          page,
          limit: batchSize,
        });

        if (response.exercises.length === 0) {
          break;
        }

        // Transform exercises for database insertion
        const exercisesToInsert = response.exercises.map(exercise => ({
          name: exercise.name,
          description: exercise.description,
          category: exercise.category,
          muscle_groups: exercise.muscle_groups,
          equipment: exercise.equipment,
          difficulty_level: exercise.difficulty_level,
          instructions: exercise.instructions,
          video_url: exercise.video_url,
          image_url: exercise.image_url,
          is_custom: false,
        }));

        // Insert batch into database
        const { error } = await supabase
          .from('exercises')
          .upsert(exercisesToInsert, { onConflict: 'name' });

        if (error) {
          console.error(`Error syncing exercises batch ${page}:`, error);
          errors += exercisesToInsert.length;
        } else {
          synced += exercisesToInsert.length;
          console.log(
            `Synced batch ${page}: ${exercisesToInsert.length} exercises`
          );
        }

        page++;

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return { synced, errors };
    } catch (error) {
      console.error('Error syncing exercises to database:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const exerciseDBService = new ExerciseDBService(
  process.env.EXERCISEDB_API_KEY || ''
);

// Export the class for testing
export { ExerciseDBService };
