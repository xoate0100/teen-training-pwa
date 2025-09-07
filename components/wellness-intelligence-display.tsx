'use client';

import { useState, useEffect } from 'react';
import { useWellnessIntelligence } from '@/lib/hooks/use-wellness-intelligence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Moon,
  Zap,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Activity,
  Brain,
  Target,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react';

interface WellnessIntelligenceDisplayProps {
  sessions: any[];
  checkIns: any[];
  moodData: any[];
  sleepData: any[];
  energyData: any[];
  recoveryData: any[];
  availableExercises: any[];
  userGoals: string[];
  userId?: string;
}

export function WellnessIntelligenceDisplay({
  sessions = [],
  checkIns = [],
  moodData = [],
  sleepData = [],
  energyData = [],
  recoveryData = [],
  availableExercises = [],
  userGoals = [],
  userId = 'default-user',
}: WellnessIntelligenceDisplayProps) {
  const {
    wellnessInsights,
    moodAnalysis,
    sleepAnalysis,
    energyAnalysis,
    realTimeAdjustments,
    safetyProtocols,
    healthPrediction,
    overtrainingPrediction,
    burnoutAssessment,
    optimalTrainingLoad,
    recoveryRecommendations,
    isLoading,
    error,
    lastUpdated,
    generateWellnessInsights,
    refreshAll,
    clearError,
  } = useWellnessIntelligence(
    sessions,
    checkIns,
    moodData,
    sleepData,
    energyData,
    recoveryData,
    availableExercises,
    userGoals,
    userId
  );

  const [activeTab, setActiveTab] = useState('overview');

  // Auto-generate insights on mount
  useEffect(() => {
    if (
      moodData.length > 0 ||
      sleepData.length > 0 ||
      energyData.length > 0 ||
      recoveryData.length > 0
    ) {
      generateWellnessInsights(
        moodData,
        sleepData,
        energyData,
        recoveryData,
        sessions
      );
    }
  }, [
    moodData,
    sleepData,
    energyData,
    recoveryData,
    sessions,
    generateWellnessInsights,
  ]);

  if (isLoading && !wellnessInsights && !healthPrediction) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center space-x-2'>
            <RefreshCw className='h-4 w-4 animate-spin' />
            <span>Analyzing wellness data...</span>
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
          <Button onClick={clearError} className='mt-4' size='sm'>
            Clear Error
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
          <Heart className='h-6 w-6 text-primary' />
          <h2 className='text-2xl font-bold'>Wellness Intelligence</h2>
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
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='wellness'>Wellness</TabsTrigger>
          <TabsTrigger value='modifications'>Modifications</TabsTrigger>
          <TabsTrigger value='predictions'>Predictions</TabsTrigger>
          <TabsTrigger value='alerts'>Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {/* Overall Health Score */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Overall Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {healthPrediction?.overallHealth.score || 'N/A'}
                </div>
                <div className='flex items-center space-x-1 text-xs text-muted-foreground'>
                  {healthPrediction?.overallHealth.trend === 'improving' ? (
                    <TrendingUp className='h-3 w-3 text-green-500' />
                  ) : healthPrediction?.overallHealth.trend === 'declining' ? (
                    <TrendingDown className='h-3 w-3 text-red-500' />
                  ) : (
                    <Activity className='h-3 w-3 text-blue-500' />
                  )}
                  <span className='capitalize'>
                    {healthPrediction?.overallHealth.trend || 'stable'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Overtraining Risk */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Overtraining Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {overtrainingPrediction?.riskLevel || 'N/A'}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {overtrainingPrediction
                    ? `${Math.round(overtrainingPrediction.probability * 100)}% probability`
                    : 'No data'}
                </div>
              </CardContent>
            </Card>

            {/* Burnout Risk */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Burnout Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {burnoutAssessment?.riskLevel || 'N/A'}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {burnoutAssessment
                    ? `${Math.round(burnoutAssessment.probability * 100)}% probability`
                    : 'No data'}
                </div>
              </CardContent>
            </Card>

            {/* Recovery Status */}
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Recovery Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {recoveryRecommendations?.currentRecovery || 'N/A'}
                </div>
                <div className='text-xs text-muted-foreground'>
                  {recoveryRecommendations
                    ? `${recoveryRecommendations.recoveryTime}h needed`
                    : 'No data'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Moon className='h-5 w-5 mr-2' />
                  Sleep Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>
                  {sleepAnalysis?.overallQuality || 'N/A'}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {sleepAnalysis
                    ? `Consistency: ${Math.round(sleepAnalysis.consistency * 100)}%`
                    : 'No data available'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Zap className='h-5 w-5 mr-2' />
                  Energy Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>
                  {energyAnalysis?.averageEnergy || 'N/A'}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {energyAnalysis
                    ? `Stability: ${Math.round(energyAnalysis.energyStability * 100)}%`
                    : 'No data available'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Wellness Tab */}
        <TabsContent value='wellness' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* Mood Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Brain className='h-5 w-5 mr-2' />
                  Mood Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {moodAnalysis ? (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Dominant Mood</span>
                      <Badge variant='outline' className='capitalize'>
                        {moodAnalysis.dominantMood}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Stability</span>
                      <span className='text-sm'>
                        {Math.round(moodAnalysis.moodStability * 100)}%
                      </span>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>
                        Improvement Areas
                      </h4>
                      <ul className='text-sm text-muted-foreground space-y-1'>
                        {moodAnalysis.improvementAreas.map(
                          (area: string, index: number) => (
                            <li key={index} className='flex items-center'>
                              <Target className='h-3 w-3 mr-2' />
                              {area}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className='text-center text-muted-foreground'>
                    No mood data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sleep Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Moon className='h-5 w-5 mr-2' />
                  Sleep Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {sleepAnalysis ? (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Quality</span>
                      <span className='text-sm'>
                        {sleepAnalysis.overallQuality}/10
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Duration</span>
                      <span className='text-sm'>
                        {sleepAnalysis.optimalTiming.duration}h
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Efficiency</span>
                      <span className='text-sm'>
                        {Math.round(sleepAnalysis.efficiency)}%
                      </span>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>
                        Recommendations
                      </h4>
                      <ul className='text-sm text-muted-foreground space-y-1'>
                        {sleepAnalysis.recommendations.map(
                          (rec: string, index: number) => (
                            <li key={index} className='flex items-center'>
                              <CheckCircle className='h-3 w-3 mr-2' />
                              {rec}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className='text-center text-muted-foreground'>
                    No sleep data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Modifications Tab */}
        <TabsContent value='modifications' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* Real-time Adjustments */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Activity className='h-5 w-5 mr-2' />
                  Real-time Adjustments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {realTimeAdjustments.length > 0 ? (
                  <div className='space-y-3'>
                    {realTimeAdjustments.map((adjustment, index) => (
                      <div key={index} className='p-3 border rounded-lg'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='font-medium'>
                            {adjustment.exerciseName}
                          </span>
                          <Badge variant='outline'>
                            {adjustment.adjustment.type}
                          </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground mb-2'>
                          {adjustment.adjustment.reason}
                        </p>
                        {adjustment.safetyAlert && (
                          <div className='p-2 bg-yellow-50 border border-yellow-200 rounded text-sm'>
                            <div className='flex items-center'>
                              <AlertTriangle className='h-4 w-4 mr-2 text-yellow-600' />
                              <span className='text-yellow-800'>
                                {adjustment.safetyAlert.message}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center text-muted-foreground'>
                    No real-time adjustments available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safety Protocols */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Shield className='h-5 w-5 mr-2' />
                  Safety Protocols
                </CardTitle>
              </CardHeader>
              <CardContent>
                {safetyProtocols.length > 0 ? (
                  <div className='space-y-3'>
                    {safetyProtocols.map((protocol, index) => (
                      <div key={index} className='p-3 border rounded-lg'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='font-medium capitalize'>
                            {protocol.type}
                          </span>
                          <Badge
                            variant={
                              protocol.level === 'critical'
                                ? 'destructive'
                                : 'default'
                            }
                          >
                            {protocol.level}
                          </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground mb-2'>
                          {protocol.message}
                        </p>
                        <p className='text-sm font-medium'>
                          Action: {protocol.action}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center text-muted-foreground'>
                    No safety protocols active
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value='predictions' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* Overtraining Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <AlertTriangle className='h-5 w-5 mr-2' />
                  Overtraining Prediction
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {overtrainingPrediction ? (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Risk Level</span>
                      <Badge
                        variant={
                          overtrainingPrediction.riskLevel === 'critical'
                            ? 'destructive'
                            : overtrainingPrediction.riskLevel === 'high'
                              ? 'destructive'
                              : overtrainingPrediction.riskLevel === 'moderate'
                                ? 'default'
                                : 'secondary'
                        }
                      >
                        {overtrainingPrediction.riskLevel}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Probability</span>
                      <span className='text-sm'>
                        {Math.round(overtrainingPrediction.probability * 100)}%
                      </span>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>Symptoms</h4>
                      <ul className='text-sm text-muted-foreground space-y-1'>
                        {overtrainingPrediction.symptoms.map(
                          (symptom: string, index: number) => (
                            <li key={index} className='flex items-center'>
                              <XCircle className='h-3 w-3 mr-2 text-red-500' />
                              {symptom}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>
                        Recommendations
                      </h4>
                      <ul className='text-sm text-muted-foreground space-y-1'>
                        {overtrainingPrediction.recommendations.map(
                          (rec: string, index: number) => (
                            <li key={index} className='flex items-center'>
                              <CheckCircle className='h-3 w-3 mr-2 text-green-500' />
                              {rec}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className='text-center text-muted-foreground'>
                    No overtraining prediction available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Burnout Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Brain className='h-5 w-5 mr-2' />
                  Burnout Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {burnoutAssessment ? (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Risk Level</span>
                      <Badge
                        variant={
                          burnoutAssessment.riskLevel === 'critical'
                            ? 'destructive'
                            : burnoutAssessment.riskLevel === 'high'
                              ? 'destructive'
                              : burnoutAssessment.riskLevel === 'moderate'
                                ? 'default'
                                : 'secondary'
                        }
                      >
                        {burnoutAssessment.riskLevel}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Probability</span>
                      <span className='text-sm'>
                        {Math.round(burnoutAssessment.probability * 100)}%
                      </span>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>
                        Warning Signs
                      </h4>
                      <ul className='text-sm text-muted-foreground space-y-1'>
                        {burnoutAssessment.warningSigns.map(
                          (sign: string, index: number) => (
                            <li key={index} className='flex items-center'>
                              <AlertTriangle className='h-3 w-3 mr-2 text-yellow-500' />
                              {sign}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className='text-sm font-medium mb-2'>
                        Interventions
                      </h4>
                      <ul className='text-sm text-muted-foreground space-y-1'>
                        {burnoutAssessment.interventions.map(
                          (intervention: string, index: number) => (
                            <li key={index} className='flex items-center'>
                              <CheckCircle className='h-3 w-3 mr-2 text-green-500' />
                              {intervention}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className='text-center text-muted-foreground'>
                    No burnout assessment available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Optimal Training Load */}
          {optimalTrainingLoad && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Target className='h-5 w-5 mr-2' />
                  Optimal Training Load
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <h4 className='text-sm font-medium mb-2'>
                      Current vs Optimal
                    </h4>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span className='text-sm'>Current Load</span>
                        <span className='text-sm font-medium'>
                          {optimalTrainingLoad.currentLoad}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-sm'>Optimal Load</span>
                        <span className='text-sm font-medium'>
                          {optimalTrainingLoad.optimalLoad}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-sm'>Load Ratio</span>
                        <span className='text-sm font-medium'>
                          {optimalTrainingLoad.loadRatio.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className='text-sm font-medium mb-2'>
                      Recommendations
                    </h4>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span className='text-sm'>Intensity</span>
                        <span className='text-sm font-medium'>
                          {optimalTrainingLoad.recommendations.intensity}/10
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-sm'>Volume</span>
                        <span className='text-sm font-medium'>
                          {optimalTrainingLoad.recommendations.volume}{' '}
                          sessions/week
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-sm'>Duration</span>
                        <span className='text-sm font-medium'>
                          {optimalTrainingLoad.recommendations.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value='alerts' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <AlertTriangle className='h-5 w-5 mr-2' />
                Health Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {healthPrediction?.alerts &&
              healthPrediction.alerts.length > 0 ? (
                <div className='space-y-4'>
                  {healthPrediction.alerts.map((alert, index) => (
                    <div key={index} className='p-4 border rounded-lg'>
                      <div className='flex items-start space-x-3'>
                        <div className='flex-shrink-0'>
                          {alert.type === 'critical' ? (
                            <XCircle className='h-5 w-5 text-red-500' />
                          ) : alert.type === 'warning' ? (
                            <AlertTriangle className='h-5 w-5 text-yellow-500' />
                          ) : (
                            <Info className='h-5 w-5 text-blue-500' />
                          )}
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center justify-between mb-2'>
                            <h4 className='font-medium'>{alert.message}</h4>
                            <Badge
                              variant={
                                alert.priority === 'high'
                                  ? 'destructive'
                                  : alert.priority === 'medium'
                                    ? 'default'
                                    : 'secondary'
                              }
                            >
                              {alert.priority}
                            </Badge>
                          </div>
                          <p className='text-sm text-muted-foreground'>
                            Action: {alert.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center text-muted-foreground'>
                  No health alerts at this time
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
