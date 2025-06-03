interface PulseHistoryProps {
  records: any[];
  onRecordClick: () => void;
}

export default function PulseHistory({ records, onRecordClick }: PulseHistoryProps) {
  if (records.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl">📊</div>
            <h3 className="text-lg font-semibold">No records yet</h3>
            <p className="text-base-content/70 mb-4">
              Start tracking your focus levels to see your history here.
            </p>
            <button
              className="btn btn-outline btn-secondary"
              onClick={onRecordClick}
            >
              Record Your First Pulse
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body">
        <h2 className="card-title">Pulse History</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Focus Level</th>
                <th>Activity</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.created_at).toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="rating rating-sm">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <input
                            key={level}
                            type="radio"
                            name={`rating-${record.id}`}
                            className="mask mask-star-2 bg-primary"
                            checked={level === record.focus_level}
                            readOnly
                          />
                        ))}
                      </div>
                      <span>{record.focus_level}/5</span>
                    </div>
                  </td>
                  <td>{record.activity}</td>
                  <td>{record.tag || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 