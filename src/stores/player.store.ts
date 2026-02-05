import { create } from 'zustand'

interface PlayerState {
    currentTrack: any | null
    isPlaying: boolean
    volume: number
    queue: any[]
    currentTrackIndex: number
    isShuffle: boolean
    repeatMode: 'none' | 'one' | 'all'

    play: (track: any) => void
    pause: () => void
    setVolume: (v: number) => void
    setQueue: (tracks: any[], startIndex?: number) => void
    playNext: () => void
    playPrev: () => void
    toggleShuffle: () => void
    toggleRepeat: () => void
    closePlayer: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    volume: 0.8,
    queue: [],
    currentTrackIndex: -1,
    isShuffle: false,
    repeatMode: 'none',

    play: (track) => {
        set({ currentTrack: track, isPlaying: true })
    },

    setQueue: (tracks, startIndex = 0) => {
        set({
            queue: tracks,
            currentTrackIndex: startIndex,
            currentTrack: tracks[startIndex],
            isPlaying: true
        })
    },

    playNext: () => {
        const { queue, currentTrackIndex, isShuffle, repeatMode } = get();
        if (queue.length === 0) return;

        let nextIndex = currentTrackIndex + 1;

        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * queue.length);
        } else if (nextIndex >= queue.length) {
            if (repeatMode === 'all') nextIndex = 0;
            else return; // Stop at end
        }

        set({
            currentTrackIndex: nextIndex,
            currentTrack: queue[nextIndex],
            isPlaying: true
        });
    },

    playPrev: () => {
        const { queue, currentTrackIndex, isShuffle, repeatMode } = get();
        if (queue.length === 0) return;

        let prevIndex = currentTrackIndex - 1;

        if (isShuffle) {
            prevIndex = Math.floor(Math.random() * queue.length);
        } else if (prevIndex < 0) {
            if (repeatMode === 'all') prevIndex = queue.length - 1;
            else prevIndex = 0; // Go to start
        }

        set({
            currentTrackIndex: prevIndex,
            currentTrack: queue[prevIndex],
            isPlaying: true
        });
    },

    toggleShuffle: () => set(state => ({ isShuffle: !state.isShuffle })),

    toggleRepeat: () => set(state => {
        const modes: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
        const nextIndex = (modes.indexOf(state.repeatMode) + 1) % modes.length;
        return { repeatMode: modes[nextIndex] };
    }),

    closePlayer: () => set({ currentTrack: null, isPlaying: false, queue: [] }),

    pause: () => set({ isPlaying: false }),

    setVolume: (volume) => set({ volume }),
}))
