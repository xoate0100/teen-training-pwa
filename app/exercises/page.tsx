'use client';

import { ExerciseLibrary } from '@/components/exercise-library';

export default function ExercisesPage() {
  const handleSelectExercise = (exercise: any) => {
    console.log('[v0] Selected exercise:', exercise.name);
    // Future: Navigate to exercise detail or add to workout
  };

  return (
    <div className='container mx-auto p-4 max-w-6xl'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2'>Exercise Library</h1>
        <p className='text-muted-foreground'>
          Browse and search through our comprehensive exercise database
        </p>
      </div>

      <ExerciseLibrary onSelectExercise={handleSelectExercise} />
    </div>
  );
}
