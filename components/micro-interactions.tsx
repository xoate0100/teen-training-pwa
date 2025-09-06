'use client';

/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useThemeStyles } from '@/components/theme-provider';

interface ExerciseCompletionCelebrationProps {
  isVisible: boolean;
  exerciseName: string;
  onComplete?: () => void;
  className?: string;
}

export function ExerciseCompletionCelebration({
  isVisible,
  exerciseName,
  onComplete,
  className,
}: ExerciseCompletionCelebrationProps) {
  const [animationPhase, setAnimationPhase] = useState<
    'enter' | 'hold' | 'exit'
  >('enter');
  const { colors } = useThemeStyles();

  useEffect(() => {
    if (!isVisible) return;

    const enterTimer = window.setTimeout(() => setAnimationPhase('hold'), 100);
    const holdTimer = window.setTimeout(() => setAnimationPhase('exit'), 2000);
    const exitTimer = window.setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center pointer-events-none',
        className
      )}
    >
      <div
        className={cn(
          'bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center transform transition-all duration-500',
          animationPhase === 'enter' && 'scale-0 opacity-0',
          animationPhase === 'hold' && 'scale-100 opacity-100',
          animationPhase === 'exit' && 'scale-0 opacity-0',
          'animate-bounce'
        )}
        style={{ borderColor: colors.success }}
      >
        <div className='text-6xl mb-4 animate-spin'>🎉</div>
        <h2 className='text-2xl font-bold mb-2' style={{ color: colors.text }}>
          Exercise Complete!
        </h2>
        <p className='text-lg' style={{ color: colors.textSecondary }}>
          {exerciseName}
        </p>
        <div className='mt-4'>
          <div
            className='w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl animate-ping'
            style={{ backgroundColor: colors.success }}
          >
            ✓
          </div>
        </div>
      </div>
    </div>
  );
}

interface AnimatedProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showParticles?: boolean;
  className?: string;
}

export function AnimatedProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  animated = true,
  showParticles = false,
  className,
}: AnimatedProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const { colors } = useThemeStyles();

  useEffect(() => {
    if (animated) {
      const timer = window.setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => window.clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn('w-full rounded-full overflow-hidden', sizeClasses[size])}
        style={{ backgroundColor: colors.border }}
      >
        <div
          className={cn(
            'h-full transition-all duration-1000 ease-out relative',
            animated && 'animate-pulse'
          )}
          style={{
            width: `${percentage}%`,
            backgroundColor: getVariantColor(),
          }}
        >
          {showParticles && percentage > 0 && (
            <div className='absolute inset-0 overflow-hidden'>
              <div
                className='absolute top-0 left-0 w-full h-full bg-white opacity-30 animate-ping'
                style={{ animationDelay: '0.5s' }}
              />
              <div
                className='absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-ping'
                style={{ animationDelay: '1s' }}
              />
            </div>
          )}
        </div>
      </div>
      {showParticles && percentage === 100 && (
        <div className='absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping' />
      )}
    </div>
  );
}

interface ButtonHoverEffectsProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'sm' | 'md' | 'lg';
  effect?: 'lift' | 'glow' | 'bounce' | 'ripple' | 'pulse';
  className?: string;
}

export function ButtonHoverEffects({
  variant = 'primary',
  size = 'md',
  effect = 'lift',
  className,
  children,
  ...props
}: ButtonHoverEffectsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const { colors } = useThemeStyles();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getEffectClasses = () => {
    switch (effect) {
      case 'lift':
        return 'hover:transform hover:-translate-y-1 hover:shadow-lg';
      case 'glow':
        return 'hover:shadow-lg hover:shadow-current';
      case 'bounce':
        return 'hover:animate-bounce';
      case 'pulse':
        return 'hover:animate-pulse';
      case 'ripple':
        return 'relative overflow-hidden';
      default:
        return 'hover:transform hover:-translate-y-1';
    }
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (effect !== 'ripple') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      className={cn(
        'relative rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        sizeClasses[size],
        getEffectClasses(),
        isHovered && effect === 'glow' && 'shadow-lg',
        className
      )}
      style={
        {
          backgroundColor: getVariantColor(),
          color: 'white',
          '--tw-ring-color': getVariantColor(),
        } as React.CSSProperties
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRipple}
      {...props}
    >
      {children}
      {effect === 'ripple' &&
        ripples.map(ripple => (
          <span
            key={ripple.id}
            className='absolute pointer-events-none animate-ping'
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
            }}
          />
        ))}
    </button>
  );
}

interface LoadingStateAnimationProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'bounce';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingStateAnimation({
  type = 'spinner',
  size = 'md',
  color,
  className,
}: LoadingStateAnimationProps) {
  const { colors } = useThemeStyles();
  const spinnerColor = color || colors.primary;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const renderSpinner = () => (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-current',
        sizeClasses[size]
      )}
      style={{ borderTopColor: spinnerColor }}
    />
  );

  const renderDots = () => (
    <div className='flex space-x-1'>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-bounce',
            size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
          )}
          style={{
            backgroundColor: spinnerColor,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn('rounded-full animate-pulse', sizeClasses[size])}
      style={{ backgroundColor: spinnerColor }}
    />
  );

  const renderWave = () => (
    <div className='flex space-x-1'>
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1 h-6' : 'w-1 h-8'
          )}
          style={{
            backgroundColor: spinnerColor,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderBounce = () => (
    <div
      className={cn('rounded-full animate-bounce', sizeClasses[size])}
      style={{ backgroundColor: spinnerColor }}
    />
  );

  const renderAnimation = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'wave':
        return renderWave();
      case 'bounce':
        return renderBounce();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {renderAnimation()}
    </div>
  );
}

interface MicroInteractionDemoProps {
  className?: string;
}

export function MicroInteractionDemo({ className }: MicroInteractionDemoProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleExerciseComplete = () => {
    setShowCelebration(true);
  };

  const handleProgressUpdate = () => {
    setProgressValue(prev => Math.min(prev + 25, 100));
  };

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className={cn('space-y-8 p-6', className)}>
      <h2 className='text-2xl font-bold text-center'>
        Micro-Interactions Demo
      </h2>

      {/* Exercise Completion */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Exercise Completion</h3>
        <ButtonHoverEffects
          variant='success'
          effect='ripple'
          onClick={handleExerciseComplete}
        >
          Complete Exercise
        </ButtonHoverEffects>
        <ExerciseCompletionCelebration
          isVisible={showCelebration}
          exerciseName='Push-ups'
          onComplete={() => setShowCelebration(false)}
        />
      </div>

      {/* Progress Bar */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Animated Progress Bar</h3>
        <AnimatedProgressBar
          value={progressValue}
          variant='primary'
          showParticles
          animated
        />
        <ButtonHoverEffects
          variant='primary'
          effect='lift'
          onClick={handleProgressUpdate}
        >
          Update Progress
        </ButtonHoverEffects>
      </div>

      {/* Button Effects */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Button Hover Effects</h3>
        <div className='flex flex-wrap gap-4'>
          <ButtonHoverEffects variant='primary' effect='lift'>
            Lift Effect
          </ButtonHoverEffects>
          <ButtonHoverEffects variant='secondary' effect='glow'>
            Glow Effect
          </ButtonHoverEffects>
          <ButtonHoverEffects variant='accent' effect='bounce'>
            Bounce Effect
          </ButtonHoverEffects>
          <ButtonHoverEffects variant='success' effect='pulse'>
            Pulse Effect
          </ButtonHoverEffects>
          <ButtonHoverEffects variant='warning' effect='ripple'>
            Ripple Effect
          </ButtonHoverEffects>
        </div>
      </div>

      {/* Loading States */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Loading Animations</h3>
        <div className='flex flex-wrap gap-8'>
          <div className='text-center'>
            <LoadingStateAnimation type='spinner' size='md' />
            <p className='text-sm mt-2'>Spinner</p>
          </div>
          <div className='text-center'>
            <LoadingStateAnimation type='dots' size='md' />
            <p className='text-sm mt-2'>Dots</p>
          </div>
          <div className='text-center'>
            <LoadingStateAnimation type='pulse' size='md' />
            <p className='text-sm mt-2'>Pulse</p>
          </div>
          <div className='text-center'>
            <LoadingStateAnimation type='wave' size='md' />
            <p className='text-sm mt-2'>Wave</p>
          </div>
          <div className='text-center'>
            <LoadingStateAnimation type='bounce' size='md' />
            <p className='text-sm mt-2'>Bounce</p>
          </div>
        </div>
        <ButtonHoverEffects
          variant='info'
          effect='glow'
          onClick={handleLoadingDemo}
        >
          {isLoading ? 'Loading...' : 'Start Loading Demo'}
        </ButtonHoverEffects>
        {isLoading && (
          <div className='flex justify-center'>
            <LoadingStateAnimation type='spinner' size='lg' />
          </div>
        )}
      </div>
    </div>
  );
}
