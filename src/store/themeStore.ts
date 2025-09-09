import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppState = {
    theme: 'light' | 'dark';
    isSidebarOpen: boolean; // For mobile toggle
    isSidebarCollapsed: boolean; // For desktop collapse
    toggleTheme: () => void;
    toggleSidebar: () => void;
    toggleSidebarCollapse: () => void; // New function
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'light',
            isSidebarOpen: false,
            isSidebarCollapsed: false,
            toggleTheme: () =>
                set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            toggleSidebarCollapse: () =>
                set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
        }),
        {
            name: 'app-settings',
        }
    )
);