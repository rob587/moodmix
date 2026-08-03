import React from "react";

const UserSetup = ({ onReady }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Inserisci il tuo nome per continuare");
      return;
    }
    if (trimmed.length < 2) {
      setError("Il nome deve avere almeno 2 caratteri");
      return;
    }
    onReady(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <div className="user-setup">
        <div className="setup-card glass-card">
          <div
            style={{
              fontSize: "3rem",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            🎵
          </div>
          <h2
            className="neon-text"
            style={{ textAlign: "center", marginBottom: "8px" }}
          >
            Benvenuto su MoodMix
          </h2>
          <p
            style={{
              color: "#6b7280",
              textAlign: "center",
              marginBottom: "32px",
              fontSize: "0.95rem",
            }}
          >
            Scansiona il tuo volto e ricevi una playlist personalizzata in base
            al tuo umore
          </p>

          <label
            style={{
              color: "#9ca3af",
              fontSize: "0.85rem",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Come ti chiami?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Il tuo nome..."
            maxLength={30}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#f9fafb",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: error ? "8px" : "24px",
            }}
            autoFocus
          />

          {error && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "0.85rem",
                marginBottom: "16px",
              }}
            >
              {error}
            </p>
          )}

          <button
            className="btn-neon"
            onClick={handleSubmit}
            style={{ width: "100%" }}
          >
            Inizia la Scansione
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSetup;
