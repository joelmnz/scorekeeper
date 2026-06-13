import type { Game } from './types';
import { newId } from './helpers';

export function exportGame(game: Game, full: boolean) {
  const data = full
    ? game
    : {
        name: game.name,
        templateId: game.templateId,
        settings: game.settings,
        players: game.players.map((p) => ({ ...p, id: newId(), isActive: true })),
      };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `${game.name.replace(/\W+/g, '-')}-${full ? 'full' : 'setup'}.json`,
  });
  a.click();
  URL.revokeObjectURL(a.href);
}
