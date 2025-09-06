'use client';

/* eslint-disable no-undef */
import React from 'react';
import { cn } from '@/lib/utils';
import { useThemeStyles } from '@/components/theme-provider';

interface ThemedButtonProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function ThemedButton({
  variant = 'primary',
  size = 'md',
  animated = false,
  className,
  children,
  onClick,
  disabled,
  type = 'button',
}: ThemedButtonProps) {
  const { colors, animationClass, intensityClass } = useThemeStyles();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    accent: 'text-white',
    success: 'text-white',
    warning: 'text-white',
    error: 'text-white',
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2',
        sizeClasses[size],
        variantClasses[variant],
        animated && animationClass,
        intensityClass,
        className
      )}
      style={
        {
          backgroundColor: getVariantColor(),
          borderColor: getVariantColor(),
          '--tw-ring-color': getVariantColor(),
        } as React.CSSProperties
      }
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

interface ThemedCardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function ThemedCard({
  variant = 'default',
  interactive = false,
  className,
  children,
  onClick,
}: ThemedCardProps) {
  void onClick; // Suppress unused parameter warning
  const { colors, animationClass } = useThemeStyles();

  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-transparent border-2',
    filled: 'border-0',
  };

  return (
    <div
      className={cn(
        'rounded-lg transition-all duration-200',
        variantClasses[variant],
        interactive && 'hover:shadow-md cursor-pointer',
        animationClass,
        className
      )}
      style={{
        backgroundColor: variant === 'filled' ? colors.surface : undefined,
        borderColor: variant === 'outlined' ? colors.border : undefined,
        color: colors.text,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

interface ThemedProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
}

export function ThemedProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  animated = false,
  showLabel = false,
  className,
  ...props
}: ThemedProgressBarProps) {
  const { colors, animationClass } = useThemeStyles();

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className='flex justify-between text-sm mb-1'>
          <span style={{ color: colors.textSecondary }}>
            {Math.round(percentage)}%
          </span>
          <span style={{ color: colors.textSecondary }}>
            {value}/{max}
          </span>
        </div>
      )}
      <div
        className={cn('w-full rounded-full overflow-hidden', sizeClasses[size])}
        style={{ backgroundColor: colors.border }}
      >
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            animated && animationClass
          )}
          style={{
            width: `${percentage}%`,
            backgroundColor: getVariantColor(),
          }}
        />
      </div>
    </div>
  );
}

interface ThemedBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ThemedBadge({
  variant = 'default',
  size = 'md',
  animated = false,
  className,
  children,
  ...props
}: ThemedBadgeProps) {
  const { colors, animationClass } = useThemeStyles();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      case 'accent':
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        animated && animationClass,
        className
      )}
      style={{
        backgroundColor: `${getVariantColor()}20`,
        color: getVariantColor(),
        borderColor: getVariantColor(),
      }}
      {...props}
    >
      {children}
    </span>
  );
}

interface ThemedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ThemedInput({
  variant = 'default',
  size = 'md',
  animated = false,
  className,
  ...props
}: ThemedInputProps) {
  const { colors, animationClass } = useThemeStyles();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  return (
    <input
      className={cn(
        'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        sizeClasses[size],
        animated && animationClass,
        className
      )}
      style={
        {
          backgroundColor: colors.surface,
          borderColor:
            variant === 'default' ? colors.border : getVariantColor(),
          color: colors.text,
          '--tw-ring-color': getVariantColor(),
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

interface ThemedTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  animated?: boolean;
}

export function ThemedText({
  variant = 'default',
  size = 'base',
  weight = 'normal',
  animated = false,
  className,
  children,
  ...props
}: ThemedTextProps) {
  const { colors, animationClass } = useThemeStyles();

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.textSecondary;
      case 'accent':
        return colors.accent;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.text;
    }
  };

  return (
    <p
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        animated && animationClass,
        className
      )}
      style={{ color: getVariantColor() }}
      {...props}
    >
      {children}
    </p>
  );
}

interface ThemedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'background' | 'transparent';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function ThemedContainer({
  variant = 'default',
  padding = 'md',
  rounded = 'md',
  shadow = 'none',
  animated = false,
  className,
  children,
  ...props
}: ThemedContainerProps) {
  const { colors, animationClass } = useThemeStyles();

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'surface':
        return colors.surface;
      case 'background':
        return colors.background;
      case 'transparent':
        return 'transparent';
      default:
        return colors.surface;
    }
  };

  return (
    <div
      className={cn(
        'transition-all duration-200',
        paddingClasses[padding],
        roundedClasses[rounded],
        shadowClasses[shadow],
        animated && animationClass,
        className
      )}
      style={{
        backgroundColor: getVariantColor(),
        color: colors.text,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
