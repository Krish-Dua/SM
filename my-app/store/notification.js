import {create} from "zustand"

const useNotificationStore = create((set) => ({
  notifications: [],
  setNotifications: (data) => set({ notifications: data }),
  addNotification: (notif) =>
    set((state) => ({ notifications: [notif, ...state.notifications] })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true }))
    })),
}));

export default useNotificationStore;