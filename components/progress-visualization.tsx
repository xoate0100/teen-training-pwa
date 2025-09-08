'use client';

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AccessibleIcon } from '@/components/accessible-icons';
import { AnimatedIcon } from '@/components/animated-icons';

// Achievement badge types
export const achievementTypes = {
  'first-session': {
    icon: 'session',
    title: 'First Steps',
    description: 'Completed your first training session',
    color: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
  },
  'week-streak': {
    icon: 'achievements',
    title: 'Week Warrior',
    description: 'Completed 7 days in a row',
    color: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
  },
  'month-streak': {
    icon: 'achievements',
    title: 'Monthly Master',
    description: 'Completed 30 days in a row',
    color: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
  },
  'goal-crusher': {
    icon: 'goals',
    title: 'Goal Crusher',
    description: 'Achieved your first major goal',
    color: 'bg-yellow-500',
    gradient: 'from-yellow-400 to-yellow-600',
  },
  'social-butterfly': {
    icon: 'social',
    title: 'Social Butterfly',
    description: 'Connected with 5 friends',
    color: 'bg-pink-500',
    gradient: 'from-pink-400 to-pink-600',
  },
  'ai-enthusiast': {
    icon: 'ai',
    title: 'AI Enthusiast',
    description: 'Used AI coach 10 times',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600',
  },
  'wellness-warrior': {
    icon: 'wellness',
    title: 'Wellness Warrior',
    description: 'Completed 50 wellness check-ins',
    color: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  'progress-tracker': {
    icon: 'progress',
    title: 'Progress Tracker',
    description: 'Tracked progress for 30 days',
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
  },
  'early-bird': {
    icon: 'session',
    title: 'Early Bird',
    description: 'Completed 10 morning sessions',
    color: 'bg-cyan-500',
    gradient: 'from-cyan-400 to-cyan-600',
  },
  'night-owl': {
    icon: 'session',
    title: 'Night Owl',
    description: 'Completed 10 evening sessions',
    color: 'bg-violet-500',
    gradient: 'from-violet-400 to-violet-600',
  },
  'consistency-king': {
    icon: 'achievements',
    title: 'Consistency King',
    description: 'No missed days for 2 weeks',
    color: 'bg-rose-500',
    gradient: 'from-rose-400 to-rose-600',
  },
  'all-star': {
    icon: 'achievements',
    title: 'All-Star',
    description: 'Unlocked all other achievements',
    color: 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500',
    gradient: 'from-yellow-400 via-red-500 to-pink-500',
  },
} as const;

// Achievement Badge Component
interface AchievementBadgeProps {
  type: keyof typeof achievementTypes;
  unlocked?: boolean;
  unlockedAt?: Date;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAnimation?: boolean;
  onClick?: () => void;
}

export function AchievementBadge({
  type,
  unlocked = false,
  unlockedAt,
  className,
  size = 'md',
  showAnimation = true,
  onClick,
}: AchievementBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const config = achievementTypes[type];

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-20 w-20',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32',
  };

  const iconSizes = {
    sm: 'md',
    md: 'lg',
    lg: 'xl',
    xl: '2xl',
  } as const;

  useEffect(() => {
    if (unlocked && showAnimation) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [unlocked, showAnimation]);

  return (
    <div
      className={cn(
        'relative group cursor-pointer transition-all duration-300',
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      {/* Badge background */}
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-all duration-300',
          unlocked
            ? `bg-gradient-to-br ${config.gradient} shadow-lg`
            : 'bg-gray-300 dark:bg-gray-700',
          isAnimating && 'animate-pulse scale-110',
          'group-hover:scale-105 group-hover:shadow-xl'
        )}
      />

      {/* Icon */}
      <div className='relative z-10 flex items-center justify-center h-full'>
        {showAnimation && unlocked ? (
          <AnimatedIcon
            name={
              config.icon as keyof typeof import('@/components/svg-icons').iconRegistry
            }
            size={iconSizes[size]}
            state={isAnimating ? 'success' : 'idle'}
            variant='default'
            highContrast={true}
          />
        ) : (
          <AccessibleIcon
            name={
              config.icon as keyof typeof import('@/components/svg-icons').iconRegistry
            }
            size={iconSizes[size]}
            variant={unlocked ? 'default' : 'muted'}
            highContrast={unlocked}
          />
        )}
      </div>

      {/* Unlock indicator */}
      {unlocked && (
        <div className='absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center'>
          <AccessibleIcon
            name='check-in'
            size='sm'
            variant='default'
            highContrast={true}
          />
        </div>
      )}

      {/* Tooltip */}
      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
        <div className='bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap'>
          <div className='font-semibold'>{config.title}</div>
          <div className='text-gray-300'>{config.description}</div>
          {unlockedAt && (
            <div className='text-gray-400 text-xs'>
              Unlocked {unlockedAt.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Streak Visualization Component
interface StreakVisualizationProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

export function StreakVisualization({
  currentStreak,
  longestStreak,
  className,
  size = 'md',
  showAnimation = true,
}: StreakVisualizationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentStreak > 0 && showAnimation) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [currentStreak, showAnimation]);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Current streak */}
      <div className='flex flex-col items-center'>
        <div
          className={cn(
            'relative rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300',
            sizeClasses[size],
            isAnimating && 'animate-bounce scale-110'
          )}
        >
          <span className={textSizes[size]}>{currentStreak}</span>
          <div className='absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-red-500 opacity-50 animate-ping' />
        </div>
        <span className='text-xs text-muted-foreground mt-1'>Current</span>
      </div>

      {/* Longest streak */}
      <div className='flex flex-col items-center'>
        <div
          className={cn(
            'rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold shadow-lg',
            sizeClasses[size]
          )}
        >
          <span className={textSizes[size]}>{longestStreak}</span>
        </div>
        <span className='text-xs text-muted-foreground mt-1'>Best</span>
      </div>
    </div>
  );
}

// Goal Progress Indicator Component
interface GoalProgressIndicatorProps {
  type: 'distance' | 'reps' | 'time' | 'weight';
  current: number;
  target: number;
  unit: string;
  className?: string;
  showPercentage?: boolean;
  showAnimation?: boolean;
}

export function GoalProgressIndicator({
  type,
  current,
  target,
  unit,
  className,
  showPercentage = true,
  showAnimation = true,
}: GoalProgressIndicatorProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const percentage = Math.min(100, (current / target) * 100);

  const typeConfig = {
    distance: { icon: 'progress', color: 'bg-blue-500', label: 'Distance' },
    reps: { icon: 'session', color: 'bg-green-500', label: 'Reps' },
    time: { icon: 'progress', color: 'bg-purple-500', label: 'Time' },
    weight: { icon: 'goals', color: 'bg-orange-500', label: 'Weight' },
  };

  const config = typeConfig[type];

  useEffect(() => {
    if (percentage >= 100 && showAnimation) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [percentage, showAnimation]);

  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <AccessibleIcon
            name={
              config.icon as keyof typeof import('@/components/svg-icons').iconRegistry
            }
            size='sm'
            variant='default'
          />
          <span className='text-sm font-medium'>{config.label}</span>
        </div>
        {showPercentage && (
          <span className='text-sm text-muted-foreground'>
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      <Progress
        value={percentage}
        className={cn('h-2', isAnimating && 'animate-pulse')}
      />

      <div className='flex justify-between text-xs text-muted-foreground'>
        <span>
          {current} {unit}
        </span>
        <span>
          {target} {unit}
        </span>
      </div>
    </div>
  );
}

// Status Indicator Component
interface StatusIndicatorProps {
  status: 'on-track' | 'behind' | 'ahead' | 'new-user';
  className?: string;
  showLabel?: boolean;
}

export function StatusIndicator({
  status,
  className,
  showLabel = true,
}: StatusIndicatorProps) {
  const statusConfig = {
    'on-track': {
      color: 'bg-green-500',
      icon: 'goals',
      label: 'On Track',
      description: "You're doing great!",
    },
    behind: {
      color: 'bg-yellow-500',
      icon: 'progress',
      label: 'Behind',
      description: 'Catch up to stay on track',
    },
    ahead: {
      color: 'bg-blue-500',
      icon: 'achievements',
      label: 'Ahead',
      description: "You're ahead of schedule!",
    },
    'new-user': {
      color: 'bg-gray-500',
      icon: 'session',
      label: 'New User',
      description: 'Welcome! Start your journey',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('w-3 h-3 rounded-full', config.color)} />
      {showLabel && (
        <div>
          <div className='text-sm font-medium'>{config.label}</div>
          <div className='text-xs text-muted-foreground'>
            {config.description}
          </div>
        </div>
      )}
    </div>
  );
}

// Progress Visualization Hook
export function useProgressVisualization() {
  const [achievements, setAchievements] = useState<Map<string, boolean>>(
    new Map()
  );
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 });
  const [goals, setGoals] = useState<
    Map<string, { current: number; target: number }>
  >(new Map());

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => new Map(prev.set(achievementId, true)));
  };

  const updateStreak = (current: number, longest: number) => {
    setStreaks({ current, longest });
  };

  const updateGoal = (goalId: string, current: number, target: number) => {
    setGoals(prev => new Map(prev.set(goalId, { current, target })));
  };

  const getAchievementStatus = (achievementId: string) => {
    return achievements.get(achievementId) || false;
  };

  const getGoalProgress = (goalId: string) => {
    return goals.get(goalId) || { current: 0, target: 100 };
  };

  return {
    unlockAchievement,
    updateStreak,
    updateGoal,
    getAchievementStatus,
    getGoalProgress,
    achievements,
    streaks,
    goals,
  };
}
