import { useEffect, useState } from 'react';
import { useFlowStore, FlowEntry } from '@/features/flow/flow';
import { useFlowEditModalStore } from './flowEditModalStore';
import FlowEditModal from './FlowEditModal';

interface FlowListProps {
  entries?: FlowEntry[];
}

export default function FlowList({ entries: propEntries }: FlowListProps) {
  const { entries: storeEntries, fetchEntries, loading } = useFlowStore();
  const { openModal } = useFlowEditModalStore();
  const [selectedEntry, setSelectedEntry] = useState<FlowEntry | null>(null);
  const entries = propEntries || storeEntries;

  useEffect(() => {
    if (!propEntries && storeEntries.length === 0) {
      fetchEntries();
    }
  }, [propEntries, storeEntries.length, fetchEntries]);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl">⏳</div>
            <h3 className="text-lg font-semibold">No Flows Recorded Today</h3>
            <p className="text-base-content/70 mb-4">
              Start tracking your focus sessions to see your history here.
            </p>
            <button
              className="btn btn-outline btn-secondary"
              onClick={() => openModal()}
            >
              Start Your First Flow
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (entry: FlowEntry) => {
    setSelectedEntry(entry);
    openModal();
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <h2 className="card-title">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Goal</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.start_time).toLocaleString()}</td>
                    <td>{entry.title || '-'}</td>
                    <td>{entry.goal || '-'}</td>
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
                      {entry.is_active ? (
                        <span className="badge badge-success">Active</span>
                      ) : entry.interrupted ? (
                        <span className="badge badge-error">Interrupted</span>
                      ) : (
                        <span className="badge badge-neutral">Completed</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleEdit(entry)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedEntry && <FlowEditModal entry={selectedEntry} />}
    </>
  );
} 