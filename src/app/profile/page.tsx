'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';
import React from 'react';

export default function Profile() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    error: authError,
    getUser,
  } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [updatingName, setUpdatingName] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [showAvatarActions, setShowAvatarActions] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await getUser();
        if (user && user.user_metadata && user.user_metadata.full_name) {
          setDisplayName(user.user_metadata.full_name);
        }
      } catch (error) {
        toast.error('Failed to load profile');
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center pt-8">
          <span className="loading loading-spinner loading-lg"></span>
        </main>
      </div>
    );
  }

  if (authError || !user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center pt-8">
        <h2 className="text-3xl font-bold mb-8">Profile</h2>
        <div className="flex flex-col gap-8 w-full max-w-2xl">
          {/* Profile Info Card */}
          <div className="card bg-base-100 shadow-xl p-6 rounded-box flex flex-col items-center">
            <div className="relative">
              <img
                src={newAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                alt="User avatar"
                className="w-24 h-24 rounded-full mb-4 border border-base-300 object-cover"
              />
              {/* Change Avatar Button */}
              <button
                className="btn btn-xs btn-neutral absolute bottom-2 left-1/2 -translate-x-1/2 z-10"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                Change
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setNewAvatar(ev.target?.result as string);
                      setShowAvatarActions(true);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            {showAvatarActions && newAvatar && (
              <div className="flex gap-2 mt-2">
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  onClick={() => toast('Avatar upload feature coming soon!')}
                >
                  Save
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  type="button"
                  onClick={() => { setNewAvatar(null); setShowAvatarActions(false); }}
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="text-center">
              <div className="text-lg font-semibold mb-1">
                {displayName || 'No display name set'}
              </div>
              <div className="text-base-content/70 mb-1">{user.email}</div>
              <div className="text-xs text-base-content/50">
                Last sign in:{' '}
                {new Date(user.last_sign_in_at || '').toLocaleString()}
              </div>
            </div>
          </div>

          {/* Combined Update Card */}
          <div className="card bg-base-100 shadow-xl p-6 rounded-box">
            <form
              className="flex flex-col gap-6 items-center"
              onSubmit={(e) => {
                e.preventDefault();
                toast('Save changes feature coming soon!');
              }}
            >
              {/* Update Display Name */}
              <div className="w-full flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Update Name</h3>
                <div className="flex flex-col gap-1 max-w-xs w-full mx-auto">
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Enter new display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={updatingName || updatingPassword}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                <div className="flex flex-col gap-1 max-w-xs w-full mx-auto">
                  <input
                    type="password"
                    className="input input-bordered"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={updatingName || updatingPassword}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-neutral w-full max-w-xs mx-auto mt-2"
                disabled={
                  (displayName === (user.user_metadata?.full_name || '') &&
                    !newPassword) ||
                  updatingName ||
                  updatingPassword
                }
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
