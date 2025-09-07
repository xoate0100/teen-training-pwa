'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Brain, AlertCircle } from 'lucide-react';
import { ExerciseInterface } from '@/components/exercise-interface';
import { Button } from '@/components/ui/button';
import {
  sessionProgramIntegration,
  SessionProgram,
} from '@/lib/services/session-program-integration';
import { useUser } from '@/lib/contexts/user-context';

export default function SessionPage() {
  const { currentUser } = useUser();
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [exerciseData, setExerciseData] = useState<any[]>([]);
  const [showAutoAdvance, setShowAutoAdvance] = useState(false);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(3);

  // Program integration state
  const [sessionProgram, setSessionProgram] = useState<SessionProgram | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Load session program on component mount
  useEffect(() => {
    const loadSessionProgram = async () => {
      if (!currentUser?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get session type from URL params or default to strength
        const urlParams = new URLSearchParams(window.location.search);
        const sessionType = urlParams.get('type') || 'strength';

        // Generate session program
        const program = await sessionProgramIntegration.generateSessionProgram(
          currentUser.id,
          sessionType
        );

        // Get session context for recommendations
        const context = await sessionProgramIntegration.fetchProgramData(
          currentUser.id
        );
        const sessionRecommendations =
          sessionProgramIntegration.getSessionRecommendations(context);

        setSessionProgram(program);
        setRecommendations(sessionRecommendations);

        // Set session start time
        setSessionStartTime(new Date());
      } catch (err) {
        console.error('Error loading session program:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load session program'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionProgram();
  }, [currentUser?.id]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const interval = setInterval(() => {
      if (sessionStartTime) {
        const now = new Date();
        const duration = Math.floor(
          (now.getTime() - sessionStartTime.getTime()) / 1000
        );
        setSessionDuration(duration);
      }
    }, 1000);

    // eslint-disable-next-line no-undef
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exercises = sessionProgram?.exercises || [];
  const sessionProgress =
    exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0;

  const handleExerciseComplete = (data: any) => {
    const newExerciseData = [...exerciseData, data];
    setExerciseData(newExerciseData);
    setCompletedExercises(prev => prev + 1);

    if (currentExercise < exercises.length - 1) {
      setShowAutoAdvance(true);
      setAutoAdvanceCountdown(3);

      // eslint-disable-next-line no-undef
      const countdownInterval = setInterval(() => {
        setAutoAdvanceCountdown(prev => {
          if (prev <= 1) {
            // eslint-disable-next-line no-undef
            clearInterval(countdownInterval);
            setShowAutoAdvance(false);
            setCurrentExercise(prevEx => prevEx + 1);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSessionComplete(true);
    }
  };

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
    }
  };

  const cancelAutoAdvance = () => {
    setShowAutoAdvance(false);
    setAutoAdvanceCountdown(3);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-background p-4 flex items-center justify-center'>
        <Card className='w-full max-w-md text-center border-2 border-primary/20 shadow-xl'>
          <CardContent className='p-8'>
            <div className='animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4'></div>
            <h2 className='text-2xl font-bold mb-2 text-primary'>
              Loading Your Session
            </h2>
            <p className='text-muted-foreground'>
              Analyzing your progress and generating personalized exercises...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-background p-4 flex items-center justify-center'>
        <Card className='w-full max-w-md text-center border-2 border-red-200 shadow-xl'>
          <CardContent className='p-8'>
            <div className='text-6xl mb-4'>⚠️</div>
            <h2 className='text-2xl font-bold mb-2 text-red-600'>
              Session Error
            </h2>
            <p className='text-muted-foreground mb-6'>{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className='w-full h-12 text-lg font-semibold'
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className='min-h-screen bg-background p-4 flex items-center justify-center'>
        <Card className='w-full max-w-md text-center border-2 border-primary/20 shadow-xl'>
          <CardContent className='p-8'>
            <div className='text-8xl mb-6 animate-bounce'>🎉</div>
            <h2 className='text-3xl font-bold mb-4 text-primary'>
              Amazing Work!
            </h2>
            <p className='text-lg text-muted-foreground mb-6'>
              You crushed all {exercises.length} exercises like a champion!
            </p>
            <div className='space-y-3 text-base bg-muted/50 p-4 rounded-lg mb-6'>
              <div className='flex justify-between'>
                <span className='font-medium'>Total Time:</span>
                <span className='font-bold text-primary'>
                  {formatDuration(sessionDuration)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Exercises Completed:</span>
                <span className='font-bold text-primary'>
                  {completedExercises}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>You Earned:</span>
                <span className='font-bold text-primary'>+50 XP 🏆</span>
              </div>
            </div>
            <Button
              className='w-full h-14 text-lg font-semibold'
              onClick={() => (window.location.href = '/')}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background p-4'>
      {showAutoAdvance && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <Card className='w-full max-w-sm text-center border-2 border-primary shadow-2xl'>
            <CardContent className='p-6'>
              <div className='text-4xl mb-4'>✨</div>
              <h3 className='text-xl font-bold mb-2'>Great Job!</h3>
              <p className='text-muted-foreground mb-4'>
                Moving to next exercise in...
              </p>
              <div className='text-6xl font-bold text-primary mb-4'>
                {autoAdvanceCountdown}
              </div>
              <Button
                variant='outline'
                onClick={cancelAutoAdvance}
                className='w-full h-12 font-semibold bg-transparent'
              >
                Stay Here
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className='mb-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-foreground mb-2'>
              {sessionProgram?.name || 'Training Session'}
            </h1>
            <p className='text-muted-foreground'>
              {sessionProgram?.phase.charAt(0).toUpperCase() +
                sessionProgram?.phase.slice(1)}{' '}
              Phase • Week {sessionProgram?.week}
            </p>
          </div>
          <Badge variant='secondary' className='text-lg px-3 py-1'>
            <Clock className='h-4 w-4 mr-1' />
            {formatDuration(sessionDuration)}
          </Badge>
        </div>

        {/* Program Intelligence Display */}
        {sessionProgram && (
          <Card className='border-blue-200 bg-blue-50/50'>
            <CardContent className='p-4'>
              <div className='flex items-start gap-3'>
                <Brain className='h-5 w-5 text-blue-600 mt-0.5' />
                <div className='flex-1'>
                  <h3 className='font-semibold text-blue-800 mb-2'>
                    AI-Powered Session
                  </h3>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-blue-700 font-medium'>
                        Intensity:
                      </span>
                      <span className='ml-2 text-blue-600 capitalize'>
                        {sessionProgram.intensity}
                      </span>
                    </div>
                    <div>
                      <span className='text-blue-700 font-medium'>Volume:</span>
                      <span className='ml-2 text-blue-600 capitalize'>
                        {sessionProgram.volume}
                      </span>
                    </div>
                    <div>
                      <span className='text-blue-700 font-medium'>Focus:</span>
                      <span className='ml-2 text-blue-600'>
                        {sessionProgram.focus.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className='text-blue-700 font-medium'>
                        Duration:
                      </span>
                      <span className='ml-2 text-blue-600'>
                        ~{sessionProgram.estimatedDuration} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className='border-yellow-200 bg-yellow-50/50'>
            <CardContent className='p-4'>
              <div className='flex items-start gap-3'>
                <AlertCircle className='h-5 w-5 text-yellow-600 mt-0.5' />
                <div className='flex-1'>
                  <h3 className='font-semibold text-yellow-800 mb-2'>
                    Personalized Recommendations
                  </h3>
                  <ul className='space-y-1'>
                    {recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className='text-sm text-yellow-700 flex items-start gap-2'
                      >
                        <span className='text-yellow-600 mt-1'>•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className='p-4'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Session Progress</span>
                <span className='text-sm text-muted-foreground'>
                  {completedExercises} / {exercises.length} exercises
                </span>
              </div>
              <Progress value={sessionProgress} className='h-2' />
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span>
                  Started{' '}
                  {sessionStartTime
                    ? sessionStartTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </span>
                <span>
                  Est. {sessionProgram?.estimatedDuration || 25}-
                  {sessionProgram?.estimatedDuration
                    ? sessionProgram.estimatedDuration + 5
                    : 30}{' '}
                  min total
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-primary/20'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Target className='h-5 w-5 text-primary' />
              Coming Up Next
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='space-y-2'>
              {exercises
                .slice(currentExercise, currentExercise + 2)
                .map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className='flex items-center justify-between p-2 bg-muted/50 rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <Badge
                        variant={index === 0 ? 'default' : 'outline'}
                        className='w-6 h-6 p-0 flex items-center justify-center'
                      >
                        {currentExercise + index + 1}
                      </Badge>
                      <span
                        className={`font-medium ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        {exercise.name}
                      </span>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {exercise.sets} × {exercise.reps}
                      {exercise.load && ` • ${exercise.load}`}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {exercises.length > 0 && (
        <ExerciseInterface
          exercise={exercises[currentExercise]}
          exerciseIndex={currentExercise}
          totalExercises={exercises.length}
          onComplete={handleExerciseComplete}
          onNext={handleNextExercise}
          onPrevious={handlePreviousExercise}
        />
      )}
    </div>
  );
}
