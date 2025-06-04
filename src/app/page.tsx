'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/auth';
import { useTrackingStore } from '@/features/flow/tracking';
import { usePulseStore } from '@/features/pulse/pulse';
import { useNotificationStore } from '@/features/notifications/notifications';
import Login from '@/features/auth/Login';
import PulseModal from '@/features/pulse/PulseModal';
import toast from 'react-hot-toast';
import RecentActivity from '@/features/flow/RecentActivity';
import PulseHistory from '@/features/pulse/PulseHistory';
import PurgeButton from '@/components/PurgeButton';
import TodayFlow from '@/features/flow/TodayFlow';
import ActiveSession from '@/features/flow/ActiveSession';
import FlowOps from '@/features/flow/FlowOps';
import PulseOps from '@/features/pulse/PulseOps';
import CaloryOps from '@/features/calory/CaloryTracker';

export default function Home() {
  const { user, loading: authLoading, error: authError } = useAuthStore();
  const {
    entries,
    currentEntry,
    loading: trackingLoading,
    error: trackingError,
    fetchEntries,
    startTracking,
    stopTracking,
    purgeEntries,
  } = useTrackingStore();
  const {
    records: pulseRecords,
    loading: pulseLoading,
    error: pulseError,
    fetchRecords: fetchPulseRecords,
    purgeRecords,
  } = usePulseStore();
  const { requestPermission, isEnabled } = useNotificationStore();
  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEntries();
      fetchPulseRecords();

      // Request notification permission on first visit
      if (!isEnabled) {
        requestPermission();
      }

      // Listen for notification click events
      const handleShowPulseModal = () => {
        setIsPulseModalOpen(true);
      };

      window.addEventListener('showPulseModal', handleShowPulseModal);

      return () => {
        window.removeEventListener('showPulseModal', handleShowPulseModal);
      };
    }
  }, [user, fetchEntries, fetchPulseRecords, requestPermission, isEnabled]);

  if (authLoading || trackingLoading || pulseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleTracking = async () => {
    if (currentEntry) {
      await stopTracking();
      toast('Tracking stopped');
    } else {
      await startTracking('New tracking session');
      toast('Tracking started');
    }
  };

  const handlePurge = async () => {
    await Promise.all([purgeEntries(), purgeRecords()]);
    toast.success('All data has been purged');
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <div className="stats shadow w-full overflow-x-auto">
          <TodayFlow entries={entries} />
          <ActiveSession currentEntry={currentEntry} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FlowOps
            currentEntry={currentEntry}
            onTrackingClick={handleTracking}
          />
          <PulseOps onPulseClick={() => setIsPulseModalOpen(true)} />
        </div>

        <CaloryOps />

        <RecentActivity entries={entries} />

        <PulseHistory
          records={pulseRecords}
          onRecordClick={() => setIsPulseModalOpen(true)}
        />

        {(trackingError || authError || pulseError) && (
          <div className="alert alert-dash alert-error mt-4">
            <span>{trackingError || authError || pulseError}</span>
          </div>
        )}

        <PurgeButton onPurge={handlePurge} />
      </div>

      <PulseModal
        isOpen={isPulseModalOpen}
        onClose={() => setIsPulseModalOpen(false)}
      />
    </div>
  );
}
