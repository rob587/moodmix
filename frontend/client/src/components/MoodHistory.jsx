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
  return <div></div>;
};

export default MoodHistory;
