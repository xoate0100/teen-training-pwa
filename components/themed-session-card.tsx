'use client';

import React from 'react';
import {
  SessionThemeService,
  SessionTheme,
} from '@/lib/services/session-theme-service';
import { SessionCardBackground } from './hero-background';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ThemedSessionCardProps {
  sessionType: 'strength' | 'volleyball' | 'plyometric' | 'recovery';
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isCompleted?: boolean;
  isLocked?: boolean;
  onStart?: () => void;
  onViewDetails?: () => void;
  className?: string;
  showProgress?: boolean;
  progress?: number;
  customTheme?: Partial<SessionTheme>;
}

export function ThemedSessionCard({
  sessionType,
  title,
  description,
  duration,
  difficulty,
  isCompleted = false,
  isLocked = false,
  onStart,
  onViewDetails,
  className,
  showProgress = false,
  progress = 0,
  customTheme,
}: ThemedSessionCardProps) {
  const theme = customTheme
    ? { ...SessionThemeService.getTheme(sessionType), ...customTheme }
    : SessionThemeService.getTheme(sessionType);

  const difficultyColors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500',
  };

  const difficultyLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  return (
    <SessionCardBackground
      sessionType={sessionType}
      className={cn('h-full', className)}
    >
      <div
        className={cn(
          'h-full flex flex-col justify-between',
          theme.spacing.padding,
          theme.animations.entrance
        )}
      >
        {/* Header */}
        <div className='flex justify-between items-start mb-4'>
          <div className='flex items-center gap-3'>
            <div className={cn('text-4xl', theme.animations.hover)}>
              {theme.icons.main}
            </div>
            <div>
              <h3 className={cn(theme.typography.heading, 'mb-1')}>{title}</h3>
              <div className='flex items-center gap-2'>
                <Badge
                  className={cn(
                    difficultyColors[difficulty],
                    'text-white text-xs'
                  )}
                >
                  {difficultyLabels[difficulty]}
                </Badge>
                <span
                  className={cn(
                    theme.typography.caption,
                    'flex items-center gap-1'
                  )}
                >
                  ⏱️ {duration}
                </span>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className='flex flex-col items-end gap-2'>
            {isCompleted && <div className='text-2xl'>✅</div>}
            {isLocked && <div className='text-2xl'>🔒</div>}
            {showProgress && (
              <div className='text-right'>
                <div className={cn(theme.typography.caption, 'mb-1')}>
                  Progress
                </div>
                <div className='w-16 h-2 bg-white/20 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-white rounded-full transition-all duration-500'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className='mb-6'>
          <p className={cn(theme.typography.body, 'leading-relaxed')}>
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          {!isLocked && onStart && (
            <Button
              onClick={onStart}
              className={cn(
                'flex-1',
                SessionThemeService.generateThemeClasses(theme, 'button'),
                theme.animations.hover,
                theme.animations.focus
              )}
              disabled={isLocked}
            >
              <span className='flex items-center gap-2'>
                {isCompleted ? '🔄 Repeat' : '▶️ Start'}
                {theme.icons.secondary}
              </span>
            </Button>
          )}

          {onViewDetails && (
            <Button
              variant='outline'
              onClick={onViewDetails}
              className={cn(
                'px-4',
                'bg-white/10 border-white/20 text-white hover:bg-white/20',
                theme.animations.hover,
                theme.animations.focus
              )}
            >
              👁️ Details
            </Button>
          )}
        </div>

        {/* Theme-specific decorative elements */}
        <div className='absolute top-4 right-4 opacity-20 text-6xl pointer-events-none'>
          {theme.icons.background}
        </div>
      </div>
    </SessionCardBackground>
  );
}

interface ThemedSessionGridProps {
  sessions: Array<{
    id: string;
    type: 'strength' | 'volleyball' | 'plyometric' | 'recovery';
    title: string;
    description: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    isCompleted?: boolean;
    isLocked?: boolean;
    progress?: number;
  }>;
  /* eslint-disable-next-line no-unused-vars */
  onSessionStart?: (sessionId: string) => void;
  /* eslint-disable-next-line no-unused-vars */
  onSessionDetails?: (sessionId: string) => void;
  className?: string;
}

export function ThemedSessionGrid({
  sessions,
  onSessionStart,
  onSessionDetails,
  className,
}: ThemedSessionGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className
      )}
    >
      {sessions.map(session => (
        <ThemedSessionCard
          key={session.id}
          sessionType={session.type}
          title={session.title}
          description={session.description}
          duration={session.duration}
          difficulty={session.difficulty}
          isCompleted={session.isCompleted}
          isLocked={session.isLocked}
          progress={session.progress}
          showProgress={!!session.progress}
          onStart={() => onSessionStart?.(session.id)}
          onViewDetails={() => onSessionDetails?.(session.id)}
        />
      ))}
    </div>
  );
}

interface ThemePreviewProps {
  theme: SessionTheme;
  className?: string;
}

export function ThemePreview({ theme, className }: ThemePreviewProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-lg',
        SessionThemeService.generateThemeClasses(theme, 'card'),
        className
      )}
      style={SessionThemeService.generateCSSVariables(theme)}
    >
      <div className='flex items-center gap-4 mb-4'>
        <div className='text-4xl'>{theme.icons.main}</div>
        <div>
          <h3 className={theme.typography.heading}>{theme.name}</h3>
          <p className={theme.typography.caption}>Theme Preview</p>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex gap-2'>
          <div
            className={cn(
              'w-4 h-4 rounded-full',
              `bg-[${theme.colors.primary}]`
            )}
          />
          <div
            className={cn(
              'w-4 h-4 rounded-full',
              `bg-[${theme.colors.secondary}]`
            )}
          />
          <div
            className={cn(
              'w-4 h-4 rounded-full',
              `bg-[${theme.colors.accent}]`
            )}
          />
        </div>

        <p className={theme.typography.body}>
          This is a preview of the {theme.name} theme with its unique color
          palette, typography, and visual elements.
        </p>

        <Button
          className={SessionThemeService.generateThemeClasses(theme, 'button')}
        >
          Preview Action
        </Button>
      </div>
    </div>
  );
}
