import React, { useState } from "react";
import ScanFace from "./components/ScanFace";
import MoodResult from "./components/MoodResult";
import PlaylistDisplay from "./components/PlaylistDisplay";

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

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <>
      <div className="app-container">
        {/* Header */}
        <header className="app-header glass-card">
          <h1 className="app-title neon-text">🎵 MoodMix</h1>
          <p className="app-subtitle">
            {currentStep === "scan" && "Scansiona il tuo umore"}
            {currentStep === "mood" && "Ecco il tuo umore!"}
            {currentStep === "playlist" && "La tua playlist personalizzata"}
          </p>
        </header>

        {/* Main content */}
        <main className="app-main">
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {currentStep === "scan" && (
            <ScanFace
              onScanComplete={handleScanComplete}
              onError={showError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}

          {currentStep === "mood" && scanResult && (
            <MoodResult
              scanResult={scanResult}
              onGeneratePlaylist={handlePlaylistGenerated}
              onReset={handleReset}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onError={showError}
            />
          )}

          {currentStep === "playlist" && playlist && (
            <PlaylistDisplay playlist={playlist} onReset={handleReset} />
          )}
        </main>

        <footer className="app-footer">
          <p>MoodMix — Scansiona il volto, ascolta la tua playlist</p>
        </footer>
      </div>
    </>
  );
}

export default App;
