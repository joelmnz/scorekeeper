import type { Game } from '../types';
import { playersForRound, scoreFor, updateGame } from '../helpers';

type RoundsProps = {
  game: Game;
  edit: (e: { playerId: string; roundNumber: number }) => void;
  setGame: (g: Game) => void;
};

export function Rounds({ game, edit, setGame }: RoundsProps) {
  return (
    <section className="card">
      <h2>Players</h2>
      {game.players.map((p) => (
        <div className="row" key={p.id}>
          <input
            value={p.name}
            onChange={(e) =>
              setGame(
                updateGame(game, {
                  players: game.players.map((x) =>
                    x.id === p.id ? { ...x, name: e.target.value } : x,
                  ),
                }),
              )
            }
          />
          <button
            className="danger"
            disabled={!p.isActive}
            onClick={() =>
              setGame(
                updateGame(game, {
                  players: game.players.map((x) =>
                    x.id === p.id
                      ? { ...x, isActive: false, deactivatedAtRound: game.currentRoundNumber }
                      : x,
                  ),
                }),
              )
            }
          >
            Deactivate
          </button>
        </div>
      ))}

      <h2>Rounds</h2>
      {game.rounds.map((r) => (
        <article className="round" key={r.roundNumber}>
          <b>Round {r.roundNumber}</b>
          <p>
            Total: {r.scores.reduce((sum, s) => sum + s.score, 0)} ·{' '}
            {playersForRound(game, r.roundNumber).every(
              (p) => scoreFor(r, p.id) !== undefined,
            )
              ? 'Complete'
              : 'Missing scores'}
          </p>
          {game.players.map((p) => (
            <button
              className="chip"
              key={p.id}
              onClick={() => edit({ playerId: p.id, roundNumber: r.roundNumber })}
            >
              {p.name}: {scoreFor(r, p.id) ?? '—'}
            </button>
          ))}
        </article>
      ))}
    </section>
  );
}
