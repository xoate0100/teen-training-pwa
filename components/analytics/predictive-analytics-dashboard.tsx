'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Brain, 
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Shield,
  Lightbulb,
  Clock,
  RefreshCw,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { usePredictiveAnalytics } from '@/lib/hooks/use-predictive-analytics';
import { 
  PerformanceForecast, 
  SkillDevelopmentTrajectory, 
  GoalAchievementTimeline, 
  PlateauDetection, 
  RiskAssessment, 
  OptimizationRecommendation 
} from '@/lib/services/predictive-analytics';

export function PredictiveAnalyticsDashboard() {
  const {
    performanceForecasts,
    generatePerformanceForecast,
    skillTrajectories,
    generateSkillTrajectory,
    goalTimelines,
    generateGoalTimeline,
    plateaus,
    detectPlateaus,
    riskAssessment,
    generateRiskAssessment,
    optimizationRecommendations,
    generateOptimizationRecommendations,
    clearCache,
    isLoading,
    error,
  } = usePredictiveAnalytics();

  const [selectedExercise, setSelectedExercise] = useState('squat');
  const [selectedSkill, setSelectedSkill] = useState('strength');
  const [selectedGoal, setSelectedGoal] = useState('strength-gain');
  const [timeframe, setTimeframe] = useState(30);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        generateRiskAssessment();
        detectPlateaus();
        generateOptimizationRecommendations();
      }, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh, generateRiskAssessment, detectPlateaus, generateOptimizationRecommendations]);

  // Handle performance forecast
  const handlePerformanceForecast = async () => {
    try {
      await generatePerformanceForecast(selectedExercise, timeframe);
    } catch (error) {
      console.error('Failed to generate performance forecast:', error);
    }
  };

  // Handle skill trajectory
  const handleSkillTrajectory = async () => {
    try {
      await generateSkillTrajectory(selectedSkill);
    } catch (error) {
      console.error('Failed to generate skill trajectory:', error);
    }
  };

  // Handle goal timeline
  const handleGoalTimeline = async () => {
    try {
      await generateGoalTimeline(selectedGoal, 'Sample Goal', 100);
    } catch (error) {
      console.error('Failed to generate goal timeline:', error);
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get confidence badge
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Get risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get risk level badge
  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Predictive Analytics Dashboard
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {autoRefresh ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCache}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Exercise</label>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="squat">Squat</option>
                <option value="bench">Bench Press</option>
                <option value="deadlift">Deadlift</option>
                <option value="overhead">Overhead Press</option>
                <option value="row">Barbell Row</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Skill Area</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="strength">Strength</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
                <option value="coordination">Coordination</option>
                <option value="power">Power</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Timeframe (days)</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              >
                <option value={7}>1 Week</option>
                <option value={30}>1 Month</option>
                <option value={90}>3 Months</option>
                <option value={180}>6 Months</option>
                <option value={365}>1 Year</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handlePerformanceForecast} disabled={isLoading} className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Forecast
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

      {/* Performance Forecasts */}
      {performanceForecasts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Forecasts ({performanceForecasts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceForecasts.map((forecast, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{forecast.exerciseName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Current: {forecast.currentMax} lbs → Predicted: {forecast.predictedMax.toFixed(1)} lbs
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getConfidenceBadge(forecast.confidence)}>
                        {forecast.confidence.toFixed(1)}% confidence
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {forecast.timeframe} days
                      </p>
                    </div>
                  </div>

                  {/* Performance Factors */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Historical Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {(forecast.factors.historicalProgress * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={forecast.factors.historicalProgress * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Consistency</span>
                        <span className="text-sm text-muted-foreground">
                          {(forecast.factors.consistency * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={forecast.factors.consistency * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Recovery</span>
                        <span className="text-sm text-muted-foreground">
                          {(forecast.factors.recovery * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={forecast.factors.recovery * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Nutrition</span>
                        <span className="text-sm text-muted-foreground">
                          {(forecast.factors.nutrition * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={forecast.factors.nutrition * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Sleep</span>
                        <span className="text-sm text-muted-foreground">
                          {(forecast.factors.sleep * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={forecast.factors.sleep * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Stress Management</span>
                        <span className="text-sm text-muted-foreground">
                          {(forecast.factors.stress * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={forecast.factors.stress * 100} className="h-2" />
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Recommendations:</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {forecast.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-1" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risk Factors */}
                  {forecast.riskFactors.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h5 className="font-medium text-sm text-red-600">Risk Factors:</h5>
                      <ul className="text-sm text-red-600 space-y-1">
                        {forecast.riskFactors.map((risk, riskIndex) => (
                          <li key={riskIndex} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 mt-1" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      {riskAssessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Overall Risk Level</span>
                <Badge className={getRiskLevelBadge(
                  riskAssessment.overallRisk < 30 ? 'low' : 
                  riskAssessment.overallRisk < 60 ? 'medium' : 
                  riskAssessment.overallRisk < 80 ? 'high' : 'critical'
                )}>
                  {riskAssessment.overallRisk}%
                </Badge>
              </div>

              <Progress 
                value={riskAssessment.overallRisk} 
                className="h-3"
              />

              {riskAssessment.riskFactors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Risk Factors:</h4>
                  {riskAssessment.riskFactors.map((factor, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{factor.type.replace('_', ' ').toUpperCase()}</span>
                        <Badge className={getRiskLevelBadge(factor.level)}>
                          {factor.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{factor.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Contributing Factors:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {factor.contributingFactors.map((contrib, contribIndex) => (
                            <li key={contribIndex}>• {contrib}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {riskAssessment.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations:</h4>
                  {riskAssessment.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <span className="font-medium">{rec.priority}: </span>
                        <span>{rec.action}</span>
                        <p className="text-xs text-muted-foreground mt-1">{rec.expectedImpact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Recommendations */}
      {optimizationRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Optimization Recommendations ({optimizationRecommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizationRecommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{rec.type.replace('_', ' ').toUpperCase()}</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {rec.implementationDifficulty}
                      </Badge>
                      <Badge variant="outline">
                        {rec.timeToImplement} days
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Expected Improvement:</span>
                    <span className="text-sm text-green-600 font-medium">
                      +{rec.expectedImprovement.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Implementation Steps:</h5>
                    <ol className="text-sm text-muted-foreground space-y-1">
                      {rec.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="text-xs bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center mt-0.5">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={handleSkillTrajectory} disabled={isLoading}>
          <Target className="h-4 w-4 mr-2" />
          Generate Skill Trajectory
        </Button>
        <Button onClick={handleGoalTimeline} disabled={isLoading}>
          <Clock className="h-4 w-4 mr-2" />
          Generate Goal Timeline
        </Button>
        <Button onClick={generateRiskAssessment} disabled={isLoading}>
          <Shield className="h-4 w-4 mr-2" />
          Generate Risk Assessment
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Generating analytics...</span>
        </div>
      )}
    </div>
  );
}
