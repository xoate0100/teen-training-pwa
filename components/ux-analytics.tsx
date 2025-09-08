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
  BarChart3,
  TrendingUp,
  Users,
  MousePointer,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Activity,
  Zap,
  Eye,
  MouseClick,
  Navigation,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsEvent {
  id: string;
  type: 'navigation' | 'interaction' | 'completion' | 'error' | 'performance';
  name: string;
  timestamp: number;
  userId: string;
  sessionId: string;
  properties: Record<string, any>;
  value?: number;
  duration?: number;
}

interface AnalyticsMetric {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number; // percentage change
  target: number;
  status: 'good' | 'warning' | 'critical';
  category: 'navigation' | 'engagement' | 'performance' | 'conversion';
}

interface UserFlow {
  id: string;
  name: string;
  steps: FlowStep[];
  completionRate: number;
  averageTime: number;
  dropOffPoints: DropOffPoint[];
  totalUsers: number;
  completedUsers: number;
}

interface FlowStep {
  id: string;
  name: string;
  page: string;
  action: string;
  users: number;
  completionRate: number;
  averageTime: number;
  nextSteps: { stepId: string; users: number; percentage: number }[];
}

interface DropOffPoint {
  stepId: string;
  stepName: string;
  dropOffRate: number;
  usersLost: number;
  commonReasons: string[];
}

interface UXAnalyticsProps {
  userId: string;
  className?: string;
}

export function UXAnalytics({ userId, className }: UXAnalyticsProps) {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [userFlows, setUserFlows] = useState<UserFlow[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isTracking, setIsTracking] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock analytics data
  const mockMetrics: AnalyticsMetric[] = [
    {
      id: 'nav-efficiency',
      name: 'Navigation Efficiency',
      description: 'Time to complete primary actions',
      value: 28,
      unit: 'seconds',
      trend: 'down',
      change: -12,
      target: 30,
      status: 'good',
      category: 'navigation',
    },
    {
      id: 'primary-action-completion',
      name: 'Primary Action Completion',
      description: 'Rate of completing primary actions',
      value: 87,
      unit: '%',
      trend: 'up',
      change: 5,
      target: 85,
      status: 'good',
      category: 'conversion',
    },
    {
      id: 'settings-discovery',
      name: 'Settings Discovery',
      description: 'Users who find and use settings',
      value: 72,
      unit: '%',
      trend: 'up',
      change: 8,
      target: 70,
      status: 'good',
      category: 'engagement',
    },
    {
      id: 'mobile-usability',
      name: 'Mobile Usability',
      description: 'Mobile interaction success rate',
      value: 94,
      unit: '%',
      trend: 'stable',
      change: 0,
      target: 95,
      status: 'good',
      category: 'performance',
    },
    {
      id: 'session-duration',
      name: 'Average Session Duration',
      description: 'Time spent in app per session',
      value: 8.5,
      unit: 'minutes',
      trend: 'up',
      change: 15,
      target: 10,
      status: 'warning',
      category: 'engagement',
    },
    {
      id: 'error-rate',
      name: 'Error Rate',
      description: 'Percentage of sessions with errors',
      value: 3.2,
      unit: '%',
      trend: 'down',
      change: -25,
      target: 5,
      status: 'good',
      category: 'performance',
    },
  ];

  const mockUserFlows: UserFlow[] = [
    {
      id: 'daily-checkin',
      name: 'Daily Check-in Flow',
      completionRate: 0.85,
      averageTime: 180,
      totalUsers: 1200,
      completedUsers: 1020,
      steps: [
        {
          id: 'open-app',
          name: 'Open App',
          page: 'dashboard',
          action: 'app_launch',
          users: 1200,
          completionRate: 1.0,
          averageTime: 2,
          nextSteps: [
            { stepId: 'view-dashboard', users: 1200, percentage: 100 },
          ],
        },
        {
          id: 'view-dashboard',
          name: 'View Dashboard',
          page: 'dashboard',
          action: 'page_view',
          users: 1200,
          completionRate: 1.0,
          averageTime: 5,
          nextSteps: [
            { stepId: 'start-checkin', users: 1100, percentage: 92 },
            { stepId: 'view-progress', users: 100, percentage: 8 },
          ],
        },
        {
          id: 'start-checkin',
          name: 'Start Check-in',
          page: 'dashboard',
          action: 'click_checkin',
          users: 1100,
          completionRate: 0.92,
          averageTime: 3,
          nextSteps: [
            { stepId: 'complete-checkin', users: 1020, percentage: 93 },
          ],
        },
        {
          id: 'complete-checkin',
          name: 'Complete Check-in',
          page: 'checkin',
          action: 'submit_checkin',
          users: 1020,
          completionRate: 0.93,
          averageTime: 120,
          nextSteps: [],
        },
      ],
      dropOffPoints: [
        {
          stepId: 'start-checkin',
          stepName: 'Start Check-in',
          dropOffRate: 0.08,
          usersLost: 100,
          commonReasons: ['Button not visible', 'Unclear call-to-action', 'Technical issues'],
        },
        {
          stepId: 'complete-checkin',
          stepName: 'Complete Check-in',
          dropOffRate: 0.07,
          usersLost: 80,
          commonReasons: ['Form too long', 'Required fields unclear', 'Save button not working'],
        },
      ],
    },
    {
      id: 'workout-session',
      name: 'Workout Session Flow',
      completionRate: 0.72,
      averageTime: 2700,
      totalUsers: 800,
      completedUsers: 576,
      steps: [
        {
          id: 'select-workout',
          name: 'Select Workout',
          page: 'dashboard',
          action: 'click_start_session',
          users: 800,
          completionRate: 1.0,
          averageTime: 5,
          nextSteps: [
            { stepId: 'choose-type', users: 750, percentage: 94 },
          ],
        },
        {
          id: 'choose-type',
          name: 'Choose Workout Type',
          page: 'session',
          action: 'select_workout_type',
          users: 750,
          completionRate: 0.94,
          averageTime: 15,
          nextSteps: [
            { stepId: 'start-exercises', users: 650, percentage: 87 },
          ],
        },
        {
          id: 'start-exercises',
          name: 'Start Exercises',
          page: 'session',
          action: 'begin_workout',
          users: 650,
          completionRate: 0.87,
          averageTime: 10,
          nextSteps: [
            { stepId: 'complete-workout', users: 576, percentage: 89 },
          ],
        },
        {
          id: 'complete-workout',
          name: 'Complete Workout',
          page: 'session',
          action: 'finish_workout',
          users: 576,
          completionRate: 0.89,
          averageTime: 2400,
          nextSteps: [],
        },
      ],
      dropOffPoints: [
        {
          stepId: 'choose-type',
          stepName: 'Choose Workout Type',
          dropOffRate: 0.13,
          usersLost: 100,
          commonReasons: ['Too many options', 'Unclear descriptions', 'Difficulty selection'],
        },
        {
          stepId: 'start-exercises',
          stepName: 'Start Exercises',
          dropOffRate: 0.11,
          usersLost: 74,
          commonReasons: ['Equipment not ready', 'Complex instructions', 'Technical issues'],
        },
      ],
    },
  ];

  // Load analytics data
  useEffect(() => {
    setMetrics(mockMetrics);
    setUserFlows(mockUserFlows);
  }, []);

  // Simulate real-time event tracking
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        // Simulate new events
        const newEvent: AnalyticsEvent = {
          id: `event_${Date.now()}`,
          type: ['navigation', 'interaction', 'completion', 'error', 'performance'][Math.floor(Math.random() * 5)] as any,
          name: 'User Action',
          timestamp: Date.now(),
          userId,
          sessionId: `session_${Math.floor(Math.random() * 1000)}`,
          properties: { page: 'dashboard', action: 'click' },
        };
        
        setEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isTracking, userId]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className='h-4 w-4 text-green-600' />;
      case 'warning': return <AlertCircle className='h-4 w-4 text-yellow-600' />;
      case 'critical': return <AlertCircle className='h-4 w-4 text-red-600' />;
      default: return <Activity className='h-4 w-4 text-gray-600' />;
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className='h-3 w-3 text-green-500' />;
      case 'down': return <TrendingDown className='h-3 w-3 text-red-500' />;
      case 'stable': return <Minus className='h-3 w-3 text-gray-500' />;
      default: return null;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <Navigation className='h-4 w-4' />;
      case 'engagement': return <Users className='h-4 w-4' />;
      case 'performance': return <Zap className='h-4 w-4' />;
      case 'conversion': return <Target className='h-4 w-4' />;
      default: return <BarChart3 className='h-4 w-4' />;
    }
  };

  // Filter metrics by category
  const filteredMetrics = selectedCategory === 'all' 
    ? metrics 
    : metrics.filter(metric => metric.category === selectedCategory);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <BarChart3 className='h-5 w-5' />
              UX Analytics Dashboard
            </CardTitle>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <Switch
                  checked={isTracking}
                  onCheckedChange={setIsTracking}
                />
                <span className='text-sm'>Live Tracking</span>
              </div>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className='w-32'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1d'>1 Day</SelectItem>
                  <SelectItem value='7d'>7 Days</SelectItem>
                  <SelectItem value='30d'>30 Days</SelectItem>
                  <SelectItem value='90d'>90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Track user behavior, navigation patterns, and UX performance metrics
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Key Performance Indicators
            </CardTitle>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-48'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                <SelectItem value='navigation'>Navigation</SelectItem>
                <SelectItem value='engagement'>Engagement</SelectItem>
                <SelectItem value='performance'>Performance</SelectItem>
                <SelectItem value='conversion'>Conversion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredMetrics.map(metric => (
              <div key={metric.id} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    {getCategoryIcon(metric.category)}
                    <h4 className='font-medium text-sm'>{metric.name}</h4>
                  </div>
                  {getStatusIcon(metric.status)}
                </div>
                
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className={cn('text-2xl font-bold', getStatusColor(metric.status))}>
                      {metric.value}{metric.unit}
                    </span>
                    <div className='flex items-center gap-1'>
                      {getTrendIcon(metric.trend)}
                      <span className={cn('text-xs', 
                        metric.change > 0 ? 'text-green-600' : 
                        metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                      )}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className='space-y-1'>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>Target: {metric.target}{metric.unit}</span>
                      <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((metric.value / metric.target) * 100, 100)} 
                      className='h-2'
                    />
                  </div>
                  
                  <p className='text-xs text-muted-foreground'>{metric.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Flows */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            User Flow Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {userFlows.map(flow => (
              <div key={flow.id} className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium'>{flow.name}</h3>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span>{Math.round(flow.completionRate * 100)}% completion</span>
                    <span>{Math.round(flow.averageTime / 60)} min avg</span>
                    <span>{flow.completedUsers}/{flow.totalUsers} users</span>
                  </div>
                </div>

                {/* Flow Steps */}
                <div className='space-y-2'>
                  {flow.steps.map((step, index) => (
                    <div key={step.id} className='flex items-center gap-4 p-3 border rounded-lg'>
                      <div className='flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>
                        {index + 1}
                      </div>
                      <div className='flex-1 space-y-1'>
                        <div className='flex items-center justify-between'>
                          <h4 className='font-medium'>{step.name}</h4>
                          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                            <span>{step.users} users</span>
                            <span>{Math.round(step.completionRate * 100)}%</span>
                            <span>{step.averageTime}s</span>
                          </div>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {step.page} • {step.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Drop-off Points */}
                {flow.dropOffPoints.length > 0 && (
                  <div className='space-y-2'>
                    <h4 className='font-medium text-red-600'>Drop-off Points</h4>
                    {flow.dropOffPoints.map(dropOff => (
                      <div key={dropOff.stepId} className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                        <div className='flex items-center justify-between'>
                          <h5 className='font-medium text-red-900'>{dropOff.stepName}</h5>
                          <div className='text-sm text-red-700'>
                            {Math.round(dropOff.dropOffRate * 100)}% drop-off ({dropOff.usersLost} users)
                          </div>
                        </div>
                        <div className='mt-2'>
                          <p className='text-sm text-red-800 font-medium'>Common reasons:</p>
                          <ul className='text-sm text-red-700 mt-1'>
                            {dropOff.commonReasons.map((reason, index) => (
                              <li key={index} className='flex items-center gap-1'>
                                <span className='text-red-500'>•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Events */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            Live Events ({events.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {events.slice(0, 20).map(event => (
              <div key={event.id} className='flex items-center gap-3 p-2 border rounded text-sm'>
                <div className='flex-shrink-0'>
                  {getCategoryIcon(event.type)}
                </div>
                <div className='flex-1'>
                  <span className='font-medium'>{event.name}</span>
                  <span className='text-muted-foreground ml-2'>
                    {event.properties.page} • {event.properties.action}
                  </span>
                </div>
                <div className='text-xs text-muted-foreground'>
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Missing imports for trend icons
const TrendingDown = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const Minus = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
