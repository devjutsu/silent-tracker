'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/auth';
import { useThemeStore } from '@/features/theme/theme';
import { useNotificationStore } from '@/features/notifications/notifications';
import { useFeatureFlags } from '@/features/settings/featureFlags';
import toast from 'react-hot-toast';

export default function Settings() {
  const router = useRouter();
  const { user, loading: authLoading, error: authError, signOut } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { isEnabled, permission, requestPermission, notificationInterval, setNotificationInterval } = useNotificationStore();
  const { isCaloryTrackerEnabled, setCaloryTrackerEnabled } = useFeatureFlags();
  const [notificationIntervalInput, setNotificationIntervalInput] = useState(notificationInterval);

  useEffect(() => {
    if (!authLoading && (!user || authError)) {
      router.push('/');
    }
  }, [user, authLoading, authError, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    toast.success('Signed out successfully');
  };

  const handleNotificationToggle = async () => {
    if (!isEnabled) {
      await requestPermission();
    } else {
      // Disable notifications
      useNotificationStore.getState().setIsEnabled(false);
    }
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setNotificationIntervalInput(value);
      setNotificationInterval(value);
    }
  };

  const getNotificationStatus = () => {
    if (!('Notification' in window)) {
      return 'Not supported';
    }
    if (permission === 'denied') {
      return 'Blocked';
    }
    if (permission === 'default') {
      return 'Not requested';
    }
    return isEnabled ? 'Enabled' : 'Disabled';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center py-8">
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
    <div className="flex flex-col">
      <main className="flex-1 flex flex-col items-center pt-8">
        <h2 className="text-3xl font-bold mb-8">Settings</h2>
        <div className="flex flex-col gap-8 w-full max-w-2xl">
          {/* Functionality Section */}
          <div className="card bg-base-100 shadow-xl p-6 rounded-box">
            <h3 className="text-lg font-semibold mb-4">Functionality</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Calorie Tracker</h4>
                  <p className="text-sm text-base-content/70">
                    Track your daily calorie intake and set goals
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={isCaloryTrackerEnabled}
                  onChange={(e) => setCaloryTrackerEnabled(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="card bg-base-100 shadow-xl p-6 rounded-box">
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2 md:col-span-2">
                <p className="text-base-content/70">
                  Status:{' '}
                  <span className="font-medium">{getNotificationStatus()}</span>
                </p>
                {isEnabled && permission === 'granted' && (
                  <div className="form-control max-w-xs">
                    <label className="label">
                      <span className="label-text">
                        Notification Interval (seconds)
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 60"
                      className="input input-bordered w-full"
                      value={notificationIntervalInput}
                      onChange={handleIntervalChange}
                      min="1"
                    />
                  </div>
                )}
                {permission === 'denied' && (
                  <p className="text-sm text-error mt-1">
                    Please enable notifications in your browser settings
                  </p>
                )}
              </div>
              <div className="flex md:justify-end">
                <button
                  className={`btn btn-sm ${
                    isEnabled ? 'btn-neutral' : 'btn-primary'
                  } w-full md:w-auto`}
                  onClick={handleNotificationToggle}
                  disabled={permission === 'denied'}
                >
                  {isEnabled ? 'Disable' : 'Enable'} Notifications
                </button>
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div className="card bg-base-100 shadow-xl p-6 rounded-box">
            <h3 className="text-lg font-semibold mb-2">Theme</h3>
            <div className="flex items-center gap-4">
              <span className="text-base-content/70">Light</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={theme === 'abyss'}
                onChange={toggleTheme}
              />
              <span className="text-base-content/70">Dark</span>
            </div>
          </div>

          {/* Account Section */}
          <div className="card bg-base-100 shadow-xl p-6 rounded-box">
            <h3 className="text-lg font-semibold mb-2">Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-base-content/70">Email</span>
                <span className="font-medium break-all">{user.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-base-content/70">
                  Last Sign In
                </span>
                <span className="font-medium">
                  {new Date(user.last_sign_in_at || '').toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="card bg-base-100 shadow-xl p-6 rounded-box flex justify-center">
            <button
              className="btn btn-error btn-outline w-full max-w-xs text-lg mx-auto"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
