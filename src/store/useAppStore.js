import { create } from 'zustand';

export const useAppStore = create((set) => ({
  appName: import.meta.env.VITE_APP_NAME || 'LumosTV',
  user: null,
  setUser: (user) => set({ user }),
  setAppName: (appName) => set({ appName }),
}));
