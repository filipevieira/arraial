// ranking.js - Gerencia pontuações no localStorage

const MAX_SCORES = 3;

export function saveScore(gameId, score) {
  if (score <= 0) return; // Não salva zero

  const scores = getTopScores(gameId);
  scores.push(score);
  // Ordena decrescente
  scores.sort((a, b) => b - a);
  // Mantém apenas os top 3
  const topScores = scores.slice(0, MAX_SCORES);
  
  localStorage.setItem(`solsticio_ranking_${gameId}`, JSON.stringify(topScores));
}

export function getTopScores(gameId) {
  const stored = localStorage.getItem(`solsticio_ranking_${gameId}`);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function getHighScore(gameId) {
  const scores = getTopScores(gameId);
  return scores.length > 0 ? scores[0] : 0;
}
