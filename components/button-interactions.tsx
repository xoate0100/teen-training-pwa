'use client';

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AccessibleIcon } from '@/components/accessible-icons';
import { AnimatedIcon, StatefulIcon } from '@/components/animated-icons';

// Button interaction states
export const buttonStates = {
  idle: 'opacity-100 scale-100',
  hover: 'hover:opacity-90 hover:scale-105 hover:shadow-lg',
  pressed: 'active:scale-95 active:opacity-80',
  disabled: 'opacity-50 cursor-not-allowed scale-100',
  loading: 'opacity-75 cursor-wait scale-100',
  success: 'opacity-100 scale-105 bg-green-500',
  error: 'opacity-100 scale-100 bg-red-500',
  warning: 'opacity-100 scale-100 bg-yellow-500',
} as const;

// Haptic feedback patterns
export const hapticPatterns = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [10, 20, 10],
  error: [30, 10, 30],
  warning: [20, 10, 20],
  selection: [5],
} as const;

// Button interaction props
interface ButtonInteractionProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  state?: 'idle' | 'loading' | 'success' | 'error' | 'warning';
  hapticFeedback?: keyof typeof hapticPatterns;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  showProgress?: boolean;
  progress?: number;
  onStateChange?: (newState: string) => void;
}

// Enhanced Button with Interactions
export function InteractiveButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  state = 'idle',
  hapticFeedback = 'medium',
  className,
  size = 'md',
  variant = 'default',
  showProgress = false,
  progress = 0,
  onStateChange,
}: ButtonInteractionProps) {
  const [currentState, setCurrentState] = useState(state);
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  useEffect(() => {
    setCurrentState(state);
    onStateChange?.(state);
  }, [state, onStateChange]);

  const triggerHaptic = (pattern: keyof typeof hapticPatterns) => {
    if (navigator.vibrate) {
      navigator.vibrate(hapticPatterns[pattern]);
    }
  };

  const handleClick = () => {
    if (disabled || loading || currentState === 'loading') return;

    // Trigger haptic feedback
    triggerHaptic(hapticFeedback);

    // Visual feedback
    setIsPressed(true);
    setShowRipple(true);

    // Reset visual feedback
    setTimeout(() => {
      setIsPressed(false);
      setShowRipple(false);
    }, 150);

    // Execute click handler
    onClick?.();
  };

  const getStateClasses = () => {
    switch (currentState) {
      case 'loading':
        return 'opacity-75 cursor-wait';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'error':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      default:
        return '';
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || loading || currentState === 'loading'}
      variant={variant}
      size={size}
      className={cn(
        'relative overflow-hidden transition-all duration-200 transform',
        buttonStates.idle,
        !disabled && !loading && buttonStates.hover,
        isPressed && buttonStates.pressed,
        disabled && buttonStates.disabled,
        loading && buttonStates.loading,
        getStateClasses(),
        className
      )}
    >
      {children}

      {/* Loading spinner */}
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
        </div>
      )}

      {/* Progress bar */}
      {showProgress && progress > 0 && (
        <div className='absolute bottom-0 left-0 h-1 bg-primary/20 w-full'>
          <div
            className='h-full bg-primary transition-all duration-300'
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {/* Ripple effect */}
      {showRipple && (
        <div className='absolute inset-0 bg-white/20 animate-ping' />
      )}
    </Button>
  );
}

// Progress Button Component
interface ProgressButtonProps {
  children: ReactNode;
  progress: number;
  maxProgress?: number;
  onComplete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  showPercentage?: boolean;
  hapticFeedback?: keyof typeof hapticPatterns;
}

export function ProgressButton({
  children,
  progress,
  maxProgress = 100,
  onComplete,
  onClick,
  disabled = false,
  className,
  size = 'md',
  variant = 'default',
  showPercentage = true,
  hapticFeedback = 'light',
}: ProgressButtonProps) {
  const [isComplete, setIsComplete] = useState(false);
  const percentage = Math.min(100, Math.max(0, (progress / maxProgress) * 100));

  useEffect(() => {
    if (percentage >= 100 && !isComplete) {
      setIsComplete(true);
      onComplete?.();
      if (navigator.vibrate) {
        navigator.vibrate(hapticPatterns.success);
      }
    }
  }, [percentage, isComplete, onComplete]);

  return (
    <InteractiveButton
      onClick={onClick}
      disabled={disabled}
      state={isComplete ? 'success' : 'idle'}
      hapticFeedback={hapticFeedback}
      className={cn('relative', className)}
      size={size}
      variant={variant}
      showProgress={true}
      progress={percentage}
    >
      <div className='flex items-center justify-between w-full'>
        <span>{children}</span>
        {showPercentage && (
          <Badge variant='secondary' className='ml-2'>
            {Math.round(percentage)}%
          </Badge>
        )}
      </div>
    </InteractiveButton>
  );
}

// Stateful Button Component
interface StatefulButtonProps {
  children: ReactNode;
  onClick?: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  hapticFeedback?: keyof typeof hapticPatterns;
  successMessage?: string;
  errorMessage?: string;
  autoReset?: boolean;
  resetDelay?: number;
}

export function StatefulButton({
  children,
  onClick,
  disabled = false,
  className,
  size = 'md',
  variant = 'default',
  hapticFeedback = 'medium',
  successMessage = 'Success!',
  errorMessage = 'Error occurred',
  autoReset = true,
  resetDelay = 2000,
}: StatefulButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    if (disabled || state === 'loading') return;

    setState('loading');
    setMessage('');

    try {
      await onClick?.();
      setState('success');
      setMessage(successMessage);

      if (navigator.vibrate) {
        navigator.vibrate(hapticPatterns.success);
      }

      if (autoReset) {
        setTimeout(() => {
          setState('idle');
          setMessage('');
        }, resetDelay);
      }
    } catch (error) {
      setState('error');
      setMessage(errorMessage);

      if (navigator.vibrate) {
        navigator.vibrate(hapticPatterns.error);
      }

      if (autoReset) {
        setTimeout(() => {
          setState('idle');
          setMessage('');
        }, resetDelay);
      }
    }
  };

  return (
    <div className='flex flex-col items-center gap-2'>
      <InteractiveButton
        onClick={handleClick}
        disabled={disabled}
        state={state}
        hapticFeedback={hapticFeedback}
        className={className}
        size={size}
        variant={variant}
      >
        {children}
      </InteractiveButton>

      {message && (
        <div
          className={cn(
            'text-xs font-medium transition-all duration-200',
            state === 'success' && 'text-green-600',
            state === 'error' && 'text-red-600',
            state === 'loading' && 'text-blue-600'
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
}

// Icon Button with Interactions
interface InteractiveIconButtonProps {
  icon: keyof typeof import('@/components/svg-icons').iconRegistry;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  state?: 'idle' | 'loading' | 'success' | 'error' | 'warning';
  hapticFeedback?: keyof typeof hapticPatterns;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  showLabel?: boolean;
  animated?: boolean;
}

export function InteractiveIconButton({
  icon,
  label,
  onClick,
  disabled = false,
  loading = false,
  state = 'idle',
  hapticFeedback = 'light',
  className,
  size = 'md',
  variant = 'default',
  showLabel = true,
  animated = true,
}: InteractiveIconButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled || loading) return;

    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(hapticPatterns[hapticFeedback]);
    }

    // Visual feedback
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    onClick?.();
  };

  const iconSize =
    size === 'sm' ? 'sm' : size === 'md' ? 'md' : size === 'lg' ? 'lg' : 'xl';

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || loading}
      variant={variant}
      size={size}
      className={cn(
        'relative overflow-hidden transition-all duration-200 transform',
        buttonStates.idle,
        !disabled && !loading && buttonStates.hover,
        isPressed && buttonStates.pressed,
        disabled && buttonStates.disabled,
        loading && buttonStates.loading,
        className
      )}
      aria-label={label}
    >
      <div className='flex items-center gap-2'>
        {animated ? (
          <StatefulIcon
            name={icon}
            size={iconSize}
            state={loading ? 'loading' : state}
            variant='default'
          />
        ) : (
          <AccessibleIcon
            name={icon}
            size={iconSize}
            variant='default'
            state={loading ? 'loading' : state}
          />
        )}

        {showLabel && <span className='font-medium'>{label}</span>}
      </div>
    </Button>
  );
}

// Button Interaction Hook
export function useButtonInteractions() {
  const [buttonStates, setButtonStates] = useState<Map<string, string>>(
    new Map()
  );

  const setButtonState = (buttonId: string, state: string) => {
    setButtonStates(prev => new Map(prev.set(buttonId, state)));
  };

  const getButtonState = (buttonId: string) => {
    return buttonStates.get(buttonId) || 'idle';
  };

  const resetButtonState = (buttonId: string) => {
    setButtonStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(buttonId);
      return newMap;
    });
  };

  const triggerHaptic = (pattern: keyof typeof hapticPatterns) => {
    if (navigator.vibrate) {
      navigator.vibrate(hapticPatterns[pattern]);
    }
  };

  return {
    setButtonState,
    getButtonState,
    resetButtonState,
    triggerHaptic,
    hapticPatterns,
  };
}
