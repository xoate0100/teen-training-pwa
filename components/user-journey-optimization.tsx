'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  Target,
  Clock,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Activity,
  Calendar,
  Bell,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserJourney {
  id: string;
  name: string;
  description: string;
  steps: JourneyStep[];
  frequency: number; // times per week
  averageDuration: number; // in minutes
  completionRate: number; // 0-1
  painPoints: string[];
  optimizations: Optimization[];
}

interface JourneyStep {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  successRate: number; // 0-1
  commonIssues: string[];
}

interface Optimization {
  id: string;
  type: 'workflow' | 'ui' | 'feature' | 'performance';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  priority: number; // 1-10
  status: 'suggested' | 'implemented' | 'testing' | 'completed';
  metrics: {
    before: number;
    after: number;
    improvement: number; // percentage
  };
}

interface UserJourneyOptimizationProps {
  userId: string;
  className?: string;
}

export function UserJourneyOptimization({ userId, className }: UserJourneyOptimizationProps) {
  const [journeys, setJourneys] = useState<UserJourney[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<UserJourney | null>(null);
  const [showOptimizations, setShowOptimizations] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(false);

  // Mock data for user journeys
  const mockJourneys: UserJourney[] = [
    {
      id: 'daily-checkin',
      name: 'Daily Check-in',
      description: 'Morning routine to set daily goals and check progress',
      frequency: 7,
      averageDuration: 3,
      completionRate: 0.85,
      painPoints: ['Forgetting to check in', 'Unclear goal setting', 'No motivation'],
      steps: [
        {
          id: 'open-app',
          name: 'Open App',
          description: 'Launch the Teen Training app',
          duration: 0.5,
          difficulty: 'easy',
          successRate: 0.95,
          commonIssues: ['App loading slowly', 'Forgot to open app'],
        },
        {
          id: 'set-goals',
          name: 'Set Daily Goals',
          description: 'Choose what to focus on today',
          duration: 1.5,
          difficulty: 'medium',
          successRate: 0.78,
          commonIssues: ['Too many options', 'Unclear goal descriptions'],
        },
        {
          id: 'check-progress',
          name: 'Check Progress',
          description: 'Review yesterday\'s achievements',
          duration: 1,
          difficulty: 'easy',
          successRate: 0.88,
          commonIssues: ['Progress not clear', 'Missing achievements'],
        },
      ],
      optimizations: [
        {
          id: 'quick-goals',
          type: 'workflow',
          title: 'Quick Goal Templates',
          description: 'Pre-defined goal templates for common activities',
          impact: 'high',
          effort: 'medium',
          priority: 8,
          status: 'suggested',
          metrics: { before: 1.5, after: 0.8, improvement: 47 },
        },
        {
          id: 'smart-reminders',
          type: 'feature',
          title: 'Smart Reminders',
          description: 'Contextual reminders based on usage patterns',
          impact: 'high',
          effort: 'high',
          priority: 9,
          status: 'implemented',
          metrics: { before: 0.85, after: 0.92, improvement: 8 },
        },
      ],
    },
    {
      id: 'workout-session',
      name: 'Workout Session',
      description: 'Complete a training session from start to finish',
      frequency: 4,
      averageDuration: 45,
      completionRate: 0.72,
      painPoints: ['Long setup time', 'Complex navigation', 'Equipment confusion'],
      steps: [
        {
          id: 'select-workout',
          name: 'Select Workout',
          description: 'Choose workout type and difficulty',
          duration: 2,
          difficulty: 'medium',
          successRate: 0.82,
          commonIssues: ['Too many options', 'Difficulty unclear'],
        },
        {
          id: 'setup-equipment',
          name: 'Setup Equipment',
          description: 'Prepare necessary equipment',
          duration: 5,
          difficulty: 'hard',
          successRate: 0.65,
          commonIssues: ['Missing equipment', 'Unclear setup instructions'],
        },
        {
          id: 'execute-exercises',
          name: 'Execute Exercises',
          description: 'Complete workout exercises',
          duration: 35,
          difficulty: 'hard',
          successRate: 0.88,
          commonIssues: ['Poor form guidance', 'Unclear instructions'],
        },
        {
          id: 'log-results',
          name: 'Log Results',
          description: 'Record workout completion and notes',
          duration: 3,
          difficulty: 'easy',
          successRate: 0.75,
          commonIssues: ['Too many fields', 'Unclear what to log'],
        },
      ],
      optimizations: [
        {
          id: 'equipment-check',
          type: 'workflow',
          title: 'Equipment Checklist',
          description: 'Pre-workout equipment verification',
          impact: 'medium',
          effort: 'low',
          priority: 6,
          status: 'completed',
          metrics: { before: 0.65, after: 0.78, improvement: 20 },
        },
        {
          id: 'form-guidance',
          type: 'feature',
          title: 'Real-time Form Guidance',
          description: 'AI-powered form correction during exercises',
          impact: 'high',
          effort: 'high',
          priority: 9,
          status: 'testing',
          metrics: { before: 0.88, after: 0.95, improvement: 8 },
        },
      ],
    },
    {
      id: 'progress-review',
      name: 'Progress Review',
      description: 'Weekly review of achievements and goal adjustment',
      frequency: 1,
      averageDuration: 15,
      completionRate: 0.58,
      painPoints: ['Complex charts', 'Unclear insights', 'No action items'],
      steps: [
        {
          id: 'view-charts',
          name: 'View Progress Charts',
          description: 'Review weekly progress visualizations',
          duration: 5,
          difficulty: 'medium',
          successRate: 0.72,
          commonIssues: ['Charts too complex', 'Unclear metrics'],
        },
        {
          id: 'analyze-trends',
          name: 'Analyze Trends',
          description: 'Understand performance patterns',
          duration: 7,
          difficulty: 'hard',
          successRate: 0.45,
          commonIssues: ['No clear insights', 'Confusing data'],
        },
        {
          id: 'adjust-goals',
          name: 'Adjust Goals',
          description: 'Modify goals based on progress',
          duration: 3,
          difficulty: 'medium',
          successRate: 0.68,
          commonIssues: ['Unclear recommendations', 'Too many options'],
        },
      ],
      optimizations: [
        {
          id: 'simplified-charts',
          type: 'ui',
          title: 'Simplified Progress Charts',
          description: 'Cleaner, more intuitive progress visualizations',
          impact: 'high',
          effort: 'medium',
          priority: 8,
          status: 'suggested',
          metrics: { before: 0.72, after: 0.85, improvement: 18 },
        },
        {
          id: 'smart-insights',
          type: 'feature',
          title: 'Smart Insights',
          description: 'AI-generated insights and recommendations',
          impact: 'high',
          effort: 'high',
          priority: 9,
          status: 'suggested',
          metrics: { before: 0.45, after: 0.75, improvement: 67 },
        },
      ],
    },
  ];

  // Load user journeys
  useEffect(() => {
    setJourneys(mockJourneys);
    if (mockJourneys.length > 0) {
      setSelectedJourney(mockJourneys[0]);
    }
  }, []);

  // Auto-optimize based on user behavior
  useEffect(() => {
    if (autoOptimize) {
      // Simulate auto-optimization
      const interval = setInterval(() => {
        setJourneys(prev => prev.map(journey => ({
          ...journey,
          optimizations: journey.optimizations.map(opt => 
            opt.status === 'suggested' && Math.random() > 0.7
              ? { ...opt, status: 'implemented' as const }
              : opt
          ),
        })));
      }, 10000); // Every 10 seconds

      return () => clearInterval(interval);
    }
  }, [autoOptimize]);

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get effort color
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'implemented': return 'bg-blue-100 text-blue-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'suggested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workflow': return <ArrowRight className='h-4 w-4' />;
      case 'ui': return <BarChart3 className='h-4 w-4' />;
      case 'feature': return <Zap className='h-4 w-4' />;
      case 'performance': return <Activity className='h-4 w-4' />;
      default: return <Settings className='h-4 w-4' />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='h-5 w-5' />
              User Journey Optimization
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Switch
                checked={autoOptimize}
                onCheckedChange={setAutoOptimize}
              />
              <span className='text-sm'>Auto-optimize</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Analyze and optimize user journeys to improve experience and completion rates
          </p>
        </CardContent>
      </Card>

      {/* Journey Selection */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Select Journey to Analyze</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {journeys.map(journey => (
              <Card
                key={journey.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  selectedJourney?.id === journey.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                )}
                onClick={() => setSelectedJourney(journey)}
              >
                <CardContent className='p-4'>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <h3 className='font-medium'>{journey.name}</h3>
                      <Badge variant='outline'>
                        {journey.frequency}/week
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {journey.description}
                    </p>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span>Completion Rate</span>
                        <span className='font-medium'>
                          {Math.round(journey.completionRate * 100)}%
                        </span>
                      </div>
                      <Progress value={journey.completionRate * 100} className='h-2' />
                      <div className='flex items-center justify-between text-sm text-muted-foreground'>
                        <span>{journey.averageDuration} min avg</span>
                        <span>{journey.steps.length} steps</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Journey Details */}
      {selectedJourney && (
        <div className='space-y-6'>
          {/* Journey Overview */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Target className='h-5 w-5' />
                {selectedJourney.name} - Journey Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Pain Points */}
              <div>
                <h4 className='font-medium mb-2 flex items-center gap-2'>
                  <AlertCircle className='h-4 w-4 text-red-500' />
                  Pain Points
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {selectedJourney.painPoints.map((point, index) => (
                    <Badge key={index} variant='destructive' className='text-xs'>
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Journey Steps */}
              <div>
                <h4 className='font-medium mb-3'>Journey Steps</h4>
                <div className='space-y-3'>
                  {selectedJourney.steps.map((step, index) => (
                    <div key={step.id} className='flex items-center gap-4 p-3 border rounded-lg'>
                      <div className='flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>
                        {index + 1}
                      </div>
                      <div className='flex-1 space-y-1'>
                        <div className='flex items-center gap-2'>
                          <h5 className='font-medium'>{step.name}</h5>
                          <Badge className={getDifficultyColor(step.difficulty)}>
                            {step.difficulty}
                          </Badge>
                        </div>
                        <p className='text-sm text-muted-foreground'>{step.description}</p>
                        <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                          <span>{step.duration} min</span>
                          <span>{Math.round(step.successRate * 100)}% success</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimizations */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center gap-2'>
                  <Lightbulb className='h-5 w-5' />
                  Optimizations
                </CardTitle>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowOptimizations(!showOptimizations)}
                >
                  {showOptimizations ? 'Hide' : 'Show'} Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {selectedJourney.optimizations.map(optimization => (
                  <div key={optimization.id} className='p-4 border rounded-lg space-y-3'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-2'>
                        {getTypeIcon(optimization.type)}
                        <h4 className='font-medium'>{optimization.title}</h4>
                        <Badge className={getStatusColor(optimization.status)}>
                          {optimization.status}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge className={getImpactColor(optimization.impact)}>
                          {optimization.impact} impact
                        </Badge>
                        <Badge className={getEffortColor(optimization.effort)}>
                          {optimization.effort} effort
                        </Badge>
                      </div>
                    </div>

                    <p className='text-sm text-muted-foreground'>
                      {optimization.description}
                    </p>

                    {showOptimizations && (
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                          <span>Priority Score</span>
                          <span className='font-medium'>{optimization.priority}/10</span>
                        </div>
                        <Progress value={optimization.priority * 10} className='h-2' />

                        <div className='grid grid-cols-3 gap-4 text-sm'>
                          <div className='text-center'>
                            <div className='font-medium text-green-600'>
                              {optimization.metrics.improvement}%
                            </div>
                            <div className='text-muted-foreground'>Improvement</div>
                          </div>
                          <div className='text-center'>
                            <div className='font-medium'>
                              {optimization.metrics.before} → {optimization.metrics.after}
                            </div>
                            <div className='text-muted-foreground'>Success Rate</div>
                          </div>
                          <div className='text-center'>
                            <div className='font-medium'>
                              {optimization.type}
                            </div>
                            <div className='text-muted-foreground'>Type</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
