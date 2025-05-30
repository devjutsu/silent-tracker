'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useNotificationStore } from '@/store/notifications';
import Header from '@/components/Header';
import toast from 'react-hot-toast';

export default function Settings() {
  const router = useRouter();
  const { user, loading: authLoading, error: authError, getUser, signOut } = useAuthStore();
  const { 
    permission, 
    isEnabled, 
    requestPermission, 
    startNotifications, 
    stopNotifications 
  } = useNotificationStore();

  useEffect(() => {
    const init = async () => {
      try {
        await getUser();
      } catch (error) {
        console.error('Error initializing settings:', error);
        toast.error('Failed to load settings');
      }
    };
    init();
  }, [getUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (authError || !user) {
    router.push('/');
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleNotificationToggle = async () => {
    try {
      if (isEnabled) {
        stopNotifications();
        toast.success('Notifications disabled');
      } else {
        if (permission === 'granted') {
          startNotifications();
          toast.success('Notifications enabled');
        } else {
          await requestPermission();
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast.error('Failed to update notification settings');
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

  return (
    <div className="min-h-screen bg-base-200">
      <Header user={user} onSignOut={handleSignOut} />

      <div className="container mx-auto p-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Settings</h2>

            {/* Notification Settings */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base-content/70">
                      Status: <span className="font-medium">{getNotificationStatus()}</span>
                    </p>
                    {permission === 'denied' && (
                      <p className="text-sm text-error mt-1">
                        Please enable notifications in your browser settings
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`btn ${isEnabled ? 'btn-error' : 'btn-primary'}`}
                      onClick={handleNotificationToggle}
                      disabled={permission === 'denied'}
                    >
                      {isEnabled ? 'Disable' : 'Enable'} Notifications
                    </button>
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Theme</h3>
                <div className="flex items-center gap-2">
                  <select className="select select-bordered w-full max-w-xs">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="abyss">Abyss</option>
                  </select>
                </div>
              </div>

              {/* Account Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Account</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Sign In</span>
                    <span className="font-medium">
                      {new Date(user.last_sign_in_at || '').toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="space-y-2">
                  <button
                    className="btn btn-error btn-outline w-full"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 