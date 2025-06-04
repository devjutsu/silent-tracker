import { SatelliteDish } from 'lucide-react';

interface PulseOpsProps {
  onPulseClick: () => void;
}

export default function PulseOps({ onPulseClick }: PulseOpsProps) {
  return (
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
  );
} 