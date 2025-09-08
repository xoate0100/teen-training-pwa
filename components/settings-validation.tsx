'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validate: (value: any) => boolean;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationResult {
  ruleId: string;
  isValid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface SettingsValidationProps {
  settings: Record<string, any>;
  onValidationChange?: (isValid: boolean, results: ValidationResult[]) => void;
  className?: string;
}

const defaultValidationRules: ValidationRule[] = [
  {
    id: 'email-format',
    name: 'Email Format',
    description: 'Email address must be in valid format',
    validate: (value) => {
      if (!value || value === '') return true; // Optional field
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    severity: 'error',
  },
  {
    id: 'age-range',
    name: 'Age Range',
    description: 'Age must be between 13 and 19 for teen training',
    validate: (value) => {
      if (!value) return true; // Optional field
      const age = parseInt(value);
      return age >= 13 && age <= 19;
    },
    severity: 'error',
  },
  {
    id: 'name-length',
    name: 'Name Length',
    description: 'Name should be between 2 and 50 characters',
    validate: (value) => {
      if (!value || value === '') return true; // Optional field
      return value.length >= 2 && value.length <= 50;
    },
    severity: 'warning',
  },
  {
    id: 'font-size-range',
    name: 'Font Size Range',
    description: 'Font size should be between 12px and 24px for accessibility',
    validate: (value) => {
      if (!value) return true; // Optional field
      const fontSize = parseInt(value);
      return fontSize >= 12 && fontSize <= 24;
    },
    severity: 'warning',
  },
  {
    id: 'session-duration',
    name: 'Session Duration',
    description: 'Session duration should be between 15 and 180 minutes',
    validate: (value) => {
      if (!value) return true; // Optional field
      const duration = parseInt(value);
      return duration >= 15 && duration <= 180;
    },
    severity: 'info',
  },
  {
    id: 'equipment-selection',
    name: 'Equipment Selection',
    description: 'At least one piece of equipment should be selected',
    validate: (value) => {
      if (!value || !Array.isArray(value)) return true; // Optional field
      return value.length > 0;
    },
    severity: 'info',
  },
  {
    id: 'training-days',
    name: 'Training Days',
    description: 'At least one training day should be selected',
    validate: (value) => {
      if (!value || !Array.isArray(value)) return true; // Optional field
      return value.length > 0;
    },
    severity: 'info',
  },
  {
    id: 'timezone-format',
    name: 'Timezone Format',
    description: 'Timezone should be in valid IANA format',
    validate: (value) => {
      if (!value || value === '') return true; // Optional field
      try {
        Intl.DateTimeFormat(undefined, { timeZone: value });
        return true;
      } catch {
        return false;
      }
    },
    severity: 'warning',
  },
];

export function SettingsValidation({
  settings,
  onValidationChange,
  className,
}: SettingsValidationProps) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const runValidation = async () => {
    setIsValidating(true);
    
    // Simulate async validation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results: ValidationResult[] = [];
    
    // Validate each field
    Object.entries(settings).forEach(([category, categorySettings]) => {
      if (typeof categorySettings === 'object' && categorySettings !== null) {
        Object.entries(categorySettings).forEach(([key, value]) => {
          const fieldId = `${category}.${key}`;
          
          defaultValidationRules.forEach(rule => {
            const isValid = rule.validate(value);
            if (!isValid) {
              results.push({
                ruleId: rule.id,
                isValid: false,
                message: rule.description,
                severity: rule.severity,
              });
            }
          });
        });
      }
    });
    
    setValidationResults(results);
    onValidationChange?.(results.length === 0, results);
    setIsValidating(false);
  };

  useEffect(() => {
    runValidation();
  }, [settings]);

  const errorCount = validationResults.filter(r => r.severity === 'error').length;
  const warningCount = validationResults.filter(r => r.severity === 'warning').length;
  const infoCount = validationResults.filter(r => r.severity === 'info').length;
  const totalIssues = errorCount + warningCount + infoCount;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className='h-4 w-4 text-red-500' />;
      case 'warning':
        return <AlertCircle className='h-4 w-4 text-yellow-500' />;
      case 'info':
        return <Info className='h-4 w-4 text-blue-500' />;
      default:
        return <Info className='h-4 w-4 text-gray-500' />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (totalIssues === 0) {
    return (
      <Card className={cn('border-green-200 bg-green-50', className)}>
        <CardContent className='p-4'>
          <div className='flex items-center gap-2 text-green-700'>
            <CheckCircle className='h-5 w-5' />
            <span className='font-medium'>All settings are valid!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('space-y-4', className)}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <AlertCircle className='h-5 w-5' />
            Settings Validation
          </CardTitle>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={runValidation}
              disabled={isValidating}
            >
              {isValidating ? (
                <RefreshCw className='h-4 w-4 animate-spin' />
              ) : (
                <RefreshCw className='h-4 w-4' />
              )}
              Revalidate
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className='space-y-4'>
        {/* Summary */}
        <div className='flex items-center gap-4'>
          <Badge variant={errorCount > 0 ? 'destructive' : 'secondary'}>
            {errorCount} Error{errorCount !== 1 ? 's' : ''}
          </Badge>
          <Badge variant={warningCount > 0 ? 'outline' : 'secondary'} className='border-yellow-500 text-yellow-700'>
            {warningCount} Warning{warningCount !== 1 ? 's' : ''}
          </Badge>
          <Badge variant={infoCount > 0 ? 'outline' : 'secondary'} className='border-blue-500 text-blue-700'>
            {infoCount} Info{infoCount !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Details */}
        {showDetails && (
          <div className='space-y-2'>
            {validationResults.map((result, index) => (
              <Alert
                key={index}
                className={cn('p-3', getSeverityColor(result.severity))}
              >
                <div className='flex items-start gap-2'>
                  {getSeverityIcon(result.severity)}
                  <AlertDescription className='text-sm'>
                    {result.message}
                  </AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Quick Fix Suggestions */}
        {errorCount > 0 && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
            <h4 className='text-sm font-medium text-red-800 mb-2'>
              Quick Fix Suggestions:
            </h4>
            <ul className='text-sm text-red-700 space-y-1'>
              {validationResults
                .filter(r => r.severity === 'error')
                .slice(0, 3)
                .map((result, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='text-red-500 mt-0.5'>•</span>
                    <span>{result.message}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface FieldValidationProps {
  fieldId: string;
  value: any;
  rules: ValidationRule[];
  onValidationChange?: (isValid: boolean, message?: string) => void;
  className?: string;
}

export function FieldValidation({
  fieldId,
  value,
  rules,
  onValidationChange,
  className,
}: FieldValidationProps) {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message?: string;
  }>({ isValid: true });

  useEffect(() => {
    const applicableRules = rules.filter(rule => 
      rule.id.includes(fieldId.split('.').pop() || '') || 
      rule.id === 'email-format' && fieldId.includes('email') ||
      rule.id === 'age-range' && fieldId.includes('age') ||
      rule.id === 'name-length' && fieldId.includes('name')
    );

    for (const rule of applicableRules) {
      const isValid = rule.validate(value);
      if (!isValid) {
        setValidationResult({
          isValid: false,
          message: rule.description,
        });
        onValidationChange?.(false, rule.description);
        return;
      }
    }

    setValidationResult({ isValid: true });
    onValidationChange?.(true);
  }, [fieldId, value, rules, onValidationChange]);

  if (validationResult.isValid) {
    return null;
  }

  return (
    <div className={cn('text-sm text-red-600 flex items-center gap-1', className)}>
      <AlertCircle className='h-3 w-3' />
      {validationResult.message}
    </div>
  );
}
