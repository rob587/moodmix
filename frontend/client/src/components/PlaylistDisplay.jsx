import React, { useState } from "react";

const PlaylistDisplay = ({ playlist, onReset }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { mood, genres, tracks, total, created_at } = playlist;

  const getMoodEmoji = (mood) => {
    const map = {
      stressato: "😰",
      concentrato: "🧠",
      entusiasta: "🤩",
      stanco: "😴",
      rilassato: "😌",
      teso: "😬",
      neutrale: "😐",
    };
    return map[mood] || "🎵";
  };

  const formatDuration = (ms) => {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openOnYouTube = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const togglePlay = (track) => {
    if (track?.spotifyUrl) {
      openOnYouTube(track.spotifyUrl);
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };

  return (
    <>
      <div className="playlist-display">
        {/* Header playlist */}
        <div className="playlist-header">
          <div className="playlist-mood">
            <span style={{ fontSize: "3rem" }}>{getMoodEmoji(mood)}</span>
            <h2
              style={{
                color: "#a78bfa",
                fontSize: "1.8rem",
                textTransform: "capitalize",
              }}
            >
              {mood || "Mood Mix"}
            </h2>
          </div>
          <div className="playlist-meta">
            <span style={{ color: "#6b7280" }}>🎵 {total || 0} brani</span>
            <span style={{ color: "#4b5563", fontSize: "0.8rem" }}>
              🕐 {formatDate(created_at)}
            </span>
            {genres && genres.length > 0 && (
              <div className="genre-tags">
                {genres.map((genre, i) => (
                  <span key={i} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lista canzoni */}
        <div className="track-list">
          {tracks && tracks.length > 0 ? (
            tracks.map((track, index) => (
              <div
                key={track.id || index}
                className={`track-item ${currentTrack === index ? "active" : ""}`}
                onClick={() => setCurrentTrack(index)}
                onDoubleClick={() => togglePlay(track)}
              >
                <div className="track-number">{index + 1}</div>

                <div className="track-art">
                  {track.albumArt ? (
                    <img
                      src={track.albumArt}
                      alt={track.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <div className="track-art-placeholder">🎵</div>
                  )}
                </div>

                <div className="track-info">
                  <div className="track-name">
                    {track.name || "Titolo sconosciuto"}
                  </div>
                  <div className="track-artist">
                    {track.artist || "Artista sconosciuto"}
                  </div>
                </div>

                <div className="track-duration">
                  {formatDuration(track.duration)}
                </div>

                <button
                  className="track-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay(track);
                  }}
                >
                  ▶️
                </button>
              </div>
            ))
          ) : (
            <div className="empty-playlist">
              <p style={{ color: "#6b7280" }}>
                Nessuna canzone trovata per questo umore
              </p>
              <p
                style={{
                  color: "#4b5563",
                  fontSize: "0.85rem",
                  marginTop: "5px",
                }}
              >
                Prova a generare una nuova playlist con un mood diverso
              </p>
            </div>
          )}
        </div>

        {/* Now playing (se c'è una traccia selezionata) */}
        {tracks && tracks.length > 0 && tracks[currentTrack] && (
          <div className="now-playing">
            <div className="now-playing-info">
              <span style={{ color: "#6b7280" }}>🎧 Ora in riproduzione:</span>
              <span
                style={{
                  color: "#00d4ff",
                  fontWeight: "500",
                  marginLeft: "10px",
                }}
              >
                {tracks[currentTrack].name}
              </span>
              <span style={{ color: "#6b7280", marginLeft: "10px" }}>
                — {tracks[currentTrack].artist}
              </span>
            </div>
            <button
              className="btn-neon"
              onClick={() => togglePlay(tracks[currentTrack])}
              style={{
                padding: "6px 16px",
                fontSize: "0.8rem",
                borderColor: "#00d4ff",
                color: "#00d4ff",
              }}
            >
              {isPlaying ? "⏳ Apertura..." : "▶️ Ascolta su YouTube"}
            </button>
          </div>
        )}

        {/* Pulsanti azioni */}
        <div className="playlist-actions">
          <button
            className="btn-neon"
            onClick={onReset}
            style={{ borderColor: "#6b7280", color: "#6b7280" }}
          >
            Nuova Scansione
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaylistDisplay;
