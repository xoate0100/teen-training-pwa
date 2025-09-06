'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChevronRight,
  ChevronLeft,
  Target,
  Zap,
  Trophy,
  Heart,
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    experience: '',
    goals: [] as string[],
    preferences: [] as string[],
  });

  const steps = [
    {
      title: 'Welcome to Your Training Journey! 🏐',
      content: (
        <div className='text-center space-y-4'>
          <div className='text-6xl mb-4'>🏐</div>
          <h3 className='text-xl font-semibold text-balance'>
            Ready to become a volleyball superstar?
          </h3>
          <p className='text-muted-foreground text-pretty'>
            This app will help you train smarter, track your progress, and have
            fun while getting stronger!
          </p>
          <div className='grid grid-cols-2 gap-4 mt-6'>
            <div className='flex flex-col items-center p-4 bg-primary/10 rounded-lg'>
              <Target className='h-8 w-8 text-primary mb-2' />
              <span className='text-sm font-medium'>Skill Building</span>
            </div>
            <div className='flex flex-col items-center p-4 bg-primary/10 rounded-lg'>
              <Zap className='h-8 w-8 text-primary mb-2' />
              <span className='text-sm font-medium'>Strength Training</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tell us about yourself',
      content: (
        <div className='space-y-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>
              What's your name?
            </label>
            <input
              type='text'
              placeholder='Enter your name'
              className='w-full p-3 border rounded-lg'
              value={userProfile.name}
              onChange={e =>
                setUserProfile(prev => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>
              How old are you?
            </label>
            <div className='grid grid-cols-3 gap-2'>
              {['11', '12', '13'].map(age => (
                <Button
                  key={age}
                  variant={userProfile.age === age ? 'default' : 'outline'}
                  onClick={() => setUserProfile(prev => ({ ...prev, age }))}
                  className='h-12'
                >
                  {age} years
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className='text-sm font-medium mb-2 block'>
              Volleyball experience?
            </label>
            <div className='space-y-2'>
              {[
                { value: 'beginner', label: '🌟 Just starting out' },
                { value: 'some', label: '⭐ Played a little' },
                { value: 'experienced', label: '🏆 Pretty good player' },
              ].map(option => (
                <Button
                  key={option.value}
                  variant={
                    userProfile.experience === option.value
                      ? 'default'
                      : 'outline'
                  }
                  onClick={() =>
                    setUserProfile(prev => ({
                      ...prev,
                      experience: option.value,
                    }))
                  }
                  className='w-full justify-start h-12'
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'What are your goals?',
      content: (
        <div className='space-y-4'>
          <p className='text-muted-foreground text-center'>
            Pick what you want to work on (choose any!):
          </p>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { id: 'serve', label: '🏐 Better Serves', icon: Target },
              { id: 'jump', label: '⬆️ Jump Higher', icon: Zap },
              { id: 'strength', label: '💪 Get Stronger', icon: Heart },
              { id: 'speed', label: '⚡ Move Faster', icon: Zap },
              { id: 'teamwork', label: '🤝 Team Player', icon: Trophy },
              { id: 'confidence', label: '😊 Feel Confident', icon: Heart },
            ].map(goal => (
              <Button
                key={goal.id}
                variant={
                  userProfile.goals.includes(goal.id) ? 'default' : 'outline'
                }
                onClick={() => {
                  setUserProfile(prev => ({
                    ...prev,
                    goals: prev.goals.includes(goal.id)
                      ? prev.goals.filter(g => g !== goal.id)
                      : [...prev.goals, goal.id],
                  }));
                }}
                className='h-16 flex-col gap-1'
              >
                <goal.icon className='h-5 w-5' />
                <span className='text-xs'>{goal.label}</span>
              </Button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'How do you like to learn?',
      content: (
        <div className='space-y-4'>
          <p className='text-muted-foreground text-center'>
            Help us make training perfect for you:
          </p>
          <div className='space-y-3'>
            {[
              { id: 'visual', label: '👀 I like pictures and videos' },
              { id: 'audio', label: '🔊 I like sounds and music' },
              { id: 'movement', label: '🏃 I learn by doing' },
              { id: 'breaks', label: '⏰ I need short breaks' },
              { id: 'choices', label: '🎯 I like having options' },
              { id: 'games', label: '🎮 I love games and challenges' },
            ].map(pref => (
              <Button
                key={pref.id}
                variant={
                  userProfile.preferences.includes(pref.id)
                    ? 'default'
                    : 'outline'
                }
                onClick={() => {
                  setUserProfile(prev => ({
                    ...prev,
                    preferences: prev.preferences.includes(pref.id)
                      ? prev.preferences.filter(p => p !== pref.id)
                      : [...prev.preferences, pref.id],
                  }));
                }}
                className='w-full justify-start h-12'
              >
                {pref.label}
              </Button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "You're all set! 🎉",
      content: (
        <div className='text-center space-y-4'>
          <div className='text-6xl mb-4'>🎉</div>
          <h3 className='text-xl font-semibold text-balance'>
            Welcome to your training team, {userProfile.name}!
          </h3>
          <div className='bg-primary/10 p-4 rounded-lg space-y-2'>
            <p className='font-medium'>Your personalized program includes:</p>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <Badge variant='secondary'>11-week program</Badge>
              <Badge variant='secondary'>4 sessions/week</Badge>
              <Badge variant='secondary'>Skill building</Badge>
              <Badge variant='secondary'>Strength training</Badge>
            </div>
          </div>
          <p className='text-muted-foreground text-pretty'>
            Remember: Every athlete is different, and that's what makes you
            special! We'll adjust everything to help you succeed.
          </p>
        </div>
      ),
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile and complete onboarding
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      localStorage.setItem('onboardingComplete', 'true');
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return userProfile.name && userProfile.age && userProfile.experience;
      case 2:
        return userProfile.goals.length > 0;
      case 3:
        return userProfile.preferences.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm text-muted-foreground'>
              Step {currentStep + 1} of {steps.length}
            </span>
            <Badge variant='outline'>{Math.round(progress)}%</Badge>
          </div>
          <Progress value={progress} className='mb-4' />
          <CardTitle className='text-lg'>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {steps[currentStep].content}

          <div className='flex gap-2'>
            {currentStep > 0 && (
              <Button
                variant='outline'
                onClick={handlePrev}
                className='flex-1 bg-transparent'
              >
                <ChevronLeft className='h-4 w-4 mr-1' />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className='flex-1'
            >
              {currentStep === steps.length - 1 ? 'Start Training!' : 'Next'}
              {currentStep < steps.length - 1 && (
                <ChevronRight className='h-4 w-4 ml-1' />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
