'use client';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  channelTitle: string;
  tags: string[];
  categoryId: string;
  defaultLanguage: string;
  contentRating: {
    ytRating: string;
  };
}

export interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

export interface VideoRecommendationContext {
  exerciseType: 'strength' | 'volleyball' | 'plyometric' | 'recovery';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  targetMuscleGroups: string[];
  sessionDuration: 'short' | 'medium' | 'long';
  equipment: string[];
  preferences: {
    language: string;
    maxDuration: number; // in minutes
    minViewCount: number;
    includeFormDemonstrations: boolean;
    includeProgressions: boolean;
  };
  previousVideos: string[];
  userAge: number;
}

export interface VideoRecommendation {
  video: YouTubeVideo;
  relevanceScore: number;
  reasons: string[];
  warnings: string[];
  metadata: {
    isFormDemonstration: boolean;
    isProgression: boolean;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    equipmentRequired: string[];
    muscleGroups: string[];
    estimatedDuration: number;
  };
}

export interface YouTubeAPIConfig {
  apiKey: string;
  baseUrl: string;
  maxResults: number;
  regionCode: string;
  language: string;
  safeSearch: 'none' | 'moderate' | 'strict';
}

export class YouTubeAPIIntegrationService {
  private config: YouTubeAPIConfig = {
    apiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    maxResults: 50,
    regionCode: 'US',
    language: 'en',
    safeSearch: 'moderate',
  };

  private videoCache: Map<string, YouTubeVideo> = new Map();
  private searchCache: Map<string, YouTubeSearchResult> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  constructor(config?: Partial<YouTubeAPIConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  // Search for videos
  async searchVideos(
    query: string,
    context: VideoRecommendationContext,
    pageToken?: string
  ): Promise<YouTubeSearchResult> {
    const cacheKey = `search_${query}_${JSON.stringify(context)}_${pageToken || 'first'}`;

    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      const cached = this.searchCache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const searchParams = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        key: this.config.apiKey,
        maxResults: this.config.maxResults.toString(),
        regionCode: this.config.regionCode,
        relevanceLanguage: this.config.language,
        safeSearch: this.config.safeSearch,
        videoDuration: this.getDurationFilter(context.sessionDuration),
        videoDefinition: 'high',
        videoEmbeddable: 'true',
        order: 'relevance',
      });

      if (pageToken) {
        searchParams.append('pageToken', pageToken);
      }

      const response = await fetch(
        `${this.config.baseUrl}/search?${searchParams}`
      );

      if (!response.ok) {
        throw new Error(
          `YouTube API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const videos: YouTubeVideo[] = [];

      if (data.items) {
        for (const item of data.items) {
          const video = await this.getVideoDetails(item.id.videoId);
          if (video) {
            videos.push(video);
          }
        }
      }

      const result: YouTubeSearchResult = {
        videos,
        nextPageToken: data.nextPageToken,
        totalResults: data.pageInfo?.totalResults || 0,
      };

      // Cache the result
      this.searchCache.set(cacheKey, result);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);

      return result;
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      throw error;
    }
  }

  // Get video details
  async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    // Check cache first
    if (this.videoCache.has(videoId)) {
      return this.videoCache.get(videoId)!;
    }

    try {
      const response = await fetch(
        `${this.config.baseUrl}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${this.config.apiKey}`
      );

      if (!response.ok) {
        throw new Error(
          `YouTube API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        return null;
      }

      const item = data.items[0];
      const video: YouTubeVideo = {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.default?.url,
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        tags: item.snippet.tags || [],
        categoryId: item.snippet.categoryId,
        defaultLanguage: item.snippet.defaultLanguage || 'en',
        contentRating: {
          ytRating:
            item.contentDetails.contentRating?.ytRating || 'ytUnspecified',
        },
      };

      // Cache the video
      this.videoCache.set(videoId, video);

      return video;
    } catch (error) {
      console.error('Error getting video details:', error);
      return null;
    }
  }

  // Get contextual video recommendations
  async getContextualRecommendations(
    context: VideoRecommendationContext
  ): Promise<VideoRecommendation[]> {
    const queries = this.generateSearchQueries(context);
    const allVideos: YouTubeVideo[] = [];

    // Search with multiple queries
    for (const query of queries) {
      try {
        const result = await this.searchVideos(query, context);
        allVideos.push(...result.videos);
      } catch (error) {
        console.error(`Error searching for query "${query}":`, error);
      }
    }

    // Remove duplicates
    const uniqueVideos = this.removeDuplicateVideos(allVideos);

    // Score and rank videos
    const recommendations = uniqueVideos
      .map(video => this.scoreVideo(video, context))
      .filter(rec => rec.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20); // Return top 20 recommendations

    return recommendations;
  }

  // Generate search queries based on context
  private generateSearchQueries(context: VideoRecommendationContext): string[] {
    const queries: string[] = [];

    // Base exercise type queries
    const exerciseTypeQueries = {
      strength: [
        'strength training',
        'weightlifting',
        'resistance training',
        'muscle building',
      ],
      volleyball: [
        'volleyball training',
        'volleyball skills',
        'volleyball drills',
        'volleyball conditioning',
      ],
      plyometric: [
        'plyometric training',
        'jump training',
        'explosive training',
        'athletic performance',
      ],
      recovery: [
        'recovery exercises',
        'stretching',
        'mobility',
        'rehabilitation',
      ],
    };

    const baseQueries = exerciseTypeQueries[context.exerciseType] || [];

    // Add skill level specific queries
    const skillLevelQueries = {
      beginner: ['beginner', 'basic', 'introduction', 'tutorial'],
      intermediate: ['intermediate', 'advanced beginner', 'progress'],
      advanced: ['advanced', 'expert', 'professional', 'elite'],
    };

    const skillQueries = skillLevelQueries[context.skillLevel] || [];

    // Add muscle group specific queries
    const muscleGroupQueries = context.targetMuscleGroups.map(
      mg => `${mg} exercises`,
      `${mg} training`,
      `${mg} workout`
    );

    // Add equipment specific queries
    const equipmentQueries = context.equipment
      .filter(eq => eq !== 'none')
      .map(eq => `${eq} exercises`, `${eq} workout`);

    // Add form demonstration queries
    if (context.preferences.includeFormDemonstrations) {
      queries.push('proper form', 'technique', 'form demonstration', 'how to');
    }

    // Add progression queries
    if (context.preferences.includeProgressions) {
      queries.push('progression', 'progress', 'next level', 'advance');
    }

    // Combine all queries
    for (const baseQuery of baseQueries) {
      for (const skillQuery of skillQueries) {
        queries.push(`${baseQuery} ${skillQuery}`);
      }

      for (const muscleQuery of muscleGroupQueries) {
        queries.push(`${baseQuery} ${muscleQuery}`);
      }

      for (const equipmentQuery of equipmentQueries) {
        queries.push(`${baseQuery} ${equipmentQuery}`);
      }
    }

    // Add specific combinations
    queries.push(
      `${context.exerciseType} ${context.skillLevel}`,
      `${context.exerciseType} form`,
      `${context.exerciseType} technique`,
      `${context.exerciseType} tutorial`
    );

    return queries.slice(0, 10); // Limit to 10 queries
  }

  // Score video based on context
  private scoreVideo(
    video: YouTubeVideo,
    context: VideoRecommendationContext
  ): VideoRecommendation {
    let score = 0;
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Base score from video metrics
    score += Math.min(100, video.viewCount / 10000); // View count bonus
    score += Math.min(50, video.likeCount / 1000); // Like count bonus

    // Title relevance
    const titleLower = video.title.toLowerCase();
    const descriptionLower = video.description.toLowerCase();

    // Exercise type relevance
    const exerciseTypeKeywords = {
      strength: ['strength', 'weight', 'muscle', 'gym', 'fitness'],
      volleyball: ['volleyball', 'volley', 'spike', 'serve', 'dig'],
      plyometric: ['plyometric', 'jump', 'explosive', 'power', 'athletic'],
      recovery: ['recovery', 'stretch', 'mobility', 'rehab', 'rest'],
    };

    const keywords = exerciseTypeKeywords[context.exerciseType] || [];
    const titleMatches = keywords.filter(keyword =>
      titleLower.includes(keyword)
    ).length;
    score += titleMatches * 20;

    if (titleMatches > 0) {
      reasons.push(`Title matches ${context.exerciseType} keywords`);
    }

    // Skill level relevance
    const skillLevelKeywords = {
      beginner: ['beginner', 'basic', 'introduction', 'tutorial', 'start'],
      intermediate: ['intermediate', 'progress', 'next level', 'advance'],
      advanced: ['advanced', 'expert', 'professional', 'elite', 'master'],
    };

    const skillKeywords = skillLevelKeywords[context.skillLevel] || [];
    const skillMatches = skillKeywords.filter(
      keyword =>
        titleLower.includes(keyword) || descriptionLower.includes(keyword)
    ).length;
    score += skillMatches * 15;

    if (skillMatches > 0) {
      reasons.push(`Content matches ${context.skillLevel} level`);
    }

    // Muscle group relevance
    const muscleGroupMatches = context.targetMuscleGroups.filter(
      mg =>
        titleLower.includes(mg.toLowerCase()) ||
        descriptionLower.includes(mg.toLowerCase())
    ).length;
    score += muscleGroupMatches * 10;

    if (muscleGroupMatches > 0) {
      reasons.push(
        `Targets desired muscle groups: ${context.targetMuscleGroups.slice(0, muscleGroupMatches).join(', ')}`
      );
    }

    // Form demonstration bonus
    const formKeywords = [
      'form',
      'technique',
      'proper',
      'correct',
      'demonstration',
      'how to',
    ];
    const formMatches = formKeywords.filter(
      keyword =>
        titleLower.includes(keyword) || descriptionLower.includes(keyword)
    ).length;
    score += formMatches * 25;

    if (formMatches > 0) {
      reasons.push('Includes form demonstration');
    }

    // Duration relevance
    const duration = this.parseDuration(video.duration);
    const durationScore = this.scoreDuration(duration, context.sessionDuration);
    score += durationScore;

    if (durationScore > 0) {
      reasons.push(`Duration matches session length (${duration} minutes)`);
    }

    // Equipment relevance
    const equipmentMatches = context.equipment.filter(
      eq =>
        eq !== 'none' &&
        (titleLower.includes(eq.toLowerCase()) ||
          descriptionLower.includes(eq.toLowerCase()))
    ).length;
    score += equipmentMatches * 5;

    // Language relevance
    if (video.defaultLanguage === context.preferences.language) {
      score += 10;
      reasons.push('Video in preferred language');
    }

    // Age appropriateness
    if (
      context.userAge < 18 &&
      video.contentRating.ytRating === 'ytUnspecified'
    ) {
      score += 5;
      reasons.push('Age-appropriate content');
    }

    // View count threshold
    if (video.viewCount < context.preferences.minViewCount) {
      score -= 20;
      warnings.push('Low view count');
    }

    // Duration threshold
    if (duration > context.preferences.maxDuration) {
      score -= 15;
      warnings.push(`Video too long (${duration} minutes)`);
    }

    // Avoid recently watched videos
    if (context.previousVideos.includes(video.id)) {
      score -= 30;
      warnings.push('Recently watched');
    }

    // Channel credibility bonus
    const credibleChannels = [
      'Athlean-X',
      'Fitness Blender',
      'Pamela Reif',
      'Chloe Ting',
      'Jeremy Ethier',
      'Jeff Nippard',
      'Squat University',
      'Alan Thrall',
    ];

    if (
      credibleChannels.some(channel => video.channelTitle.includes(channel))
    ) {
      score += 20;
      reasons.push('From credible fitness channel');
    }

    // Generate metadata
    const metadata = {
      isFormDemonstration: formMatches > 0,
      isProgression:
        titleLower.includes('progression') ||
        descriptionLower.includes('progression'),
      difficultyLevel: this.assessDifficultyLevel(video, context),
      equipmentRequired: this.extractEquipment(video),
      muscleGroups: this.extractMuscleGroups(video),
      estimatedDuration: duration,
    };

    return {
      video,
      relevanceScore: Math.max(0, score),
      reasons,
      warnings,
      metadata,
    };
  }

  // Parse duration string to minutes
  private parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    return hours * 60 + minutes + seconds / 60;
  }

  // Score duration based on session duration preference
  private scoreDuration(
    videoDuration: number,
    sessionDuration: string
  ): number {
    const durationRanges = {
      short: [5, 15],
      medium: [15, 30],
      long: [30, 60],
    };

    const [min, max] = durationRanges[sessionDuration] || [0, 60];

    if (videoDuration >= min && videoDuration <= max) {
      return 20;
    } else if (videoDuration >= min * 0.8 && videoDuration <= max * 1.2) {
      return 10;
    } else {
      return -10;
    }
  }

  // Assess difficulty level
  private assessDifficultyLevel(
    video: YouTubeVideo,
    context: VideoRecommendationContext
  ): 'beginner' | 'intermediate' | 'advanced' {
    const titleLower = video.title.toLowerCase();
    const descriptionLower = video.description.toLowerCase();

    const beginnerKeywords = [
      'beginner',
      'basic',
      'introduction',
      'tutorial',
      'start',
      'easy',
    ];
    const advancedKeywords = [
      'advanced',
      'expert',
      'professional',
      'elite',
      'master',
      'hard',
      'challenging',
    ];

    const beginnerMatches = beginnerKeywords.filter(
      keyword =>
        titleLower.includes(keyword) || descriptionLower.includes(keyword)
    ).length;

    const advancedMatches = advancedKeywords.filter(
      keyword =>
        titleLower.includes(keyword) || descriptionLower.includes(keyword)
    ).length;

    if (beginnerMatches > advancedMatches) return 'beginner';
    if (advancedMatches > beginnerMatches) return 'advanced';
    return 'intermediate';
  }

  // Extract equipment from video
  private extractEquipment(video: YouTubeVideo): string[] {
    const equipmentKeywords = [
      'dumbbell',
      'barbell',
      'kettlebell',
      'resistance band',
      'yoga mat',
      'pull-up bar',
      'bench',
      'squat rack',
      'cable',
      'machine',
    ];

    const titleLower = video.title.toLowerCase();
    const descriptionLower = video.description.toLowerCase();

    return equipmentKeywords.filter(
      equipment =>
        titleLower.includes(equipment) || descriptionLower.includes(equipment)
    );
  }

  // Extract muscle groups from video
  private extractMuscleGroups(video: YouTubeVideo): string[] {
    const muscleGroups = [
      'chest',
      'back',
      'shoulders',
      'biceps',
      'triceps',
      'forearms',
      'abs',
      'core',
      'obliques',
      'quadriceps',
      'hamstrings',
      'glutes',
      'calves',
      'legs',
      'arms',
      'upper body',
      'lower body',
    ];

    const titleLower = video.title.toLowerCase();
    const descriptionLower = video.description.toLowerCase();

    return muscleGroups.filter(
      muscle => titleLower.includes(muscle) || descriptionLower.includes(muscle)
    );
  }

  // Remove duplicate videos
  private removeDuplicateVideos(videos: YouTubeVideo[]): YouTubeVideo[] {
    const seen = new Set<string>();
    return videos.filter(video => {
      if (seen.has(video.id)) {
        return false;
      }
      seen.add(video.id);
      return true;
    });
  }

  // Check if cache is valid
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  // Clear cache
  clearCache(): void {
    this.videoCache.clear();
    this.searchCache.clear();
    this.cacheExpiry.clear();
  }

  // Get cache statistics
  getCacheStats(): {
    videoCount: number;
    searchCount: number;
    memoryUsage: number;
  } {
    return {
      videoCount: this.videoCache.size,
      searchCount: this.searchCache.size,
      memoryUsage: JSON.stringify([
        ...this.videoCache.values(),
        ...this.searchCache.values(),
      ]).length,
    };
  }

  // Update configuration
  updateConfig(config: Partial<YouTubeAPIConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const youtubeAPIIntegration = new YouTubeAPIIntegrationService();
