import { CirclePause, CirclePlay } from 'lucide-react';
import { useTrackingStore, TrackingEntry } from './tracking';
import toast from 'react-hot-toast';

interface FlowOpsProps {
  currentEntry?: TrackingEntry | null;
}

export default function FlowOps({ currentEntry: propCurrentEntry }: FlowOpsProps) {
  const { currentEntry: storeCurrentEntry, startTracking, stopTracking } = useTrackingStore();
  const currentEntry = propCurrentEntry ?? storeCurrentEntry;

  const handleTracking = async () => {
    if (currentEntry) {
      await stopTracking();
      toast('Tracking stopped');
    } else {
      await startTracking('New tracking session');
      toast('Tracking started');
    }
  };

  return (
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
  );
} 