'use client';

import { useState } from 'react';
import { useAIIntelligence } from '@/lib/hooks/use-ai-intelligence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Activity,
  Zap,
  Shield,
  Dumbbell,
  Heart,
} from 'lucide-react';

interface AIIntelligenceDisplayProps {
  sessions: any[];
  checkIns: any[];
  progressMetrics: any[];
  currentPhase?: string;
  availableEquipment?: string[];
}

export function AIIntelligenceDisplay({
  sessions = [],
  checkIns = [],
  progressMetrics = [],
  currentPhase = 'build',
  availableEquipment = ['bodyweight', 'barbell', 'weights', 'bench'],
}: AIIntelligenceDisplayProps) {
  const {
    behaviorInsights,
    performanceForecast,
    adaptiveRecommendations,
    isLoading,
    error,
    lastUpdated,
    refreshAll,
  } = useAIIntelligence(
    sessions,
    checkIns,
    progressMetrics,
    currentPhase,
    availableEquipment
  );

  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading && !behaviorInsights && !performanceForecast) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center space-x-2'>
            <RefreshCw className='h-4 w-4 animate-spin' />
            <span>Analyzing your training data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center space-x-2 text-red-600'>
            <AlertTriangle className='h-4 w-4' />
            <span>Error: {error}</span>
          </div>
          <Button onClick={refreshAll} className='mt-4' size='sm'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Brain className='h-6 w-6 text-primary' />
          <h2 className='text-2xl font-bold'>AI Intelligence</h2>
        </div>
        <div className='flex items-center space-x-2'>
          {lastUpdated && (
            <span className='text-sm text-muted-foreground'>
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
          <Button onClick={refreshAll} size='sm' disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='behavior'>Behavior</TabsTrigger>
          <TabsTrigger value='performance'>Performance</TabsTrigger>
          <TabsTrigger value='recommendations'>Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {/* Training Consistency */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium flex items-center'>
                  <Activity className='h-4 w-4 mr-2' />
                  Training Consistency
                </CardTitle>
              </CardHeader>
              <CardContent>
                {behaviorInsights ? (
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Weekly Frequency</span>
                      <span className='font-medium'>
                        {behaviorInsights.patterns.consistency.weeklyFrequency}
                        /week
                      </span>
                    </div>
                    <Progress
                      value={
                        behaviorInsights.patterns.consistency.weeklyFrequency *
                        20
                      }
                      className='h-2'
                    />
                    <div className='flex justify-between text-sm'>
                      <span>Streak</span>
                      <span className='font-medium'>
                        {behaviorInsights.patterns.consistency.streakLength}{' '}
                        days
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className='text-sm text-muted-foreground'>
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Trend */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium flex items-center'>
                  <TrendingUp className='h-4 w-4 mr-2' />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceForecast ? (
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Overall Progress</span>
                      <Badge
                        variant={
                          performanceForecast.strength.trend === 'improving'
                            ? 'default'
                            : performanceForecast.strength.trend === 'plateau'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {performanceForecast.strength.trend}
                      </Badge>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {performanceForecast.strength.rate > 0 ? '+' : ''}
                      {performanceForecast.strength.rate}% per week
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Confidence:{' '}
                      {Math.round(
                        performanceForecast.strength.confidence * 100
                      )}
                      %
                    </div>
                  </div>
                ) : (
                  <div className='text-sm text-muted-foreground'>
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Injury Risk */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium flex items-center'>
                  <Shield className='h-4 w-4 mr-2' />
                  Injury Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceForecast ? (
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm'>Risk Level</span>
                      <Badge
                        variant={
                          performanceForecast.injuryRisk.overallRisk === 'low'
                            ? 'default'
                            : performanceForecast.injuryRisk.overallRisk ===
                                'medium'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {performanceForecast.injuryRisk.overallRisk}
                      </Badge>
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Score: {performanceForecast.injuryRisk.riskScore}/100
                    </div>
                    {performanceForecast.injuryRisk.recommendations.length >
                      0 && (
                      <div className='text-xs text-muted-foreground'>
                        {performanceForecast.injuryRisk.recommendations[0]}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='text-sm text-muted-foreground'>
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Recommendations */}
          {adaptiveRecommendations && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Target className='h-5 w-5 mr-2' />
                  Quick Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {adaptiveRecommendations.nextSessionFocus.map(
                    (focus, index) => (
                      <div key={index} className='flex items-center space-x-2'>
                        <CheckCircle className='h-4 w-4 text-green-500' />
                        <span className='text-sm'>{focus}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value='behavior' className='space-y-4'>
          {behaviorInsights ? (
            <div className='space-y-4'>
              {/* Workout Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle>Workout Patterns</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <h4 className='font-medium mb-2'>Preferred Days</h4>
                      <div className='flex flex-wrap gap-2'>
                        {behaviorInsights.patterns.preferredDays.map(
                          (day, index) => (
                            <Badge key={index} variant='outline'>
                              {day}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Exercise Preferences</h4>
                      <div className='space-y-1'>
                        {Object.entries(
                          behaviorInsights.patterns.exercisePreferences
                        ).map(([type, percentage]) => (
                          <div
                            key={type}
                            className='flex justify-between text-sm'
                          >
                            <span className='capitalize'>{type}</span>
                            <span>{Math.round(percentage)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Habit Formation */}
              <Card>
                <CardHeader>
                  <CardTitle>Habit Formation</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-3'>
                    <div>
                      <h4 className='font-medium mb-2'>Workout Habit</h4>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span>Strength</span>
                          <span>
                            {Math.round(
                              behaviorInsights.habits.workoutHabit.strength *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            behaviorInsights.habits.workoutHabit.strength * 100
                          }
                          className='h-2'
                        />
                        <div className='flex justify-between text-sm'>
                          <span>Consistency</span>
                          <span>
                            {Math.round(
                              behaviorInsights.habits.workoutHabit.consistency *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            behaviorInsights.habits.workoutHabit.consistency *
                            100
                          }
                          className='h-2'
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Recovery Habits</h4>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span>Sleep Quality</span>
                          <span>
                            {Math.round(
                              behaviorInsights.habits.recoveryHabit
                                .sleepQuality * 100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            behaviorInsights.habits.recoveryHabit.sleepQuality *
                            100
                          }
                          className='h-2'
                        />
                        <div className='flex justify-between text-sm'>
                          <span>Nutrition</span>
                          <span>
                            {Math.round(
                              behaviorInsights.habits.recoveryHabit
                                .nutritionConsistency * 100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            behaviorInsights.habits.recoveryHabit
                              .nutritionConsistency * 100
                          }
                          className='h-2'
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Goal Alignment</h4>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span>Short-term</span>
                          <span>
                            {Math.round(
                              behaviorInsights.habits.goalAlignment.shortTerm *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            behaviorInsights.habits.goalAlignment.shortTerm *
                            100
                          }
                          className='h-2'
                        />
                        <div className='flex justify-between text-sm'>
                          <span>Long-term</span>
                          <span>
                            {Math.round(
                              behaviorInsights.habits.goalAlignment.longTerm *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            behaviorInsights.habits.goalAlignment.longTerm * 100
                          }
                          className='h-2'
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations and Insights */}
              <div className='grid gap-4 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-green-600'>
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {behaviorInsights.opportunities.map(
                        (opportunity, index) => (
                          <div
                            key={index}
                            className='flex items-start space-x-2'
                          >
                            <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0' />
                            <span className='text-sm'>{opportunity}</span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-orange-600'>
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {behaviorInsights.riskFactors.map((risk, index) => (
                        <div key={index} className='flex items-start space-x-2'>
                          <AlertTriangle className='h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0' />
                          <span className='text-sm'>{risk}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className='p-6'>
                <div className='text-center text-muted-foreground'>
                  No behavior analysis data available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value='performance' className='space-y-4'>
          {performanceForecast ? (
            <div className='space-y-4'>
              {/* Strength Progression */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Dumbbell className='h-5 w-5 mr-2' />
                    Strength Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <h4 className='font-medium mb-2'>Current Level</h4>
                      <div className='text-2xl font-bold'>
                        {performanceForecast.strength.currentLevel}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Confidence:{' '}
                        {Math.round(
                          performanceForecast.strength.confidence * 100
                        )}
                        %
                      </div>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Predicted Level</h4>
                      <div className='text-2xl font-bold'>
                        {performanceForecast.strength.predictedLevel}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Time to goal: {performanceForecast.strength.timeToGoal}{' '}
                        weeks
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fatigue Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Heart className='h-5 w-5 mr-2' />
                    Fatigue Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <h4 className='font-medium mb-2'>Current Fatigue</h4>
                      <div className='text-2xl font-bold'>
                        {performanceForecast.fatigue.currentFatigue}/10
                      </div>
                      <Progress
                        value={performanceForecast.fatigue.currentFatigue * 10}
                        className='h-2 mt-2'
                      />
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Predicted Fatigue</h4>
                      <div className='text-2xl font-bold'>
                        {performanceForecast.fatigue.predictedFatigue}/10
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Recovery time:{' '}
                        {performanceForecast.fatigue.timeToRecovery} days
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2'>Risk Level</h4>
                    <Badge
                      variant={
                        performanceForecast.fatigue.riskLevel === 'low'
                          ? 'default'
                          : performanceForecast.fatigue.riskLevel === 'medium'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {performanceForecast.fatigue.riskLevel}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Optimal Load */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Target className='h-5 w-5 mr-2' />
                    Optimal Training Load
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <div>
                      <h4 className='font-medium mb-2'>Recommended RPE</h4>
                      <div className='text-xl font-bold'>
                        {performanceForecast.optimalLoad.recommendedRPE}
                      </div>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Duration</h4>
                      <div className='text-xl font-bold'>
                        {performanceForecast.optimalLoad.recommendedDuration}{' '}
                        min
                      </div>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Frequency</h4>
                      <div className='text-xl font-bold'>
                        {performanceForecast.optimalLoad.recommendedFrequency}
                        /week
                      </div>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Progression</h4>
                      <div className='text-xl font-bold'>
                        {performanceForecast.optimalLoad.progressionRate * 100}
                        %/week
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className='p-6'>
                <div className='text-center text-muted-foreground'>
                  No performance prediction data available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value='recommendations' className='space-y-4'>
          {adaptiveRecommendations ? (
            <div className='space-y-4'>
              {/* Session Recommendation */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Zap className='h-5 w-5 mr-2' />
                    Next Session Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <h4 className='font-medium mb-2'>Session Type</h4>
                      <Badge variant='outline' className='text-lg px-3 py-1'>
                        {adaptiveRecommendations.sessionRecommendation.type}
                      </Badge>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Intensity</h4>
                      <Badge
                        variant={
                          adaptiveRecommendations.sessionRecommendation
                            .intensity === 'low'
                            ? 'secondary'
                            : adaptiveRecommendations.sessionRecommendation
                                  .intensity === 'moderate'
                              ? 'default'
                              : 'destructive'
                        }
                        className='text-lg px-3 py-1'
                      >
                        {
                          adaptiveRecommendations.sessionRecommendation
                            .intensity
                        }
                      </Badge>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Duration</h4>
                      <div className='text-lg font-bold'>
                        {adaptiveRecommendations.sessionRecommendation.duration}{' '}
                        minutes
                      </div>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Expected RPE</h4>
                      <div className='text-lg font-bold'>
                        {
                          adaptiveRecommendations.sessionRecommendation
                            .expectedRPE
                        }
                        /10
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className='font-medium mb-2'>Focus Areas</h4>
                    <div className='flex flex-wrap gap-2'>
                      {adaptiveRecommendations.sessionRecommendation.focus.map(
                        (focus, index) => (
                          <Badge key={index} variant='outline'>
                            {focus}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Exercise Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Exercises</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {adaptiveRecommendations.exerciseRecommendations
                      .slice(0, 5)
                      .map((exercise, index) => (
                        <div key={index} className='border rounded-lg p-4'>
                          <div className='flex items-center justify-between mb-2'>
                            <h4 className='font-medium'>{exercise.name}</h4>
                            <Badge variant='outline'>
                              {exercise.difficulty}
                            </Badge>
                          </div>
                          <div className='grid gap-2 md:grid-cols-2'>
                            <div>
                              <span className='text-sm text-muted-foreground'>
                                Type:{' '}
                              </span>
                              <span className='text-sm capitalize'>
                                {exercise.type}
                              </span>
                            </div>
                            <div>
                              <span className='text-sm text-muted-foreground'>
                                Duration:{' '}
                              </span>
                              <span className='text-sm'>
                                {exercise.estimatedDuration} min
                              </span>
                            </div>
                            <div>
                              <span className='text-sm text-muted-foreground'>
                                RPE:{' '}
                              </span>
                              <span className='text-sm'>
                                {exercise.rpeRange[0]}-{exercise.rpeRange[1]}
                              </span>
                            </div>
                            <div>
                              <span className='text-sm text-muted-foreground'>
                                Sets:{' '}
                              </span>
                              <span className='text-sm'>
                                {exercise.progression.sets} x{' '}
                                {exercise.progression.reps}
                              </span>
                            </div>
                          </div>
                          <div className='mt-2'>
                            <span className='text-sm text-muted-foreground'>
                              Target:{' '}
                            </span>
                            <span className='text-sm'>
                              {exercise.targetMuscles.join(', ')}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Long-term Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Long-term Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {adaptiveRecommendations.longTermGoals.map(
                      (goal, index) => (
                        <div
                          key={index}
                          className='flex items-center space-x-2'
                        >
                          <Target className='h-4 w-4 text-primary' />
                          <span className='text-sm'>{goal}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className='p-6'>
                <div className='text-center text-muted-foreground'>
                  No adaptive recommendations available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
