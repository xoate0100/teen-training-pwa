'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Zap,
  Shield,
  Settings,
  Activity,
  BarChart3,
  Target,
  CheckCircle,
} from 'lucide-react';
import { SmartDefaults } from '@/components/smart-defaults';
import { ContextualHelp } from '@/components/contextual-help';
import { UserJourneyOptimization } from '@/components/user-journey-optimization';
import { PerformanceOptimization } from '@/components/performance-optimization';
import { ErrorPreventionRecovery } from '@/components/error-prevention-recovery';
import { cn } from '@/lib/utils';

interface AdvancedUXPageProps {
  className?: string;
}

export default function AdvancedUXPage({ className }: AdvancedUXPageProps) {
  const [activeTab, setActiveTab] = useState('smart-defaults');
  const [userId] = useState('user_123'); // Mock user ID

  const tabs = [
    {
      id: 'smart-defaults',
      label: 'Smart Defaults',
      icon: Brain,
      description: 'AI-powered personalization and smart recommendations',
    },
    {
      id: 'contextual-help',
      label: 'Contextual Help',
      icon: Lightbulb,
      description: 'Interactive tutorials and contextual guidance',
    },
    {
      id: 'user-journey',
      label: 'User Journey',
      icon: TrendingUp,
      description: 'Journey analysis and optimization',
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Zap,
      description: 'Performance monitoring and optimization',
    },
    {
      id: 'error-recovery',
      label: 'Error Recovery',
      icon: Shield,
      description: 'Error prevention and recovery systems',
    },
  ];

  return (
    <div className={cn('min-h-screen bg-background p-4 pb-20', className)}>
      <div className='max-w-6xl mx-auto space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold flex items-center justify-center gap-2'>
            <Settings className='h-8 w-8' />
            Advanced UX Features
          </h1>
          <p className='text-muted-foreground'>
            AI-powered personalization, performance optimization, and advanced user experience features
          </p>
        </div>

        {/* Overview Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <Brain className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Smart Defaults</div>
                  <div className='text-xs text-muted-foreground'>AI personalization</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-green-100 rounded-lg'>
                  <Lightbulb className='h-5 w-5 text-green-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Contextual Help</div>
                  <div className='text-xs text-muted-foreground'>Interactive tutorials</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <TrendingUp className='h-5 w-5 text-purple-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Journey Optimization</div>
                  <div className='text-xs text-muted-foreground'>User flow analysis</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-orange-100 rounded-lg'>
                  <Zap className='h-5 w-5 text-orange-600' />
                </div>
                <div>
                  <div className='text-sm font-medium'>Performance</div>
                  <div className='text-xs text-muted-foreground'>Real-time monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2 md:grid-cols-5'>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className='flex items-center gap-2'>
                  <Icon className='h-4 w-4' />
                  <span className='hidden sm:inline'>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value='smart-defaults' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Brain className='h-5 w-5' />
                  Smart Defaults & Personalization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SmartDefaults
                  userId={userId}
                  currentSettings={{}}
                  onSettingsChange={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='contextual-help' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Lightbulb className='h-5 w-5' />
                  Contextual Help & Onboarding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContextualHelp
                  userId={userId}
                  currentPage='advanced-ux'
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='user-journey' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='h-5 w-5' />
                  User Journey Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserJourneyOptimization userId={userId} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='performance' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Zap className='h-5 w-5' />
                  Performance Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceOptimization />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='error-recovery' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  Error Prevention & Recovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ErrorPreventionRecovery />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <Button variant='outline' className='h-20 flex flex-col gap-2'>
                <Brain className='h-5 w-5' />
                <span className='text-sm'>Run Analysis</span>
              </Button>
              <Button variant='outline' className='h-20 flex flex-col gap-2'>
                <Zap className='h-5 w-5' />
                <span className='text-sm'>Optimize All</span>
              </Button>
              <Button variant='outline' className='h-20 flex flex-col gap-2'>
                <BarChart3 className='h-5 w-5' />
                <span className='text-sm'>View Analytics</span>
              </Button>
              <Button variant='outline' className='h-20 flex flex-col gap-2'>
                <Settings className='h-5 w-5' />
                <span className='text-sm'>Configure</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
