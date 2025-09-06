'use client';

import { useState, useEffect } from 'react';
import { useDatabase } from '@/lib/hooks/use-database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trophy, Target, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function RealTimeNotifications() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useDatabase();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className='w-4 h-4 text-yellow-500' />;
      case 'progress':
        return <Target className='w-4 h-4 text-blue-500' />;
      case 'reminder':
        return <Bell className='w-4 h-4 text-orange-500' />;
      case 'system':
        return <Zap className='w-4 h-4 text-purple-500' />;
      default:
        return <Bell className='w-4 h-4 text-gray-500' />;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Show toast for new notifications
  useEffect(() => {
    const latestNotification = notifications[0];
    if (latestNotification && !latestNotification.read) {
      toast.success(latestNotification.title, {
        description: latestNotification.message,
        duration: 5000,
      });
    }
  }, [notifications]);

  return (
    <div className='relative'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className='relative'
      >
        <Bell className='w-4 h-4' />
        {unreadCount > 0 && (
          <Badge
            variant='destructive'
            className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs'
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className='absolute right-0 top-12 w-80 z-50 shadow-lg'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleMarkAllAsRead}
                  className='text-xs'
                >
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {notifications.length === 0 ? (
              <div className='p-4 text-center text-muted-foreground'>
                No notifications yet
              </div>
            ) : (
              <div className='max-h-96 overflow-y-auto'>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0 mt-1'>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='flex-1'>
                            <h4 className='font-medium text-sm'>
                              {notification.title}
                            </h4>
                            <p className='text-xs text-muted-foreground mt-1'>
                              {notification.message}
                            </p>
                            <p className='text-xs text-muted-foreground mt-1'>
                              {new Date(
                                notification.created_at || ''
                              ).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                handleMarkAsRead(notification.id || '')
                              }
                              className='h-6 w-6 p-0'
                            >
                              <Check className='w-3 h-3' />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
