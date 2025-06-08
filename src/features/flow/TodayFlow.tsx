import { useEffect } from 'react';
import { useFlowStore } from '@/features/flow/flow';
import { FlowEntry } from '@/features/flow/flow';

interface TodayFlowProps {
  entries?: FlowEntry[];
}

export default function TodayFlow({ entries: propEntries }: TodayFlowProps) {
  const { entries: storeEntries, fetchEntries, loading } = useFlowStore();
  const entries = propEntries || storeEntries;

  useEffect(() => {
    if (!propEntries && storeEntries.length === 0) {
      fetchEntries();
    }
  }, [propEntries, storeEntries.length, fetchEntries]); // Added missing dependencies

  if (loading) {
    return (
      <div className="stat">
        <div className="stat-title">Flow Today</div>
        <div className="stat-value">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="stat">
      <div className="stat-title">Flow Today</div>
      <div className="stat-value">{entries.length}</div>
    </div>
  );
} 