'use client';

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AccessibleIcon } from '@/components/accessible-icons';
import { AnimatedIcon } from '@/components/animated-icons';
import {
  X,
  Check,
  AlertTriangle,
  Info,
  Wifi,
  WifiOff,
  Sync,
} from 'lucide-react';

// Notification types
export const notificationTypes = {
  new: {
    icon: 'session',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  achievement: {
    icon: 'achievements',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  reminder: {
    icon: 'session',
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  success: {
    icon: 'check-in',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  error: {
    icon: 'help',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  warning: {
    icon: 'help',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  info: {
    icon: 'help',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
} as const;

// Alert types
export const alertTypes = {
  error: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  success: {
    icon: Check,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
} as const;

// Connection status types
export const connectionStatusTypes = {
  online: {
    icon: Wifi,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Online',
  },
  offline: {
    icon: WifiOff,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Offline',
  },
  syncing: {
    icon: Sync,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Syncing',
  },
} as const;

// Notification Badge Component
interface NotificationBadgeProps {
  type: keyof typeof notificationTypes;
  count: number;
  maxCount?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  onClick?: () => void;
}

export function NotificationBadge({
  type,
  count,
  maxCount = 99,
  className,
  size = 'md',
  showAnimation = true,
  onClick,
}: NotificationBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const config = notificationTypes[type];

  const sizeClasses = {
    sm: 'h-5 w-5 text-xs',
    md: 'h-6 w-6 text-sm',
    lg: 'h-8 w-8 text-base',
  };

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  useEffect(() => {
    if (count > 0 && showAnimation) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [count, showAnimation]);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full text-white font-bold transition-all duration-200 cursor-pointer',
        config.color,
        sizeClasses[size],
        isAnimating && 'animate-bounce scale-110',
        className
      )}
      onClick={onClick}
    >
      {displayCount}
      {isAnimating && (
        <div className='absolute inset-0 rounded-full bg-white/30 animate-ping' />
      )}
    </div>
  );
}

// Notification Card Component
interface NotificationCardProps {
  type: keyof typeof notificationTypes;
  title: string;
  message: string;
  timestamp?: Date;
  onDismiss?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
  showAnimation?: boolean;
}

export function NotificationCard({
  type,
  title,
  message,
  timestamp,
  onDismiss,
  onAction,
  actionLabel = 'View',
  className,
  showAnimation = true,
}: NotificationCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(showAnimation);
  const config = notificationTypes[type];

  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [showAnimation]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border transition-all duration-300',
        config.bgColor,
        config.borderColor,
        isAnimating && 'animate-pulse scale-105',
        className
      )}
    >
      <div className='flex items-start gap-3'>
        <div className={cn('flex-shrink-0', config.color)}>
          <AccessibleIcon
            name={
              config.icon as keyof typeof import('@/components/svg-icons').iconRegistry
            }
            size='md'
            variant='default'
            highContrast={true}
          />
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between'>
            <h4 className={cn('text-sm font-semibold', config.textColor)}>
              {title}
            </h4>
            {onDismiss && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleDismiss}
                className='h-6 w-6 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>

          <p className='text-sm text-muted-foreground mt-1'>{message}</p>

          {timestamp && (
            <p className='text-xs text-muted-foreground mt-2'>
              {timestamp.toLocaleTimeString()}
            </p>
          )}

          {onAction && (
            <Button
              variant='outline'
              size='sm'
              onClick={onAction}
              className='mt-3'
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Alert Component
interface AlertProps {
  type: keyof typeof alertTypes;
  title: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
  showAnimation?: boolean;
}

export function Alert({
  type,
  title,
  message,
  onDismiss,
  className,
  showAnimation = true,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(showAnimation);
  const config = alertTypes[type];
  const Icon = config.icon;

  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [showAnimation]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border transition-all duration-300',
        config.bgColor,
        config.borderColor,
        isAnimating && 'animate-pulse scale-105',
        className
      )}
    >
      <div className='flex items-start gap-3'>
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.color)} />

        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between'>
            <h4 className={cn('text-sm font-semibold', config.color)}>
              {title}
            </h4>
            {onDismiss && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleDismiss}
                className='h-6 w-6 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>

          <p className='text-sm text-muted-foreground mt-1'>{message}</p>
        </div>
      </div>
    </div>
  );
}

// Connection Status Component
interface ConnectionStatusProps {
  status: keyof typeof connectionStatusTypes;
  className?: string;
  showLabel?: boolean;
  showAnimation?: boolean;
}

export function ConnectionStatus({
  status,
  className,
  showLabel = true,
  showAnimation = true,
}: ConnectionStatusProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const config = connectionStatusTypes[status];
  const Icon = config.icon;

  useEffect(() => {
    if (status === 'syncing' && showAnimation) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [status, showAnimation]);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('p-2 rounded-full', config.bgColor)}>
        <Icon
          className={cn('h-4 w-4', config.color, isAnimating && 'animate-spin')}
        />
      </div>

      {showLabel && (
        <span className={cn('text-sm font-medium', config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
}

// Notification System Hook
export function useNotificationSystem() {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: keyof typeof notificationTypes;
      title: string;
      message: string;
      timestamp: Date;
      read: boolean;
    }>
  >([]);

  const addNotification = (
    type: keyof typeof notificationTypes,
    title: string,
    message: string
  ) => {
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    dismissNotification,
    getUnreadCount,
    clearAll,
  };
}
