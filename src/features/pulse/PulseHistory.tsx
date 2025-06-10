import { useEffect } from 'react';
import { usePulseStore } from '@/features/pulse/pulse';
import { usePulseModalStore } from './pulseModalStore';
import { PulseRecord } from '@/features/pulse/pulse';

interface PulseHistoryProps {
  records?: PulseRecord[];
}

export default function PulseHistory({ records: propRecords }: PulseHistoryProps) {
  const { records: storeRecords, fetchRecords, loading } = usePulseStore();
  const { openModal } = usePulseModalStore();
  const records = propRecords || storeRecords;

  useEffect(() => {
    if (!propRecords && storeRecords.length === 0) {
      fetchRecords();
    }
  }, [propRecords, storeRecords.length, fetchRecords]);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  // Filter records for today only
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRecords = records.filter(record => {
    const recordDate = new Date(record.created_at);
    recordDate.setHours(0, 0, 0, 0);
    return recordDate.getTime() === today.getTime();
  });

  if (todayRecords.length === 0) {
    return (<></>
      // <div className="card bg-base-100 shadow-xl mt-4">
      //   <div className="card-body">
      //     <div className="flex flex-col items-center justify-center text-center">
      //       <div className="text-4xl">📊</div>
      //       <h3 className="text-lg font-semibold">No records today</h3>
      //       <p className="text-base-content/70 mb-4">
      //         Start tracking your focus levels to see your history here.
      //       </p>
      //       <button
      //         className="btn btn-outline btn-secondary"
      //         onClick={openModal}
      //       >
      //         Record Your First Pulse
      //       </button>
      //     </div>
      //   </div>
      // </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body">
        <h2 className="card-title">Today&apos;s Pulse History</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Focus</th>
                <th>Energy</th>
                <th>Activity</th>
                <th>Tag</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {todayRecords.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.created_at).toLocaleTimeString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="rating rating-sm">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <input
                            key={level}
                            type="radio"
                            name={`focus-${record.id}`}
                            className="mask mask-star-2 bg-primary"
                            checked={level === record.focus_level}
                            readOnly
                          />
                        ))}
                      </div>
                      <span>{record.focus_level}/5</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="rating rating-sm">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <input
                            key={level}
                            type="radio"
                            name={`energy-${record.id}`}
                            className="mask mask-star-2 bg-secondary"
                            checked={level === record.energy_level}
                            readOnly
                          />
                        ))}
                      </div>
                      <span>{record.energy_level}/5</span>
                    </div>
                  </td>
                  <td>{record.activity}</td>
                  <td>{record.tag || '-'}</td>
                  <td>
                    {record.note ? (
                      <div className="tooltip" data-tip={record.note}>
                        <span className="cursor-help">📝</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 