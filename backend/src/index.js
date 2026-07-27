import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MoodMix backend running on http://localhost:${PORT}`);
  console.log(`Endpoints disponibili:`);
  console.log(`   GET  /health`);
  console.log(`   POST /api/emotion/analyze`);
  console.log(`   GET  /api/emotion/history/:userId`);
  console.log(`   POST /api/playlist/generate`);
  console.log(`   GET  /api/playlist/user/:userId`);
  console.log(`   GET  /api/playlist/:id`);
});
