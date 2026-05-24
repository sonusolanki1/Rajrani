import { create } from 'zustand';

const useSettingsStore = create((set) => ({
  settings: {
    siteName: 'Luxury Store',
    siteLogo: '',
    whatsappNumber: '',
  },
  setSettings: (settings) => set({ settings }),
}));

export default useSettingsStore;