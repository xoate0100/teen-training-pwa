// YouTube API integration for exercise demonstration videos
// This service provides access to exercise demonstration videos

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration: string;
  view_count: number;
  like_count: number;
  published_at: string;
  channel_title: string;
  video_url: string;
  embed_url: string;
}

export interface YouTubeSearchParams {
  query: string;
  max_results?: number;
  order?: 'relevance' | 'date' | 'rating' | 'viewCount';
  duration?: 'short' | 'medium' | 'long';
  video_definition?: 'high' | 'standard';
}

export interface YouTubeSearchResponse {
  videos: YouTubeVideo[];
  total_results: number;
  next_page_token?: string;
}

class YouTubeService {
  private apiKey: string;
  private baseUrl: string = 'https://www.googleapis.com/youtube/v3';
  private cache: Map<string, YouTubeSearchResponse> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getCacheKey(params: YouTubeSearchParams): string {
    return JSON.stringify(params);
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private setCache(key: string, data: YouTubeSearchResponse): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private getCache(key: string): YouTubeSearchResponse | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key) || null;
    }
    return null;
  }

  /**
   * Search for exercise demonstration videos
   */
  async searchExerciseVideos(
    params: YouTubeSearchParams
  ): Promise<YouTubeSearchResponse> {
    const cacheKey = this.getCacheKey(params);
    const cached = this.getCache(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const searchParams = new URLSearchParams({
        part: 'snippet',
        q: params.query,
        type: 'video',
        key: this.apiKey,
        maxResults: (params.max_results || 10).toString(),
        order: params.order || 'relevance',
        videoDuration: params.duration || 'short',
        videoDefinition: params.video_definition || 'high',
        videoCategoryId: '26', // Howto & Style category
        safeSearch: 'moderate',
      });

      const response = await fetch(`${this.baseUrl}/search?${searchParams}`);

      if (!response.ok) {
        throw new Error(
          `YouTube API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Get additional video details
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const videoDetails = await this.getVideoDetails(videoIds);

      // Transform the response
      const transformedData: YouTubeSearchResponse = {
        videos: data.items.map((item: any) => {
          const details = videoDetails.find(v => v.id === item.id.videoId);
          return this.transformVideo(item, details);
        }),
        total_results: data.pageInfo.totalResults,
        next_page_token: data.nextPageToken,
      };

      this.setCache(cacheKey, transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      throw error;
    }
  }

  /**
   * Get video details including duration, view count, etc.
   */
  private async getVideoDetails(videoIds: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/videos?part=contentDetails,statistics&id=${videoIds}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(
          `YouTube API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching video details:', error);
      return [];
    }
  }

  /**
   * Search for specific exercise demonstration videos
   */
  async searchExerciseDemonstration(
    exerciseName: string,
    maxResults: number = 5
  ): Promise<YouTubeVideo[]> {
    const searchQueries = [
      `${exerciseName} exercise tutorial`,
      `${exerciseName} how to do`,
      `${exerciseName} form technique`,
      `${exerciseName} demonstration`,
      `${exerciseName} proper form`,
    ];

    const allVideos: YouTubeVideo[] = [];

    for (const query of searchQueries) {
      try {
        const response = await this.searchExerciseVideos({
          query,
          max_results: Math.ceil(maxResults / searchQueries.length),
          order: 'relevance',
          duration: 'short',
        });

        allVideos.push(...response.videos);
      } catch (error) {
        console.error(`Error searching for "${query}":`, error);
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueVideos = this.removeDuplicateVideos(allVideos);
    return uniqueVideos.slice(0, maxResults);
  }

  /**
   * Get videos for specific exercise categories
   */
  async getCategoryVideos(
    category: string,
    maxResults: number = 10
  ): Promise<YouTubeVideo[]> {
    const response = await this.searchExerciseVideos({
      query: `${category} exercises tutorial`,
      max_results: maxResults,
      order: 'relevance',
      duration: 'short',
    });

    return response.videos;
  }

  /**
   * Get videos for specific muscle groups
   */
  async getMuscleGroupVideos(
    muscleGroup: string,
    maxResults: number = 10
  ): Promise<YouTubeVideo[]> {
    const response = await this.searchExerciseVideos({
      query: `${muscleGroup} exercises workout`,
      max_results: maxResults,
      order: 'relevance',
      duration: 'short',
    });

    return response.videos;
  }

  /**
   * Get videos for specific equipment
   */
  async getEquipmentVideos(
    equipment: string,
    maxResults: number = 10
  ): Promise<YouTubeVideo[]> {
    const response = await this.searchExerciseVideos({
      query: `${equipment} exercises tutorial`,
      max_results: maxResults,
      order: 'relevance',
      duration: 'short',
    });

    return response.videos;
  }

  /**
   * Get videos for specific difficulty levels
   */
  async getDifficultyVideos(
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    maxResults: number = 10
  ): Promise<YouTubeVideo[]> {
    const response = await this.searchExerciseVideos({
      query: `${difficulty} exercises tutorial`,
      max_results: maxResults,
      order: 'relevance',
      duration: 'short',
    });

    return response.videos;
  }

  /**
   * Transform YouTube API response to our internal format
   */
  private transformVideo(item: any, details?: any): YouTubeVideo {
    const snippet = item.snippet;
    const statistics = details?.statistics || {};
    const contentDetails = details?.contentDetails || {};

    return {
      id: item.id.videoId,
      title: snippet.title,
      description: snippet.description,
      thumbnail_url:
        snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      duration: this.parseDuration(contentDetails.duration),
      view_count: parseInt(statistics.viewCount || '0'),
      like_count: parseInt(statistics.likeCount || '0'),
      published_at: snippet.publishedAt,
      channel_title: snippet.channelTitle,
      video_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embed_url: `https://www.youtube.com/embed/${item.id.videoId}`,
    };
  }

  /**
   * Parse YouTube duration format (PT1M30S) to readable format
   */
  private parseDuration(duration: string): string {
    if (!duration) return '0:00';

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Remove duplicate videos based on video ID
   */
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

  /**
   * Get video embed HTML for iframe
   */
  getVideoEmbedHTML(
    videoId: string,
    width: number = 560,
    height: number = 315
  ): string {
    return `
      <iframe
        width="${width}"
        height="${height}"
        src="https://www.youtube.com/embed/${videoId}"
        title="Exercise Demonstration"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
  }

  /**
   * Get video thumbnail URL with specific size
   */
  getThumbnailUrl(
    videoId: string,
    size: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'
  ): string {
    const sizeMap = {
      default: 'default',
      medium: 'mqdefault',
      high: 'hqdefault',
      standard: 'sddefault',
      maxres: 'maxresdefault',
    };

    return `https://img.youtube.com/vi/${videoId}/${sizeMap[size]}.jpg`;
  }
}

// Export singleton instance
export const youtubeService = new YouTubeService(
  process.env.YOUTUBE_API_KEY || ''
);

// Export the class for testing
export { YouTubeService };
