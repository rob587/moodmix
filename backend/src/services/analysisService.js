export function analyzeEmotionMetrics(metrics) {
  const { eyeOpenness, mouthTension, blinkRate, headPosition } = metrics;

  // Calcolo stress: combinazione di tensione bocca + frequenza battiti
  const stress = Math.min(
    Math.round(mouthTension * 0.6 + blinkRate * 0.4),
    100,
  );

  // Calcolo focus: occhi aperti + testa dritta
  const focus = Math.min(
    Math.round(eyeOpenness * 0.7 + (100 - Math.abs(headPosition?.y || 0) * 20)),
    100,
  );

  // Calcolo energia: blink rate + movimento testa
  const energy = Math.min(
    Math.round(blinkRate * 0.3 + Math.abs(headPosition?.x || 0) * 30),
    100,
  );

  // Calcolo valence (positivo/negativo): combinazione di stress e focus
  const valence = Math.min(Math.round((100 - stress) * 0.6 + focus * 0.4), 100);

  let mood = "neutrale";
  if (stress > 70 && focus < 40) mood = "stressato";
  else if (stress < 30 && focus > 70) mood = "rilassato";
  else if (energy > 70 && valence > 60) mood = "entusiasta";
  else if (energy < 30 && valence < 40) mood = "stanco";
  else if (focus > 70) mood = "concentrato";
  else if (stress > 60) mood = "teso";

  return {
    stress,
    focus,
    energy,
    valence,
    mood,
    raw: metrics,
  };
}
