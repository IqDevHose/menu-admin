import { create } from 'zustand';

const useGlobalSidebar = create((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useGlobalSidebar;
