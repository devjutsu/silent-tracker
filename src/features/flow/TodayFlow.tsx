import { TrackingEntry } from '@/features/flow/tracking';

interface TodayFlowProps {
  entries: TrackingEntry[];
}

export default function TodayFlow({ entries }: TodayFlowProps) {
  return (
    <div className="stat">
      <div className="stat-title">Today Sessions</div>
      <div className="stat-value">{entries.length}</div>
    </div>
  );
} 