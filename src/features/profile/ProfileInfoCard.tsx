type Props = {
  name: string;
  email?: string;
  lastSignInAt?: string;
};

export default function ProfileInfoCard({ name, email, lastSignInAt }: Props) {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold mb-1">
        {name || 'No display name set'}
      </div>
      <div className="text-base-content/70 mb-1">{email}</div>
      <div className="text-xs text-base-content/50">
        Last sign in: {lastSignInAt ? new Date(lastSignInAt).toLocaleString() : '-'}
      </div>
    </div>
  );
}
