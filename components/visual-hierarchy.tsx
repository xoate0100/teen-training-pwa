'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VisualWeightProps {
  children: ReactNode;
  weight: 'primary' | 'secondary' | 'tertiary' | 'settings';
  className?: string;
}

const weightClasses = {
  primary: {
    container: 'relative z-10',
    visual:
      'shadow-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5',
    text: 'text-primary font-bold',
    size: 'text-lg',
    spacing: 'p-6 m-2',
    animation: 'hover:scale-105 transition-all duration-200',
  },
  secondary: {
    container: 'relative z-5',
    visual:
      'shadow-lg border border-primary/20 bg-gradient-to-br from-secondary/10 to-secondary/5',
    text: 'text-secondary-foreground font-semibold',
    size: 'text-base',
    spacing: 'p-4 m-1',
    animation: 'hover:scale-102 transition-all duration-200',
  },
  tertiary: {
    container: 'relative z-1',
    visual: 'shadow-md border border-border/50 bg-card/50',
    text: 'text-muted-foreground font-medium',
    size: 'text-sm',
    spacing: 'p-3 m-1',
    animation: 'hover:scale-101 transition-all duration-200',
  },
  settings: {
    container: 'relative z-0',
    visual: 'shadow-sm border border-border/30 bg-muted/30',
    text: 'text-muted-foreground font-normal',
    size: 'text-xs',
    spacing: 'p-2 m-0.5',
    animation: 'hover:opacity-80 transition-all duration-200',
  },
};

export function VisualWeight({
  children,
  weight,
  className,
}: VisualWeightProps) {
  const weightClass = weightClasses[weight];

  return (
    <div
      className={cn(
        weightClass.container,
        weightClass.visual,
        weightClass.spacing,
        weightClass.animation,
        className
      )}
    >
      {children}
    </div>
  );
}

// Primary Action Component - 40% visual weight
export function PrimaryAction({
  children,
  className,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <VisualWeight
      weight='primary'
      className={cn(
        'cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div
        onClick={disabled ? undefined : onClick}
        className='flex items-center justify-center gap-3'
      >
        {children}
      </div>
    </VisualWeight>
  );
}

// Secondary Action Component - 30% visual weight
export function SecondaryAction({
  children,
  className,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <VisualWeight
      weight='secondary'
      className={cn(
        'cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div
        onClick={disabled ? undefined : onClick}
        className='flex items-center justify-center gap-2'
      >
        {children}
      </div>
    </VisualWeight>
  );
}

// Tertiary Action Component - 20% visual weight
export function TertiaryAction({
  children,
  className,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <VisualWeight
      weight='tertiary'
      className={cn(
        'cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div
        onClick={disabled ? undefined : onClick}
        className='flex items-center justify-center gap-1'
      >
        {children}
      </div>
    </VisualWeight>
  );
}

// Settings Access Component - 10% visual weight
export function SettingsAccess({
  children,
  className,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <VisualWeight
      weight='settings'
      className={cn(
        'cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div
        onClick={disabled ? undefined : onClick}
        className='flex items-center justify-center gap-1'
      >
        {children}
      </div>
    </VisualWeight>
  );
}

// Visual Hierarchy Manager
export function VisualHierarchyManager({ children }: { children: ReactNode }) {
  return <div className='visual-hierarchy-container'>{children}</div>;
}

// CSS for visual weight distribution
export const visualHierarchyStyles = `
  .visual-hierarchy-container {
    display: grid;
    gap: 1rem;
    grid-template-areas: 
      "primary primary primary primary"
      "secondary secondary secondary secondary"
      "tertiary tertiary tertiary settings";
  }
  
  .visual-hierarchy-container > *:nth-child(1) {
    grid-area: primary;
  }
  
  .visual-hierarchy-container > *:nth-child(2) {
    grid-area: secondary;
  }
  
  .visual-hierarchy-container > *:nth-child(3) {
    grid-area: tertiary;
  }
  
  .visual-hierarchy-container > *:nth-child(4) {
    grid-area: settings;
  }
  
  @media (min-width: 768px) {
    .visual-hierarchy-container {
      grid-template-areas: 
        "primary primary primary primary"
        "secondary secondary tertiary settings";
    }
  }
`;

// Hook for managing visual hierarchy
export function useVisualHierarchy() {
  const getWeightClass = (
    weight: 'primary' | 'secondary' | 'tertiary' | 'settings'
  ) => {
    return weightClasses[weight];
  };

  const calculateVisualWeight = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const area = rect.width * rect.height;
    const opacity = parseFloat(getComputedStyle(element).opacity);
    const zIndex = parseInt(getComputedStyle(element).zIndex) || 0;

    return {
      area,
      opacity,
      zIndex,
      visualWeight: area * opacity * (zIndex + 1),
    };
  };

  return {
    getWeightClass,
    calculateVisualWeight,
  };
}
