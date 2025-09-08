'use client';

import {
  PhotoVideoCapture,
  SocialSharing,
  CalendarIntegration,
  DataExport,
} from '@/components/integration-interfaces';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Trophy } from 'lucide-react';
import {
  HierarchicalNavigation,
  MobileBottomNavigation,
} from '@/components/navigation/hierarchical-navigation';
import { useResponsiveNavigation } from '@/hooks/use-responsive-navigation';

export default function ProfilePage() {
  const { isMobile, currentTab, handleTabChange } = useResponsiveNavigation();

  return (
    <div className='min-h-screen bg-background p-4 pb-20'>
      {/* Navigation */}
      {isMobile ? (
        <MobileBottomNavigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      ) : (
        <HierarchicalNavigation
          currentTab={currentTab}
          onTabChange={handleTabChange}
          className='mb-6'
        />
      )}
      
      <div className='container mx-auto space-y-6'>
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold'>My Profile</h1>
        <p className='text-muted-foreground'>
          Track progress and manage your training data
        </p>
      </div>

      {/* User Stats */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            Training Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-primary'>24</p>
              <p className='text-sm text-muted-foreground'>
                Sessions Completed
              </p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-primary'>4</p>
              <p className='text-sm text-muted-foreground'>Weeks Active</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-primary'>8</p>
              <p className='text-sm text-muted-foreground'>Badges Earned</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-primary'>12</p>
              <p className='text-sm text-muted-foreground'>Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Components */}
      <div className='grid md:grid-cols-2 gap-6'>
        <PhotoVideoCapture />
        <SocialSharing />
        <CalendarIntegration />
        <DataExport />
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Trophy className='h-5 w-5' />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            <Badge variant='secondary'>First Week Complete</Badge>
            <Badge variant='secondary'>Strength Gains</Badge>
            <Badge variant='secondary'>Perfect Attendance</Badge>
            <Badge variant='secondary'>Jump Improvement</Badge>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
