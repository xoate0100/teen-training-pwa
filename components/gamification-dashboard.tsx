'use client';

import React, { useState, useEffect } from 'react';
import {
  AchievementService,
  UserProgress,
  Achievement,
} from '@/lib/services/achievement-service';
import {
  AchievementGrid,
  AchievementCard,
} from '@/components/achievement-badge';
import {
  StreakIndicator,
  LevelProgress,
} from '@/components/progress-celebration';
import { cn } from '@/lib/utils';

interface GamificationDashboardProps {
  sessions: any[];
  checkIns: any[];
  className?: string;
}

export function GamificationDashboard({
  sessions,
  checkIns,
  className,
}: GamificationDashboardProps) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    Achievement['category'] | 'all'
  >('all');
  const [selectedRarity, setSelectedRarity] = useState<
    Achievement['rarity'] | 'all'
  >('all');
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>(
    []
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    type: 'level_up' | 'achievement' | 'streak' | 'milestone';
    message: string;
    icon: string;
  } | null>(null);

  // Calculate user progress
  useEffect(() => {
    const progress = AchievementService.calculateUserProgress(
      sessions,
      checkIns
    );
    setUserProgress(progress);

    // Check for new achievements
    const newAchievements = AchievementService.getRecentlyUnlockedAchievements(
      progress.achievements
    );
    if (newAchievements.length > 0) {
      setRecentAchievements(newAchievements);
      // Show celebration for the first new achievement
      const firstAchievement = newAchievements[0];
      setCelebrationData({
        type: 'achievement',
        message: `Achievement Unlocked: ${firstAchievement.name}`,
        icon: firstAchievement.icon,
      });
      setShowCelebration(true);
    }
  }, [sessions, checkIns]);

  // Filter achievements based on selected filters
  const filteredAchievements =
    userProgress?.achievements.filter(achievement => {
      const categoryMatch =
        selectedCategory === 'all' || achievement.category === selectedCategory;
      const rarityMatch =
        selectedRarity === 'all' || achievement.rarity === selectedRarity;
      return categoryMatch && rarityMatch;
    }) || [];

  const categories: {
    value: Achievement['category'] | 'all';
    label: string;
    count: number;
  }[] = [
    {
      value: 'all',
      label: 'All',
      count: userProgress?.achievements.length || 0,
    },
    {
      value: 'strength',
      label: 'Strength',
      count:
        userProgress?.achievements.filter(a => a.category === 'strength')
          .length || 0,
    },
    {
      value: 'volleyball',
      label: 'Volleyball',
      count:
        userProgress?.achievements.filter(a => a.category === 'volleyball')
          .length || 0,
    },
    {
      value: 'plyometric',
      label: 'Plyometric',
      count:
        userProgress?.achievements.filter(a => a.category === 'plyometric')
          .length || 0,
    },
    {
      value: 'recovery',
      label: 'Recovery',
      count:
        userProgress?.achievements.filter(a => a.category === 'recovery')
          .length || 0,
    },
    {
      value: 'streak',
      label: 'Streak',
      count:
        userProgress?.achievements.filter(a => a.category === 'streak')
          .length || 0,
    },
    {
      value: 'milestone',
      label: 'Milestone',
      count:
        userProgress?.achievements.filter(a => a.category === 'milestone')
          .length || 0,
    },
    {
      value: 'special',
      label: 'Special',
      count:
        userProgress?.achievements.filter(a => a.category === 'special')
          .length || 0,
    },
  ];

  const rarities: {
    value: Achievement['rarity'] | 'all';
    label: string;
    count: number;
  }[] = [
    {
      value: 'all',
      label: 'All',
      count: userProgress?.achievements.length || 0,
    },
    {
      value: 'common',
      label: 'Common',
      count:
        userProgress?.achievements.filter(a => a.rarity === 'common').length ||
        0,
    },
    {
      value: 'uncommon',
      label: 'Uncommon',
      count:
        userProgress?.achievements.filter(a => a.rarity === 'uncommon')
          .length || 0,
    },
    {
      value: 'rare',
      label: 'Rare',
      count:
        userProgress?.achievements.filter(a => a.rarity === 'rare').length || 0,
    },
    {
      value: 'epic',
      label: 'Epic',
      count:
        userProgress?.achievements.filter(a => a.rarity === 'epic').length || 0,
    },
    {
      value: 'legendary',
      label: 'Legendary',
      count:
        userProgress?.achievements.filter(a => a.rarity === 'legendary')
          .length || 0,
    },
  ];

  if (!userProgress) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Celebration Modal */}
      {showCelebration && celebrationData && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center animate-bounce'>
            <div className='text-6xl mb-4 animate-spin'>
              {celebrationData.icon}
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              {celebrationData.message}
            </h2>
            <button
              onClick={() => setShowCelebration(false)}
              className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {/* Level Progress */}
        <div className='bg-white rounded-lg p-4 shadow-sm border'>
          <LevelProgress
            level={userProgress.level}
            experience={userProgress.experience}
            nextLevelExp={userProgress.nextLevelExp}
            size='sm'
            showDetails={false}
          />
        </div>

        {/* Current Streak */}
        <div className='bg-white rounded-lg p-4 shadow-sm border'>
          <div className='text-center'>
            <StreakIndicator
              currentStreak={userProgress.currentStreak}
              longestStreak={userProgress.longestStreak}
              size='sm'
            />
          </div>
        </div>

        {/* Total Sessions */}
        <div className='bg-white rounded-lg p-4 shadow-sm border'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {userProgress.totalSessions}
            </div>
            <div className='text-sm text-gray-500'>Total Sessions</div>
          </div>
        </div>

        {/* Total Time */}
        <div className='bg-white rounded-lg p-4 shadow-sm border'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600'>
              {Math.round(userProgress.totalTimeMinutes / 60)}h
            </div>
            <div className='text-sm text-gray-500'>Total Time</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-4'>
        {/* Category Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={e =>
              setSelectedCategory(
                e.target.value as Achievement['category'] | 'all'
              )
            }
            className='px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>
        </div>

        {/* Rarity Filter */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Rarity
          </label>
          <select
            value={selectedRarity}
            onChange={e =>
              setSelectedRarity(e.target.value as Achievement['rarity'] | 'all')
            }
            className='px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {rarities.map(rarity => (
              <option key={rarity.value} value={rarity.value}>
                {rarity.label} ({rarity.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Achievements Grid */}
      <AchievementGrid
        achievements={filteredAchievements}
        showProgress={true}
        onAchievementClick={achievement => {
          console.log('Achievement clicked:', achievement);
        }}
      />

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Recent Achievements
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {recentAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                showProgress={false}
                className='border-green-200 bg-green-50'
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
