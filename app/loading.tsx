import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 mx-auto">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 animate-ping"></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-primary">Loading...</p>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your content
          </p>
        </div>
      </div>
    </div>
  );
}
