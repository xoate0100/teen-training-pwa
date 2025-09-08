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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  TestTube,
  BarChart3,
  Users,
  Target,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  trafficAllocation: number; // percentage
  variants: TestVariant[];
  metrics: TestMetric[];
  results?: TestResults;
  hypothesis: string;
  successCriteria: string;
}

interface TestVariant {
  id: string;
  name: string;
  description: string;
  isControl: boolean;
  configuration: Record<string, any>;
  users: number;
  conversionRate: number;
  confidence: number;
}

interface TestMetric {
  id: string;
  name: string;
  type: 'conversion' | 'engagement' | 'performance' | 'satisfaction';
  description: string;
  targetValue: number;
  currentValue: number;
  improvement: number;
}

interface TestResults {
  winner: string;
  confidence: number;
  lift: number;
  statisticalSignificance: number;
  recommendation: 'implement' | 'continue' | 'stop';
  notes: string;
}

interface ABTestingProps {
  className?: string;
}

export function ABTesting({ className }: ABTestingProps) {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isAutoOptimize, setIsAutoOptimize] = useState(false);

  // Mock A/B tests
  const mockTests: ABTest[] = [
    {
      id: 'nav-layout-test',
      name: 'Navigation Layout Test',
      description: 'Test different navigation layouts for mobile users',
      status: 'running',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      trafficAllocation: 50,
      hypothesis: 'Bottom navigation will improve mobile usability by 15%',
      successCriteria: 'Increase mobile completion rate by 15%',
      variants: [
        {
          id: 'control',
          name: 'Current Layout',
          description: 'Side navigation with hamburger menu',
          isControl: true,
          configuration: { layout: 'sidebar', menu: 'hamburger' },
          users: 1250,
          conversionRate: 0.72,
          confidence: 0.95,
        },
        {
          id: 'variant-a',
          name: 'Bottom Navigation',
          description: 'Bottom tab navigation for mobile',
          isControl: false,
          configuration: { layout: 'bottom', menu: 'tabs' },
          users: 1180,
          conversionRate: 0.78,
          confidence: 0.92,
        },
      ],
      metrics: [
        {
          id: 'completion-rate',
          name: 'Completion Rate',
          type: 'conversion',
          description: 'Percentage of users completing primary actions',
          targetValue: 0.75,
          currentValue: 0.78,
          improvement: 8.3,
        },
        {
          id: 'time-to-action',
          name: 'Time to Action',
          type: 'performance',
          description: 'Average time to complete primary actions',
          targetValue: 30,
          currentValue: 25,
          improvement: 16.7,
        },
      ],
      results: {
        winner: 'variant-a',
        confidence: 0.92,
        lift: 8.3,
        statisticalSignificance: 0.95,
        recommendation: 'implement',
        notes: 'Bottom navigation shows significant improvement in mobile usability',
      },
    },
    {
      id: 'cta-button-test',
      name: 'Call-to-Action Button Test',
      description: 'Test different CTA button designs and placements',
      status: 'completed',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      trafficAllocation: 30,
      hypothesis: 'Larger, more prominent CTA buttons will increase clicks by 20%',
      successCriteria: 'Increase CTA click rate by 20%',
      variants: [
        {
          id: 'control',
          name: 'Standard Button',
          description: 'Current standard button design',
          isControl: true,
          configuration: { size: 'medium', color: 'primary', position: 'center' },
          users: 800,
          conversionRate: 0.15,
          confidence: 0.98,
        },
        {
          id: 'variant-a',
          name: 'Large Prominent Button',
          description: 'Larger button with gradient background',
          isControl: false,
          configuration: { size: 'large', color: 'gradient', position: 'center' },
          users: 750,
          conversionRate: 0.18,
          confidence: 0.95,
        },
        {
          id: 'variant-b',
          name: 'Floating Action Button',
          description: 'Floating button in bottom right',
          isControl: false,
          configuration: { size: 'large', color: 'primary', position: 'floating' },
          users: 720,
          conversionRate: 0.16,
          confidence: 0.90,
        },
      ],
      metrics: [
        {
          id: 'click-rate',
          name: 'Click Rate',
          type: 'conversion',
          description: 'Percentage of users clicking the CTA',
          targetValue: 0.18,
          currentValue: 0.18,
          improvement: 20.0,
        },
        {
          id: 'engagement',
          name: 'Engagement',
          type: 'engagement',
          description: 'Time spent on page after seeing CTA',
          targetValue: 45,
          currentValue: 52,
          improvement: 15.6,
        },
      ],
      results: {
        winner: 'variant-a',
        confidence: 0.95,
        lift: 20.0,
        statisticalSignificance: 0.98,
        recommendation: 'implement',
        notes: 'Large prominent button achieved target improvement of 20%',
      },
    },
    {
      id: 'settings-organization-test',
      name: 'Settings Organization Test',
      description: 'Test different ways to organize settings categories',
      status: 'draft',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      trafficAllocation: 25,
      hypothesis: 'Categorized settings will improve discovery by 25%',
      successCriteria: 'Increase settings usage by 25%',
      variants: [
        {
          id: 'control',
          name: 'Current Organization',
          description: 'Flat list of all settings',
          isControl: true,
          configuration: { organization: 'flat', search: 'basic' },
          users: 0,
          conversionRate: 0,
          confidence: 0,
        },
        {
          id: 'variant-a',
          name: 'Categorized Settings',
          description: 'Settings grouped by category with search',
          isControl: false,
          configuration: { organization: 'categorized', search: 'advanced' },
          users: 0,
          conversionRate: 0,
          confidence: 0,
        },
      ],
      metrics: [
        {
          id: 'settings-discovery',
          name: 'Settings Discovery',
          type: 'engagement',
          description: 'Percentage of users finding and using settings',
          targetValue: 0.70,
          currentValue: 0,
          improvement: 0,
        },
        {
          id: 'time-to-find',
          name: 'Time to Find Setting',
          type: 'performance',
          description: 'Average time to find a specific setting',
          targetValue: 30,
          currentValue: 0,
          improvement: 0,
        },
      ],
    },
  ];

  // Load tests
  useEffect(() => {
    setTests(mockTests);
  }, []);

  // Auto-optimize based on test results
  useEffect(() => {
    if (isAutoOptimize) {
      const interval = setInterval(() => {
        setTests(prev => prev.map(test => {
          if (test.status === 'running' && test.results?.recommendation === 'implement') {
            return { ...test, status: 'completed' as const };
          }
          return test;
        }));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isAutoOptimize]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className='h-4 w-4 text-green-600' />;
      case 'completed': return <CheckCircle className='h-4 w-4 text-blue-600' />;
      case 'paused': return <Pause className='h-4 w-4 text-yellow-600' />;
      case 'draft': return <Settings className='h-4 w-4 text-gray-600' />;
      case 'cancelled': return <XCircle className='h-4 w-4 text-red-600' />;
      default: return <AlertTriangle className='h-4 w-4 text-gray-600' />;
    }
  };

  // Get recommendation color
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'implement': return 'bg-green-100 text-green-800';
      case 'continue': return 'bg-yellow-100 text-yellow-800';
      case 'stop': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Start test
  const startTest = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' as const } : test
    ));
  };

  // Pause test
  const pauseTest = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'paused' as const } : test
    ));
  };

  // Stop test
  const stopTest = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'completed' as const } : test
    ));
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <TestTube className='h-5 w-5' />
              A/B Testing Framework
            </CardTitle>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <Switch
                  checked={isAutoOptimize}
                  onCheckedChange={setIsAutoOptimize}
                />
                <span className='text-sm'>Auto-optimize</span>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <TestTube className='h-4 w-4 mr-2' />
                    Create Test
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New A/B Test</DialogTitle>
                    <DialogDescription>
                      Set up a new A/B test to optimize user experience
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4'>
                    <p className='text-sm text-muted-foreground'>
                      A/B test creation form would go here with fields for:
                    </p>
                    <ul className='text-sm text-muted-foreground space-y-1'>
                      <li>• Test name and description</li>
                      <li>• Hypothesis and success criteria</li>
                      <li>• Variant configurations</li>
                      <li>• Traffic allocation</li>
                      <li>• Target metrics</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Run controlled experiments to optimize user experience and conversion rates
          </p>
        </CardContent>
      </Card>

      {/* Active Tests */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Active Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {tests.filter(test => test.status === 'running').map(test => (
              <div key={test.id} className='p-4 border rounded-lg space-y-4'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-medium'>{test.name}</h3>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>{test.description}</p>
                    <p className='text-xs text-muted-foreground'>
                      <strong>Hypothesis:</strong> {test.hypothesis}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='outline' size='sm' onClick={() => pauseTest(test.id)}>
                      <Pause className='h-3 w-3 mr-1' />
                      Pause
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => stopTest(test.id)}>
                      <XCircle className='h-3 w-3 mr-1' />
                      Stop
                    </Button>
                  </div>
                </div>

                {/* Variants */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {test.variants.map(variant => (
                    <div key={variant.id} className='p-3 border rounded-lg space-y-2'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-medium'>{variant.name}</h4>
                        {variant.isControl && (
                          <Badge variant='outline'>Control</Badge>
                        )}
                      </div>
                      <p className='text-sm text-muted-foreground'>{variant.description}</p>
                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <div className='text-muted-foreground'>Users</div>
                          <div className='font-medium'>{variant.users.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className='text-muted-foreground'>Conversion</div>
                          <div className='font-medium'>{Math.round(variant.conversionRate * 100)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className='space-y-2'>
                  <h4 className='font-medium'>Key Metrics</h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {test.metrics.map(metric => (
                      <div key={metric.id} className='p-3 bg-muted/50 rounded-lg'>
                        <div className='flex items-center justify-between'>
                          <h5 className='font-medium text-sm'>{metric.name}</h5>
                          <span className='text-sm text-muted-foreground'>
                            {metric.currentValue} {metric.type === 'conversion' ? '%' : 's'}
                          </span>
                        </div>
                        <div className='mt-1'>
                          <div className='flex items-center justify-between text-xs text-muted-foreground'>
                            <span>Target: {metric.targetValue}</span>
                            <span>+{metric.improvement}%</span>
                          </div>
                          <Progress 
                            value={(metric.currentValue / metric.targetValue) * 100} 
                            className='h-2 mt-1'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Tests */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CheckCircle className='h-5 w-5' />
            Completed Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {tests.filter(test => test.status === 'completed').map(test => (
              <div key={test.id} className='p-4 border rounded-lg space-y-4'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-medium'>{test.name}</h3>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>{test.description}</p>
                  </div>
                  {test.results && (
                    <Badge className={getRecommendationColor(test.results.recommendation)}>
                      {test.results.recommendation}
                    </Badge>
                  )}
                </div>

                {test.results && (
                  <div className='space-y-3'>
                    <div className='p-3 bg-muted/50 rounded-lg'>
                      <h4 className='font-medium mb-2'>Results Summary</h4>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                        <div>
                          <div className='text-muted-foreground'>Winner</div>
                          <div className='font-medium'>{test.results.winner}</div>
                        </div>
                        <div>
                          <div className='text-muted-foreground'>Lift</div>
                          <div className='font-medium text-green-600'>+{test.results.lift}%</div>
                        </div>
                        <div>
                          <div className='text-muted-foreground'>Confidence</div>
                          <div className='font-medium'>{Math.round(test.results.confidence * 100)}%</div>
                        </div>
                        <div>
                          <div className='text-muted-foreground'>Significance</div>
                          <div className='font-medium'>{Math.round(test.results.statisticalSignificance * 100)}%</div>
                        </div>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>{test.results.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Draft Tests */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Draft Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {tests.filter(test => test.status === 'draft').map(test => (
              <div key={test.id} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-medium'>{test.name}</h3>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>{test.description}</p>
                    <p className='text-xs text-muted-foreground'>
                      <strong>Hypothesis:</strong> {test.hypothesis}
                    </p>
                  </div>
                  <Button size='sm' onClick={() => startTest(test.id)}>
                    <Play className='h-3 w-3 mr-1' />
                    Start Test
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
