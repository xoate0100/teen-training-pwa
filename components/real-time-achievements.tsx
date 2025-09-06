'use client';

import { useState, useEffect } from 'react';
import { useDatabase } from '@/lib/hooks/use-database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Medal, Crown, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RealTimeAchievements() {
  const { achievements, saveAchievement } = useDatabase();
  const [showAll, setShowAll] = useState(false);

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Zap className='w-5 h-5 text-yellow-500' />;
      case 'strength':
        return <Target className='w-5 h-5 text-red-500' />;
      case 'endurance':
        return <Star className='w-5 h-5 text-blue-500' />;
      case 'milestone':
        return <Medal className='w-5 h-5 text-purple-500' />;
      case 'mastery':
        return <Crown className='w-5 h-5 text-gold-500' />;
      default:
        return <Trophy className='w-5 h-5 text-yellow-500' />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'streak':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'strength':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'endurance':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'milestone':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'mastery':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400 text-yellow-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const recentAchievements = achievements.slice(
    0,
    showAll ? achievements.length : 3
  );
  const unlockedAchievements = achievements.filter(
    a => a.progress >= a.max_progress
  );
  const inProgressAchievements = achievements.filter(
    a => a.progress < a.max_progress
  );

  // Simulate achievement unlocking for demo purposes
  useEffect(() => {
    const simulateAchievement = async () => {
      if (achievements.length === 0) {
        // Create a demo achievement
        await saveAchievement({
          achievement_type: 'streak',
          title: 'First Steps',
          description: 'Complete your first workout session',
          icon: '🏃‍♂️',
          unlocked_at: new Date().toISOString(),
          progress: 1,
          max_progress: 1,
        });
      }
    };

    simulateAchievement();
  }, [achievements.length, saveAchievement]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Achievements</h3>
        <Badge variant='secondary'>
          {unlockedAchievements.length} unlocked
        </Badge>
      </div>

      {recentAchievements.length === 0 ? (
        <Card>
          <CardContent className='p-6 text-center'>
            <Trophy className='w-12 h-12 mx-auto text-muted-foreground mb-2' />
            <p className='text-muted-foreground'>No achievements yet</p>
            <p className='text-sm text-muted-foreground'>
              Complete workouts to unlock achievements!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-3'>
          {recentAchievements.map(achievement => (
            <Card
              key={achievement.id}
              className={`transition-all duration-300 hover:shadow-md ${
                achievement.progress >= achievement.max_progress
                  ? getAchievementColor(achievement.achievement_type)
                  : 'bg-muted/50'
              }`}
            >
              <CardContent className='p-4'>
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0'>
                    {getAchievementIcon(achievement.achievement_type)}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex-1'>
                        <h4 className='font-medium text-sm'>
                          {achievement.title}
                        </h4>
                        <p className='text-xs text-muted-foreground mt-1'>
                          {achievement.description}
                        </p>
                        {achievement.progress < achievement.max_progress && (
                          <div className='mt-2'>
                            <div className='flex items-center justify-between text-xs text-muted-foreground mb-1'>
                              <span>Progress</span>
                              <span>
                                {achievement.progress}/
                                {achievement.max_progress}
                              </span>
                            </div>
                            <Progress
                              value={
                                (achievement.progress /
                                  achievement.max_progress) *
                                100
                              }
                              className='h-2'
                            />
                          </div>
                        )}
                        {achievement.progress >= achievement.max_progress && (
                          <div className='flex items-center gap-1 mt-2'>
                            <Badge variant='default' className='text-xs'>
                              Unlocked
                            </Badge>
                            <span className='text-xs text-muted-foreground'>
                              {new Date(
                                achievement.unlocked_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className='text-2xl'>{achievement.icon}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {achievements.length > 3 && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowAll(!showAll)}
              className='w-full'
            >
              {showAll
                ? 'Show Less'
                : `Show All ${achievements.length} Achievements`}
            </Button>
          )}
        </div>
      )}

      {/* Achievement Stats */}
      <div className='grid grid-cols-2 gap-4 mt-4'>
        <Card>
          <CardContent className='p-4 text-center'>
            <div className='text-2xl font-bold text-green-600'>
              {unlockedAchievements.length}
            </div>
            <div className='text-xs text-muted-foreground'>Unlocked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4 text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {inProgressAchievements.length}
            </div>
            <div className='text-xs text-muted-foreground'>In Progress</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
