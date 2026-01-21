'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry, LogRocket, etc.
      // reportError({ error, errorInfo });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. Our team has been notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV !== 'production' && this.state.error && (
                <div className="rounded-lg bg-slate-100 p-3 text-xs">
                  <div className="flex items-center gap-2 mb-2 text-slate-600">
                    <Bug className="h-3.5 w-3.5" />
                    <span className="font-medium">Debug Info</span>
                  </div>
                  <p className="font-mono text-red-600 break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="mt-2 text-slate-500 overflow-auto max-h-24 text-[10px]">
                      {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                    </pre>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={this.handleReset}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Link href="/dashboard">
                  <Button className="gap-2 bg-kwooka-ochre hover:bg-kwooka-ochre/90">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Inline error fallback for smaller components
 */
export function InlineErrorFallback({ 
  error, 
  onRetry 
}: { 
  error?: Error; 
  onRetry?: () => void 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center border border-red-200 rounded-lg bg-red-50">
      <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm text-red-700 mb-3">
        {error?.message || 'Something went wrong'}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      )}
    </div>
  );
}

/**
 * Hook for using error boundary reset
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  
  const resetError = React.useCallback(() => {
    setError(null);
  }, []);
  
  const handleError = React.useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error(String(err)));
    }
  }, []);
  
  // Throw error to be caught by nearest ErrorBoundary
  if (error) {
    throw error;
  }
  
  return { handleError, resetError };
}
