'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MousePointer,
  RotateCcw,
} from 'lucide-react';

interface GestureGuidanceProps {
  onComplete?: () => void;
  showOnFirstVisit?: boolean;
}

interface Gesture {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  animation: string;
  example: string;
}

const gestures: Gesture[] = [
  {
    id: 'swipe-up',
    name: 'Swipe Up',
    description:
      'Swipe up to access secondary navigation and advanced features',
    icon: ArrowUp,
    animation: 'animate-bounce',
    example: 'Try swiping up on the dashboard to see more options',
  },
  {
    id: 'swipe-down',
    name: 'Swipe Down',
    description: 'Swipe down to refresh data and sync with server',
    icon: ArrowDown,
    animation: 'animate-pulse',
    example: 'Pull down to refresh your progress data',
  },
  {
    id: 'swipe-left',
    name: 'Swipe Left',
    description: 'Swipe left to navigate between tabs quickly',
    icon: ArrowLeft,
    animation: 'animate-ping',
    example: 'Swipe left to move to the next section',
  },
  {
    id: 'swipe-right',
    name: 'Swipe Right',
    description: 'Swipe right to go back or access previous content',
    icon: ArrowRight,
    animation: 'animate-ping',
    example: 'Swipe right to return to previous view',
  },
  {
    id: 'tap',
    name: 'Tap',
    description: 'Tap to select, activate, or interact with elements',
    icon: MousePointer,
    animation: 'animate-pulse',
    example: 'Tap buttons and cards to interact with them',
  },
  {
    id: 'long-press',
    name: 'Long Press',
    description: 'Long press for additional options and context menus',
    icon: RotateCcw,
    animation: 'animate-spin',
    example: 'Hold down on items for more options',
  },
];

export function MobileGestureGuidance({
  onComplete,
  showOnFirstVisit = true,
}: GestureGuidanceProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentGesture, setCurrentGesture] = useState(0);
  const [completedGestures, setCompletedGestures] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    // Check if user has seen gesture guidance before
    const hasSeenGuidance = localStorage.getItem('gesture-guidance-seen');
    if (showOnFirstVisit && !hasSeenGuidance) {
      setIsVisible(true);
    }
  }, [showOnFirstVisit]);

  const handleGestureComplete = (gestureId: string) => {
    setCompletedGestures(prev => new Set([...prev, gestureId]));

    // Move to next gesture or complete tutorial
    if (currentGesture < gestures.length - 1) {
      setCurrentGesture(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('gesture-guidance-seen', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const currentGestureData = gestures[currentGesture];
  const Icon = currentGestureData.icon;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <Card className='w-full max-w-md mx-auto'>
        <CardHeader className='text-center pb-4'>
          <div className='flex justify-between items-start mb-4'>
            <Badge variant='outline' className='text-xs'>
              {currentGesture + 1} of {gestures.length}
            </Badge>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleSkip}
              className='h-8 w-8 p-0'
              aria-label='Skip gesture tutorial'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          <CardTitle className='text-xl font-bold'>Mobile Gestures</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Learn how to navigate efficiently on mobile
          </p>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Gesture Demo */}
          <div className='text-center space-y-4'>
            <div className='relative'>
              <div className='w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center'>
                <Icon
                  className={`h-10 w-10 text-primary ${currentGestureData.animation}`}
                />
              </div>
              <div className='absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold'>
                {currentGesture + 1}
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold mb-2'>
                {currentGestureData.name}
              </h3>
              <p className='text-sm text-muted-foreground mb-3'>
                {currentGestureData.description}
              </p>
              <p className='text-xs text-muted-foreground italic'>
                {currentGestureData.example}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className='flex justify-center space-x-2'>
            {gestures.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentGesture
                    ? 'bg-primary w-6'
                    : index < currentGesture
                      ? 'bg-primary/50'
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            <Button variant='outline' onClick={handleSkip} className='flex-1'>
              Skip Tutorial
            </Button>
            <Button
              onClick={() => handleGestureComplete(currentGestureData.id)}
              className='flex-1'
            >
              {currentGesture === gestures.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Gesture hint component for ongoing guidance
export function GestureHint({
  gesture,
  isVisible,
  onDismiss,
}: {
  gesture: string;
  isVisible: boolean;
  onDismiss: () => void;
}) {
  if (!isVisible) return null;

  const gestureData = gestures.find(g => g.id === gesture);
  if (!gestureData) return null;

  const Icon = gestureData.icon;

  return (
    <div className='fixed bottom-20 left-4 right-4 z-40 animate-in slide-in-from-bottom-2'>
      <Card className='bg-primary text-primary-foreground border-primary/20'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-3'>
            <Icon className='h-5 w-5 animate-pulse' />
            <div className='flex-1'>
              <p className='text-sm font-medium'>{gestureData.name}</p>
              <p className='text-xs opacity-90'>{gestureData.example}</p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={onDismiss}
              className='h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing gesture hints
export function useGestureHints() {
  const [activeHints, setActiveHints] = useState<Set<string>>(new Set());

  const showHint = (gesture: string) => {
    setActiveHints(prev => new Set([...prev, gesture]));
  };

  const hideHint = (gesture: string) => {
    setActiveHints(prev => {
      const newSet = new Set(prev);
      newSet.delete(gesture);
      return newSet;
    });
  };

  const hideAllHints = () => {
    setActiveHints(new Set());
  };

  return {
    activeHints,
    showHint,
    hideHint,
    hideAllHints,
  };
}
