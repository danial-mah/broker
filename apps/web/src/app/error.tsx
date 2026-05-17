'use client';

import { Button } from '@/components/ui/button';

export default function ErrorBoundary({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">Something went sideways.</h1>
        <p className="mt-2 text-muted">The app caught the error boundary and can retry safely.</p>
        <Button className="mt-6" onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
