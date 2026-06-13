import { useState } from 'react';
import type { Game, GameTemplateId, GameSettings } from '../types';
import { templates } from '../templates';
import { newId, now } from '../helpers';

type SetupProps = {
  back: () => void;
  create: (g: Game) => void;
};

export function Setup({ back, create }: SetupProps) {
  const [templateId, setTemplate] = useState<GameTemplateId>('flip7');
  const [name, setName] = useState('Flip7 Night');
  const [players, setPlayers] = useState(['Player 1', 'Player 2']);
  const [settings, setSettings] = useState<GameSettings>(templates.flip7.settings);

  const choose = (t: GameTemplateId) => {
    setTemplate(t);
    setSettings(templates[t].settings);
    setName(t === 'custom' ? 'Custom Game' : `${templates[t].label} Night`);
  };

  return (
    <section className="card">
      <h2>New game setup</h2>

      <label>
        Template
        <select
          value={templateId}
          onChange={(e) => choose(e.target.value as GameTemplateId)}
        >
          {Object.entries(templates).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Game name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <div className="toggles">
        <label>
          <input
            type="checkbox"
            checked={settings.scoringMode === 'highest-wins'}
            onChange={(e) =>
              setSettings({
                ...settings,
                scoringMode: e.target.checked ? 'highest-wins' : 'lowest-wins',
              })
            }
          />{' '}
          Highest score wins
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.targetEnabled}
            onChange={(e) => setSettings({ ...settings, targetEnabled: e.target.checked })}
          />{' '}
          Target score
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.finishRoundAfterTarget}
            onChange={(e) =>
              setSettings({ ...settings, finishRoundAfterTarget: e.target.checked })
            }
          />{' '}
          Finish round after target
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.allowNegativeScores}
            onChange={(e) =>
              setSettings({ ...settings, allowNegativeScores: e.target.checked })
            }
          />{' '}
          Allow negative scores
        </label>
      </div>

      {settings.targetEnabled && (
        <label>
          Target
          <input
            type="number"
            value={settings.targetScore ?? 100}
            onChange={(e) =>
              setSettings({ ...settings, targetScore: Number(e.target.value) })
            }
          />
        </label>
      )}

      <h3>Players</h3>
      {players.map((p, i) => (
        <div className="row" key={i}>
          <input
            value={p}
            onChange={(e) =>
              setPlayers(players.map((x, n) => (n === i ? e.target.value : x)))
            }
          />
          <button
            className="danger"
            disabled={players.length < 3}
            onClick={() => setPlayers(players.filter((_, n) => n !== i))}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="actions">
        <button
          className="ghost"
          onClick={() => setPlayers([...players, `Player ${players.length + 1}`])}
        >
          Add player
        </button>
        <button
          onClick={() => {
            const cleanPlayers = players.map((p) => p.trim()).filter(Boolean);
            if (cleanPlayers.length < 2) return alert('Add at least two named players.');
            create({
              id: newId(),
              name: name.trim() || templates[templateId].label,
              templateId,
              settings,
              players: cleanPlayers.map((p) => ({
                id: newId(),
                name: p,
                isActive: true,
                createdAt: now(),
                addedInRound: 1,
              })),
              rounds: [],
              currentRoundNumber: 1,
              status: 'active',
              createdAt: now(),
              updatedAt: now(),
            });
          }}
        >
          Create game
        </button>
        <button className="ghost" onClick={back}>
          Cancel
        </button>
      </div>
    </section>
  );
}
