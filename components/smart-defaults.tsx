'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserBehavior {
  id: string;
  action: string;
  context: string;
  timestamp: number;
  value?: any;
  frequency: number;
  success: boolean;
}

interface SmartRecommendation {
  id: string;
  type: 'setting' | 'feature' | 'workflow' | 'optimization';
  title: string;
  description: string;
  confidence: number; // 0-1
  impact: 'low' | 'medium' | 'high';
  category: string;
  action: {
    type: 'enable' | 'disable' | 'configure' | 'suggest';
    target: string;
    value?: any;
  };
  reasoning: string;
  benefits: string[];
}

interface SmartDefaultsProps {
  userId: string;
  currentSettings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
  className?: string;
}

export function SmartDefaults({
  userId,
  currentSettings,
  onSettingsChange,
  className,
}: SmartDefaultsProps) {
  const [behaviors, setBehaviors] = useState<UserBehavior[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isLearning, setIsLearning] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Simulate behavior analysis
  const analyzeBehaviors = useCallback(() => {
    setIsLearning(true);
    setLearningProgress(0);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setLearningProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLearning(false);
          generateRecommendations();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, []);

  // Generate smart recommendations based on behavior patterns
  const generateRecommendations = useCallback(() => {
    const mockRecommendations: SmartRecommendation[] = [
      {
        id: 'auto-theme',
        type: 'setting',
        title: 'Auto Theme Switching',
        description: 'Switch to dark mode during evening hours based on your usage patterns',
        confidence: 0.85,
        impact: 'medium',
        category: 'preferences',
        action: {
          type: 'enable',
          target: 'preferences.autoTheme',
          value: true,
        },
        reasoning: 'You frequently use the app after 6 PM when dark mode would be more comfortable',
        benefits: ['Reduced eye strain', 'Better battery life', 'Improved focus'],
      },
      {
        id: 'session-reminders',
        type: 'feature',
        title: 'Smart Session Reminders',
        description: 'Get personalized reminders based on your most active training times',
        confidence: 0.92,
        impact: 'high',
        category: 'notifications',
        action: {
          type: 'configure',
          target: 'notifications.smartReminders',
          value: true,
        },
        reasoning: 'You train most consistently on weekdays at 4 PM and weekends at 10 AM',
        benefits: ['Higher consistency', 'Better habit formation', 'Improved results'],
      },
      {
        id: 'one-handed-mode',
        type: 'optimization',
        title: 'One-Handed Navigation',
        description: 'Enable one-handed mode for easier mobile usage during workouts',
        confidence: 0.78,
        impact: 'medium',
        category: 'accessibility',
        action: {
          type: 'enable',
          target: 'accessibility.oneHandedMode',
          value: true,
        },
        reasoning: 'You frequently use the app while holding equipment or in awkward positions',
        benefits: ['Easier navigation', 'Better workout flow', 'Reduced interruptions'],
      },
      {
        id: 'progress-tracking',
        type: 'feature',
        title: 'Enhanced Progress Tracking',
        description: 'Enable detailed progress tracking to better monitor your improvements',
        confidence: 0.88,
        impact: 'high',
        category: 'training',
        action: {
          type: 'configure',
          target: 'training.detailedTracking',
          value: true,
        },
        reasoning: 'You show strong interest in seeing detailed progress metrics and achievements',
        benefits: ['Better motivation', 'Clearer progress', 'Data-driven improvements'],
      },
      {
        id: 'voice-feedback',
        type: 'optimization',
        title: 'Voice Instructions',
        description: 'Enable voice instructions for hands-free workout guidance',
        confidence: 0.73,
        impact: 'low',
        category: 'accessibility',
        action: {
          type: 'enable',
          target: 'accessibility.voiceInstructions',
          value: true,
        },
        reasoning: 'You often train in environments where hands-free operation would be beneficial',
        benefits: ['Hands-free operation', 'Better focus', 'Safer workouts'],
      },
    ];

    setRecommendations(mockRecommendations);
  }, []);

  // Apply recommendation
  const applyRecommendation = useCallback((recommendation: SmartRecommendation) => {
    const newSettings = { ...currentSettings };
    
    // Navigate to nested property and set value
    const keys = recommendation.action.target.split('.');
    let current = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = recommendation.action.value;
    
    onSettingsChange(newSettings);
    
    // Remove applied recommendation
    setRecommendations(prev => prev.filter(r => r.id !== recommendation.id));
  }, [currentSettings, onSettingsChange]);

  // Dismiss recommendation
  const dismissRecommendation = useCallback((recommendationId: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
  }, []);

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
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

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'setting': return <Target className='h-4 w-4' />;
      case 'feature': return <Zap className='h-4 w-4' />;
      case 'workflow': return <TrendingUp className='h-4 w-4' />;
      case 'optimization': return <Star className='h-4 w-4' />;
      default: return <Info className='h-4 w-4' />;
    }
  };

  useEffect(() => {
    // Load existing behaviors from localStorage
    const savedBehaviors = localStorage.getItem(`user_behaviors_${userId}`);
    if (savedBehaviors) {
      setBehaviors(JSON.parse(savedBehaviors));
    }
  }, [userId]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              Smart Defaults & Personalization
            </CardTitle>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            AI-powered recommendations based on your usage patterns and preferences
          </p>
          
          {/* Learning Progress */}
          {isLearning && (
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span>Analyzing your behavior patterns...</span>
                <span>{learningProgress}%</span>
              </div>
              <Progress value={learningProgress} className='h-2' />
            </div>
          )}

          {/* Analysis Button */}
          {!isLearning && recommendations.length === 0 && (
            <Button onClick={analyzeBehaviors} className='w-full'>
              <Brain className='h-4 w-4 mr-2' />
              Analyze My Usage Patterns
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold flex items-center gap-2'>
            <Lightbulb className='h-5 w-5' />
            Personalized Recommendations
          </h3>
          
          {recommendations.map(recommendation => (
            <Card key={recommendation.id} className='border-l-4 border-l-blue-500'>
              <CardContent className='p-4'>
                <div className='space-y-3'>
                  {/* Header */}
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-2'>
                      {getTypeIcon(recommendation.type)}
                      <h4 className='font-medium'>{recommendation.title}</h4>
                      <Badge className={getImpactColor(recommendation.impact)}>
                        {recommendation.impact} impact
                      </Badge>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className={cn('text-sm font-medium', getConfidenceColor(recommendation.confidence))}>
                        {Math.round(recommendation.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className='text-sm text-muted-foreground'>
                    {recommendation.description}
                  </p>

                  {/* Reasoning */}
                  <div className='bg-blue-50 p-3 rounded-lg'>
                    <h5 className='text-sm font-medium text-blue-900 mb-1'>Why this recommendation?</h5>
                    <p className='text-sm text-blue-800'>{recommendation.reasoning}</p>
                  </div>

                  {/* Benefits */}
                  <div className='space-y-1'>
                    <h5 className='text-sm font-medium'>Benefits:</h5>
                    <ul className='text-sm text-muted-foreground space-y-1'>
                      {recommendation.benefits.map((benefit, index) => (
                        <li key={index} className='flex items-center gap-2'>
                          <CheckCircle className='h-3 w-3 text-green-600' />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2 pt-2'>
                    <Button
                      size='sm'
                      onClick={() => applyRecommendation(recommendation)}
                      className='flex items-center gap-2'
                    >
                      <CheckCircle className='h-3 w-3' />
                      Apply
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => dismissRecommendation(recommendation.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Advanced Settings */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Advanced Personalization</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Learning Sensitivity</label>
                <Select defaultValue='medium'>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='low'>Low - Conservative recommendations</SelectItem>
                    <SelectItem value='medium'>Medium - Balanced approach</SelectItem>
                    <SelectItem value='high'>High - Aggressive optimization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>Recommendation Frequency</label>
                <Select defaultValue='weekly'>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='daily'>Daily</SelectItem>
                    <SelectItem value='weekly'>Weekly</SelectItem>
                    <SelectItem value='monthly'>Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium'>Auto-apply High Confidence</label>
                  <p className='text-xs text-muted-foreground'>
                    Automatically apply recommendations with 90%+ confidence
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <label className='text-sm font-medium'>Behavior Tracking</label>
                  <p className='text-xs text-muted-foreground'>
                    Allow the app to learn from your usage patterns
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
