import React, { useState } from 'react';
import { useFlowStore, FlowEntry } from '@/features/flow/flow';
import { usePulseStore, PulseRecord } from '@/features/pulse/pulse';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ActivityTimeline: React.FC = () => {
  const flows = useFlowStore((s) => s.entries) as FlowEntry[];
  const pulses = usePulseStore((s) => s.records) as PulseRecord[];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Group pulses by flow_id
  const pulsesByFlow: Record<string, PulseRecord[]> = {};
  pulses.forEach((pulse: PulseRecord) => {
    if (pulse.flow_id) {
      if (!pulsesByFlow[pulse.flow_id]) pulsesByFlow[pulse.flow_id] = [];
      pulsesByFlow[pulse.flow_id].push(pulse);
    }
  });
  // Standalone pulses (no flow_id)
  const standalonePulses = pulses.filter((p: PulseRecord) => !p.flow_id);

  // Helper for duration
  const getDuration = (start: string, end: string | null, isActive: boolean) => {
    if (end) {
      const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000 / 60);
      return `${mins} min`;
    }
    if (isActive) return 'Active';
    return 'In Progress';
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Activity Timeline</h2>
      {/* Flow cards */}
      {flows.map((flow: FlowEntry) => {
        const flowPulses = pulsesByFlow[flow.id] || [];
        const isOpen = expanded[flow.id];
        return (
          <div key={flow.id} className="bg-base-200 rounded-lg shadow p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {flowPulses.length > 0 && (
                  <button
                    className="btn btn-xs btn-ghost"
                    onClick={() => setExpanded((e) => ({ ...e, [flow.id]: !e[flow.id] }))}
                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                  >
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                )}
                <span className="font-semibold text-base-content/80 text-sm sm:text-base">
                  {new Date(flow.start_time).toLocaleString()}
                </span>
              </div>
              <span className="badge px-3 py-2 text-xs sm:text-sm font-semibold ">
                {flow.is_active ? 'Active' : flow.interrupted ? 'Interrupted' : 'Completed'}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <div className="text-base-content/70 text-xs sm:text-sm">Title</div>
                <div className="font-medium text-base-content/90">{flow.title || '-'}</div>
              </div>
              <div>
                <div className="text-base-content/70 text-xs sm:text-sm">Goal</div>
                <div className="font-medium text-base-content/90">{flow.goal || '-'}</div>
              </div>
              <div>
                <div className="text-base-content/70 text-xs sm:text-sm">Duration</div>
                <div className="font-medium text-base-content/90">{getDuration(flow.start_time, flow.end_time, flow.is_active)}</div>
              </div>
              <div>
                <div className="text-base-content/70 text-xs sm:text-sm">Actions</div>
                <button className="btn btn-ghost btn-xs">Edit</button>
              </div>
            </div>
            {/* Pulses for this flow */}
            {isOpen && flowPulses.length > 0 && (
              <div className="mt-4 border-t border-base-300 pt-2 flex flex-col gap-2">
                {flowPulses.map((pulse) => (
                  <div key={pulse.id} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-base-100 rounded p-2">
                    <span className="text-xs text-base-content/60 w-24 shrink-0">{new Date(pulse.created_at).toLocaleTimeString()}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-base-content/70">Focus</span>
                      <div className="rating rating-xs">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <input
                            key={level}
                            type="radio"
                            name={`focus-${pulse.id}`}
                            className="mask mask-star-2 bg-warning"
                            checked={level === pulse.focus_level}
                            readOnly
                          />
                        ))}
                      </div>
                      <span className="text-xs">{pulse.focus_level}/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-base-content/70">Energy</span>
                      <div className="rating rating-xs">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <input
                            key={level}
                            type="radio"
                            name={`energy-${pulse.id}`}
                            className="mask mask-star-2 bg-info"
                            checked={level === pulse.energy_level}
                            readOnly
                          />
                        ))}
                      </div>
                      <span className="text-xs">{pulse.energy_level}/5</span>
                    </div>
                    <span className="text-xs text-base-content/70">{pulse.activity}</span>
                    {pulse.tag && <span className="badge badge-outline text-xs">{pulse.tag}</span>}
                    {pulse.note && (
                      <span className="italic text-xs text-base-content/60 truncate max-w-xs">{pulse.note}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {/* Standalone pulses */}
      {standalonePulses.map((pulse) => (
        <div key={pulse.id} className="bg-base-200 rounded-lg shadow p-4 flex flex-col gap-2">
          <span className="text-xs text-base-content/60">{new Date(pulse.created_at).toLocaleTimeString()}</span>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-base-content/70">Focus</span>
            <div className="rating rating-xs">
              {[1, 2, 3, 4, 5].map((level) => (
                <input
                  key={level}
                  type="radio"
                  name={`focus-standalone-${pulse.id}`}
                  className="mask mask-star-2 bg-warning"
                  checked={level === pulse.focus_level}
                  readOnly
                />
              ))}
            </div>
            <span className="text-xs">{pulse.focus_level}/5</span>
            <span className="text-xs text-base-content/70 ml-2">Energy</span>
            <div className="rating rating-xs">
              {[1, 2, 3, 4, 5].map((level) => (
                <input
                  key={level}
                  type="radio"
                  name={`energy-standalone-${pulse.id}`}
                  className="mask mask-star-2 bg-info"
                  checked={level === pulse.energy_level}
                  readOnly
                />
              ))}
            </div>
            <span className="text-xs">{pulse.energy_level}/5</span>
            <span className="text-xs text-base-content/70 ml-2">{pulse.activity}</span>
            {pulse.tag && <span className="badge badge-outline text-xs">{pulse.tag}</span>}
            {pulse.note && (
              <span className="italic text-xs text-base-content/60 truncate max-w-xs">{pulse.note}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline; 