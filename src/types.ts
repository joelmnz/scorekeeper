export type ScoringMode = 'highest-wins' | 'lowest-wins';

export type GameTemplateId =
  | 'flip7'
  | 'scrabble'
  | 'rummy'
  | 'rummikub'
  | 'uno'
  | 'dutch-blitz'
  | 'custom';

export type GameSettings = {
  scoringMode: ScoringMode;
  targetEnabled: boolean;
  targetScore?: number;
  finishRoundAfterTarget: boolean;
  allowNegativeScores: boolean;
};

export type Player = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  addedInRound?: number;
  deactivatedAtRound?: number;
};

export type RoundScore = {
  playerId: string;
  score: number;
};

export type Round = {
  roundNumber: number;
  scores: RoundScore[];
  completedAt?: string;
};

export type Game = {
  id: string;
  name: string;
  templateId: GameTemplateId;
  settings: GameSettings;
  players: Player[];
  rounds: Round[];
  currentRoundNumber: number;
  status: 'active' | 'complete';
  createdAt: string;
  updatedAt: string;
};

export type AppStorage = {
  version: 1;
  games: Game[];
  activeGameId?: string;
};

export type Screen = 'home' | 'setup' | 'game';
