import React, { useState } from "react";
import { generatePlaylist } from "../services/apiService";

const MoodResult = ({
  userId,
  scanResult,
  onGeneratePlaylist,
  onReset,
  isLoading,
  setIsLoading,
  onError,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const { analysis, moodDescription, timestamp } = scanResult;
  const { mood, stress, focus, energy, valence } = analysis || {};

  const getMoodInfo = (mood) => {
    const map = {
      stressato: {
        emoji: "😰",
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.1)",
      },
      concentrato: {
        emoji: "🧠",
        color: "#22d3ee",
        bg: "rgba(34, 211, 238, 0.1)",
      },
      entusiasta: {
        emoji: "🤩",
        color: "#fbbf24",
        bg: "rgba(251, 191, 36, 0.1)",
      },
      stanco: { emoji: "😴", color: "#6b7280", bg: "rgba(107, 114, 128, 0.1)" },
      rilassato: {
        emoji: "😌",
        color: "#34d399",
        bg: "rgba(52, 211, 153, 0.1)",
      },
      teso: { emoji: "😬", color: "#f97316", bg: "rgba(249, 115, 22, 0.1)" },
      neutrale: {
        emoji: "😐",
        color: "#9ca3af",
        bg: "rgba(156, 163, 175, 0.1)",
      },
    };
    return (
      map[mood] || {
        emoji: "😐",
        color: "#9ca3af",
        bg: "rgba(156, 163, 175, 0.1)",
      }
    );
  };

  const handleGeneratePlaylist = async () => {
    setIsGenerating(true);
    setIsLoading(true);
    try {
      const result = await generatePlaylist({
        userId,
        mood,
        scanId: analysis?.scanId || null,
      });
      if (result.success) {
        onGeneratePlaylist(result.playlist);
      } else {
        onError(result.error || "Errore nella generazione della playlist");
      }
    } catch (error) {
      onError("Errore: " + error.message);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const moodInfo = getMoodInfo(mood);

  return (
    <div className="mood-result">
      <div
        className="mood-card"
        style={{
          background: moodInfo.bg,
          borderColor: moodInfo.color,
          borderWidth: "2px",
          borderStyle: "solid",
        }}
      >
        <div style={{ fontSize: "4rem", textAlign: "center" }}>
          {moodInfo.emoji}
        </div>
        <h2
          style={{
            color: moodInfo.color,
            textAlign: "center",
            fontSize: "2rem",
            textTransform: "capitalize",
            marginTop: "10px",
          }}
        >
          {mood || "Non rilevato"}
        </h2>
        <p
          style={{
            color: "#9ca3af",
            textAlign: "center",
            marginTop: "10px",
            fontSize: "1rem",
            lineHeight: "1.6",
          }}
        >
          {moodDescription?.description || "Analisi emotiva completata"}
        </p>
        {moodDescription?.motivation && (
          <p
            style={{
              color: "#fcd34d",
              textAlign: "center",
              marginTop: "10px",
              fontStyle: "italic",
              fontSize: "0.95rem",
            }}
          >
            💫 {moodDescription.motivation}
          </p>
        )}
        <p
          style={{
            color: "#4b5563",
            textAlign: "center",
            marginTop: "10px",
            fontSize: "0.8rem",
          }}
        >
          {formatDate(timestamp)}
        </p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Stress</span>
          <span className="metric-value" style={{ color: "#ef4444" }}>
            {stress || 0}%
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Focus</span>
          <span className="metric-value" style={{ color: "#22d3ee" }}>
            {focus || 0}%
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Energia</span>
          <span className="metric-value" style={{ color: "#fbbf24" }}>
            {energy || 0}%
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Valenza</span>
          <span className="metric-value" style={{ color: "#34d399" }}>
            {valence || 0}%
          </span>
        </div>
      </div>

      {moodDescription?.suggestedGenre && (
        <div className="suggested-genre">
          <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
            Genere suggerito:
          </span>
          <span
            style={{
              color: "#a78bfa",
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginLeft: "10px",
            }}
          >
            {moodDescription.suggestedGenre}
          </span>
        </div>
      )}

      <div className="result-actions">
        <button
          className="btn-neon btn-neon-purple"
          onClick={handleGeneratePlaylist}
          disabled={isGenerating || isLoading}
        >
          {isGenerating ? "Generazione..." : "Genera Playlist"}
        </button>
        <button
          className="btn-neon"
          onClick={onReset}
          style={{ borderColor: "#6b7280", color: "#6b7280" }}
          disabled={isGenerating}
        >
          Nuova Scansione
        </button>
      </div>
    </div>
  );
};

export default MoodResult;
