'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useTrackingStore } from '@/store/tracking';
import { usePulseStore } from '@/store/pulse';
import Header from '@/components/Header';
import PulseModal from '@/components/PulseModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, error: authError, getUser, signOut } = useAuthStore();
  const { entries, currentEntry, loading: trackingLoading, error: trackingError, fetchEntries, startTracking, stopTracking } = useTrackingStore();
  const { records: pulseRecords, loading: pulseLoading, error: pulseError, fetchRecords: fetchPulseRecords } = usePulseStore();
  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);

  useEffect(() => {
    getUser();
    fetchEntries();
    fetchPulseRecords();
  }, [getUser, fetchEntries, fetchPulseRecords]);

  if (authLoading || trackingLoading || pulseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (authError || !user) {
    router.push('/');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    toast.success('Signed out successfully');
  };

  const handleTracking = async () => {
    if (currentEntry) {
      await stopTracking();
      toast.success('Tracking stopped');
    } else {
      await startTracking('New tracking session');
      toast.success('Tracking started');
    }
  };

  const handleTestToast = () => {
    toast('This is a test notification!', {
      icon: '👋',
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header user={user} onSignOut={handleSignOut} />

      <div className="container mx-auto p-4">
        <div className="stats shadow w-full overflow-x-auto">
          <div className="stat">
            <div className="stat-title">Total Sessions</div>
            <div className="stat-value">{entries.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Active Session</div>
            <div className="stat-value">{currentEntry ? 'Yes' : 'No'}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Last Session</div>
            <div className="stat-value">
              {entries[0] ? new Date(entries[0].start_time).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Tracking Controls</h2>
              <button
                className={`btn btn-lg ${currentEntry ? 'btn-error' : 'btn-primary'}`}
                onClick={handleTracking}
              >
                {currentEntry ? 'Stop Tracking' : 'Start Tracking'}
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Focus Check-in</h2>
              <button
                className="btn btn-lg btn-secondary"
                onClick={() => setIsPulseModalOpen(true)}
              >
                Record Pulse
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mt-4">
          <div className="card-body">
            <h2 className="card-title">Test Notifications</h2>
            <button
              className="btn btn-outline"
              onClick={handleTestToast}
            >
              Fire Toast
            </button>
          </div>
        </div>

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
                              (new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()) / 1000 / 60
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
                                className="mask mask-star-2 bg-info"
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

        {(trackingError || authError || pulseError) && (
          <div className="alert alert-error mt-4">
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