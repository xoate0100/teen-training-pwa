'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  HelpCircle,
  Info,
  Lightbulb,
  BookOpen,
  Play,
  X,
  CheckCircle,
} from 'lucide-react';

// Expandable Section Component
interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  variant?: 'default' | 'card' | 'minimal';
  icon?: ReactNode;
  badge?: string;
  onToggle?: (expanded: boolean) => void;
}

export function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  className,
  variant = 'default',
  icon,
  badge,
  onToggle,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const variants = {
    default: 'border border-border rounded-lg',
    card: 'bg-card border border-border rounded-lg shadow-sm',
    minimal: 'border-b border-border',
  };

  return (
    <div className={cn(variants[variant], className)}>
      <Button
        variant='ghost'
        onClick={handleToggle}
        className={cn(
          'w-full justify-between p-4 h-auto',
          variant === 'minimal' && 'px-0 py-2'
        )}
        aria-expanded={isExpanded}
        aria-controls={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className='flex items-center gap-2'>
          {icon}
          <span className='font-medium'>{title}</span>
          {badge && (
            <Badge variant='secondary' className='ml-2'>
              {badge}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className='h-4 w-4' />
        ) : (
          <ChevronRight className='h-4 w-4' />
        )}
      </Button>

      <div
        id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className={cn('p-4', variant === 'minimal' && 'px-0 pb-2')}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Collapsible Settings Component
interface CollapsibleSettingsProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  level?: 'basic' | 'intermediate' | 'advanced';
  onToggle?: (expanded: boolean) => void;
}

export function CollapsibleSettings({
  title,
  description,
  children,
  defaultExpanded = false,
  className,
  level = 'basic',
  onToggle,
}: CollapsibleSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const levelColors = {
    basic: 'text-green-600 bg-green-50 border-green-200',
    intermediate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    advanced: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <CardTitle className='text-lg'>{title}</CardTitle>
            <Badge
              variant='outline'
              className={cn('text-xs', levelColors[level])}
            >
              {level}
            </Badge>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleToggle}
            className='h-8 w-8 p-0'
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
        </div>
        {description && (
          <p className='text-sm text-muted-foreground mt-1'>{description}</p>
        )}
      </CardHeader>

      <CardContent
        className={cn(
          'pt-0 transition-all duration-300 ease-in-out',
          isExpanded
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}

// Contextual Help Component
interface ContextualHelpProps {
  content: string;
  title?: string;
  variant?: 'info' | 'tip' | 'warning' | 'error';
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  children: ReactNode;
  className?: string;
}

export function ContextualHelp({
  content,
  title,
  variant = 'info',
  position = 'top',
  trigger = 'hover',
  children,
  className,
}: ContextualHelpProps) {
  const [isVisible, setIsVisible] = useState(false);

  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    tip: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: Info,
    tip: Lightbulb,
    warning: HelpCircle,
    error: HelpCircle,
  };

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const Icon = icons[variant];

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        onMouseEnter={
          trigger === 'hover' ? () => setIsVisible(true) : undefined
        }
        onMouseLeave={
          trigger === 'hover' ? () => setIsVisible(false) : undefined
        }
        onClick={
          trigger === 'click' ? () => setIsVisible(!isVisible) : undefined
        }
        className='cursor-help'
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={cn(
            'absolute z-50 w-64 p-3 rounded-lg border shadow-lg',
            variants[variant],
            positions[position]
          )}
        >
          <div className='flex items-start gap-2'>
            <Icon className='h-4 w-4 mt-0.5 flex-shrink-0' />
            <div>
              {title && <h4 className='font-semibold text-sm mb-1'>{title}</h4>}
              <p className='text-sm leading-relaxed'>{content}</p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsVisible(false)}
              className='h-6 w-6 p-0 ml-auto flex-shrink-0'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Guided Tour Component
interface GuidedTourProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  className?: string;
}

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'none';
}

export function GuidedTour({
  steps,
  isActive,
  onComplete,
  onSkip,
  className,
}: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!isActive || !currentStepData) return null;

  return (
    <div className={cn('fixed inset-0 z-50', className)}>
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/50' />

      {/* Tour Content */}
      <div className='relative z-10 flex items-center justify-center min-h-screen p-4'>
        <Card className='w-full max-w-md bg-background shadow-2xl'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>{currentStepData.title}</CardTitle>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleSkip}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>{currentStepData.content}</p>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-muted-foreground'>
                  Step {currentStep + 1} of {steps.length}
                </span>
                <div className='flex gap-1'>
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        'h-2 w-2 rounded-full',
                        index === currentStep ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className='flex gap-2'>
                {currentStep > 0 && (
                  <Button variant='outline' size='sm' onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
                <Button
                  size='sm'
                  onClick={handleNext}
                  className='flex items-center gap-2'
                >
                  {isLastStep ? (
                    <>
                      <CheckCircle className='h-4 w-4' />
                      Complete
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className='h-4 w-4' />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Progressive Disclosure Hook
export function useProgressiveDisclosure() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [activeTour, setActiveTour] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const startTour = (tourId: string) => {
    setActiveTour(tourId);
  };

  const endTour = () => {
    setActiveTour(null);
  };

  const isSectionExpanded = (sectionId: string) => {
    return expandedSections.has(sectionId);
  };

  const isTourActive = (tourId: string) => {
    return activeTour === tourId;
  };

  return {
    expandedSections,
    activeTour,
    toggleSection,
    startTour,
    endTour,
    isSectionExpanded,
    isTourActive,
  };
}

// Help System Component
interface HelpSystemProps {
  children: ReactNode;
  className?: string;
}

export function HelpSystem({ children, className }: HelpSystemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className='h-8 w-8 p-0'
        aria-label='Help'
      >
        <HelpCircle className='h-4 w-4' />
      </Button>

      {isOpen && (
        <Card className='absolute top-full right-0 mt-2 w-80 z-50'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg flex items-center gap-2'>
                <BookOpen className='h-5 w-5' />
                Help & Support
              </CardTitle>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsOpen(false)}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </CardHeader>

          <CardContent>{children}</CardContent>
        </Card>
      )}
    </div>
  );
}
