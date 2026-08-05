import React, { useEffect, useState } from "react";
import { getHistory } from "../services/apiService";

const MOOD_META = {
  stressato: { emoji: "😰", color: "#ef4444" },
  concentrato: { emoji: "🧠", color: "#22d3ee" },
  entusiasta: { emoji: "🤩", color: "#fbbf24" },
  stanco: { emoji: "😴", color: "#6b7280" },
  rilassato: { emoji: "😌", color: "#34d399" },
  teso: { emoji: "😬", color: "#f97316" },
  neutrale: { emoji: "😐", color: "#9ca3af" },
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

const MetricBar = ({ label, value, color }) => (
  <div style={{ marginBottom: "6px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "3px",
      }}
    >
      <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>{label}</span>
      <span style={{ color, fontSize: "0.75rem", fontWeight: "600" }}>
        {value}%
      </span>
    </div>
    <div
      style={{
        height: "4px",
        background: "rgba(255,255,255,0.07)",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: color,
          borderRadius: "4px",
          transition: "width 0.6s ease",
        }}
      />
    </div>
  </div>
);

const MoodHistory = ({ userId, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory(userId);
        setHistory(data.history || []);
      } catch (err) {
        setError("Impossibile caricare lo storico");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "#0f1117",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "580px",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <h2 style={{ color: "#f3f4f6", margin: 0, fontSize: "1.2rem" }}>
                📊 Storico Mood
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  margin: "4px 0 0",
                  fontSize: "0.82rem",
                }}
              >
                Le ultime scansioni di {userId}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#9ca3af",
                cursor: "pointer",
                padding: "6px 12px",
                fontSize: "0.85rem",
              }}
            >
              ✕ Chiudi
            </button>
          </div>

          <div style={{ overflowY: "auto", padding: "16px 24px", flex: 1 }}>
            {loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#6b7280",
                }}
              >
                <div
                  className="spinner"
                  style={{
                    width: "28px",
                    height: "28px",
                    margin: "0 auto 12px",
                  }}
                />
                Caricamento...
              </div>
            )}
            {error && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#ef4444",
                }}
              >
                {error}
              </div>
            )}
            {!loading && !error && history.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#6b7280",
                }}
              >
                <p style={{ fontSize: "2rem", marginBottom: "12px" }}>📭</p>
                <p>Nessuna scansione trovata.</p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    marginTop: "8px",
                    color: "#4b5563",
                  }}
                >
                  Fai la tua prima scansione!
                </p>
              </div>
            )}
            {!loading &&
              history.map((scan, index) => {
                const meta = MOOD_META[scan.mood] || {
                  emoji: "🎵",
                  color: "#a78bfa",
                };
                const isExpanded = expanded === index;
                const trackCount = scan.playlist_tracks
                  ? JSON.parse(scan.playlist_tracks).length
                  : 0;
                return (
                  <div
                    key={scan.id}
                    onClick={() => setExpanded(isExpanded ? null : index)}
                    style={{
                      background: isExpanded
                        ? `${meta.color}0f`
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isExpanded ? meta.color + "44" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: "12px",
                      padding: "14px 16px",
                      marginBottom: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>
                        {meta.emoji}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: meta.color,
                              fontWeight: "600",
                              fontSize: "0.95rem",
                              textTransform: "capitalize",
                            }}
                          >
                            {scan.mood}
                          </span>
                          {trackCount > 0 && (
                            <span
                              style={{
                                background: "rgba(255,255,255,0.07)",
                                borderRadius: "10px",
                                padding: "1px 8px",
                                fontSize: "0.72rem",
                                color: "#6b7280",
                              }}
                            >
                              🎵 {trackCount} brani
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            color: "#4b5563",
                            fontSize: "0.78rem",
                            marginTop: "2px",
                          }}
                        >
                          {formatDate(scan.created_at)}
                        </div>
                      </div>
                      <span
                        style={{
                          color: "#4b5563",
                          fontSize: "0.85rem",
                          flexShrink: 0,
                        }}
                      >
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </div>
                    {isExpanded && (
                      <div
                        style={{
                          marginTop: "14px",
                          paddingTop: "14px",
                          borderTop: "1px solid rgba(255,255,255,0.07)",
                        }}
                      >
                        <MetricBar
                          label="Stress"
                          value={scan.stress}
                          color="#ef4444"
                        />
                        <MetricBar
                          label="Focus"
                          value={scan.focus}
                          color="#22d3ee"
                        />
                        <MetricBar
                          label="Energia"
                          value={scan.energy}
                          color="#fbbf24"
                        />
                        <MetricBar
                          label="Valenza"
                          value={scan.valence}
                          color="#34d399"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodHistory;
