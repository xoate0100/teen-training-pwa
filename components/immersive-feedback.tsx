'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useThemeStyles } from '@/components/theme-provider';

interface HapticFeedbackProps {
  intensity?: 'light' | 'medium' | 'heavy';
  duration?: number;
  pattern?: 'single' | 'double' | 'triple' | 'long';
}

export function useHapticFeedback() {
  const triggerHaptic = ({
    intensity = 'medium',
    duration = 100,
    pattern = 'single',
  }: HapticFeedbackProps = {}) => {
    if (!navigator.vibrate) return;

    const patterns = {
      single: [duration],
      double: [duration, 50, duration],
      triple: [duration, 50, duration, 50, duration],
      long: [duration * 3],
    };

    navigator.vibrate(patterns[pattern]);
  };

  return { triggerHaptic };
}

interface SoundEffectProps {
  type:
    | 'achievement'
    | 'success'
    | 'warning'
    | 'error'
    | 'notification'
    | 'click';
  volume?: number;
  pitch?: number;
}

export function useSoundEffects() {
  const playSound = ({ type, volume = 0.5, pitch = 1 }: SoundEffectProps) => {
    // Create audio context for sound generation
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const frequencies = {
      achievement: [523, 659, 784, 1047], // C-E-G-C
      success: [523, 659], // C-E
      warning: [440, 370], // A-F#
      error: [220, 185], // Low A-F#
      notification: [800, 600], // High frequencies
      click: [1000], // High click
    };

    const durations = {
      achievement: [200, 200, 200, 400],
      success: [200, 300],
      warning: [300, 200],
      error: [400, 300],
      notification: [100, 100],
      click: [50],
    };

    const freq = frequencies[type];
    const dur = durations[type];

    freq.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(
        frequency * pitch,
        audioContext.currentTime
      );
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        volume,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + dur[index] / 1000
      );

      oscillator.start(audioContext.currentTime + index * 0.1);
      oscillator.stop(
        audioContext.currentTime + dur[index] / 1000 + index * 0.1
      );
    });
  };

  return { playSound };
}

interface VisualProgressIndicatorProps {
  type: 'circular' | 'linear' | 'radial' | 'pulse';
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export function VisualProgressIndicator({
  type,
  value,
  max = 100,
  size = 'md',
  animated = true,
  showPercentage = true,
  className,
}: VisualProgressIndicatorProps) {
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
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const renderCircular = () => {
    const radius =
      size === 'sm' ? 20 : size === 'md' ? 28 : size === 'lg' ? 40 : 56;
    const strokeWidth =
      size === 'sm' ? 3 : size === 'md' ? 4 : size === 'lg' ? 6 : 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={cn('relative', sizeClasses[size])}>
        <svg
          className='w-full h-full transform -rotate-90'
          viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius * 2 + strokeWidth * 2}`}
        >
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill='none'
            className='opacity-20'
          />
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={colors.primary}
            strokeWidth={strokeWidth}
            fill='none'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              'transition-all duration-1000 ease-out',
              animated && 'animate-pulse'
            )}
            style={{
              strokeLinecap: 'round',
            }}
          />
        </svg>
        {showPercentage && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <span
              className={cn('font-bold', textSizeClasses[size])}
              style={{ color: colors.text }}
            >
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderLinear = () => {
    const height =
      size === 'sm' ? 4 : size === 'md' ? 6 : size === 'lg' ? 8 : 12;

    return (
      <div className={cn('w-full', className)}>
        <div
          className='w-full rounded-full overflow-hidden'
          style={{
            height,
            backgroundColor: colors.border,
          }}
        >
          <div
            className={cn(
              'h-full transition-all duration-1000 ease-out',
              animated && 'animate-pulse'
            )}
            style={{
              width: `${percentage}%`,
              backgroundColor: colors.primary,
            }}
          />
        </div>
        {showPercentage && (
          <div className='mt-2 text-right'>
            <span
              className={cn('font-medium', textSizeClasses[size])}
              style={{ color: colors.textSecondary }}
            >
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderRadial = () => {
    const radius =
      size === 'sm' ? 20 : size === 'md' ? 28 : size === 'lg' ? 40 : 56;
    const strokeWidth =
      size === 'sm' ? 3 : size === 'md' ? 4 : size === 'lg' ? 6 : 8;

    return (
      <div className={cn('relative', sizeClasses[size])}>
        <svg
          className='w-full h-full'
          viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius * 2 + strokeWidth * 2}`}
        >
          <defs>
            <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' stopColor={colors.primary} />
              <stop offset='100%' stopColor={colors.accent} />
            </linearGradient>
          </defs>
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill='none'
            className='opacity-20'
          />
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke='url(#gradient)'
            strokeWidth={strokeWidth}
            fill='none'
            strokeDasharray={`${2 * Math.PI * radius}`}
            strokeDashoffset={`${2 * Math.PI * radius * (1 - percentage / 100)}`}
            className={cn(
              'transition-all duration-1000 ease-out',
              animated && 'animate-pulse'
            )}
            style={{
              strokeLinecap: 'round',
            }}
          />
        </svg>
        {showPercentage && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <span
              className={cn('font-bold', textSizeClasses[size])}
              style={{ color: colors.text }}
            >
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderPulse = () => {
    return (
      <div className={cn('relative', sizeClasses[size])}>
        <div
          className={cn(
            'w-full h-full rounded-full flex items-center justify-center',
            animated && 'animate-pulse'
          )}
          style={{
            backgroundColor: `${colors.primary}20`,
            border: `2px solid ${colors.primary}`,
          }}
        >
          {showPercentage && (
            <span
              className={cn('font-bold', textSizeClasses[size])}
              style={{ color: colors.primary }}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        {animated && (
          <div
            className='absolute inset-0 rounded-full animate-ping'
            style={{
              backgroundColor: colors.primary,
              opacity: 0.3,
            }}
          />
        )}
      </div>
    );
  };

  const renderIndicator = () => {
    switch (type) {
      case 'circular':
        return renderCircular();
      case 'linear':
        return renderLinear();
      case 'radial':
        return renderRadial();
      case 'pulse':
        return renderPulse();
      default:
        return renderCircular();
    }
  };

  return renderIndicator();
}

interface ContextualHelpTooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  className?: string;
  children: React.ReactNode;
}

export function ContextualHelpTooltip({
  content,
  position = 'top',
  trigger = 'hover',
  className,
  children,
}: ContextualHelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { colors } = useThemeStyles();

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-current',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-current',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-current',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-current',
  };

  const handleTrigger = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    } else {
      setIsVisible(true);
    }
  };

  const handleUntrigger = () => {
    if (trigger !== 'click') {
      setIsVisible(false);
    }
  };

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
      onMouseLeave={trigger === 'hover' ? handleUntrigger : undefined}
      onFocus={trigger === 'focus' ? handleTrigger : undefined}
      onBlur={trigger === 'focus' ? handleUntrigger : undefined}
      onClick={trigger === 'click' ? handleTrigger : undefined}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-sm text-white rounded-lg shadow-lg max-w-xs',
            positionClasses[position]
          )}
          style={{
            backgroundColor: colors.text,
          }}
        >
          {content}
          <div
            className={cn(
              'absolute w-0 h-0 border-4 border-transparent',
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
}

interface ImmersiveFeedbackDemoProps {
  className?: string;
}

export function ImmersiveFeedbackDemo({
  className,
}: ImmersiveFeedbackDemoProps) {
  const { triggerHaptic } = useHapticFeedback();
  const { playSound } = useSoundEffects();
  const [progressValue, setProgressValue] = useState(0);

  const handleFeedback = (_type: string) => {
    void _type; // Suppress unused parameter warning
    triggerHaptic({ intensity: 'medium', pattern: 'double' });
    playSound({ type: 'success' });
  };

  const handleProgressUpdate = () => {
    setProgressValue(prev => Math.min(prev + 25, 100));
    triggerHaptic({ intensity: 'light', pattern: 'single' });
    playSound({ type: 'click' });
  };

  return (
    <div className={cn('space-y-8 p-6', className)}>
      <h2 className='text-2xl font-bold text-center'>
        Immersive Feedback Demo
      </h2>

      {/* Haptic Feedback */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Haptic Feedback</h3>
        <div className='flex flex-wrap gap-4'>
          <button
            onClick={() =>
              triggerHaptic({ intensity: 'light', pattern: 'single' })
            }
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            Light Single
          </button>
          <button
            onClick={() =>
              triggerHaptic({ intensity: 'medium', pattern: 'double' })
            }
            className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
          >
            Medium Double
          </button>
          <button
            onClick={() =>
              triggerHaptic({ intensity: 'heavy', pattern: 'triple' })
            }
            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
          >
            Heavy Triple
          </button>
        </div>
      </div>

      {/* Sound Effects */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Sound Effects</h3>
        <div className='flex flex-wrap gap-4'>
          <button
            onClick={() => playSound({ type: 'achievement' })}
            className='px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600'
          >
            Achievement
          </button>
          <button
            onClick={() => playSound({ type: 'success' })}
            className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
          >
            Success
          </button>
          <button
            onClick={() => playSound({ type: 'warning' })}
            className='px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600'
          >
            Warning
          </button>
          <button
            onClick={() => playSound({ type: 'error' })}
            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
          >
            Error
          </button>
        </div>
      </div>

      {/* Visual Progress Indicators */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Visual Progress Indicators</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          <div className='text-center'>
            <VisualProgressIndicator
              type='circular'
              value={progressValue}
              size='md'
              animated
            />
            <p className='text-sm mt-2'>Circular</p>
          </div>
          <div className='text-center'>
            <VisualProgressIndicator
              type='linear'
              value={progressValue}
              size='md'
              animated
            />
            <p className='text-sm mt-2'>Linear</p>
          </div>
          <div className='text-center'>
            <VisualProgressIndicator
              type='radial'
              value={progressValue}
              size='md'
              animated
            />
            <p className='text-sm mt-2'>Radial</p>
          </div>
          <div className='text-center'>
            <VisualProgressIndicator
              type='pulse'
              value={progressValue}
              size='md'
              animated
            />
            <p className='text-sm mt-2'>Pulse</p>
          </div>
        </div>
        <button
          onClick={handleProgressUpdate}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
        >
          Update Progress
        </button>
      </div>

      {/* Contextual Help Tooltips */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Contextual Help Tooltips</h3>
        <div className='flex flex-wrap gap-4'>
          <ContextualHelpTooltip
            content='This is a helpful tooltip that appears on hover'
            position='top'
            trigger='hover'
          >
            <button className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600'>
              Hover Tooltip
            </button>
          </ContextualHelpTooltip>
          <ContextualHelpTooltip
            content='Click to show/hide this tooltip'
            position='bottom'
            trigger='click'
          >
            <button className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600'>
              Click Tooltip
            </button>
          </ContextualHelpTooltip>
          <ContextualHelpTooltip
            content='Focus to see this tooltip'
            position='left'
            trigger='focus'
          >
            <button className='px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600'>
              Focus Tooltip
            </button>
          </ContextualHelpTooltip>
        </div>
      </div>

      {/* Combined Feedback */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Combined Feedback</h3>
        <button
          onClick={() => handleFeedback('combined')}
          className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200'
        >
          Complete Action (Haptic + Sound + Visual)
        </button>
      </div>
    </div>
  );
}
