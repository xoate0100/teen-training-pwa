'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Pause,
  CheckCircle,
  Timer,
  Zap,
  MessageSquare,
  Star,
  ArrowRight,
  Trophy,
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  load?: string;
  instructions: string[];
  videoUrl?: string;
}

interface SessionCardProps {
  sessionType: 'strength' | 'conditioning' | 'skills' | 'recovery';
  title: string;
  exercises: Exercise[];
  onExerciseComplete?: (exerciseIndex: number) => void;
  onSessionComplete?: () => void;
}

export function SessionCard({
  sessionType,
  title,
  exercises,
  onExerciseComplete,
  onSessionComplete,
}: SessionCardProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>(
    {}
  );
  const [rpe, setRpe] = useState([5]);
  const [notes, setNotes] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);

  const sessionColors = {
    strength: 'bg-[var(--session-strength)]',
    conditioning: 'bg-[var(--session-conditioning)]',
    skills: 'bg-[var(--session-skills)]',
    recovery: 'bg-[var(--session-recovery)]',
  };

  const exercise = exercises[currentExercise];

  const handleSetComplete = (exerciseId: string) => {
    const newCompletedSets = {
      ...completedSets,
      [exerciseId]: (completedSets[exerciseId] || 0) + 1,
    };
    setCompletedSets(newCompletedSets);

    // Check if exercise is now complete
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise && newCompletedSets[exerciseId] >= exercise.sets) {
      // Exercise completed
      onExerciseComplete?.(currentExercise);

      // Auto-advance to next exercise if enabled and not last exercise
      if (autoAdvanceEnabled && currentExercise < exercises.length - 1) {
        setTimeout(() => {
          setCurrentExercise(currentExercise + 1);
          setRpe([5]); // Reset RPE for next exercise
          setNotes(''); // Reset notes for next exercise
        }, 1500); // 1.5 second delay for user to see completion
      } else if (currentExercise === exercises.length - 1) {
        // Session completed
        setTimeout(() => {
          onSessionComplete?.();
        }, 1500);
      }
    }
  };

  const isExerciseComplete = (exerciseId: string, totalSets: number) => {
    return (completedSets[exerciseId] || 0) >= totalSets;
  };

  const isSessionComplete = exercises.every(ex =>
    isExerciseComplete(ex.id, ex.sets)
  );

  return (
    <div className='space-y-4'>
      {/* Session Header */}
      <Card>
        <CardHeader
          className={`${sessionColors[sessionType]} text-white rounded-t-lg`}
        >
          <CardTitle className='flex items-center justify-between'>
            <span>{title}</span>
            <Badge variant='secondary' className='bg-white/20 text-white'>
              {currentExercise + 1} / {exercises.length}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {isSessionComplete && (
        <Card className='border-green-500 bg-green-50'>
          <CardContent className='p-6 text-center'>
            <Trophy className='h-12 w-12 text-green-600 mx-auto mb-3' />
            <h3 className='text-xl font-bold text-green-800 mb-2'>
              Session Complete! 🎉
            </h3>
            <p className='text-green-700 mb-4'>
              Great work! You've completed all exercises.
            </p>
            <Button className='bg-green-600 hover:bg-green-700'>
              View Session Summary
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Exercise Navigation */}
      <div className='flex gap-2 overflow-x-auto pb-2'>
        {exercises.map((ex, index) => (
          <Button
            key={ex.id}
            variant={index === currentExercise ? 'default' : 'outline'}
            size='sm'
            onClick={() => setCurrentExercise(index)}
            className='flex-shrink-0'
          >
            {isExerciseComplete(ex.id, ex.sets) && (
              <CheckCircle className='h-3 w-3 mr-1' />
            )}
            {index + 1}
          </Button>
        ))}
      </div>

      {/* Current Exercise */}
      {!isSessionComplete && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>{exercise.name}</span>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? (
                    <Pause className='h-4 w-4' />
                  ) : (
                    <Timer className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Exercise Details */}
            <div className='grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-primary'>
                  {exercise.sets}
                </p>
                <p className='text-sm text-muted-foreground'>Sets</p>
              </div>
              <div className='text-center'>
                <p className='text-2xl font-bold text-primary'>
                  {exercise.reps}
                </p>
                <p className='text-sm text-muted-foreground'>Reps</p>
              </div>
              <div className='text-center'>
                <p className='text-2xl font-bold text-primary'>
                  {exercise.load || 'BW'}
                </p>
                <p className='text-sm text-muted-foreground'>Load</p>
              </div>
            </div>

            {/* Instructions */}
            <div className='space-y-2'>
              <h4 className='font-medium'>Instructions:</h4>
              <ul className='space-y-1'>
                {exercise.instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className='text-sm text-muted-foreground flex items-start gap-2'
                  >
                    <span className='text-primary'>•</span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>

            {/* Set Tracking */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h4 className='font-medium'>Progress:</h4>
                <span className='text-sm text-muted-foreground'>
                  {completedSets[exercise.id] || 0} / {exercise.sets} sets
                </span>
              </div>

              <div className='grid grid-cols-5 gap-2'>
                {Array.from({ length: exercise.sets }, (_, index) => (
                  <Button
                    key={index}
                    variant={
                      (completedSets[exercise.id] || 0) > index
                        ? 'default'
                        : 'outline'
                    }
                    size='sm'
                    onClick={() => handleSetComplete(exercise.id)}
                    disabled={(completedSets[exercise.id] || 0) > index}
                    className='aspect-square'
                  >
                    {(completedSets[exercise.id] || 0) > index ? (
                      <CheckCircle className='h-4 w-4' />
                    ) : (
                      index + 1
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {isExerciseComplete(exercise.id, exercise.sets) && (
              <Card className='border-green-500 bg-green-50'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3 mb-3'>
                    <CheckCircle className='h-5 w-5 text-green-600' />
                    <span className='font-medium text-green-800'>
                      Exercise Complete!
                    </span>
                  </div>
                  <p className='text-sm text-green-700 mb-3'>
                    Please rate your effort level before moving on.
                  </p>
                  {/* RPE Rating for completed exercise */}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Zap className='h-4 w-4 text-primary' />
                      <span className='font-medium'>
                        Final RPE: {rpe[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={rpe}
                      onValueChange={setRpe}
                      max={10}
                      min={1}
                      step={1}
                      className='w-full'
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* RPE Rating - only show if exercise not complete */}
            {!isExerciseComplete(exercise.id, exercise.sets) && (
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Zap className='h-4 w-4 text-primary' />
                  <h4 className='font-medium'>
                    Effort Level (RPE): {rpe[0]}/10
                  </h4>
                </div>
                <Slider
                  value={rpe}
                  onValueChange={setRpe}
                  max={10}
                  min={1}
                  step={1}
                  className='w-full'
                />
                <div className='flex justify-between text-xs text-muted-foreground'>
                  <span>Very Easy</span>
                  <span>Moderate</span>
                  <span>Max Effort</span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <MessageSquare className='h-4 w-4 text-primary' />
                <h4 className='font-medium'>Notes:</h4>
              </div>
              <Textarea
                placeholder='How did this exercise feel? Any adjustments needed?'
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className='min-h-[80px]'
              />
            </div>

            <div className='space-y-3 pt-4'>
              {autoAdvanceEnabled &&
                !isExerciseComplete(exercise.id, exercise.sets) && (
                  <div className='flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded'>
                    <ArrowRight className='h-4 w-4' />
                    <span>
                      Auto-advance enabled - will move to next exercise when
                      complete
                    </span>
                  </div>
                )}

              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={() =>
                    setCurrentExercise(Math.max(0, currentExercise - 1))
                  }
                  disabled={currentExercise === 0}
                  className='flex-1'
                >
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    setCurrentExercise(
                      Math.min(exercises.length - 1, currentExercise + 1)
                    )
                  }
                  disabled={currentExercise === exercises.length - 1}
                  className='flex-1'
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Micro-Break Suggestion */}
      {(currentExercise + 1) % 3 === 0 &&
        currentExercise < exercises.length - 1 && (
          <Card className='border-accent'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-accent rounded-full'>
                  <Star className='h-4 w-4 text-accent-foreground' />
                </div>
                <div>
                  <p className='font-medium'>Micro-Break Time! 🎉</p>
                  <p className='text-sm text-muted-foreground'>
                    Take 2 minutes to hydrate and do some light stretching
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
