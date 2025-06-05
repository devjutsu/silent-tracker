import { useEffect } from 'react';
import { useTrackingStore } from '@/features/flow/tracking';
import { TrackingEntry } from '@/features/flow/tracking';
import FocusTimer from '@/features/flow/FocusTimer';

interface ActiveSessionProps {
  currentEntry?: TrackingEntry | null;
}

export default function ActiveSession({ currentEntry: propCurrentEntry }: ActiveSessionProps) {
  const { currentEntry: storeCurrentEntry, fetchEntries, loading } = useTrackingStore();
  const currentEntry = propCurrentEntry ?? storeCurrentEntry;

  useEffect(() => {
    if (propCurrentEntry === undefined && !storeCurrentEntry) {
      fetchEntries();
    }
  }, [propCurrentEntry, storeCurrentEntry, fetchEntries]); // Added missing dependencies

  if (loading) {
    return (
      <div className="stat">
        <div className="stat-title">Active Session</div>
        <div className="stat-value">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      </div>
    );
  }

  if (!currentEntry) {
    return (
      <div className="stat">
        <div className="stat-title">Active Session</div>
        <div className="stat-value">—</div>
      </div>
    );
  }

  return (
    <div className="stat">
      <div className="stat-title">Active Session</div>
      <div className="stat-value">
        <FocusTimer startTime={currentEntry.start_time} />
      </div>
      <div className="stat-desc">{currentEntry.description}</div>
    </div>
  );
} 