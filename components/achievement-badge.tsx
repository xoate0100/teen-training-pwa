'use client';

import React from 'react';
import { Achievement } from '@/lib/services/achievement-service';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  animated?: boolean;
  className?: string;
}

export function AchievementBadge({
  achievement,
  size = 'md',
  showProgress = false,
  animated = false,
  className,
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const rarityColors = {
    common: 'bg-gray-100 border-gray-300 text-gray-700',
    uncommon: 'bg-green-100 border-green-300 text-green-700',
    rare: 'bg-blue-100 border-blue-300 text-blue-700',
    epic: 'bg-purple-100 border-purple-300 text-purple-700',
    legendary: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  };

  const animationClasses =
    animated && achievement.animation
      ? {
          bounce: 'animate-bounce',
          glow: 'animate-pulse',
          sparkle: 'animate-ping',
          fire: 'animate-pulse',
          level_up: 'animate-bounce',
        }[achievement.animation.type]
      : '';

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300',
        sizeClasses[size],
        rarityColors[achievement.rarity],
        achievement.isUnlocked ? 'opacity-100' : 'opacity-50 grayscale',
        animationClasses,
        className
      )}
    >
      {/* Icon */}
      <div className='text-center'>{achievement.icon}</div>

      {/* Progress Ring for locked achievements */}
      {!achievement.isUnlocked &&
        showProgress &&
        achievement.progress !== undefined && (
          <div className='absolute inset-0 rounded-full'>
            <svg
              className='w-full h-full transform -rotate-90'
              viewBox='0 0 100 100'
            >
              <circle
                cx='50'
                cy='50'
                r='45'
                stroke='currentColor'
                strokeWidth='4'
                fill='none'
                className='opacity-20'
              />
              <circle
                cx='50'
                cy='50'
                r='45'
                stroke='currentColor'
                strokeWidth='4'
                fill='none'
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - achievement.progress / 100)}`}
                className='transition-all duration-500'
              />
            </svg>
          </div>
        )}

      {/* Unlock indicator */}
      {achievement.isUnlocked && (
        <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center'>
          <span className='text-white text-xs'>✓</span>
        </div>
      )}

      {/* Rarity indicator */}
      <div
        className={cn(
          'absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-1 py-0.5 rounded text-xs font-medium',
          rarityColors[achievement.rarity]
        )}
      >
        {achievement.rarity.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  showDescription?: boolean;
  showProgress?: boolean;

  onAchievementClick?: (achievement: Achievement) => void;
  className?: string;
}

export function AchievementCard({
  achievement,
  showDescription = true,
  showProgress = false,
  onAchievementClick,
  className,
}: AchievementCardProps) {
  const rarityColors = {
    common: 'border-gray-200 bg-gray-50',
    uncommon: 'border-green-200 bg-green-50',
    rare: 'border-blue-200 bg-blue-50',
    epic: 'border-purple-200 bg-purple-50',
    legendary: 'border-yellow-200 bg-yellow-50',
  };

  return (
    <div
      className={cn(
        'flex items-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer',
        rarityColors[achievement.rarity],
        achievement.isUnlocked ? 'opacity-100' : 'opacity-60',
        className
      )}
      onClick={() => onAchievementClick?.(achievement)}
    >
      {/* Achievement Badge */}
      <AchievementBadge
        achievement={achievement}
        size='md'
        showProgress={showProgress}
        animated={achievement.isUnlocked}
        className='mr-4'
      />

      {/* Achievement Info */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between'>
          <h3
            className={cn(
              'font-semibold text-sm truncate',
              achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            {achievement.name}
          </h3>
          <span className='text-xs font-medium text-gray-500'>
            {achievement.points} pts
          </span>
        </div>

        {showDescription && (
          <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
            {achievement.description}
          </p>
        )}

        {/* Progress Bar */}
        {!achievement.isUnlocked &&
          showProgress &&
          achievement.progress !== undefined && (
            <div className='mt-2'>
              <div className='flex justify-between text-xs text-gray-500 mb-1'>
                <span>Progress</span>
                <span>{Math.round(achievement.progress)}%</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-1.5'>
                <div
                  className='bg-current h-1.5 rounded-full transition-all duration-500'
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            </div>
          )}

        {/* Requirements */}
        <div className='mt-2'>
          <p className='text-xs text-gray-500'>
            {achievement.requirements.description}
          </p>
        </div>
      </div>
    </div>
  );
}

interface AchievementGridProps {
  achievements: Achievement[];
  showProgress?: boolean;

  onAchievementClick?: (achievement: Achievement) => void;
  className?: string;
}

export function AchievementGrid({
  achievements,
  showProgress = true,
  onAchievementClick,
  className,
}: AchievementGridProps) {
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Unlocked Achievements ({unlockedAchievements.length})
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {unlockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                showProgress={showProgress}
                onAchievementClick={onAchievementClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Locked Achievements ({lockedAchievements.length})
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {lockedAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                showProgress={showProgress}
                onAchievementClick={onAchievementClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
