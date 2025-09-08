'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Target,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Eye,
  Download,
  Filter,
  Calendar,
  Clock,
  Star,
  Heart,
  Zap,
  Award,
  Shield,
  BookOpen,
  GraduationCap,
  Route,
  Compass,
  Navigation,
  Layers,
  Palette,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Volume2,
  VolumeX,
  Brightness,
  Moon,
  Sunrise,
  Sunset,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarRange,
  CalendarSearch,
  CalendarClock,
  CalendarHeart,
  CalendarStar,
  CalendarAward,
  CalendarTarget,
  CalendarTrendingUp,
  CalendarTrendingDown,
  CalendarActivity,
  CalendarBarChart3,
  CalendarPieChart,
  CalendarLineChart,
  CalendarAlertTriangle,
  CalendarCheckCircle,
  CalendarRefreshCw,
  CalendarPlay,
  CalendarPause,
  CalendarRotateCcw,
  CalendarSettings,
  CalendarEye,
  CalendarEar,
  CalendarHand,
  CalendarMessageSquare,
  CalendarUser,
  CalendarMail,
  CalendarPhone,
  CalendarMapPin,
  CalendarThermometer,
  CalendarGauge,
  CalendarWind,
  CalendarSun,
  CalendarCloud,
  CalendarDroplets,
  CalendarSnowflake,
  CalendarWind2,
  CalendarBrain,
  CalendarLightbulb,
  CalendarClock as CalendarClockIcon,
  CalendarTarget as CalendarTargetIcon,
  CalendarUsers,
  CalendarHeart as CalendarHeartIcon,
  CalendarZap,
  CalendarStar as CalendarStarIcon,
  CalendarTrendingUp as CalendarTrendingUpIcon,
  CalendarTrendingDown as CalendarTrendingDownIcon,
  CalendarActivity as CalendarActivityIcon,
  CalendarBarChart3 as CalendarBarChart3Icon,
  CalendarPieChart as CalendarPieChartIcon,
  CalendarLineChart as CalendarLineChartIcon,
  CalendarAlertTriangle as CalendarAlertTriangleIcon,
  CalendarCheckCircle as CalendarCheckCircleIcon,
  CalendarRefreshCw as CalendarRefreshCwIcon,
  CalendarPlay as CalendarPlayIcon,
  CalendarPause as CalendarPauseIcon,
  CalendarRotateCcw as CalendarRotateCcwIcon,
  CalendarSettings as CalendarSettingsIcon,
  CalendarEye as CalendarEyeIcon,
  CalendarEar as CalendarEarIcon,
  CalendarHand as CalendarHandIcon,
  CalendarMessageSquare as CalendarMessageSquareIcon,
  CalendarUser as CalendarUserIcon,
  CalendarMail as CalendarMailIcon,
  CalendarPhone as CalendarPhoneIcon,
  CalendarMapPin as CalendarMapPinIcon,
  CalendarThermometer as CalendarThermometerIcon,
  CalendarGauge as CalendarGaugeIcon,
  CalendarWind as CalendarWindIcon,
  CalendarSun as CalendarSunIcon,
  CalendarCloud as CalendarCloudIcon,
  CalendarDroplets as CalendarDropletsIcon,
  CalendarSnowflake as CalendarSnowflakeIcon,
  CalendarWind2 as CalendarWind2Icon,
  CalendarBrain as CalendarBrainIcon,
  CalendarLightbulb as CalendarLightbulbIcon,
} from 'lucide-react';
import { useResearchDataCollection } from '@/lib/hooks/use-research-data-collection';

export function ResearchDataCollectionDashboard() {
  const {
    anonymousPerformanceData,
    collectAnonymousPerformanceData,
    trainingEffectivenessStudy,
    createTrainingEffectivenessStudy,
    analyzeTrainingEffectiveness,
    userSatisfactionMetrics,
    collectUserSatisfactionMetrics,
    longTermOutcomes,
    trackLongTermOutcomes,
    destroy,
    isLoading,
    error,
  } = useResearchDataCollection();

  const [selectedUserId, setSelectedUserId] = useState('current-user');
  const [selectedSurveyType, setSelectedSurveyType] = useState<
    'onboarding' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'exit'
  >('weekly');
  const [selectedTrackingPeriod, setSelectedTrackingPeriod] = useState<
    '3_months' | '6_months' | '1_year' | '2_years' | '5_years'
  >('3_months');
  const [autoCollection, setAutoCollection] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'anonymous' | 'studies' | 'satisfaction' | 'outcomes'
  >('anonymous');

  // Auto-collect data periodically
  useEffect(() => {
    if (autoCollection) {
      const interval = setInterval(() => {
        collectAnonymousPerformanceData(selectedUserId);
        collectUserSatisfactionMetrics(selectedUserId, selectedSurveyType);
        trackLongTermOutcomes(selectedUserId, selectedTrackingPeriod);
      }, 300000); // Every 5 minutes

      return () => clearInterval(interval);
    }
  }, [
    autoCollection,
    selectedUserId,
    selectedSurveyType,
    selectedTrackingPeriod,
    collectAnonymousPerformanceData,
    collectUserSatisfactionMetrics,
    trackLongTermOutcomes,
  ]);

  // Handle data collection
  const handleCollectAllData = async () => {
    try {
      await collectAnonymousPerformanceData(selectedUserId);
      await collectUserSatisfactionMetrics(selectedUserId, selectedSurveyType);
      await trackLongTermOutcomes(selectedUserId, selectedTrackingPeriod);
    } catch (error) {
      console.error('Failed to collect all research data:', error);
    }
  };

  // Create a new study
  const handleCreateStudy = async () => {
    try {
      const studyData = {
        studyName: 'Teen Training Effectiveness Study',
        studyType: 'longitudinal' as const,
        duration: 12, // weeks
        participants: 0,
        methodology: {
          design: 'Longitudinal cohort study',
          variables: ['strength', 'endurance', 'skill', 'satisfaction'],
          controls: ['age', 'experience', 'frequency'],
          measurements: ['weight', 'duration', 'rpe', 'rating'],
        },
        results: [],
        conclusions: [],
        publicationStatus: 'draft' as const,
      };

      await createTrainingEffectivenessStudy(studyData);
    } catch (error) {
      console.error('Failed to create study:', error);
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className='h-4 w-4 text-green-600' />;
      case 'decreasing':
        return <TrendingDown className='h-4 w-4 text-red-600' />;
      default:
        return <Activity className='h-4 w-4 text-gray-600' />;
    }
  };

  // Get trend color
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600';
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'exceeded':
        return 'bg-purple-100 text-purple-800';
      case 'abandoned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <BarChart3 className='h-5 w-5' />
              Research Data Collection Dashboard
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setAutoCollection(!autoCollection)}
              >
                {autoCollection ? (
                  <Pause className='h-4 w-4 mr-2' />
                ) : (
                  <Play className='h-4 w-4 mr-2' />
                )}
                {autoCollection
                  ? 'Stop Auto-Collection'
                  : 'Start Auto-Collection'}
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCollectAllData}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                />
                Collect All Data
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCreateStudy}
                disabled={isLoading}
              >
                <BookOpen className='h-4 w-4 mr-2' />
                Create Study
              </Button>
              <Button variant='outline' size='sm' onClick={destroy}>
                <RotateCcw className='h-4 w-4 mr-2' />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>User ID</label>
              <input
                type='text'
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                className='w-full p-2 border rounded'
                placeholder='Enter user ID'
              />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Survey Type
              </label>
              <select
                value={selectedSurveyType}
                onChange={e => setSelectedSurveyType(e.target.value as any)}
                className='w-full p-2 border rounded'
              >
                <option value='onboarding'>Onboarding</option>
                <option value='weekly'>Weekly</option>
                <option value='monthly'>Monthly</option>
                <option value='quarterly'>Quarterly</option>
                <option value='annual'>Annual</option>
                <option value='exit'>Exit</option>
              </select>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Tracking Period
              </label>
              <select
                value={selectedTrackingPeriod}
                onChange={e => setSelectedTrackingPeriod(e.target.value as any)}
                className='w-full p-2 border rounded'
              >
                <option value='3_months'>3 Months</option>
                <option value='6_months'>6 Months</option>
                <option value='1_year'>1 Year</option>
                <option value='2_years'>2 Years</option>
                <option value='5_years'>5 Years</option>
              </select>
            </div>
          </div>
          <div className='flex gap-2 mt-4'>
            <Button
              variant={activeTab === 'anonymous' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveTab('anonymous')}
            >
              <Shield className='h-4 w-4 mr-2' />
              Anonymous Data
            </Button>
            <Button
              variant={activeTab === 'studies' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveTab('studies')}
            >
              <BookOpen className='h-4 w-4 mr-2' />
              Studies
            </Button>
            <Button
              variant={activeTab === 'satisfaction' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveTab('satisfaction')}
            >
              <Star className='h-4 w-4 mr-2' />
              Satisfaction
            </Button>
            <Button
              variant={activeTab === 'outcomes' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveTab('outcomes')}
            >
              <Target className='h-4 w-4 mr-2' />
              Outcomes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Anonymous Performance Data */}
      {activeTab === 'anonymous' && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Anonymous Performance Data ({anonymousPerformanceData.length}{' '}
              records)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {anonymousPerformanceData.map((data, index) => (
                <div key={index} className='p-4 border rounded-lg'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <Shield className='h-5 w-5' />
                      <h4 className='font-medium'>
                        Anonymous User: {data.anonymousUserId}
                      </h4>
                    </div>
                    <div className='flex gap-2'>
                      <Badge variant='outline'>{data.sessionType}</Badge>
                      <Badge variant='outline'>
                        Quality: {(data.dataQuality * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-3'>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Duration:
                      </span>
                      <span className='ml-2 font-medium'>
                        {data.duration} min
                      </span>
                    </div>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Intensity:
                      </span>
                      <span className='ml-2 font-medium'>
                        {data.intensity.toFixed(1)}/10
                      </span>
                    </div>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Exercises:
                      </span>
                      <span className='ml-2 font-medium'>
                        {data.exercises.length}
                      </span>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-3'>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Demographics:
                      </span>
                      <div className='text-sm'>
                        {data.demographics.ageGroup} |{' '}
                        {data.demographics.experienceLevel} |{' '}
                        {data.demographics.trainingFrequency} |{' '}
                        {data.demographics.sport}
                      </div>
                    </div>
                    <div>
                      <span className='text-sm text-muted-foreground'>
                        Improvements:
                      </span>
                      <div className='text-sm'>
                        {data.improvements.map((imp, i) => (
                          <span key={i} className='mr-2'>
                            {imp.metric}: {imp.value.toFixed(1)} {imp.unit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Collected: {data.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Effectiveness Studies */}
      {activeTab === 'studies' && trainingEffectivenessStudy && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5' />
              Training Effectiveness Study:{' '}
              {trainingEffectivenessStudy.studyName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {/* Study Overview */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {trainingEffectivenessStudy.participants}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Participants
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {trainingEffectivenessStudy.duration}
                  </div>
                  <div className='text-sm text-muted-foreground'>Weeks</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {trainingEffectivenessStudy.studyType}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Study Type
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {trainingEffectivenessStudy.publicationStatus}
                  </div>
                  <div className='text-sm text-muted-foreground'>Status</div>
                </div>
              </div>

              {/* Methodology */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Methodology</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <span className='text-sm text-muted-foreground'>
                      Design:
                    </span>
                    <div className='text-sm'>
                      {trainingEffectivenessStudy.methodology.design}
                    </div>
                  </div>
                  <div>
                    <span className='text-sm text-muted-foreground'>
                      Variables:
                    </span>
                    <div className='text-sm'>
                      {trainingEffectivenessStudy.methodology.variables.join(
                        ', '
                      )}
                    </div>
                  </div>
                  <div>
                    <span className='text-sm text-muted-foreground'>
                      Controls:
                    </span>
                    <div className='text-sm'>
                      {trainingEffectivenessStudy.methodology.controls.join(
                        ', '
                      )}
                    </div>
                  </div>
                  <div>
                    <span className='text-sm text-muted-foreground'>
                      Measurements:
                    </span>
                    <div className='text-sm'>
                      {trainingEffectivenessStudy.methodology.measurements.join(
                        ', '
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              {trainingEffectivenessStudy.results.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='font-medium'>Results</h4>
                  <div className='space-y-2'>
                    {trainingEffectivenessStudy.results.map((result, index) => (
                      <div key={index} className='p-3 border rounded-lg'>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='font-medium'>{result.metric}</span>
                          <Badge
                            className={
                              result.improvement > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {result.improvement > 0 ? '+' : ''}
                            {result.improvement.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground'>
                          <div>Baseline: {result.baseline.toFixed(1)}</div>
                          <div>Endpoint: {result.endpoint.toFixed(1)}</div>
                          <div>
                            Significance: {result.significance.toFixed(3)}
                          </div>
                          <div>Effect Size: {result.effectSize.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conclusions */}
              {trainingEffectivenessStudy.conclusions.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='font-medium'>Conclusions</h4>
                  <div className='space-y-2'>
                    {trainingEffectivenessStudy.conclusions.map(
                      (conclusion, index) => (
                        <div key={index} className='p-3 border rounded-lg'>
                          <div className='font-medium mb-1'>
                            {conclusion.finding}
                          </div>
                          <div className='text-sm text-muted-foreground mb-1'>
                            {conclusion.evidence}
                          </div>
                          <div className='text-sm text-muted-foreground mb-1'>
                            {conclusion.implications}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {conclusion.limitations}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Satisfaction Metrics */}
      {activeTab === 'satisfaction' && userSatisfactionMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Star className='h-5 w-5' />
              User Satisfaction Metrics: {userSatisfactionMetrics.surveyType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {/* Overall Metrics */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {userSatisfactionMetrics.overallSatisfaction.toFixed(1)}/10
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Overall Satisfaction
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {userSatisfactionMetrics.netPromoterScore}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Net Promoter Score
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {(userSatisfactionMetrics.completionRate * 100).toFixed(0)}%
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Completion Rate
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {userSatisfactionMetrics.responseTime.toFixed(0)} min
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Response Time
                  </div>
                </div>
              </div>

              {/* Category Scores */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Category Scores</h4>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                  {Object.entries(userSatisfactionMetrics.categoryScores).map(
                    ([category, score]) => (
                      <div key={category} className='text-center'>
                        <div className='text-lg font-bold'>
                          {score.toFixed(1)}/10
                        </div>
                        <div className='text-sm text-muted-foreground capitalize'>
                          {category}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Survey Responses */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Survey Responses</h4>
                <div className='space-y-2'>
                  {userSatisfactionMetrics.responses.map((response, index) => (
                    <div key={index} className='p-3 border rounded-lg'>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='font-medium'>{response.question}</span>
                        <div className='flex gap-2'>
                          <Badge variant='outline'>{response.category}</Badge>
                          <Badge variant='outline'>{response.rating}/10</Badge>
                        </div>
                      </div>
                      {response.textResponse && (
                        <div className='text-sm text-muted-foreground'>
                          {response.textResponse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualitative Feedback */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Qualitative Feedback</h4>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <h5 className='font-medium text-green-600 mb-2'>
                      Positive
                    </h5>
                    <div className='space-y-1'>
                      {userSatisfactionMetrics.qualitativeFeedback.positive.map(
                        (feedback, index) => (
                          <div
                            key={index}
                            className='text-sm text-muted-foreground'
                          >
                            • {feedback}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className='font-medium text-red-600 mb-2'>Negative</h5>
                    <div className='space-y-1'>
                      {userSatisfactionMetrics.qualitativeFeedback.negative.map(
                        (feedback, index) => (
                          <div
                            key={index}
                            className='text-sm text-muted-foreground'
                          >
                            • {feedback}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className='font-medium text-blue-600 mb-2'>
                      Suggestions
                    </h5>
                    <div className='space-y-1'>
                      {userSatisfactionMetrics.qualitativeFeedback.suggestions.map(
                        (feedback, index) => (
                          <div
                            key={index}
                            className='text-sm text-muted-foreground'
                          >
                            • {feedback}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Long-term Outcomes */}
      {activeTab === 'outcomes' && longTermOutcomes && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Long-term Outcomes: {longTermOutcomes.trackingPeriod}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {/* Goals */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Goals</h4>
                <div className='space-y-2'>
                  {longTermOutcomes.goals.map((goal, index) => (
                    <div key={index} className='p-3 border rounded-lg'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='font-medium'>{goal.description}</span>
                        <div className='flex gap-2'>
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status}
                          </Badge>
                          <Badge variant='outline'>
                            {goal.achievement.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground'>
                        <div>Target: {goal.targetValue.toFixed(1)}</div>
                        <div>Current: {goal.currentValue.toFixed(1)}</div>
                        <div>Type: {goal.goalType}</div>
                        <div>Milestones: {goal.milestones.length}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Metrics */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Health Metrics</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {Object.entries(longTermOutcomes.healthMetrics).map(
                    ([metric, data]) => (
                      <div key={metric} className='p-3 border rounded-lg'>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='font-medium capitalize'>
                            {metric}
                          </span>
                          <div className='flex items-center gap-1'>
                            {getTrendIcon(data.trend)}
                            <span
                              className={`text-sm ${getTrendColor(data.trend)}`}
                            >
                              {data.change > 0 ? '+' : ''}
                              {data.change.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className='grid grid-cols-2 gap-2 text-sm text-muted-foreground'>
                          <div>Initial: {data.initial.toFixed(1)}</div>
                          <div>Current: {data.current.toFixed(1)}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Psychological Metrics */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Psychological Metrics</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {Object.entries(longTermOutcomes.psychologicalMetrics).map(
                    ([metric, data]) => (
                      <div key={metric} className='p-3 border rounded-lg'>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='font-medium capitalize'>
                            {metric}
                          </span>
                          <div className='flex items-center gap-1'>
                            {getTrendIcon(data.trend)}
                            <span
                              className={`text-sm ${getTrendColor(data.trend)}`}
                            >
                              {data.change > 0 ? '+' : ''}
                              {data.change.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className='grid grid-cols-2 gap-2 text-sm text-muted-foreground'>
                          <div>Initial: {data.initial.toFixed(1)}</div>
                          <div>Current: {data.current.toFixed(1)}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Behavioral Changes */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Behavioral Changes</h4>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                  {Object.entries(longTermOutcomes.behavioralChanges).map(
                    ([behavior, value]) => (
                      <div key={behavior} className='text-center'>
                        <div className='text-lg font-bold'>
                          {value.toFixed(1)}/10
                        </div>
                        <div className='text-sm text-muted-foreground capitalize'>
                          {behavior.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Outcomes */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Outcomes</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <h5 className='font-medium mb-2'>Primary Outcomes</h5>
                    <div className='space-y-1'>
                      {longTermOutcomes.outcomes.primary.map(
                        (outcome, index) => (
                          <div
                            key={index}
                            className='flex justify-between items-center'
                          >
                            <span className='text-sm'>{outcome.outcome}</span>
                            <div className='flex gap-2'>
                              <Badge
                                className={
                                  outcome.achieved
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {outcome.achieved ? 'Achieved' : 'Not Achieved'}
                              </Badge>
                              <Badge variant='outline'>{outcome.impact}</Badge>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className='font-medium mb-2'>Secondary Outcomes</h5>
                    <div className='space-y-1'>
                      {longTermOutcomes.outcomes.secondary.map(
                        (outcome, index) => (
                          <div
                            key={index}
                            className='flex justify-between items-center'
                          >
                            <span className='text-sm'>{outcome.outcome}</span>
                            <div className='flex gap-2'>
                              <Badge
                                className={
                                  outcome.achieved
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {outcome.achieved ? 'Achieved' : 'Not Achieved'}
                              </Badge>
                              <Badge variant='outline'>{outcome.impact}</Badge>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className='flex items-center justify-center py-8'>
          <RefreshCw className='h-6 w-6 animate-spin mr-2' />
          <span>Collecting research data...</span>
        </div>
      )}
    </div>
  );
}
