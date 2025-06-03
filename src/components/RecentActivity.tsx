import { TrackingEntry } from '@/types/tracking';

interface RecentActivityProps {
  entries: TrackingEntry[];
}

export default function RecentActivity({ entries }: RecentActivityProps) {
  if (entries.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body">
        <h2 className="card-title">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{new Date(entry.start_time).toLocaleString()}</td>
                  <td>{entry.description}</td>
                  <td>
                    {entry.end_time
                      ? `${Math.round(
                          (new Date(entry.end_time).getTime() -
                            new Date(entry.start_time).getTime()) /
                            1000 /
                            60
                        )} minutes`
                      : 'In Progress'}
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-xs">Edit</button>
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