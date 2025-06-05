import { useEffect } from 'react';
import { useTrackingStore } from '@/features/flow/tracking';
import { TrackingEntry } from '@/features/flow/tracking';

interface TodayFlowProps {
  entries?: TrackingEntry[];
}

export default function TodayFlow({ entries: propEntries }: TodayFlowProps) {
  const { entries: storeEntries, fetchEntries, loading } = useTrackingStore();
  const entries = propEntries || storeEntries;

  useEffect(() => {
    if (!propEntries && storeEntries.length === 0) {
      fetchEntries();
    }
  }, [propEntries, storeEntries.length, fetchEntries]); // Added missing dependencies

  if (loading) {
    return (
      <div className="stat">
        <div className="stat-title">Today Sessions</div>
        <div className="stat-value">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="stat">
      <div className="stat-title">Today Sessions</div>
      <div className="stat-value">{entries.length}</div>
    </div>
  );
} 