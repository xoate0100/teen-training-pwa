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
import { useAnalytics } from '@/lib/hooks/use-analytics';

export function AnalyticsDashboard() {
  const {
    userEngagementMetrics,
    generateUserEngagementMetrics,
    performanceImprovementTracking,
    generatePerformanceImprovementTracking,
    featureUsageAnalysis,
    generateFeatureUsageAnalysis,
    successRateMonitoring,
    generateSuccessRateMonitoring,
    destroy,
    isLoading,
    error,
  } = useAnalytics();

  const [selectedUserId, setSelectedUserId] = useState('current-user');
  const [selectedFeatureId, setSelectedFeatureId] =
    useState('session_tracking');
  const [selectedMetricId, setSelectedMetricId] = useState('user_engagement');
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'engagement' | 'performance' | 'features' | 'success'
  >('engagement');

  // Auto-analyze periodically
  useEffect(() => {
    if (autoAnalysis) {
      const interval = setInterval(() => {
        generateUserEngagementMetrics(selectedUserId);
        generatePerformanceImprovementTracking(selectedUserId);
        generateFeatureUsageAnalysis(selectedFeatureId);
        generateSuccessRateMonitoring(selectedMetricId);
      }, 300000); // Every 5 minutes

      return () => clearInterval(interval);
    }
  }, [
    autoAnalysis,
    selectedUserId,
    selectedFeatureId,
    selectedMetricId,
    generateUserEngagementMetrics,
    generatePerformanceImprovementTracking,
    generateFeatureUsageAnalysis,
    generateSuccessRateMonitoring,
  ]);

  // Handle analysis
  const handleAnalyzeAll = async () => {
    try {
      await generateUserEngagementMetrics(selectedUserId);
      await generatePerformanceImprovementTracking(selectedUserId);
      await generateFeatureUsageAnalysis(selectedFeatureId);
      await generateSuccessRateMonitoring(selectedMetricId);
    } catch (error) {
      console.error('Failed to analyze all metrics:', error);
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className='h-4 w-4 text-green-600' />;
      case 'declining':
        return <TrendingDown className='h-4 w-4 text-red-600' />;
      default:
        return <Activity className='h-4 w-4 text-gray-600' />;
    }
  };

  // Get trend color
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user_engagement':
        return <Users className='h-5 w-5' />;
      case 'performance':
        return <Activity className='h-5 w-5' />;
      case 'retention':
        return <Heart className='h-5 w-5' />;
      case 'satisfaction':
        return <Star className='h-5 w-5' />;
      case 'technical':
        return <Settings className='h-5 w-5' />;
      default:
        return <BarChart3 className='h-5 w-5' />;
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
              Analytics Dashboard
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setAutoAnalysis(!autoAnalysis)}
              >
                {autoAnalysis ? (
                  <Pause className='h-4 w-4 mr-2' />
                ) : (
                  <Play className='h-4 w-4 mr-2' />
                )}
                {autoAnalysis ? 'Stop Auto-Analysis' : 'Start Auto-Analysis'}
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleAnalyzeAll}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                />
                Analyze All
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
                Feature ID
              </label>
              <select
                value={selectedFeatureId}
                onChange={e => setSelectedFeatureId(e.target.value)}
                className='w-full p-2 border rounded'
              >
                <option value='session_tracking'>Session Tracking</option>
                <option value='progress_monitoring'>Progress Monitoring</option>
                <option value='goal_setting'>Goal Setting</option>
                <option value='social_features'>Social Features</option>
                <option value='ai_coaching'>AI Coaching</option>
                <option value='predictive_insights'>Predictive Insights</option>
                <option value='contextual_intelligence'>
                  Contextual Intelligence
                </option>
                <option value='deep_personalization'>
                  Deep Personalization
                </option>
              </select>
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Metric ID
              </label>
              <select
                value={selectedMetricId}
                onChange={e => setSelectedMetricId(e.target.value)}
                className='w-full p-2 border rounded'
              >
                <option value='user_engagement'>User Engagement</option>
                <option value='session_frequency'>Session Frequency</option>
                <option value='performance_improvement'>
                  Performance Improvement
                </option>
                <option value='user_retention'>User Retention</option>
                <option value='feature_adoption'>Feature Adoption</option>
                <option value='user_satisfaction'>User Satisfaction</option>
                <option value='app_performance'>App Performance</option>
                <option value='data_quality'>Data Quality</option>
              </select>
            </div>
          </div>
          <div className='flex gap-2 mt-4'>
            <Button
              variant={activeTab === 'engagement' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveTab('engagement')}
            >
              <Users className='h-4 w-4 mr-2' />
              Engagement
            </Button>
            <Button
              variant={activeTab === 'performance' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveTab('performance')}
            >
              <Activity className='h-4 w-4 mr-2' />
              Performance
            </Button>
            <Button
              variant={activeTab === 'features' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveTab('features')}
            >
              <Settings className='h-4 w-4 mr-2' />
              Features
            </Button>
            <Button
              variant={activeTab === 'success' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setActiveTab('success')}
            >
              <Target className='h-4 w-4 mr-2' />
              Success
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

      {/* User Engagement Metrics */}
      {activeTab === 'engagement' && userEngagementMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              User Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Session Frequency */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Session Frequency</h4>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Daily</span>
                    <span className='font-medium'>
                      {userEngagementMetrics.sessionFrequency.daily}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Weekly
                    </span>
                    <span className='font-medium'>
                      {userEngagementMetrics.sessionFrequency.weekly}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Monthly
                    </span>
                    <span className='font-medium'>
                      {userEngagementMetrics.sessionFrequency.monthly}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Current Streak
                    </span>
                    <span className='font-medium'>
                      {userEngagementMetrics.sessionFrequency.streak}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Longest Streak
                    </span>
                    <span className='font-medium'>
                      {userEngagementMetrics.sessionFrequency.longestStreak}
                    </span>
                  </div>
                </div>
              </div>

              {/* Session Duration */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Session Duration</h4>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Average
                    </span>
                    <span className='font-medium'>
                      {userEngagementMetrics.sessionDuration.average.toFixed(1)}{' '}
                      min
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Median
                    </span>
                    <span className='font-medium'>
                      {userEngagementMetrics.sessionDuration.median.toFixed(1)}{' '}
                      min
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Total</span>
                    <span className='font-medium'>
                      {userEngagementMetrics.sessionDuration.total.toFixed(1)}{' '}
                      min
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Trend</span>
                    <div className='flex items-center gap-1'>
                      {getTrendIcon(
                        userEngagementMetrics.sessionDuration.trend
                      )}
                      <span
                        className={`text-sm ${getTrendColor(userEngagementMetrics.sessionDuration.trend)}`}
                      >
                        {userEngagementMetrics.sessionDuration.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Interaction */}
              <div className='space-y-2'>
                <h4 className='font-medium'>App Interaction</h4>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Daily Active
                    </span>
                    <span className='font-medium'>
                      {userEngagementMetrics.appInteraction.dailyActiveMinutes}{' '}
                      min
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Weekly Active
                    </span>
                    <span className='font-medium'>
                      {userEngagementMetrics.appInteraction.weeklyActiveMinutes}{' '}
                      min
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Monthly Active
                    </span>
                    <span className='font-medium'>
                      {
                        userEngagementMetrics.appInteraction
                          .monthlyActiveMinutes
                      }{' '}
                      min
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Session Count
                    </span>
                    <span className='font-medium'>
                      {userEngagementMetrics.appInteraction.sessionCount}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Bounce Rate
                    </span>
                    <span className='font-medium'>
                      {(
                        userEngagementMetrics.appInteraction.bounceRate * 100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Retention */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Retention</h4>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Day 1</span>
                    <span className='font-medium'>
                      {(userEngagementMetrics.retention.day1 * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>Day 7</span>
                    <span className='font-medium'>
                      {(userEngagementMetrics.retention.day7 * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Day 30
                    </span>
                    <span className='font-medium'>
                      {(userEngagementMetrics.retention.day30 * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Day 90
                    </span>
                    <span className='font-medium'>
                      {(userEngagementMetrics.retention.day90 * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Churn Risk
                    </span>
                    <span className='font-medium'>
                      {(
                        userEngagementMetrics.retention.churnRisk * 100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature Usage */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Feature Usage</h4>
                <div className='space-y-2'>
                  {userEngagementMetrics.featureUsage.map((feature, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center'
                    >
                      <span className='text-sm text-muted-foreground'>
                        {feature.feature}
                      </span>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium'>
                          {feature.usageCount}
                        </span>
                        <Badge variant='outline'>
                          {feature.satisfaction}/10
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Improvement Tracking */}
      {activeTab === 'performance' && performanceImprovementTracking && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Activity className='h-5 w-5' />
              Performance Improvement Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {/* Overall Progress */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Overall Progress</h4>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold'>
                      {performanceImprovementTracking.overallProgress.totalImprovement.toFixed(
                        1
                      )}
                      %
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Total Improvement
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold'>
                      {(
                        performanceImprovementTracking.overallProgress
                          .consistency * 100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Consistency
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold'>
                      {performanceImprovementTracking.overallProgress.motivation.toFixed(
                        1
                      )}
                      /10
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Motivation
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold'>
                      {performanceImprovementTracking.overallProgress.satisfaction.toFixed(
                        1
                      )}
                      /10
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Satisfaction
                    </div>
                  </div>
                </div>
              </div>

              {/* Strength Progress */}
              {performanceImprovementTracking.strengthProgress.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='font-medium'>Strength Progress</h4>
                  <div className='space-y-2'>
                    {performanceImprovementTracking.strengthProgress.map(
                      (exercise, index) => (
                        <div key={index} className='p-3 border rounded-lg'>
                          <div className='flex justify-between items-center mb-2'>
                            <span className='font-medium'>
                              {exercise.exercise}
                            </span>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-muted-foreground'>
                                {exercise.initialWeight.toFixed(1)} →{' '}
                                {exercise.currentWeight.toFixed(1)} kg
                              </span>
                              <Badge
                                className={
                                  exercise.improvement > 0
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {exercise.improvement > 0 ? '+' : ''}
                                {exercise.improvement.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                          <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground'>
                            <div>
                              Progression: {exercise.progressionRate.toFixed(2)}{' '}
                              kg/week
                            </div>
                            <div>
                              Plateau: {exercise.plateauDetected ? 'Yes' : 'No'}
                            </div>
                            <div>Duration: {exercise.plateauDuration} days</div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Skill Development */}
              {performanceImprovementTracking.skillDevelopment.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='font-medium'>Skill Development</h4>
                  <div className='space-y-2'>
                    {performanceImprovementTracking.skillDevelopment.map(
                      (skill, index) => (
                        <div key={index} className='p-3 border rounded-lg'>
                          <div className='flex justify-between items-center mb-2'>
                            <span className='font-medium'>{skill.skill}</span>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-muted-foreground'>
                                {skill.initialLevel.toFixed(1)} →{' '}
                                {skill.currentLevel.toFixed(1)}
                              </span>
                              <Badge
                                className={
                                  skill.improvement > 0
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {skill.improvement > 0 ? '+' : ''}
                                {skill.improvement.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                          <div className='grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground'>
                            <div>
                              Learning Rate: {skill.learningRate.toFixed(2)}
                              /week
                            </div>
                            <div>
                              Mastery:{' '}
                              {(skill.masteryProgress * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Endurance Progress */}
              {performanceImprovementTracking.enduranceProgress.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='font-medium'>Endurance Progress</h4>
                  <div className='space-y-2'>
                    {performanceImprovementTracking.enduranceProgress.map(
                      (exercise, index) => (
                        <div key={index} className='p-3 border rounded-lg'>
                          <div className='flex justify-between items-center mb-2'>
                            <span className='font-medium'>
                              {exercise.exercise}
                            </span>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-muted-foreground'>
                                {exercise.initialDuration.toFixed(1)} →{' '}
                                {exercise.currentDuration.toFixed(1)} min
                              </span>
                              <Badge
                                className={
                                  exercise.improvement > 0
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {exercise.improvement > 0 ? '+' : ''}
                                {exercise.improvement.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            Endurance Gain: {exercise.enduranceGain.toFixed(2)}{' '}
                            min/week
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

      {/* Feature Usage Analysis */}
      {activeTab === 'features' && featureUsageAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              Feature Usage Analysis: {featureUsageAnalysis.featureName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Basic Metrics */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Basic Metrics</h4>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Total Users
                    </span>
                    <span className='font-medium'>
                      {featureUsageAnalysis.totalUsers}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Active Users
                    </span>
                    <span className='font-medium'>
                      {featureUsageAnalysis.activeUsers}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Usage Frequency
                    </span>
                    <span className='font-medium'>
                      {featureUsageAnalysis.usageFrequency.toFixed(1)}/week
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      User Satisfaction
                    </span>
                    <span className='font-medium'>
                      {featureUsageAnalysis.userSatisfaction.toFixed(1)}/10
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Completion Rate
                    </span>
                    <span className='font-medium'>
                      {(featureUsageAnalysis.completionRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Performance Metrics</h4>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Load Time
                    </span>
                    <span className='font-medium'>
                      {featureUsageAnalysis.performanceMetrics.loadTime.toFixed(
                        0
                      )}
                      ms
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Error Rate
                    </span>
                    <span className='font-medium'>
                      {(
                        featureUsageAnalysis.performanceMetrics.errorRate * 100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      Crash Rate
                    </span>
                    <span className='font-medium'>
                      {(
                        featureUsageAnalysis.performanceMetrics.crashRate * 100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>
                      User Rating
                    </span>
                    <span className='font-medium'>
                      {featureUsageAnalysis.performanceMetrics.userRating.toFixed(
                        1
                      )}
                      /5
                    </span>
                  </div>
                </div>
              </div>

              {/* Dropoff Points */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Dropoff Points</h4>
                <div className='space-y-2'>
                  {featureUsageAnalysis.dropoffPoints.map((point, index) => (
                    <div key={index} className='p-2 border rounded'>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='text-sm font-medium'>
                          {point.step}
                        </span>
                        <span className='text-sm text-muted-foreground'>
                          {(point.dropoffRate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {point.commonReasons.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Rate Monitoring */}
      {activeTab === 'success' && successRateMonitoring && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              {getCategoryIcon(successRateMonitoring.category)}
              Success Rate Monitoring: {successRateMonitoring.metricName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {/* Key Metrics */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {successRateMonitoring.currentValue.toFixed(2)}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Current Value
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {successRateMonitoring.targetValue.toFixed(2)}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Target Value
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {successRateMonitoring.successRate.toFixed(1)}%
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Success Rate
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {(successRateMonitoring.confidence * 100).toFixed(1)}%
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Confidence
                  </div>
                </div>
              </div>

              {/* Trend */}
              <div className='flex items-center justify-center gap-2'>
                <span className='text-sm text-muted-foreground'>Trend:</span>
                <div className='flex items-center gap-1'>
                  {getTrendIcon(successRateMonitoring.trend)}
                  <span
                    className={`text-sm ${getTrendColor(successRateMonitoring.trend)}`}
                  >
                    {successRateMonitoring.trend}
                  </span>
                </div>
              </div>

              {/* Factors */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Factors</h4>
                <div className='space-y-2'>
                  {successRateMonitoring.factors.map((factor, index) => (
                    <div key={index} className='p-3 border rounded-lg'>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='font-medium'>{factor.factor}</span>
                        <span className='text-sm text-muted-foreground'>
                          Impact: {(factor.impact * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {factor.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className='space-y-2'>
                <h4 className='font-medium'>Recommendations</h4>
                <div className='space-y-2'>
                  {successRateMonitoring.recommendations.map(
                    (recommendation, index) => (
                      <div key={index} className='p-3 border rounded-lg'>
                        <div className='flex justify-between items-center mb-1'>
                          <span className='font-medium'>
                            {recommendation.action}
                          </span>
                          <div className='flex gap-2'>
                            <Badge
                              className={getPriorityColor(
                                recommendation.priority
                              )}
                            >
                              {recommendation.priority}
                            </Badge>
                            <Badge variant='outline'>
                              {recommendation.effort}
                            </Badge>
                          </div>
                        </div>
                        <div className='text-sm text-muted-foreground mb-1'>
                          {recommendation.expectedOutcome}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          Expected Impact: +{recommendation.expectedImpact}% |
                          Timeline: {recommendation.timeline}
                        </div>
                      </div>
                    )
                  )}
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
          <span>Analyzing data...</span>
        </div>
      )}
    </div>
  );
}
