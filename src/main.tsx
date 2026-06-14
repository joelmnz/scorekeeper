import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import type { Game, AppStorage, Screen } from './types';
import { load, save } from './storage';
import { Home } from './components/Home';
import { Setup } from './components/Setup';
import { GameView } from './components/GameView';
import { ScoreModal } from './components/ScoreModal';
import { resetGame } from './helpers';

function App() {
  const [store, setStore] = useState(load);
  const [screen, setScreen] = useState<Screen>('home');
  const [editing, setEditing] = useState<{ playerId: string; roundNumber: number } | null>(null);

  const game = store.games.find((g) => g.id === store.activeGameId);

  const persist = (next: AppStorage) => {
    setStore(next);
    save(next);
  };

  const setGame = (next: Game) =>
    persist({
      ...store,
      games: store.games.map((g) => (g.id === next.id ? next : g)),
      activeGameId: next.id,
    });

  const resetAndOpenGame = (source: Game) => {
    setGame(resetGame(source));
    setScreen('game');
  };

  return (
    <main>
      <header className="app-header">
        {screen !== 'home' && (
          <button className="ghost" onClick={() => setScreen('home')}>
            ← Home
          </button>
        )}
        <h1>Scorekeeper</h1>
      </header>

      {screen === 'home' && (
        <Home
          store={store}
          persist={persist}
          open={(g, nextStore) => {
            persist({ ...(nextStore ?? store), activeGameId: g.id });
            setScreen('game');
          }}
          startFresh={resetAndOpenGame}
          setup={() => setScreen('setup')}
        />
      )}

      {screen === 'setup' && (
        <Setup
          back={() => setScreen('home')}
          create={(g) => {
            persist({ ...store, games: [g, ...store.games], activeGameId: g.id });
            setScreen('game');
          }}
        />
      )}

      {screen === 'game' && game && (
        <GameView
          game={game}
          setGame={setGame}
          startNewGame={() => resetAndOpenGame(game)}
          back={() => setScreen('home')}
          edit={setEditing}
        />
      )}

      {editing && game && (
        <ScoreModal game={game} target={editing} close={() => setEditing(null)} saveGame={setGame} />
      )}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
