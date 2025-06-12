'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/auth';
import { useFlowStore } from '@/features/flow/flow';
import { usePulseStore } from '@/features/pulse/pulse';
import { useNotificationStore } from '@/features/notifications/notifications';
import Login from '@/features/auth/Login';

import TodayFlow from '@/features/flow/TodayFlow';
import ActiveFlow from '@/features/flow/ActiveFlow';
import FlowOps from '@/features/flow/FlowOps';
import PulseOps from '@/features/pulse/PulseOps';
import CaloryWidget from '@/features/calory/CaloryWidget';
import HydrationWidget from '@/features/hydration/HydrationWidget';
import FitWidget from '@/features/fit/FitWidget';
import Header from '@/components/Header';
import ActivityTimeline from '@/features/flow/ActivityTimeline';
import FlowList from '@/features/flow/FlowList';
import PulseHistory from '@/features/pulse/PulseHistory';
import LandingPreview from '@/landing/LandingPreview';

export default function Home() {
  const { user, error: authError } = useAuthStore();
  const { error: trackingError, fetchEntries } = useFlowStore();
  const { error: pulseError, fetchRecords: fetchPulseRecords } =
    usePulseStore();
  const { requestPermission, isEnabled } = useNotificationStore();

  useEffect(() => {
    if (user) {
      fetchEntries();
      fetchPulseRecords();

      // Request notification permission on first visit
      if (!isEnabled) {
        requestPermission();
      }
    }
  }, [user, fetchEntries, fetchPulseRecords, requestPermission, isEnabled]);

  if (!user) {
    return (
      <div className="bg-base-300 min-h-screen">
        <div className="flex justify-center items-center sm:pt-16 p-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={384}
            height={384}
            className="w-48 sm:w-96 h-auto"
            priority
          />
        </div>
        <Login />
        <div className="flex justify-center">
          <LandingPreview />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <div className="container mx-auto p-4">
        <div className="stats shadow w-full overflow-x-auto">
          <TodayFlow />
          <ActiveFlow />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FlowOps />
          <PulseOps />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <CaloryWidget />
          </div>
          <div className="flex flex-col gap-4">
            <HydrationWidget />
            <FitWidget />
          </div>
        </div>

        <ActivityTimeline />

        <FlowList />
        <PulseHistory />

        {(trackingError || authError || pulseError) && (
          <div className="alert alert-dash alert-error mt-4">
            <span>{trackingError || authError || pulseError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
