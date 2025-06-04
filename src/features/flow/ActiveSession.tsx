import { TrackingEntry } from '@/features/flow/tracking';
import FocusTimer from '@/features/flow/FocusTimer';

interface ActiveSessionProps {
  currentEntry: TrackingEntry | null;
}

export default function ActiveSession({ currentEntry }: ActiveSessionProps) {
  return (
    <div className="stat">
      <div className="stat-title">Active Session</div>
      {currentEntry ? (
        <FocusTimer startTime={currentEntry.start_time} />
      ) : (
        '-'
      )}
    </div>
  );
} 