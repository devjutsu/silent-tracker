'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/auth';
import CaloryTracker from '@/features/calory/CaloryTracker';
import HydrationWidget from '@/features/hydration/HydrationWidget';
import FitWidget from '@/features/fit/FitWidget';
import { useFeatureFlags } from '@/features/settings/featureFlags';

export default function FitPage() {
  const router = useRouter();
  const { user, loading: authLoading, error: authError } = useAuthStore();
  const { isKeepFitEnabled } = useFeatureFlags();

  useEffect(() => {
    if (!isKeepFitEnabled) {
      router.push('/');
    }

    if (!authLoading && (!user || authError)) {
      router.push('/');
    }
  }, [user, authLoading, authError, router, isKeepFitEnabled]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          <CaloryTracker />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HydrationWidget />
            <FitWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
