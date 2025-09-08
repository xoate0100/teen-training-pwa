'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Target,
  Heart,
  Settings,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Eye,
  Ear,
  Hand,
  MessageSquare,
  BarChart3,
  PieChart,
  LineChart,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Star,
  Zap,
  Shield,
  Award,
  Clock,
  Activity,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Cloud,
  Sun,
  Moon,
  Wind,
  Droplets,
} from 'lucide-react';
import { useDeepPersonalization } from '@/lib/hooks/use-deep-personalization';
import {
  LearningStyleProfile,
  MotivationProfile,
  ChallengeLevelProfile,
  SupportSystemProfile,
  PersonalizationInsights,
} from '@/lib/services/deep-personalization';

export function DeepPersonalizationDashboard() {
  const {
    learningStyleProfile,
    analyzeLearningStyle,
    motivationProfile,
    analyzeMotivationPatterns,
    challengeLevelProfile,
    analyzeChallengeLevel,
    supportSystemProfile,
    analyzeSupportSystem,
    personalizationInsights,
    generatePersonalizationInsights,
    destroy,
    isLoading,
    error,
  } = useDeepPersonalization();

  const [selectedUserId, setSelectedUserId] = useState('current-user');
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [showInsights, setShowInsights] = useState(true);

  // Auto-analyze periodically
  useEffect(() => {
    if (autoAnalysis) {
      const interval = setInterval(() => {
        analyzeLearningStyle(selectedUserId);
        analyzeMotivationPatterns(selectedUserId);
        analyzeChallengeLevel(selectedUserId);
        analyzeSupportSystem(selectedUserId);
        generatePersonalizationInsights(selectedUserId);
      }, 300000); // Every 5 minutes

      return () => clearInterval(interval);
    }
  }, [
    autoAnalysis,
    selectedUserId,
    analyzeLearningStyle,
    analyzeMotivationPatterns,
    analyzeChallengeLevel,
    analyzeSupportSystem,
    generatePersonalizationInsights,
  ]);

  // Handle analysis
  const handleAnalyzeAll = async () => {
    try {
      await analyzeLearningStyle(selectedUserId);
      await analyzeMotivationPatterns(selectedUserId);
      await analyzeChallengeLevel(selectedUserId);
      await analyzeSupportSystem(selectedUserId);
      await generatePersonalizationInsights(selectedUserId);
    } catch (error) {
      console.error('Failed to analyze all profiles:', error);
    }
  };

  // Get preference color
  const getPreferenceColor = (value: number) => {
    if (value >= 0.7) return 'text-green-600';
    if (value >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get preference badge
  const getPreferenceBadge = (value: number) => {
    if (value >= 0.7) return 'bg-green-100 text-green-800';
    if (value >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get confidence badge
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className='space-y-6'>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              Deep Personalization Analysis
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
              <Button
                onClick={() => setShowInsights(!showInsights)}
                className='w-full'
              >
                <Lightbulb className='h-4 w-4 mr-2' />
                {showInsights ? 'Hide Insights' : 'Show Insights'}
              </Button>
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

      {/* Learning Style Profile */}
      {learningStyleProfile && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5' />
              Learning Style Profile
              <Badge
                className={getConfidenceBadge(learningStyleProfile.confidence)}
              >
                {Math.round(learningStyleProfile.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <Eye className='h-6 w-6 mx-auto mb-2 text-blue-600' />
                  <div className='text-sm font-medium'>Visual</div>
                  <div
                    className={`text-sm ${getPreferenceColor(learningStyleProfile.visualPreference)}`}
                  >
                    {Math.round(learningStyleProfile.visualPreference * 100)}%
                  </div>
                  <Progress
                    value={learningStyleProfile.visualPreference * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Ear className='h-6 w-6 mx-auto mb-2 text-green-600' />
                  <div className='text-sm font-medium'>Auditory</div>
                  <div
                    className={`text-sm ${getPreferenceColor(learningStyleProfile.auditoryPreference)}`}
                  >
                    {Math.round(learningStyleProfile.auditoryPreference * 100)}%
                  </div>
                  <Progress
                    value={learningStyleProfile.auditoryPreference * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Hand className='h-6 w-6 mx-auto mb-2 text-purple-600' />
                  <div className='text-sm font-medium'>Kinesthetic</div>
                  <div
                    className={`text-sm ${getPreferenceColor(learningStyleProfile.kinestheticPreference)}`}
                  >
                    {Math.round(
                      learningStyleProfile.kinestheticPreference * 100
                    )}
                    %
                  </div>
                  <Progress
                    value={learningStyleProfile.kinestheticPreference * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <MessageSquare className='h-6 w-6 mx-auto mb-2 text-orange-600' />
                  <div className='text-sm font-medium'>Reading</div>
                  <div
                    className={`text-sm ${getPreferenceColor(learningStyleProfile.readingPreference)}`}
                  >
                    {Math.round(learningStyleProfile.readingPreference * 100)}%
                  </div>
                  <Progress
                    value={learningStyleProfile.readingPreference * 100}
                    className='h-2 mt-1'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <div className='text-center'>
                  <Users className='h-6 w-6 mx-auto mb-2 text-pink-600' />
                  <div className='text-sm font-medium'>Social</div>
                  <div
                    className={`text-sm ${getPreferenceColor(learningStyleProfile.socialPreference)}`}
                  >
                    {Math.round(learningStyleProfile.socialPreference * 100)}%
                  </div>
                  <Progress
                    value={learningStyleProfile.socialPreference * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <User className='h-6 w-6 mx-auto mb-2 text-indigo-600' />
                  <div className='text-sm font-medium'>Individual</div>
                  <div
                    className={`text-sm ${getPreferenceColor(learningStyleProfile.individualPreference)}`}
                  >
                    {Math.round(
                      learningStyleProfile.individualPreference * 100
                    )}
                    %
                  </div>
                  <Progress
                    value={learningStyleProfile.individualPreference * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Activity className='h-6 w-6 mx-auto mb-2 text-red-600' />
                  <div className='text-sm font-medium'>Active</div>
                  <div
                    className={`text-sm ${getPreferenceColor(learningStyleProfile.activePreference)}`}
                  >
                    {Math.round(learningStyleProfile.activePreference * 100)}%
                  </div>
                  <Progress
                    value={learningStyleProfile.activePreference * 100}
                    className='h-2 mt-1'
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Motivation Profile */}
      {motivationProfile && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Heart className='h-5 w-5' />
              Motivation Profile
              <Badge
                className={getConfidenceBadge(motivationProfile.confidence)}
              >
                {Math.round(motivationProfile.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <Star className='h-6 w-6 mx-auto mb-2 text-yellow-600' />
                  <div className='text-sm font-medium'>Intrinsic</div>
                  <div
                    className={`text-sm ${getPreferenceColor(motivationProfile.intrinsicMotivation)}`}
                  >
                    {Math.round(motivationProfile.intrinsicMotivation * 100)}%
                  </div>
                  <Progress
                    value={motivationProfile.intrinsicMotivation * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Award className='h-6 w-6 mx-auto mb-2 text-blue-600' />
                  <div className='text-sm font-medium'>Achievement</div>
                  <div
                    className={`text-sm ${getPreferenceColor(motivationProfile.achievementMotivation)}`}
                  >
                    {Math.round(motivationProfile.achievementMotivation * 100)}%
                  </div>
                  <Progress
                    value={motivationProfile.achievementMotivation * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Users className='h-6 w-6 mx-auto mb-2 text-green-600' />
                  <div className='text-sm font-medium'>Social</div>
                  <div
                    className={`text-sm ${getPreferenceColor(motivationProfile.socialMotivation)}`}
                  >
                    {Math.round(motivationProfile.socialMotivation * 100)}%
                  </div>
                  <Progress
                    value={motivationProfile.socialMotivation * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Target className='h-6 w-6 mx-auto mb-2 text-purple-600' />
                  <div className='text-sm font-medium'>Mastery</div>
                  <div
                    className={`text-sm ${getPreferenceColor(motivationProfile.masteryMotivation)}`}
                  >
                    {Math.round(motivationProfile.masteryMotivation * 100)}%
                  </div>
                  <Progress
                    value={motivationProfile.masteryMotivation * 100}
                    className='h-2 mt-1'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <div className='text-center'>
                  <Zap className='h-6 w-6 mx-auto mb-2 text-orange-600' />
                  <div className='text-sm font-medium'>Performance</div>
                  <div
                    className={`text-sm ${getPreferenceColor(motivationProfile.performanceMotivation)}`}
                  >
                    {Math.round(motivationProfile.performanceMotivation * 100)}%
                  </div>
                  <Progress
                    value={motivationProfile.performanceMotivation * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Shield className='h-6 w-6 mx-auto mb-2 text-indigo-600' />
                  <div className='text-sm font-medium'>Autonomy</div>
                  <div
                    className={`text-sm ${getPreferenceColor(motivationProfile.autonomyMotivation)}`}
                  >
                    {Math.round(motivationProfile.autonomyMotivation * 100)}%
                  </div>
                  <Progress
                    value={motivationProfile.autonomyMotivation * 100}
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <TrendingUp className='h-6 w-6 mx-auto mb-2 text-red-600' />
                  <div className='text-sm font-medium'>Competence</div>
                  <div
                    className={`text-sm ${getPreferenceColor(motivationProfile.competenceMotivation)}`}
                  >
                    {Math.round(motivationProfile.competenceMotivation * 100)}%
                  </div>
                  <Progress
                    value={motivationProfile.competenceMotivation * 100}
                    className='h-2 mt-1'
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenge Level Profile */}
      {challengeLevelProfile && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Challenge Level Profile
              <Badge
                className={getConfidenceBadge(challengeLevelProfile.confidence)}
              >
                {Math.round(challengeLevelProfile.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {challengeLevelProfile.currentLevel.toFixed(1)}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Current Level
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    {challengeLevelProfile.optimalLevel.toFixed(1)}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Optimal Level
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {Math.round(challengeLevelProfile.adaptationRate * 100)}%
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Adaptation Rate
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Comfort Zone</span>
                  <span className='text-sm text-muted-foreground'>
                    {challengeLevelProfile.comfortZone.min.toFixed(1)} -{' '}
                    {challengeLevelProfile.comfortZone.max.toFixed(1)}
                  </span>
                </div>
                <Progress
                  value={
                    (challengeLevelProfile.comfortZone.max -
                      challengeLevelProfile.comfortZone.min) *
                    10
                  }
                  className='h-2'
                />

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Stretch Zone</span>
                  <span className='text-sm text-muted-foreground'>
                    {challengeLevelProfile.stretchZone.min.toFixed(1)} -{' '}
                    {challengeLevelProfile.stretchZone.max.toFixed(1)}
                  </span>
                </div>
                <Progress
                  value={
                    (challengeLevelProfile.stretchZone.max -
                      challengeLevelProfile.stretchZone.min) *
                    10
                  }
                  className='h-2'
                />

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Panic Zone</span>
                  <span className='text-sm text-muted-foreground'>
                    {challengeLevelProfile.panicZone.min.toFixed(1)} -{' '}
                    {challengeLevelProfile.panicZone.max.toFixed(1)}
                  </span>
                </div>
                <Progress
                  value={
                    (challengeLevelProfile.panicZone.max -
                      challengeLevelProfile.panicZone.min) *
                    10
                  }
                  className='h-2'
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support System Profile */}
      {supportSystemProfile && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              Support System Profile
              <Badge
                className={getConfidenceBadge(supportSystemProfile.confidence)}
              >
                {Math.round(supportSystemProfile.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                <div className='text-center'>
                  <BookOpen className='h-6 w-6 mx-auto mb-2 text-blue-600' />
                  <div className='text-sm font-medium'>Instructional</div>
                  <div
                    className={`text-sm ${getPreferenceColor(supportSystemProfile.preferredSupportTypes.instructional)}`}
                  >
                    {Math.round(
                      supportSystemProfile.preferredSupportTypes.instructional *
                        100
                    )}
                    %
                  </div>
                  <Progress
                    value={
                      supportSystemProfile.preferredSupportTypes.instructional *
                      100
                    }
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Heart className='h-6 w-6 mx-auto mb-2 text-red-600' />
                  <div className='text-sm font-medium'>Motivational</div>
                  <div
                    className={`text-sm ${getPreferenceColor(supportSystemProfile.preferredSupportTypes.motivational)}`}
                  >
                    {Math.round(
                      supportSystemProfile.preferredSupportTypes.motivational *
                        100
                    )}
                    %
                  </div>
                  <Progress
                    value={
                      supportSystemProfile.preferredSupportTypes.motivational *
                      100
                    }
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Settings className='h-6 w-6 mx-auto mb-2 text-green-600' />
                  <div className='text-sm font-medium'>Technical</div>
                  <div
                    className={`text-sm ${getPreferenceColor(supportSystemProfile.preferredSupportTypes.technical)}`}
                  >
                    {Math.round(
                      supportSystemProfile.preferredSupportTypes.technical * 100
                    )}
                    %
                  </div>
                  <Progress
                    value={
                      supportSystemProfile.preferredSupportTypes.technical * 100
                    }
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Users className='h-6 w-6 mx-auto mb-2 text-purple-600' />
                  <div className='text-sm font-medium'>Social</div>
                  <div
                    className={`text-sm ${getPreferenceColor(supportSystemProfile.preferredSupportTypes.social)}`}
                  >
                    {Math.round(
                      supportSystemProfile.preferredSupportTypes.social * 100
                    )}
                    %
                  </div>
                  <Progress
                    value={
                      supportSystemProfile.preferredSupportTypes.social * 100
                    }
                    className='h-2 mt-1'
                  />
                </div>
                <div className='text-center'>
                  <Heart className='h-6 w-6 mx-auto mb-2 text-pink-600' />
                  <div className='text-sm font-medium'>Emotional</div>
                  <div
                    className={`text-sm ${getPreferenceColor(supportSystemProfile.preferredSupportTypes.emotional)}`}
                  >
                    {Math.round(
                      supportSystemProfile.preferredSupportTypes.emotional * 100
                    )}
                    %
                  </div>
                  <Progress
                    value={
                      supportSystemProfile.preferredSupportTypes.emotional * 100
                    }
                    className='h-2 mt-1'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <div className='text-center'>
                  <div className='text-sm font-medium'>Feedback Frequency</div>
                  <Badge variant='outline' className='mt-1'>
                    {supportSystemProfile.feedbackPreferences.frequency}
                  </Badge>
                </div>
                <div className='text-center'>
                  <div className='text-sm font-medium'>Feedback Detail</div>
                  <Badge variant='outline' className='mt-1'>
                    {supportSystemProfile.feedbackPreferences.detail}
                  </Badge>
                </div>
                <div className='text-center'>
                  <div className='text-sm font-medium'>Feedback Tone</div>
                  <Badge variant='outline' className='mt-1'>
                    {supportSystemProfile.feedbackPreferences.tone}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalization Insights */}
      {showInsights && personalizationInsights && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Lightbulb className='h-5 w-5' />
              Personalization Insights (
              {personalizationInsights.insights.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {personalizationInsights.insights.map((insight, index) => (
                <div key={index} className='p-4 border rounded-lg'>
                  <div className='flex items-start justify-between mb-2'>
                    <h4 className='font-medium'>{insight.title}</h4>
                    <div className='flex gap-2'>
                      <Badge variant='outline'>{insight.type}</Badge>
                      <Badge
                        className={
                          insight.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : insight.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground mb-3'>
                    {insight.description}
                  </p>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-xs text-muted-foreground'>
                      Confidence: {Math.round(insight.confidence * 100)}%
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Actionable: {insight.actionable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {insight.recommendations.length > 0 && (
                    <div>
                      <h5 className='text-sm font-medium mb-2'>
                        Recommendations:
                      </h5>
                      <ul className='text-sm text-muted-foreground space-y-1'>
                        {insight.recommendations.map(
                          (recommendation, recIndex) => (
                            <li
                              key={recIndex}
                              className='flex items-start gap-2'
                            >
                              <CheckCircle className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                              {recommendation}
                            </li>
                          )
                        )}
                      </ul>
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
          <span>Analyzing personalization data...</span>
        </div>
      )}
    </div>
  );
}
