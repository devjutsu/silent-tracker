import { CirclePause, CirclePlay } from 'lucide-react';
import { useFlowStore, FlowEntry } from './flow';
import toast from 'react-hot-toast';

interface FlowOpsProps {
  currentEntry?: FlowEntry | null;
}

export default function FlowOps({ currentEntry: propCurrentEntry }: FlowOpsProps) {
  const { currentEntry: storeCurrentEntry, startFlow, stopFlow } = useFlowStore();
  const currentEntry = propCurrentEntry ?? storeCurrentEntry;

  const handleFlow = async () => {
    if (currentEntry) {
      await stopFlow();
      toast('Focus flow stopped');
    } else {
      await startFlow('New focus flow session');
      toast('Focus flow started');
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <button
          className={`btn btn-lg ${
            currentEntry ? 'btn-warning' : 'btn-primary'
          }`}
          onClick={handleFlow}
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