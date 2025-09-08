'use client';

import { ExerciseLibrary } from '@/components/exercise-library';
import {
  HierarchicalNavigation,
  MobileBottomNavigation,
} from '@/components/navigation/hierarchical-navigation';
import { useResponsiveNavigation } from '@/hooks/use-responsive-navigation';

export default function ExercisesPage() {
  const { isMobile, currentTab, handleTabChange } = useResponsiveNavigation();
  
  const handleSelectExercise = (exercise: any) => {
    console.log('[v0] Selected exercise:', exercise.name);
    // Future: Navigate to exercise detail or add to workout
  };

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
      
      <div className='container mx-auto max-w-6xl'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2'>Exercise Library</h1>
        <p className='text-muted-foreground'>
          Browse and search through our comprehensive exercise database
        </p>
      </div>

      <ExerciseLibrary onSelectExercise={handleSelectExercise} />
      </div>
    </div>
  );
}
