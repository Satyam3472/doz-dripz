import AllTracks from '../components/AllTracks';
import { getAllTracks } from '../lib/repositories/track.repo';

export const dynamic = 'force-dynamic';

export default function TracksPage() {
    const tracks = getAllTracks();
    return <AllTracks initialTracks={tracks} />;
}
