'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-4">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        {/* 404 Illustration */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-primary/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-24 w-24 text-muted-foreground animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-6">
          <Link
            href="/en"
            className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-8 text-sm text-muted-foreground">
          <p>
            Need help?{' '}
            <a
              href="mailto:onemillionvolunteer@nysc.lk"
              className="text-primary hover:underline font-medium"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
