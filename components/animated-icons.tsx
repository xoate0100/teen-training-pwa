'use client';

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AccessibleIcon } from '@/components/accessible-icons';

// Animation types
export const animationTypes = {
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
  wiggle: 'animate-wiggle',
  shake: 'animate-shake',
  float: 'animate-float',
  glow: 'animate-glow',
} as const;

// Icon states with animations
export const animatedIconStates = {
  default: 'opacity-100',
  hover: 'hover:opacity-80 hover:scale-105 hover:animate-pulse',
  active: 'opacity-100 scale-105 animate-bounce',
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'animate-spin',
  success: 'animate-bounce text-green-600',
  error: 'animate-shake text-red-600',
  warning: 'animate-pulse text-yellow-600',
  info: 'animate-ping text-blue-600',
} as const;

// Animated Icon Props
interface AnimatedIconProps {
  name: keyof typeof import('@/components/svg-icons').iconRegistry;
  size?: keyof typeof import('@/components/accessible-icons').accessibleIconSizes;
  variant?: keyof typeof import('@/components/accessible-icons').highContrastVariants;
  state?: keyof typeof animatedIconStates;
  animation?: keyof typeof animationTypes;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  disabled?: boolean;
  highContrast?: boolean;
  autoAnimate?: boolean;
  animationDelay?: number;
  animationDuration?: number;
}

// Animated Icon Component
export function AnimatedIcon({
  name,
  size = 'lg',
  variant = 'default',
  state = 'default',
  animation,
  className,
  onClick,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  disabled = false,
  highContrast = false,
  autoAnimate = false,
  animationDelay = 0,
  animationDuration = 1000,
}: AnimatedIconProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (autoAnimate) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), animationDuration);
      }, animationDelay);

      return () => clearTimeout(timer);
    }
  }, [autoAnimate, animationDelay, animationDuration]);

  const handleClick = () => {
    if (disabled) return;

    if (onClick) {
      setIsAnimating(true);
      onClick();
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <AccessibleIcon
      name={name}
      size={size}
      variant={variant}
      state={state}
      className={cn(
        animation && animationTypes[animation],
        isAnimating && 'animate-bounce',
        className
      )}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      disabled={disabled}
      highContrast={highContrast}
      style={{
        animationDelay: `${animationDelay}ms`,
        animationDuration: `${animationDuration}ms`,
      }}
    />
  );
}

// Loading Icon Component
interface LoadingIconProps {
  name: keyof typeof import('@/components/svg-icons').iconRegistry;
  size?: keyof typeof import('@/components/accessible-icons').accessibleIconSizes;
  variant?: keyof typeof import('@/components/accessible-icons').highContrastVariants;
  className?: string;
  'aria-label'?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export function LoadingIcon({
  name,
  size = 'lg',
  variant = 'default',
  className,
  'aria-label': ariaLabel = 'Loading',
  speed = 'normal',
}: LoadingIconProps) {
  const speedClasses = {
    slow: 'animate-spin',
    normal: 'animate-spin',
    fast: 'animate-spin',
  };

  return (
    <AnimatedIcon
      name={name}
      size={size}
      variant={variant}
      state='loading'
      animation='spin'
      className={cn(speedClasses[speed], className)}
      aria-label={ariaLabel}
      disabled={true}
    />
  );
}

// Success Icon Component
interface SuccessIconProps {
  name: keyof typeof import('@/components/svg-icons').iconRegistry;
  size?: keyof typeof import('@/components/accessible-icons').accessibleIconSizes;
  variant?: keyof typeof import('@/components/accessible-icons').highContrastVariants;
  className?: string;
  'aria-label'?: string;
  showAnimation?: boolean;
  onAnimationComplete?: () => void;
}

export function SuccessIcon({
  name,
  size = 'lg',
  variant = 'default',
  className,
  'aria-label': ariaLabel = 'Success',
  showAnimation = true,
  onAnimationComplete,
}: SuccessIconProps) {
  const [isAnimating, setIsAnimating] = useState(showAnimation);

  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showAnimation, onAnimationComplete]);

  return (
    <AnimatedIcon
      name={name}
      size={size}
      variant='success'
      state='success'
      animation='bounce'
      className={cn(isAnimating && 'animate-bounce', className)}
      aria-label={ariaLabel}
      disabled={true}
    />
  );
}

// Error Icon Component
interface ErrorIconProps {
  name: keyof typeof import('@/components/svg-icons').iconRegistry;
  size?: keyof typeof import('@/components/accessible-icons').accessibleIconSizes;
  variant?: keyof typeof import('@/components/accessible-icons').highContrastVariants;
  className?: string;
  'aria-label'?: string;
  showAnimation?: boolean;
  onAnimationComplete?: () => void;
}

export function ErrorIcon({
  name,
  size = 'lg',
  variant = 'default',
  className,
  'aria-label': ariaLabel = 'Error',
  showAnimation = true,
  onAnimationComplete,
}: ErrorIconProps) {
  const [isAnimating, setIsAnimating] = useState(showAnimation);

  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showAnimation, onAnimationComplete]);

  return (
    <AnimatedIcon
      name={name}
      size={size}
      variant='error'
      state='error'
      animation='shake'
      className={cn(isAnimating && 'animate-shake', className)}
      aria-label={ariaLabel}
      disabled={true}
    />
  );
}

// Icon with State Management
interface StatefulIconProps {
  name: keyof typeof import('@/components/svg-icons').iconRegistry;
  size?: keyof typeof import('@/components/accessible-icons').accessibleIconSizes;
  variant?: keyof typeof import('@/components/accessible-icons').highContrastVariants;
  className?: string;
  'aria-label'?: string;
  state: 'idle' | 'loading' | 'success' | 'error' | 'warning' | 'info';
  onClick?: () => void;
  disabled?: boolean;
  highContrast?: boolean;
  onStateChange?: (newState: string) => void;
}

export function StatefulIcon({
  name,
  size = 'lg',
  variant = 'default',
  className,
  'aria-label': ariaLabel,
  state,
  onClick,
  disabled = false,
  highContrast = false,
  onStateChange,
}: StatefulIconProps) {
  const [currentState, setCurrentState] = useState(state);

  useEffect(() => {
    setCurrentState(state);
    onStateChange?.(state);
  }, [state, onStateChange]);

  const getStateProps = () => {
    switch (currentState) {
      case 'loading':
        return {
          state: 'loading' as const,
          animation: 'spin' as const,
          'aria-label': 'Loading...',
        };
      case 'success':
        return {
          state: 'success' as const,
          animation: 'bounce' as const,
          'aria-label': 'Success',
        };
      case 'error':
        return {
          state: 'error' as const,
          animation: 'shake' as const,
          'aria-label': 'Error',
        };
      case 'warning':
        return {
          state: 'warning' as const,
          animation: 'pulse' as const,
          'aria-label': 'Warning',
        };
      case 'info':
        return {
          state: 'info' as const,
          animation: 'ping' as const,
          'aria-label': 'Information',
        };
      default:
        return {
          state: 'default' as const,
          'aria-label': ariaLabel,
        };
    }
  };

  const stateProps = getStateProps();

  return (
    <AnimatedIcon
      name={name}
      size={size}
      variant={variant}
      className={className}
      onClick={onClick}
      disabled={disabled}
      highContrast={highContrast}
      {...stateProps}
    />
  );
}

// Icon Animation Hook
export function useIconAnimation() {
  const [animations, setAnimations] = useState<Map<string, boolean>>(new Map());

  const triggerAnimation = (iconId: string, duration = 1000) => {
    setAnimations(prev => new Map(prev.set(iconId, true)));

    setTimeout(() => {
      setAnimations(prev => new Map(prev.set(iconId, false)));
    }, duration);
  };

  const isAnimating = (iconId: string) => {
    return animations.get(iconId) || false;
  };

  const stopAnimation = (iconId: string) => {
    setAnimations(prev => new Map(prev.set(iconId, false)));
  };

  return {
    triggerAnimation,
    isAnimating,
    stopAnimation,
  };
}
