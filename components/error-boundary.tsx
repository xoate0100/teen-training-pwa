'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;

  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Show error toast
    toast.error('Something went wrong. Please try again.', {
      description: error.message,
      duration: 5000,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className='min-h-screen flex items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                <AlertTriangle className='w-6 h-6 text-red-600' />
              </div>
              <CardTitle className='text-xl text-red-600'>
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-muted-foreground text-center'>
                We encountered an unexpected error. Don't worry, your data is
                safe.
              </p>

              {this.props.showDetails && this.state.error && (
                <div className='bg-muted p-3 rounded-lg'>
                  <h4 className='font-medium text-sm mb-2'>Error Details:</h4>
                  <p className='text-xs text-muted-foreground font-mono'>
                    {this.state.error.message}
                  </p>
                  {process.env.NODE_ENV === 'development' &&
                    this.state.errorInfo && (
                      <details className='mt-2'>
                        <summary className='text-xs cursor-pointer'>
                          Stack Trace
                        </summary>
                        <pre className='text-xs text-muted-foreground mt-1 overflow-auto'>
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                </div>
              )}

              <div className='flex gap-2'>
                <Button
                  onClick={this.handleRetry}
                  className='flex-1'
                  variant='default'
                >
                  <RefreshCw className='w-4 h-4 mr-2' />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant='outline'
                  className='flex-1'
                >
                  <Home className='w-4 h-4 mr-2' />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
    console.error('Error captured:', error);
    toast.error('An error occurred', {
      description: error.message,
      duration: 5000,
    });
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

// Higher-order component for error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
