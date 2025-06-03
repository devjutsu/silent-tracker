interface PurgeButtonProps {
  onPurge: () => Promise<void>;
}

export default function PurgeButton({ onPurge }: PurgeButtonProps) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        className="btn btn-error btn-outline"
        onClick={async () => {
          if (window.confirm('Are you sure you want to delete all your focus flow items and pulse records? This action cannot be undone.')) {
            await onPurge();
          }
        }}
      >
        Purge Data
      </button>
    </div>
  );
} 