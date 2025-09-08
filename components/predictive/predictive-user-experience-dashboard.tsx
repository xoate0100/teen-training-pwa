'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Lightbulb,
  Clock,
  Target,
  Users,
  Heart,
  Zap,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Eye,
  Ear,
  Hand,
  MessageSquare,
  User,
  Mail,
  Phone,
  MapPin,
  Thermometer,
  Gauge,
  Wind,
  Sun,
  Cloud,
  Droplets,
  Snowflake,
  Wind2,
  Calendar,
  Timer,
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
  Bell,
} from 'lucide-react';
import { usePredictiveUserExperience } from '@/lib/hooks/use-predictive-user-experience';
import {
  AnticipatoryInterfaceChange,
  ProactiveContentDelivery,
  SmartRecommendationTiming,
  PersonalizedLearningPath,
} from '@/lib/services/predictive-user-experience';

export function PredictiveUserExperienceDashboard() {
  const {
    anticipatoryChanges,
    generateAnticipatoryChanges,
    proactiveContent,
    generateProactiveContent,
    smartRecommendations,
    generateSmartRecommendations,
    learningPaths,
    generateLearningPaths,
    destroy,
    isLoading,
    error,
  } = usePredictiveUserExperience();

  const [selectedUserId, setSelectedUserId] = useState('current-user');
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'interface' | 'content' | 'recommendations' | 'paths'
  >('interface');

  // Auto-analyze periodically
  useEffect(() => {
    if (autoAnalysis) {
      const interval = setInterval(() => {
        generateAnticipatoryChanges(selectedUserId);
        generateProactiveContent(selectedUserId);
        generateSmartRecommendations(selectedUserId);
        generateLearningPaths(selectedUserId);
      }, 300000); // Every 5 minutes

      return () => clearInterval(interval);
    }
  }, [
    autoAnalysis,
    selectedUserId,
    generateAnticipatoryChanges,
    generateProactiveContent,
    generateSmartRecommendations,
    generateLearningPaths,
  ]);

  // Handle analysis
  const handleAnalyzeAll = async () => {
    try {
      await generateAnticipatoryChanges(selectedUserId);
      await generateProactiveContent(selectedUserId);
      await generateSmartRecommendations(selectedUserId);
      await generateLearningPaths(selectedUserId);
    } catch (error) {
      console.error('Failed to analyze all predictive elements:', error);
    }
  };

  // Get change type icon
  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'layout':
        return <Layout className='h-5 w-5' />;
      case 'theme':
        return <Palette className='h-5 w-5' />;
      case 'content':
        return <BookOpen className='h-5 w-5' />;
      case 'navigation':
        return <Navigation className='h-5 w-5' />;
      case 'interaction':
        return <Hand className='h-5 w-5' />;
      case 'notification':
        return <Bell className='h-5 w-5' />;
      default:
        return <Settings className='h-5 w-5' />;
    }
  };

  // Get content type icon
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'workout':
        return <Activity className='h-5 w-5' />;
      case 'tip':
        return <Lightbulb className='h-5 w-5' />;
      case 'motivation':
        return <Heart className='h-5 w-5' />;
      case 'education':
        return <GraduationCap className='h-5 w-5' />;
      case 'social':
        return <Users className='h-5 w-5' />;
      case 'achievement':
        return <Award className='h-5 w-5' />;
      case 'reminder':
        return <Clock className='h-5 w-5' />;
      default:
        return <MessageSquare className='h-5 w-5' />;
    }
  };

  // Get recommendation type icon
  const getRecommendationTypeIcon = (recommendationType: string) => {
    switch (recommendationType) {
      case 'exercise':
        return <Activity className='h-5 w-5' />;
      case 'session':
        return <Clock className='h-5 w-5' />;
      case 'goal':
        return <Target className='h-5 w-5' />;
      case 'social':
        return <Users className='h-5 w-5' />;
      case 'recovery':
        return <Heart className='h-5 w-5' />;
      case 'nutrition':
        return <Droplets className='h-5 w-5' />;
      default:
        return <Lightbulb className='h-5 w-5' />;
    }
  };

  // Get path type icon
  const getPathTypeIcon = (pathType: string) => {
    switch (pathType) {
      case 'strength':
        return <Zap className='h-5 w-5' />;
      case 'volleyball':
        return <Users className='h-5 w-5' />;
      case 'plyometric':
        return <TrendingUp className='h-5 w-5' />;
      case 'recovery':
        return <Heart className='h-5 w-5' />;
      case 'mixed':
        return <Layers className='h-5 w-5' />;
      case 'custom':
        return <Settings className='h-5 w-5' />;
      default:
        return <Route className='h-5 w-5' />;
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

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return 'text-red-600';
      case 'soon':
        return 'text-orange-600';
      case 'later':
        return 'text-yellow-600';
      case 'flexible':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              Predictive User Experience Analysis
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
            <div className='flex items-end'>
              <div className='flex gap-2 w-full'>
                <Button
                  variant={activeTab === 'interface' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setActiveTab('interface')}
                  className='flex-1'
                >
                  <Layout className='h-4 w-4 mr-2' />
                  Interface
                </Button>
                <Button
                  variant={activeTab === 'content' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setActiveTab('content')}
                  className='flex-1'
                >
                  <MessageSquare className='h-4 w-4 mr-2' />
                  Content
                </Button>
                <Button
                  variant={
                    activeTab === 'recommendations' ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() => setActiveTab('recommendations')}
                  className='flex-1'
                >
                  <Lightbulb className='h-4 w-4 mr-2' />
                  Recommendations
                </Button>
                <Button
                  variant={activeTab === 'paths' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setActiveTab('paths')}
                  className='flex-1'
                >
                  <Route className='h-4 w-4 mr-2' />
                  Paths
                </Button>
              </div>
            </div>
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

      {/* Anticipatory Interface Changes */}
      {activeTab === 'interface' && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Layout className='h-5 w-5' />
              Anticipatory Interface Changes ({anticipatoryChanges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {anticipatoryChanges.map((change, index) => (
                <div key={index} className='p-4 border rounded-lg'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      {getChangeTypeIcon(change.changeType)}
                      <h4 className='font-medium'>
                        {change.changeType.charAt(0).toUpperCase() +
                          change.changeType.slice(1)}{' '}
                        Change
                      </h4>
                    </div>
                    <div className='flex gap-2'>
                      <Badge className={getPriorityColor(change.priority)}>
                        {change.priority}
                      </Badge>
                      <Badge variant='outline'>{change.trigger.type}</Badge>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    {change.change.component} - {change.change.property}:{' '}
                    {JSON.stringify(change.change.value)}
                  </p>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-xs text-muted-foreground'>
                      Confidence: {Math.round(change.trigger.confidence * 100)}%
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Timing: {change.timing.when}
                    </span>
                  </div>
                  {change.change.animation && (
                    <div className='text-xs text-muted-foreground'>
                      Animation: {change.change.animation} (
                      {change.change.duration}ms)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proactive Content Delivery */}
      {activeTab === 'content' && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              Proactive Content Delivery ({proactiveContent.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {proactiveContent.map((content, index) => (
                <div key={index} className='p-4 border rounded-lg'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      {getContentTypeIcon(content.contentType)}
                      <h4 className='font-medium'>{content.content.title}</h4>
                    </div>
                    <div className='flex gap-2'>
                      <Badge className={getPriorityColor(content.priority)}>
                        {content.priority}
                      </Badge>
                      <Badge variant='outline'>{content.delivery.method}</Badge>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    {content.content.description}
                  </p>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-xs text-muted-foreground'>
                      Confidence: {Math.round(content.trigger.confidence * 100)}
                      %
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Delivery: {content.delivery.timing}
                    </span>
                  </div>
                  {content.content.media && (
                    <div className='text-xs text-muted-foreground mb-2'>
                      Media: {content.content.media.type} -{' '}
                      {content.content.media.url}
                    </div>
                  )}
                  {content.content.action && (
                    <div className='text-xs text-muted-foreground'>
                      Action: {content.content.action.type} →{' '}
                      {content.content.action.target}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Recommendations */}
      {activeTab === 'recommendations' && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Lightbulb className='h-5 w-5' />
              Smart Recommendations ({smartRecommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {smartRecommendations.map((recommendation, index) => (
                <div key={index} className='p-4 border rounded-lg'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      {getRecommendationTypeIcon(
                        recommendation.recommendationType
                      )}
                      <h4 className='font-medium'>
                        {recommendation.recommendation.title}
                      </h4>
                    </div>
                    <div className='flex gap-2'>
                      <Badge
                        className={getPriorityColor(recommendation.priority)}
                      >
                        {recommendation.priority}
                      </Badge>
                      <Badge
                        className={getUrgencyColor(
                          recommendation.timing.urgency
                        )}
                      >
                        {recommendation.timing.urgency}
                      </Badge>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    {recommendation.recommendation.description}
                  </p>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-xs text-muted-foreground'>
                      Confidence:{' '}
                      {Math.round(recommendation.trigger.confidence * 100)}%
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Optimal Time:{' '}
                      {recommendation.timing.optimalTime.toLocaleString()}
                    </span>
                  </div>
                  <div className='text-xs text-muted-foreground mb-2'>
                    Reasoning: {recommendation.recommendation.reasoning}
                  </div>
                  {recommendation.recommendation.alternatives.length > 0 && (
                    <div className='text-xs text-muted-foreground'>
                      Alternatives:{' '}
                      {recommendation.recommendation.alternatives
                        .map(alt => (typeof alt === 'string' ? alt : alt.type))
                        .join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalized Learning Paths */}
      {activeTab === 'paths' && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Route className='h-5 w-5' />
              Personalized Learning Paths ({learningPaths.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {learningPaths.map((path, index) => (
                <div key={index} className='p-4 border rounded-lg'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      {getPathTypeIcon(path.pathType)}
                      <h4 className='font-medium'>{path.path.name}</h4>
                    </div>
                    <div className='flex gap-2'>
                      <Badge className={getPriorityColor(path.priority)}>
                        {path.priority}
                      </Badge>
                      <Badge variant='outline'>{path.path.difficulty}/10</Badge>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    {path.path.description}
                  </p>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-xs text-muted-foreground'>
                      Duration: {path.path.duration} weeks
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Confidence: {Math.round(path.trigger.confidence * 100)}%
                    </span>
                  </div>
                  <div className='space-y-2'>
                    <h5 className='text-sm font-medium'>Phases:</h5>
                    {path.path.phases.map((phase, phaseIndex) => (
                      <div
                        key={phaseIndex}
                        className='text-xs text-muted-foreground pl-4'
                      >
                        <div className='font-medium'>
                          {phase.name} ({phase.duration} weeks)
                        </div>
                        <div>{phase.description}</div>
                        <div>Focus: {phase.focus.join(', ')}</div>
                        <div>Exercises: {phase.exercises.join(', ')}</div>
                      </div>
                    ))}
                  </div>
                  {path.path.adaptations.length > 0 && (
                    <div className='mt-2'>
                      <h5 className='text-sm font-medium mb-1'>Adaptations:</h5>
                      <div className='text-xs text-muted-foreground space-y-1'>
                        {path.path.adaptations.map((adaptation, adaptIndex) => (
                          <div key={adaptIndex} className='pl-4'>
                            {adaptation.type}: {adaptation.condition} →{' '}
                            {adaptation.adjustment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className='flex items-center justify-center py-8'>
          <RefreshCw className='h-6 w-6 animate-spin mr-2' />
          <span>Analyzing predictive user experience data...</span>
        </div>
      )}
    </div>
  );
}
