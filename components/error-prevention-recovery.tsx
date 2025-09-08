'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Undo2,
  Save,
  Shield,
  Zap,
  Lightbulb,
  Settings,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorPattern {
  id: string;
  type: 'validation' | 'network' | 'permission' | 'data' | 'ui';
  title: string;
  description: string;
  frequency: number; // occurrences per week
  severity: 'low' | 'medium' | 'high' | 'critical';
  prevention: {
    enabled: boolean;
    method: string;
    description: string;
  };
  recovery: {
    enabled: boolean;
    method: string;
    description: string;
  };
  lastOccurred: Date;
  resolved: boolean;
}

interface RecoveryAction {
  id: string;
  name: string;
  description: string;
  type: 'automatic' | 'manual' | 'guided';
  successRate: number;
  timeToResolve: number; // in seconds
  prerequisites: string[];
}

interface ErrorPreventionRecoveryProps {
  className?: string;
}

export function ErrorPreventionRecovery({ className }: ErrorPreventionRecoveryProps) {
  const [errorPatterns, setErrorPatterns] = useState<ErrorPattern[]>([]);
  const [recoveryActions, setRecoveryActions] = useState<RecoveryAction[]>([]);
  const [autoRecovery, setAutoRecovery] = useState(true);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [selectedError, setSelectedError] = useState<ErrorPattern | null>(null);

  // Mock error patterns
  const mockErrorPatterns: ErrorPattern[] = [
    {
      id: 'form-validation',
      type: 'validation',
      title: 'Form Validation Errors',
      description: 'Users entering invalid data in forms',
      frequency: 12,
      severity: 'medium',
      prevention: {
        enabled: true,
        method: 'Real-time validation',
        description: 'Validate input as user types with clear error messages',
      },
      recovery: {
        enabled: true,
        method: 'Auto-correction suggestions',
        description: 'Suggest corrections for common input errors',
      },
      lastOccurred: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      resolved: true,
    },
    {
      id: 'network-timeout',
      type: 'network',
      title: 'Network Timeout Errors',
      description: 'API requests timing out due to slow connections',
      frequency: 8,
      severity: 'high',
      prevention: {
        enabled: true,
        method: 'Retry with exponential backoff',
        description: 'Automatically retry failed requests with increasing delays',
      },
      recovery: {
        enabled: true,
        method: 'Offline mode with sync',
        description: 'Allow offline operation and sync when connection restored',
      },
      lastOccurred: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      resolved: true,
    },
    {
      id: 'permission-denied',
      type: 'permission',
      title: 'Permission Denied Errors',
      description: 'Users trying to access features without proper permissions',
      frequency: 5,
      severity: 'low',
      prevention: {
        enabled: true,
        method: 'Proactive permission checks',
        description: 'Check permissions before showing restricted features',
      },
      recovery: {
        enabled: true,
        method: 'Permission request flow',
        description: 'Guide users through permission request process',
      },
      lastOccurred: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      resolved: true,
    },
    {
      id: 'data-corruption',
      type: 'data',
      title: 'Data Corruption Errors',
      description: 'Corrupted data causing app crashes or incorrect behavior',
      frequency: 2,
      severity: 'critical',
      prevention: {
        enabled: true,
        method: 'Data validation and checksums',
        description: 'Validate data integrity before processing',
      },
      recovery: {
        enabled: true,
        method: 'Data restoration from backup',
        description: 'Restore data from last known good state',
      },
      lastOccurred: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      resolved: true,
    },
    {
      id: 'ui-crash',
      type: 'ui',
      title: 'UI Component Crashes',
      description: 'React components crashing due to unexpected state',
      frequency: 3,
      severity: 'high',
      prevention: {
        enabled: true,
        method: 'Error boundaries and fallbacks',
        description: 'Catch component errors and show fallback UI',
      },
      recovery: {
        enabled: true,
        method: 'Component reset and reload',
        description: 'Reset component state and reload from server',
      },
      lastOccurred: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      resolved: true,
    },
  ];

  // Mock recovery actions
  const mockRecoveryActions: RecoveryAction[] = [
    {
      id: 'auto-retry',
      name: 'Automatic Retry',
      description: 'Automatically retry failed operations',
      type: 'automatic',
      successRate: 0.85,
      timeToResolve: 5,
      prerequisites: ['Network connectivity', 'Valid request'],
    },
    {
      id: 'data-backup',
      name: 'Data Backup Restore',
      description: 'Restore data from last backup',
      type: 'automatic',
      successRate: 0.95,
      timeToResolve: 30,
      prerequisites: ['Backup available', 'Data corruption detected'],
    },
    {
      id: 'permission-request',
      name: 'Permission Request Flow',
      description: 'Guide user through permission request',
      type: 'guided',
      successRate: 0.70,
      timeToResolve: 60,
      prerequisites: ['User interaction required', 'Permission available'],
    },
    {
      id: 'component-reset',
      name: 'Component Reset',
      description: 'Reset component to initial state',
      type: 'automatic',
      successRate: 0.90,
      timeToResolve: 10,
      prerequisites: ['Component error detected', 'State reset possible'],
    },
    {
      id: 'manual-recovery',
      name: 'Manual Recovery',
      description: 'User-guided recovery process',
      type: 'manual',
      successRate: 0.60,
      timeToResolve: 300,
      prerequisites: ['User available', 'Complex error state'],
    },
  ];

  // Load data
  useEffect(() => {
    setErrorPatterns(mockErrorPatterns);
    setRecoveryActions(mockRecoveryActions);
  }, []);

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'validation': return <CheckCircle className='h-4 w-4' />;
      case 'network': return <RefreshCw className='h-4 w-4' />;
      case 'permission': return <Shield className='h-4 w-4' />;
      case 'data': return <Save className='h-4 w-4' />;
      case 'ui': return <Settings className='h-4 w-4' />;
      default: return <AlertTriangle className='h-4 w-4' />;
    }
  };

  // Get recovery type color
  const getRecoveryTypeColor = (type: string) => {
    switch (type) {
      case 'automatic': return 'bg-green-100 text-green-800';
      case 'manual': return 'bg-blue-100 text-blue-800';
      case 'guided': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Toggle prevention
  const togglePrevention = (errorId: string) => {
    setErrorPatterns(prev => prev.map(error => 
      error.id === errorId 
        ? { ...error, prevention: { ...error.prevention, enabled: !error.prevention.enabled } }
        : error
    ));
  };

  // Toggle recovery
  const toggleRecovery = (errorId: string) => {
    setErrorPatterns(prev => prev.map(error => 
      error.id === errorId 
        ? { ...error, recovery: { ...error.recovery, enabled: !error.recovery.enabled } }
        : error
    ));
  };

  // Trigger recovery
  const triggerRecovery = (error: ErrorPattern) => {
    setSelectedError(error);
    setShowRecoveryDialog(true);
  };

  // Execute recovery action
  const executeRecovery = (actionId: string) => {
    // Simulate recovery execution
    console.log(`Executing recovery action: ${actionId}`);
    setShowRecoveryDialog(false);
    setSelectedError(null);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Error Prevention & Recovery
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Switch
                checked={autoRecovery}
                onCheckedChange={setAutoRecovery}
              />
              <span className='text-sm'>Auto-recovery</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Monitor error patterns and implement prevention and recovery strategies
          </p>
        </CardContent>
      </Card>

      {/* Error Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5' />
            Error Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {errorPatterns.map(error => (
              <div key={error.id} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-2'>
                    {getTypeIcon(error.type)}
                    <h4 className='font-medium'>{error.title}</h4>
                    <Badge className={getSeverityColor(error.severity)}>
                      {error.severity}
                    </Badge>
                    <Badge variant='outline'>
                      {error.frequency}/week
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2'>
                    {error.resolved ? (
                      <CheckCircle className='h-4 w-4 text-green-600' />
                    ) : (
                      <XCircle className='h-4 w-4 text-red-600' />
                    )}
                  </div>
                </div>

                <p className='text-sm text-muted-foreground'>{error.description}</p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Prevention */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <h5 className='text-sm font-medium'>Prevention</h5>
                      <Switch
                        checked={error.prevention.enabled}
                        onCheckedChange={() => togglePrevention(error.id)}
                      />
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      <div className='font-medium'>{error.prevention.method}</div>
                      <div>{error.prevention.description}</div>
                    </div>
                  </div>

                  {/* Recovery */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <h5 className='text-sm font-medium'>Recovery</h5>
                      <Switch
                        checked={error.recovery.enabled}
                        onCheckedChange={() => toggleRecovery(error.id)}
                      />
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      <div className='font-medium'>{error.recovery.method}</div>
                      <div>{error.recovery.description}</div>
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between pt-2'>
                  <div className='text-xs text-muted-foreground'>
                    Last occurred: {error.lastOccurred.toLocaleString()}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => triggerRecovery(error)}
                  >
                    <RefreshCw className='h-3 w-3 mr-1' />
                    Test Recovery
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Zap className='h-5 w-5' />
            Recovery Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {recoveryActions.map(action => (
              <div key={action.id} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>{action.name}</h4>
                  <Badge className={getRecoveryTypeColor(action.type)}>
                    {action.type}
                  </Badge>
                </div>

                <p className='text-sm text-muted-foreground'>{action.description}</p>

                <div className='grid grid-cols-3 gap-4 text-sm'>
                  <div className='text-center'>
                    <div className='font-medium text-green-600'>
                      {Math.round(action.successRate * 100)}%
                    </div>
                    <div className='text-muted-foreground'>Success Rate</div>
                  </div>
                  <div className='text-center'>
                    <div className='font-medium'>
                      {action.timeToResolve}s
                    </div>
                    <div className='text-muted-foreground'>Time to Resolve</div>
                  </div>
                  <div className='text-center'>
                    <div className='font-medium'>
                      {action.prerequisites.length}
                    </div>
                    <div className='text-muted-foreground'>Prerequisites</div>
                  </div>
                </div>

                <div className='space-y-1'>
                  <h5 className='text-xs font-medium text-muted-foreground'>Prerequisites:</h5>
                  <div className='flex flex-wrap gap-1'>
                    {action.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant='outline' className='text-xs'>
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Dialog */}
      <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <RefreshCw className='h-5 w-5' />
              Recovery Options
            </DialogTitle>
            <DialogDescription>
              Choose a recovery action for: {selectedError?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className='space-y-4'>
            {recoveryActions.map(action => (
              <div key={action.id} className='p-3 border rounded-lg space-y-2'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>{action.name}</h4>
                  <Badge className={getRecoveryTypeColor(action.type)}>
                    {action.type}
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>{action.description}</p>
                <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                  <span>{Math.round(action.successRate * 100)}% success</span>
                  <span>{action.timeToResolve}s duration</span>
                </div>
                <Button
                  size='sm'
                  onClick={() => executeRecovery(action.id)}
                  className='w-full'
                >
                  Execute Recovery
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
