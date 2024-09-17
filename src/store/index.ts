import { create } from 'zustand';

type useGlobalSidebarT = {
    isSidebarOpen: boolean
    toggleSidebar: (state:boolean) => void
}

export const useGlobalSidebar = create<useGlobalSidebarT>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: (newState) => set({ isSidebarOpen: newState }),
}));

