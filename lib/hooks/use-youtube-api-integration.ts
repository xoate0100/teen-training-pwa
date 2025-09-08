'use client';

import { useState, useEffect, useCallback } from 'react';
import { youtubeAPIIntegration } from '@/lib/services/youtube-api-integration';
import {
  YouTubeVideo,
  YouTubeSearchResult,
  VideoRecommendationContext,
  VideoRecommendation,
  YouTubeAPIConfig,
} from '@/lib/services/youtube-api-integration';

export interface UseYouTubeAPIIntegrationReturn {
  // Video data
  videos: YouTubeVideo[];
  recommendations: VideoRecommendation[];
  searchResults: YouTubeSearchResult | null;

  // Search and recommendations
  searchVideos: (
    query: string,
    context: VideoRecommendationContext,
    pageToken?: string
  ) => Promise<YouTubeSearchResult>;
  getContextualRecommendations: (
    context: VideoRecommendationContext
  ) => Promise<VideoRecommendation[]>;
  getVideoDetails: (videoId: string) => Promise<YouTubeVideo | null>;

  // Configuration
  updateConfig: (config: Partial<YouTubeAPIConfig>) => void;

  // Cache management
  clearCache: () => void;
  getCacheStats: () => {
    videoCount: number;
    searchCount: number;
    memoryUsage: number;
  };

  // Loading states
  isLoading: boolean;
  error: string | null;
}

export function useYouTubeAPIIntegration(): UseYouTubeAPIIntegrationReturn {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [recommendations, setRecommendations] = useState<VideoRecommendation[]>(
    []
  );
  const [searchResults, setSearchResults] =
    useState<YouTubeSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search videos
  const searchVideos = useCallback(
    async (
      query: string,
      context: VideoRecommendationContext,
      pageToken?: string
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await youtubeAPIIntegration.searchVideos(
          query,
          context,
          pageToken
        );
        setSearchResults(result);
        setVideos(result.videos);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get contextual recommendations
  const getContextualRecommendations = useCallback(
    async (context: VideoRecommendationContext) => {
      try {
        setIsLoading(true);
        setError(null);

        const result =
          await youtubeAPIIntegration.getContextualRecommendations(context);
        setRecommendations(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to get recommendations';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get video details
  const getVideoDetails = useCallback(async (videoId: string) => {
    try {
      setError(null);
      return await youtubeAPIIntegration.getVideoDetails(videoId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get video details';
      setError(errorMessage);
      return null;
    }
  }, []);

  // Update configuration
  const updateConfig = useCallback((config: Partial<YouTubeAPIConfig>) => {
    youtubeAPIIntegration.updateConfig(config);
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    youtubeAPIIntegration.clearCache();
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return youtubeAPIIntegration.getCacheStats();
  }, []);

  return {
    videos,
    recommendations,
    searchResults,
    searchVideos,
    getContextualRecommendations,
    getVideoDetails,
    updateConfig,
    clearCache,
    getCacheStats,
    isLoading,
    error,
  };
}
