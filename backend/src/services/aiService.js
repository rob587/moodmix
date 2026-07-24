import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateMoodDescription(userId, analysis) {
  const { stress, focus, energy, valence, mood } = analysis;

  const prompt = `
Sei MoodMix, un assistente musicale empatico che crea playlist in base all'umore.

Stai parlando con ${userId}.

Ecco i dati biometrici attuali:
- Stress: ${stress}/100
- Focus: ${focus}/100
- Energia: ${energy}/100
- Valenza (positività): ${valence}/100
- Mood rilevato: ${mood}

Rispondi in ITALIANO con questa struttura:

1. DESCRIZIONE: [descrivi il suo stato emotivo in modo empatico e umano, usando il suo nome, 2-3 frasi]
2. GENERE SUGGERITO: [un solo genere musicale tra questi: Pop, Rock, Jazz, Classica, Dance/EDM, Lo-fi/Chill, Ambient, Acustica, Metal, Indie, Bossa Nova]
3. MOTIVAZIONE: [una frase breve che lo inviti ad ascoltare la playlist]

Sii caloroso, usa un tono da amico che capisce le emozioni, mai giudicante.
Il genere suggerito deve essere esattamente uno di quelli elencati.
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Sei un assistente musicale empatico. Rispondi sempre in italiano, con calore e umanità. Scegli sempre uno dei generi musicali elencati.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content || "";
    const parsed = parseMoodResponse(content);

    return {
      description:
        parsed.description || `${userId}, il tuo stato emotivo è ${mood}.`,
      suggestedGenre: parsed.suggestedGenre || "Pop",
      motivation:
        parsed.motivation ||
        "Metti le cuffie e lasciati trasportare dalla musica!",
    };
  } catch (error) {
    console.error("Errore Groq API:", error);

    return {
      description: `${userId}, il tuo stato emotivo è ${mood}. La musica può accompagnarti in questo momento.`,
      suggestedGenre: getDefaultGenre(mood),
      motivation: "Ascolta la musica che ti fa stare bene!",
    };
  }
}
