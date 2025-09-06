'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Star,
  Zap,
  Target,
} from 'lucide-react';

// Micro-break timer with brain break games
export function MicroBreakTimer({ onComplete }: { onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(60); // 60 second micro-break
  const [isActive, setIsActive] = useState(false);
  const [currentGame, setCurrentGame] = useState(0);

  const brainBreakGames = [
    {
      name: 'Deep Breathing',
      instruction: 'Take 5 deep breaths in and out',
      icon: '🫁',
    },
    {
      name: 'Shoulder Rolls',
      instruction: 'Roll your shoulders 10 times',
      icon: '💪',
    },
    {
      name: 'Eye Circles',
      instruction: 'Look up, down, left, right slowly',
      icon: '👀',
    },
    {
      name: 'Gentle Stretch',
      instruction: 'Reach up high and stretch your sides',
      icon: '🤸',
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setTimeLeft(60);
    setIsActive(false);
    setCurrentGame(prev => (prev + 1) % brainBreakGames.length);
  };

  const game = brainBreakGames[currentGame];

  return (
    <Card className='bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200'>
      <CardHeader className='text-center'>
        <CardTitle className='text-lg font-bold text-blue-700'>
          <span className='text-2xl mr-2'>{game.icon}</span>
          Brain Break Time!
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='text-center'>
          <div className='text-3xl font-bold text-purple-600 mb-2'>
            {timeLeft}s
          </div>
          <Progress value={((60 - timeLeft) / 60) * 100} className='h-3' />
        </div>

        <div className='bg-white p-4 rounded-lg border-2 border-dashed border-blue-300'>
          <h3 className='font-semibold text-blue-700 mb-2'>{game.name}</h3>
          <p className='text-sm text-gray-600'>{game.instruction}</p>
        </div>

        <div className='flex gap-2 justify-center'>
          <Button
            onClick={toggleTimer}
            variant={isActive ? 'destructive' : 'default'}
          >
            {isActive ? (
              <Pause className='w-4 h-4 mr-2' />
            ) : (
              <Play className='w-4 h-4 mr-2' />
            )}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant='outline'>
            <RotateCcw className='w-4 h-4 mr-2' />
            Next Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Choice station selection for drills
export function ChoiceStation({
  onSelect,
}: {
  onSelect: (choice: string) => void;
}) {
  const drillOptions = [
    {
      name: 'Agility Ladder',
      description: 'Quick feet through ladder patterns',
      difficulty: 'Medium',
      time: '3 minutes',
      icon: '🪜',
      color: 'bg-green-100 border-green-300 text-green-700',
    },
    {
      name: 'Cone Weaving',
      description: 'Zigzag through cone course',
      difficulty: 'Easy',
      time: '2 minutes',
      icon: '🔶',
      color: 'bg-blue-100 border-blue-300 text-blue-700',
    },
  ];

  return (
    <Card className='bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300'>
      <CardHeader>
        <CardTitle className='text-center text-orange-700'>
          <Target className='w-6 h-6 inline mr-2' />
          Choose Your Challenge!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {drillOptions.map((drill, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all hover:scale-105 ${drill.color} border-2`}
              onClick={() => onSelect(drill.name)}
            >
              <CardContent className='p-4 text-center'>
                <div className='text-3xl mb-2'>{drill.icon}</div>
                <h3 className='font-bold mb-1'>{drill.name}</h3>
                <p className='text-sm mb-2'>{drill.description}</p>
                <div className='flex justify-between text-xs'>
                  <Badge variant='secondary'>{drill.difficulty}</Badge>
                  <span className='font-medium'>{drill.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Random cue display system
export function RandomCueDisplay() {
  const [currentCue, setCurrentCue] = useState(0);
  const [showCue, setShowCue] = useState(false);

  const motivationalCues = [
    { text: 'Power through your legs!', icon: '⚡', color: 'text-yellow-600' },
    { text: 'Keep your core tight!', icon: '💪', color: 'text-red-600' },
    { text: 'Breathe with the movement!', icon: '🫁', color: 'text-blue-600' },
    { text: 'Focus on form first!', icon: '🎯', color: 'text-green-600' },
    { text: "You've got this!", icon: '🔥', color: 'text-orange-600' },
    {
      text: 'Stay balanced and controlled!',
      icon: '⚖️',
      color: 'text-purple-600',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCue(Math.floor(Math.random() * motivationalCues.length));
      setShowCue(true);
      setTimeout(() => setShowCue(false), 3000); // Show for 3 seconds
    }, 15000); // New cue every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const cue = motivationalCues[currentCue];

  if (!showCue) return null;

  return (
    <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce'>
      <Card className='bg-gradient-to-r from-pink-100 to-rose-100 border-2 border-pink-300 shadow-lg'>
        <CardContent className='p-3 text-center'>
          <div
            className={`text-lg font-bold ${cue.color} flex items-center gap-2`}
          >
            <span className='text-2xl'>{cue.icon}</span>
            {cue.text}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Challenge of the Week component
export function ChallengeOfTheWeek() {
  const [progress, setProgress] = useState(3); // Mock progress: 3/7 days completed

  const weeklyChallenge = {
    title: 'Perfect Push-Up Week',
    description: 'Complete 10 perfect push-ups every day this week',
    reward: 'Push-Up Master Badge',
    daysCompleted: progress,
    totalDays: 7,
    icon: '🏆',
  };

  return (
    <Card className='bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300'>
      <CardHeader>
        <CardTitle className='text-center text-purple-700'>
          <Trophy className='w-6 h-6 inline mr-2' />
          Challenge of the Week
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='text-center'>
          <div className='text-2xl mb-2'>{weeklyChallenge.icon}</div>
          <h3 className='font-bold text-lg text-purple-800'>
            {weeklyChallenge.title}
          </h3>
          <p className='text-sm text-gray-600 mb-3'>
            {weeklyChallenge.description}
          </p>
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>Progress</span>
            <span className='font-semibold'>
              {weeklyChallenge.daysCompleted}/{weeklyChallenge.totalDays} days
            </span>
          </div>
          <Progress
            value={
              (weeklyChallenge.daysCompleted / weeklyChallenge.totalDays) * 100
            }
            className='h-3'
          />
        </div>

        <div className='bg-white p-3 rounded-lg border border-purple-200'>
          <div className='flex items-center gap-2 text-sm'>
            <Star className='w-4 h-4 text-yellow-500' />
            <span className='font-medium'>
              Reward: {weeklyChallenge.reward}
            </span>
          </div>
        </div>

        <Button
          className='w-full bg-purple-600 hover:bg-purple-700'
          onClick={() => setProgress(Math.min(progress + 1, 7))}
        >
          <Zap className='w-4 h-4 mr-2' />
          Mark Today Complete
        </Button>
      </CardContent>
    </Card>
  );
}

// Social leaderboard with encouragement
export function SocialLeaderboard() {
  const leaderboardData = [
    { name: 'Alex', points: 850, streak: 12, avatar: '🦸‍♂️', isUser: false },
    { name: 'You', points: 720, streak: 8, avatar: '⭐', isUser: true },
    { name: 'Sam', points: 680, streak: 6, avatar: '🚀', isUser: false },
    { name: 'Jordan', points: 650, streak: 5, avatar: '🏃‍♀️', isUser: false },
    { name: 'Casey', points: 590, streak: 4, avatar: '💪', isUser: false },
  ];

  const encouragementMessages = [
    "You're so close to 2nd place! 💪",
    'Amazing 8-day streak! Keep it up! 🔥',
    "You've improved 15% this week! 📈",
  ];

  return (
    <Card className='bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300'>
      <CardHeader>
        <CardTitle className='text-center text-green-700'>
          <Trophy className='w-6 h-6 inline mr-2' />
          Training Squad Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          {leaderboardData.map((user, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                user.isUser
                  ? 'bg-yellow-100 border-yellow-300 border-dashed'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className='flex items-center gap-3'>
                <div className='text-2xl'>{user.avatar}</div>
                <div>
                  <div
                    className={`font-semibold ${user.isUser ? 'text-yellow-700' : 'text-gray-700'}`}
                  >
                    #{index + 1} {user.name}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {user.streak} day streak
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <div className='font-bold text-green-600'>{user.points}</div>
                <div className='text-xs text-gray-500'>points</div>
              </div>
            </div>
          ))}
        </div>

        <div className='bg-yellow-100 p-3 rounded-lg border-2 border-yellow-300'>
          <h4 className='font-semibold text-yellow-700 mb-2'>
            🎉 Encouragement Corner
          </h4>
          <div className='space-y-1'>
            {encouragementMessages.map((message, index) => (
              <p key={index} className='text-sm text-yellow-600'>
                • {message}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
