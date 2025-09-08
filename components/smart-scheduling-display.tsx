'use client';

import { useSmartScheduling } from '@/lib/hooks/use-smart-scheduling';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  Activity,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';

export function SmartSchedulingDisplay() {
  const {
    nextSession,
    recoveryRecommendation,
    phaseAnalysis,
    isLoading,
    error,
    refreshAll,
    trainingReadiness,
    sessionFocus,
    warnings,
  } = useSmartScheduling();

  if (isLoading) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            <span className='ml-2'>Analyzing schedule...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center text-red-600'>
            <AlertTriangle className='w-5 h-5 mr-2' />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return <Activity className='w-4 h-4' />;
      case 'moderate':
        return <Target className='w-4 h-4' />;
      case 'high':
        return <Zap className='w-4 h-4' />;
      default:
        return <Target className='w-4 h-4' />;
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className='w-5 h-5' />;
    if (score >= 60) return <Target className='w-5 h-5' />;
    return <AlertTriangle className='w-5 h-5' />;
  };

  return (
    <div className='space-y-6'>
      {/* Header with refresh button */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Smart Scheduling</h2>
        <Button onClick={refreshAll} variant='outline' size='sm'>
          <RefreshCw className='w-4 h-4 mr-2' />
          Refresh
        </Button>
      </div>

      {/* Training Readiness */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            {getReadinessIcon(trainingReadiness)}
            Training Readiness
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Readiness Score</span>
            <span
              className={`text-2xl font-bold ${getReadinessColor(trainingReadiness)}`}
            >
              {trainingReadiness}%
            </span>
          </div>
          <Progress value={trainingReadiness} className='h-3' />
          <div className='text-sm text-muted-foreground'>
            {trainingReadiness >= 80 && 'Ready for optimal training'}
            {trainingReadiness >= 60 &&
              trainingReadiness < 80 &&
              'Good for training with some considerations'}
            {trainingReadiness < 60 && 'Consider rest or lighter session'}
          </div>
        </CardContent>
      </Card>

      {/* Next Session Recommendation */}
      {nextSession && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='w-5 h-5' />
              Next Session
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <div className='text-sm text-muted-foreground'>Date</div>
                <div className='font-medium'>
                  {format(new Date(nextSession.date), 'MMM dd, yyyy')}
                </div>
              </div>
              <div>
                <div className='text-sm text-muted-foreground'>Time</div>
                <div className='font-medium'>{nextSession.time}</div>
              </div>
              <div>
                <div className='text-sm text-muted-foreground'>Type</div>
                <Badge variant='outline'>
                  {nextSession.type.charAt(0).toUpperCase() +
                    nextSession.type.slice(1)}
                </Badge>
              </div>
              <div>
                <div className='text-sm text-muted-foreground'>Duration</div>
                <div className='font-medium'>{nextSession.duration} min</div>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Intensity:</span>
                <Badge className={getIntensityColor(nextSession.intensity)}>
                  {getIntensityIcon(nextSession.intensity)}
                  <span className='ml-1 capitalize'>
                    {nextSession.intensity}
                  </span>
                </Badge>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>Priority:</span>
                <Badge
                  variant={
                    nextSession.priority === 'high' ? 'default' : 'secondary'
                  }
                >
                  {nextSession.priority}
                </Badge>
              </div>
            </div>

            <div className='bg-muted rounded-lg p-3'>
              <div className='text-sm'>
                <span className='font-medium'>Reason: </span>
                {nextSession.reason}
              </div>
            </div>

            {nextSession.conflicts.length > 0 && (
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                <div className='flex items-start gap-2'>
                  <AlertTriangle className='w-4 h-4 text-yellow-600 mt-0.5' />
                  <div>
                    <div className='font-medium text-yellow-800'>
                      Conflicts Detected:
                    </div>
                    <ul className='text-sm text-yellow-700 mt-1'>
                      {nextSession.conflicts.map((conflict, index) => (
                        <li key={index}>
                          • {conflict.description} - {conflict.suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recovery Recommendation */}
      {recoveryRecommendation && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Activity className='w-5 h-5' />
              Recovery Status
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div
              className={`p-3 rounded-lg ${
                recoveryRecommendation.shouldRest
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200'
              }`}
            >
              <div className='flex items-center gap-2'>
                {recoveryRecommendation.shouldRest ? (
                  <AlertTriangle className='w-4 h-4 text-red-600' />
                ) : (
                  <CheckCircle className='w-4 h-4 text-green-600' />
                )}
                <span
                  className={`font-medium ${
                    recoveryRecommendation.shouldRest
                      ? 'text-red-800'
                      : 'text-green-800'
                  }`}
                >
                  {recoveryRecommendation.shouldRest
                    ? 'Rest Recommended'
                    : 'Ready to Train'}
                </span>
              </div>
              <div
                className={`text-sm mt-1 ${
                  recoveryRecommendation.shouldRest
                    ? 'text-red-700'
                    : 'text-green-700'
                }`}
              >
                {recoveryRecommendation.reason}
              </div>
            </div>

            {recoveryRecommendation.alternativeActivity && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
                <div className='text-sm'>
                  <span className='font-medium text-blue-800'>
                    Alternative Activity:{' '}
                  </span>
                  <span className='text-blue-700'>
                    {recoveryRecommendation.alternativeActivity}
                    {recoveryRecommendation.duration > 0 &&
                      ` (${recoveryRecommendation.duration} min)`}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Phase Analysis */}
      {phaseAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='w-5 h-5' />
              Program Phase Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium'>
                  {phaseAnalysis.currentPhase.name}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {phaseAnalysis.currentPhase.description}
                </div>
              </div>
              <Badge variant='outline'>
                {Math.round(phaseAnalysis.phaseProgress)}% Complete
              </Badge>
            </div>

            <Progress value={phaseAnalysis.phaseProgress} className='h-2' />

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-lg font-bold text-blue-600'>
                  {phaseAnalysis.currentPhase.intensity}
                </div>
                <div className='text-xs text-muted-foreground'>Intensity</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-green-600'>
                  {phaseAnalysis.currentPhase.volume}
                </div>
                <div className='text-xs text-muted-foreground'>Volume</div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-purple-600'>
                  {Math.round(phaseAnalysis.transitionReadiness)}%
                </div>
                <div className='text-xs text-muted-foreground'>
                  Transition Ready
                </div>
              </div>
              <div className='text-center'>
                <div className='text-lg font-bold text-orange-600'>
                  {phaseAnalysis.currentPhase.duration}w
                </div>
                <div className='text-xs text-muted-foreground'>Duration</div>
              </div>
            </div>

            <div>
              <div className='font-medium text-sm mb-2'>Focus Areas:</div>
              <div className='flex flex-wrap gap-1'>
                {phaseAnalysis.currentPhase.focus.map((focus, index) => (
                  <Badge key={index} variant='secondary' className='text-xs'>
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>

            {phaseAnalysis.phaseSpecificRecommendations.length > 0 && (
              <div className='bg-muted rounded-lg p-3'>
                <div className='font-medium text-sm mb-2'>
                  Phase Recommendations:
                </div>
                <ul className='text-sm text-muted-foreground space-y-1'>
                  {phaseAnalysis.phaseSpecificRecommendations.map(
                    (rec, index) => (
                      <li key={index}>• {rec}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Session Focus */}
      {sessionFocus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='w-5 h-5' />
              Session Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {sessionFocus.map((focus, index) => (
                <Badge key={index} variant='outline'>
                  {focus}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-yellow-600'>
              <AlertTriangle className='w-5 h-5' />
              Warnings & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {warnings.map((warning, index) => (
                <li key={index} className='flex items-start gap-2 text-sm'>
                  <AlertTriangle className='w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0' />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
