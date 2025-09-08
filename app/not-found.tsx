'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
            <span className='text-4xl'>404</span>
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            Page Not Found
          </CardTitle>
          <CardDescription className='text-gray-600'>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div className='text-center space-y-2'>
            <p className='text-sm text-gray-500'>
              Don&apos;t worry, it happens to the best of us! Let&apos;s get you
              back on track.
            </p>
          </div>

          <div className='flex flex-col space-y-2'>
            <Button asChild className='w-full'>
              <Link href='/'>
                <Home className='w-4 h-4 mr-2' />
                Go Home
              </Link>
            </Button>

            <Button
              variant='outline'
              onClick={() => window.history.back()}
              className='w-full'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Go Back
            </Button>

            <Button
              variant='ghost'
              onClick={() => window.location.reload()}
              className='w-full'
            >
              <RefreshCw className='w-4 h-4 mr-2' />
              Refresh Page
            </Button>
          </div>

          <div className='text-center pt-4 border-t'>
            <p className='text-xs text-gray-400'>
              If this problem persists, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
