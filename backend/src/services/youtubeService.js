import ytsr from "ytsr";

const MOOD_TO_QUERIES = {
  stressato: [
    "chill lofi hip hop",
    "relaxing music stress relief",
    "calm piano music",
  ],
  concentrato: [
    "classical music focus study",
    "jazz concentration music",
    "lo-fi focus beats",
  ],
  entusiasta: ["dance party hits 2024", "edm energy music", "upbeat pop music"],
  stanco: [
    "ambient sleep music",
    "soft acoustic songs",
    "gentle calming music",
  ],
  rilassato: ["bossa nova chill", "smooth jazz coffee", "acoustic indie chill"],
  teso: [
    "rock energy songs",
    "alternative rock playlist",
    "metal workout music",
  ],
  neutrale: ["pop hits 2024", "indie pop playlist", "top chart songs"],
};

const FALLBACK_TRACKS = {
  stressato: [
    {
      id: "jfKfPfyJRdk",
      name: "lofi hip hop radio - beats to relax/study to",
      artist: "Lofi Girl",
      albumArt: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg",
    },
    {
      id: "5qap5aO4i9A",
      name: "lofi hip hop radio - beats to study/relax to",
      artist: "Lofi Girl",
      albumArt: "https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg",
    },
  ],
  concentrato: [
    {
      id: "WPni755-Krg",
      name: "Classical Music for Brain Power - Mozart",
      artist: "OCB Relax Music",
      albumArt: "https://i.ytimg.com/vi/WPni755-Krg/mqdefault.jpg",
    },
    {
      id: "H3sv1uTBLVc",
      name: "Coffee Shop Jazz Music - Relaxing Jazz for Work",
      artist: "Cafe Music BGM",
      albumArt: "https://i.ytimg.com/vi/H3sv1uTBLVc/mqdefault.jpg",
    },
  ],
  entusiasta: [
    {
      id: "KKNfKNAMnME",
      name: "Best Party Mix 2024 | Club Music Hits",
      artist: "Nik Tunes",
      albumArt: "https://i.ytimg.com/vi/KKNfKNAMnME/mqdefault.jpg",
    },
    {
      id: "09R8_2nJtjg",
      name: "Summer Party Mix 2024 | Best Remixes",
      artist: "Spinnin' Records",
      albumArt: "https://i.ytimg.com/vi/09R8_2nJtjg/mqdefault.jpg",
    },
  ],
  stanco: [
    {
      id: "1ZYbU82GVz4",
      name: "Relaxing Sleep Music | Deep Sleeping Music",
      artist: "Yellow Brick Cinema",
      albumArt: "https://i.ytimg.com/vi/1ZYbU82GVz4/mqdefault.jpg",
    },
    {
      id: "kBNGO2V5Z2k",
      name: "Soft Music to Sleep - Relaxing Music",
      artist: "Soothing Relaxation",
      albumArt: "https://i.ytimg.com/vi/kBNGO2V5Z2k/mqdefault.jpg",
    },
  ],
  rilassato: [
    {
      id: "Dx5qFachd3A",
      name: "Bossa Nova Music - Relaxing Bossa Nova",
      artist: "Jazz Music",
      albumArt: "https://i.ytimg.com/vi/Dx5qFachd3A/mqdefault.jpg",
    },
    {
      id: "rRf2LA5W_i8",
      name: "Smooth Jazz Radio - Relaxing Jazz Music",
      artist: "Cafe Music",
      albumArt: "https://i.ytimg.com/vi/rRf2LA5W_i8/mqdefault.jpg",
    },
  ],
  teso: [
    {
      id: "y6120QOlsfU",
      name: "Darude - Sandstorm",
      artist: "Darude",
      albumArt: "https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg",
    },
    {
      id: "ktvTqknDobU",
      name: "Rock Playlist 2024 | Best Rock Songs",
      artist: "Rock Music",
      albumArt: "https://i.ytimg.com/vi/ktvTqknDobU/mqdefault.jpg",
    },
  ],
  neutrale: [
    {
      id: "q3zqJs7JUCQ",
      name: "Top Hits 2024 - Best Pop Songs Playlist",
      artist: "Pop Music",
      albumArt: "https://i.ytimg.com/vi/q3zqJs7JUCQ/mqdefault.jpg",
    },
    {
      id: "k9B9xBNqFvM",
      name: "Indie Pop Playlist 2024",
      artist: "Indie Music",
      albumArt: "https://i.ytimg.com/vi/k9B9xBNqFvM/mqdefault.jpg",
    },
  ],
};

const parseDuration = (durationStr) => {
  if (!durationStr) return 0;
  const parts = durationStr.split(":").map(Number);
  if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
  if (parts.length === 3)
    return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  return 0;
};

const searchYouTube = async (query, limit = 5) => {
  try {
    const filters = await ytsr.getFilters(query);
    const videoFilter = filters.get("Type")?.get("Video");
    const results = await ytsr(videoFilter?.url || query, { limit });
    return results.items
      .filter((item) => item.type === "video")
      .slice(0, limit)
      .map((video) => ({
        id: video.id,
        name: video.title,
        artist: video.author?.name || "YouTube",
        albumArt:
          video.bestThumbnail?.url ||
          `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
        previewUrl: `https://www.youtube.com/watch?v=${video.id}`,
        spotifyUrl: `https://www.youtube.com/watch?v=${video.id}`,
        duration: parseDuration(video.duration),
      }));
  } catch (error) {
    console.error(`Ricerca fallita per "${query}":`, error.message);
    return [];
  }
};

export const createPlaylist = async (mood, userId = "utente") => {
  const queries = MOOD_TO_QUERIES[mood] || MOOD_TO_QUERIES.neutrale;
  const genres = queries.map((q) => q.split(" ").slice(0, 2).join(" "));

  console.log(`🎵 Creando playlist per mood: ${mood}`);

  let allTracks = [];
  for (const query of queries) {
    const tracks = await searchYouTube(query, 4);
    allTracks = [...allTracks, ...tracks];
  }

  const seen = new Set();
  const uniqueTracks = allTracks.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  const shuffled = uniqueTracks.sort(() => 0.5 - Math.random()).slice(0, 10);

  const finalTracks =
    shuffled.length > 0
      ? shuffled
      : (FALLBACK_TRACKS[mood] || FALLBACK_TRACKS.neutrale).map((t) => ({
          ...t,
          previewUrl: `https://www.youtube.com/watch?v=${t.id}`,
          spotifyUrl: `https://www.youtube.com/watch?v=${t.id}`,
          duration: 0,
        }));

  console.log(`✅ Playlist creata: ${finalTracks.length} brani`);

  return {
    success: true,
    mood,
    genres,
    tracks: finalTracks,
    total: finalTracks.length,
    message: `Playlist creata con ${finalTracks.length} brani`,
  };
};

export const getMoodDescription = (mood) => {
  const descriptions = {
    stressato:
      "Hai bisogno di rilassarti. Musica chill e lo-fi per ritrovare la calma.",
    concentrato:
      "Sei in modalità focus! Musica classica e jazz per mantenere la concentrazione.",
    entusiasta:
      "Sei carico di energia! Dance e EDM per esprimere la tua gioia.",
    stanco:
      "Hai bisogno di ricaricare le energie. Musica ambient per un momento di pausa.",
    rilassato:
      "Sei in pace interiore. Bossa nova e chillout per accompagnare il momento.",
    teso: "Hai bisogno di sfogare la tensione. Rock e metal per liberare l'energia.",
    neutrale:
      "Sei in uno stato equilibrato. Pop e indie per accompagnare la tua giornata.",
  };
  return descriptions[mood] || "Musica per accompagnare il tuo momento.";
};

export default { createPlaylist, MOOD_TO_QUERIES, getMoodDescription };
