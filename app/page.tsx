'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { ProfileSwitcher } from '@/components/profile-switcher';
import { UserOnboarding } from '@/components/user-onboarding';
import { RealTimeNotifications } from '@/components/real-time-notifications';
import { RealTimeAchievements } from '@/components/real-time-achievements';
import { OfflineStatus } from '@/components/offline-status';
import { WeekCalculationDisplay } from '@/components/week-calculation-display';
import { SmartSchedulingDisplay } from '@/components/smart-scheduling-display';
import { AIIntelligenceDisplay } from '@/components/ai-intelligence-display';
import { LLMIntegrationDisplay } from '@/components/llm-integration-display';
import { WellnessIntelligenceDisplay } from '@/components/wellness-intelligence-display';
import { HeroBackground } from '@/components/hero-background';
import { SessionTypeShowcase } from '@/components/session-type-showcase';
import { ThemedSessionCard } from '@/components/themed-session-card';
import { GamificationDashboard } from '@/components/gamification-dashboard';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeSelector } from '@/components/theme-selector';
import { MicroInteractionDemo } from '@/components/micro-interactions';
import { ImmersiveFeedbackDemo } from '@/components/immersive-feedback';
import { PersonalizationProvider } from '@/components/personalization-provider';
import { PersonalizationDashboard } from '@/components/personalization-dashboard';
import { AdaptiveInterface } from '@/components/adaptive-interface';
import { useUser } from '@/lib/contexts/user-context';
import { useDatabase } from '@/lib/hooks/use-database';

const Trophy = () => (
  <span role='img' aria-label='Trophy'>
    🏆
  </span>
);
const Target = () => (
  <span role='img' aria-label='Target'>
    🎯
  </span>
);
const Zap = () => (
  <span role='img' aria-label='Lightning'>
    ⚡
  </span>
);
const Heart = () => (
  <span role='img' aria-label='Heart'>
    ❤️
  </span>
);
const Play = () => (
  <span role='img' aria-label='Play'>
    ▶️
  </span>
);
const Check = () => (
  <span role='img' aria-label='Check'>
    ✓
  </span>
);
const Star = () => (
  <span role='img' aria-label='Star'>
    ⭐
  </span>
);
const TrendingUp = () => (
  <span role='img' aria-label='Trending Up'>
    📈
  </span>
);
const Award = () => (
  <span role='img' aria-label='Award'>
    🏅
  </span>
);
const Eye = () => (
  <span role='img' aria-label='Eye'>
    👁️
  </span>
);
const EyeOff = () => (
  <span role='img' aria-label='Eye Off'>
    🙈
  </span>
);
const ChevronDown = () => (
  <span role='img' aria-label='Chevron Down'>
    ⬇️
  </span>
);
const ChevronUp = () => (
  <span role='img' aria-label='Chevron Up'>
    ⬆️
  </span>
);

export default function Dashboard() {
  const router = useRouter();
  const {
    currentUser,
    isLoading: userLoading,
    users,
    refreshUsers,
  } = useUser();
  const { saveCheckIn, checkIns } = useDatabase();
  const [announcements, setAnnouncements] = useState('');
  const [mood, setMood] = useState(4);
  const [energy, setEnergy] = useState([7]);
  const [sleepHours, setSleepHours] = useState(8);
  const [muscleSoreness, setMuscleSoreness] = useState([2]);
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [showAdvancedProgress, setShowAdvancedProgress] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [useNativeInputs, setUseNativeInputs] = useState(true);

  const moodEmojis = [
    { emoji: '😴', label: 'Tired', value: 1 },
    { emoji: '😐', label: 'Okay', value: 2 },
    { emoji: '🙂', label: 'Good', value: 3 },
    { emoji: '😊', label: 'Great', value: 4 },
    { emoji: '🔥', label: 'Amazing', value: 5 },
  ];

  const sleepPresets = [6, 7, 8, 9];

  // Check if today's check-in is already completed
  useEffect(() => {
    if (checkIns && checkIns.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayCheckIn = checkIns.find(checkIn => checkIn.date === today);
      if (todayCheckIn) {
        setCheckInCompleted(true);
        setMood(todayCheckIn.mood);
        setEnergy([todayCheckIn.energy]);
        setSleepHours(todayCheckIn.sleep);
        setMuscleSoreness([todayCheckIn.soreness]);
      }
    }
  }, [checkIns]);

  const handleCheckInSubmit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await saveCheckIn({
        date: today,
        mood,
        energy: energy[0],
        sleep: sleepHours,
        soreness: muscleSoreness[0],
      });

      setCheckInCompleted(true);
      setShowCelebration(true);
      setAnnouncements('Daily check-in completed successfully!');
      setTimeout(() => {
        setShowCelebration(false);
        setAnnouncements('');
      }, 2000);
    } catch (error) {
      console.error('Error saving check-in:', error);
      setAnnouncements('Failed to save check-in. Please try again.');
    }
  };

  const handleStartSession = (sessionType?: string) => {
    const sessionPath = sessionType
      ? `/session?type=${sessionType}`
      : '/session';
    router.push(sessionPath);
  };

  const progressMetrics = [
    {
      name: 'Vertical Jump',
      current: 18,
      target: 22,
      unit: 'inches',
      progress: 82,
    },
    {
      name: 'Broad Jump',
      current: 5.2,
      target: 6.0,
      unit: 'feet',
      progress: 87,
    },
    {
      name: '10yd Sprint',
      current: 2.1,
      target: 1.9,
      unit: 'seconds',
      progress: 75,
    },
    {
      name: 'Serve Accuracy',
      current: 78,
      target: 85,
      unit: '%',
      progress: 92,
    },
  ];

  const badges = [
    { name: 'Week Warrior', icon: Trophy, earned: true },
    { name: 'Jump Master', icon: Zap, earned: true },
    { name: 'Speed Demon', icon: Target, earned: false },
    { name: 'Consistency King', icon: Star, earned: true },
  ];

  // Show loading state while user data is being fetched
  if (userLoading) {
    return (
      <div className='min-h-screen bg-background p-4 pb-20 flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-16 h-16 bg-primary/20 rounded-full animate-pulse mx-auto' />
          <p className='text-muted-foreground'>Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if no users exist
  if (!userLoading && users.length === 0) {
    return <UserOnboarding onComplete={refreshUsers} />;
  }

  // Show message if no user is selected
  if (!currentUser) {
    return (
      <div className='min-h-screen bg-background p-4 pb-20 flex items-center justify-center'>
        <div className='text-center space-y-4 max-w-md'>
          <div className='text-6xl'>👤</div>
          <h2 className='text-2xl font-bold'>No User Selected</h2>
          <p className='text-muted-foreground'>
            Please select a user from the profile switcher to continue.
          </p>
          <ProfileSwitcher />
        </div>
      </div>
    );
  }

  return (
    <PersonalizationProvider userId={currentUser?.id || 'default-user'}>
      <AdaptiveInterface>
        <div className='min-h-screen bg-background p-4 pb-20'>
          <div aria-live='polite' aria-atomic='true' className='sr-only'>
            {announcements}
          </div>

          <HeroBackground context='dashboard' className='mb-6 rounded-lg'>
            <header className='p-6'>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h1 className='text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg'>
                    Teen Training Hub
                  </h1>
                  <p className='text-lg text-white/90 leading-relaxed drop-shadow-md'>
                    {currentUser
                      ? `Welcome back, ${currentUser.full_name}! • Week ${currentUser.current_week || 1} of 11 • Let's crush today! 💪`
                      : 'Loading...'}
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setSimpleMode(!simpleMode)}
                    className='flex items-center gap-2 h-12 px-4'
                    aria-label={
                      simpleMode
                        ? 'Switch to full view mode'
                        : 'Switch to simple mode'
                    }
                  >
                    {simpleMode ? <Eye /> : <EyeOff />}
                    {simpleMode ? 'Full View' : 'Simple Mode'}
                  </Button>
                  <RealTimeNotifications />
                  <OfflineStatus />
                  <ProfileSwitcher />
                </div>
              </div>

              {simpleMode && (
                <div
                  className='bg-primary/10 border-2 border-primary/30 rounded-lg p-4 mb-4'
                  role='banner'
                >
                  <div className='flex items-center gap-3 text-primary font-semibold'>
                    <Target />
                    <span>Today's Focus: Check-in → Train → Progress</span>
                  </div>
                </div>
              )}
            </header>
          </HeroBackground>

          {showCelebration && (
            <div
              className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
              role='dialog'
              aria-modal='true'
              aria-labelledby='celebration-title'
            >
              <div className='bg-background p-8 rounded-lg text-center animate-pulse border-2 border-primary/20 shadow-2xl'>
                <div
                  className='text-6xl mb-4'
                  role='img'
                  aria-label='Celebration'
                >
                  🎉
                </div>
                <h3
                  id='celebration-title'
                  className='text-xl font-bold text-primary'
                >
                  Great job!
                </h3>
                <p className='text-base text-muted-foreground'>
                  Check-in completed!
                </p>
              </div>
            </div>
          )}

          <Tabs defaultValue='dashboard' className='w-full'>
            <TabsList
              className='grid w-full grid-cols-12 mb-6 h-12'
              role='tablist'
              aria-label='Main navigation'
            >
              <TabsTrigger value='dashboard' className='text-base font-medium'>
                Dashboard
              </TabsTrigger>
              <TabsTrigger value='session' className='text-base font-medium'>
                Session
              </TabsTrigger>
              <TabsTrigger value='progress' className='text-base font-medium'>
                Progress
              </TabsTrigger>
              <TabsTrigger value='themes' className='text-base font-medium'>
                Themes
              </TabsTrigger>
              <TabsTrigger
                value='achievements'
                className='text-base font-medium'
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value='interactive'
                className='text-base font-medium'
              >
                Interactive
              </TabsTrigger>
              <TabsTrigger
                value='personalization'
                className='text-base font-medium'
              >
                Personal
              </TabsTrigger>
              <TabsTrigger value='smart' className='text-base font-medium'>
                Smart
              </TabsTrigger>
              <TabsTrigger value='ai' className='text-base font-medium'>
                AI
              </TabsTrigger>
              <TabsTrigger value='coaching' className='text-base font-medium'>
                Coaching
              </TabsTrigger>
              <TabsTrigger value='wellness' className='text-base font-medium'>
                Wellness
              </TabsTrigger>
              <TabsTrigger value='profile' className='text-base font-medium'>
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value='dashboard' className='space-y-6'>
              <section aria-labelledby='checkin-title'>
                <Card className='border-2 border-primary/20 shadow-sm'>
                  <CardHeader className='pb-4'>
                    <CardTitle
                      id='checkin-title'
                      className='flex items-center gap-3 text-lg font-semibold'
                    >
                      <Heart />
                      Daily Check-in
                      {checkInCompleted && <Check />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-8'>
                    {simpleMode ? (
                      <fieldset>
                        <legend className='text-base font-semibold mb-4 text-foreground'>
                          How are you feeling?
                        </legend>
                        <div
                          className='grid grid-cols-3 gap-4'
                          role='radiogroup'
                          aria-labelledby='mood-simple'
                        >
                          {[
                            { emoji: '😐', label: 'Okay', value: 2 },
                            { emoji: '🙂', label: 'Good', value: 3 },
                            { emoji: '😊', label: 'Great', value: 4 },
                          ].map(moodOption => (
                            <button
                              key={moodOption.value}
                              onClick={() => setMood(moodOption.value)}
                              className={`p-6 rounded-xl border-2 transition-all duration-200 text-center min-h-[100px] ${
                                mood === moodOption.value
                                  ? 'border-primary bg-primary text-primary-foreground scale-105 shadow-lg'
                                  : 'border-border hover:border-primary/50 bg-card text-card-foreground hover:bg-accent hover:scale-102'
                              }`}
                              role='radio'
                              aria-checked={mood === moodOption.value}
                              aria-label={`Feeling ${moodOption.label}`}
                            >
                              <div
                                className='text-4xl mb-3'
                                role='img'
                                aria-label={moodOption.label}
                              >
                                {moodOption.emoji}
                              </div>
                              <p className='text-lg font-medium'>
                                {moodOption.label}
                              </p>
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    ) : (
                      <fieldset>
                        <legend className='text-base font-semibold mb-4 text-foreground'>
                          How are you feeling today?
                        </legend>
                        <div
                          className='flex justify-between gap-3'
                          role='radiogroup'
                        >
                          {moodEmojis.map(moodOption => (
                            <button
                              key={moodOption.value}
                              onClick={() => setMood(moodOption.value)}
                              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 text-center min-h-[80px] ${
                                mood === moodOption.value
                                  ? 'border-primary bg-primary text-primary-foreground scale-105 shadow-lg'
                                  : 'border-border hover:border-primary/50 bg-card text-card-foreground hover:bg-accent hover:scale-102'
                              }`}
                              role='radio'
                              aria-checked={mood === moodOption.value}
                              aria-label={`Feeling ${moodOption.label}`}
                            >
                              <div
                                className='text-3xl mb-2'
                                role='img'
                                aria-label={moodOption.label}
                              >
                                {moodOption.emoji}
                              </div>
                              <p className='text-sm font-medium'>
                                {moodOption.label}
                              </p>
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    {simpleMode ? (
                      <div className='space-y-6'>
                        <fieldset>
                          <legend className='text-base font-semibold mb-4 text-foreground'>
                            Energy Level
                          </legend>
                          {useNativeInputs ? (
                            <div className='space-y-4'>
                              <div className='flex justify-between items-center'>
                                <label
                                  htmlFor='energy-native'
                                  className='text-base font-medium'
                                >
                                  Energy: {energy[0]}/10
                                </label>
                                <Badge
                                  variant='secondary'
                                  className='text-lg font-bold px-3 py-2'
                                >
                                  {energy[0] <= 3
                                    ? '😴'
                                    : energy[0] <= 6
                                      ? '🙂'
                                      : '⚡'}
                                </Badge>
                              </div>
                              <input
                                id='energy-native'
                                type='range'
                                min='1'
                                max='10'
                                step='1'
                                value={energy[0]}
                                onChange={e =>
                                  setEnergy([Number.parseInt(e.target.value)])
                                }
                                className='w-full h-8 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb:appearance-none slider-thumb:h-6 slider-thumb:w-6 slider-thumb:rounded-full slider-thumb:bg-primary slider-thumb:cursor-pointer slider-thumb:border-2 slider-thumb:border-white slider-thumb:shadow-lg'
                                style={{
                                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((energy[0] - 1) / 9) * 100}%, #e5e7eb ${((energy[0] - 1) / 9) * 100}%, #e5e7eb 100%)`,
                                }}
                              />
                              <div className='flex justify-between text-sm text-muted-foreground'>
                                <span>Low</span>
                                <span>High</span>
                              </div>
                            </div>
                          ) : (
                            <div
                              className='grid grid-cols-3 gap-4'
                              role='radiogroup'
                            >
                              {[
                                { label: 'Low', value: 3, emoji: '😴' },
                                { label: 'Good', value: 7, emoji: '🙂' },
                                { label: 'High', value: 10, emoji: '⚡' },
                              ].map(option => (
                                <Button
                                  key={option.value}
                                  variant={
                                    energy[0] === option.value
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='lg'
                                  onClick={() => setEnergy([option.value])}
                                  className='h-16 text-lg font-semibold flex flex-col gap-2'
                                  role='radio'
                                  aria-checked={energy[0] === option.value}
                                  aria-label={`Energy level: ${option.label}`}
                                >
                                  <span
                                    className='text-2xl'
                                    role='img'
                                    aria-label={option.label}
                                  >
                                    {option.emoji}
                                  </span>
                                  {option.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </fieldset>

                        <fieldset>
                          <legend className='text-base font-semibold mb-4 text-foreground'>
                            Sleep Hours
                          </legend>
                          {useNativeInputs ? (
                            <div className='space-y-4'>
                              <div className='flex items-center gap-4'>
                                <label
                                  htmlFor='sleep-native'
                                  className='text-base font-medium flex-shrink-0'
                                >
                                  Hours slept:
                                </label>
                                <div className='flex-1 relative'>
                                  <input
                                    id='sleep-native'
                                    type='number'
                                    inputMode='numeric'
                                    pattern='[0-9]*'
                                    min='4'
                                    max='12'
                                    step='0.5'
                                    value={sleepHours}
                                    onChange={e =>
                                      setSleepHours(
                                        Number.parseFloat(e.target.value) || 8
                                      )
                                    }
                                    className='w-full h-14 text-2xl font-bold text-center border-2 border-border rounded-lg bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                                    placeholder='8'
                                  />
                                  <div className='absolute right-3 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground'>
                                    hrs
                                  </div>
                                </div>
                              </div>
                              <div className='flex justify-center gap-2'>
                                {[6, 7, 8, 9].map(hours => (
                                  <Button
                                    key={hours}
                                    variant='outline'
                                    size='sm'
                                    onClick={() => setSleepHours(hours)}
                                    className='text-sm'
                                  >
                                    {hours}h
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div
                              className='grid grid-cols-3 gap-4'
                              role='radiogroup'
                            >
                              {[
                                { label: 'Not Great', value: 6, emoji: '😴' },
                                { label: 'Good', value: 8, emoji: '😊' },
                                { label: 'Amazing', value: 9, emoji: '🌟' },
                              ].map(option => (
                                <Button
                                  key={option.value}
                                  variant={
                                    sleepHours === option.value
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='lg'
                                  onClick={() => setSleepHours(option.value)}
                                  className='h-16 text-lg font-semibold flex flex-col gap-2'
                                  role='radio'
                                  aria-checked={sleepHours === option.value}
                                  aria-label={`Sleep quality: ${option.label}`}
                                >
                                  <span
                                    className='text-2xl'
                                    role='img'
                                    aria-label={option.label}
                                  >
                                    {option.emoji}
                                  </span>
                                  {option.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </fieldset>
                      </div>
                    ) : (
                      <div>
                        <div className='flex justify-between items-center mb-6'>
                          <label
                            htmlFor='energy-slider'
                            className='text-base font-semibold text-foreground'
                          >
                            Energy Level
                          </label>
                          <div className='flex items-center gap-3'>
                            <Badge
                              variant='secondary'
                              className='text-xl font-bold px-4 py-2 min-w-[60px]'
                              aria-label={`Energy level: ${energy[0]} out of 10`}
                            >
                              {energy[0]}/10
                            </Badge>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                setUseNativeInputs(!useNativeInputs)
                              }
                              className='text-xs'
                              title={
                                useNativeInputs
                                  ? 'Use custom slider'
                                  : 'Use native input'
                              }
                            >
                              {useNativeInputs ? '📱' : '🎛️'}
                            </Button>
                          </div>
                        </div>
                        <div className='px-4'>
                          {useNativeInputs ? (
                            <input
                              id='energy-slider'
                              type='range'
                              min='1'
                              max='10'
                              step='1'
                              value={energy[0]}
                              onChange={e =>
                                setEnergy([Number.parseInt(e.target.value)])
                              }
                              className='w-full h-8 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                              style={{
                                background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((energy[0] - 1) / 9) * 100}%, #e5e7eb ${((energy[0] - 1) / 9) * 100}%, #e5e7eb 100%)`,
                              }}
                            />
                          ) : (
                            <Slider
                              id='energy-slider'
                              value={energy}
                              onValueChange={setEnergy}
                              max={10}
                              min={1}
                              step={1}
                              className='w-full h-12 [&_[role=slider]]:bg-white [&_[role=slider]]:border-4 [&_[role=slider]]:border-primary [&_[role=slider]]:h-10 [&_[role=slider]]:w-10 [&_[role=slider]]:shadow-xl [&_[role=slider]]:cursor-pointer [&_.slider-track]:bg-gray-300 [&_.slider-track]:h-6 [&_.slider-range]:bg-primary [&_.slider-range]:h-6 [&_.slider-range]:rounded-full'
                              aria-label='Energy level from 1 to 10'
                            />
                          )}
                        </div>
                        <div className='flex justify-between text-base font-medium text-muted-foreground mt-4 px-4'>
                          <span>
                            <span role='img' aria-label='Tired'>
                              😴
                            </span>{' '}
                            Low Energy
                          </span>
                          <span>
                            <span role='img' aria-label='Energetic'>
                              ⚡
                            </span>{' '}
                            High Energy
                          </span>
                        </div>
                      </div>
                    )}

                    {simpleMode ? null : (
                      <fieldset>
                        <legend className='text-base font-semibold mb-4 text-foreground'>
                          Hours of sleep last night
                        </legend>
                        {useNativeInputs ? (
                          <div className='space-y-4'>
                            <div className='flex items-center justify-center gap-4'>
                              <input
                                type='number'
                                inputMode='numeric'
                                pattern='[0-9]*'
                                min='4'
                                max='12'
                                step='0.5'
                                value={sleepHours}
                                onChange={e =>
                                  setSleepHours(
                                    Number.parseFloat(e.target.value) || 8
                                  )
                                }
                                className='w-24 h-16 text-3xl font-bold text-center border-2 border-border rounded-lg bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                                placeholder='8'
                              />
                              <span className='text-xl font-medium text-muted-foreground'>
                                hours
                              </span>
                            </div>
                            <div className='grid grid-cols-5 gap-3'>
                              {sleepPresets.map(hours => (
                                <Button
                                  key={hours}
                                  variant={
                                    sleepHours === hours ? 'default' : 'outline'
                                  }
                                  size='sm'
                                  onClick={() => setSleepHours(hours)}
                                  className='h-12 text-base font-semibold'
                                >
                                  {hours}h
                                </Button>
                              ))}
                              <Button
                                variant={sleepHours > 9 ? 'default' : 'outline'}
                                size='sm'
                                onClick={() => setSleepHours(10)}
                                className='h-12 text-base font-semibold'
                              >
                                9h+
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className='grid grid-cols-5 gap-3'
                            role='radiogroup'
                          >
                            {sleepPresets.map(hours => (
                              <Button
                                key={hours}
                                variant={
                                  sleepHours === hours ? 'default' : 'outline'
                                }
                                size='lg'
                                onClick={() => setSleepHours(hours)}
                                className='h-14 text-base font-semibold transition-all duration-200 hover:scale-105'
                                role='radio'
                                aria-checked={sleepHours === hours}
                                aria-label={`${hours} hours of sleep`}
                              >
                                {hours}h
                              </Button>
                            ))}
                            <Button
                              variant={sleepHours > 9 ? 'default' : 'outline'}
                              size='lg'
                              onClick={() => setSleepHours(10)}
                              className='h-14 text-base font-semibold transition-all duration-200 hover:scale-105'
                              role='radio'
                              aria-checked={sleepHours > 9}
                              aria-label='9 or more hours of sleep'
                            >
                              9h+
                            </Button>
                          </div>
                        )}
                      </fieldset>
                    )}

                    {simpleMode ? null : (
                      <div>
                        <div className='flex justify-between items-center mb-6'>
                          <label
                            htmlFor='soreness-slider'
                            className='text-base font-semibold text-foreground'
                          >
                            Muscle Soreness
                          </label>
                          <Badge
                            variant='secondary'
                            className='text-xl font-bold px-4 py-2 min-w-[60px]'
                            aria-label={`Muscle soreness level: ${muscleSoreness[0]} out of 5`}
                          >
                            {muscleSoreness[0]}/5
                          </Badge>
                        </div>
                        <div className='px-4'>
                          {useNativeInputs ? (
                            <input
                              id='soreness-slider'
                              type='range'
                              min='1'
                              max='5'
                              step='1'
                              value={muscleSoreness[0]}
                              onChange={e =>
                                setMuscleSoreness([
                                  Number.parseInt(e.target.value),
                                ])
                              }
                              className='w-full h-8 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                              style={{
                                background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((muscleSoreness[0] - 1) / 4) * 100}%, #e5e7eb ${((muscleSoreness[0] - 1) / 4) * 100}%, #e5e7eb 100%)`,
                              }}
                            />
                          ) : (
                            <Slider
                              id='soreness-slider'
                              value={muscleSoreness}
                              onValueChange={setMuscleSoreness}
                              max={5}
                              min={1}
                              step={1}
                              className='w-full h-12 [&_[role=slider]]:bg-white [&_[role=slider]]:border-4 [&_[role=slider]]:border-primary [&_[role=slider]]:h-10 [&_[role=slider]]:w-10 [&_[role=slider]]:shadow-xl [&_[role=slider]]:cursor-pointer [&_.slider-track]:bg-gray-300 [&_.slider-track]:h-6 [&_.slider-range]:bg-primary [&_.slider-range]:h-6 [&_.slider-range]:rounded-full'
                              aria-label='Muscle soreness level from 1 to 5'
                            />
                          )}
                        </div>
                        <div className='flex justify-between text-base font-medium text-muted-foreground mt-4 px-4'>
                          <span>
                            <span role='img' aria-label='Happy'>
                              😊
                            </span>{' '}
                            No Soreness
                          </span>
                          <span>
                            <span role='img' aria-label='Painful'>
                              😣
                            </span>{' '}
                            Very Sore
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleCheckInSubmit}
                      disabled={checkInCompleted}
                      className='w-full h-16 text-lg font-semibold transition-all duration-200 hover:scale-102 shadow-lg'
                      size='lg'
                      aria-describedby={
                        checkInCompleted ? 'checkin-complete' : 'checkin-submit'
                      }
                    >
                      {checkInCompleted ? (
                        <>
                          <Check />{' '}
                          <span id='checkin-complete'>
                            Check-in Complete! 🎉
                          </span>
                        </>
                      ) : (
                        <span id='checkin-submit'>Complete Check-in</span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </section>

              <section aria-labelledby='training-title'>
                <ThemedSessionCard
                  sessionType='strength'
                  title='Ready to train?'
                  description='Next up: Lower-Body Strength Training - Build power and muscle with progressive resistance training'
                  duration='45-60 min'
                  difficulty='intermediate'
                  isCompleted={false}
                  isLocked={false}
                  onStart={() => handleStartSession('lower-body-strength')}
                  onViewDetails={() => console.log('View session details')}
                  className='h-64'
                />
              </section>

              {!simpleMode && (
                <section aria-labelledby='progress-title'>
                  <Card className='border-2 border-primary/20 shadow-sm'>
                    <CardHeader className='pb-4'>
                      <div className='flex justify-between items-center'>
                        <CardTitle
                          id='progress-title'
                          className='flex items-center gap-3 text-lg font-semibold'
                        >
                          <TrendingUp />
                          Quick Progress
                        </CardTitle>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() =>
                            setShowAdvancedProgress(!showAdvancedProgress)
                          }
                          className='flex items-center gap-2'
                          aria-expanded={showAdvancedProgress}
                          aria-controls='progress-details'
                          aria-label={
                            showAdvancedProgress
                              ? 'Show less progress details'
                              : 'Show more progress details'
                          }
                        >
                          {showAdvancedProgress ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                          {showAdvancedProgress ? 'Less' : 'More'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div id='progress-details' className='space-y-6'>
                        {progressMetrics
                          .slice(0, showAdvancedProgress ? 4 : 2)
                          .map((metric, index) => (
                            <div key={index} className='space-y-4'>
                              <div className='flex justify-between items-center'>
                                <span className='font-semibold text-foreground text-base'>
                                  {metric.name}
                                </span>
                                <Badge
                                  variant='outline'
                                  className='text-base font-bold px-3 py-1'
                                  aria-label={`Current: ${metric.current} ${metric.unit}`}
                                >
                                  {metric.current} {metric.unit}
                                </Badge>
                              </div>
                              <Progress
                                value={metric.progress}
                                className='h-4'
                                aria-label={`${metric.name} progress: ${metric.progress}% complete`}
                              />
                              <p className='text-base text-muted-foreground'>
                                {metric.progress}% to goal
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}

              {!simpleMode && (
                <section aria-labelledby='badges-title'>
                  <Card className='border-2 border-primary/20 shadow-sm'>
                    <CardHeader className='pb-4'>
                      <div className='flex justify-between items-center'>
                        <CardTitle
                          id='badges-title'
                          className='flex items-center gap-3 text-lg font-semibold'
                        >
                          <Award />
                          Recent Badges
                        </CardTitle>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setShowAllBadges(!showAllBadges)}
                          className='flex items-center gap-2'
                          aria-expanded={showAllBadges}
                          aria-controls='badges-list'
                          aria-label={
                            showAllBadges
                              ? 'Show fewer badges'
                              : 'Show all badges'
                          }
                        >
                          {showAllBadges ? <ChevronUp /> : <ChevronDown />}
                          {showAllBadges ? 'Less' : 'All'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div id='badges-list' className='grid grid-cols-2 gap-4'>
                        {badges
                          .slice(0, showAllBadges ? 4 : 2)
                          .map((badge, index) => (
                            <div
                              key={index}
                              className='flex items-center gap-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all duration-200 min-h-[80px]'
                              role='listitem'
                            >
                              <div
                                className={`p-4 rounded-full text-2xl transition-all duration-200 ${
                                  badge.earned
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                                aria-label={`${badge.name} badge ${badge.earned ? 'earned' : 'in progress'}`}
                              >
                                <badge.icon />
                              </div>
                              <div>
                                <p className='font-semibold text-base'>
                                  {badge.name}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                  {badge.earned ? 'Earned!' : 'In Progress'}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}
            </TabsContent>

            <TabsContent value='session' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Today's Sessions</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='p-4 rounded-lg bg-rose-500 text-white'>
                    <h3 className='font-semibold mb-2'>Morning Session</h3>
                    <p>Lower-Body Strength</p>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='mt-3'
                      onClick={() => handleStartSession('lower-body-strength')}
                    >
                      <Play /> Start Session
                    </Button>
                  </div>
                  <div className='p-4 rounded-lg bg-blue-500 text-white'>
                    <h3 className='font-semibold mb-2'>Afternoon Session</h3>
                    <p>Agility + Jump Development</p>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='mt-3'
                      onClick={() => handleStartSession('agility-jump')}
                    >
                      <Play /> Start Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='progress' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {progressMetrics.map((metric, index) => (
                    <div key={index} className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <span className='font-semibold'>{metric.name}</span>
                        <Badge variant='secondary'>
                          {metric.current} / {metric.target} {metric.unit}
                        </Badge>
                      </div>
                      <Progress value={metric.progress} className='h-3' />
                      <p className='text-sm text-muted-foreground'>
                        {metric.progress}% to goal
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <RealTimeAchievements />
            </TabsContent>

            <TabsContent value='profile' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Athlete Profile</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='text-center'>
                    <div className='w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4'>
                      AT
                    </div>
                    <h3 className='text-xl font-semibold'>Athlete Teen</h3>
                    <p className='text-muted-foreground'>
                      Age: 12 • Program Week: 6/11
                    </p>
                  </div>
                  <div className='grid grid-cols-2 gap-4 pt-4'>
                    <div className='text-center p-4 bg-muted rounded-lg'>
                      <p className='text-2xl font-bold text-primary'>42</p>
                      <p className='text-sm text-muted-foreground'>
                        Sessions Completed
                      </p>
                    </div>
                    <div className='text-center p-4 bg-muted rounded-lg'>
                      <p className='text-2xl font-bold text-primary'>8</p>
                      <p className='text-sm text-muted-foreground'>
                        Current Streak
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='smart' className='space-y-6'>
              <div className='grid gap-6 md:grid-cols-2'>
                <WeekCalculationDisplay />
                <SmartSchedulingDisplay />
              </div>
            </TabsContent>

            <TabsContent value='ai' className='space-y-6'>
              <AIIntelligenceDisplay
                sessions={[]}
                checkIns={[]}
                progressMetrics={[]}
                currentPhase='build'
                availableEquipment={[
                  'bodyweight',
                  'barbell',
                  'weights',
                  'bench',
                ]}
              />
            </TabsContent>

            <TabsContent value='coaching' className='space-y-6'>
              <LLMIntegrationDisplay
                sessions={[]}
                checkIns={[]}
                progressMetrics={[]}
                behaviorInsights={null}
                performanceForecast={null}
                userId='default-user'
                currentPhase='build'
              />
            </TabsContent>

            <TabsContent value='themes' className='space-y-6'>
              <SessionTypeShowcase
                onSessionSelect={sessionType => {
                  console.log('Selected session type:', sessionType);
                }}
              />
            </TabsContent>

            <TabsContent value='achievements' className='space-y-6'>
              <GamificationDashboard sessions={[]} checkIns={[]} />
            </TabsContent>

            <TabsContent value='interactive' className='space-y-6'>
              <ThemeProvider>
                <div className='space-y-8'>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                      Interactive UI Enhancements
                    </h2>
                    <p className='text-gray-600'>
                      Experience dynamic theming, micro-interactions, and
                      immersive feedback
                    </p>
                  </div>

                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                        Theme Customization
                      </h3>
                      <ThemeSelector showPreview={true} />
                    </div>

                    <div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                        Micro-Interactions
                      </h3>
                      <MicroInteractionDemo />
                    </div>
                  </div>

                  <div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                      Immersive Feedback
                    </h3>
                    <ImmersiveFeedbackDemo />
                  </div>
                </div>
              </ThemeProvider>
            </TabsContent>

            <TabsContent value='personalization' className='space-y-6'>
              <PersonalizationDashboard
                userId={currentUser?.id || 'default-user'}
              />
            </TabsContent>

            <TabsContent value='wellness' className='space-y-6'>
              <WellnessIntelligenceDisplay
                sessions={[]}
                checkIns={[]}
                moodData={[]}
                sleepData={[]}
                energyData={[]}
                recoveryData={[]}
                availableExercises={[]}
                userGoals={[]}
                userId='default-user'
              />
            </TabsContent>
          </Tabs>
        </div>
      </AdaptiveInterface>
    </PersonalizationProvider>
  );
}
