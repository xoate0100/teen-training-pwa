'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProgressCelebrationProps {
  type: 'level_up' | 'achievement' | 'streak' | 'milestone';
  message: string;
  icon?: string;
  color?: string;
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

export function ProgressCelebration({
  type,
  message,
  icon,

  color = '#3b82f6',
  duration = 3000,
  onComplete,
  className,
}: ProgressCelebrationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<
    'enter' | 'hold' | 'exit'
  >('enter');

  useEffect(() => {
    // Enter animation
    const enterTimer = window.setTimeout(() => {
      setAnimationPhase('hold');
    }, 100);

    // Hold duration
    const holdTimer = window.setTimeout(() => {
      setAnimationPhase('exit');
    }, duration - 500);

    // Exit animation
    const exitTimer = window.setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  const getAnimationClasses = () => {
    switch (type) {
      case 'level_up':
        return {
          container: 'animate-bounce',
          icon: 'animate-spin',
          text: 'animate-pulse',
        };
      case 'achievement':
        return {
          container: 'animate-pulse',
          icon: 'animate-bounce',
          text: 'animate-pulse',
        };
      case 'streak':
        return {
          container: 'animate-pulse',
          icon: 'animate-ping',
          text: 'animate-pulse',
        };
      case 'milestone':
        return {
          container: 'animate-bounce',
          icon: 'animate-spin',
          text: 'animate-pulse',
        };
      default:
        return {
          container: 'animate-bounce',
          icon: '',
          text: 'animate-pulse',
        };
    }
  };

  const animations = getAnimationClasses();

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center pointer-events-none',
        className
      )}
    >
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/20 backdrop-blur-sm' />

      {/* Celebration Content */}
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center transform transition-all duration-500',
          animationPhase === 'enter' && 'scale-0 opacity-0',
          animationPhase === 'hold' && 'scale-100 opacity-100',
          animationPhase === 'exit' && 'scale-0 opacity-0',
          animations.container
        )}
      >
        {/* Icon */}
        {icon && (
          <div className={cn('text-6xl mb-4', animations.icon)}>{icon}</div>
        )}

        {/* Message */}
        <h2
          className={cn(
            'text-2xl font-bold text-gray-900 mb-2',
            animations.text
          )}
        >
          {message}
        </h2>

        {/* Decorative elements */}
        <div className='absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping' />
        <div
          className='absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-ping'
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className='absolute top-1/2 -left-3 w-2 h-2 bg-green-400 rounded-full animate-ping'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/2 -right-3 w-2 h-2 bg-purple-400 rounded-full animate-ping'
          style={{ animationDelay: '1.5s' }}
        />
      </div>
    </div>
  );
}

interface StreakIndicatorProps {
  currentStreak: number;
  longestStreak: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function StreakIndicator({
  currentStreak,
  longestStreak,
  size = 'md',
  animated = true,
  className,
}: StreakIndicatorProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const getStreakLevel = (streak: number) => {
    if (streak >= 30)
      return { level: 'legendary', emoji: '🔥🔥🔥', color: 'text-red-600' };
    if (streak >= 14)
      return { level: 'epic', emoji: '🔥🔥', color: 'text-orange-600' };
    if (streak >= 7)
      return { level: 'rare', emoji: '🔥', color: 'text-yellow-600' };
    if (streak >= 3)
      return { level: 'uncommon', emoji: '⚡', color: 'text-blue-600' };
    return { level: 'common', emoji: '💪', color: 'text-gray-600' };
  };

  const currentLevel = getStreakLevel(currentStreak);
  const longestLevel = getStreakLevel(longestStreak);

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Current Streak */}
      <div className='flex items-center space-x-1'>
        <span
          className={cn(
            sizeClasses[size],
            'font-bold',
            currentLevel.color,
            animated && currentStreak > 0 && 'animate-pulse'
          )}
        >
          {currentLevel.emoji}
        </span>
        <span className={cn(sizeClasses[size], 'font-semibold text-gray-700')}>
          {currentStreak}
        </span>
        <span className={cn(sizeClasses[size], 'text-gray-500')}>
          day{currentStreak !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Separator */}
      <span className='text-gray-400'>•</span>

      {/* Longest Streak */}
      <div className='flex items-center space-x-1'>
        <span
          className={cn(sizeClasses[size], 'font-bold', longestLevel.color)}
        >
          {longestLevel.emoji}
        </span>
        <span className={cn(sizeClasses[size], 'font-semibold text-gray-700')}>
          {longestStreak}
        </span>
        <span className={cn(sizeClasses[size], 'text-gray-500')}>best</span>
      </div>
    </div>
  );
}

interface LevelProgressProps {
  level: number;
  experience: number;
  nextLevelExp: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export function LevelProgress({
  level,
  experience,
  nextLevelExp,
  size = 'md',
  showDetails = true,
  className,
}: LevelProgressProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const progressPercentage = (experience / nextLevelExp) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Level and Progress */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <span className={cn(sizeClasses[size], 'font-bold text-gray-900')}>
            Level {level}
          </span>
          {showDetails && (
            <span className={cn(sizeClasses[size], 'text-gray-500')}>
              ({experience}/{nextLevelExp} XP)
            </span>
          )}
        </div>
        <span className={cn(sizeClasses[size], 'text-gray-500')}>
          {Math.round(progressPercentage)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div
          className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out'
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Next Level Info */}
      {showDetails && (
        <p className={cn(sizeClasses[size], 'text-gray-500 text-center')}>
          {nextLevelExp - experience} XP to Level {level + 1}
        </p>
      )}
    </div>
  );
}

interface AchievementNotificationProps {
  achievement: {
    name: string;
    icon: string;
    points: number;
  };
  onClose?: () => void;
  className?: string;
}

export function AchievementNotification({
  achievement,
  onClose,
  className,
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-4 max-w-sm transform transition-all duration-300',
        className
      )}
    >
      <div className='flex items-start space-x-3'>
        {/* Achievement Icon */}
        <div className='text-2xl animate-bounce'>{achievement.icon}</div>

        {/* Achievement Info */}
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-gray-900'>Achievement Unlocked!</h3>
          <p className='text-sm text-gray-600 mt-1'>{achievement.name}</p>
          <p className='text-xs text-green-600 font-medium mt-1'>
            +{achievement.points} points
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className='text-gray-400 hover:text-gray-600 transition-colors'
        >
          <span className='sr-only'>Close</span>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
