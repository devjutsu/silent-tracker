'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/auth';
import CaloryTracker from '@/features/calory/CaloryTracker';

export default function CaloryPage() {
  const router = useRouter();
  const { user, loading: authLoading, error: authError } = useAuthStore();

  useEffect(() => {
    if (!authLoading && (!user || authError)) {
      router.push('/');
    }
  }, [user, authLoading, authError, router]);

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
        <CaloryTracker />
      </div>
    </div>
  );
} 