import pool from "../config/database.js";
import {
  createPlaylist,
  getMoodDescription,
} from "../services/youtubeService.js";
import { playlistSchema } from "../utils/validators.js";

export const generatePlaylist = async (req, res) => {
  try {
    const { error, value } = playlistSchema.validate(req.body);
    if (error) {
      console.log("❌ Errore validazione:", error.details[0].message);
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const { userId, mood, scanId } = value;

    const playlist = await createPlaylist(mood, userId);

    if (!playlist.success) {
      return res.status(500).json({
        success: false,
        error: playlist.error || "Errore nella creazione della playlist",
      });
    }

    let userResult = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $1",
      [userId],
    );

    let user_id;
    if (userResult.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO users (username, email) 
         VALUES ($1, $2) 
         RETURNING id`,
        [userId, `${userId}@moodmix.local`],
      );
      user_id = newUser.rows[0].id;
    } else {
      user_id = userResult.rows[0].id;
    }

    const playlistResult = await pool.query(
      `INSERT INTO playlists (
        user_id, mood_scan_id, mood, genres, tracks
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at`,
      [
        user_id,
        scanId || null,
        mood,
        playlist.genres,
        JSON.stringify(playlist.tracks),
      ],
    );

    const moodDescription = getMoodDescription(mood);

    // 6. Rispondi
    res.json({
      success: true,
      playlist: {
        id: playlistResult.rows[0].id,
        mood,
        genres: playlist.genres,
        tracks: playlist.tracks,
        total: playlist.total,
        created_at: playlistResult.rows[0].created_at,
      },
      moodDescription,
      message: playlist.message,
    });
  } catch (error) {
    console.error("ERRORE in generatePlaylist:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};

export const getPlaylists = async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit) || 10;

    console.log(`Recupero playlist per utente: ${userId}`);

    const result = await pool.query(
      `SELECT 
        p.id,
        p.mood,
        p.genres,
        p.tracks,
        p.created_at,
        ms.mood as scan_mood,
        ms.stress,
        ms.focus,
        ms.energy,
        ms.valence
      FROM playlists p
      LEFT JOIN mood_scans ms ON p.mood_scan_id = ms.id
      INNER JOIN users u ON p.user_id = u.id
      WHERE u.username = $1 OR u.email = $1
      ORDER BY p.created_at DESC
      LIMIT $2`,
      [userId, limit],
    );

    res.json({
      success: true,
      playlists: result.rows,
    });
  } catch (error) {
    console.error("ERRORE in getPlaylists:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};
