// backend/src/services/youtubeService.js
import YouTubeMusic from "ytmusic-api";
import dotenv from "dotenv";

dotenv.config();

const youtube = new YouTubeMusic();

// Inizializza la connessione
let isInitialized = false;

const initYouTube = async () => {
  if (!isInitialized) {
    await youtube.initialize();
    isInitialized = true;
    console.log("YouTube Music inizializzato!");
  }
  return youtube;
};

// Mappa mood → generi YouTube
const MOOD_TO_GENRE = {
  stressato: ["chill", "lo-fi", "relax"],
  concentrato: ["classical", "jazz", "focus"],
  entusiasta: ["dance", "edm", "party"],
  stanco: ["ambient", "acoustic", "sleep"],
  rilassato: ["bossa nova", "chillout", "smooth jazz"],
  teso: ["rock", "metal", "alternative"],
  neutrale: ["pop", "indie", "top hits"],
};

// Cerca canzoni su YouTube Music
const searchSongs = async (query, limit = 10) => {
  try {
    const yt = await initYouTube();
    const results = await yt.search(query, "song");
    return results.slice(0, limit);
  } catch (error) {
    console.error("Errore ricerca YouTube:", error.message);
    return [];
  }
};

// Crea playlist a partire dal mood
export const createPlaylist = async (mood, userId = "roberto") => {
  try {
    const genres = MOOD_TO_GENRE[mood] || ["pop", "indie"];

    console.log(
      `🎵 Creando playlist per mood: ${mood} → generi: ${genres.join(", ")}`,
    );

    // Cerca canzoni per ogni genere
    let allSongs = [];
    for (const genre of genres) {
      const songs = await searchSongs(genre, 5);
      allSongs = [...allSongs, ...songs];
    }

    // Rimuovi duplicati (per videoId)
    const seen = new Set();
    const uniqueSongs = allSongs.filter((song) => {
      if (seen.has(song.videoId)) return false;
      seen.add(song.videoId);
      return true;
    });

    // Mescola e prendi le prime 10
    const shuffled = uniqueSongs.sort(() => 0.5 - Math.random());
    const selectedSongs = shuffled.slice(0, 10);

    // Formatta le canzoni
    const formattedTracks = selectedSongs.map((song) => ({
      id: song.videoId,
      name: song.name,
      artist: song.artist?.name || "Artista sconosciuto",
      albumArt: song.thumbnails?.[0]?.url || "",
      previewUrl: `https://www.youtube.com/watch?v=${song.videoId}`,
      spotifyUrl: `https://www.youtube.com/watch?v=${song.videoId}`,
      duration: song.duration || 0,
    }));

    return {
      success: true,
      mood,
      genres,
      tracks: formattedTracks,
      total: formattedTracks.length,
      message:
        formattedTracks.length > 0
          ? `Playlist creata con ${formattedTracks.length} brani da YouTube`
          : "Nessun brano trovato per questo umore",
    };
  } catch (error) {
    console.error("Errore creazione playlist:", error.message);
    return {
      success: false,
      error: error.message || "Errore nella creazione della playlist",
    };
  }
};

// Recupera descrizione per il mood
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

export default {
  createPlaylist,
  MOOD_TO_GENRE,
  getMoodDescription,
};
