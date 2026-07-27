import express from "express";
import {
  generatePlaylist,
  getPlaylists,
  getPlaylistById,
} from "../controllers/playlistController.js";

const router = express.Router();

router.post("/generate", generatePlaylist);

router.get("/user/:userId", getPlaylists);

router.get("/:id", getPlaylistById);

export default router;
