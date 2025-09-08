'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// 8px Grid System
export const spacing = {
  // Base 8px grid system
  xs: '0.5rem', // 8px
  sm: '1rem', // 16px
  md: '1.5rem', // 24px
  lg: '2rem', // 32px
  xl: '3rem', // 48px
  '2xl': '4rem', // 64px
  '3xl': '6rem', // 96px
  '4xl': '8rem', // 128px

  // Component-specific spacing
  component: {
    padding: '1rem', // 16px
    margin: '0.5rem', // 8px
    gap: '0.75rem', // 12px
    borderRadius: '0.5rem', // 8px
  },

  // Layout spacing
  layout: {
    section: '2rem', // 32px between sections
    container: '1rem', // 16px container padding
    grid: '1rem', // 16px grid gap
  },

  // Mobile-specific spacing
  mobile: {
    touch: '2.75rem', // 44px minimum touch target
    safe: '1rem', // 16px safe area
    bottom: '5rem', // 80px bottom navigation space
  },
} as const;

// Typography Scale
export const typography = {
  // Font sizes (rem-based)
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },

  // Font weights
  weights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line heights
  lineHeights: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Component Sizing System
export const componentSizes = {
  // Button sizes
  button: {
    xs: 'h-6 px-2 text-xs',
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
    xl: 'h-14 px-8 text-xl',
  },

  // Card sizes
  card: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },

  // Input sizes
  input: {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  },

  // Icon sizes
  icon: {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  },
} as const;

// Spacing Components
interface SpacingProps {
  children: ReactNode;
  size?: keyof typeof spacing;
  className?: string;
}

export function Spacing({ children, size = 'md', className }: SpacingProps) {
  return (
    <div className={cn('w-full', className)} style={{ padding: spacing[size] }}>
      {children}
    </div>
  );
}

// Typography Components
interface TypographyProps {
  children: ReactNode;
  size?: keyof typeof typography.sizes;
  weight?: keyof typeof typography.weights;
  lineHeight?: keyof typeof typography.lineHeights;
  letterSpacing?: keyof typeof typography.letterSpacing;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export function Typography({
  children,
  size = 'base',
  weight = 'normal',
  lineHeight = 'normal',
  letterSpacing = 'normal',
  className,
  as: Component = 'p',
}: TypographyProps) {
  return (
    <Component
      className={cn(
        `text-${size}`,
        `font-${weight}`,
        `leading-${lineHeight}`,
        `tracking-${letterSpacing}`,
        className
      )}
    >
      {children}
    </Component>
  );
}

// Heading Components
export function Heading1({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Typography
      as='h1'
      size='4xl'
      weight='bold'
      lineHeight='tight'
      className={cn('text-foreground', className)}
    >
      {children}
    </Typography>
  );
}

export function Heading2({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Typography
      as='h2'
      size='3xl'
      weight='semibold'
      lineHeight='snug'
      className={cn('text-foreground', className)}
    >
      {children}
    </Typography>
  );
}

export function Heading3({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Typography
      as='h3'
      size='2xl'
      weight='semibold'
      lineHeight='snug'
      className={cn('text-foreground', className)}
    >
      {children}
    </Typography>
  );
}

export function BodyText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Typography
      as='p'
      size='base'
      weight='normal'
      lineHeight='relaxed'
      className={cn('text-muted-foreground', className)}
    >
      {children}
    </Typography>
  );
}

export function Caption({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Typography
      as='span'
      size='sm'
      weight='normal'
      lineHeight='normal'
      className={cn('text-muted-foreground', className)}
    >
      {children}
    </Typography>
  );
}

// Layout Components
interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Container({
  children,
  size = 'lg',
  className,
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Section({
  children,
  spacing: spacingSize = 'lg',
  className,
}: SectionProps) {
  const spacingClasses = {
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16',
  };

  return (
    <section className={cn(spacingClasses[spacingSize], className)}>
      {children}
    </section>
  );
}

// Grid System
interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Grid({ children, cols = 1, gap = 'md', className }: GridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-12',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div className={cn('grid', colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// Flexbox Utilities
interface FlexProps {
  children: ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Flex({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = 'nowrap',
  gap = 'md',
  className,
}: FlexProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        wrapClasses[wrap],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

// Spacing Hook
export function useSpacing() {
  const getSpacing = (size: keyof typeof spacing) => spacing[size];
  const getTypography = (size: keyof typeof typography.sizes) =>
    typography.sizes[size];
  const getComponentSize = (
    component: keyof typeof componentSizes,
    size: string
  ) =>
    componentSizes[component][
      size as keyof (typeof componentSizes)[typeof component]
    ];

  return {
    getSpacing,
    getTypography,
    getComponentSize,
    spacing,
    typography,
    componentSizes,
  };
}

// CSS Variables for consistent spacing
export const spacingCSS = `
  :root {
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
    --spacing-2xl: 4rem;
    --spacing-3xl: 6rem;
    --spacing-4xl: 8rem;
    
    --component-padding: 1rem;
    --component-margin: 0.5rem;
    --component-gap: 0.75rem;
    --component-border-radius: 0.5rem;
    
    --layout-section: 2rem;
    --layout-container: 1rem;
    --layout-grid: 1rem;
    
    --mobile-touch: 2.75rem;
    --mobile-safe: 1rem;
    --mobile-bottom: 5rem;
  }
`;
