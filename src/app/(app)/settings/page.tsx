'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/auth';
import { useThemeStore } from '@/features/theme/theme';
import { useNotificationStore } from '@/features/notifications/notifications';
import { useFeatureFlags } from '@/features/settings/featureFlags';
import toast from 'react-hot-toast';
import PurgeButton from '@/components/PurgeButton';

export default function Settings() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    error: authError,
    signOut,
  } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const {
    isEnabled,
    permission,
    requestPermission,
    notificationInterval,
    setNotificationInterval,
    simplyCloseNotifications,
  } = useNotificationStore();
  const { isKeepFitEnabled, setKeepFitEnabled } = useFeatureFlags();
  const [notificationIntervalInput, setNotificationIntervalInput] =
    useState(notificationInterval);

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
      useNotificationStore.getState().closeAllNotifications();
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

  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('Focus Check-in', {
        body: 'How is your focus level right now?',
        icon: '/favicon.ico',
      });

      // Add to active notifications
      useNotificationStore.getState().setActiveNotifications([
        ...useNotificationStore.getState().activeNotifications,
        notification
      ]);

      notification.onclick = () => {
        console.log('Notification clicked, opening modal and stopping timer.');
        window.focus();
        notification.close();
        // Remove from active notifications
        useNotificationStore.getState().setActiveNotifications(
          useNotificationStore.getState().activeNotifications.filter(n => n !== notification)
        );
        // Dispatch a custom event that the app can listen to
        window.dispatchEvent(new CustomEvent('showPulseModal'));
      };

      // Add close event listener to remove from active notifications when closed
      notification.onclose = () => {
        useNotificationStore.getState().setActiveNotifications(
          useNotificationStore.getState().activeNotifications.filter(n => n !== notification)
        );
      };
    } else {
      toast.error('Notifications not permitted');
    }
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
    <main className="flex-1 flex flex-col items-center py-8">
      <h2 className="text-3xl font-bold mb-8">Settings</h2>
      <div className="flex flex-col gap-8 w-full max-w-2xl">
        {/* Functionality Section */}
        <div className="card bg-base-100 shadow-xl p-6 rounded-box">
          <h3 className="text-lg font-semibold mb-4">Functionality</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Keep Fit</h4>
                <p className="text-sm text-base-content/70">
                  Enable or disable all health tracking widgets: Calorie,
                  Hydration, and Fit trackers
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={isKeepFitEnabled}
                onChange={(e) => setKeepFitEnabled(e.target.checked)}
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
              {/* Test Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleTestNotification}
                  disabled={permission !== 'granted'}
                >
                  Test Notification
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => simplyCloseNotifications()}
                >
                  Close Notifications
                </button>
              </div>
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

        {/* Data Section */}
        <div className="card bg-base-100 shadow-xl p-6 rounded-box">
          <h3 className="text-lg font-semibold mb-4">Data</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-base-content/70 mb-4">
                Delete all your focus flow items and pulse records. This action
                cannot be undone.
              </p>
              <PurgeButton />
            </div>
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
              <span className="text-sm text-base-content/70">Last Sign In</span>
              <span className="font-medium">
                {new Date(user.last_sign_in_at || '').toLocaleString()}
              </span>
            </div>
          </div>
          {/* Sign Out Button */}
          <div className="flex justify-center mt-4">
            <button
              className="btn btn-error btn-outline w-full max-w-xs text-lg mx-auto"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
