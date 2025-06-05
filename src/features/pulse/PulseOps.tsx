import { SatelliteDish } from 'lucide-react';
import { usePulseModalStore } from './pulseModalStore';

export default function PulseOps() {
  const { openModal } = usePulseModalStore();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Check-in</h2>
        <button
          className="btn btn-lg btn-secondary"
          onClick={openModal}
        >
          <SatelliteDish />
          Record Pulse
        </button>
      </div>
    </div>
  );
} 