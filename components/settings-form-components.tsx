'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Check,
  X,
  AlertCircle,
  Info,
  HelpCircle,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  id,
  label,
  description,
  required = false,
  error,
  helpText,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex items-center gap-2'>
        <Label htmlFor={id} className='text-sm font-medium'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </Label>
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className='h-4 w-4 text-muted-foreground cursor-help' />
              </TooltipTrigger>
              <TooltipContent>
                <p className='max-w-xs'>{helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {description && (
        <p className='text-sm text-muted-foreground'>{description}</p>
      )}
      {children}
      {error && (
        <div className='flex items-center gap-1 text-sm text-red-600'>
          <AlertCircle className='h-3 w-3' />
          {error}
        </div>
      )}
    </div>
  );
}

interface ToggleSwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  helpText?: string;
  className?: string;
}

export function ToggleSwitch({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  helpText,
  className,
}: ToggleSwitchProps) {
  return (
    <FormField
      id={id}
      label={label}
      description={description}
      helpText={helpText}
      className={className}
    >
      <div className='flex items-center justify-between p-3 border rounded-lg bg-card'>
        <div className='space-y-1'>
          <div className='text-sm font-medium'>{label}</div>
          {description && (
            <div className='text-xs text-muted-foreground'>{description}</div>
          )}
        </div>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className='data-[state=checked]:bg-primary'
        />
      </div>
    </FormField>
  );
}

interface SliderControlProps {
  id: string;
  label: string;
  description?: string;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  helpText?: string;
  className?: string;
}

export function SliderControl({
  id,
  label,
  description,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  unit = '',
  disabled = false,
  helpText,
  className,
}: SliderControlProps) {
  return (
    <FormField
      id={id}
      label={label}
      description={description}
      helpText={helpText}
      className={className}
    >
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>
            {value}{unit}
          </span>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <span>{min}{unit}</span>
            <span>-</span>
            <span>{max}{unit}</span>
          </div>
        </div>
        <Slider
          id={id}
          value={[value]}
          onValueChange={([newValue]) => onValueChange(newValue)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className='w-full'
        />
      </div>
    </FormField>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  placeholder?: string;
  disabled?: boolean;
  helpText?: string;
  className?: string;
}

export function SelectField({
  id,
  label,
  description,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  helpText,
  className,
}: SelectFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      description={description}
      helpText={helpText}
      className={className}
    >
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className='flex flex-col'>
                <span>{option.label}</span>
                {option.description && (
                  <span className='text-xs text-muted-foreground'>
                    {option.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

interface TextInputProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  showPasswordToggle?: boolean;
}

export function TextInput({
  id,
  label,
  description,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  className,
  showPasswordToggle = false,
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  useEffect(() => {
    if (type === 'password' && showPasswordToggle) {
      setInputType(showPassword ? 'text' : 'password');
    } else {
      setInputType(type);
    }
  }, [type, showPassword, showPasswordToggle]);

  return (
    <FormField
      id={id}
      label={label}
      description={description}
      required={required}
      error={error}
      helpText={helpText}
      className={className}
    >
      <div className='relative'>
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(
            error && 'border-red-500 focus-visible:ring-red-500',
            showPasswordToggle && 'pr-10'
          )}
        />
        {showPasswordToggle && type === 'password' && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </Button>
        )}
      </div>
    </FormField>
  );
}

interface MultiSelectProps {
  id: string;
  label: string;
  description?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string; description?: string }[];
  placeholder?: string;
  disabled?: boolean;
  helpText?: string;
  className?: string;
}

export function MultiSelect({
  id,
  label,
  description,
  value,
  onChange,
  options,
  placeholder = 'Select options',
  disabled = false,
  helpText,
  className,
}: MultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    if (disabled) return;
    
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <FormField
      id={id}
      label={label}
      description={description}
      helpText={helpText}
      className={className}
    >
      <div className='space-y-2'>
        <div className='flex flex-wrap gap-2'>
          {options.map(option => (
            <Button
              key={option.value}
              type='button'
              variant={value.includes(option.value) ? 'default' : 'outline'}
              size='sm'
              onClick={() => handleToggle(option.value)}
              disabled={disabled}
              className='h-auto p-2 text-left justify-start'
            >
              <div className='flex flex-col items-start'>
                <span className='text-sm font-medium'>{option.label}</span>
                {option.description && (
                  <span className='text-xs text-muted-foreground'>
                    {option.description}
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>
        {value.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {value.map(selectedValue => {
              const option = options.find(opt => opt.value === selectedValue);
              return (
                <Badge key={selectedValue} variant='secondary' className='text-xs'>
                  {option?.label}
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-4 w-4 p-0 ml-1 hover:bg-transparent'
                    onClick={() => handleToggle(selectedValue)}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </FormField>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  className,
  collapsible = false,
  defaultExpanded = true,
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={cn('space-y-4', className)}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-lg'>{title}</CardTitle>
            {description && (
              <p className='text-sm text-muted-foreground'>{description}</p>
            )}
          </div>
          {collapsible && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          )}
        </div>
      </CardHeader>
      {isExpanded && <CardContent className='space-y-4'>{children}</CardContent>}
    </Card>
  );
}

interface FormActionsProps {
  onSave: () => void;
  onReset: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
  className?: string;
}

export function FormActions({
  onSave,
  onReset,
  onCancel,
  isSaving = false,
  hasChanges = false,
  className,
}: FormActionsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        className='flex items-center gap-2'
      >
        {isSaving ? (
          <>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent' />
            Saving...
          </>
        ) : (
          <>
            <Save className='h-4 w-4' />
            Save Changes
          </>
        )}
      </Button>
      <Button
        variant='outline'
        onClick={onReset}
        disabled={!hasChanges || isSaving}
        className='flex items-center gap-2'
      >
        <RotateCcw className='h-4 w-4' />
        Reset
      </Button>
      {onCancel && (
        <Button
          variant='ghost'
          onClick={onCancel}
          disabled={isSaving}
          className='flex items-center gap-2'
        >
          <X className='h-4 w-4' />
          Cancel
        </Button>
      )}
    </div>
  );
}

interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}

export function useFormValidation() {
  const [validation, setValidation] = useState<ValidationState>({
    isValid: true,
    errors: {},
  });

  const validateField = (fieldId: string, value: any, rules: any) => {
    const errors: Record<string, string> = {};

    if (rules.required && (!value || value === '')) {
      errors[fieldId] = 'This field is required';
    }

    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[fieldId] = 'Please enter a valid email address';
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      errors[fieldId] = `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[fieldId] = `Must be no more than ${rules.maxLength} characters`;
    }

    if (rules.min && value && value < rules.min) {
      errors[fieldId] = `Must be at least ${rules.min}`;
    }

    if (rules.max && value && value > rules.max) {
      errors[fieldId] = `Must be no more than ${rules.max}`;
    }

    setValidation(prev => ({
      isValid: Object.keys(errors).length === 0,
      errors: { ...prev.errors, ...errors },
    }));

    return errors;
  };

  const clearError = (fieldId: string) => {
    setValidation(prev => {
      const newErrors = { ...prev.errors };
      delete newErrors[fieldId];
      return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors,
      };
    });
  };

  const clearAllErrors = () => {
    setValidation({ isValid: true, errors: {} });
  };

  return {
    validation,
    validateField,
    clearError,
    clearAllErrors,
  };
}
