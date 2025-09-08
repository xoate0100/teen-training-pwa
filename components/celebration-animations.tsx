'use client';

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AccessibleIcon } from '@/components/accessible-icons';
import { AnimatedIcon } from '@/components/animated-icons';

// Celebration animation types
export const celebrationTypes = {
  'exercise-complete': {
    icon: 'session',
    message: 'Great job! Exercise completed!',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    confetti: true,
  },
  'session-complete': {
    icon: 'achievements',
    message: 'Amazing! Session completed!',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    confetti: true,
  },
  'goal-achieved': {
    icon: 'goals',
    message: 'Congratulations! Goal achieved!',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    confetti: true,
  },
  'streak-milestone': {
    icon: 'achievements',
    message: 'Incredible! Streak milestone reached!',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    confetti: true,
  },
  'achievement-unlocked': {
    icon: 'achievements',
    message: 'Achievement unlocked!',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    confetti: true,
  },
  'personal-best': {
    icon: 'progress',
    message: 'New personal best!',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    confetti: true,
  },
} as const;

// Motivational quote backgrounds
export const motivationalQuotes = [
  {
    text: 'Every expert was once a beginner.',
    author: 'Helen Hayes',
    color: 'from-blue-400 to-purple-500',
  },
  {
    text: 'The only impossible journey is the one you never begin.',
    author: 'Tony Robbins',
    color: 'from-green-400 to-blue-500',
  },
  {
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    color: 'from-purple-400 to-pink-500',
  },
  {
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    color: 'from-pink-400 to-red-500',
  },
  {
    text: 'It is during our darkest moments that we must focus to see the light.',
    author: 'Aristotle',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    color: 'from-indigo-400 to-purple-500',
  },
] as const;

// Confetti Particle Component
interface ConfettiParticleProps {
  delay: number;
  duration: number;
  color: string;
  size: number;
  x: number;
  y: number;
}

function ConfettiParticle({
  delay,
  duration,
  color,
  size,
  x,
  y,
}: ConfettiParticleProps) {
  return (
    <div
      className='absolute rounded-full animate-bounce'
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    />
  );
}

// Confetti Animation Component
interface ConfettiAnimationProps {
  show: boolean;
  onComplete?: () => void;
  className?: string;
}

export function ConfettiAnimation({
  show,
  onComplete,
  className,
}: ConfettiAnimationProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      delay: number;
      duration: number;
      color: string;
      size: number;
      x: number;
      y: number;
    }>
  >([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        delay: Math.random() * 500,
        duration: 2000 + Math.random() * 1000,
        color: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#06b6d4',
          '#8b5cf6',
          '#ec4899',
        ][Math.floor(Math.random() * 7)],
        size: 4 + Math.random() * 8,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden',
        className
      )}
    >
      {particles.map(particle => (
        <ConfettiParticle
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          color={particle.color}
          size={particle.size}
          x={particle.x}
          y={particle.y}
        />
      ))}
    </div>
  );
}

// Celebration Modal Component
interface CelebrationModalProps {
  type: keyof typeof celebrationTypes;
  show: boolean;
  onClose?: () => void;
  className?: string;
  showConfetti?: boolean;
  customMessage?: string;
}

export function CelebrationModal({
  type,
  show,
  onClose,
  className,
  showConfetti = true,
  customMessage,
}: CelebrationModalProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);
  const config = celebrationTypes[type];

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300',
          isAnimating ? 'scale-110' : 'scale-100',
          className
        )}
      >
        {/* Confetti */}
        {showConfetti && (
          <ConfettiAnimation
            show={isAnimating}
            onComplete={() => setIsAnimating(false)}
          />
        )}

        {/* Content */}
        <div className='text-center'>
          <div className='mb-6'>
            <AnimatedIcon
              name={
                config.icon as keyof typeof import('@/components/svg-icons').iconRegistry
              }
              size='3xl'
              state='success'
              variant='default'
              highContrast={true}
            />
          </div>

          <h2 className={cn('text-2xl font-bold mb-2', config.color)}>
            {customMessage || config.message}
          </h2>

          <p className='text-muted-foreground mb-6'>
            Keep up the great work! You're making amazing progress.
          </p>

          <button
            onClick={handleClose}
            className='px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors'
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Progress Milestone Animation Component
interface ProgressMilestoneAnimationProps {
  milestone: string;
  progress: number;
  show: boolean;
  onComplete?: () => void;
  className?: string;
}

export function ProgressMilestoneAnimation({
  milestone,
  progress,
  show,
  onComplete,
  className,
}: ProgressMilestoneAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg transform transition-all duration-500',
          isAnimating ? 'scale-105 rotate-1' : 'scale-100 rotate-0'
        )}
      >
        <div className='flex items-center gap-3'>
          <AnimatedIcon
            name='progress'
            size='lg'
            state='success'
            variant='default'
            highContrast={true}
          />

          <div>
            <h3 className='font-bold text-lg'>{milestone}</h3>
            <p className='text-sm opacity-90'>{progress}% Complete</p>
          </div>
        </div>

        <div className='mt-3 bg-white/20 rounded-full h-2'>
          <div
            className='bg-white rounded-full h-2 transition-all duration-1000'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Motivational Quote Background Component
interface MotivationalQuoteBackgroundProps {
  children: ReactNode;
  quoteIndex?: number;
  className?: string;
}

export function MotivationalQuoteBackground({
  children,
  quoteIndex = 0,
  className,
}: MotivationalQuoteBackgroundProps) {
  const [currentQuote, setCurrentQuote] = useState(quoteIndex);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % motivationalQuotes.length);
    }, 10000); // Change quote every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const quote = motivationalQuotes[currentQuote];

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br transition-all duration-1000',
          `from-${quote.color.split('-')[0]}-${quote.color.split('-')[1]} to-${quote.color.split('-')[3]}-${quote.color.split('-')[4]}`
        )}
      />

      {/* Quote overlay */}
      <div className='absolute inset-0 bg-black/20 flex items-center justify-center p-8'>
        <div className='text-center text-white'>
          <blockquote className='text-xl font-semibold mb-2'>
            "{quote.text}"
          </blockquote>
          <cite className='text-sm opacity-80'>— {quote.author}</cite>
        </div>
      </div>

      {/* Content */}
      <div className='relative z-10'>{children}</div>
    </div>
  );
}

// Celebration System Hook
export function useCelebrationSystem() {
  const [activeCelebrations, setActiveCelebrations] = useState<Set<string>>(
    new Set()
  );

  const triggerCelebration = (type: keyof typeof celebrationTypes) => {
    setActiveCelebrations(prev => new Set(prev.add(type)));

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setActiveCelebrations(prev => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
    }, 3000);
  };

  const isCelebrating = (type: keyof typeof celebrationTypes) => {
    return activeCelebrations.has(type);
  };

  const clearCelebrations = () => {
    setActiveCelebrations(new Set());
  };

  return {
    triggerCelebration,
    isCelebrating,
    clearCelebrations,
    activeCelebrations,
  };
}
