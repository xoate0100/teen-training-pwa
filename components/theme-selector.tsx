'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import {
  ThemedButton,
  ThemedCard,
  ThemedText,
  ThemedContainer,
  ThemedProgressBar,
  ThemedBadge,
  ThemedInput,
} from '@/components/themed-components';
import { DynamicThemingService } from '@/lib/services/dynamic-theming-service';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  className?: string;
  showPreview?: boolean;
  onThemeChange?: (theme: any) => void;
}

export function ThemeSelector({
  className,
  showPreview = true,
  onThemeChange,
}: ThemeSelectorProps) {
  const {
    currentTheme,
    setSessionTheme,
    setPhaseTheme,
    setProgressTheme,
    setMoodTheme,
    resetTheme,
  } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'session' | 'phase' | 'progress' | 'mood'
  >('session');

  const sessionThemes = DynamicThemingService.SESSION_THEMES;
  const phaseThemes = DynamicThemingService.PHASE_THEMES;
  const progressThemes = DynamicThemingService.PROGRESS_THEMES;
  const moodThemes = DynamicThemingService.MOOD_THEMES;

  const handleSessionThemeChange = (sessionType: any) => {
    setSessionTheme(sessionType);
    onThemeChange?.({ sessionType });
  };

  const handlePhaseThemeChange = (phase: any) => {
    setPhaseTheme(phase);
    onThemeChange?.({ phase });
  };

  const handleProgressThemeChange = (level: number) => {
    setProgressTheme(level);
    onThemeChange?.({ level });
  };

  const handleMoodThemeChange = (mood: any) => {
    setMoodTheme(mood);
    onThemeChange?.({ mood });
  };

  const tabs = [
    { id: 'session', label: 'Session', icon: '💪' },
    { id: 'phase', label: 'Phase', icon: '📈' },
    { id: 'progress', label: 'Progress', icon: '🎯' },
    { id: 'mood', label: 'Mood', icon: '😊' },
  ];

  return (
    <ThemedContainer className={cn('space-y-6', className)}>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <ThemedText size='xl' weight='bold'>
          Theme Customization
        </ThemedText>
        <ThemedButton variant='secondary' size='sm' onClick={resetTheme}>
          Reset
        </ThemedButton>
      </div>

      {/* Tabs */}
      <div className='flex space-x-1 bg-gray-100 rounded-lg p-1'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Session Themes */}
      {activeTab === 'session' && (
        <div className='space-y-4'>
          <ThemedText size='lg' weight='semibold'>
            Session Type Themes
          </ThemedText>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {sessionThemes.map(theme => (
              <ThemedCard
                key={theme.id}
                variant='outlined'
                interactive
                className={cn(
                  'p-4 cursor-pointer transition-all duration-200',
                  currentTheme.session?.id === theme.id &&
                    'ring-2 ring-blue-500'
                )}
                onClick={() => handleSessionThemeChange(theme.type)}
              >
                <div className='flex items-center space-x-3'>
                  <div
                    className='w-12 h-12 rounded-full flex items-center justify-center text-2xl'
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    {theme.icon}
                  </div>
                  <div className='flex-1'>
                    <ThemedText weight='semibold'>{theme.name}</ThemedText>
                    <ThemedText variant='secondary' size='sm'>
                      {theme.description}
                    </ThemedText>
                  </div>
                </div>
              </ThemedCard>
            ))}
          </div>
        </div>
      )}

      {/* Phase Themes */}
      {activeTab === 'phase' && (
        <div className='space-y-4'>
          <ThemedText size='lg' weight='semibold'>
            Training Phase Themes
          </ThemedText>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {phaseThemes.map(theme => (
              <ThemedCard
                key={theme.id}
                variant='outlined'
                interactive
                className={cn(
                  'p-4 cursor-pointer transition-all duration-200',
                  currentTheme.phase?.id === theme.id && 'ring-2 ring-blue-500'
                )}
                onClick={() => handlePhaseThemeChange(theme.phase)}
              >
                <div className='flex items-center space-x-3'>
                  <div
                    className='w-12 h-12 rounded-full flex items-center justify-center text-2xl'
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    {theme.intensity === 'low' && '🐌'}
                    {theme.intensity === 'medium' && '🏃'}
                    {theme.intensity === 'high' && '⚡'}
                    {theme.intensity === 'very_high' && '🔥'}
                  </div>
                  <div className='flex-1'>
                    <ThemedText weight='semibold'>{theme.name}</ThemedText>
                    <ThemedText variant='secondary' size='sm'>
                      {theme.description}
                    </ThemedText>
                    <div className='mt-2'>
                      <ThemedText size='xs' variant='accent'>
                        Intensity: {theme.intensity.replace('_', ' ')}
                      </ThemedText>
                    </div>
                  </div>
                </div>
              </ThemedCard>
            ))}
          </div>
        </div>
      )}

      {/* Progress Themes */}
      {activeTab === 'progress' && (
        <div className='space-y-4'>
          <ThemedText size='lg' weight='semibold'>
            Progress Level Themes
          </ThemedText>
          <div className='space-y-3'>
            {progressThemes.map(theme => (
              <ThemedCard
                key={theme.level}
                variant='outlined'
                interactive
                className={cn(
                  'p-4 cursor-pointer transition-all duration-200',
                  currentTheme.progress?.level === theme.level &&
                    'ring-2 ring-blue-500'
                )}
                onClick={() => handleProgressThemeChange(theme.level)}
              >
                <div className='flex items-center space-x-3'>
                  <div
                    className='w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white'
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    {theme.level}
                  </div>
                  <div className='flex-1'>
                    <ThemedText weight='semibold'>
                      Level {theme.level} Theme
                    </ThemedText>
                    <ThemedText variant='secondary' size='sm'>
                      {theme.description}
                    </ThemedText>
                    <div className='mt-2'>
                      <ThemedText size='xs' variant='accent'>
                        Intensity: {theme.intensity.replace('_', ' ')}
                      </ThemedText>
                    </div>
                  </div>
                </div>
              </ThemedCard>
            ))}
          </div>
        </div>
      )}

      {/* Mood Themes */}
      {activeTab === 'mood' && (
        <div className='space-y-4'>
          <ThemedText size='lg' weight='semibold'>
            Mood-Based Themes
          </ThemedText>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {moodThemes.map(theme => (
              <ThemedCard
                key={theme.mood}
                variant='outlined'
                interactive
                className={cn(
                  'p-4 cursor-pointer transition-all duration-200',
                  currentTheme.mood?.mood === theme.mood &&
                    'ring-2 ring-blue-500'
                )}
                onClick={() => handleMoodThemeChange(theme.mood)}
              >
                <div className='flex items-center space-x-3'>
                  <div
                    className='w-12 h-12 rounded-full flex items-center justify-center text-2xl'
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    {theme.mood === 'excited' && '🤩'}
                    {theme.mood === 'motivated' && '💪'}
                    {theme.mood === 'focused' && '🎯'}
                    {theme.mood === 'calm' && '😌'}
                    {theme.mood === 'tired' && '😴'}
                    {theme.mood === 'stressed' && '😰'}
                  </div>
                  <div className='flex-1'>
                    <ThemedText weight='semibold'>
                      {theme.mood.charAt(0).toUpperCase() + theme.mood.slice(1)}
                    </ThemedText>
                    <ThemedText variant='secondary' size='sm'>
                      {theme.description}
                    </ThemedText>
                    <div className='mt-2'>
                      <ThemedText size='xs' variant='accent'>
                        Animation: {theme.animation}
                      </ThemedText>
                    </div>
                  </div>
                </div>
              </ThemedCard>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <div className='mt-8 p-4 border-t'>
          <ThemedText size='lg' weight='semibold' className='mb-4'>
            Theme Preview
          </ThemedText>
          <div className='space-y-4'>
            <div className='flex space-x-2'>
              <ThemedButton variant='primary'>Primary</ThemedButton>
              <ThemedButton variant='secondary'>Secondary</ThemedButton>
              <ThemedButton variant='accent'>Accent</ThemedButton>
            </div>
            <ThemedProgressBar value={75} variant='primary' showLabel />
            <div className='flex space-x-2'>
              <ThemedBadge variant='success'>Success</ThemedBadge>
              <ThemedBadge variant='warning'>Warning</ThemedBadge>
              <ThemedBadge variant='error'>Error</ThemedBadge>
            </div>
            <ThemedInput placeholder='Type something...' />
          </div>
        </div>
      )}
    </ThemedContainer>
  );
}
