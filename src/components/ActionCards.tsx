import { CirclePause, CirclePlay, SatelliteDish } from 'lucide-react';
import { TrackingEntry } from '@/types/tracking';

interface ActionCardsProps {
  currentEntry: TrackingEntry | null;
  onTrackingClick: () => void;
  onPulseClick: () => void;
}

export default function ActionCards({
  currentEntry,
  onTrackingClick,
  onPulseClick,
}: ActionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Check-in</h2>
          <button
            className="btn btn-lg btn-secondary"
            onClick={onPulseClick}
          >
            <SatelliteDish />
            Record Pulse
          </button>
        </div>
      </div>
    </div>
  );
} 