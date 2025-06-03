export interface TrackingEntry {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  description: string;
  created_at: string;
} 