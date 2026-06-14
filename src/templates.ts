import type { GameTemplateId, GameSettings } from './types';

export const templates: Record<GameTemplateId, { label: string; settings: GameSettings }> = {
  flip7: {
    label: 'Flip7',
    settings: {
      scoringMode: 'highest-wins',
      targetEnabled: true,
      targetScore: 200,
      finishRoundAfterTarget: true,
      allowNegativeScores: false,
    },
  },
  scrabble: {
    label: 'Scrabble',
    settings: {
      scoringMode: 'highest-wins',
      targetEnabled: false,
      finishRoundAfterTarget: false,
      allowNegativeScores: true,
    },
  },
  rummy: {
    label: 'Rummy',
    settings: {
      scoringMode: 'lowest-wins',
      targetEnabled: false,
      finishRoundAfterTarget: false,
      allowNegativeScores: false,
    },
  },
  rummikub: {
    label: 'Rummikub',
    settings: {
      scoringMode: 'highest-wins',
      targetEnabled: true,
      targetScore: 500,
      finishRoundAfterTarget: true,
      allowNegativeScores: false,
    },
  },
  uno: {
    label: 'Uno',
    settings: {
      scoringMode: 'highest-wins',
      targetEnabled: true,
      targetScore: 500,
      finishRoundAfterTarget: true,
      allowNegativeScores: false,
    },
  },
  'dutch-blitz': {
    label: 'Dutch Blitz',
    settings: {
      scoringMode: 'highest-wins',
      targetEnabled: false,
      finishRoundAfterTarget: false,
      allowNegativeScores: true,
    },
  },
  custom: {
    label: 'Custom',
    settings: {
      scoringMode: 'highest-wins',
      targetEnabled: false,
      finishRoundAfterTarget: false,
      allowNegativeScores: false,
    },
  },
};
