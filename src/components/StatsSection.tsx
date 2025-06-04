import FocusTimer from '../features/flow/FocusTimer';
import { TrackingEntry } from '@/features/flow/tracking';

interface StatsSectionProps {
  entries: TrackingEntry[];
  currentEntry: TrackingEntry | null;
}

export default function StatsSection({ entries, currentEntry }: StatsSectionProps) {
  return (
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
  );
} 