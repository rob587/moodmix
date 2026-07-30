import React, { useState } from "react";
import { generatePlaylist } from "../services/apiService";

const MoodResult = ({
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
      stanco: {
        emoji: "😴",
        color: "#6b7280",
        bg: "rgba(107, 114, 128, 0.1)",
      },
      rilassato: {
        emoji: "😌",
        color: "#34d399",
        bg: "rgba(52, 211, 153, 0.1)",
      },
      teso: {
        emoji: "😬",
        color: "#f97316",
        bg: "rgba(249, 115, 22, 0.1)",
      },
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
        userId: "roberto",
        mood: mood,
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
};
