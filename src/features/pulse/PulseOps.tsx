import { SatelliteDish } from 'lucide-react';
import { useModalStore } from '@/features/dialog/modalStore';

export default function PulseOps() {
  const { openModal } = useModalStore();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <button
          className="btn btn-lg btn-secondary"
          onClick={() => openModal('pulse', {})}
        >
          <SatelliteDish />
          Record Pulse
        </button>
      </div>
    </div>
  );
} 