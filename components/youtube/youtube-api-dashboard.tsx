'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Play,
  Search,
  ThumbsUp,
  Eye,
  Clock,
  Star,
  Filter,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';
import { useYouTubeAPIIntegration } from '@/lib/hooks/use-youtube-api-integration';
import {
  VideoRecommendationContext,
  VideoRecommendation,
} from '@/lib/services/youtube-api-integration';

export function YouTubeAPIDashboard() {
  const {
    videos,
    recommendations,
    searchResults,
    searchVideos,
    getContextualRecommendations,
    getVideoDetails,
    clearCache,
    getCacheStats,
    isLoading,
    error,
  } = useYouTubeAPIIntegration();

  const [searchQuery, setSearchQuery] = useState('');
  const [recommendationContext, setRecommendationContext] =
    useState<VideoRecommendationContext>({
      exerciseType: 'strength',
      skillLevel: 'beginner',
      targetMuscleGroups: [],
      sessionDuration: 'medium',
      equipment: ['none'],
      preferences: {
        language: 'en',
        maxDuration: 30,
        minViewCount: 1000,
        includeFormDemonstrations: true,
        includeProgressions: true,
      },
      previousVideos: [],
      userAge: 16,
    });
  const [selectedVideo, setSelectedVideo] =
    useState<VideoRecommendation | null>(null);
  const [cacheStats, setCacheStats] = useState({
    videoCount: 0,
    searchCount: 0,
    memoryUsage: 0,
  });

  // Update cache stats periodically
  useEffect(() => {
    const updateStats = () => {
      setCacheStats(getCacheStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, [getCacheStats]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      await searchVideos(searchQuery, recommendationContext);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Handle get recommendations
  const handleGetRecommendations = async () => {
    try {
      await getContextualRecommendations(recommendationContext);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
  };

  // Handle video selection
  const handleVideoSelect = (video: VideoRecommendation) => {
    setSelectedVideo(video);
  };

  // Format duration
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'Unknown';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  // Format view count
  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Get relevance color
  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get relevance badge
  const getRelevanceBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className='space-y-6'>
      {/* Search and Context */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Play className='h-5 w-5' />
            YouTube Video Search & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Search Bar */}
            <div className='flex gap-2'>
              <Input
                placeholder='Search for exercise videos...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='flex-1'
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
              >
                <Search className='h-4 w-4 mr-2' />
                Search
              </Button>
            </div>

            {/* Recommendation Context */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Exercise Type
                </label>
                <Select
                  value={recommendationContext.exerciseType}
                  onValueChange={(value: any) =>
                    setRecommendationContext(prev => ({
                      ...prev,
                      exerciseType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='strength'>Strength</SelectItem>
                    <SelectItem value='volleyball'>Volleyball</SelectItem>
                    <SelectItem value='plyometric'>Plyometric</SelectItem>
                    <SelectItem value='recovery'>Recovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Skill Level
                </label>
                <Select
                  value={recommendationContext.skillLevel}
                  onValueChange={(value: any) =>
                    setRecommendationContext(prev => ({
                      ...prev,
                      skillLevel: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='beginner'>Beginner</SelectItem>
                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                    <SelectItem value='advanced'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Session Duration
                </label>
                <Select
                  value={recommendationContext.sessionDuration}
                  onValueChange={(value: any) =>
                    setRecommendationContext(prev => ({
                      ...prev,
                      sessionDuration: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='short'>Short (5-15 min)</SelectItem>
                    <SelectItem value='medium'>Medium (15-30 min)</SelectItem>
                    <SelectItem value='long'>Long (30+ min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-end'>
                <Button onClick={handleGetRecommendations} disabled={isLoading}>
                  <Zap className='h-4 w-4 mr-2' />
                  Get Recommendations
                </Button>
              </div>
            </div>

            {/* Preferences */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Max Duration (minutes)
                </label>
                <Input
                  type='number'
                  value={recommendationContext.preferences.maxDuration}
                  onChange={e =>
                    setRecommendationContext(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        maxDuration: parseInt(e.target.value),
                      },
                    }))
                  }
                  min='1'
                  max='120'
                />
              </div>

              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Min View Count
                </label>
                <Input
                  type='number'
                  value={recommendationContext.preferences.minViewCount}
                  onChange={e =>
                    setRecommendationContext(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        minViewCount: parseInt(e.target.value),
                      },
                    }))
                  }
                  min='0'
                />
              </div>

              <div className='flex items-center gap-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={
                      recommendationContext.preferences
                        .includeFormDemonstrations
                    }
                    onChange={e =>
                      setRecommendationContext(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          includeFormDemonstrations: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span className='text-sm'>Form Demos</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={
                      recommendationContext.preferences.includeProgressions
                    }
                    onChange={e =>
                      setRecommendationContext(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          includeProgressions: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span className='text-sm'>Progressions</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Cache Stats */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <RefreshCw className='h-5 w-5' />
            Cache Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold'>{cacheStats.videoCount}</div>
              <p className='text-sm text-muted-foreground'>Cached Videos</p>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>{cacheStats.searchCount}</div>
              <p className='text-sm text-muted-foreground'>Cached Searches</p>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>
                {Math.round(cacheStats.memoryUsage / 1024)}KB
              </div>
              <p className='text-sm text-muted-foreground'>Memory Usage</p>
            </div>
          </div>
          <div className='flex justify-center mt-4'>
            <Button variant='outline' onClick={clearCache}>
              <RefreshCw className='h-4 w-4 mr-2' />
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Video Results */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Video List */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Play className='h-5 w-5' />
              Videos ({videos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3 max-h-96 overflow-y-auto'>
              {videos.map(video => (
                <div
                  key={video.id}
                  className='p-3 border rounded-lg cursor-pointer hover:bg-gray-50'
                  onClick={() => {
                    const recommendation = recommendations.find(
                      rec => rec.video.id === video.id
                    );
                    if (recommendation) {
                      handleVideoSelect(recommendation);
                    }
                  }}
                >
                  <div className='flex gap-3'>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className='w-20 h-15 object-cover rounded'
                    />
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-sm line-clamp-2'>
                        {video.title}
                      </h4>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {video.channelTitle}
                      </p>
                      <div className='flex items-center gap-2 mt-2 text-xs text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <Eye className='h-3 w-3' />
                          {formatViewCount(video.viewCount)}
                        </span>
                        <span className='flex items-center gap-1'>
                          <ThumbsUp className='h-3 w-3' />
                          {formatViewCount(video.likeCount)}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {formatDuration(video.duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Video Details */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Video Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedVideo ? (
              <div className='space-y-4'>
                {/* Video Info */}
                <div>
                  <img
                    src={selectedVideo.video.thumbnail}
                    alt={selectedVideo.video.title}
                    className='w-full h-48 object-cover rounded-lg mb-3'
                  />
                  <h3 className='text-lg font-semibold'>
                    {selectedVideo.video.title}
                  </h3>
                  <p className='text-muted-foreground mt-1'>
                    {selectedVideo.video.channelTitle}
                  </p>

                  {/* Relevance Score */}
                  <div className='flex items-center gap-2 mt-2'>
                    <span className='text-sm'>Relevance:</span>
                    <Badge
                      className={getRelevanceBadge(
                        selectedVideo.relevanceScore
                      )}
                    >
                      {selectedVideo.relevanceScore.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                {/* Reasons */}
                {selectedVideo.reasons.length > 0 && (
                  <div>
                    <h4 className='font-medium mb-2'>
                      Why this video is recommended:
                    </h4>
                    <ul className='text-sm text-muted-foreground space-y-1'>
                      {selectedVideo.reasons.map((reason, index) => (
                        <li key={index} className='flex items-center gap-2'>
                          <CheckCircle className='h-3 w-3 text-green-600' />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {selectedVideo.warnings.length > 0 && (
                  <div>
                    <h4 className='font-medium mb-2'>Warnings:</h4>
                    <ul className='text-sm text-red-600 space-y-1'>
                      {selectedVideo.warnings.map((warning, index) => (
                        <li key={index} className='flex items-center gap-2'>
                          <AlertTriangle className='h-3 w-3' />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metadata */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <h4 className='font-medium mb-2'>Video Info</h4>
                    <div className='text-sm text-muted-foreground space-y-1'>
                      <div>
                        Duration: {formatDuration(selectedVideo.video.duration)}
                      </div>
                      <div>
                        Views: {formatViewCount(selectedVideo.video.viewCount)}
                      </div>
                      <div>
                        Likes: {formatViewCount(selectedVideo.video.likeCount)}
                      </div>
                      <div>
                        Published:{' '}
                        {new Date(
                          selectedVideo.video.publishedAt
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2'>Content Analysis</h4>
                    <div className='text-sm text-muted-foreground space-y-1'>
                      <div>
                        Form Demo:{' '}
                        {selectedVideo.metadata.isFormDemonstration
                          ? 'Yes'
                          : 'No'}
                      </div>
                      <div>
                        Progression:{' '}
                        {selectedVideo.metadata.isProgression ? 'Yes' : 'No'}
                      </div>
                      <div>
                        Difficulty: {selectedVideo.metadata.difficultyLevel}
                      </div>
                      <div>
                        Equipment:{' '}
                        {selectedVideo.metadata.equipmentRequired.join(', ') ||
                          'None'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex gap-2 pt-4 border-t'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      window.open(
                        `https://www.youtube.com/watch?v=${selectedVideo.video.id}`,
                        '_blank'
                      )
                    }
                  >
                    <ExternalLink className='h-4 w-4 mr-2' />
                    Watch on YouTube
                  </Button>
                </div>
              </div>
            ) : (
              <div className='text-center text-muted-foreground py-8'>
                Select a video to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              Smart Recommendations ({recommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {recommendations.slice(0, 12).map((recommendation, index) => (
                <div
                  key={recommendation.video.id}
                  className='p-4 border rounded-lg cursor-pointer hover:bg-gray-50'
                  onClick={() => handleVideoSelect(recommendation)}
                >
                  <div className='flex gap-3'>
                    <img
                      src={recommendation.video.thumbnail}
                      alt={recommendation.video.title}
                      className='w-16 h-12 object-cover rounded'
                    />
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-sm line-clamp-2'>
                        {recommendation.video.title}
                      </h4>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {recommendation.video.channelTitle}
                      </p>
                      <div className='flex items-center gap-2 mt-2'>
                        <Badge
                          className={getRelevanceBadge(
                            recommendation.relevanceScore
                          )}
                        >
                          {recommendation.relevanceScore.toFixed(1)}%
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          {formatDuration(recommendation.video.duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
