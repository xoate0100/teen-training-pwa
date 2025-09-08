'use client';

/* eslint-disable no-undef */

import React, { useState, useEffect } from 'react';
import {
  usePersonalization,
  usePersonalizedStyles,
  usePersonalizedContent,
  usePersonalizedInteractions,
} from '@/components/personalization-provider';
import { cn } from '@/lib/utils';

interface AdaptiveInterfaceProps {
  children: React.ReactNode;
  className?: string;
}

export function AdaptiveInterface({
  children,
  className,
}: AdaptiveInterfaceProps) {
  const { preferences, recordInteraction } = usePersonalization();
  const personalizedStyles = usePersonalizedStyles();
  const personalizedContent = usePersonalizedContent();
  const personalizedInteractions = usePersonalizedInteractions();

  // Apply personalized styles to the document
  useEffect(() => {
    if (!preferences) return;

    const root = document.documentElement;

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px',
    };
    root.style.fontSize = fontSizeMap[personalizedStyles.fontSize];

    // Apply reduced motion
    if (personalizedStyles.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Apply high contrast
    if (personalizedStyles.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply dark mode
    if (personalizedStyles.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply layout density
    const layoutMap = {
      compact: '0.75rem',
      comfortable: '1rem',
      spacious: '1.5rem',
    };
    root.style.setProperty(
      '--spacing-unit',
      layoutMap[personalizedStyles.layout]
    );
  }, [preferences, personalizedStyles]);

  // Record interaction when component mounts
  useEffect(() => {
    if (preferences) {
      recordInteraction({
        type: 'layout_adjustment',
        data: {
          fontSize: personalizedStyles.fontSize,
          reducedMotion: personalizedStyles.reducedMotion,
          highContrast: personalizedStyles.highContrast,
          darkMode: personalizedStyles.darkMode,
          layout: personalizedStyles.layout,
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
  }, [preferences, personalizedStyles, recordInteraction]);

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  return (
    <div
      className={cn(
        'adaptive-interface',
        {
          'reduced-motion': personalizedStyles.reducedMotion,
          'high-contrast': personalizedStyles.highContrast,
          'dark-mode': personalizedStyles.darkMode,
          [`layout-${personalizedStyles.layout}`]: true,
          [`font-${personalizedStyles.fontSize}`]: true,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

// Adaptive difficulty indicator component
interface AdaptiveDifficultyIndicatorProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  userLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  className?: string;
}

export function AdaptiveDifficultyIndicator({
  difficulty,
  userLevel = 'intermediate',
  className,
}: AdaptiveDifficultyIndicatorProps) {
  const { preferences, recordInteraction } = usePersonalization();
  const personalizedContent = usePersonalizedContent();

  const difficultyColors = {
    beginner: '#10b981',
    intermediate: '#f59e0b',
    advanced: '#ef4444',
    expert: '#8b5cf6',
  };

  const difficultyIcons = {
    beginner: '🟢',
    intermediate: '🟡',
    advanced: '🔴',
    expert: '🟣',
  };

  const getDifficultyStatus = () => {
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const userIndex = levels.indexOf(userLevel);
    const difficultyIndex = levels.indexOf(difficulty);

    if (difficultyIndex <= userIndex) return 'suitable';
    if (difficultyIndex === userIndex + 1) return 'challenging';
    return 'difficult';
  };

  const status = getDifficultyStatus();
  const isDetailed =
    personalizedContent.informationLevel === 'detailed' ||
    personalizedContent.informationLevel === 'comprehensive';

  const handleClick = () => {
    if (preferences) {
      recordInteraction({
        type: 'achievement_view',
        data: {
          difficulty,
          userLevel,
          status,
          informationLevel: personalizedContent.informationLevel,
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

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors',
        {
          'bg-green-100 text-green-800 hover:bg-green-200':
            status === 'suitable',
          'bg-yellow-100 text-yellow-800 hover:bg-yellow-200':
            status === 'challenging',
          'bg-red-100 text-red-800 hover:bg-red-200': status === 'difficult',
        },
        className
      )}
      onClick={handleClick}
    >
      <span className='text-lg'>{difficultyIcons[difficulty]}</span>
      <span className='capitalize'>{difficulty}</span>
      {isDetailed && (
        <span className='text-xs opacity-75'>
          {status === 'suitable' && 'Perfect for you'}
          {status === 'challenging' && 'Good challenge'}
          {status === 'difficult' && 'Very challenging'}
        </span>
      )}
    </div>
  );
}

// Adaptive progress visualization component
interface AdaptiveProgressVisualizationProps {
  progress: number;
  type: 'circular' | 'linear' | 'radial';
  showDetails?: boolean;
  className?: string;
}

export function AdaptiveProgressVisualization({
  progress,
  type,
  showDetails = true,
  className,
}: AdaptiveProgressVisualizationProps) {
  const { preferences, recordInteraction } = usePersonalization();
  const personalizedContent = usePersonalizedContent();

  const isDetailed =
    personalizedContent.progressDisplay === 'detailed' ||
    personalizedContent.progressDisplay === 'analytical';
  const isAnalytical = personalizedContent.progressDisplay === 'analytical';

  const handleInteraction = () => {
    if (preferences) {
      recordInteraction({
        type: 'achievement_view',
        data: {
          progress,
          type,
          progressDisplay: personalizedContent.progressDisplay,
          informationLevel: personalizedContent.informationLevel,
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

  if (type === 'circular') {
    return (
      <div
        className={cn('relative w-24 h-24', className)}
        onClick={handleInteraction}
      >
        <svg className='w-full h-full transform -rotate-90' viewBox='0 0 36 36'>
          <path
            className='text-gray-200'
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
            strokeDasharray={`${progress}, 100`}
            d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
          />
        </svg>
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-sm font-semibold'>{Math.round(progress)}%</span>
        </div>
        {isDetailed && showDetails && (
          <div className='mt-2 text-center text-xs text-gray-600'>
            {isAnalytical && `Progress: ${progress.toFixed(1)}%`}
          </div>
        )}
      </div>
    );
  }

  if (type === 'linear') {
    return (
      <div className={cn('w-full', className)} onClick={handleInteraction}>
        <div className='flex justify-between text-sm text-gray-600 mb-1'>
          <span>Progress</span>
          {isDetailed && <span>{Math.round(progress)}%</span>}
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-blue-500 h-2 rounded-full transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
        {isAnalytical && showDetails && (
          <div className='mt-1 text-xs text-gray-500'>
            Detailed progress: {progress.toFixed(2)}%
          </div>
        )}
      </div>
    );
  }

  if (type === 'radial') {
    return (
      <div
        className={cn('relative w-32 h-32', className)}
        onClick={handleInteraction}
      >
        <svg
          className='w-full h-full transform -rotate-90'
          viewBox='0 0 100 100'
        >
          <circle
            className='text-gray-200'
            cx='50'
            cy='50'
            r='40'
            stroke='currentColor'
            strokeWidth='8'
            fill='none'
          />
          <circle
            className='text-blue-500'
            cx='50'
            cy='50'
            r='40'
            stroke='currentColor'
            strokeWidth='8'
            fill='none'
            strokeDasharray={`${(progress / 100) * 251.2} 251.2`}
            strokeLinecap='round'
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-lg font-bold'>{Math.round(progress)}%</span>
          {isDetailed && (
            <span className='text-xs text-gray-600'>Complete</span>
          )}
        </div>
        {isAnalytical && showDetails && (
          <div className='mt-2 text-center text-xs text-gray-500'>
            Radial progress: {progress.toFixed(2)}%
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Adaptive achievement categories component
interface AdaptiveAchievementCategoriesProps {
  categories: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  className?: string;
}

export function AdaptiveAchievementCategories({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}: AdaptiveAchievementCategoriesProps) {
  const { preferences, recordInteraction } = usePersonalization();
  const personalizedContent = usePersonalizedContent();

  const isGamified = personalizedContent.achievementStyle === 'gamified';
  const isCelebratory = personalizedContent.achievementStyle === 'celebratory';

  const handleCategoryClick = (category: string) => {
    if (preferences) {
      recordInteraction({
        type: 'achievement_view',
        data: {
          category,
          achievementStyle: personalizedContent.achievementStyle,
          informationLevel: personalizedContent.informationLevel,
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
    onCategoryChange?.(category);
  };

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            {
              'bg-blue-500 text-white shadow-lg': selectedCategory === category,
              'bg-gray-100 text-gray-700 hover:bg-gray-200':
                selectedCategory !== category,
              'transform hover:scale-105': isGamified,
              'animate-pulse': isCelebratory && selectedCategory === category,
            }
          )}
        >
          {isGamified && '🏆 '}
          {isCelebratory && selectedCategory === category && '🎉 '}
          <span className='capitalize'>{category}</span>
        </button>
      ))}
    </div>
  );
}

// Adaptive motivational content component
interface AdaptiveMotivationalContentProps {
  type: 'encouraging' | 'challenging' | 'supportive';
  content: string;
  className?: string;
}

export function AdaptiveMotivationalContent({
  type,
  content,
  className,
}: AdaptiveMotivationalContentProps) {
  const { preferences, recordInteraction } = usePersonalization();
  const personalizedContent = usePersonalizedContent();

  const isGamified = personalizedContent.achievementStyle === 'gamified';
  const isCelebratory = personalizedContent.achievementStyle === 'celebratory';

  const getMotivationalStyle = () => {
    switch (type) {
      case 'encouraging':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'challenging':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'supportive':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMotivationalIcon = () => {
    if (isGamified) {
      switch (type) {
        case 'encouraging':
          return '🚀';
        case 'challenging':
          return '⚡';
        case 'supportive':
          return '💪';
        default:
          return '🎯';
      }
    }
    if (isCelebratory) {
      switch (type) {
        case 'encouraging':
          return '🌟';
        case 'challenging':
          return '🔥';
        case 'supportive':
          return '❤️';
        default:
          return '✨';
      }
    }
    return '';
  };

  const handleInteraction = () => {
    if (preferences) {
      recordInteraction({
        type: 'achievement_view',
        data: {
          type,
          content,
          achievementStyle: personalizedContent.achievementStyle,
          informationLevel: personalizedContent.informationLevel,
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

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer',
        getMotivationalStyle(),
        {
          'transform hover:scale-105': isGamified,
          'animate-bounce': isCelebratory,
        },
        className
      )}
      onClick={handleInteraction}
    >
      <div className='flex items-center gap-2'>
        {getMotivationalIcon() && (
          <span className='text-2xl'>{getMotivationalIcon()}</span>
        )}
        <p className='font-medium'>{content}</p>
      </div>
    </div>
  );
}
