import pool from "../config/database.js";
import { emotionSchema } from "../utils/validators.js";
import { analyzeEmotionMetrics } from "../services/analysisService.js";
import { generateMoodDescription } from "../services/aiService.js";

export const analyzeEmotion = async (req, res) => {
  try {
    const { error, value } = emotionSchema.validate(req.body);
    if (error) {
      console.log("Errore validazione:", error.details[0].message);
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const { userId, landmarks, metrics, sessionId } = value;

    const analysis = analyzeEmotionMetrics(metrics);

    const moodDescription = await generateMoodDescription(userId, analysis);

    let userResult = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $1",
      [userId],
    );

    let user_id;
    if (userResult.rows.length === 0) {
      console.log("Utente non trovato, lo creo...");
      const newUser = await pool.query(
        `INSERT INTO users (username, email) 
         VALUES ($1, $2) 
         RETURNING id`,
        [userId, `${userId}@moodmix.local`],
      );
      user_id = newUser.rows[0].id;
      console.log(`Utente creato con ID: ${user_id}`);
    } else {
      user_id = userResult.rows[0].id;
      console.log(`Utente trovato con ID: ${user_id}`);
    }

    const scanResult = await pool.query(
      `INSERT INTO mood_scans (
        user_id, mood, stress, focus, energy, valence, raw_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, created_at`,
      [
        user_id,
        analysis.mood,
        analysis.stress,
        analysis.focus,
        analysis.energy,
        analysis.valence,
        JSON.stringify({ landmarks, metrics }),
      ],
    );

    res.json({
      success: true,
      analysis: {
        ...analysis,
        scanId: scanResult.rows[0].id,
        scanned_at: scanResult.rows[0].created_at,
      },
      moodDescription,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ERRORE in analyzeEmotion:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit) || 10;

    const result = await pool.query(
      `SELECT 
        ms.id,
        ms.mood,
        ms.stress,
        ms.focus,
        ms.energy,
        ms.valence,
        ms.created_at,
        p.id as playlist_id,
        p.tracks as playlist_tracks
      FROM mood_scans ms
      LEFT JOIN playlists p ON ms.id = p.mood_scan_id
      INNER JOIN users u ON ms.user_id = u.id
      WHERE u.username = $1 OR u.email = $1
      ORDER BY ms.created_at DESC
      LIMIT $2`,
      [userId, limit],
    );

    res.json({
      success: true,
      history: result.rows,
    });
  } catch (error) {
    console.error("ERRORE in getHistory:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};
