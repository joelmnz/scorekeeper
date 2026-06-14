import type { Game, Player, Round } from './types';

export const now = () => new Date().toISOString();

export const newId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export function activePlayers(game: Game): Player[] {
  return game.players.filter((p) => p.isActive);
}

export function playersForRound(game: Game, roundNumber: number): Player[] {
  return game.players.filter(
    (p) =>
      (p.addedInRound ?? 1) <= roundNumber &&
      (p.deactivatedAtRound === undefined || p.deactivatedAtRound > roundNumber),
  );
}

export function round(game: Game, n = game.currentRoundNumber): Round {
  return game.rounds.find((r) => r.roundNumber === n) ?? { roundNumber: n, scores: [] };
}

export function total(game: Game, playerId: string): number {
  return game.rounds
    .flatMap((r) => r.scores)
    .filter((s) => s.playerId === playerId)
    .reduce((sum, s) => sum + s.score, 0);
}

export function rankings(game: Game): Player[] {
  const dir = game.settings.scoringMode === 'highest-wins' ? -1 : 1;
  return [...game.players].sort((a, b) => (total(game, a.id) - total(game, b.id)) * dir);
}

export function winner(game: Game): Player | undefined {
  return rankings(game)[0];
}

export function hasReachedTarget(game: Game): boolean {
  if (!game.settings.targetEnabled || !game.settings.targetScore) return false;
  return activePlayers(game).some((p) => total(game, p.id) >= game.settings.targetScore!);
}

export function place(i: number): string {
  const n = i + 1;
  return `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;
}

export function scoreFor(r: Round, playerId: string): number | undefined {
  return r.scores.find((s) => s.playerId === playerId)?.score;
}

export function updateGame(game: Game, patch: Partial<Game>): Game {
  return { ...game, ...patch, updatedAt: now() };
}

export function resetGame(game: Game): Game {
  return updateGame(game, {
    players: game.players.map((player) => ({
      ...player,
      isActive: true,
      addedInRound: 1,
      deactivatedAtRound: undefined,
    })),
    rounds: [],
    currentRoundNumber: 1,
    status: 'active',
  });
}
