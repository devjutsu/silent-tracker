import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  permission: NotificationPermission;
  intervalId: ReturnType<typeof setInterval> | null;
  isEnabled: boolean;
  lastNotificationTime: number | null;
  isModalOpen: boolean;
  setPermission: (permission: NotificationPermission) => void;
  setIntervalId: (id: ReturnType<typeof setInterval> | null) => void;
  setIsEnabled: (enabled: boolean) => void;
  setLastNotificationTime: (time: number | null) => void;
  setModalOpen: (isOpen: boolean) => void;
  requestPermission: () => Promise<void>;
  startNotifications: () => void;
  stopNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      permission: 'default',
      intervalId: null,
      isEnabled: false,
      lastNotificationTime: null,
      isModalOpen: false,

      setPermission: (permission) => set({ permission }),
      setIntervalId: (id) => set({ intervalId: id }),
      setIsEnabled: (enabled) => set({ isEnabled: enabled }),
      setLastNotificationTime: (time) => set({ lastNotificationTime: time }),
      setModalOpen: (isOpen) => {
        set({ isModalOpen: isOpen });
        // If modal is closed and notifications are enabled, restart the timer
        if (!isOpen && get().isEnabled && get().permission === 'granted') {
          console.log('Modal closed, restarting notification timer');
          get().startNotifications();
        }
      },

      requestPermission: async () => {
        if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return;
        }

        try {
          // Check current permission status
          const currentPermission = Notification.permission;
          console.log('Current notification permission:', currentPermission);

          // If permission was previously denied, we need to guide the user to browser settings
          if (currentPermission === 'denied') {
            console.log('Notification permission was denied. Please enable in browser settings.');
            set({ permission: 'denied', isEnabled: false });
            return;
          }

          // Request permission if not already granted
          const permission = await Notification.requestPermission();
          console.log('New notification permission:', permission);
          set({ permission });

          if (permission === 'granted') {
            console.log('Notification permission granted, starting timer');
            get().startNotifications();
          } else {
            // If permission is denied, stop notifications
            get().stopNotifications();
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error);
          set({ permission: 'denied', isEnabled: false });
        }
      },

      startNotifications: () => {
        const currentIntervalId = get().intervalId;
        if (currentIntervalId) {
          console.log('Clearing existing notification timer');
          clearInterval(currentIntervalId);
        }

        // Check if permission is still granted
        if (Notification.permission !== 'granted') {
          console.log('Notification permission not granted, requesting permission');
          get().requestPermission();
          return;
        }

        // Don't start if modal is open
        if (get().isModalOpen) {
          console.log('Modal is open, skipping notification timer start');
          return;
        }

        console.log('Starting notification timer 🍎');
        const id = setInterval(() => {
          // Check permission status before sending notification
          if (Notification.permission !== 'granted') {
            console.log('Notification permission revoked, stopping timer');
            get().stopNotifications();
            return;
          }

          if (!get().isModalOpen) {
            console.log('Sending notification');
            const notification = new Notification('Focus Check-in', {
              body: 'How is your focus level right now?',
              icon: '/favicon.ico',
            });

            notification.onclick = () => {
              console.log('Notification clicked, stopping timer');
              window.focus();
              // Stop the timer when notification is clicked
              get().stopNotifications();
              // Dispatch a custom event that the app can listen to
              window.dispatchEvent(new CustomEvent('showPulseModal'));
            };

            set({ lastNotificationTime: Date.now() });
          }
        }, 60000); // 60 seconds

        set({ intervalId: id, isEnabled: true });
      },

      stopNotifications: () => {
        const currentIntervalId = get().intervalId;
        if (currentIntervalId) {
          console.log('Stopping notification timer');
          clearInterval(currentIntervalId);
          set({ intervalId: null, isEnabled: false });
        }
      },
    }),
    {
      name: 'notification-storage',
    }
  )
); 