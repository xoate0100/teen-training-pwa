'use client';

import React, { useState } from 'react';
import {
  SessionThemeService,
  SessionTheme,
} from '@/lib/services/session-theme-service';
import { ThemedSessionCard } from './themed-session-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SessionTypeShowcaseProps {
  className?: string;
  /* eslint-disable-next-line no-unused-vars */
  onSessionSelect?: (sessionType: SessionTheme['type']) => void;
}

export function SessionTypeShowcase({
  className,
  onSessionSelect,
}: SessionTypeShowcaseProps) {
  const [selectedType, setSelectedType] = useState<SessionTheme['type'] | null>(
    null
  );

  const sessionTypes = [
    {
      type: 'strength' as const,
      title: 'Strength Training',
      description:
        'Build power and muscle with progressive resistance training',
      duration: '45-60 min',
      difficulty: 'intermediate' as const,
      features: [
        'Progressive overload',
        'Compound movements',
        'Strength building',
      ],
      benefits: [
        'Increased muscle mass',
        'Improved bone density',
        'Enhanced metabolism',
      ],
    },
    {
      type: 'volleyball' as const,
      title: 'Volleyball Skills',
      description:
        'Master volleyball techniques and improve your game performance',
      duration: '30-45 min',
      difficulty: 'beginner' as const,
      features: [
        'Serving practice',
        'Spiking technique',
        'Defensive positioning',
      ],
      benefits: ['Better coordination', 'Improved reflexes', 'Team skills'],
    },
    {
      type: 'plyometric' as const,
      title: 'Plyometric Training',
      description: 'Explosive power development through dynamic movements',
      duration: '20-30 min',
      difficulty: 'advanced' as const,
      features: ['Jump training', 'Explosive movements', 'Power development'],
      benefits: ['Increased power', 'Better athleticism', 'Improved speed'],
    },
    {
      type: 'recovery' as const,
      title: 'Recovery Session',
      description: 'Restore and rejuvenate with gentle recovery exercises',
      duration: '15-30 min',
      difficulty: 'beginner' as const,
      features: ['Stretching', 'Breathing exercises', 'Mobility work'],
      benefits: ['Reduced soreness', 'Better flexibility', 'Stress relief'],
    },
  ];

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          Choose Your Training Style
        </h2>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Each session type has its own unique visual identity and training
          approach. Select the one that matches your goals and preferences.
        </p>
      </div>

      {/* Session Type Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {sessionTypes.map(session => {
          const theme = SessionThemeService.getTheme(session.type);
          const isSelected = selectedType === session.type;

          return (
            <Card
              key={session.type}
              className={cn(
                'cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl',
                isSelected && 'ring-2 ring-blue-500 shadow-lg',
                'group overflow-hidden'
              )}
              onClick={() => {
                setSelectedType(session.type);
                onSessionSelect?.(session.type);
              }}
            >
              {/* Theme Preview Header */}
              <div
                className={cn(
                  'h-24 relative overflow-hidden',
                  `bg-gradient-to-br ${theme.gradients.background}`
                )}
              >
                <div className='absolute inset-0 bg-black/20' />
                <div className='relative h-full flex items-center justify-center'>
                  <div className='text-4xl group-hover:scale-110 transition-transform duration-300'>
                    {theme.icons.main}
                  </div>
                </div>
                <div className='absolute top-2 right-2'>
                  <Badge className='bg-white/20 text-white border-white/30'>
                    {session.difficulty}
                  </Badge>
                </div>
              </div>

              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>{session.title}</CardTitle>
                <p className='text-sm text-gray-600'>{session.description}</p>
              </CardHeader>

              <CardContent className='pt-0'>
                {/* Features */}
                <div className='mb-4'>
                  <h4 className='text-sm font-semibold text-gray-900 mb-2'>
                    Key Features:
                  </h4>
                  <ul className='text-xs text-gray-600 space-y-1'>
                    {session.features.map((feature, index) => (
                      <li key={index} className='flex items-center gap-1'>
                        <span className='text-green-500'>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Duration */}
                <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                  <span>⏱️ {session.duration}</span>
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-xs',
                      theme.colors.primary,
                      'text-white'
                    )}
                  >
                    {theme.name}
                  </span>
                </div>

                {/* Action Button */}
                <Button
                  className={cn(
                    'w-full',
                    SessionThemeService.generateThemeClasses(theme, 'button'),
                    'group-hover:scale-105 transition-transform duration-300'
                  )}
                >
                  {isSelected ? 'Selected' : 'Choose This Style'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Type Details */}
      {selectedType && (
        <div className='mt-8'>
          <SessionTypeDetails
            sessionType={selectedType}
            onClose={() => setSelectedType(null)}
          />
        </div>
      )}
    </div>
  );
}

interface SessionTypeDetailsProps {
  sessionType: SessionTheme['type'];
  onClose?: () => void;
}

function SessionTypeDetails({ sessionType, onClose }: SessionTypeDetailsProps) {
  const theme = SessionThemeService.getTheme(sessionType);

  const sessionData = {
    strength: {
      title: 'Strength Training Session',
      description:
        'Build power and muscle with progressive resistance training designed for teen athletes.',
      duration: '45-60 min',
      difficulty: 'intermediate' as const,
      isCompleted: false,
      isLocked: false,
    },
    volleyball: {
      title: 'Volleyball Skills Practice',
      description:
        'Master volleyball techniques and improve your game performance with focused drills.',
      duration: '30-45 min',
      difficulty: 'beginner' as const,
      isCompleted: false,
      isLocked: false,
    },
    plyometric: {
      title: 'Plyometric Power Training',
      description:
        'Develop explosive power through dynamic movements and jump training.',
      duration: '20-30 min',
      difficulty: 'advanced' as const,
      isCompleted: false,
      isLocked: false,
    },
    recovery: {
      title: 'Recovery & Restoration',
      description:
        'Restore and rejuvenate with gentle recovery exercises and mobility work.',
      duration: '15-30 min',
      difficulty: 'beginner' as const,
      isCompleted: false,
      isLocked: false,
    },
  };

  const currentSession = sessionData[sessionType];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-bold text-gray-900'>
          {theme.name} Theme Preview
        </h3>
        {onClose && (
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Themed Session Card Preview */}
      <div className='max-w-md'>
        <ThemedSessionCard
          sessionType={sessionType}
          title={currentSession.title}
          description={currentSession.description}
          duration={currentSession.duration}
          difficulty={currentSession.difficulty}
          isCompleted={currentSession.isCompleted}
          isLocked={currentSession.isLocked}
          onStart={() => console.log('Start session')}
          onViewDetails={() => console.log('View details')}
        />
      </div>

      {/* Theme Information */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Theme Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key} className='flex items-center gap-3'>
                  <div
                    className='w-6 h-6 rounded border border-gray-300'
                    style={{ backgroundColor: value }}
                  />
                  <span className='text-sm font-medium capitalize'>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className='text-xs text-gray-500 font-mono'>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Visual Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <span className='text-2xl'>{theme.icons.main}</span>
                <span className='text-sm'>Main Icon</span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-xl'>{theme.icons.secondary}</span>
                <span className='text-sm'>Secondary Icon</span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-2xl opacity-50'>
                  {theme.icons.background}
                </span>
                <span className='text-sm'>Background Element</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
