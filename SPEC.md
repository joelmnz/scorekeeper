# Mobile Game Scorekeeper — v1 Spec

## Goal

Build a simple mobile-friendly single page web app for tracking cumulative scores across rounds for 2+ player games.

Target examples:

* Flip7
* Scrabble
* Rummy
* Dutch Blitz
* Custom game

The app must run on GitHub Pages and persist all data in browser localStorage.

---

## Recommended Tech Stack

* React
* TypeScript
* Vite
* LocalStorage
* CSS modules or plain CSS
* GitHub Pages deployment via GitHub Actions

No backend. No login. No database.

---

## Core Features

### 1. Home Screen

Show saved games.

Each saved game card shows:

* Game name
* Template/type
* Player count
* Current round
* Current leader
* Last updated
* Buttons:

  * Resume
  * New game from this setup
  * Export
  * Delete

Also show:

* Start New Game
* Import Game Setup

---

## 2. Game Setup

User can create a game from:

* Preset template
* Custom game

Fields:

* Game name
* Scoring mode:

  * Highest score wins
  * Lowest score wins
* Target score enabled: yes/no
* Target score value
* Finish round after target reached: yes/no
* Allow negative scores: yes/no
* Players list:

  * Add player
  * Rename player
  * Remove player

---

## 3. Preset Game Templates

### Flip7

* Highest score wins
* Target score: 200
* Finish current round after someone reaches 200
* Negative scores: no

### Scrabble

* Highest score wins
* No target score by default
* Negative scores: optional

### Rummy

* Lowest score wins
* No target score by default
* Negative scores: no

### Dutch Blitz

* Highest score wins
* No target score by default
* Negative scores: yes

### Custom

User chooses all settings.

---

## 4. Active Game Screen

Top section:

* Game name
* Round number
* Scoring mode
* Target score, if enabled
* Current leader / winner status

Main player list:

Each player row shows:

* Place badge, e.g. `1st`, `2nd`, `3rd`
* Player name
* Total score
* Round score status:

  * Entered
  * Missing
* Progress bar if target score is enabled
* Tap/click to enter or edit score for current round

For target games, progress bar is based on:

```text
player total / target score
```

Clamp progress display at 100%.

---

## 5. Round Scoring

Current round rules:

* Each player can have only one score per round.
* Selecting a player opens score entry.
* If score already exists, same UI edits the existing value.
* Missing score indicator remains until every active player has a value for the round.
* User can complete round only when all active players have scores.
* Starting next round increments round number.

Required actions:

* Enter score
* Edit score
* Clear score
* Complete round
* Go back to previous rounds

---

## 6. Past Round Editing

Have a “Rounds” screen or panel.

Show:

* Round number
* Player scores
* Round total/check status
* Tap a score to edit

Editing past scores must automatically recalculate totals and rankings.

---

## 7. Player Management During Game

Allow:

* Add player mid-game
* Rename player
* Remove player

Rules:

* Renaming keeps all scores.
* Removing should soft-delete/deactivate the player rather than erase history.
* Deactivated players no longer appear in new rounds.
* Past rounds still show removed players.

---

## 8. Game Completion Logic

If target score is disabled:

* Game does not auto-complete.
* User can manually end game.

If target score is enabled:

* After each completed round, check scores.
* If one or more players meet the target:

  * Finish the round first.
  * Then choose winner by scoring mode:

    * Highest score wins: highest total
    * Lowest score wins: lowest total
* Mark game as complete.
* Still allow editing scores after completion.

---

## 9. Import / Export

Export should create a JSON file containing:

* Game template/settings
* Player names
* Optional current scores

Support two export modes:

### Export Setup Only

Useful for sharing a reusable game setup.

Includes:

* Game name
* Settings
* Player names

Excludes:

* Scores
* Rounds

### Export Full Game

Includes:

* Settings
* Players
* Rounds
* Scores
* Current round
* Completed status

Import should validate the JSON before saving.

---

## 10. Suggested Data Model

```ts
type ScoringMode = "highest-wins" | "lowest-wins";

type GameTemplateId =
  | "flip7"
  | "scrabble"
  | "rummy"
  | "dutch-blitz"
  | "custom";

type GameSettings = {
  scoringMode: ScoringMode;
  targetEnabled: boolean;
  targetScore?: number;
  finishRoundAfterTarget: boolean;
  allowNegativeScores: boolean;
};

type Player = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

type RoundScore = {
  playerId: string;
  score: number;
};

type Round = {
  roundNumber: number;
  scores: RoundScore[];
  completedAt?: string;
};

type Game = {
  id: string;
  name: string;
  templateId: GameTemplateId;
  settings: GameSettings;
  players: Player[];
  rounds: Round[];
  currentRoundNumber: number;
  status: "active" | "complete";
  createdAt: string;
  updatedAt: string;
};
```

---

## 11. LocalStorage

Use one storage key:

```ts
game-scorekeeper:v1
```

Stored shape:

```ts
type AppStorage = {
  version: 1;
  games: Game[];
  activeGameId?: string;
};
```

---

## 12. Main Screens

1. Home / Saved Games
2. New Game Setup
3. Active Game Scoreboard
4. Score Entry Modal / Drawer
5. Rounds History
6. Import / Export

---

## 13. v1 Build Tasks

### Phase 1 — Project Setup

* Create React + Vite + TypeScript app
* Configure GitHub Pages deployment
* Add basic mobile-first layout

### Phase 2 — Data Layer

* Add localStorage persistence
* Add game templates
* Add score calculation helpers
* Add ranking helpers
* Add import/export helpers

### Phase 3 — Game Setup

* Build preset selection
* Build custom settings form
* Add/edit/remove player names

### Phase 4 — Active Game

* Show game name and round number
* Show player totals
* Show ranking badges
* Show target progress bars
* Add missing-score indicators

### Phase 5 — Scoring

* Add score entry/edit modal
* Enforce one score per player per round
* Complete round only when active players have scores
* Start next round

### Phase 6 — History and Editing

* Show round history
* Edit past scores
* Recalculate totals automatically

### Phase 7 — Import / Export

* Export setup only
* Export full game
* Import setup/full game
* Validate imported data

---

## 14. Non-goals for v1

* Multiplayer sync
* Cloud save
* Login/accounts
* Online sharing links
* Server backend
* Complex game-specific rules beyond cumulative scoring
