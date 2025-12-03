'use client';

import { useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <div className="h-24 w-24 rounded-full bg-red-200 opacity-75"></div>
            </div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Something Went Wrong
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
          </p>
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 rounded-lg bg-slate-900 p-4 text-left max-w-xl mx-auto">
            <p className="text-sm font-mono text-red-400 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs font-mono text-slate-400">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6">
          <Button
            size="lg"
            onClick={reset}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Link
            href="/en"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="pt-8 text-sm text-muted-foreground">
          <p>
            If this problem persists,{' '}
            <a
              href="mailto:onemillionvolunteer@nysc.lk"
              className="text-primary hover:underline font-medium"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
