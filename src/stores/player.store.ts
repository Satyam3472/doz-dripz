import { create } from 'zustand'

interface PlayerState {
    currentTrack: any | null
    isPlaying: boolean
    volume: number
    play: (track: any) => void
    pause: () => void
    setVolume: (v: number) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
    currentTrack: null,
    isPlaying: false,
    volume: 0.8,

    play: (track) =>
        set({ currentTrack: track, isPlaying: true }),

    pause: () =>
        set({ isPlaying: false }),

    setVolume: (volume) =>
        set({ volume }),
}))
