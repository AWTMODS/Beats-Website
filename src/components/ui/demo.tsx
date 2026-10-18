import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

export const UNSPASH_DEMO_CARDS: CardItem[] = [
  {
    imgUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    alt: "Acoustic guitar and music vibes",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    alt: "DJ mixing music under neon lights",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80",
    alt: "Live vocal music performance",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    alt: "Festival concert crowd and lights",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&auto=format&fit=crop&q=80",
    alt: "Headphones and vinyl player",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
    alt: "Concert stage neon glow",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80",
    alt: "Retro vinyl record player",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80",
    alt: "Acoustic instruments and notes",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1520523839898-50712825e617?w=800&auto=format&fit=crop&q=80",
    alt: "Grand piano keys macro",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80",
    alt: "Live music crowd celebration",
  },
];

export const BEATS_APP_CARDS: CardItem[] = [
  {
    imgUrl: "/original-images/1-discover-music.jpg",
    alt: "Beats Music - Discover New Music",
  },
  {
    imgUrl: "/original-images/2-multiple-sources.jpg",
    alt: "Beats Music - Multiple Music Sources",
  },
  {
    imgUrl: "/original-images/3-your-music.png",
    alt: "Beats Music - Your Music Your Way",
  },
  {
    imgUrl: "/original-images/4-play-local.png",
    alt: "Beats Music - Play Your Local Music",
  },
  {
    imgUrl: "/original-images/5-powerful-search.png",
    alt: "Beats Music - Powerful Search",
  },
  {
    imgUrl: "/original-images/6-create-playlists.png",
    alt: "Beats Music - Create & Manage Playlists",
  },
  {
    imgUrl: "/original-images/7-organize-library.png",
    alt: "Beats Music - Organize Your Library",
  },
  {
    imgUrl: "/original-images/8-now-playing.png",
    alt: "Beats Music - Beautiful Now Playing",
  },
];

export default function Demo() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground py-12">
      <SocialCards cards={UNSPASH_DEMO_CARDS} />
    </div>
  );
}
