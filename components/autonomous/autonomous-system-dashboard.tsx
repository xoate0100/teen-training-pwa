'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Target,
  Cpu,
  Database,
  Network,
  Shield,
  Lightbulb,
  Clock,
  Users,
  TestTube,
} from 'lucide-react';
import { useAutonomousSystemManagement } from '@/lib/hooks/use-autonomous-system-management';
import {
  ModelPerformanceMetrics,
  ParameterTuningResult,
  ABTestConfig,
  ABTestResult,
  LearningPattern,
  SystemHealthMetrics,
  AutomationRule,
} from '@/lib/services/autonomous-system-management';

export function AutonomousSystemDashboard() {
  const {
    modelMetrics,
    monitorModelPerformance,
    parameterHistory,
    tuneParameters,
    abTests,
    abTestResults,
    createABTest,
    runABTest,
    learningPatterns,
    systemHealth,
    automationRules,
    createAutomationRule,
    evaluateAutomationRules,
    destroy,
    isLoading,
    error,
  } = useAutonomousSystemManagement();

  const [selectedModel, setSelectedModel] = useState('performance-forecast');
  const [autoLearning, setAutoLearning] = useState(true);
  const [showCreateABTest, setShowCreateABTest] = useState(false);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [newABTest, setNewABTest] = useState({
    testName: '',
    description: '',
    variants: [{ name: 'Control', weight: 0.5, config: {} }],
    successMetric: 'accuracy',
    minimumSampleSize: 100,
  });
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    conditions: [{ metric: 'recovery_score', operator: '<', value: 6 }],
    actions: [
      {
        type: 'send_notification',
        parameters: { message: 'Recovery score is low' },
      },
    ],
    enabled: true,
    priority: 1,
  });

  // Auto-evaluate rules periodically
  useEffect(() => {
    if (autoLearning) {
      const interval = setInterval(() => {
        evaluateAutomationRules();
      }, 60000); // Every minute

      return () => clearInterval(interval);
    }
  }, [autoLearning, evaluateAutomationRules]);

  // Handle model performance monitoring
  const handleMonitorModel = async () => {
    try {
      await monitorModelPerformance(
        selectedModel,
        'Performance Forecast Model'
      );
    } catch (error) {
      console.error('Failed to monitor model:', error);
    }
  };

  // Handle parameter tuning
  const handleTuneParameters = async () => {
    try {
      await tuneParameters(selectedModel);
    } catch (error) {
      console.error('Failed to tune parameters:', error);
    }
  };

  // Handle create A/B test
  const handleCreateABTest = async () => {
    if (!newABTest.testName || !newABTest.description) return;

    try {
      await createABTest(newABTest);
      setNewABTest({
        testName: '',
        description: '',
        variants: [{ name: 'Control', weight: 0.5, config: {} }],
        successMetric: 'accuracy',
        minimumSampleSize: 100,
      });
      setShowCreateABTest(false);
    } catch (error) {
      console.error('Failed to create A/B test:', error);
    }
  };

  // Handle create automation rule
  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.description) return;

    try {
      await createAutomationRule(newRule);
      setNewRule({
        name: '',
        description: '',
        conditions: [{ metric: 'recovery_score', operator: '<', value: 6 }],
        actions: [
          {
            type: 'send_notification',
            parameters: { message: 'Recovery score is low' },
          },
        ],
        enabled: true,
        priority: 1,
      });
      setShowCreateRule(false);
    } catch (error) {
      console.error('Failed to create automation rule:', error);
    }
  };

  // Get performance color
  const getPerformanceColor = (value: number) => {
    if (value >= 0.9) return 'text-green-600';
    if (value >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get performance badge
  const getPerformanceBadge = (value: number) => {
    if (value >= 0.9) return 'bg-green-100 text-green-800';
    if (value >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Get health color
  const getHealthColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get health badge
  const getHealthBadge = (value: number) => {
    if (value >= 90) return 'bg-green-100 text-green-800';
    if (value >= 70) return 'bg-yellow-100 text-yellow-800';
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
              Autonomous System Management
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setAutoLearning(!autoLearning)}
              >
                {autoLearning ? (
                  <Pause className='h-4 w-4 mr-2' />
                ) : (
                  <Play className='h-4 w-4 mr-2' />
                )}
                {autoLearning ? 'Stop Auto-Learning' : 'Start Auto-Learning'}
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleMonitorModel}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
                />
                Monitor Models
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='text-sm font-medium mb-2 block'>Model</label>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                className='w-full p-2 border rounded'
              >
                <option value='performance-forecast'>
                  Performance Forecast
                </option>
                <option value='risk-assessment'>Risk Assessment</option>
                <option value='optimization'>Optimization</option>
                <option value='recommendation'>Recommendation</option>
              </select>
            </div>
            <div className='flex items-end'>
              <Button
                onClick={handleTuneParameters}
                disabled={isLoading}
                className='w-full'
              >
                <Settings className='h-4 w-4 mr-2' />
                Tune Parameters
              </Button>
            </div>
            <div className='flex items-end'>
              <Button onClick={destroy} variant='outline' className='w-full'>
                <RotateCcw className='h-4 w-4 mr-2' />
                Reset System
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

      {/* System Health Overview */}
      {systemHealth && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-medium'>Overall Health</span>
                <Badge className={getHealthBadge(systemHealth.overallHealth)}>
                  {systemHealth.overallHealth.toFixed(1)}%
                </Badge>
              </div>

              <Progress value={systemHealth.overallHealth} className='h-3' />

              <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                <div className='text-center'>
                  <Database className='h-6 w-6 mx-auto mb-2 text-blue-600' />
                  <div className='text-sm font-medium'>Database</div>
                  <div
                    className={`text-sm ${getHealthColor(systemHealth.components.database)}`}
                  >
                    {systemHealth.components.database.toFixed(1)}%
                  </div>
                </div>
                <div className='text-center'>
                  <Network className='h-6 w-6 mx-auto mb-2 text-green-600' />
                  <div className='text-sm font-medium'>API</div>
                  <div
                    className={`text-sm ${getHealthColor(systemHealth.components.api)}`}
                  >
                    {systemHealth.components.api.toFixed(1)}%
                  </div>
                </div>
                <div className='text-center'>
                  <Cpu className='h-6 w-6 mx-auto mb-2 text-purple-600' />
                  <div className='text-sm font-medium'>Cache</div>
                  <div
                    className={`text-sm ${getHealthColor(systemHealth.components.cache)}`}
                  >
                    {systemHealth.components.cache.toFixed(1)}%
                  </div>
                </div>
                <div className='text-center'>
                  <BarChart3 className='h-6 w-6 mx-auto mb-2 text-orange-600' />
                  <div className='text-sm font-medium'>Analytics</div>
                  <div
                    className={`text-sm ${getHealthColor(systemHealth.components.analytics)}`}
                  >
                    {systemHealth.components.analytics.toFixed(1)}%
                  </div>
                </div>
                <div className='text-center'>
                  <Lightbulb className='h-6 w-6 mx-auto mb-2 text-yellow-600' />
                  <div className='text-sm font-medium'>Recommendations</div>
                  <div
                    className={`text-sm ${getHealthColor(systemHealth.components.recommendations)}`}
                  >
                    {systemHealth.components.recommendations.toFixed(1)}%
                  </div>
                </div>
              </div>

              {systemHealth.issues.length > 0 && (
                <div className='space-y-2'>
                  <h4 className='font-medium text-red-600'>Issues Detected:</h4>
                  {systemHealth.issues.map((issue, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 text-sm'
                    >
                      <AlertTriangle className='h-4 w-4 text-red-600' />
                      <span className='font-medium'>{issue.component}:</span>
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Model Performance ({modelMetrics.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {modelMetrics.map((metric, index) => (
              <div key={index} className='p-4 border rounded-lg'>
                <div className='flex items-center justify-between mb-3'>
                  <div>
                    <h4 className='font-medium'>{metric.modelName}</h4>
                    <p className='text-sm text-muted-foreground'>
                      Last updated: {metric.lastUpdated.toLocaleString()}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <Badge className={getPerformanceBadge(metric.accuracy)}>
                      {metric.accuracy.toFixed(3)} accuracy
                    </Badge>
                    <Badge variant='outline'>{metric.performanceTrend}</Badge>
                  </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm font-medium'>Precision</span>
                      <span
                        className={`text-sm ${getPerformanceColor(metric.precision)}`}
                      >
                        {metric.precision.toFixed(3)}
                      </span>
                    </div>
                    <Progress value={metric.precision * 100} className='h-2' />
                  </div>
                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm font-medium'>Recall</span>
                      <span
                        className={`text-sm ${getPerformanceColor(metric.recall)}`}
                      >
                        {metric.recall.toFixed(3)}
                      </span>
                    </div>
                    <Progress value={metric.recall * 100} className='h-2' />
                  </div>
                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm font-medium'>F1 Score</span>
                      <span
                        className={`text-sm ${getPerformanceColor(metric.f1Score)}`}
                      >
                        {metric.f1Score.toFixed(3)}
                      </span>
                    </div>
                    <Progress value={metric.f1Score * 100} className='h-2' />
                  </div>
                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-sm font-medium'>Confidence</span>
                      <span
                        className={`text-sm ${getPerformanceColor(metric.confidence)}`}
                      >
                        {metric.confidence.toFixed(3)}
                      </span>
                    </div>
                    <Progress value={metric.confidence * 100} className='h-2' />
                  </div>
                </div>

                <div className='mt-3 text-xs text-muted-foreground'>
                  Training data: {metric.trainingDataSize} samples | Validation
                  data: {metric.validationDataSize} samples
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* A/B Testing */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <TestTube className='h-5 w-5' />
                A/B Tests ({abTests.length})
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowCreateABTest(true)}
              >
                <Plus className='h-4 w-4 mr-2' />
                Create Test
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {abTests.map(test => (
                <div key={test.testId} className='p-3 border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium'>{test.testName}</h4>
                    <Badge variant='outline'>{test.status}</Badge>
                  </div>
                  <p className='text-sm text-muted-foreground mb-2'>
                    {test.description}
                  </p>
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>
                      Sample: {test.currentSampleSize}/{test.minimumSampleSize}
                    </span>
                    <span>Metric: {test.successMetric}</span>
                  </div>
                  <div className='mt-2'>
                    <Progress
                      value={
                        (test.currentSampleSize / test.minimumSampleSize) * 100
                      }
                      className='h-2'
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Test Results ({abTestResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {abTestResults.map(result => (
                <div key={result.testId} className='p-3 border rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium'>Test {result.testId}</h4>
                    <Badge className='bg-green-100 text-green-800'>
                      Winner: {result.winningVariant}
                    </Badge>
                  </div>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div>Improvement: +{result.improvement.toFixed(1)}%</div>
                    <div>Confidence: {result.confidence.toFixed(1)}%</div>
                    <div>
                      Significance: {result.statisticalSignificance.toFixed(1)}%
                    </div>
                    <div>
                      Completed: {result.completedDate.toLocaleDateString()}
                    </div>
                  </div>
                  <p className='text-xs text-muted-foreground mt-2'>
                    {result.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Brain className='h-5 w-5' />
            Learning Patterns ({learningPatterns.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {learningPatterns.map((pattern, index) => (
              <div key={index} className='p-3 border rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>{pattern.patternType} Pattern</h4>
                  <div className='flex gap-2'>
                    <Badge variant='outline'>{pattern.trend}</Badge>
                    <Badge variant='outline'>{pattern.impact}</Badge>
                  </div>
                </div>
                <p className='text-sm text-muted-foreground mb-2'>
                  Confidence: {(pattern.confidence * 100).toFixed(1)}% | Last
                  observed: {pattern.lastObserved.toLocaleDateString()}
                </p>
                <div className='text-xs text-muted-foreground'>
                  {JSON.stringify(pattern.pattern, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Zap className='h-5 w-5' />
              Automation Rules ({automationRules.length})
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowCreateRule(true)}
            >
              <Plus className='h-4 w-4 mr-2' />
              Create Rule
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {automationRules.map(rule => (
              <div key={rule.id} className='p-3 border rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>{rule.name}</h4>
                  <div className='flex gap-2'>
                    <Badge variant={rule.enabled ? 'default' : 'outline'}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Badge variant='outline'>Priority: {rule.priority}</Badge>
                  </div>
                </div>
                <p className='text-sm text-muted-foreground mb-2'>
                  {rule.description}
                </p>
                <div className='text-xs text-muted-foreground'>
                  Success rate: {(rule.successRate * 100).toFixed(1)}% | Last
                  triggered:{' '}
                  {rule.lastTriggered
                    ? rule.lastTriggered.toLocaleString()
                    : 'Never'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create A/B Test Modal */}
      {showCreateABTest && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-full max-w-md'>
            <h3 className='text-lg font-medium mb-4'>Create A/B Test</h3>
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Test Name
                </label>
                <input
                  type='text'
                  value={newABTest.testName}
                  onChange={e =>
                    setNewABTest(prev => ({
                      ...prev,
                      testName: e.target.value,
                    }))
                  }
                  className='w-full p-2 border rounded'
                  placeholder='Enter test name'
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Description
                </label>
                <textarea
                  value={newABTest.description}
                  onChange={e =>
                    setNewABTest(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className='w-full p-2 border rounded'
                  placeholder='Enter test description'
                  rows={3}
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Success Metric
                </label>
                <select
                  value={newABTest.successMetric}
                  onChange={e =>
                    setNewABTest(prev => ({
                      ...prev,
                      successMetric: e.target.value,
                    }))
                  }
                  className='w-full p-2 border rounded'
                >
                  <option value='accuracy'>Accuracy</option>
                  <option value='engagement'>Engagement</option>
                  <option value='conversion'>Conversion</option>
                  <option value='retention'>Retention</option>
                </select>
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Minimum Sample Size
                </label>
                <input
                  type='number'
                  value={newABTest.minimumSampleSize}
                  onChange={e =>
                    setNewABTest(prev => ({
                      ...prev,
                      minimumSampleSize: parseInt(e.target.value),
                    }))
                  }
                  className='w-full p-2 border rounded'
                  min='10'
                />
              </div>
            </div>
            <div className='flex gap-2 mt-6'>
              <Button onClick={handleCreateABTest} className='flex-1'>
                Create Test
              </Button>
              <Button
                variant='outline'
                onClick={() => setShowCreateABTest(false)}
                className='flex-1'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Automation Rule Modal */}
      {showCreateRule && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-full max-w-md'>
            <h3 className='text-lg font-medium mb-4'>Create Automation Rule</h3>
            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Rule Name
                </label>
                <input
                  type='text'
                  value={newRule.name}
                  onChange={e =>
                    setNewRule(prev => ({ ...prev, name: e.target.value }))
                  }
                  className='w-full p-2 border rounded'
                  placeholder='Enter rule name'
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Description
                </label>
                <textarea
                  value={newRule.description}
                  onChange={e =>
                    setNewRule(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className='w-full p-2 border rounded'
                  placeholder='Enter rule description'
                  rows={3}
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-2 block'>
                  Priority
                </label>
                <select
                  value={newRule.priority}
                  onChange={e =>
                    setNewRule(prev => ({
                      ...prev,
                      priority: parseInt(e.target.value),
                    }))
                  }
                  className='w-full p-2 border rounded'
                >
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Low</option>
                </select>
              </div>
            </div>
            <div className='flex gap-2 mt-6'>
              <Button onClick={handleCreateRule} className='flex-1'>
                Create Rule
              </Button>
              <Button
                variant='outline'
                onClick={() => setShowCreateRule(false)}
                className='flex-1'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className='flex items-center justify-center py-8'>
          <RefreshCw className='h-6 w-6 animate-spin mr-2' />
          <span>Processing autonomous system operations...</span>
        </div>
      )}
    </div>
  );
}
