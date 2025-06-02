'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useTrackingStore } from '@/store/tracking';
import { usePulseStore } from '@/store/pulse';
import { useNotificationStore } from '@/store/notifications';
import Login from '@/components/auth/Login';
import PulseModal from '@/components/PulseModal';
import toast from 'react-hot-toast';
import { CirclePause, CirclePlay, SatelliteDish } from 'lucide-react';
import FocusTimer from '@/components/FocusTimer';

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
  } = useTrackingStore();
  const {
    records: pulseRecords,
    loading: pulseLoading,
    error: pulseError,
    fetchRecords: fetchPulseRecords,
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
      toast.success('Tracking stopped');
    } else {
      await startTracking('New tracking session');
      toast.success('Tracking started');
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <div className="stats shadow w-full overflow-x-auto">
          <div className="stat">
            <div className="stat-title">Today Sessions</div>
            <div className="stat-value">{entries.length}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Active Session</div>
            {currentEntry ? (
              <FocusTimer startTime={currentEntry.start_time} />
            ) : (
              '-'
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Flow</h2>
              <button
                className={`btn btn-lg ${
                  currentEntry ? 'btn-warning' : 'btn-primary'
                }`}
                onClick={handleTracking}
              >
                {currentEntry ? (
                  <>
                    <CirclePause />
                    Stop Focus
                  </>
                ) : (
                  <>
                    <CirclePlay size={32} />
                    Focus Flow
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Check-in</h2>
              <button
                className="btn btn-lg btn-secondary"
                onClick={() => setIsPulseModalOpen(true)}
              >
                <SatelliteDish />
                Record Pulse
              </button>
            </div>
          </div>
        </div>

        {entries.length > 0 && (
          <div className="card bg-base-100 shadow-xl mt-4">
            <div className="card-body">
              <h2 className="card-title">Recent Activity</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>{new Date(entry.start_time).toLocaleString()}</td>
                        <td>{entry.description}</td>
                        <td>
                          {entry.end_time
                            ? `${Math.round(
                                (new Date(entry.end_time).getTime() -
                                  new Date(entry.start_time).getTime()) /
                                  1000 /
                                  60
                              )} minutes`
                            : 'In Progress'}
                        </td>
                        <td>
                          <button className="btn btn-ghost btn-xs">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {pulseRecords.length > 0 ? (
          <div className="card bg-base-100 shadow-xl mt-4">
            <div className="card-body">
              <h2 className="card-title">Pulse History</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Focus Level</th>
                      <th>Activity</th>
                      <th>Tag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pulseRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{new Date(record.created_at).toLocaleString()}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="rating rating-sm">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <input
                                  key={level}
                                  type="radio"
                                  name={`rating-${record.id}`}
                                  className="mask mask-star-2 bg-primary"
                                  checked={level === record.focus_level}
                                  readOnly
                                />
                              ))}
                            </div>
                            <span>{record.focus_level}/5</span>
                          </div>
                        </td>
                        <td>{record.activity}</td>
                        <td>{record.tag || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl mt-4">
            <div className="card-body">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-4xl">📊</div>
                <h3 className="text-lg font-semibold">No records yet</h3>
                <p className="text-base-content/70 mb-4">
                  Start tracking your focus levels to see your history here.
                </p>
                <button
                  className="btn btn-outline btn-secondary"
                  onClick={() => setIsPulseModalOpen(true)}
                >
                  Record Your First Pulse
                </button>
              </div>
            </div>
          </div>
        )}

        {(trackingError || authError || pulseError) && (
          <div className="alert alert-dash alert-error mt-4">
            <span>{trackingError || authError || pulseError}</span>
          </div>
        )}
      </div>

      <PulseModal
        isOpen={isPulseModalOpen}
        onClose={() => setIsPulseModalOpen(false)}
      />
    </div>
  );
}
