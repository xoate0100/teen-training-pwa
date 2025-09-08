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
  Activity,
  Zap,
  Clock,
  Database,
  Wifi,
  Smartphone,
  Monitor,
  Cpu,
  HardDrive,
  MemoryStick,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface Optimization {
  id: string;
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  status: 'available' | 'applied' | 'testing';
  metrics: {
    before: number;
    after: number;
    improvement: number;
  };
  category: 'navigation' | 'rendering' | 'network' | 'memory' | 'storage';
}

interface PerformanceOptimizationProps {
  className?: string;
}

export function PerformanceOptimization({ className }: PerformanceOptimizationProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock performance metrics
  const mockMetrics: PerformanceMetric[] = [
    {
      id: 'navigation-load',
      name: 'Navigation Load Time',
      value: 180,
      unit: 'ms',
      target: 200,
      status: 'good',
      trend: 'down',
      description: 'Time to load navigation components',
    },
    {
      id: 'settings-load',
      name: 'Settings Page Load',
      value: 320,
      unit: 'ms',
      target: 300,
      status: 'warning',
      trend: 'up',
      description: 'Time to load settings page',
    },
    {
      id: 'mobile-interaction',
      name: 'Mobile Interaction Response',
      value: 85,
      unit: 'ms',
      target: 100,
      status: 'good',
      trend: 'stable',
      description: 'Response time for mobile interactions',
    },
    {
      id: 'asset-load',
      name: 'Visual Asset Load',
      value: 1200,
      unit: 'ms',
      target: 1000,
      status: 'critical',
      trend: 'up',
      description: 'Time to load all visual assets',
    },
    {
      id: 'memory-usage',
      name: 'Memory Usage',
      value: 45,
      unit: 'MB',
      target: 50,
      status: 'good',
      trend: 'stable',
      description: 'Current memory consumption',
    },
    {
      id: 'bundle-size',
      name: 'JavaScript Bundle Size',
      value: 850,
      unit: 'KB',
      target: 1000,
      status: 'good',
      trend: 'down',
      description: 'Compressed JavaScript bundle size',
    },
  ];

  // Mock optimizations
  const mockOptimizations: Optimization[] = [
    {
      id: 'lazy-loading',
      name: 'Lazy Loading for Navigation',
      description: 'Load navigation components only when needed',
      impact: 'high',
      effort: 'medium',
      status: 'available',
      metrics: { before: 180, after: 120, improvement: 33 },
      category: 'navigation',
    },
    {
      id: 'image-optimization',
      name: 'Image Optimization',
      description: 'Compress and optimize visual assets',
      impact: 'high',
      effort: 'low',
      status: 'applied',
      metrics: { before: 1200, after: 800, improvement: 33 },
      category: 'rendering',
    },
    {
      id: 'code-splitting',
      name: 'Code Splitting',
      description: 'Split JavaScript bundle into smaller chunks',
      impact: 'medium',
      effort: 'high',
      status: 'testing',
      metrics: { before: 850, after: 650, improvement: 24 },
      category: 'memory',
    },
    {
      id: 'caching',
      name: 'Aggressive Caching',
      description: 'Implement aggressive caching for static assets',
      impact: 'high',
      effort: 'medium',
      status: 'available',
      metrics: { before: 320, after: 200, improvement: 38 },
      category: 'network',
    },
    {
      id: 'preloading',
      name: 'Critical Resource Preloading',
      description: 'Preload critical resources for faster initial load',
      impact: 'medium',
      effort: 'low',
      status: 'available',
      metrics: { before: 180, after: 150, improvement: 17 },
      category: 'navigation',
    },
    {
      id: 'compression',
      name: 'Gzip Compression',
      description: 'Enable gzip compression for all text assets',
      impact: 'medium',
      effort: 'low',
      status: 'applied',
      metrics: { before: 850, after: 600, improvement: 29 },
      category: 'network',
    },
  ];

  // Load metrics and optimizations
  useEffect(() => {
    setMetrics(mockMetrics);
    setOptimizations(mockOptimizations);
  }, []);

  // Simulate real-time monitoring
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          value: Math.max(0, metric.value + (Math.random() - 0.5) * 20),
        })));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  // Auto-optimize based on metrics
  useEffect(() => {
    if (autoOptimize) {
      const interval = setInterval(() => {
        setOptimizations(prev => prev.map(opt => 
          opt.status === 'available' && Math.random() > 0.8
            ? { ...opt, status: 'applied' as const }
            : opt
        ));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoOptimize]);

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
      case 'warning': return <AlertTriangle className='h-4 w-4 text-yellow-600' />;
      case 'critical': return <AlertTriangle className='h-4 w-4 text-red-600' />;
      default: return <Activity className='h-4 w-4 text-gray-600' />;
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className='h-3 w-3 text-red-500' />;
      case 'down': return <TrendingDown className='h-3 w-3 text-green-500' />;
      case 'stable': return <Minus className='h-3 w-3 text-gray-500' />;
      default: return null;
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

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <Activity className='h-4 w-4' />;
      case 'rendering': return <Monitor className='h-4 w-4' />;
      case 'network': return <Wifi className='h-4 w-4' />;
      case 'memory': return <MemoryStick className='h-4 w-4' />;
      case 'storage': return <HardDrive className='h-4 w-4' />;
      default: return <Settings className='h-4 w-4' />;
    }
  };

  // Apply optimization
  const applyOptimization = (optimizationId: string) => {
    setOptimizations(prev => prev.map(opt => 
      opt.id === optimizationId 
        ? { ...opt, status: 'applied' as const }
        : opt
    ));
  };

  // Filter optimizations by category
  const filteredOptimizations = selectedCategory === 'all' 
    ? optimizations 
    : optimizations.filter(opt => opt.category === selectedCategory);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Zap className='h-5 w-5' />
              Performance Optimization
            </CardTitle>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <Switch
                  checked={isMonitoring}
                  onCheckedChange={setIsMonitoring}
                />
                <span className='text-sm'>Live Monitoring</span>
              </div>
              <div className='flex items-center gap-2'>
                <Switch
                  checked={autoOptimize}
                  onCheckedChange={setAutoOptimize}
                />
                <span className='text-sm'>Auto-optimize</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Monitor and optimize app performance in real-time
          </p>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {metrics.map(metric => (
              <div key={metric.id} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium text-sm'>{metric.name}</h4>
                  {getStatusIcon(metric.status)}
                </div>
                
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className={cn('text-2xl font-bold', getStatusColor(metric.status))}>
                      {metric.value}{metric.unit}
                    </span>
                    <div className='flex items-center gap-1'>
                      {getTrendIcon(metric.trend)}
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

      {/* Optimizations */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              Available Optimizations
            </CardTitle>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-48'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                <SelectItem value='navigation'>Navigation</SelectItem>
                <SelectItem value='rendering'>Rendering</SelectItem>
                <SelectItem value='network'>Network</SelectItem>
                <SelectItem value='memory'>Memory</SelectItem>
                <SelectItem value='storage'>Storage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {filteredOptimizations.map(optimization => (
              <div key={optimization.id} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-2'>
                    {getCategoryIcon(optimization.category)}
                    <h4 className='font-medium'>{optimization.name}</h4>
                    <Badge className={getImpactColor(optimization.impact)}>
                      {optimization.impact} impact
                    </Badge>
                    <Badge className={getEffortColor(optimization.effort)}>
                      {optimization.effort} effort
                    </Badge>
                  </div>
                  <Badge variant='outline'>
                    {optimization.status}
                  </Badge>
                </div>

                <p className='text-sm text-muted-foreground'>
                  {optimization.description}
                </p>

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
                    <div className='text-muted-foreground'>Performance</div>
                  </div>
                  <div className='text-center'>
                    <div className='font-medium'>
                      {optimization.category}
                    </div>
                    <div className='text-muted-foreground'>Category</div>
                  </div>
                </div>

                {optimization.status === 'available' && (
                  <Button
                    size='sm'
                    onClick={() => applyOptimization(optimization.id)}
                    className='w-full'
                  >
                    <Zap className='h-3 w-3 mr-2' />
                    Apply Optimization
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Missing imports for trend icons
const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

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
