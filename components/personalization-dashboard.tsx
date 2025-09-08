'use client';

import React, { useState, useEffect } from 'react';
import {
  usePersonalization,
  usePersonalizedStyles,
  usePersonalizedContent,
  usePersonalizedInteractions,
} from '@/components/personalization-provider';
import { PersonalizationSettings } from '@/components/personalization-settings';
import {
  SocialEngagement,
  AchievementSharing,
  ProgressComparison,
  TeamChallenge,
  CommunityMotivation,
} from '@/components/social-engagement';
import {
  AdaptiveDifficultyIndicator,
  AdaptiveProgressVisualization,
  AdaptiveAchievementCategories,
  AdaptiveMotivationalContent,
} from '@/components/adaptive-interface';
import { cn } from '@/lib/utils';

interface PersonalizationDashboardProps {
  className?: string;
  userId: string;
}

export function PersonalizationDashboard({
  className,
  userId,
}: PersonalizationDashboardProps) {
  const {
    preferences,
    learning,
    isLoading,
    recordInteraction,
    getRecommendations,
  } = usePersonalization();

  const personalizedStyles = usePersonalizedStyles();
  const personalizedContent = usePersonalizedContent();
  const personalizedInteractions = usePersonalizedInteractions();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'settings' | 'social' | 'adaptive' | 'insights'
  >('overview');
  const [recommendations, setRecommendations] = useState<{
    theme: string[];
    interactions: string[];
    content: string[];
    learning: string[];
  }>({ theme: [], interactions: [], content: [], learning: [] });

  useEffect(() => {
    setRecommendations(getRecommendations());
  }, [getRecommendations, learning]);

  if (isLoading) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className='animate-pulse space-y-4'>
          <div className='h-6 bg-gray-200 rounded w-1/3 mx-auto'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto'></div>
          <div className='h-32 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className='text-red-600'>
          <h3 className='text-lg font-semibold mb-2'>
            Personalization Not Available
          </h3>
          <p>
            Unable to load personalization settings. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'social', label: 'Social', icon: '👥' },
    { id: 'adaptive', label: 'Adaptive', icon: '🎯' },
    { id: 'insights', label: 'Insights', icon: '🧠' },
  ] as const;

  const handleTabChange = (tabId: (typeof tabs)[number]['id']) => {
    setActiveTab(tabId);

    // Record tab interaction
    recordInteraction({
      type: 'setting_change',
      data: { tab: tabId },
      context: {
        page: 'personalization-dashboard',
        deviceType:
          window.innerWidth < 768
            ? 'mobile'
            : window.innerWidth < 1024
              ? 'tablet'
              : 'desktop',
        timeOfDay: getTimeOfDay(),
      },
    });
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold'>Personalization Dashboard</h1>
        <p className='text-gray-600'>
          Your personalized training experience, tailored to your preferences
          and behavior
        </p>
        {learning && (
          <div className='inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800'>
            <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
            Learning Confidence: {Math.round(learning.confidence * 100)}%
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className='flex flex-wrap gap-2 justify-center'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <span className='mr-2'>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='bg-white rounded-lg border p-6'>
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>Personalization Overview</h2>

            {/* Current Preferences Summary */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='bg-blue-50 rounded-lg p-4'>
                <h3 className='font-semibold text-blue-800 mb-2'>
                  Visual Theme
                </h3>
                <div className='space-y-1 text-sm text-blue-700'>
                  <div>Intensity: {personalizedStyles.intensity}</div>
                  <div>Animation: {personalizedStyles.animation}</div>
                  <div>Layout: {personalizedStyles.layout}</div>
                  <div>Font Size: {personalizedStyles.fontSize}</div>
                </div>
              </div>

              <div className='bg-green-50 rounded-lg p-4'>
                <h3 className='font-semibold text-green-800 mb-2'>
                  Content Density
                </h3>
                <div className='space-y-1 text-sm text-green-700'>
                  <div>Info Level: {personalizedContent.informationLevel}</div>
                  <div>Progress: {personalizedContent.progressDisplay}</div>
                  <div>
                    Achievements: {personalizedContent.achievementStyle}
                  </div>
                  <div>Help: {personalizedContent.helpLevel}</div>
                </div>
              </div>

              <div className='bg-purple-50 rounded-lg p-4'>
                <h3 className='font-semibold text-purple-800 mb-2'>
                  Interactions
                </h3>
                <div className='space-y-1 text-sm text-purple-700'>
                  <div>Feedback: {personalizedInteractions.feedback}</div>
                  <div>
                    Notifications: {personalizedInteractions.notifications}
                  </div>
                  <div>
                    Haptics: {personalizedInteractions.haptics ? 'On' : 'Off'}
                  </div>
                  <div>
                    Sounds: {personalizedInteractions.sounds ? 'On' : 'Off'}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {(recommendations.theme.length > 0 ||
              recommendations.interactions.length > 0 ||
              recommendations.content.length > 0 ||
              recommendations.learning.length > 0) && (
              <div className='bg-yellow-50 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-yellow-800 mb-3'>
                  Personalized Recommendations
                </h3>
                <div className='space-y-2'>
                  {recommendations.theme.map((rec, index) => (
                    <div key={index} className='text-sm text-yellow-700'>
                      🎨 {rec}
                    </div>
                  ))}
                  {recommendations.interactions.map((rec, index) => (
                    <div key={index} className='text-sm text-yellow-700'>
                      👆 {rec}
                    </div>
                  ))}
                  {recommendations.content.map((rec, index) => (
                    <div key={index} className='text-sm text-yellow-700'>
                      📄 {rec}
                    </div>
                  ))}
                  {recommendations.learning.map((rec, index) => (
                    <div key={index} className='text-sm text-yellow-700'>
                      🧠 {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Insights */}
            {learning && (
              <div className='bg-gray-50 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                  Learning Insights
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <h4 className='font-medium text-gray-700 mb-2'>
                      Theme Preferences
                    </h4>
                    <div className='space-y-1 text-sm text-gray-600'>
                      <div>
                        Most used color:{' '}
                        {Object.keys(learning.themePreferences.colorUsage)
                          .length > 0
                          ? Object.entries(
                              learning.themePreferences.colorUsage
                            ).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                          : 'None'}
                      </div>
                      <div>
                        Preferred intensity:{' '}
                        {Object.keys(learning.themePreferences.intensityUsage)
                          .length > 0
                          ? Object.entries(
                              learning.themePreferences.intensityUsage
                            ).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                          : 'None'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className='font-medium text-gray-700 mb-2'>
                      Interaction Patterns
                    </h4>
                    <div className='space-y-1 text-sm text-gray-600'>
                      <div>
                        Haptic usage: {learning.interactionPatterns.hapticUsage}{' '}
                        times
                      </div>
                      <div>
                        Sound usage: {learning.interactionPatterns.soundUsage}{' '}
                        times
                      </div>
                      <div>
                        Micro-interactions:{' '}
                        {learning.interactionPatterns.microInteractionUsage}{' '}
                        times
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <PersonalizationSettings showPreview={true} />
        )}

        {activeTab === 'social' && (
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>Social Engagement</h2>
            <SocialEngagement />

            {/* Mock data for demonstration */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <AchievementSharing
                achievement={{
                  id: 'strength-warrior',
                  name: 'Strength Warrior',
                  description: 'Completed 10 strength training sessions',
                  icon: '💪',
                  unlockedAt: new Date(),
                }}
              />

              <ProgressComparison
                userProgress={{
                  totalSessions: 25,
                  totalTime: 1800, // 30 hours
                  currentStreak: 7,
                  achievements: 8,
                }}
                friendsProgress={[
                  {
                    name: 'Alex',
                    totalSessions: 30,
                    totalTime: 2100,
                    currentStreak: 5,
                    achievements: 10,
                  },
                  {
                    name: 'Sam',
                    totalSessions: 20,
                    totalTime: 1500,
                    currentStreak: 3,
                    achievements: 6,
                  },
                ]}
              />
            </div>

            <TeamChallenge
              challenges={[
                {
                  id: 'summer-challenge',
                  name: 'Summer Fitness Challenge',
                  description: 'Complete 30 workouts in 30 days',
                  participants: 156,
                  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                  isParticipating: true,
                },
                {
                  id: 'strength-challenge',
                  name: 'Strength Building Challenge',
                  description: 'Increase your bench press by 20%',
                  participants: 89,
                  endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                  isParticipating: false,
                },
              ]}
              onJoinChallenge={challengeId => {
                console.log('Joining challenge:', challengeId);
                recordInteraction({
                  type: 'achievement_view',
                  data: { challengeId, action: 'join' },
                  context: {
                    page: 'personalization-dashboard',
                    deviceType:
                      window.innerWidth < 768
                        ? 'mobile'
                        : window.innerWidth < 1024
                          ? 'tablet'
                          : 'desktop',
                    timeOfDay: getTimeOfDay(),
                  },
                });
              }}
            />

            <CommunityMotivation />
          </div>
        )}

        {activeTab === 'adaptive' && (
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>
              Adaptive Interface Elements
            </h2>

            {/* Difficulty Indicators */}
            <div>
              <h3 className='text-lg font-semibold mb-4'>
                Adaptive Difficulty Indicators
              </h3>
              <div className='flex flex-wrap gap-3'>
                <AdaptiveDifficultyIndicator
                  difficulty='beginner'
                  userLevel='intermediate'
                />
                <AdaptiveDifficultyIndicator
                  difficulty='intermediate'
                  userLevel='intermediate'
                />
                <AdaptiveDifficultyIndicator
                  difficulty='advanced'
                  userLevel='intermediate'
                />
                <AdaptiveDifficultyIndicator
                  difficulty='expert'
                  userLevel='intermediate'
                />
              </div>
            </div>

            {/* Progress Visualizations */}
            <div>
              <h3 className='text-lg font-semibold mb-4'>
                Adaptive Progress Visualizations
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center'>
                  <h4 className='font-medium mb-2'>Circular Progress</h4>
                  <AdaptiveProgressVisualization
                    progress={75}
                    type='circular'
                  />
                </div>
                <div className='text-center'>
                  <h4 className='font-medium mb-2'>Linear Progress</h4>
                  <AdaptiveProgressVisualization progress={60} type='linear' />
                </div>
                <div className='text-center'>
                  <h4 className='font-medium mb-2'>Radial Progress</h4>
                  <AdaptiveProgressVisualization progress={85} type='radial' />
                </div>
              </div>
            </div>

            {/* Achievement Categories */}
            <div>
              <h3 className='text-lg font-semibold mb-4'>
                Adaptive Achievement Categories
              </h3>
              <AdaptiveAchievementCategories
                categories={[
                  'strength',
                  'volleyball',
                  'plyometric',
                  'recovery',
                  'streak',
                  'milestone',
                ]}
                selectedCategory='strength'
                onCategoryChange={category => {
                  recordInteraction({
                    type: 'achievement_view',
                    data: { category, action: 'select' },
                    context: {
                      page: 'personalization-dashboard',
                      deviceType:
                        window.innerWidth < 768
                          ? 'mobile'
                          : window.innerWidth < 1024
                            ? 'tablet'
                            : 'desktop',
                      timeOfDay: getTimeOfDay(),
                    },
                  });
                }}
              />
            </div>

            {/* Motivational Content */}
            <div>
              <h3 className='text-lg font-semibold mb-4'>
                Adaptive Motivational Content
              </h3>
              <div className='space-y-3'>
                <AdaptiveMotivationalContent
                  type='encouraging'
                  content="You're doing amazing! Keep up the great work!"
                />
                <AdaptiveMotivationalContent
                  type='challenging'
                  content="Ready for the next level? Let's push your limits!"
                />
                <AdaptiveMotivationalContent
                  type='supportive'
                  content='Remember, every step forward is progress worth celebrating!'
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className='space-y-6'>
            <h2 className='text-2xl font-semibold'>Personalization Insights</h2>

            {learning ? (
              <div className='space-y-6'>
                {/* Learning Confidence */}
                <div className='bg-blue-50 rounded-lg p-4'>
                  <h3 className='text-lg font-semibold text-blue-800 mb-2'>
                    Learning Confidence
                  </h3>
                  <div className='flex items-center gap-4'>
                    <div className='w-24 h-24 relative'>
                      <svg
                        className='w-full h-full transform -rotate-90'
                        viewBox='0 0 36 36'
                      >
                        <path
                          className='text-blue-200'
                          stroke='currentColor'
                          strokeWidth='3'
                          fill='none'
                          d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                        />
                        <path
                          className='text-blue-500'
                          stroke='currentColor'
                          strokeWidth='3'
                          fill='none'
                          strokeDasharray={`${learning.confidence * 100}, 100`}
                          d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                        />
                      </svg>
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <span className='text-sm font-semibold'>
                          {Math.round(learning.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className='text-blue-700'>
                        The system has learned your preferences with{' '}
                        {Math.round(learning.confidence * 100)}% confidence.
                        {learning.confidence > 0.7 &&
                          ' Your experience is highly personalized!'}
                        {learning.confidence < 0.3 &&
                          ' Keep using the app to improve personalization.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Analytics */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='bg-green-50 rounded-lg p-4'>
                    <h4 className='font-semibold text-green-800 mb-3'>
                      Theme Preferences
                    </h4>
                    <div className='space-y-2'>
                      {Object.entries(learning.themePreferences.colorUsage)
                        .length > 0 && (
                        <div>
                          <div className='text-sm text-green-700'>
                            Color Usage:
                          </div>
                          {Object.entries(learning.themePreferences.colorUsage)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([color, count]) => (
                              <div
                                key={color}
                                className='flex justify-between text-xs text-green-600'
                              >
                                <span style={{ color }}>●</span>
                                <span>{count} times</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='bg-purple-50 rounded-lg p-4'>
                    <h4 className='font-semibold text-purple-800 mb-3'>
                      Interaction Patterns
                    </h4>
                    <div className='space-y-2 text-sm text-purple-700'>
                      <div>
                        Haptic feedback:{' '}
                        {learning.interactionPatterns.hapticUsage} uses
                      </div>
                      <div>
                        Sound effects: {learning.interactionPatterns.soundUsage}{' '}
                        uses
                      </div>
                      <div>
                        Micro-interactions:{' '}
                        {learning.interactionPatterns.microInteractionUsage}{' '}
                        uses
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Timeline */}
                <div className='bg-gray-50 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-800 mb-3'>
                    Learning Timeline
                  </h4>
                  <div className='text-sm text-gray-600'>
                    Last analyzed: {learning.lastAnalyzed.toLocaleDateString()}{' '}
                    at {learning.lastAnalyzed.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-center text-gray-600'>
                <p>
                  No learning data available yet. Start using the app to build
                  your personalization profile!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
