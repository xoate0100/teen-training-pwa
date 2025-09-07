'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  Target,
  Zap,
  Brain,
  Eye
} from 'lucide-react';
import { useSessionDataIntelligence } from '@/lib/hooks/use-session-data-intelligence';
import { SetMetrics } from '@/lib/services/session-data-intelligence';

interface SessionDataDashboardProps {
  sessionId: string;
  currentExercise?: string;
  onSetComplete?: (setData: SetMetrics) => void;
}

export function SessionDataDashboard({ 
  sessionId, 
  currentExercise,
  onSetComplete 
}: SessionDataDashboardProps) {
  const {
    realTimeTracking,
    performanceMetrics,
    formQuality,
    rpeAnalysis,
    safetyMonitoring,
    isTracking,
    isCalculatingMetrics,
    error,
    trackPerformance,
    assessFormQuality,
    analyzeRPE,
    monitorSafety,
    startTracking,
    stopTracking,
    updateSetData,
  } = useSessionDataIntelligence();

  const [currentSet, setCurrentSet] = useState<SetMetrics | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Start tracking when component mounts
  useEffect(() => {
    if (sessionId) {
      startTracking(sessionId);
      setIsSessionActive(true);
    }

    return () => {
      stopTracking();
      setIsSessionActive(false);
    };
  }, [sessionId, startTracking, stopTracking]);

  // Handle set completion
  const handleSetComplete = async (setData: SetMetrics) => {
    if (!currentExercise) return;

    try {
      // Track performance
      await trackPerformance(sessionId, currentExercise, setData);
      
      // Assess form quality
      await assessFormQuality(currentExercise, [setData]);
      
      // Analyze RPE
      await analyzeRPE(currentExercise, setData.rpe, 7); // Target RPE of 7
      
      // Monitor safety
      await monitorSafety(sessionId, currentExercise, setData);
      
      // Update set data
      updateSetData(setData);
      
      // Notify parent component
      if (onSetComplete) {
        onSetComplete(setData);
      }
    } catch (err) {
      console.error('Error handling set completion:', err);
    }
  };

  if (error) {
    return (
      <Alert className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Session Data Intelligence</h1>
          <p className="text-muted-foreground">
            Real-time performance tracking, form assessment, and safety monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isSessionActive ? "destructive" : "default"}
            onClick={isSessionActive ? stopTracking : () => startTracking(sessionId)}
            disabled={isTracking}
          >
            {isSessionActive ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
        </div>
      </div>

      {/* Real-time Tracking */}
      {realTimeTracking && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Session Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{realTimeTracking.currentExercise}</div>
                <p className="text-sm text-muted-foreground">Current Exercise</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{realTimeTracking.currentSet}/{realTimeTracking.totalSets}</div>
                <p className="text-sm text-muted-foreground">Sets</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(realTimeTracking.sessionProgress)}%</div>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{realTimeTracking.timeElapsed}m</div>
                <p className="text-sm text-muted-foreground">Time Elapsed</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Session Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(realTimeTracking.sessionProgress)}%</span>
              </div>
              <Progress value={realTimeTracking.sessionProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{performanceMetrics.totalVolume}</div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{performanceMetrics.averageRPE.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground">Average RPE</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{performanceMetrics.consistency.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground">Consistency</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Form Quality</span>
                <div className="flex items-center gap-2">
                  <Progress value={performanceMetrics.formQuality * 10} className="w-20" />
                  <span className="text-sm text-muted-foreground">{performanceMetrics.formQuality.toFixed(1)}/10</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Safety Score</span>
                <div className="flex items-center gap-2">
                  <Progress value={performanceMetrics.safetyScore * 10} className="w-20" />
                  <span className="text-sm text-muted-foreground">{performanceMetrics.safetyScore.toFixed(1)}/10</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Quality Assessment */}
      {formQuality && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Form Quality Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{formQuality.overallScore}</div>
                <p className="text-sm text-muted-foreground">Overall</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formQuality.techniqueScore}</div>
                <p className="text-sm text-muted-foreground">Technique</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formQuality.tempoScore}</div>
                <p className="text-sm text-muted-foreground">Tempo</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formQuality.stabilityScore}</div>
                <p className="text-sm text-muted-foreground">Stability</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {formQuality.feedback.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Feedback</h4>
                  <div className="space-y-1">
                    {formQuality.feedback.map((feedback, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feedback}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {formQuality.improvements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Improvements</h4>
                  <div className="space-y-1">
                    {formQuality.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {formQuality.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Warnings</h4>
                  <div className="space-y-1">
                    {formQuality.warnings.map((warning, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RPE Analysis */}
      {rpeAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              RPE Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{rpeAnalysis.currentRPE}</div>
                <p className="text-sm text-muted-foreground">Current RPE</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{rpeAnalysis.targetRPE}</div>
                <p className="text-sm text-muted-foreground">Target RPE</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {rpeAnalysis.loadAdjustment > 0 ? '+' : ''}{rpeAnalysis.loadAdjustment.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Load Adjustment</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">RPE Trend</span>
                <Badge variant={
                  rpeAnalysis.rpeTrend === 'increasing' ? 'destructive' :
                  rpeAnalysis.rpeTrend === 'decreasing' ? 'default' : 'secondary'
                }>
                  {rpeAnalysis.rpeTrend}
                </Badge>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">{rpeAnalysis.recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Safety Monitoring */}
      {safetyMonitoring && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safety Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Risk Level</span>
                <Badge variant={
                  safetyMonitoring.riskLevel === 'critical' ? 'destructive' :
                  safetyMonitoring.riskLevel === 'high' ? 'destructive' :
                  safetyMonitoring.riskLevel === 'medium' ? 'default' : 'secondary'
                }>
                  {safetyMonitoring.riskLevel.toUpperCase()}
                </Badge>
              </div>
              {safetyMonitoring.shouldStop && (
                <Badge variant="destructive" className="animate-pulse">
                  STOP IMMEDIATELY
                </Badge>
              )}
            </div>
            
            {safetyMonitoring.factors.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="font-medium">Safety Factors</h4>
                {safetyMonitoring.factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{factor.description}</span>
                    </div>
                    <Badge variant={
                      factor.severity === 'critical' ? 'destructive' :
                      factor.severity === 'high' ? 'destructive' : 'default'
                    }>
                      {factor.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            
            {safetyMonitoring.recommendations.length > 0 && (
              <div className="space-y-1">
                <h4 className="font-medium">Recommendations</h4>
                {safetyMonitoring.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Set Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Complete Set
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Weight (lbs)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="0"
                onChange={(e) => setCurrentSet(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Reps</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="0"
                onChange={(e) => setCurrentSet(prev => ({ ...prev, reps: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">RPE</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full p-2 border rounded"
                placeholder="1-10"
                onChange={(e) => setCurrentSet(prev => ({ ...prev, rpe: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  if (currentSet && currentExercise) {
                    const setData: SetMetrics = {
                      ...currentSet,
                      setNumber: 1, // This would be calculated based on current set
                      formQuality: 5, // This would be assessed
                      restTime: 60, // This would be calculated
                      completed: true,
                      timestamp: new Date(),
                    };
                    handleSetComplete(setData);
                  }
                }}
                disabled={!currentSet || !currentExercise || isCalculatingMetrics}
                className="w-full"
              >
                Complete Set
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
