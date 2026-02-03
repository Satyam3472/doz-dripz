export interface Track {
    id: number;
    title: string;
    artist: string;
    bpm: number;
    duration: string;
    tags: string[];
    cover: string;
    audioUrl: string; // Using a public mp3 for testing
    price: number;
}

export const TRACKS: Track[] = [
    {
        id: 1,
        title: "DAREDEVIL",
        artist: "DOZ DRIPZ",
        bpm: 126,
        duration: "03:31",
        tags: ["OPIUM", "CARTI"],
        cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvnIxeS9np_Y_ot-S4turuSlcjNd_QRmctJzwKxB3S7EuAZ2EG5rNZsjTEiwSLg5Tu0JsAPSr6l3dcw6u9k0gyg-OnTwfxl6q32eukSKjFKmlAP_0tOyh62QsiD9_IjWc5t9CqFJWYK5CXgyqI7i82sCwG3KHXsIOiSUsi0UUrEnyqTiofNyGQ31_27A02S7mEZns4BzOyUCD7sbs-HhpWySi2d4xb8STrDxkR1cr5rZlMMptIiiYvbyzONE46p10ik_LiwIGkAsw",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        price: 49.99
    },
    {
        id: 2,
        title: "BOWFLY",
        artist: "DOZ DRIPZ",
        bpm: 74,
        duration: "02:53",
        tags: ["JID", "TRAP"],
        cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDtEvXCJ_x1gw44f1TDj2p1fn9OCXQuq08oacQkT1RtDeOytzuGXoN9SXKXI1irpuM7ROqX06gxKVH4L93Z-5w4dYlImnRveVSvhXbrpy4zYMciw0g96IOp66EZyN3CfY_agBZNRBK93l1YJlBpoarSVAP7AyCCsyz1CEmcrE4RjeTZt88grpe0ncHQCes2kz282uSKwlh7bl4MHwUX-L-X53ciVxilMY0v1fV8kWrvaUtyFVPOteJHQYsETQj6oziEDP0-n1xdsI",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        price: 49.99
    },
    {
        id: 3,
        title: "KILL!",
        artist: "DOZ DRIPZ",
        bpm: 130,
        duration: "02:46",
        tags: ["ASAP", "HYPE"],
        cover: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7iLlS73nJ3HUyQXy_hVDdH1GDAdBG_UlhSD8Pg4CASrneTSTTNP5uR1M-VoBK2NewhcM5nQ6TK842P2DbQfaIvqZnHNWdTAsq7kPCAxlkABlEYK5Efbkg8at5AaoEDGWisDgiJnMeqN23cm9DYDQEWzceR6bM3RW6Xw3Rc_UQwV3j54hucvo0a-31ETB7npGbDubYxpxrgXN8Z1yeU0BDy89DDQrzZMBYdyzFcKQSYcjTK5EmbSb-fgDgXAxdmTNId25XXod9nr4",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        price: 49.99
    }
];
