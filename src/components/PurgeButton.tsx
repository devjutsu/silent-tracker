import { useConfirmStore } from '@/features/dialog/confirm';
import { useFlowStore } from '@/features/flow/flow';
import { usePulseStore } from '@/features/pulse/pulse';
import { useNotificationStore } from '@/features/notifications/notifications';
import toast from 'react-hot-toast';

export default function PurgeButton() {
  const { purgeEntries } = useFlowStore();
  const { purgeRecords } = usePulseStore();

  const handlePurge = async () => {
    // Close all notifications before purging data
    useNotificationStore.getState().simplyCloseNotifications();
    await Promise.all([purgeEntries(), purgeRecords()]);
    toast.success('All data has been purged');
  };

  return (
    <button
      className="btn btn-error btn-outline"
      onClick={async () => {
        const confirmed = await useConfirmStore.getState().openConfirm(
          'Delete history data?',
          'Are you sure you want to delete all your history data? This action cannot be undone.'
        );
        if (confirmed) {
          await handlePurge();
        }
      }}
    >
      Purge
    </button>
  );
}
