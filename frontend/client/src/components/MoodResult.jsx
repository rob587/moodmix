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
};
