'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/auth';
import { useTrackingStore } from '@/features/flow/tracking';
import { usePulseStore } from '@/features/pulse/pulse';
import { useNotificationStore } from '@/features/notifications/notifications';
import Login from '@/features/auth/Login';

import RecentActivity from '@/features/flow/RecentActivity';
import PulseHistory from '@/features/pulse/PulseHistory';
import TodayFlow from '@/features/flow/TodayFlow';
import ActiveSession from '@/features/flow/ActiveSession';
import FlowOps from '@/features/flow/FlowOps';
import PulseOps from '@/features/pulse/PulseOps';
import CaloryWidget from '@/features/calory/CaloryWidget';
import HydrationWidget from '@/features/hydration/HydrationWidget';
import FitWidget from '@/features/fit/FitWidget';

export default function Main() {
  const { user, error: authError } = useAuthStore();
  const { error: trackingError, fetchEntries } = useTrackingStore();
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
    return <>
      <div className="flex justify-center items-center bg-base-300">
        <img src="/logo-dark.png" alt="Logo" className="w-64 h-auto" />
      </div>
      <Login />
    </>
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <div className="stats shadow w-full overflow-x-auto">
          <TodayFlow />
          <ActiveSession />
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

        <RecentActivity />
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
