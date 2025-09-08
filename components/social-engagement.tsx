'use client';

import React, { useState, useEffect } from 'react';
import { usePersonalization } from '@/components/personalization-provider';
import { cn } from '@/lib/utils';

interface SocialEngagementProps {
  className?: string;
}

export function SocialEngagement({ className }: SocialEngagementProps) {
  const { preferences, recordInteraction } = usePersonalization();
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = async (
    type: 'achievement' | 'progress' | 'challenge'
  ) => {
    if (!preferences) return;

    setIsSharing(true);

    try {
      // Record the sharing interaction
      recordInteraction({
        type: 'achievement_view',
        data: {
          shareType: type,
          socialPreferences: preferences.socialPreferences,
        },
        context: {
          page: window.location.pathname,
          deviceType:
            window.innerWidth < 768
              ? 'mobile'
              : window.innerWidth < 1024
                ? 'tablet'
                : 'desktop',
          timeOfDay: getTimeOfDay(),
        },
      });

      // Simulate sharing (in real app, this would integrate with social APIs)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  if (!preferences) return null;

  return (
    <div className={cn('space-y-6', className)}>
      <h3 className='text-lg font-semibold'>Social Engagement</h3>

      {/* Achievement Sharing */}
      {preferences.socialPreferences.shareAchievements && (
        <div className='bg-green-50 rounded-lg p-4'>
          <h4 className='font-medium text-green-800 mb-2'>
            Share Your Achievements
          </h4>
          <p className='text-sm text-green-700 mb-3'>
            Celebrate your progress with friends and family
          </p>
          <button
            onClick={() => handleShare('achievement')}
            disabled={isSharing}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              {
                'bg-green-500 text-white hover:bg-green-600': !isSharing,
                'bg-green-300 text-white cursor-not-allowed': isSharing,
              }
            )}
          >
            {isSharing ? 'Sharing...' : 'Share Achievement'}
          </button>
        </div>
      )}

      {/* Progress Sharing */}
      {preferences.socialPreferences.shareProgress && (
        <div className='bg-blue-50 rounded-lg p-4'>
          <h4 className='font-medium text-blue-800 mb-2'>
            Share Your Progress
          </h4>
          <p className='text-sm text-blue-700 mb-3'>
            Show your training journey and inspire others
          </p>
          <button
            onClick={() => handleShare('progress')}
            disabled={isSharing}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              {
                'bg-blue-500 text-white hover:bg-blue-600': !isSharing,
                'bg-blue-300 text-white cursor-not-allowed': isSharing,
              }
            )}
          >
            {isSharing ? 'Sharing...' : 'Share Progress'}
          </button>
        </div>
      )}

      {/* Challenge Participation */}
      {preferences.socialPreferences.participateInChallenges && (
        <div className='bg-purple-50 rounded-lg p-4'>
          <h4 className='font-medium text-purple-800 mb-2'>Join Challenges</h4>
          <p className='text-sm text-purple-700 mb-3'>
            Compete with friends and stay motivated
          </p>
          <button
            onClick={() => handleShare('challenge')}
            disabled={isSharing}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              {
                'bg-purple-500 text-white hover:bg-purple-600': !isSharing,
                'bg-purple-300 text-white cursor-not-allowed': isSharing,
              }
            )}
          >
            {isSharing ? 'Joining...' : 'Join Challenge'}
          </button>
        </div>
      )}

      {/* Success Message */}
      {shareSuccess && (
        <div className='fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'>
          Successfully shared! 🎉
        </div>
      )}
    </div>
  );
}

// Achievement sharing component
interface AchievementSharingProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date;
  };
  className?: string;
}

export function AchievementSharing({
  achievement,
  className,
}: AchievementSharingProps) {
  const { preferences, recordInteraction } = usePersonalization();
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = async () => {
    if (!preferences) return;

    setIsSharing(true);

    try {
      // Record the sharing interaction
      recordInteraction({
        type: 'achievement_view',
        data: {
          achievementId: achievement.id,
          achievementName: achievement.name,
          shareType: 'achievement',
        },
        context: {
          page: window.location.pathname,
          deviceType:
            window.innerWidth < 768
              ? 'mobile'
              : window.innerWidth < 1024
                ? 'tablet'
                : 'desktop',
          timeOfDay: getTimeOfDay(),
        },
      });

      // Simulate sharing
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch (error) {
      console.error('Error sharing achievement:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  if (!preferences?.socialPreferences.shareAchievements) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>{achievement.icon}</span>
          <div>
            <h4 className='font-medium'>{achievement.name}</h4>
            <p className='text-sm text-gray-600'>{achievement.description}</p>
          </div>
        </div>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className={cn(
            'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
            {
              'bg-blue-500 text-white hover:bg-blue-600': !isSharing,
              'bg-blue-300 text-white cursor-not-allowed': isSharing,
            }
          )}
        >
          {isSharing ? 'Sharing...' : 'Share'}
        </button>
      </div>

      {shareSuccess && (
        <div className='text-sm text-green-600 font-medium'>
          Achievement shared successfully! 🎉
        </div>
      )}
    </div>
  );
}

// Progress comparison component
interface ProgressComparisonProps {
  userProgress: {
    totalSessions: number;
    totalTime: number;
    currentStreak: number;
    achievements: number;
  };
  friendsProgress?: Array<{
    name: string;
    totalSessions: number;
    totalTime: number;
    currentStreak: number;
    achievements: number;
  }>;
  className?: string;
}

export function ProgressComparison({
  userProgress,
  friendsProgress = [],
  className,
}: ProgressComparisonProps) {
  const { preferences, recordInteraction } = usePersonalization();

  const handleComparisonView = () => {
    if (preferences) {
      recordInteraction({
        type: 'achievement_view',
        data: {
          comparisonType: 'progress',
          userProgress,
          friendsCount: friendsProgress.length,
        },
        context: {
          page: window.location.pathname,
          deviceType:
            window.innerWidth < 768
              ? 'mobile'
              : window.innerWidth < 1024
                ? 'tablet'
                : 'desktop',
          timeOfDay: getTimeOfDay(),
        },
      });
    }
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  if (!preferences?.socialPreferences.shareProgress) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className='text-lg font-semibold'>Progress Comparison</h3>

      {/* User Progress */}
      <div className='bg-blue-50 rounded-lg p-4'>
        <h4 className='font-medium text-blue-800 mb-3'>Your Progress</h4>
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {userProgress.totalSessions}
            </div>
            <div className='text-sm text-blue-700'>Sessions</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {userProgress.currentStreak}
            </div>
            <div className='text-sm text-blue-700'>Day Streak</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {Math.round(userProgress.totalTime / 60)}
            </div>
            <div className='text-sm text-blue-700'>Hours</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {userProgress.achievements}
            </div>
            <div className='text-sm text-blue-700'>Achievements</div>
          </div>
        </div>
      </div>

      {/* Friends Progress */}
      {friendsProgress.length > 0 && (
        <div className='space-y-3'>
          <h4 className='font-medium'>Friends' Progress</h4>
          {friendsProgress.map((friend, index) => (
            <div
              key={index}
              className='bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors'
              onClick={handleComparisonView}
            >
              <div className='flex justify-between items-center'>
                <span className='font-medium'>{friend.name}</span>
                <div className='flex gap-4 text-sm text-gray-600'>
                  <span>{friend.totalSessions} sessions</span>
                  <span>{friend.currentStreak} streak</span>
                  <span>{friend.achievements} achievements</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Progress Button */}
      <button
        onClick={() => {
          if (preferences) {
            recordInteraction({
              type: 'achievement_view',
              data: {
                shareType: 'progress',
                userProgress,
              },
              context: {
                page: window.location.pathname,
                deviceType:
                  window.innerWidth < 768
                    ? 'mobile'
                    : window.innerWidth < 1024
                      ? 'tablet'
                      : 'desktop',
                timeOfDay: getTimeOfDay(),
              },
            });
          }
        }}
        className='w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
      >
        Share Your Progress
      </button>
    </div>
  );
}

// Team challenge component
interface TeamChallengeProps {
  challenges: Array<{
    id: string;
    name: string;
    description: string;
    participants: number;
    endDate: Date;
    isParticipating: boolean;
  }>;
  onJoinChallenge?: (challengeId: string) => void;
  className?: string;
}

export function TeamChallenge({
  challenges,
  onJoinChallenge,
  className,
}: TeamChallengeProps) {
  const { preferences, recordInteraction } = usePersonalization();

  const handleJoinChallenge = (challengeId: string) => {
    if (preferences) {
      recordInteraction({
        type: 'achievement_view',
        data: {
          challengeId,
          challengeType: 'team',
        },
        context: {
          page: window.location.pathname,
          deviceType:
            window.innerWidth < 768
              ? 'mobile'
              : window.innerWidth < 1024
                ? 'tablet'
                : 'desktop',
          timeOfDay: getTimeOfDay(),
        },
      });
    }
    onJoinChallenge?.(challengeId);
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  if (!preferences?.socialPreferences.participateInChallenges) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className='text-lg font-semibold'>Team Challenges</h3>

      {challenges.map(challenge => (
        <div
          key={challenge.id}
          className={cn('rounded-lg p-4 border-2 transition-colors', {
            'bg-green-50 border-green-200': challenge.isParticipating,
            'bg-gray-50 border-gray-200 hover:bg-gray-100':
              !challenge.isParticipating,
          })}
        >
          <div className='flex justify-between items-start mb-2'>
            <h4 className='font-medium'>{challenge.name}</h4>
            {challenge.isParticipating && (
              <span className='px-2 py-1 bg-green-500 text-white text-xs rounded-full'>
                Participating
              </span>
            )}
          </div>

          <p className='text-sm text-gray-600 mb-3'>{challenge.description}</p>

          <div className='flex justify-between items-center'>
            <div className='text-sm text-gray-500'>
              {challenge.participants} participants • Ends{' '}
              {challenge.endDate.toLocaleDateString()}
            </div>

            {!challenge.isParticipating && (
              <button
                onClick={() => handleJoinChallenge(challenge.id)}
                className='px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors'
              >
                Join Challenge
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Community motivation component
interface CommunityMotivationProps {
  className?: string;
}

export function CommunityMotivation({ className }: CommunityMotivationProps) {
  const { preferences, recordInteraction } = usePersonalization();

  const handleMotivationView = () => {
    if (preferences) {
      recordInteraction({
        type: 'achievement_view',
        data: {
          motivationType: 'community',
        },
        context: {
          page: window.location.pathname,
          deviceType:
            window.innerWidth < 768
              ? 'mobile'
              : window.innerWidth < 1024
                ? 'tablet'
                : 'desktop',
          timeOfDay: getTimeOfDay(),
        },
      });
    }
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  if (!preferences?.socialPreferences.receiveSocialNotifications) return null;

  const motivationalMessages = [
    "You're doing great! Keep up the amazing work! 💪",
    'Your dedication is inspiring others in the community! 🌟',
    'Every session brings you closer to your goals! 🎯',
    'The community is cheering you on! 🎉',
    'Your progress is motivating others to start their journey! 🚀',
  ];

  const randomMessage =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className='text-lg font-semibold'>Community Motivation</h3>

      <div
        className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all duration-300'
        onClick={handleMotivationView}
      >
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>👥</span>
          <div>
            <h4 className='font-medium text-purple-800'>Community Support</h4>
            <p className='text-sm text-purple-700'>{randomMessage}</p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-blue-50 rounded-lg p-3 text-center'>
          <div className='text-2xl font-bold text-blue-600'>1,247</div>
          <div className='text-sm text-blue-700'>Active Users</div>
        </div>
        <div className='bg-green-50 rounded-lg p-3 text-center'>
          <div className='text-2xl font-bold text-green-600'>89</div>
          <div className='text-sm text-green-700'>Sessions Today</div>
        </div>
      </div>
    </div>
  );
}
