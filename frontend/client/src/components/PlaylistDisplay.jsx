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

  return <div></div>;
};

export default PlaylistDisplay;
