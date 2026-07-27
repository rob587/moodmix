import express from "express";
import cors from "cors";
import emotionRoutes from "./routes/emotionRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "MoodMix is alive!",
    endpoints: {
      emotion: "/api/emotion",
      playlist: "/api/playlist",
    },
  });
});

app.use("/api/emotion", emotionRoutes);

app.use("/api/playlist", playlistRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint non trovato",
  });
});

app.use((err, req, res, next) => {
  console.error("Errore globale:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

export default app;
