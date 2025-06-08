import { CirclePause, CirclePlay } from 'lucide-react';
import { useFlowStore, FlowEntry } from './flow';
import { useFlowModalStore } from './flowModalStore';
import toast from 'react-hot-toast';

interface FlowOpsProps {
  currentEntry?: FlowEntry | null;
}

export default function FlowOps({ currentEntry: propCurrentEntry }: FlowOpsProps) {
  const { currentEntry: storeCurrentEntry, stopFlow } = useFlowStore();
  const { openModal } = useFlowModalStore();
  const currentEntry = propCurrentEntry ?? storeCurrentEntry;

  const handleStop = async () => {
    try {
      await stopFlow();
      toast.success('Flow stopped successfully');
    } catch (error) {
      toast.error(`Failed to stop flow: ${error}`);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {currentEntry ? (
          <button
            className="btn btn-lg btn-warning"
            onClick={handleStop}
          >
            <CirclePause />
            Stop Flow
          </button>
        ) : (
          <button
            className="btn btn-lg btn-primary"
            onClick={openModal}
          >
            <CirclePlay />
            Start Flow
          </button>
        )}
      </div>
    </div>
  );
} 