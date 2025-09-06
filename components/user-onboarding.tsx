'use client';

import React, { useState } from 'react';
import { useUser } from '@/lib/contexts/user-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Target,
  Settings,
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

interface OnboardingData {
  // Basic Info
  full_name: string;
  age: number;
  sport: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced';

  // Physical Info
  height: number;
  weight: number;

  // Goals
  goals: string[];

  // Preferences
  workout_duration: number;
  preferred_times: string[];
  equipment_available: string[];
}

const GOAL_OPTIONS = [
  'Improve vertical jump',
  'Increase serve power',
  'Build overall strength',
  'Improve agility and speed',
  'Better endurance',
  'Injury prevention',
  'Team performance',
  'Personal fitness',
];

const EQUIPMENT_OPTIONS = [
  'None (bodyweight only)',
  'Dumbbells',
  'Resistance bands',
  'Pull-up bar',
  'Kettlebell',
  'Medicine ball',
  'Jump rope',
  'Yoga mat',
  'Foam roller',
];

const TIME_OPTIONS = [
  'Early morning (6-8 AM)',
  'Morning (8-10 AM)',
  'Late morning (10-12 PM)',
  'Afternoon (12-4 PM)',
  'Late afternoon (4-6 PM)',
  'Evening (6-8 PM)',
  'Night (8-10 PM)',
];

export function UserOnboarding({ onComplete }: OnboardingProps) {
  const { createUser } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    full_name: '',
    age: 16,
    sport: '',
    experience_level: 'beginner',
    height: 0,
    weight: 0,
    goals: [],
    workout_duration: 45,
    preferred_times: [],
    equipment_available: [],
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleEquipmentToggle = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment_available: prev.equipment_available.includes(equipment)
        ? prev.equipment_available.filter(e => e !== equipment)
        : [...prev.equipment_available, equipment],
    }));
  };

  const handleTimeToggle = (time: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_times: prev.preferred_times.includes(time)
        ? prev.preferred_times.filter(t => t !== time)
        : [...prev.preferred_times, time],
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsCreating(true);

      // Generate email from name for demo purposes
      const email = `${formData.full_name.toLowerCase().replace(/\s+/g, '.')}@betatester.com`;

      await createUser({
        email,
        full_name: formData.full_name,
        age: formData.age,
        sport: formData.sport,
        experience_level: formData.experience_level,
        profile_data: {
          height: formData.height,
          weight: formData.weight,
          goals: formData.goals,
          preferences: {
            workout_duration: formData.workout_duration,
            preferred_times: formData.preferred_times,
            equipment_available: formData.equipment_available,
          },
        },
      });

      toast.success('Profile created successfully!');
      onComplete();
    } catch {
      toast.error('Failed to create profile');
    } finally {
      setIsCreating(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.full_name.trim() &&
          formData.sport.trim() &&
          formData.age >= 13 &&
          formData.age <= 19
        );
      case 2:
        return formData.height > 0 && formData.weight > 0;
      case 3:
        return formData.goals.length > 0;
      case 4:
        return formData.preferred_times.length > 0;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <User className='w-12 h-12 mx-auto text-primary' />
        <h3 className='text-xl font-semibold'>Tell us about yourself</h3>
        <p className='text-muted-foreground'>
          Let's start with some basic information
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <Label htmlFor='full_name'>Full Name</Label>
          <Input
            id='full_name'
            value={formData.full_name}
            onChange={e =>
              setFormData(prev => ({ ...prev, full_name: e.target.value }))
            }
            placeholder='Enter your full name'
            className='mt-1'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='age'>Age</Label>
            <Input
              id='age'
              type='number'
              min='13'
              max='19'
              value={formData.age}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  age: parseInt(e.target.value) || 16,
                }))
              }
              className='mt-1'
            />
          </div>
          <div>
            <Label htmlFor='sport'>Primary Sport</Label>
            <Input
              id='sport'
              value={formData.sport}
              onChange={e =>
                setFormData(prev => ({ ...prev, sport: e.target.value }))
              }
              placeholder='e.g., Volleyball, Basketball'
              className='mt-1'
            />
          </div>
        </div>

        <div>
          <Label htmlFor='experience_level'>Experience Level</Label>
          <Select
            value={formData.experience_level}
            onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
              setFormData(prev => ({ ...prev, experience_level: value }))
            }
          >
            <SelectTrigger className='mt-1'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='beginner'>
                Beginner - New to training
              </SelectItem>
              <SelectItem value='intermediate'>
                Intermediate - Some experience
              </SelectItem>
              <SelectItem value='advanced'>
                Advanced - Experienced athlete
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <Target className='w-12 h-12 mx-auto text-primary' />
        <h3 className='text-xl font-semibold'>Physical Information</h3>
        <p className='text-muted-foreground'>
          Help us personalize your training
        </p>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='height'>Height (cm)</Label>
          <Input
            id='height'
            type='number'
            min='100'
            max='250'
            value={formData.height}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                height: parseInt(e.target.value) || 0,
              }))
            }
            placeholder='170'
            className='mt-1'
          />
        </div>
        <div>
          <Label htmlFor='weight'>Weight (kg)</Label>
          <Input
            id='weight'
            type='number'
            min='30'
            max='150'
            value={formData.weight}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                weight: parseInt(e.target.value) || 0,
              }))
            }
            placeholder='65'
            className='mt-1'
          />
        </div>
      </div>

      <div>
        <Label htmlFor='workout_duration'>
          Preferred Workout Duration (minutes)
        </Label>
        <Select
          value={formData.workout_duration.toString()}
          onValueChange={value =>
            setFormData(prev => ({
              ...prev,
              workout_duration: parseInt(value),
            }))
          }
        >
          <SelectTrigger className='mt-1'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='30'>30 minutes</SelectItem>
            <SelectItem value='45'>45 minutes</SelectItem>
            <SelectItem value='60'>60 minutes</SelectItem>
            <SelectItem value='90'>90 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <Target className='w-12 h-12 mx-auto text-primary' />
        <h3 className='text-xl font-semibold'>Your Goals</h3>
        <p className='text-muted-foreground'>
          What do you want to achieve? (Select all that apply)
        </p>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        {GOAL_OPTIONS.map(goal => (
          <div
            key={goal}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              formData.goals.includes(goal)
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handleGoalToggle(goal)}
          >
            <div className='flex items-center space-x-2'>
              <Checkbox
                checked={formData.goals.includes(goal)}
                onChange={() => handleGoalToggle(goal)}
              />
              <span className='text-sm font-medium'>{goal}</span>
            </div>
          </div>
        ))}
      </div>

      {formData.goals.length > 0 && (
        <div className='space-y-2'>
          <Label>Selected Goals:</Label>
          <div className='flex flex-wrap gap-2'>
            {formData.goals.map(goal => (
              <Badge
                key={goal}
                variant='secondary'
                className='flex items-center gap-1'
              >
                <Check className='w-3 h-3' />
                {goal}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className='space-y-6'>
      <div className='text-center space-y-2'>
        <Settings className='w-12 h-12 mx-auto text-primary' />
        <h3 className='text-xl font-semibold'>Preferences & Equipment</h3>
        <p className='text-muted-foreground'>
          Help us customize your experience
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <Label>Preferred Training Times</Label>
          <p className='text-sm text-muted-foreground mb-3'>
            When do you like to train? (Select all that apply)
          </p>
          <div className='grid grid-cols-1 gap-2'>
            {TIME_OPTIONS.map(time => (
              <div
                key={time}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.preferred_times.includes(time)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleTimeToggle(time)}
              >
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    checked={formData.preferred_times.includes(time)}
                    onChange={() => handleTimeToggle(time)}
                  />
                  <span className='text-sm font-medium'>{time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Available Equipment</Label>
          <p className='text-sm text-muted-foreground mb-3'>
            What equipment do you have access to?
          </p>
          <div className='grid grid-cols-2 gap-2'>
            {EQUIPMENT_OPTIONS.map(equipment => (
              <div
                key={equipment}
                className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.equipment_available.includes(equipment)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleEquipmentToggle(equipment)}
              >
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    checked={formData.equipment_available.includes(equipment)}
                    onChange={() => handleEquipmentToggle(equipment)}
                  />
                  <span className='text-xs font-medium'>{equipment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-background p-4 flex items-center justify-center'>
      <Card className='w-full max-w-2xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>
            Welcome to Teen Training Hub!
          </CardTitle>
          <p className='text-muted-foreground'>
            Let's set up your profile to get you started
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Progress Bar */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className='h-2' />
          </div>

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Navigation */}
          <div className='flex justify-between pt-6'>
            <Button
              variant='outline'
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className='flex items-center gap-2'
            >
              <ChevronLeft className='w-4 h-4' />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className='flex items-center gap-2'
              >
                Next
                <ChevronRight className='w-4 h-4' />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isCreating}
                className='flex items-center gap-2'
              >
                {isCreating ? 'Creating...' : 'Complete Setup'}
                <Check className='w-4 h-4' />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
