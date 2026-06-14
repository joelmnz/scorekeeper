import { useState } from 'react';
import type { Game } from '../types';
import { round, scoreFor, updateGame } from '../helpers';

type ScoreModalProps = {
  game: Game;
  target: { playerId: string; roundNumber: number };
  close: () => void;
  saveGame: (g: Game) => void;
};

export function ScoreModal({ game, target, close, saveGame }: ScoreModalProps) {
  const r = round(game, target.roundNumber);
  const existing = scoreFor(r, target.playerId);
  const [value, setValue] = useState<string>(existing !== undefined ? String(existing) : '');
  const player = game.players.find((p) => p.id === target.playerId);

  const commit = (clear = false) => {
    if (clear) {
      const nextRound = { ...r, scores: r.scores.filter((s) => s.playerId !== target.playerId) };
      saveGame(
        updateGame(game, {
          rounds: game.rounds.some((x) => x.roundNumber === r.roundNumber)
            ? game.rounds.map((x) => (x.roundNumber === r.roundNumber ? nextRound : x))
            : [...game.rounds, nextRound],
        }),
      );
      close();
      return;
    }

    const num = value === '' ? 0 : Number(value);
    if (!Number.isFinite(num)) return alert('Enter a valid number.');
    if (!game.settings.allowNegativeScores && num < 0)
      return alert('Negative scores are disabled for this game.');

    const nextRound = {
      ...r,
      scores: [
        ...r.scores.filter((s) => s.playerId !== target.playerId),
        { playerId: target.playerId, score: num },
      ],
    };
    saveGame(
      updateGame(game, {
        rounds: game.rounds.some((x) => x.roundNumber === r.roundNumber)
          ? game.rounds.map((x) => (x.roundNumber === r.roundNumber ? nextRound : x))
          : [...game.rounds, nextRound],
      }),
    );
    close();
  };

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="sheet">
        <h2>
          {player?.name} · Round {target.roundNumber}
        </h2>
        <input
          autoFocus
          type="text"
          inputMode={game.settings.allowNegativeScores ? 'decimal' : 'numeric'}
          placeholder="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => e.key === 'Enter' && commit(false)}
        />
        <div className="actions">
          <button className="ghost" onClick={() => commit(true)}>
            Clear
          </button>
          <button className="ghost" onClick={close}>
            Cancel
          </button>
          <button onClick={() => commit(false)}>Save score</button>
        </div>
      </div>
    </div>
  );
}
