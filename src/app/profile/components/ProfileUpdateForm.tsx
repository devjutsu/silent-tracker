type Props = {
  displayName: string;
  newPassword: string;
  onDisplayNameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDisabled: boolean;
};

export default function ProfileUpdateForm({
  displayName,
  newPassword,
  onDisplayNameChange,
  onPasswordChange,
  onSubmit,
  isDisabled,
}: Props) {
  return (
    <form className="flex flex-col gap-6 items-center" onSubmit={onSubmit}>
      <div className="w-full flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Update Name</h3>
        <input
          type="text"
          className="input input-bordered max-w-xs w-full"
          placeholder="Enter new display name"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          disabled={isDisabled}
        />
      </div>
      <div className="w-full flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <input
          type="password"
          className="input input-bordered max-w-xs w-full"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={isDisabled}
        />
      </div>
      <button
        type="submit"
        className="btn btn-neutral w-full max-w-xs mt-2"
        disabled={isDisabled || (!displayName && !newPassword)}
      >
        Save Changes
      </button>
    </form>
  );
}
