import type { Game, AppStorage, GameSettings } from './types';
import { templates } from './templates';
import { newId, now } from './helpers';

export function validateImport(value: unknown): Game[] | null {
  const validTemplates = Object.keys(templates);

  const normalize = (input: Partial<Game>): Game | null => {
    if (!input.name || !input.settings || !Array.isArray(input.players)) return null;
    if (!validTemplates.includes(input.templateId ?? 'custom')) return null;

    const settings = input.settings as GameSettings;
    if (!['highest-wins', 'lowest-wins'].includes(settings.scoringMode)) return null;

    const players = input.players
      .map((p) => ({
        id: p.id || newId(),
        name: String(p.name || '').trim(),
        isActive: p.isActive ?? true,
        createdAt: p.createdAt || now(),
        addedInRound: p.addedInRound ?? 1,
        deactivatedAtRound: p.deactivatedAtRound,
      }))
      .filter((p) => p.name);

    if (players.length < 2) return null;

    const rounds = Array.isArray(input.rounds)
      ? input.rounds
          .map((r) => ({
            roundNumber: Number(r.roundNumber),
            completedAt: r.completedAt,
            scores: Array.isArray(r.scores)
              ? r.scores
                  .filter(
                    (sc) =>
                      players.some((p) => p.id === sc.playerId) &&
                      Number.isFinite(sc.score),
                  )
                  .map((sc) => ({ playerId: sc.playerId, score: Number(sc.score) }))
              : [],
          }))
          .filter((r) => Number.isFinite(r.roundNumber))
      : [];

    return {
      id: input.id || newId(),
      name: String(input.name),
      templateId: input.templateId ?? 'custom',
      settings,
      players,
      rounds,
      currentRoundNumber: input.currentRoundNumber || Math.max(1, rounds.length + 1),
      status: input.status === 'complete' ? 'complete' : 'active',
      createdAt: input.createdAt || now(),
      updatedAt: now(),
    };
  };

  const rawGames: Partial<Game>[] = Array.isArray((value as Partial<AppStorage>).games)
    ? ((value as Partial<AppStorage>).games as Partial<Game>[])
    : [value as Partial<Game>];

  const games = rawGames.map(normalize);
  return games.every(Boolean) ? (games as Game[]) : null;
}
