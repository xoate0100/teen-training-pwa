// ExerciseDB API integration using Vercel Bypass Token
// This service provides access to a comprehensive exercise database via Vercel-protected API

export interface ExerciseDBExercise {
  id: string;
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
  data: ExerciseDBExercise[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

class ExerciseDBService {
  private bypassToken: string;
  private baseUrl: string =
    'https://epicexercisedb-qo18rbbm7-xoate0100s-projects.vercel.app';
  private cache: Map<string, ExerciseDBResponse> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor(bypassToken: string) {
    this.bypassToken = bypassToken;
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
   * Make authenticated requests to the ExerciseDB API using Vercel bypass token
   */
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${this.bypassToken}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TeenTrainingPWA/1.0',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      throw new Error(
        'Invalid bypass token. Please check your VERCEL_BYPASS_TOKEN.'
      );
    }

    if (response.status === 403) {
      throw new Error('Access denied. Token may be expired or revoked.');
    }

    if (response.status === 500) {
      // API is having internal issues, return empty data gracefully
      console.warn('ExerciseDB API returned 500 error, returning empty data');
      return { data: [], total: 0, page: 1, limit: 20, total_pages: 0 };
    }

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
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

      const data = await this.request(`/api/v1/exercises?${searchParams}`);

      // Transform the response to match our interface
      const transformedData: ExerciseDBResponse = {
        data: data.data?.map((ex: any) => this.transformExercise(ex)) || [],
        total: data.total || 0,
        page: data.page || 1,
        limit: data.limit || 20,
        total_pages: Math.ceil((data.total || 0) / (data.limit || 20)),
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
  async getExerciseById(id: string): Promise<ExerciseDBExercise | null> {
    try {
      const data = await this.request(`/api/v1/exercises/${id}`);
      return this.transformExercise(data);
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
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
    return response.data;
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
    return response.data;
  }

  /**
   * Get exercises by equipment
   */
  async getExercisesByEquipment(
    equipment: string,
    limit: number = 50
  ): Promise<ExerciseDBExercise[]> {
    const response = await this.searchExercises({ equipment, limit });
    return response.data;
  }

  /**
   * Get exercises by difficulty level
   */
  async getExercisesByDifficulty(
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    limit: number = 50
  ): Promise<ExerciseDBExercise[]> {
    const response = await this.searchExercises({ difficulty, limit });
    return response.data;
  }

  /**
   * Search exercises by name or description
   */
  async searchExercisesByName(
    searchTerm: string,
    limit: number = 20
  ): Promise<ExerciseDBExercise[]> {
    const response = await this.searchExercises({ search: searchTerm, limit });
    return response.data;
  }

  /**
   * Get all available muscles
   */
  async getMuscles(): Promise<string[]> {
    try {
      const data = await this.request('/api/v1/muscles');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching muscles from ExerciseDB:', error);
      // Return fallback muscle groups
      return [
        'chest',
        'back',
        'shoulders',
        'biceps',
        'triceps',
        'forearms',
        'abs',
        'obliques',
        'quadriceps',
        'hamstrings',
        'glutes',
        'calves',
        'traps',
        'lats',
        'rhomboids',
        'deltoids',
      ];
    }
  }

  /**
   * Get all available body parts
   */
  async getBodyParts(): Promise<string[]> {
    try {
      const data = await this.request('/api/v1/bodyparts');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching body parts from ExerciseDB:', error);
      // Return fallback body parts
      return [
        'chest',
        'back',
        'shoulders',
        'arms',
        'legs',
        'core',
        'full body',
      ];
    }
  }

  /**
   * Get all available equipment
   */
  async getEquipments(): Promise<string[]> {
    try {
      const data = await this.request('/api/v1/equipments');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching equipment from ExerciseDB:', error);
      // Return fallback equipment
      return [
        'none',
        'dumbbells',
        'barbell',
        'kettlebell',
        'resistance_bands',
        'pull_up_bar',
        'bench',
        'mat',
        'medicine_ball',
        'stability_ball',
        'cable_machine',
        'treadmill',
        'bike',
        'rower',
      ];
    }
  }

  /**
   * Get exercises by muscle name
   */
  async getExercisesByMuscle(
    muscleName: string,
    params: ExerciseDBSearchParams = {}
  ): Promise<ExerciseDBExercise[]> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const data = await this.request(
        `/api/v1/muscles/${muscleName}/exercises?${searchParams}`
      );
      return data.data?.map((ex: any) => this.transformExercise(ex)) || [];
    } catch (error) {
      console.error(
        `Error fetching exercises for muscle ${muscleName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get exercises by body part
   */
  async getExercisesByBodyPart(
    bodyPart: string,
    params: ExerciseDBSearchParams = {}
  ): Promise<ExerciseDBExercise[]> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const data = await this.request(
        `/api/v1/bodyparts/${bodyPart}/exercises?${searchParams}`
      );
      return data.data?.map((ex: any) => this.transformExercise(ex)) || [];
    } catch (error) {
      console.error(
        `Error fetching exercises for body part ${bodyPart}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get exercises by equipment
   */
  async getExercisesByEquipmentName(
    equipment: string,
    params: ExerciseDBSearchParams = {}
  ): Promise<ExerciseDBExercise[]> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });

      const data = await this.request(
        `/api/v1/equipments/${equipment}/exercises?${searchParams}`
      );
      return data.data?.map((ex: any) => this.transformExercise(ex)) || [];
    } catch (error) {
      console.error(
        `Error fetching exercises for equipment ${equipment}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Transform ExerciseDB exercise to our internal format
   */
  private transformExercise(exercise: any): ExerciseDBExercise {
    return {
      id: exercise.id || exercise._id || '',
      name: exercise.name || '',
      description: exercise.description || exercise.instructions?.[0] || '',
      category: exercise.category || exercise.bodyPart || 'General',
      muscle_groups: exercise.muscle_groups || exercise.secondaryMuscles || [],
      equipment: exercise.equipment || [exercise.equipment] || [],
      difficulty_level: this.mapDifficultyLevel(
        exercise.difficulty_level || exercise.level
      ),
      instructions: exercise.instructions || [],
      video_url: exercise.video_url || exercise.gifUrl,
      image_url: exercise.image_url || exercise.gifUrl,
      alternative_names: exercise.alternative_names || exercise.aliases || [],
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

// Export singleton instance with Vercel bypass token
export const exerciseDBService = new ExerciseDBService(
  process.env.VERCEL_BYPASS_TOKEN || 'J8oXkb6jpVtfdtHUztv6ib4kZJI8Z8pN'
);

// Export the class for testing
export { ExerciseDBService };
