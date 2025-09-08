'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Hand,
  Touch,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface OneHandedNavigationProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onVoiceCommand?: (command: string) => void;
  onSwipeGesture?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

interface ThumbZone {
  id: string;
  name: string;
  description: string;
  position:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const thumbZones: ThumbZone[] = [
  {
    id: 'top-left',
    name: 'Top Left',
    description: 'Easy reach for left thumb',
    position: 'top-left',
    color: 'bg-green-500',
    icon: ArrowUp,
  },
  {
    id: 'top-right',
    name: 'Top Right',
    description: 'Easy reach for right thumb',
    position: 'top-right',
    color: 'bg-blue-500',
    icon: ArrowUp,
  },
  {
    id: 'bottom-left',
    name: 'Bottom Left',
    description: 'Primary thumb zone for left hand',
    position: 'bottom-left',
    color: 'bg-yellow-500',
    icon: ArrowDown,
  },
  {
    id: 'bottom-right',
    name: 'Bottom Right',
    description: 'Primary thumb zone for right hand',
    position: 'bottom-right',
    color: 'bg-red-500',
    icon: ArrowDown,
  },
  {
    id: 'center',
    name: 'Center',
    description: 'Reachable by both thumbs',
    position: 'center',
    color: 'bg-purple-500',
    icon: Touch,
  },
];

export function OneHandedNavigation({
  isEnabled,
  onToggle,
  onVoiceCommand,
  onSwipeGesture,
}: OneHandedNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [currentHand, setCurrentHand] = useState<'left' | 'right' | 'auto'>(
    'auto'
  );
  const [showThumbZones, setShowThumbZones] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = event => {
        const command = event.results[0][0].transcript.toLowerCase();
        onVoiceCommand?.(command);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onVoiceCommand]);

  const startVoiceCommand = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceCommand = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    onSwipeGesture?.(direction);
  };

  if (!isEnabled) return null;

  return (
    <div className='fixed inset-0 pointer-events-none z-40'>
      {/* Thumb Zone Indicators */}
      {showThumbZones && (
        <>
          {thumbZones.map(zone => {
            const Icon = zone.icon;
            const isActive =
              (currentHand === 'left' &&
                (zone.position.includes('left') ||
                  zone.position === 'center')) ||
              (currentHand === 'right' &&
                (zone.position.includes('right') ||
                  zone.position === 'center')) ||
              currentHand === 'auto';

            return (
              <div
                key={zone.id}
                className={`absolute ${zone.position === 'top-left' ? 'top-4 left-4' : ''} ${
                  zone.position === 'top-right' ? 'top-4 right-4' : ''
                } ${zone.position === 'bottom-left' ? 'bottom-20 left-4' : ''} ${
                  zone.position === 'bottom-right' ? 'bottom-20 right-4' : ''
                } ${zone.position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}`}
              >
                <div
                  className={`w-16 h-16 rounded-full ${zone.color} ${
                    isActive ? 'opacity-80' : 'opacity-40'
                  } flex items-center justify-center text-white shadow-lg transition-all duration-200`}
                >
                  <Icon className='h-6 w-6' />
                </div>
                <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-center text-white bg-black/50 px-2 py-1 rounded whitespace-nowrap'>
                  {zone.name}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Voice Command Button */}
      {voiceSupported && (
        <div className='fixed top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto'>
          <Button
            variant={isListening ? 'destructive' : 'default'}
            size='lg'
            onClick={isListening ? stopVoiceCommand : startVoiceCommand}
            className='rounded-full w-16 h-16 shadow-lg'
            aria-label={
              isListening ? 'Stop voice command' : 'Start voice command'
            }
          >
            {isListening ? (
              <MicOff className='h-6 w-6' />
            ) : (
              <Mic className='h-6 w-6' />
            )}
          </Button>
        </div>
      )}

      {/* Swipe Gesture Areas */}
      <div className='absolute inset-0 pointer-events-auto'>
        {/* Swipe Up Area */}
        <div
          className='absolute top-0 left-0 right-0 h-20'
          onTouchStart={e => {
            const touch = e.touches[0];
            const startY = touch.clientY;

            const handleTouchEnd = (e: TouchEvent) => {
              const touch = e.changedTouches[0];
              const endY = touch.clientY;
              const diff = startY - endY;

              if (Math.abs(diff) > 50) {
                handleSwipe('up');
              }

              document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchend', handleTouchEnd);
          }}
        />

        {/* Swipe Down Area */}
        <div
          className='absolute bottom-0 left-0 right-0 h-20'
          onTouchStart={e => {
            const touch = e.touches[0];
            const startY = touch.clientY;

            const handleTouchEnd = (e: TouchEvent) => {
              const touch = e.changedTouches[0];
              const endY = touch.clientY;
              const diff = endY - startY;

              if (Math.abs(diff) > 50) {
                handleSwipe('down');
              }

              document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchend', handleTouchEnd);
          }}
        />

        {/* Swipe Left Area */}
        <div
          className='absolute top-0 left-0 bottom-0 w-20'
          onTouchStart={e => {
            const touch = e.touches[0];
            const startX = touch.clientX;

            const handleTouchEnd = (e: TouchEvent) => {
              const touch = e.changedTouches[0];
              const endX = touch.clientX;
              const diff = startX - endX;

              if (Math.abs(diff) > 50) {
                handleSwipe('left');
              }

              document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchend', handleTouchEnd);
          }}
        />

        {/* Swipe Right Area */}
        <div
          className='absolute top-0 right-0 bottom-0 w-20'
          onTouchStart={e => {
            const touch = e.touches[0];
            const startX = touch.clientX;

            const handleTouchEnd = (e: TouchEvent) => {
              const touch = e.changedTouches[0];
              const endX = touch.clientX;
              const diff = endX - startX;

              if (Math.abs(diff) > 50) {
                handleSwipe('right');
              }

              document.removeEventListener('touchend', handleTouchEnd);
            };

            document.addEventListener('touchend', handleTouchEnd);
          }}
        />
      </div>
    </div>
  );
}

// Settings component for one-handed navigation
export function OneHandedSettings({
  isEnabled,
  onToggle,
  currentHand,
  onHandChange,
  showThumbZones,
  onToggleThumbZones,
}: {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  currentHand: 'left' | 'right' | 'auto';
  onHandChange: (hand: 'left' | 'right' | 'auto') => void;
  showThumbZones: boolean;
  onToggleThumbZones: (show: boolean) => void;
}) {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Hand className='h-5 w-5' />
          One-Handed Navigation
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-medium'>Enable One-Handed Mode</p>
            <p className='text-sm text-muted-foreground'>
              Optimize interface for single-hand use
            </p>
          </div>
          <Button
            variant={isEnabled ? 'default' : 'outline'}
            size='sm'
            onClick={() => onToggle(!isEnabled)}
          >
            {isEnabled ? 'On' : 'Off'}
          </Button>
        </div>

        {isEnabled && (
          <>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Preferred Hand</label>
              <div className='flex gap-2'>
                {[
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                  { value: 'auto', label: 'Auto' },
                ].map(option => (
                  <Button
                    key={option.value}
                    variant={
                      currentHand === option.value ? 'default' : 'outline'
                    }
                    size='sm'
                    onClick={() =>
                      onHandChange(option.value as 'left' | 'right' | 'auto')
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>Show Thumb Zones</p>
                <p className='text-sm text-muted-foreground'>
                  Visual indicators for optimal touch areas
                </p>
              </div>
              <Button
                variant={showThumbZones ? 'default' : 'outline'}
                size='sm'
                onClick={() => onToggleThumbZones(!showThumbZones)}
              >
                {showThumbZones ? 'On' : 'Off'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Hook for managing one-handed navigation
export function useOneHandedNavigation() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentHand, setCurrentHand] = useState<'left' | 'right' | 'auto'>(
    'auto'
  );
  const [showThumbZones, setShowThumbZones] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('one-handed-navigation');
    if (saved) {
      const settings = JSON.parse(saved);
      setIsEnabled(settings.isEnabled || false);
      setCurrentHand(settings.currentHand || 'auto');
      setShowThumbZones(settings.showThumbZones || false);
    }
  }, []);

  const updateSettings = (
    newSettings: Partial<{
      isEnabled: boolean;
      currentHand: 'left' | 'right' | 'auto';
      showThumbZones: boolean;
    }>
  ) => {
    const settings = {
      isEnabled,
      currentHand,
      showThumbZones,
      ...newSettings,
    };

    localStorage.setItem('one-handed-navigation', JSON.stringify(settings));

    if (newSettings.isEnabled !== undefined)
      setIsEnabled(newSettings.isEnabled);
    if (newSettings.currentHand !== undefined)
      setCurrentHand(newSettings.currentHand);
    if (newSettings.showThumbZones !== undefined)
      setShowThumbZones(newSettings.showThumbZones);
  };

  return {
    isEnabled,
    currentHand,
    showThumbZones,
    updateSettings,
  };
}
