import { CirclePause, CirclePlay } from 'lucide-react';
import { TrackingEntry } from '@/features/flow/tracking';

interface FlowOpsProps {
  currentEntry: TrackingEntry | null;
  onTrackingClick: () => void;
}

export default function FlowOps({ currentEntry, onTrackingClick }: FlowOpsProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Flow</h2>
        <button
          className={`btn btn-lg ${
            currentEntry ? 'btn-warning' : 'btn-primary'
          }`}
          onClick={onTrackingClick}
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
  );
} 