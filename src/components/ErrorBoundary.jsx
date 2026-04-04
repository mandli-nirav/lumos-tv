import { AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging (only in dev)
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='relative flex min-h-screen flex-col items-center justify-center bg-background px-4'>
          <div className='max-w-md space-y-6 text-center'>
            <div className='flex justify-center'>
              <div className='rounded-full bg-destructive/10 p-4'>
                <AlertTriangle className='h-8 w-8 text-destructive' />
              </div>
            </div>
            <div className='space-y-2'>
              <h1 className='text-2xl font-bold text-foreground'>
                Something Went Wrong
              </h1>
              <p className='text-muted-foreground'>
                We encountered an unexpected error. Please try again.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <div className='mt-4 rounded-md bg-muted p-3 text-left'>
                  <p className='text-xs font-mono text-destructive'>
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
            <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
              <Button onClick={this.resetError} variant='default'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Try Again
              </Button>
              <Button variant='outline' onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
