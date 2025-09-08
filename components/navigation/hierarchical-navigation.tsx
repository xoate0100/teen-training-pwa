'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Play,
  TrendingUp,
  Settings,
  Trophy,
  Users,
  Brain,
  Heart,
  Zap,
  Palette,
  Touch,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimary: boolean;
  isSecondary?: boolean;
  badge?: string | number;
  href?: string;
}

interface HierarchicalNavigationProps {
  currentTab: string;
  onTabChange: (_tab: string) => void;
  className?: string;
}

interface MobileBottomNavigationProps {
  currentTab: string;
  onTabChange: (_tab: string) => void;
}

export function HierarchicalNavigation({
  currentTab,
  onTabChange,
  className,
}: HierarchicalNavigationProps) {
  const [showSecondary, setShowSecondary] = useState(false);

  const primaryNavigation: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      isPrimary: true,
      href: '/',
    },
    {
      id: 'session',
      label: 'Session',
      icon: Play,
      isPrimary: true,
      href: '/session',
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      isPrimary: true,
      href: '/progress',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      isPrimary: true,
      href: '/settings',
    },
  ];

  const secondaryNavigation: NavigationItem[] = [
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      isPrimary: false,
      isSecondary: true,
      badge: '3',
    },
    {
      id: 'social',
      label: 'Social',
      icon: Users,
      isPrimary: false,
      isSecondary: true,
    },
    {
      id: 'ai',
      label: 'AI',
      icon: Brain,
      isPrimary: false,
      isSecondary: true,
    },
    {
      id: 'wellness',
      label: 'Wellness',
      icon: Heart,
      isPrimary: false,
      isSecondary: true,
    },
    {
      id: 'smart',
      label: 'Smart',
      icon: Zap,
      isPrimary: false,
      isSecondary: true,
    },
    {
      id: 'interactive',
      label: 'Interactive',
      icon: Touch,
      isPrimary: false,
      isSecondary: true,
    },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Primary Navigation */}
      <div className='grid grid-cols-4 gap-2 mb-4'>
        {primaryNavigation.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'outline'}
              size='lg'
              onClick={() => handleTabClick(item.id)}
              className={cn(
                'h-12 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                  : 'hover:bg-accent hover:scale-102'
              )}
              aria-label={`Navigate to ${item.label}`}
            >
              <Icon className='h-4 w-4' />
              <span className='truncate'>{item.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Secondary Navigation Toggle */}
      <div className='flex justify-center mb-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowSecondary(!showSecondary)}
          className='flex items-center gap-2 text-muted-foreground hover:text-foreground'
          aria-expanded={showSecondary}
          aria-label={
            showSecondary ? 'Hide advanced features' : 'Show advanced features'
          }
        >
          {showSecondary ? (
            <>
              <ChevronUp className='h-4 w-4' />
              Hide Advanced
            </>
          ) : (
            <>
              <ChevronDown className='h-4 w-4' />
              Show Advanced
            </>
          )}
        </Button>
      </div>

      {/* Secondary Navigation */}
      {showSecondary && (
        <div className='grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200'>
          {secondaryNavigation.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                size='sm'
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  'h-10 flex items-center justify-start gap-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'hover:bg-accent'
                )}
                aria-label={`Navigate to ${item.label}`}
              >
                <Icon className='h-4 w-4' />
                <span className='truncate'>{item.label}</span>
                {item.badge && (
                  <Badge
                    variant='default'
                    className='ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs'
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Mobile-specific navigation component
export function MobileBottomNavigation({
  currentTab,
  onTabChange,
}: MobileBottomNavigationProps) {
  const primaryNavigation: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      isPrimary: true,
      href: '/',
    },
    {
      id: 'session',
      label: 'Session',
      icon: Play,
      isPrimary: true,
      href: '/session',
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      isPrimary: true,
      href: '/progress',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      isPrimary: true,
      href: '/settings',
    },
  ];

  const mobileNavigation = primaryNavigation.map(item => ({
    ...item,
    // Add mobile-specific styling
    className: 'flex-1 h-16 flex-col gap-1',
  }));

  const handleTabClick = (tabId: string) => {
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration for touch feedback
    }
    onTabChange(tabId);
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-2 pb-safe'>
      <div className='grid grid-cols-4 gap-1 max-w-md mx-auto'>
        {mobileNavigation.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <Button
              key={item.id}
              variant='ghost'
              size='sm'
              onClick={() => handleTabClick(item.id)}
              className={cn(
                'h-16 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all duration-200 touch-manipulation',
                'active:scale-95 active:bg-primary/20',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              aria-label={`Navigate to ${item.label}`}
              style={{
                minHeight: '64px', // Ensure minimum touch target size
                minWidth: '64px',
              }}
            >
              <Icon className='h-6 w-6' />
              <span className='truncate text-xs'>{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
