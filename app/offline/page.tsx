'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [pendingData, setPendingData] = useState({
    sessions: 0,
    checkins: 0,
    progress: 0,
  });

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Check initial status
    updateOnlineStatus();

    // Load pending data count
    loadPendingDataCount();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const loadPendingDataCount = async () => {
    try {
      // This would typically load from IndexedDB
      // For now, we'll simulate the data
      setPendingData({
        sessions: 2,
        checkins: 1,
        progress: 3,
      });
    } catch (error) {
      console.error('Error loading pending data count:', error);
    }
  };

  const handleRetry = () => {
    if (isOnline) {
      // Trigger background sync
      if (
        'serviceWorker' in navigator &&
        'sync' in window.ServiceWorkerRegistration.prototype
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('session-sync');
          registration.sync.register('checkin-sync');
          registration.sync.register('progress-sync');
        });
      }

      // Reload the page
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center'>
            <WifiOff className='w-8 h-8 text-orange-600' />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            You're Offline
          </CardTitle>
          <CardDescription className='text-gray-600'>
            {isOnline
              ? 'Connection restored! Your data will sync automatically.'
              : 'No internet connection detected. Your data is being saved locally.'}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Connection Status */}
          <div className='flex items-center justify-center space-x-2'>
            {isOnline ? (
              <>
                <CheckCircle className='w-5 h-5 text-green-600' />
                <span className='text-green-600 font-medium'>Online</span>
              </>
            ) : (
              <>
                <AlertCircle className='w-5 h-5 text-orange-600' />
                <span className='text-orange-600 font-medium'>Offline</span>
              </>
            )}
          </div>

          {/* Pending Data */}
          {(pendingData.sessions > 0 ||
            pendingData.checkins > 0 ||
            pendingData.progress > 0) && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h3 className='font-medium text-blue-900 mb-2'>Pending Data</h3>
              <div className='space-y-1 text-sm text-blue-700'>
                {pendingData.sessions > 0 && (
                  <div>
                    • {pendingData.sessions} workout session
                    {pendingData.sessions !== 1 ? 's' : ''}
                  </div>
                )}
                {pendingData.checkins > 0 && (
                  <div>
                    • {pendingData.checkins} daily check-in
                    {pendingData.checkins !== 1 ? 's' : ''}
                  </div>
                )}
                {pendingData.progress > 0 && (
                  <div>
                    • {pendingData.progress} progress update
                    {pendingData.progress !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <p className='text-xs text-blue-600 mt-2'>
                This data will sync automatically when you're back online.
              </p>
            </div>
          )}

          {/* Features Available Offline */}
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
            <h3 className='font-medium text-gray-900 mb-2'>
              Available Offline
            </h3>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>• View exercise library</li>
              <li>• Start workout sessions</li>
              <li>• Log daily check-ins</li>
              <li>• Track progress</li>
              <li>• View previous data</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col space-y-3'>
            {isOnline ? (
              <Button onClick={handleRetry} className='w-full'>
                <RefreshCw className='w-4 h-4 mr-2' />
                Sync Data & Continue
              </Button>
            ) : (
              <Button
                onClick={handleGoHome}
                variant='outline'
                className='w-full'
              >
                Continue Offline
              </Button>
            )}

            <Button
              onClick={handleRetry}
              variant='outline'
              className='w-full'
              disabled={!isOnline}
            >
              <RefreshCw className='w-4 h-4 mr-2' />
              Retry Connection
            </Button>
          </div>

          {/* Help Text */}
          <div className='text-center'>
            <p className='text-xs text-gray-500'>
              Don't worry! Your progress is being saved locally and will sync
              when you're back online.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
