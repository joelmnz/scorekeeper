import { useState } from 'react';
import type { Game, AppStorage } from '../types';
import { templates } from '../templates';
import { rankings } from '../helpers';
import { validateImport } from '../import';
import { exportGame } from '../export';

type HomeProps = {
  store: AppStorage;
  persist: (s: AppStorage) => void;
  open: (g: Game, nextStore?: AppStorage) => void;
  setup: () => void;
};

export function Home({ store, persist, open, setup }: HomeProps) {
  const [moreId, setMoreId] = useState<string | null>(null);

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
        <button onClick={setup}>Start New Game</button>
        <label className="button ghost">
          Import Game Setup
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
                  onClick={() =>
                    persist({ ...store, games: store.games.filter((x) => x.id !== g.id) })
                  }
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
