import { useMemo } from 'react';
import type { Game } from '../types';
import {
  rankings,
  activePlayers,
  round,
  scoreFor,
  total,
  place,
  winner,
  hasReachedTarget,
  updateGame,
  now,
  newId,
} from '../helpers';
import { Rounds } from './Rounds';

type GameViewProps = {
  game: Game;
  setGame: (g: Game) => void;
  back: () => void;
  edit: (e: { playerId: string; roundNumber: number }) => void;
};

function addPlayer(game: Game, setGame: (g: Game) => void) {
  const name = prompt('Player name?');
  if (name)
    setGame(
      updateGame(game, {
        players: [
          ...game.players,
          {
            id: newId(),
            name,
            isActive: true,
            createdAt: now(),
            addedInRound: game.currentRoundNumber,
          },
        ],
      }),
    );
}

export function GameView({ game, setGame, back, edit }: GameViewProps) {
  const ranks = useMemo(() => rankings(game), [game]);
  const playersList = useMemo(
    () => game.players.filter((p) => p.isActive),
    [game.players],
  );
  const placeByPlayerId = useMemo(() => {
    const map = new Map<string, string>();
    ranks.forEach((p, i) => {
      map.set(p.id, place(i));
    });
    return map;
  }, [ranks]);
  const current = round(game);
  const complete = activePlayers(game).every((p) => scoreFor(current, p.id) !== undefined);
  const leader = ranks[0];

  const finish = () => {
    const rounds = game.rounds.some((r) => r.roundNumber === current.roundNumber)
      ? game.rounds.map((r) =>
          r.roundNumber === current.roundNumber ? { ...current, completedAt: now() } : r,
        )
      : [...game.rounds, { ...current, completedAt: now() }];

    const g = updateGame(game, { rounds });
    const hit = hasReachedTarget(g);
    setGame(
      updateGame(g, hit ? { status: 'complete' } : { currentRoundNumber: g.currentRoundNumber + 1 }),
    );
  };

  return (
    <section>
      <div className="hero">
        <h2>{game.name}</h2>
        <p>
          Round {game.currentRoundNumber} ·{' '}
          {game.settings.scoringMode === 'highest-wins' ? 'Highest wins' : 'Lowest wins'}{' '}
          {game.settings.targetEnabled && `· Target ${game.settings.targetScore}`}
        </p>
        <strong>
          {game.status === 'complete'
            ? `Winner: ${winner(game)?.name ?? '—'}`
            : `Leader: ${leader?.name ?? '—'}`}
        </strong>
      </div>

      <div className="grid">
        {playersList.map((p) => {
          const t = total(game, p.id);
          const pct = Math.min(100, Math.max(0, (t / (game.settings.targetScore || 1)) * 100));
          return (
            <article
              className="player"
              key={p.id}
              onClick={() => edit({ playerId: p.id, roundNumber: game.currentRoundNumber })}
            >
              <b>{placeByPlayerId.get(p.id) ?? '—'}</b>
              <span>{p.name}</span>
              <strong>{t}</strong>
              <em>{scoreFor(current, p.id) === undefined ? 'Missing' : 'Entered'}</em>
              {game.settings.targetEnabled && (
                <div className="bar">
                  <i style={{ width: `${pct}%` }} />
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="actions">
        <button disabled={!complete} onClick={finish}>
          Complete round
        </button>
        <button
          className="ghost"
          disabled={game.currentRoundNumber < 2}
          onClick={() =>
            setGame(updateGame(game, { currentRoundNumber: game.currentRoundNumber - 1 }))
          }
        >
          Go to previous round
        </button>
        <button className="ghost" onClick={() => setGame(updateGame(game, { status: 'complete' }))}>
          End game
        </button>
        <button className="ghost" onClick={() => addPlayer(game, setGame)}>
          Add player
        </button>
      </div>

      <Rounds game={game} edit={edit} setGame={setGame} />
    </section>
  );
}
