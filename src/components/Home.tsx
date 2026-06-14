import { useState } from 'react';
import type { Game, AppStorage } from '../types';
import { templates } from '../templates';
import { rankings } from '../helpers';
import { validateImport } from '../import';
import { exportGame } from '../export';
import { ConfirmModal } from './ConfirmModal';

type HomeProps = {
  store: AppStorage;
  persist: (s: AppStorage) => void;
  open: (g: Game, nextStore?: AppStorage) => void;
  startFresh: (g: Game) => void;
  setup: () => void;
};

export function Home({ store, persist, open, startFresh, setup }: HomeProps) {
  const [moreId, setMoreId] = useState<string | null>(null);
  const [confirmResetId, setConfirmResetId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const importFile = async (file?: File) => {
    if (!file) return;
    try {
      const imported = validateImport(JSON.parse(await file.text()));
      if (!imported) return alert('Invalid scorekeeper JSON');
      persist({ ...store, games: [...imported, ...store.games] });
    } catch {
      alert('Invalid scorekeeper JSON');
    }
  };

  return (
    <section>
      <div className="actions">
        <button onClick={setup}>Create Game</button>
        <label className="button ghost">
          Import Game
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => importFile(e.target.files?.[0])}
          />
        </label>
      </div>
      <div className="grid">
        {store.games.map((g) => (
          <article className="card" key={g.id}>
            <h2>{g.name}</h2>
            <p>
              {templates[g.templateId].label} · {g.players.length} players · Round{' '}
              {g.currentRoundNumber}
            </p>
            <div className="actions">
              <button className="ghost" onClick={() => setConfirmResetId(g.id)}>
                New
              </button>
              <button onClick={() => open(g)}>Resume</button>
              <button className="ghost" onClick={() => setMoreId(moreId === g.id ? null : g.id)}>
                {moreId === g.id ? 'Less' : 'More'}
              </button>
            </div>
            {moreId === g.id && (
              <div className="actions">
                <button className="ghost" onClick={() => exportGame(g, false)}>
                  Export setup
                </button>
                <button className="ghost" onClick={() => exportGame(g, true)}>
                  Export full
                </button>
                <button
                  className="danger"
                  onClick={() => setConfirmDeleteId(g.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      {confirmResetId && (
        <ConfirmModal
          title="Start a fresh game?"
          message="This will reset the current game, clear all scores and round history, and keep the same players and settings."
          confirmLabel="Reset game"
          cancelLabel="Keep current scores"
          onConfirm={() => {
            const game = store.games.find((g) => g.id === confirmResetId);
            setConfirmResetId(null);
            if (game) startFresh(game);
          }}
          onCancel={() => setConfirmResetId(null)}
        />
      )}
      {confirmDeleteId && (
        <ConfirmModal
          title="Delete this game?"
          message="This will permanently remove this saved game and its score history from this device."
          confirmLabel="Delete game"
          cancelLabel="Keep game"
          onConfirm={() => {
            persist({
              ...store,
              games: store.games.filter((g) => g.id !== confirmDeleteId),
            });
            setConfirmDeleteId(null);
            if (moreId === confirmDeleteId) setMoreId(null);
          }}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </section>
  );
}
