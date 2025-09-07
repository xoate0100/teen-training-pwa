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
  CalendarLightbulb as CalendarLightbulbIcon
} from 'lucide-react';
import { useContinuousImprovement } from '@/lib/hooks/use-continuous-improvement';

export function ContinuousImprovementDashboard() {
  const {
    featureAnalyses,
    analyzeFeatureEffectiveness,
    feedbackItems,
    integrateUserFeedback,
    optimizations,
    createPerformanceOptimization,
    updateOptimizationProgress,
    innovationIdeas,
    addInnovationIdea,
    updateInnovationStatus,
    metrics,
    calculateContinuousImprovementMetrics,
    destroy,
    isLoading,
    error,
  } = useContinuousImprovement();

  const [activeTab, setActiveTab] = useState<'features' | 'feedback' | 'optimization' | 'innovation' | 'metrics'>('features');
  const [selectedFeature, setSelectedFeature] = useState<string>('session_tracking');
  const [autoAnalysis, setAutoAnalysis] = useState(true);

  // Auto-analyze features periodically
  useEffect(() => {
    if (autoAnalysis) {
      const interval = setInterval(() => {
        const features = ['session_tracking', 'progress_monitoring', 'exercise_recommendations', 'achievement_system'];
        features.forEach(featureId => {
          analyzeFeatureEffectiveness(featureId);
        });
        calculateContinuousImprovementMetrics();
      }, 300000); // Every 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoAnalysis, analyzeFeatureEffectiveness, calculateContinuousImprovementMetrics]);

  // Handle feature analysis
  const handleAnalyzeFeature = async (featureId: string) => {
    try {
      await analyzeFeatureEffectiveness(featureId);
    } catch (error) {
      console.error('Failed to analyze feature:', error);
    }
  };

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    try {
      const feedback = {
        userId: 'current-user',
        feedbackType: 'improvement_suggestion' as const,
        category: 'functionality' as const,
        priority: 'medium' as const,
        status: 'new' as const,
        content: {
          title: 'Sample Feedback',
          description: 'This is a sample feedback item for testing the continuous improvement system.',
        },
        metadata: {
          userAgent: navigator.userAgent,
          appVersion: '1.0.0',
          timestamp: new Date(),
        },
        analysis: {
          sentiment: 'neutral' as const,
          urgency: 'eventual' as const,
          complexity: 'simple' as const,
          effort: 'low' as const,
          impact: 'low' as const,
          tags: ['test'],
        },
        resolution: {
          userNotified: false,
        },
      };

      await integrateUserFeedback(feedback);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  // Handle optimization creation
  const handleCreateOptimization = async () => {
    try {
      const optimization = {
        category: 'performance' as const,
        metric: 'page_load_time',
        baseline: 2.5,
        target: 1.5,
        current: 2.5,
        improvement: 0,
        status: 'planned' as const,
        priority: 'high' as const,
        effort: 'medium' as const,
        impact: 'high' as const,
        description: 'Optimize page load time for better user experience',
        implementation: {
          changes: ['Implement lazy loading', 'Optimize images', 'Minify CSS/JS'],
          dependencies: ['Image optimization library', 'Code splitting'],
          risks: ['Potential breaking changes', 'Testing overhead'],
          rollbackPlan: 'Revert to previous version if issues arise',
        },
        metrics: {
          before: { loadTime: 2.5, bounceRate: 0.3 },
          after: { loadTime: 1.5, bounceRate: 0.2 },
          improvement: { loadTime: 0.4, bounceRate: 0.33 },
        },
        timeline: {
          planned: new Date(),
          estimated: 7,
        },
      };

      await createPerformanceOptimization(optimization);
    } catch (error) {
      console.error('Failed to create optimization:', error);
    }
  };

  // Handle innovation idea creation
  const handleCreateInnovationIdea = async () => {
    try {
      const idea = {
        title: 'AI-Powered Workout Recommendations',
        description: 'Implement machine learning to provide personalized workout recommendations based on user behavior and performance data.',
        category: 'ai' as const,
        source: 'internal' as const,
        priority: 'high' as const,
        status: 'idea' as const,
        stage: 'concept' as const,
        evaluation: {
          feasibility: 'high' as const,
          impact: 'high' as const,
          effort: 'high' as const,
          timeline: 'medium' as const,
          resources: ['ML Engineer', 'Data Scientist'],
          dependencies: ['User behavior data', 'Performance metrics'],
          risks: ['Data privacy concerns', 'Model accuracy'],
          benefits: ['Improved user engagement', 'Better workout outcomes'],
        },
        metrics: {
          userDemand: 8,
          businessValue: 9,
          technicalComplexity: 7,
          developmentCost: 160,
          maintenanceCost: 20,
        },
        stakeholders: {
          product: ['Product Manager'],
          engineering: ['ML Engineer', 'Backend Developer'],
          design: ['UX Designer'],
          marketing: ['Marketing Manager'],
          users: ['Beta Testers'],
        },
        timeline: {
          proposed: new Date(),
          estimated: 90,
        },
      };

      await addInnovationIdea(idea);
    } catch (error) {
      console.error('Failed to create innovation idea:', error);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'deployed': return 'bg-purple-100 text-purple-800';
      case 'monitoring': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Continuous Improvement Dashboard
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoAnalysis(!autoAnalysis)}
              >
                {autoAnalysis ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {autoAnalysis ? 'Stop Auto-Analysis' : 'Start Auto-Analysis'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => calculateContinuousImprovementMetrics()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Metrics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={destroy}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'features' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('features')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Feature Analysis
            </Button>
            <Button
              variant={activeTab === 'feedback' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('feedback')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              User Feedback
            </Button>
            <Button
              variant={activeTab === 'optimization' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('optimization')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Performance
            </Button>
            <Button
              variant={activeTab === 'innovation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('innovation')}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Innovation
            </Button>
            <Button
              variant={activeTab === 'metrics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('metrics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Metrics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Feature Effectiveness Analysis */}
      {activeTab === 'features' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feature Effectiveness Analysis
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedFeature}
                  onChange={(e) => setSelectedFeature(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="session_tracking">Session Tracking</option>
                  <option value="progress_monitoring">Progress Monitoring</option>
                  <option value="exercise_recommendations">Exercise Recommendations</option>
                  <option value="achievement_system">Achievement System</option>
                </select>
                <Button
                  size="sm"
                  onClick={() => handleAnalyzeFeature(selectedFeature)}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Analyze
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(featureAnalyses.entries()).map(([featureId, analysis]) => (
                <div key={featureId} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{analysis.featureName}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{analysis.category}</p>
                    </div>
                    <Badge variant="outline">{analysis.metrics.adoptionRate.toFixed(1)}% adoption</Badge>
                  </div>
                  
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analysis.metrics.usageFrequency.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Usage/Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analysis.metrics.userSatisfaction.toFixed(1)}/10</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(analysis.metrics.completionRate * 100).toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Completion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(analysis.metrics.errorRate * 100).toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Error Rate</div>
                    </div>
                  </div>

                  {/* Trends */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Trends</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analysis.trends.map((trend, index) => (
                        <div key={index} className="p-3 border rounded">
                          <div className="text-sm text-muted-foreground mb-1">{trend.period}</div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(trend.adoptionTrend)}
                            <span className="text-sm">Adoption: {trend.adoptionTrend}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(trend.satisfactionTrend)}
                            <span className="text-sm">Satisfaction: {trend.satisfactionTrend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="font-medium mb-2">Insights</h4>
                    <div className="space-y-2">
                      {analysis.insights.map((insight, index) => (
                        <div key={index} className="p-3 border rounded">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{insight.insight}</span>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(insight.impact)}>
                                {insight.impact}
                              </Badge>
                              <Badge variant="outline">
                                {(insight.confidence * 100).toFixed(0)}% confidence
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Feedback Integration */}
      {activeTab === 'feedback' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                User Feedback Integration ({feedbackItems.size} items)
              </div>
              <Button size="sm" onClick={handleSubmitFeedback} disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Feedback
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(feedbackItems.values()).map((feedback) => (
                <div key={feedback.feedbackId} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{feedback.content.title}</h3>
                      <p className="text-sm text-muted-foreground">{feedback.content.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(feedback.priority)}>
                        {feedback.priority}
                      </Badge>
                      <Badge className={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    <div>Type: {feedback.feedbackType}</div>
                    <div>Category: {feedback.category}</div>
                    <div>Sentiment: {feedback.analysis.sentiment}</div>
                    <div>Urgency: {feedback.analysis.urgency}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {feedback.metadata.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Optimization */}
      {activeTab === 'optimization' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Optimization ({optimizations.size} items)
              </div>
              <Button size="sm" onClick={handleCreateOptimization} disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Create Optimization
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(optimizations.values()).map((optimization) => (
                <div key={optimization.optimizationId} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{optimization.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {optimization.metric}: {optimization.baseline} → {optimization.target} ({optimization.improvement.toFixed(1)}% improvement)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(optimization.priority)}>
                        {optimization.priority}
                      </Badge>
                      <Badge className={getStatusColor(optimization.status)}>
                        {optimization.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    <div>Category: {optimization.category}</div>
                    <div>Effort: {optimization.effort}</div>
                    <div>Impact: {optimization.impact}</div>
                    <div>Estimated: {optimization.timeline.estimated} days</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {optimization.lastUpdated.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Innovation Pipeline */}
      {activeTab === 'innovation' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Innovation Pipeline ({innovationIdeas.size} ideas)
              </div>
              <Button size="sm" onClick={handleCreateInnovationIdea} disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Idea
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(innovationIdeas.values()).map((idea) => (
                <div key={idea.ideaId} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{idea.title}</h3>
                      <p className="text-sm text-muted-foreground">{idea.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(idea.priority)}>
                        {idea.priority}
                      </Badge>
                      <Badge className={getStatusColor(idea.status)}>
                        {idea.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    <div>Category: {idea.category}</div>
                    <div>Stage: {idea.stage}</div>
                    <div>Feasibility: {idea.evaluation.feasibility}</div>
                    <div>Impact: {idea.evaluation.impact}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {idea.timeline.proposed.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continuous Improvement Metrics */}
      {activeTab === 'metrics' && metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Continuous Improvement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Health */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{metrics.overallHealth.toFixed(1)}/100</div>
                <div className="text-lg text-muted-foreground mb-4">Overall Health Score</div>
                <Progress value={metrics.overallHealth} className="h-2" />
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.featureAdoption.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Feature Adoption</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.userSatisfaction.toFixed(1)}/100</div>
                  <div className="text-sm text-muted-foreground">User Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.performanceScore.toFixed(1)}/100</div>
                  <div className="text-sm text-muted-foreground">Performance Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.feedbackResponse.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Feedback Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.innovationRate.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Innovation Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.improvementVelocity.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Improvement Velocity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.qualityScore.toFixed(1)}/100</div>
                  <div className="text-sm text-muted-foreground">Quality Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.overallHealth.toFixed(1)}/100</div>
                  <div className="text-sm text-muted-foreground">Overall Health</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Last updated: {metrics.lastUpdated.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Processing continuous improvement data...</span>
        </div>
      )}
    </div>
  );
}
