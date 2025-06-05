import { useConfirmStore } from '@/features/dialog/confirm';
import { useTrackingStore } from '@/features/flow/tracking';
import { usePulseStore } from '@/features/pulse/pulse';
import toast from 'react-hot-toast';

export default function PurgeButton() {
  const { purgeEntries } = useTrackingStore();
  const { purgeRecords } = usePulseStore();

  const handlePurge = async () => {
    await Promise.all([purgeEntries(), purgeRecords()]);
    toast.success('All data has been purged');
  };

  return (
    <button
      className="btn btn-error btn-outline"
      onClick={async () => {
        const confirmed = await useConfirmStore
          .getState()
          .openConfirm(
            'Are you sure you want to delete all your focus flow items and pulse records? This action cannot be undone.'
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
