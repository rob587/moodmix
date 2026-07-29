import React, { useState } from "react";
import ScanFace from "./components/ScanFace";
import MoodResult from "./components/MoodResult";
import PlaylistDisplay from "./components/PlaylistDisplay";
import "./App.css";

function App() {
  const [scanResult, setScanResult] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("scan");
  const [error, setError] = useState(null);

  const handleScanComplete = (result) => {
    setScanResult(result);
    setCurrentStep("mood");
  };

  const handlePlaylistGenerated = (playlistData) => {
    setPlaylist(playlistData);
    setCurrentStep("playlist");
  };

  // Reset completo
  const handleReset = () => {
    setScanResult(null);
    setPlaylist(null);
    setCurrentStep("scan");
    setError(null);
  };

  return <></>;
}

export default App;
