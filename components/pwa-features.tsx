'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, WifiOff, Smartphone, Bell, CheckCircle } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <Alert className='border-primary bg-primary/5'>
      <Smartphone className='h-4 w-4' />
      <AlertDescription>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-medium'>Install Teen Training App</p>
            <p className='text-sm text-muted-foreground'>
              Get quick access and offline features
            </p>
          </div>
          <Button size='sm' onClick={handleInstall}>
            <Download className='h-4 w-4 mr-2' />
            Install
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <Alert className='border-yellow-200 bg-yellow-50'>
      <WifiOff className='h-4 w-4 text-yellow-600' />
      <AlertDescription className='text-yellow-800'>
        You're offline. Some features may be limited, but you can still complete
        workouts!
      </AlertDescription>
    </Alert>
  );
}

export function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      setNotificationsEnabled(permission === 'granted');

      if (permission === 'granted') {
        new Notification('Teen Training', {
          body: "Notifications enabled! We'll remind you about workouts.",
          icon: '/icon-192.png',
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='h-4 w-4' />
          Workout Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-medium'>Push Notifications</p>
            <p className='text-sm text-muted-foreground'>
              Get reminders for workouts and check-ins
            </p>
          </div>
          {notificationsEnabled ? (
            <Badge className='bg-green-100 text-green-800'>
              <CheckCircle className='h-3 w-3 mr-1' />
              Enabled
            </Badge>
          ) : (
            <Button size='sm' onClick={requestNotificationPermission}>
              Enable
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed (running in standalone mode)
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;

    setIsInstalled(isStandalone || isIOSStandalone);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Installation Status</span>
            <Badge variant={isInstalled ? 'default' : 'secondary'}>
              {isInstalled ? 'Installed' : 'Browser'}
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Offline Support</span>
            <Badge className='bg-green-100 text-green-800'>
              <CheckCircle className='h-3 w-3 mr-1' />
              Available
            </Badge>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Data Sync</span>
            <Badge className='bg-blue-100 text-blue-800'>Local Storage</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
