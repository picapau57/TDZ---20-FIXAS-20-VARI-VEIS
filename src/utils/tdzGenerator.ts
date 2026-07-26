import { Game, GameMode, CheckResult } from '../types';

/**
 * Format string to two digits if single digit (e.g., "5" -> "05")
 */
export function formatDezena(val: string): string {
  const trimmed = val.trim();
  if (!trimmed) return '';
  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return trimmed;
  return num < 10 && num >= 0 ? `0${num}` : `${num}`;
}

/**
 * Generate games from 20 fixed numbers (10 pairs) and 20 variable numbers.
 * Supports 120 or 200 games.
 */
export function generateTDZGames(
  fixasRow1: string[],
  fixasRow2: string[],
  variaveis: string[],
  gameMode: GameMode = 120
): Game[] {
  // Build 10 pairs from row1 and row2
  const pairs: Array<[string, string]> = [];
  for (let i = 0; i < 10; i++) {
    const f1 = formatDezena(fixasRow1[i] || '');
    const f2 = formatDezena(fixasRow2[i] || '');
    pairs.push([f1, f2]);
  }

  const formattedVars = variaveis.map(v => formatDezena(v || ''));

  const games: Game[] = [];
  const maxGames = gameMode === 120 ? 120 : 200;

  for (let k = 1; k <= maxGames; k++) {
    const idx = k - 1;

    // Pair index formula matching spreadsheet structure:
    // Every 20 games advances pair sequence
    const pairIdx = (idx + Math.floor(idx / 20)) % 10;

    // Variable index formula matching spreadsheet shift:
    // Alternates variables every block of 50 games
    const varBaseShift = (Math.floor(idx / 50) % 2) * 10;
    const varInBlock = idx % 50;
    const varIdx = (varInBlock + varBaseShift) % 20;

    const pair = pairs[pairIdx] || ['', ''];
    const varNum = formattedVars[varIdx] || '';

    const numbers = [pair[0], pair[1], varNum];

    games.push({
      id: k,
      label: `J${k}`,
      numbers,
      pairIndex: pairIdx,
      variableIndex: varIdx,
      hits: 0,
      matchedNumbers: [],
    });
  }

  return games;
}

/**
 * Compare generated games against drawn result numbers
 */
export function checkTDZResults(
  games: Game[],
  fixasRow1: string[],
  fixasRow2: string[],
  variaveis: string[],
  drawnNumbersInput: string[]
): CheckResult {
  // Clean drawn numbers
  const drawnSet = new Set<string>();
  drawnNumbersInput.forEach(d => {
    const formatted = formatDezena(d);
    if (formatted) drawnSet.add(formatted);
  });

  // Calculate fixas acertos
  const allFixas = [...fixasRow1, ...fixasRow2]
    .map(formatDezena)
    .filter(Boolean);
  const fixasAcertosSet = new Set<string>();
  allFixas.forEach(f => {
    if (drawnSet.has(f)) fixasAcertosSet.add(f);
  });

  // Calculate variaveis acertos
  const allVars = variaveis.map(formatDezena).filter(Boolean);
  const variaveisAcertosSet = new Set<string>();
  allVars.forEach(v => {
    if (drawnSet.has(v)) variaveisAcertosSet.add(v);
  });

  let totalTernos = 0;
  let totalDuques = 0;

  const evaluatedGames = games.map(game => {
    const matchedNumbers: string[] = [];
    game.numbers.forEach(num => {
      if (num && drawnSet.has(num)) {
        matchedNumbers.push(num);
      }
    });

    const hits = matchedNumbers.length;
    if (hits === 3) totalTernos++;
    if (hits === 2) totalDuques++;

    return {
      ...game,
      hits,
      matchedNumbers,
    };
  });

  return {
    fixasAcertos: fixasAcertosSet.size,
    variaveisAcertos: variaveisAcertosSet.size,
    totalTernos,
    totalDuques,
    games: evaluatedGames,
  };
}
