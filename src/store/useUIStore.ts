import { create } from 'zustand'

interface UIState {
  isSidebarCollapsed: boolean
  isDailyQuestVisible: boolean
  isMusicPlayerVisible: boolean
  isTimerVisible: boolean
  isSettingsOpen: boolean
  isStoreOpen: boolean
  isFullscreen: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleDailyQuest: () => void
  toggleMusicPlayer: () => void
  toggleTimer: () => void
  toggleSettings: () => void
  setSettingsOpen: (isOpen: boolean) => void
  toggleStore: () => void
  toggleFullscreen: () => void
  setIsFullscreen: (value: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isDailyQuestVisible: true,
  isMusicPlayerVisible: true,
  isTimerVisible: true,
  isSettingsOpen: false,
  isStoreOpen: false,
  isFullscreen: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleDailyQuest: () => set((state) => ({ isDailyQuestVisible: !state.isDailyQuestVisible })),
  toggleMusicPlayer: () => set((state) => ({ isMusicPlayerVisible: !state.isMusicPlayerVisible })),
  toggleTimer: () => set((state) => ({ isTimerVisible: !state.isTimerVisible })),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  toggleStore: () => set((state) => ({ isStoreOpen: !state.isStoreOpen })),
  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  },
  setIsFullscreen: (value) => set({ isFullscreen: value }),
}))
