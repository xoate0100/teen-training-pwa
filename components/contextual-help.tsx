'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  HelpCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  BookOpen,
  Target,
  Zap,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpStep {
  id: string;
  title: string;
  description: string;
  content: string;
  target?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    type: 'click' | 'hover' | 'focus' | 'scroll';
    target: string;
    description: string;
  };
  tips?: string[];
  next?: string;
  previous?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: HelpStep[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  prerequisites?: string[];
}

interface ContextualHelpProps {
  userId: string;
  currentPage: string;
  className?: string;
}

const tutorials: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of the Teen Training app',
    category: 'onboarding',
    difficulty: 'beginner',
    estimatedTime: 5,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Teen Training!',
        description: 'Let\'s take a quick tour of the app',
        content: 'This app is designed specifically for teen athletes to track their training progress and achieve their goals.',
        tips: ['Take your time with each step', 'You can always restart the tutorial'],
      },
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        description: 'Understanding your main dashboard',
        content: 'The dashboard shows your current progress, upcoming sessions, and quick access to key features.',
        target: '[data-tour="dashboard"]',
        position: 'bottom',
        tips: ['Check your daily progress here', 'Use the quick action buttons for common tasks'],
      },
      {
        id: 'start-session',
        title: 'Starting a Session',
        description: 'How to begin your training',
        content: 'Click the "Start Session" button to begin your workout. The app will guide you through each exercise.',
        target: '[data-tour="start-session"]',
        position: 'top',
        action: {
          type: 'click',
          target: '[data-tour="start-session"]',
          description: 'Click here to start your first session',
        },
        tips: ['Make sure you have enough space', 'Have your equipment ready'],
      },
      {
        id: 'progress-tracking',
        title: 'Tracking Progress',
        description: 'Monitor your improvement over time',
        content: 'View your progress in the Progress tab. You can see charts, achievements, and goal completion.',
        target: '[data-tour="progress-tab"]',
        position: 'right',
        tips: ['Check your progress regularly', 'Celebrate your achievements'],
      },
    ],
  },
  {
    id: 'settings-mastery',
    title: 'Settings Mastery',
    description: 'Master all the settings and customization options',
    category: 'settings',
    difficulty: 'intermediate',
    estimatedTime: 8,
    steps: [
      {
        id: 'settings-overview',
        title: 'Settings Overview',
        description: 'Navigate the settings page',
        content: 'The settings page is organized into categories. Use the search function to quickly find what you need.',
        target: '[data-tour="settings-search"]',
        position: 'bottom',
        tips: ['Use the search bar to find settings quickly', 'Each category has related settings grouped together'],
      },
      {
        id: 'theme-customization',
        title: 'Theme Customization',
        description: 'Customize the app appearance',
        content: 'Choose from different themes or let the app adapt based on your mood and training phase.',
        target: '[data-tour="theme-selector"]',
        position: 'top',
        tips: ['Try different themes to see what you prefer', 'Auto theme adapts to your training phase'],
      },
      {
        id: 'notification-setup',
        title: 'Notification Setup',
        description: 'Configure your notifications',
        content: 'Set up notifications to remind you of training sessions and celebrate achievements.',
        target: '[data-tour="notification-settings"]',
        position: 'right',
        tips: ['Enable push notifications for best experience', 'Customize notification timing'],
      },
    ],
  },
  {
    id: 'advanced-features',
    title: 'Advanced Features',
    description: 'Explore advanced features and optimizations',
    category: 'advanced',
    difficulty: 'advanced',
    estimatedTime: 12,
    steps: [
      {
        id: 'one-handed-mode',
        title: 'One-Handed Mode',
        description: 'Optimize for one-handed use',
        content: 'Enable one-handed mode for easier navigation during workouts when you need to hold equipment.',
        target: '[data-tour="one-handed-settings"]',
        position: 'left',
        tips: ['Great for when you\'re holding weights', 'Swipe gestures make navigation easier'],
      },
      {
        id: 'voice-commands',
        title: 'Voice Commands',
        description: 'Use voice commands for hands-free operation',
        content: 'Enable voice commands to control the app without touching the screen during workouts.',
        target: '[data-tour="voice-settings"]',
        position: 'top',
        tips: ['Speak clearly and wait for confirmation', 'Use simple commands like "start session"'],
      },
      {
        id: 'smart-recommendations',
        title: 'Smart Recommendations',
        description: 'AI-powered personalization',
        content: 'The app learns from your usage patterns to provide personalized recommendations and optimizations.',
        target: '[data-tour="smart-defaults"]',
        position: 'bottom',
        tips: ['Allow behavior tracking for better recommendations', 'Review recommendations regularly'],
      },
    ],
  },
];

export function ContextualHelp({ userId, currentPage, className }: ContextualHelpProps) {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [showTutorials, setShowTutorials] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Load completed tutorials from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`completed_tutorials_${userId}`);
    if (saved) {
      setCompletedTutorials(JSON.parse(saved));
    }
  }, [userId]);

  // Save completed tutorials
  const saveCompletedTutorial = (tutorialId: string) => {
    const newCompleted = [...completedTutorials, tutorialId];
    setCompletedTutorials(newCompleted);
    localStorage.setItem(`completed_tutorials_${userId}`, JSON.stringify(newCompleted));
  };

  // Start tutorial
  const startTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    highlightElement(tutorial.steps[0]);
  };

  // Highlight element
  const highlightElement = (step: HelpStep) => {
    if (step.target) {
      const element = document.querySelector(step.target) as HTMLElement;
      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Next step
  const nextStep = () => {
    if (!activeTutorial) return;
    
    const nextStepId = activeTutorial.steps[currentStepIndex].next;
    if (nextStepId) {
      const nextIndex = activeTutorial.steps.findIndex(s => s.id === nextStepId);
      if (nextIndex !== -1) {
        setCurrentStepIndex(nextIndex);
        highlightElement(activeTutorial.steps[nextIndex]);
      }
    } else if (currentStepIndex < activeTutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      highlightElement(activeTutorial.steps[currentStepIndex + 1]);
    } else {
      // Tutorial completed
      saveCompletedTutorial(activeTutorial.id);
      setIsPlaying(false);
      setActiveTutorial(null);
      setCurrentStepIndex(0);
    }
  };

  // Previous step
  const previousStep = () => {
    if (!activeTutorial) return;
    
    const previousStepId = activeTutorial.steps[currentStepIndex].previous;
    if (previousStepId) {
      const prevIndex = activeTutorial.steps.findIndex(s => s.id === previousStepId);
      if (prevIndex !== -1) {
        setCurrentStepIndex(prevIndex);
        highlightElement(activeTutorial.steps[prevIndex]);
      }
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      highlightElement(activeTutorial.steps[currentStepIndex - 1]);
    }
  };

  // Stop tutorial
  const stopTutorial = () => {
    setIsPlaying(false);
    setActiveTutorial(null);
    setCurrentStepIndex(0);
    setHighlightedElement(null);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'onboarding': return <Play className='h-4 w-4' />;
      case 'settings': return <Target className='h-4 w-4' />;
      case 'advanced': return <Zap className='h-4 w-4' />;
      default: return <BookOpen className='h-4 w-4' />;
    }
  };

  const currentStep = activeTutorial?.steps[currentStepIndex];
  const progress = activeTutorial ? ((currentStepIndex + 1) / activeTutorial.steps.length) * 100 : 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Tutorial Overlay */}
      {isPlaying && activeTutorial && currentStep && (
        <div className='fixed inset-0 z-50 pointer-events-none'>
          {/* Backdrop */}
          <div className='absolute inset-0 bg-black/20' />
          
          {/* Highlighted Element */}
          {highlightedElement && (
            <div
              className='absolute border-2 border-blue-500 rounded-lg shadow-lg pointer-events-none'
              style={{
                top: highlightedElement.offsetTop - 4,
                left: highlightedElement.offsetLeft - 4,
                width: highlightedElement.offsetWidth + 8,
                height: highlightedElement.offsetHeight + 8,
              }}
            />
          )}
          
          {/* Tooltip */}
          <div
            className='absolute bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm pointer-events-auto'
            style={{
              top: highlightedElement ? highlightedElement.offsetTop + highlightedElement.offsetHeight + 10 : '50%',
              left: highlightedElement ? highlightedElement.offsetLeft : '50%',
              transform: highlightedElement ? 'none' : 'translate(-50%, -50%)',
            }}
          >
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='font-medium'>{currentStep.title}</h3>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={stopTutorial}
                  className='h-6 w-6 p-0'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
              
              <p className='text-sm text-muted-foreground'>{currentStep.content}</p>
              
              {currentStep.tips && currentStep.tips.length > 0 && (
                <div className='space-y-1'>
                  <h4 className='text-xs font-medium text-muted-foreground'>Tips:</h4>
                  <ul className='text-xs text-muted-foreground space-y-1'>
                    {currentStep.tips.map((tip, index) => (
                      <li key={index} className='flex items-start gap-1'>
                        <span className='text-blue-500 mt-0.5'>•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className='flex items-center justify-between pt-2'>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={previousStep}
                    disabled={currentStepIndex === 0}
                  >
                    <ArrowLeft className='h-3 w-3' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={nextStep}
                  >
                    <ArrowRight className='h-3 w-3' />
                  </Button>
                </div>
                
                <div className='text-xs text-muted-foreground'>
                  {currentStepIndex + 1} of {activeTutorial.steps.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial List */}
      <Dialog open={showTutorials} onOpenChange={setShowTutorials}>
        <DialogTrigger asChild>
          <Button variant='outline' className='w-full'>
            <BookOpen className='h-4 w-4 mr-2' />
            Interactive Tutorials
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Lightbulb className='h-5 w-5' />
              Interactive Tutorials
            </DialogTitle>
            <DialogDescription>
              Learn how to use the app with step-by-step guided tours
            </DialogDescription>
          </DialogHeader>
          
          <div className='space-y-4'>
            {tutorials.map(tutorial => (
              <Card key={tutorial.id} className='cursor-pointer hover:bg-muted/50 transition-colors'>
                <CardContent className='p-4'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-2 flex-1'>
                      <div className='flex items-center gap-2'>
                        {getCategoryIcon(tutorial.category)}
                        <h3 className='font-medium'>{tutorial.title}</h3>
                        {completedTutorials.includes(tutorial.id) && (
                          <CheckCircle className='h-4 w-4 text-green-600' />
                        )}
                      </div>
                      <p className='text-sm text-muted-foreground'>{tutorial.description}</p>
                      <div className='flex items-center gap-2'>
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {tutorial.difficulty}
                        </Badge>
                        <span className='text-xs text-muted-foreground'>
                          {tutorial.estimatedTime} min
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {tutorial.steps.length} steps
                        </span>
                      </div>
                    </div>
                    <Button
                      size='sm'
                      onClick={() => {
                        setShowTutorials(false);
                        startTutorial(tutorial);
                      }}
                    >
                      <Play className='h-3 w-3 mr-1' />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Help Tooltips */}
      <div className='space-y-2'>
        <h4 className='text-sm font-medium'>Quick Help</h4>
        <div className='grid grid-cols-2 gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size='sm' className='justify-start'>
                  <HelpCircle className='h-3 w-3 mr-2' />
                  How to start a session
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click the "Start Session" button on the dashboard to begin your workout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size='sm' className='justify-start'>
                  <HelpCircle className='h-3 w-3 mr-2' />
                  Settings overview
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use the search bar to quickly find settings, or browse by category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size='sm' className='justify-start'>
                  <HelpCircle className='h-3 w-3 mr-2' />
                  Progress tracking
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View your progress in the Progress tab to see charts and achievements</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size='sm' className='justify-start'>
                  <HelpCircle className='h-3 w-3 mr-2' />
                  Mobile gestures
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Swipe up from bottom for quick actions, swipe left/right to navigate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
