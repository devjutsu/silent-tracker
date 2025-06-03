'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useTrackingStore } from '@/store/tracking';
import { usePulseStore } from '@/store/pulse';
import { useNotificationStore } from '@/store/notifications';
import Login from '@/components/auth/Login';
import PulseModal from '@/components/PulseModal';
import toast from 'react-hot-toast';
import StatsSection from '@/components/StatsSection';
import ActionCards from '@/components/ActionCards';
import RecentActivity from '@/components/RecentActivity';
import PulseHistory from '@/components/PulseHistory';
import PurgeButton from '@/components/PurgeButton';

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
  const { requestPermission, isEnabled, startNotifications } =
    useNotificationStore();
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
        <StatsSection entries={entries} currentEntry={currentEntry} />

        <ActionCards
          currentEntry={currentEntry}
          onTrackingClick={handleTracking}
          onPulseClick={() => setIsPulseModalOpen(true)}
        />

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
