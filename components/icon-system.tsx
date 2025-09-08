'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Home,
  Play,
  BarChart3,
  Settings,
  Trophy,
  Users,
  Brain,
  Heart,
  Target,
  Sync,
  HelpCircle,
  User,
  Palette,
  Bell,
  Shield,
  Activity,
  Eye,
  Volume2,
  Search,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Star,
  Zap,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Lock,
  Unlock,
  Plus,
  Minus,
  X,
  Edit,
  Trash2,
  Save,
  Copy,
  Share,
  ExternalLink,
  Menu,
  MoreHorizontal,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalZero,
  SignalOne,
  SignalTwo,
  SignalThree,
  SignalFour,
  WifiIcon,
  WifiOffIcon,
  BatteryIcon,
  BatteryLowIcon,
  SignalIcon,
  SignalZeroIcon,
  SignalOneIcon,
  SignalTwoIcon,
  SignalThreeIcon,
  SignalFourIcon,
  WifiIcon as WifiIconAlt,
  WifiOffIcon as WifiOffIconAlt,
  BatteryIcon as BatteryIconAlt,
  BatteryLowIcon as BatteryLowIconAlt,
  SignalIcon as SignalIconAlt,
  SignalZeroIcon as SignalZeroIconAlt,
  SignalOneIcon as SignalOneIconAlt,
  SignalTwoIcon as SignalTwoIconAlt,
  SignalThreeIcon as SignalThreeIconAlt,
  SignalFourIcon as SignalFourIconAlt,
} from 'lucide-react';

// Icon sizes
export const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
  '3xl': 'h-12 w-12',
} as const;

// Icon variants
export const iconVariants = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  muted: 'text-muted-foreground',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',
} as const;

// Icon states
export const iconStates = {
  default: 'opacity-100',
  hover: 'hover:opacity-80 hover:scale-105',
  active: 'opacity-100 scale-105',
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'animate-spin',
} as const;

// Primary Navigation Icons
export const primaryIcons = {
  dashboard: Home,
  session: Play,
  progress: BarChart3,
  settings: Settings,
} as const;

// Secondary Navigation Icons
export const secondaryIcons = {
  achievements: Trophy,
  social: Users,
  ai: Brain,
  wellness: Heart,
  goals: Target,
  sync: Sync,
  help: HelpCircle,
  profile: User,
} as const;

// Settings Category Icons
export const settingsIcons = {
  profile: User,
  preferences: Palette,
  notifications: Bell,
  privacy: Shield,
  data: Activity,
  accessibility: Eye,
  audio: Volume2,
  search: Search,
  backup: Download,
  restore: Upload,
  reset: RotateCcw,
  about: AlertCircle,
} as const;

// Quick Action Icons
export const quickActionIcons = {
  'check-in': Check,
  sync: Sync,
  help: HelpCircle,
  settings: Settings,
} as const;

// Icon Component Props
interface IconProps {
  name:
    | keyof typeof primaryIcons
    | keyof typeof secondaryIcons
    | keyof typeof settingsIcons
    | keyof typeof quickActionIcons;
  size?: keyof typeof iconSizes;
  variant?: keyof typeof iconVariants;
  state?: keyof typeof iconStates;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

// Icon Component
export function Icon({
  name,
  size = 'md',
  variant = 'default',
  state = 'default',
  className,
  onClick,
  'aria-label': ariaLabel,
}: IconProps) {
  // Get the icon component
  const IconComponent =
    name in primaryIcons
      ? primaryIcons[name as keyof typeof primaryIcons]
      : name in secondaryIcons
        ? secondaryIcons[name as keyof typeof secondaryIcons]
        : name in settingsIcons
          ? settingsIcons[name as keyof typeof settingsIcons]
          : name in quickActionIcons
            ? quickActionIcons[name as keyof typeof quickActionIcons]
            : null;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      className={cn(
        iconSizes[size],
        iconVariants[variant],
        iconStates[state],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    />
  );
}

// Icon Button Component
interface IconButtonProps {
  name:
    | keyof typeof primaryIcons
    | keyof typeof secondaryIcons
    | keyof typeof settingsIcons
    | keyof typeof quickActionIcons;
  size?: keyof typeof iconSizes;
  variant?: keyof typeof iconVariants;
  state?: keyof typeof iconStates;
  className?: string;
  onClick?: () => void;
  'aria-label': string;
  disabled?: boolean;
}

export function IconButton({
  name,
  size = 'md',
  variant = 'default',
  state = 'default',
  className,
  onClick,
  'aria-label': ariaLabel,
  disabled = false,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted',
        className
      )}
      aria-label={ariaLabel}
    >
      <Icon
        name={name}
        size={size}
        variant={variant}
        state={disabled ? 'disabled' : state}
      />
    </button>
  );
}

// Icon Grid Component
interface IconGridProps {
  icons: Array<{
    name:
      | keyof typeof primaryIcons
      | keyof typeof secondaryIcons
      | keyof typeof settingsIcons
      | keyof typeof quickActionIcons;
    label: string;
    description?: string;
  }>;
  columns?: 2 | 3 | 4 | 6;
  size?: keyof typeof iconSizes;
  variant?: keyof typeof iconVariants;
  className?: string;
}

export function IconGrid({
  icons,
  columns = 4,
  size = 'lg',
  variant = 'default',
  className,
}: IconGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {icons.map(({ name, label, description }) => (
        <div
          key={name}
          className='flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors'
        >
          <Icon name={name} size={size} variant={variant} />
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

// Icon Showcase Component
export function IconShowcase() {
  const primaryIconList = Object.entries(primaryIcons).map(([key, _]) => ({
    name: key as keyof typeof primaryIcons,
    label:
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    description: `Primary navigation icon for ${key}`,
  }));

  const secondaryIconList = Object.entries(secondaryIcons).map(([key, _]) => ({
    name: key as keyof typeof secondaryIcons,
    label:
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    description: `Secondary navigation icon for ${key}`,
  }));

  const settingsIconList = Object.entries(settingsIcons).map(([key, _]) => ({
    name: key as keyof typeof settingsIcons,
    label:
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    description: `Settings category icon for ${key}`,
  }));

  const quickActionIconList = Object.entries(quickActionIcons).map(
    ([key, _]) => ({
      name: key as keyof typeof quickActionIcons,
      label:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      description: `Quick action icon for ${key}`,
    })
  );

  return (
    <div className='space-y-8'>
      <div>
        <h3 className='text-lg font-semibold mb-4'>Primary Navigation Icons</h3>
        <IconGrid icons={primaryIconList} columns={4} />
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-4'>
          Secondary Navigation Icons
        </h3>
        <IconGrid icons={secondaryIconList} columns={4} />
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-4'>Settings Category Icons</h3>
        <IconGrid icons={settingsIconList} columns={6} />
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-4'>Quick Action Icons</h3>
        <IconGrid icons={quickActionIconList} columns={4} />
      </div>
    </div>
  );
}

// Icon Hook
export function useIconSystem() {
  const getIcon = (name: string) => {
    return name in primaryIcons
      ? primaryIcons[name as keyof typeof primaryIcons]
      : name in secondaryIcons
        ? secondaryIcons[name as keyof typeof secondaryIcons]
        : name in settingsIcons
          ? settingsIcons[name as keyof typeof settingsIcons]
          : name in quickActionIcons
            ? quickActionIcons[name as keyof typeof quickActionIcons]
            : null;
  };

  const getAllIcons = () => ({
    primary: primaryIcons,
    secondary: secondaryIcons,
    settings: settingsIcons,
    quickAction: quickActionIcons,
  });

  return {
    getIcon,
    getAllIcons,
    iconSizes,
    iconVariants,
    iconStates,
  };
}
