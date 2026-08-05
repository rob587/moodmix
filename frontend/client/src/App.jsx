import React, { useState } from "react";
import ScanFace from "./components/ScanFace";
import MoodResult from "./components/MoodResult";
import PlaylistDisplay from "./components/PlaylistDisplay";
import UserSetup from "./components/UserSetup";

function App() {
  const [userId, setUserId] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("setup");
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleUserReady = (name) => {
    setUserId(name);
    setCurrentStep("scan");
  };
  const handleScanComplete = (result) => {
    setScanResult(result);
    setCurrentStep("mood");
  };
  const handlePlaylistGenerated = (playlistData) => {
    setPlaylist(playlistData);
    setCurrentStep("playlist");
  };
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

  const getSubtitle = () => {
    if (currentStep === "setup") return "La tua playlist, in base al tuo umore";
    if (currentStep === "scan") return `Ciao ${userId}! Scansiona il tuo umore`;
    if (currentStep === "mood") return "Ecco il tuo umore!";
    if (currentStep === "playlist") return "La tua playlist personalizzata";
    return "";
  };

  return (
    <>
      <div className="app-container">
        <header className="app-header glass-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1 className="app-title neon-text">🎵 MoodMix</h1>
              <p className="app-subtitle">{getSubtitle()}</p>
            </div>
            {userId && currentStep !== "setup" && (
              <button
                onClick={() => setShowHistory(true)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  color: "#9ca3af",
                  cursor: "pointer",
                  padding: "8px 14px",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.color = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                📊 Storico
              </button>
            )}
          </div>
        </header>

        <main className="app-main">
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}
          {currentStep === "setup" && <UserSetup onReady={handleUserReady} />}
          {currentStep === "scan" && (
            <ScanFace
              userId={userId}
              onScanComplete={handleScanComplete}
              onError={showError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
          {currentStep === "mood" && scanResult && (
            <MoodResult
              userId={userId}
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

      {showHistory && userId && (
        <MoodHistory userId={userId} onClose={() => setShowHistory(false)} />
      )}
    </>
  );
}

export default App;
