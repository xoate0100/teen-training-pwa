'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AccessibleIcon } from '@/components/accessible-icons';
import { AnimatedIcon, StatefulIcon } from '@/components/animated-icons';
import {
  Play,
  Check,
  Target,
  Zap,
  Star,
  Trophy,
  Heart,
  Brain,
  Users,
  Settings,
  Sync,
  HelpCircle,
} from 'lucide-react';

// Primary Action Button Variants
export const primaryActionVariants = {
  'start-session': {
    gradient:
      'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    shadow: 'shadow-lg hover:shadow-xl',
    icon: 'session',
    label: "Start Today's Session",
    description: 'Begin your personalized workout',
  },
  'daily-checkin': {
    gradient:
      'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
    shadow: 'shadow-lg hover:shadow-xl',
    icon: 'check-in',
    label: 'Daily Check-in',
    description: 'Track your mood and energy',
  },
  'view-progress': {
    gradient:
      'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
    shadow: 'shadow-lg hover:shadow-xl',
    icon: 'progress',
    label: 'View Progress',
    description: 'See your fitness journey',
  },
  achievements: {
    gradient:
      'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700',
    shadow: 'shadow-lg hover:shadow-xl',
    icon: 'achievements',
    label: 'Achievements',
    description: 'Celebrate your wins',
  },
  'ai-coach': {
    gradient:
      'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
    shadow: 'shadow-lg hover:shadow-xl',
    icon: 'ai',
    label: 'AI Coach',
    description: 'Get personalized guidance',
  },
  social: {
    gradient:
      'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700',
    shadow: 'shadow-lg hover:shadow-xl',
    icon: 'social',
    label: 'Social',
    description: 'Connect with friends',
  },
} as const;

// Primary Action Button Props
interface PrimaryActionButtonProps {
  variant: keyof typeof primaryActionVariants;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  state?: 'idle' | 'loading' | 'success' | 'error' | 'disabled';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
  tooltip?: string;
  'aria-label'?: string;
  showDescription?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
}

// Primary Action Button Component
export function PrimaryActionButton({
  variant,
  size = 'lg',
  state = 'idle',
  className,
  onClick,
  disabled = false,
  badge,
  tooltip,
  'aria-label': ariaLabel,
  showDescription = true,
  fullWidth = false,
  animated = true,
}: PrimaryActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const config = primaryActionVariants[variant];

  const sizeClasses = {
    sm: 'h-12 px-4 text-sm',
    md: 'h-14 px-6 text-base',
    lg: 'h-16 px-8 text-lg',
    xl: 'h-20 px-10 text-xl',
  };

  const handleClick = () => {
    if (disabled || state === 'loading') return;

    setIsPressed(true);
    onClick?.();

    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      className={cn(
        'relative overflow-hidden transition-all duration-200 transform',
        config.gradient,
        config.shadow,
        sizeClasses[size],
        fullWidth && 'w-full',
        isPressed && 'scale-95',
        state === 'success' && 'animate-bounce',
        state === 'error' && 'animate-shake',
        className
      )}
      aria-label={ariaLabel || config.label}
      title={tooltip}
    >
      <div className='flex items-center justify-center gap-3'>
        {animated ? (
          <StatefulIcon
            name={
              config.icon as keyof typeof import('@/components/svg-icons').iconRegistry
            }
            size={size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'xl'}
            state={state}
            variant='default'
            highContrast={true}
          />
        ) : (
          <AccessibleIcon
            name={
              config.icon as keyof typeof import('@/components/svg-icons').iconRegistry
            }
            size={size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'xl'}
            variant='default'
            highContrast={true}
          />
        )}

        <div className='flex flex-col items-start'>
          <span className='font-semibold text-white drop-shadow-sm'>
            {config.label}
          </span>
          {showDescription && (
            <span className='text-xs text-white/80 drop-shadow-sm'>
              {config.description}
            </span>
          )}
        </div>

        {badge && (
          <Badge
            variant='secondary'
            className='ml-auto bg-white/20 text-white border-white/30'
          >
            {badge}
          </Badge>
        )}
      </div>

      {/* Ripple effect */}
      <div className='absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-200' />
    </Button>
  );
}

// Floating Action Button Component
interface FloatingActionButtonProps {
  icon: keyof typeof import('@/components/svg-icons').iconRegistry;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  state?: 'idle' | 'loading' | 'success' | 'error';
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  badge?: string | number;
}

export function FloatingActionButton({
  icon,
  label,
  onClick,
  disabled = false,
  state = 'idle',
  className,
  position = 'bottom-right',
  size = 'lg',
  animated = true,
  badge,
}: FloatingActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-14 w-14',
    lg: 'h-16 w-16',
  };

  const handleClick = () => {
    if (disabled || state === 'loading') return;

    setIsPressed(true);
    onClick?.();

    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      className={cn(
        'rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 transform',
        'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary',
        sizeClasses[size],
        positionClasses[position],
        isPressed && 'scale-95',
        state === 'success' && 'animate-bounce',
        state === 'error' && 'animate-shake',
        className
      )}
      aria-label={label}
    >
      <div className='relative'>
        {animated ? (
          <StatefulIcon
            name={icon}
            size={size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'xl'}
            state={state}
            variant='default'
            highContrast={true}
          />
        ) : (
          <AccessibleIcon
            name={icon}
            size={size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'xl'}
            variant='default'
            highContrast={true}
          />
        )}

        {badge && (
          <Badge
            variant='destructive'
            className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs'
          >
            {badge}
          </Badge>
        )}
      </div>
    </Button>
  );
}

// Quick Action Button Component
interface QuickActionButtonProps {
  icon: keyof typeof import('@/components/svg-icons').iconRegistry;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  state?: 'idle' | 'loading' | 'success' | 'error';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  animated?: boolean;
  badge?: string | number;
}

export function QuickActionButton({
  icon,
  label,
  onClick,
  disabled = false,
  state = 'idle',
  className,
  size = 'md',
  variant = 'default',
  animated = true,
  badge,
}: QuickActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-base',
    lg: 'h-14 px-6 text-lg',
  };

  const handleClick = () => {
    if (disabled || state === 'loading') return;

    setIsPressed(true);
    onClick?.();

    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      className={cn(
        'transition-all duration-200 transform',
        sizeClasses[size],
        isPressed && 'scale-95',
        state === 'success' && 'animate-bounce',
        state === 'error' && 'animate-shake',
        className
      )}
      aria-label={label}
    >
      <div className='flex items-center gap-2'>
        {animated ? (
          <StatefulIcon
            name={icon}
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'}
            state={state}
            variant='default'
          />
        ) : (
          <AccessibleIcon
            name={icon}
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'}
            variant='default'
          />
        )}

        <span className='font-medium'>{label}</span>

        {badge && (
          <Badge variant='secondary' className='ml-1'>
            {badge}
          </Badge>
        )}
      </div>
    </Button>
  );
}

// Primary Actions Grid Component
interface PrimaryActionsGridProps {
  actions: Array<{
    variant: keyof typeof primaryActionVariants;
    onClick?: () => void;
    disabled?: boolean;
    state?: 'idle' | 'loading' | 'success' | 'error';
    badge?: string | number;
    tooltip?: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function PrimaryActionsGrid({
  actions,
  columns = 2,
  className,
}: PrimaryActionsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {actions.map((action, index) => (
        <PrimaryActionButton
          key={index}
          variant={action.variant}
          onClick={action.onClick}
          disabled={action.disabled}
          state={action.state}
          badge={action.badge}
          tooltip={action.tooltip}
          fullWidth={true}
        />
      ))}
    </div>
  );
}

// Primary Actions Hook
export function usePrimaryActions() {
  const [actionStates, setActionStates] = useState<Map<string, string>>(
    new Map()
  );

  const setActionState = (actionId: string, state: string) => {
    setActionStates(prev => new Map(prev.set(actionId, state)));
  };

  const getActionState = (actionId: string) => {
    return actionStates.get(actionId) || 'idle';
  };

  const resetActionState = (actionId: string) => {
    setActionStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(actionId);
      return newMap;
    });
  };

  return {
    setActionState,
    getActionState,
    resetActionState,
  };
}
