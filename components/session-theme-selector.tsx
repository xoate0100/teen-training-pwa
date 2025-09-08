'use client';

import React, { useState } from 'react';
import {
  SessionThemeService,
  SessionTheme,
} from '@/lib/services/session-theme-service';
import { ThemePreview } from './themed-session-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SessionThemeSelectorProps {
  currentTheme?: SessionTheme['type'];

  onThemeSelect?: (theme: SessionTheme) => void;

  onThemePreview?: (theme: SessionTheme) => void;
  className?: string;
  showPreview?: boolean;
}

export function SessionThemeSelector({
  currentTheme,
  onThemeSelect,
  onThemePreview,
  className,
  showPreview = true,
}: SessionThemeSelectorProps) {
  const [previewTheme, setPreviewTheme] = useState<SessionTheme | null>(null);
  const themes = SessionThemeService.getAllThemes();

  const handleThemeHover = (theme: SessionTheme) => {
    if (onThemePreview) {
      onThemePreview(theme);
    }
    setPreviewTheme(theme);
  };

  const handleThemeSelect = (theme: SessionTheme) => {
    if (onThemeSelect) {
      onThemeSelect(theme);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Choose Your Session Theme
        </h2>
        <p className='text-gray-600'>
          Select a visual theme that matches your training style and
          preferences.
        </p>
      </div>

      {/* Theme Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {themes.map(theme => (
          <Card
            key={theme.id}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg',
              currentTheme === theme.type && 'ring-2 ring-blue-500',
              'group'
            )}
            onMouseEnter={() => handleThemeHover(theme)}
            onMouseLeave={() => setPreviewTheme(null)}
            onClick={() => handleThemeSelect(theme)}
          >
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='text-3xl group-hover:scale-110 transition-transform duration-300'>
                  {theme.icons.main}
                </div>
                {currentTheme === theme.type && (
                  <Badge className='bg-blue-500 text-white'>Selected</Badge>
                )}
              </div>
              <CardTitle className='text-lg'>{theme.name}</CardTitle>
            </CardHeader>

            <CardContent className='pt-0'>
              {/* Color Palette Preview */}
              <div className='flex gap-1 mb-3'>
                <div
                  className='w-6 h-6 rounded-full border-2 border-white shadow-sm'
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className='w-6 h-6 rounded-full border-2 border-white shadow-sm'
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div
                  className='w-6 h-6 rounded-full border-2 border-white shadow-sm'
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>

              {/* Theme Description */}
              <p className='text-sm text-gray-600 mb-3'>
                {getThemeDescription(theme.type)}
              </p>

              {/* Action Button */}
              <Button
                variant={currentTheme === theme.type ? 'default' : 'outline'}
                size='sm'
                className='w-full'
                onClick={() => handleThemeSelect(theme)}
              >
                {currentTheme === theme.type ? 'Selected' : 'Select Theme'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Preview */}
      {showPreview && previewTheme && (
        <div className='mt-8'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Live Preview: {previewTheme.name}
          </h3>
          <ThemePreview theme={previewTheme} />
        </div>
      )}

      {/* Current Theme Info */}
      {currentTheme && (
        <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Current Theme: {SessionThemeService.getTheme(currentTheme).name}
          </h3>
          <p className='text-sm text-gray-600'>
            Your sessions will use this theme's colors, animations, and visual
            style.
          </p>
        </div>
      )}
    </div>
  );
}

function getThemeDescription(type: SessionTheme['type']): string {
  const descriptions = {
    strength: 'Bold reds and powerful imagery for strength training sessions',
    volleyball: 'Dynamic blues and team-focused visuals for volleyball skills',
    plyometric:
      'Energetic greens and explosive graphics for plyometric training',
    recovery: 'Calming purples and peaceful elements for recovery sessions',
  };
  return descriptions[type];
}

interface ThemeCustomizerProps {
  baseTheme: SessionTheme;

  onThemeUpdate?: (theme: SessionTheme) => void;
  className?: string;
}

export function ThemeCustomizer({
  baseTheme,
  onThemeUpdate,
  className,
}: ThemeCustomizerProps) {
  const [customTheme, setCustomTheme] = useState<SessionTheme>(baseTheme);

  const handleColorChange = (
    colorKey: keyof SessionTheme['colors'],
    value: string
  ) => {
    const updatedTheme = {
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [colorKey]: value,
      },
    };
    setCustomTheme(updatedTheme);
    onThemeUpdate?.(updatedTheme);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Customize Theme Colors
        </h3>
        <p className='text-sm text-gray-600'>
          Adjust the color palette to match your preferences.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Color Controls */}
        <div className='space-y-4'>
          <h4 className='font-medium text-gray-900'>Color Palette</h4>

          {Object.entries(customTheme.colors).map(([key, value]) => (
            <div key={key} className='flex items-center gap-3'>
              <label className='text-sm font-medium text-gray-700 w-24 capitalize'>
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </label>
              <div className='flex items-center gap-2'>
                <input
                  type='color'
                  value={value}
                  onChange={e =>
                    handleColorChange(
                      key as keyof SessionTheme['colors'],
                      e.target.value
                    )
                  }
                  className='w-8 h-8 rounded border border-gray-300 cursor-pointer'
                />
                <input
                  type='text'
                  value={value}
                  onChange={e =>
                    handleColorChange(
                      key as keyof SessionTheme['colors'],
                      e.target.value
                    )
                  }
                  className='px-2 py-1 text-sm border border-gray-300 rounded w-20'
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview */}
        <div>
          <h4 className='font-medium text-gray-900 mb-3'>Live Preview</h4>
          <ThemePreview theme={customTheme} />
        </div>
      </div>
    </div>
  );
}
