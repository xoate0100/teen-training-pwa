'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Cloud, 
  Sun, 
  Moon, 
  Wind, 
  Droplets, 
  Clock, 
  Calendar, 
  Users, 
  Heart, 
  Brain, 
  Lightbulb,
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
  Star,
  Zap,
  Shield,
  Award,
  Target,
  Settings,
  Eye,
  Ear,
  Hand,
  MessageSquare,
  User,
  Mail,
  Phone,
  MapPin as LocationIcon,
  Thermometer,
  Gauge,
  Wind as WindIcon,
  Sun as SunIcon,
  Cloud as CloudIcon,
  Droplets as RainIcon,
  Snowflake,
  Wind2
} from 'lucide-react';
import { useContextualIntelligence } from '@/lib/hooks/use-contextual-intelligence';
import { 
  EnvironmentalContext, 
  TimeBasedOptimization, 
  SocialContext, 
  EmotionalState, 
  ContextualInsights 
} from '@/lib/services/contextual-intelligence';

export function ContextualIntelligenceDashboard() {
  const {
    environmentalContext,
    analyzeEnvironmentalContext,
    timeBasedOptimization,
    analyzeTimeBasedOptimization,
    socialContext,
    analyzeSocialContext,
    emotionalState,
    analyzeEmotionalState,
    contextualInsights,
    generateContextualInsights,
    destroy,
    isLoading,
    error,
  } = useContextualIntelligence();

  const [selectedUserId, setSelectedUserId] = useState('current-user');
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [showInsights, setShowInsights] = useState(true);

  // Auto-analyze periodically
  useEffect(() => {
    if (autoAnalysis) {
      const interval = setInterval(() => {
        analyzeEnvironmentalContext(selectedUserId);
        analyzeTimeBasedOptimization(selectedUserId);
        analyzeSocialContext(selectedUserId);
        analyzeEmotionalState(selectedUserId);
        generateContextualInsights(selectedUserId);
      }, 300000); // Every 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoAnalysis, selectedUserId, analyzeEnvironmentalContext, analyzeTimeBasedOptimization, analyzeSocialContext, analyzeEmotionalState, generateContextualInsights]);

  // Handle analysis
  const handleAnalyzeAll = async () => {
    try {
      await analyzeEnvironmentalContext(selectedUserId);
      await analyzeTimeBasedOptimization(selectedUserId);
      await analyzeSocialContext(selectedUserId);
      await analyzeEmotionalState(selectedUserId);
      await generateContextualInsights(selectedUserId);
    } catch (error) {
      console.error('Failed to analyze all contexts:', error);
    }
  };

  // Get weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <SunIcon className="h-6 w-6 text-yellow-500" />;
      case 'cloudy': return <CloudIcon className="h-6 w-6 text-gray-500" />;
      case 'rainy': return <RainIcon className="h-6 w-6 text-blue-500" />;
      case 'snowy': return <Snowflake className="h-6 w-6 text-blue-300" />;
      case 'windy': return <Wind2 className="h-6 w-6 text-gray-400" />;
      default: return <CloudIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get mood icon
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <SunIcon className="h-6 w-6 text-yellow-500" />;
      case 'sad': return <Moon className="h-6 w-6 text-blue-500" />;
      case 'angry': return <Zap className="h-6 w-6 text-red-500" />;
      case 'anxious': return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case 'excited': return <Star className="h-6 w-6 text-purple-500" />;
      case 'calm': return <Heart className="h-6 w-6 text-green-500" />;
      case 'frustrated': return <TrendingDown className="h-6 w-6 text-red-500" />;
      case 'motivated': return <Target className="h-6 w-6 text-blue-500" />;
      case 'tired': return <Moon className="h-6 w-6 text-gray-500" />;
      case 'confident': return <Award className="h-6 w-6 text-gold-500" />;
      default: return <Heart className="h-6 w-6 text-gray-500" />;
    }
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
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Contextual Intelligence Analysis
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
                onClick={handleAnalyzeAll}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Analyze All
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">User ID</label>
              <input
                type="text"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter user ID"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => setShowInsights(!showInsights)} className="w-full">
                <Lightbulb className="h-4 w-4 mr-2" />
                {showInsights ? 'Hide Insights' : 'Show Insights'}
              </Button>
            </div>
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

      {/* Environmental Context */}
      {environmentalContext && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Environmental Context
              <Badge className={getConfidenceBadge(environmentalContext.confidence)}>
                {Math.round(environmentalContext.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <LocationIcon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {environmentalContext.location.type}
                  </div>
                </div>
                <div className="text-center">
                  {getWeatherIcon(environmentalContext.weather.condition)}
                  <div className="text-sm font-medium">Weather</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {environmentalContext.weather.condition}
                  </div>
                </div>
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium">Time Period</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {environmentalContext.timeOfDay.period}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Thermometer className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <div className="text-sm font-medium">Temperature</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(environmentalContext.weather.temperature)}°C
                  </div>
                </div>
                <div className="text-center">
                  <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">Humidity</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(environmentalContext.weather.humidity)}%
                  </div>
                </div>
                <div className="text-center">
                  <WindIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium">Wind Speed</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(environmentalContext.weather.windSpeed)} km/h
                  </div>
                </div>
                <div className="text-center">
                  <Gauge className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-sm font-medium">UV Index</div>
                  <div className="text-sm text-muted-foreground">
                    {environmentalContext.weather.uvIndex}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time-based Optimization */}
      {timeBasedOptimization && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time-based Optimization
              <Badge className={getConfidenceBadge(timeBasedOptimization.confidence)}>
                {Math.round(timeBasedOptimization.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">Strength</div>
                  <div className="text-sm text-muted-foreground">
                    {timeBasedOptimization.optimalTrainingTimes.strength.join(', ')}
                  </div>
                </div>
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-sm font-medium">Volleyball</div>
                  <div className="text-sm text-muted-foreground">
                    {timeBasedOptimization.optimalTrainingTimes.volleyball.join(', ')}
                  </div>
                </div>
                <div className="text-center">
                  <Zap className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium">Plyometric</div>
                  <div className="text-sm text-muted-foreground">
                    {timeBasedOptimization.optimalTrainingTimes.plyometric.join(', ')}
                  </div>
                </div>
                <div className="text-center">
                  <Heart className="h-6 w-6 mx-auto mb-2 text-pink-600" />
                  <div className="text-sm font-medium">Recovery</div>
                  <div className="text-sm text-muted-foreground">
                    {timeBasedOptimization.optimalTrainingTimes.recovery.join(', ')}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Energy Patterns by Time of Day</h4>
                {Object.entries(timeBasedOptimization.energyPatterns.timeOfDay).map(([time, energy]) => (
                  <div key={time} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{time.replace('_', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={energy * 100} className="w-24 h-2" />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {Math.round(energy * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Context */}
      {socialContext && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Social Context
              <Badge className={getConfidenceBadge(socialContext.confidence)}>
                {Math.round(socialContext.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">Group Size</div>
                  <div className="text-sm text-muted-foreground">
                    {socialContext.socialPresence.groupSize} {socialContext.socialPresence.isAlone ? 'person' : 'people'}
                  </div>
                </div>
                <div className="text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-sm font-medium">Group Type</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {socialContext.socialPresence.groupType}
                  </div>
                </div>
                <div className="text-center">
                  <MessageSquare className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium">Interaction Level</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {socialContext.socialPreferences.socialInteractionLevel}
                  </div>
                </div>
                <div className="text-center">
                  <Eye className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-sm font-medium">Feedback Preference</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {socialContext.socialPreferences.socialFeedbackPreference}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Social Dynamics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">Leadership</div>
                    <Progress value={socialContext.socialPresence.socialDynamics.leadership * 100} className="h-2 mt-1" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(socialContext.socialPresence.socialDynamics.leadership * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Collaboration</div>
                    <Progress value={socialContext.socialPresence.socialDynamics.collaboration * 100} className="h-2 mt-1" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(socialContext.socialPresence.socialDynamics.collaboration * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Competition</div>
                    <Progress value={socialContext.socialPresence.socialDynamics.competition * 100} className="h-2 mt-1" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(socialContext.socialPresence.socialDynamics.competition * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Support</div>
                    <Progress value={socialContext.socialPresence.socialDynamics.support * 100} className="h-2 mt-1" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(socialContext.socialPresence.socialDynamics.support * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emotional State */}
      {emotionalState && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Emotional State
              <Badge className={getConfidenceBadge(emotionalState.confidence)}>
                {Math.round(emotionalState.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  {getMoodIcon(emotionalState.currentMood.primary)}
                  <div className="text-sm font-medium">Current Mood</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {emotionalState.currentMood.primary}
                  </div>
                </div>
                <div className="text-center">
                  <Gauge className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">Intensity</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(emotionalState.currentMood.intensity * 100)}%
                  </div>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-sm font-medium">Stability</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(emotionalState.currentMood.stability * 100)}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Emotional Regulation</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">Stress Level</div>
                    <Progress value={emotionalState.emotionalRegulation.stressLevel * 100} className="h-2 mt-1" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(emotionalState.emotionalRegulation.stressLevel * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Resilience</div>
                    <Progress value={emotionalState.emotionalRegulation.resilience * 100} className="h-2 mt-1" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(emotionalState.emotionalRegulation.resilience * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Emotional Intelligence</div>
                    <Progress value={emotionalState.emotionalRegulation.emotionalIntelligence * 100} className="h-2 mt-1" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(emotionalState.emotionalRegulation.emotionalIntelligence * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Coping Strategies</div>
                    <div className="text-sm text-muted-foreground">
                      {emotionalState.emotionalRegulation.copingStrategies.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contextual Insights */}
      {showInsights && contextualInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Contextual Insights ({contextualInsights.insights.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contextualInsights.insights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline">{insight.type}</Badge>
                      <Badge className={
                        insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">
                      Confidence: {Math.round(insight.confidence * 100)}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Actionable: {insight.actionable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {insight.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {insight.recommendations.map((recommendation, recIndex) => (
                          <li key={recIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {insight.contextFactors.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium mb-1">Context Factors:</h5>
                      <div className="flex flex-wrap gap-1">
                        {insight.contextFactors.map((factor, factorIndex) => (
                          <Badge key={factorIndex} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
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
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Analyzing contextual data...</span>
        </div>
      )}
    </div>
  );
}
