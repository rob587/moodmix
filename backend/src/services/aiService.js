import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateMoodDescription(userId, analysis) {
  const { stress, focus, energy, valence, mood } = analysis;
}
