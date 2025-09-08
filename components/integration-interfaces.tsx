'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Video, Share2, Calendar, Download } from 'lucide-react';

export function PhotoVideoCapture() {
  const [capturedMedia, setCapturedMedia] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = () => {
    fileInputRef.current?.click();
  };

  const handleVideoCapture = () => {
    videoInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'photo' | 'video'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedMedia(prev => [...prev, url]);
      console.log(`[v0] Captured ${type}:`, file.name);
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Camera className='h-5 w-5' />
          Progress Documentation
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <Button
            onClick={handlePhotoCapture}
            variant='outline'
            className='flex items-center gap-2 bg-transparent'
          >
            <Camera className='h-4 w-4' />
            Take Photo
          </Button>
          <Button
            onClick={handleVideoCapture}
            variant='outline'
            className='flex items-center gap-2 bg-transparent'
          >
            <Video className='h-4 w-4' />
            Record Video
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          capture='environment'
          onChange={e => handleFileChange(e, 'photo')}
          className='hidden'
        />
        <input
          ref={videoInputRef}
          type='file'
          accept='video/*'
          capture='environment'
          onChange={e => handleFileChange(e, 'video')}
          className='hidden'
        />

        {capturedMedia.length > 0 && (
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>Recent captures:</p>
            <div className='grid grid-cols-3 gap-2'>
              {capturedMedia.map((url, index) => (
                <div
                  key={index}
                  className='aspect-square bg-muted rounded-lg overflow-hidden'
                >
                  <Image
                    src={url || '/placeholder.svg'}
                    alt={`Capture ${index + 1}`}
                    width={200}
                    height={200}
                    className='w-full h-full object-cover'
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SocialSharing() {
  const [achievements] = useState([
    {
      id: 1,
      title: 'First Week Complete!',
      description: 'Completed 6 training sessions',
      icon: '🎯',
    },
    {
      id: 2,
      title: 'Strength Gains',
      description: 'Increased squat weight by 10lbs',
      icon: '💪',
    },
    {
      id: 3,
      title: 'Perfect Attendance',
      description: 'No missed sessions this week',
      icon: '⭐',
    },
  ]);

  const shareAchievement = (achievement: any) => {
    const shareData = {
      title: `Teen Training Program - ${achievement.title}`,
      text: achievement.description,
      url: window.location.origin,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(text);
      console.log('[v0] Achievement copied to clipboard');
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Share2 className='h-5 w-5' />
          Share Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className='flex items-center justify-between p-3 bg-muted rounded-lg'
          >
            <div className='flex items-center gap-3'>
              <span className='text-2xl'>{achievement.icon}</span>
              <div>
                <p className='font-medium'>{achievement.title}</p>
                <p className='text-sm text-muted-foreground'>
                  {achievement.description}
                </p>
              </div>
            </div>
            <Button
              size='sm'
              variant='outline'
              onClick={() => shareAchievement(achievement)}
            >
              <Share2 className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function CalendarIntegration() {
  const [upcomingSessions] = useState([
    {
      date: '2024-01-15',
      time: '07:00',
      type: 'Lower Body Strength',
      duration: '45 min',
    },
    {
      date: '2024-01-15',
      time: '16:00',
      type: 'Volleyball Skills',
      duration: '60 min',
    },
    {
      date: '2024-01-16',
      time: '07:00',
      type: 'Upper Body Strength',
      duration: '45 min',
    },
  ]);

  const addToCalendar = (session: any) => {
    const startDate = new Date(`${session.date}T${session.time}:00`);
    const endDate = new Date(
      startDate.getTime() + Number.parseInt(session.duration) * 60000
    );

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(session.type)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent('Teen Training Program Session')}`;

    window.open(calendarUrl, '_blank');
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5' />
          Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {upcomingSessions.map((session, index) => (
          <div
            key={index}
            className='flex items-center justify-between p-3 border rounded-lg'
          >
            <div>
              <p className='font-medium'>{session.type}</p>
              <p className='text-sm text-muted-foreground'>
                {new Date(session.date).toLocaleDateString()} at {session.time}{' '}
                • {session.duration}
              </p>
            </div>
            <Button
              size='sm'
              variant='outline'
              onClick={() => addToCalendar(session)}
            >
              <Calendar className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DataExport() {
  const [exportOptions] = useState([
    {
      type: 'progress',
      label: 'Progress Report',
      description: 'Weekly progress summary for coaches/parents',
    },
    {
      type: 'sessions',
      label: 'Session Data',
      description: 'Complete workout logs and performance metrics',
    },
    {
      type: 'wellness',
      label: 'Wellness Tracking',
      description: 'Daily check-ins and recovery data',
    },
    {
      type: 'achievements',
      label: 'Achievements',
      description: 'Badges, milestones, and accomplishments',
    },
  ]);

  const exportData = (type: string) => {
    const mockData = {
      progress: {
        weeks: 4,
        sessions: 24,
        avgRPE: 6.8,
        improvements: ['Squat +15lbs', 'Jump +2in'],
      },
      sessions: {
        totalSessions: 24,
        avgDuration: '47min',
        topExercises: ['Goblet Squat', 'Push-ups'],
      },
      wellness: { avgMood: 4.2, avgEnergy: 7.8, avgSleep: 8.1, streakDays: 12 },
      achievements: { badges: 8, milestones: 3, weeklyGoals: 4 },
    };

    const dataBlob = new Blob(
      [JSON.stringify(mockData[type as keyof typeof mockData], null, 2)],
      {
        type: 'application/json',
      }
    );
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teen-training-${type}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Download className='h-5 w-5' />
          Data Export
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {exportOptions.map(option => (
          <div
            key={option.type}
            className='flex items-center justify-between p-3 border rounded-lg'
          >
            <div>
              <p className='font-medium'>{option.label}</p>
              <p className='text-sm text-muted-foreground'>
                {option.description}
              </p>
            </div>
            <Button
              size='sm'
              variant='outline'
              onClick={() => exportData(option.type)}
            >
              <Download className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
