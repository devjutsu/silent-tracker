import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useFlowStore } from '@/features/flow/flow';

interface NotificationState {
  permission: NotificationPermission;
  intervalId: ReturnType<typeof setInterval> | null;
  isEnabled: boolean;
  lastNotificationTime: number | null;
  isModalOpen: boolean;
  notificationInterval: number;
  setPermission: (permission: NotificationPermission) => void;
  setIntervalId: (id: ReturnType<typeof setInterval> | null) => void;
  setIsEnabled: (enabled: boolean) => void;
  setLastNotificationTime: (time: number | null) => void;
  setModalOpen: (isOpen: boolean) => void;
  setNotificationInterval: (interval: number) => void;
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
      notificationInterval: 60,

      setPermission: (permission) => set({ permission }),
      setIntervalId: (id) => set({ intervalId: id }),
      setIsEnabled: (enabled) => set({ isEnabled: enabled }),
      setLastNotificationTime: (time) => set({ lastNotificationTime: time }),
      setModalOpen: (isOpen) => {
        set({ isModalOpen: isOpen });
        console.log(`Modal state changed: ${isOpen}. Current intervalId: ${get().intervalId}`);

        if (!isOpen) {
          // Modal is closed, check if timer should restart
          console.log('Modal closed, checking if timer should restart.');
          if (get().isEnabled && get().permission === 'granted') {
             console.log('Notifications enabled and permitted.');
             // Start timer only if one is not already running
             if (get().intervalId === null) {
                console.log('Timer is not running, starting notifications.');
                // Use a slight delay to allow state updates to propagate if needed
                setTimeout(() => {
                     // Re-check conditions after timeout
                    if (!get().isModalOpen && get().isEnabled && get().permission === 'granted' && get().intervalId === null) {
                       console.log('Attempting to restart timer after modal close (delayed check)');
                       get().startNotifications();
                    }
                }, 100);
             } else {
                 console.log('Timer is already running, no need to restart.');
             }
          } else {
              console.log('Notifications not enabled or permitted, not restarting timer.');
          }
        } else {
          // If modal is opened and timer is running, stop it
          console.log('Modal opened, stopping notification timer.');
          get().stopNotifications();
        }
      },

      setNotificationInterval: (interval) => {
        // Ensure interval is a positive number, default to 60 if not.
        const newInterval = Math.max(1, interval || 60);
        console.log(`Setting notification interval to ${newInterval} seconds`);
        set({ notificationInterval: newInterval });
        // If notifications are currently enabled and modal is closed, restart timer with new interval
        if (get().isEnabled && get().permission === 'granted' && !get().isModalOpen) {
          console.log('Interval changed while active, restarting timer...');
          get().startNotifications();
        }
      },

      requestPermission: async () => {
        if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return;
        }

        try {
          const currentPermission = Notification.permission;
          console.log('Current notification permission:', currentPermission);

          if (currentPermission === 'denied') {
            console.log('Notification permission was denied. Please enable in browser settings.');
            set({ permission: 'denied', isEnabled: false });
            return;
          }

          const permission = await Notification.requestPermission();
          console.log('New notification permission:', permission);
          set({ permission });

          if (permission === 'granted') {
            console.log('Notification permission granted.');
            set({ isEnabled: true }); // Enable notifications
            // Start timer only if modal is closed
            if (!get().isModalOpen) {
              get().startNotifications();
            }
          } else {
            console.log('Notification permission denied.');
            get().stopNotifications(); // Stop timer
            set({ isEnabled: false }); // Disable notifications
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error);
          set({ permission: 'denied', isEnabled: false });
        }
      },

      startNotifications: () => {
        // Always clear any existing timer before starting a new one
        // Use stopNotifications to ensure intervalId is set to null
        get().stopNotifications(); 

        // Check conditions before starting the timer
        if (Notification.permission !== 'granted' || !get().isEnabled || get().isModalOpen) {
           console.log('Cannot start timer: conditions not met (permission, enabled, or modal open)');
           return;
        }

        // Check if Flow is running
        const flowStore = useFlowStore.getState();
        if (!flowStore.currentEntry) {
          console.log('Cannot start timer: Flow is not running');
          return;
        }

        // Check if we already have a timer running
        if (get().intervalId !== null) {
          console.log('Timer is already running, not starting a new one');
          return;
        }

        console.log(`Starting new notification timer with interval ${get().notificationInterval} seconds 🍎`);
        const id = setInterval(() => {
          // Re-check conditions inside interval just in case
          if (Notification.permission !== 'granted' || !get().isEnabled || get().isModalOpen) {
            console.log('Conditions changed during interval, stopping timer.');
            get().stopNotifications();
            return;
          }

          // Re-check if Flow is still running
          const currentFlowStore = useFlowStore.getState();
          if (!currentFlowStore.currentEntry) {
            console.log('Flow is no longer running, stopping timer.');
            get().stopNotifications();
            return;
          }

          console.log('Sending notification');
          const notification = new Notification('Focus Check-in', {
            body: 'How is your focus level right now?',
            icon: '/favicon.ico',
          });

          notification.onclick = () => {
            console.log('Notification clicked, opening modal and stopping timer.');
            window.focus();
            notification.close();
            // Dispatch a custom event that the app can listen to
            window.dispatchEvent(new CustomEvent('showPulseModal'));
             // The timer is stopped below, after sending the notification
          };

          set({ lastNotificationTime: Date.now() });

          // Stop the timer immediately after sending a notification
          console.log('Notification sent, stopping timer until modal is closed.');
          get().stopNotifications(); // Stop timer after sending

        }, get().notificationInterval * 1000); // Use the configured interval (in milliseconds)

        set({ intervalId: id }); // Set the new interval ID
      },

      stopNotifications: () => {
        const currentIntervalId = get().intervalId;
        if (currentIntervalId) {
          console.log('Stopping notification timer', currentIntervalId);
          clearInterval(currentIntervalId);
          set({ intervalId: null }); // Set intervalId to null when stopped
        }
         // isEnabled state is controlled by user toggle in settings, not here.
      },
    }),
    {
      name: 'notification-storage',
      // Include notificationInterval in storage
      partialize: (state) => ({
        permission: state.permission,
        isEnabled: state.isEnabled,
        notificationInterval: state.notificationInterval,
      }),
    }
  )
); 