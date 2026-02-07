
export function formatDuration(seconds: number | string): string {
    if (!seconds) return "00:00";
    // If it's already a string like "03:31", just return it (legacy support)
    if (typeof seconds === 'string' && seconds.includes(':')) return seconds;

    const numSeconds = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
    if (isNaN(numSeconds)) return "00:00";

    const minutes = Math.floor(numSeconds / 60);
    const remainingSeconds = Math.floor(numSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
