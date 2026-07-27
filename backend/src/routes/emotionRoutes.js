import express from "express";
import { analyzeEmotion, getHistory } from "../controllers/emotionController";

const router = express.Router();

router.post("/analyze", analyzeEmotion);

router.get("/history/:userId", getHistory);

export default router;
