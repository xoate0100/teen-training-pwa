'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// SVG Icon Props
interface SVGIconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  children: ReactNode;
}

// Base SVG Icon Component
export function SVGIcon({
  size = 24,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = true,
  children,
}: SVGIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('inline-block', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      {children}
    </svg>
  );
}

// Primary Navigation Icons
export function DashboardIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <rect x='3' y='3' width='7' height='7' />
      <rect x='14' y='3' width='7' height='7' />
      <rect x='14' y='14' width='7' height='7' />
      <rect x='3' y='14' width='7' height='7' />
    </SVGIcon>
  );
}

export function SessionIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <polygon points='5,3 19,12 5,21' />
    </SVGIcon>
  );
}

export function ProgressIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M3 3v18h18' />
      <path d='M18.7 8l-5.1 5.2-2.8-2.7L7 14.3' />
    </SVGIcon>
  );
}

export function SettingsIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' />
    </SVGIcon>
  );
}

export function ExercisesIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
      <line x1='3' y1='6' x2='21' y2='6' />
      <path d='M16 10a4 4 0 0 1-8 0' />
    </SVGIcon>
  );
}

// Secondary Navigation Icons
export function AchievementsIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6' />
      <path d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18' />
      <path d='M4 22h16' />
      <path d='M10 14.66V17c0 .55.47.98.97 1.21l1.03.34c.5.17 1.05.17 1.55 0l1.03-.34c.5-.23.97-.66.97-1.21v-2.34' />
      <path d='M18 2H6v7a6 6 0 0 0 12 0V2Z' />
    </SVGIcon>
  );
}

export function SocialIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </SVGIcon>
  );
}

export function AIIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M9 12l2 2 4-4' />
      <path d='M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02' />
      <path d='M12 3v6l3-3' />
    </SVGIcon>
  );
}

export function WellnessIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z' />
    </SVGIcon>
  );
}

export function GoalsIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <circle cx='12' cy='12' r='10' />
      <path d='M8 12l2 2 4-4' />
    </SVGIcon>
  );
}

export function SyncIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' />
      <path d='M21 3v5h-5' />
      <path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' />
      <path d='M3 21v-5h5' />
    </SVGIcon>
  );
}

export function HelpIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <circle cx='12' cy='12' r='10' />
      <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
      <path d='M12 17h.01' />
    </SVGIcon>
  );
}

export function ProfileIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </SVGIcon>
  );
}

// Settings Category Icons
export function PreferencesIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
    </SVGIcon>
  );
}

export function NotificationsIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
      <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
    </SVGIcon>
  );
}

export function PrivacyIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
      <circle cx='12' cy='16' r='1' />
      <path d='M7 11V7a5 5 0 0 1 10 0v4' />
    </SVGIcon>
  );
}

export function DataIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M3 3v18h18' />
      <path d='M18.7 8l-5.1 5.2-2.8-2.7L7 14.3' />
      <path d='M12 2v20' />
      <path d='M2 12h20' />
    </SVGIcon>
  );
}

export function AccessibilityIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
      <rect x='8' y='2' width='8' height='4' rx='1' ry='1' />
      <path d='M12 11h4' />
      <path d='M12 16h4' />
      <path d='M8 11h.01' />
      <path d='M8 16h.01' />
    </SVGIcon>
  );
}

// Quick Action Icons
export function CheckInIcon({
  size = 24,
  className,
  ...props
}: Omit<SVGIconProps, 'children'>) {
  return (
    <SVGIcon size={size} className={className} {...props}>
      <path d='M9 12l2 2 4-4' />
      <path d='M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02' />
    </SVGIcon>
  );
}

// Icon Registry
export const iconRegistry = {
  // Primary Navigation
  dashboard: DashboardIcon,
  session: SessionIcon,
  exercises: ExercisesIcon,
  progress: ProgressIcon,
  settings: SettingsIcon,

  // Secondary Navigation
  achievements: AchievementsIcon,
  social: SocialIcon,
  ai: AIIcon,
  wellness: WellnessIcon,
  goals: GoalsIcon,
  sync: SyncIcon,
  help: HelpIcon,
  profile: ProfileIcon,

  // Settings Categories
  preferences: PreferencesIcon,
  notifications: NotificationsIcon,
  privacy: PrivacyIcon,
  data: DataIcon,
  accessibility: AccessibilityIcon,

  // Quick Actions
  'check-in': CheckInIcon,
} as const;

// Icon Component with Registry
interface IconProps {
  name: keyof typeof iconRegistry;
  size?: number;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  const IconComponent = iconRegistry[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  return <IconComponent size={size} className={className} {...props} />;
}
