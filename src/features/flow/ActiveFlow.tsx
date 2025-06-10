import { useEffect } from 'react';
import { useFlowStore } from '@/features/flow/flow';
import { FlowEntry } from '@/features/flow/flow';
import FocusTimer from '@/features/flow/FocusTimer';

interface ActiveFlowProps {
  currentEntry?: FlowEntry | null;
}

export default function ActiveFlow({ currentEntry: propCurrentEntry }: ActiveFlowProps) {
  const { currentEntry: storeCurrentEntry, fetchEntries, loading } = useFlowStore();
  const currentEntry = propCurrentEntry ?? storeCurrentEntry;

  useEffect(() => {
    if (propCurrentEntry === undefined && !storeCurrentEntry) {
      fetchEntries();
    }
  }, [propCurrentEntry, storeCurrentEntry, fetchEntries]); // Added missing dependencies

  if (loading) {
    return (
      <div className="stat">
        <div className="stat-title">Active Flow</div>
        <div className="stat-value">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      </div>
    );
  }

  if (!currentEntry) {
    return (
      <div className="stat">
        <div className="stat-title">Active Flow</div>
        <div className="stat-value text-sm text-warning">No active flow</div>
      </div>
    );
  }

  return (
    <div className="stat">
      <div className="stat-title">Active Flow</div>
      <div className="stat-value">
        <FocusTimer startTime={currentEntry.start_time} />
      </div>
      <div className="stat-desc">
        {currentEntry.title ? (
          <>
            <div className="font-semibold">{currentEntry.title}</div>
            <div className="text-sm opacity-70">{currentEntry.goal}</div>
          </>
        ) : (
          currentEntry.goal
        )}
      </div>
    </div>
  );
} 