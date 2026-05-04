import { create } from 'zustand'

interface FocusState {
  timeLeft: number
  duration: number // in seconds
  isActive: boolean
  points: number
  startTimer: () => void
  stopTimer: () => void
  setDuration: (seconds: number) => void
  resetTimer: (newDuration?: number) => void
  tick: () => void
  addPoints: (points: number) => void
}

export const useFocusStore = create<FocusState>((set) => ({
  timeLeft: 1500, // 25 minutes default
  duration: 1500,
  isActive: false,
  points: 0,
  startTimer: () => set({ isActive: true }),
  stopTimer: () => set({ isActive: false }),
  setDuration: (seconds) => set({ duration: seconds, timeLeft: seconds, isActive: false }),
  resetTimer: (newDuration) => set((state) => ({ 
    timeLeft: newDuration ?? state.duration, 
    isActive: false 
  })),
  tick: () => set((state) => ({ 
    timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0,
    isActive: state.timeLeft > 0 ? state.isActive : false
  })),
  addPoints: (points) => set((state) => ({ points: state.points + points })),
}))
