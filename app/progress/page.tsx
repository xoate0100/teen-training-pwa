'use client';

import { ProgressChart } from '@/components/progress-chart';
import {
  HierarchicalNavigation,
  MobileBottomNavigation,
} from '@/components/navigation/hierarchical-navigation';
import { useResponsiveNavigation } from '@/hooks/use-responsive-navigation';

export default function ProgressPage() {
  const { isMobile, currentTab, handleTabChange } = useResponsiveNavigation();

  return (
    <div className='min-h-screen bg-background p-4 pb-20'>
      {/* Navigation */}
      {isMobile ? (
        <MobileBottomNavigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      ) : (
        <HierarchicalNavigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
          className='mb-6'
        />
      )}

      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-foreground mb-2'>
          Progress Tracking
        </h1>
        <p className='text-muted-foreground'>
          Your athletic development journey
        </p>
      </div>

      <ProgressChart />
    </div>
  );
}
