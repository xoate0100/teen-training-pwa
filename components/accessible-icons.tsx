'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/svg-icons';

// Icon sizes with accessibility considerations
export const accessibleIconSizes = {
  xs: { size: 12, minTouch: false }, // Too small for touch
  sm: { size: 16, minTouch: false }, // Too small for touch
  md: { size: 20, minTouch: false }, // Minimum for desktop
  lg: { size: 24, minTouch: true }, // Minimum for touch
  xl: { size: 32, minTouch: true }, // Recommended for touch
  '2xl': { size: 40, minTouch: true }, // Large touch target
  '3xl': { size: 48, minTouch: true }, // Extra large touch target
} as const;

// High contrast variants for accessibility
export const highContrastVariants = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  muted: 'text-muted-foreground',
  success: 'text-green-700 dark:text-green-300',
  warning: 'text-yellow-700 dark:text-yellow-300',
  error: 'text-red-700 dark:text-red-300',
  info: 'text-blue-700 dark:text-blue-300',
  // High contrast variants
  'high-contrast': 'text-black dark:text-white',
  'high-contrast-primary': 'text-blue-900 dark:text-blue-100',
  'high-contrast-success': 'text-green-900 dark:text-green-100',
  'high-contrast-warning': 'text-yellow-900 dark:text-yellow-100',
  'high-contrast-error': 'text-red-900 dark:text-red-100',
} as const;

// Icon states with accessibility considerations
export const accessibleIconStates = {
  default: 'opacity-100',
  hover: 'hover:opacity-80 hover:scale-105 focus:opacity-80 focus:scale-105',
  active: 'opacity-100 scale-105',
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'animate-spin',
  focus: 'focus:ring-2 focus:ring-primary focus:ring-offset-2',
} as const;

// Accessible Icon Props
interface AccessibleIconProps {
  name: keyof typeof import('@/components/svg-icons').iconRegistry;
  size?: keyof typeof accessibleIconSizes;
  variant?: keyof typeof highContrastVariants;
  state?: keyof typeof accessibleIconStates;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
  disabled?: boolean;
  highContrast?: boolean;
}

// Accessible Icon Component
export function AccessibleIcon({
  name,
  size = 'lg',
  variant = 'default',
  state = 'default',
  className,
  onClick,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  'aria-describedby': ariaDescribedBy,
  role = 'img',
  tabIndex = 0,
  disabled = false,
  highContrast = false,
}: AccessibleIconProps) {
  const sizeConfig = accessibleIconSizes[size];
  const actualVariant = highContrast ? `high-contrast-${variant}` : variant;

  return (
    <Icon
      name={name}
      size={sizeConfig.size}
      className={cn(
        highContrastVariants[
          actualVariant as keyof typeof highContrastVariants
        ] || highContrastVariants.default,
        accessibleIconStates[state],
        disabled && 'cursor-not-allowed opacity-50',
        onClick && !disabled && 'cursor-pointer',
        className
      )}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      aria-describedby={ariaDescribedBy}
      role={role}
      tabIndex={disabled ? -1 : tabIndex}
    />
  );
}

// Accessible Icon Button Component
interface AccessibleIconButtonProps {
  name: keyof typeof import('@/components/svg-icons').iconRegistry;
  size?: keyof typeof accessibleIconSizes;
  variant?: keyof typeof highContrastVariants;
  state?: keyof typeof accessibleIconStates;
  className?: string;
  onClick?: () => void;
  'aria-label': string;
  'aria-describedby'?: string;
  disabled?: boolean;
  highContrast?: boolean;
  tooltip?: string;
}

export function AccessibleIconButton({
  name,
  size = 'lg',
  variant = 'default',
  state = 'default',
  className,
  onClick,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  disabled = false,
  highContrast = false,
  tooltip,
}: AccessibleIconButtonProps) {
  const sizeConfig = accessibleIconSizes[size];
  const minTouchSize = 44; // Minimum touch target size in pixels
  const iconSize = sizeConfig.size;
  const padding = Math.max(0, (minTouchSize - iconSize) / 2);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted',
        sizeConfig.minTouch && 'min-h-[44px] min-w-[44px]',
        className
      )}
      style={{
        padding: sizeConfig.minTouch ? `${padding}px` : '8px',
      }}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      title={tooltip}
      tabIndex={disabled ? -1 : 0}
    >
      <AccessibleIcon
        name={name}
        size={size}
        variant={variant}
        state={disabled ? 'disabled' : state}
        highContrast={highContrast}
        aria-hidden={true}
      />
    </button>
  );
}

// Icon with Tooltip Component
interface IconWithTooltipProps {
  name: keyof typeof import('@/components/svg-icons').iconRegistry;
  tooltip: string;
  size?: keyof typeof accessibleIconSizes;
  variant?: keyof typeof highContrastVariants;
  state?: keyof typeof accessibleIconStates;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  highContrast?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function IconWithTooltip({
  name,
  tooltip,
  size = 'lg',
  variant = 'default',
  state = 'default',
  className,
  onClick,
  disabled = false,
  highContrast = false,
  position = 'top',
}: IconWithTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div className='relative inline-block'>
      <AccessibleIcon
        name={name}
        size={size}
        variant={variant}
        state={state}
        className={className}
        onClick={onClick}
        disabled={disabled}
        highContrast={highContrast}
        aria-label={tooltip}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      />

      {showTooltip && (
        <div
          className={cn(
            'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap',
            positionClasses[position]
          )}
          role='tooltip'
          aria-live='polite'
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}

// Icon Grid with Accessibility
interface AccessibleIconGridProps {
  icons: Array<{
    name: keyof typeof import('@/components/svg-icons').iconRegistry;
    label: string;
    description?: string;
    tooltip?: string;
  }>;
  columns?: 2 | 3 | 4 | 6;
  size?: keyof typeof accessibleIconSizes;
  variant?: keyof typeof highContrastVariants;
  className?: string;
  highContrast?: boolean;
}

export function AccessibleIconGrid({
  icons,
  columns = 4,
  size = 'lg',
  variant = 'default',
  className,
  highContrast = false,
}: AccessibleIconGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)} role='grid'>
      {icons.map(({ name, label, description, tooltip }) => (
        <div
          key={name}
          className='flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2'
          role='gridcell'
          tabIndex={0}
        >
          <AccessibleIcon
            name={name}
            size={size}
            variant={variant}
            highContrast={highContrast}
            aria-label={tooltip || label}
          />
          <div className='text-center'>
            <p className='text-sm font-medium'>{label}</p>
            {description && (
              <p className='text-xs text-muted-foreground'>{description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Icon Accessibility Hook
export function useIconAccessibility() {
  const getAccessibleSize = (size: keyof typeof accessibleIconSizes) => {
    return accessibleIconSizes[size];
  };

  const getHighContrastVariant = (
    variant: keyof typeof highContrastVariants
  ) => {
    return highContrastVariants[variant];
  };

  const isTouchFriendly = (size: keyof typeof accessibleIconSizes) => {
    return accessibleIconSizes[size].minTouch;
  };

  const getMinTouchSize = () => {
    return 44; // 44px minimum touch target
  };

  return {
    getAccessibleSize,
    getHighContrastVariant,
    isTouchFriendly,
    getMinTouchSize,
    accessibleIconSizes,
    highContrastVariants,
    accessibleIconStates,
  };
}
