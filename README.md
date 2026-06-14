# Scorekeeper

Mobile-friendly score tracking for round-based tabletop and party games. The app is built as a static React + TypeScript + Vite site, stores everything in browser `localStorage`, and is configured for GitHub Pages deployment.

## What It Does

The current implementation supports:

- Creating a new game from preset templates: `Flip7`, `Scrabble`, `Rummy`, `Dutch Blitz`, and `Custom`
- Configuring scoring mode, target score, finish-after-target, and negative-score support
- Managing players during setup
- Saving games locally under the `game-scorekeeper:v1` storage key
- Viewing saved games from a home screen
- Resuming a game, cloning a setup into a new game, exporting setup JSON, exporting full game JSON, and deleting a game
- Entering, editing, and clearing scores for any round
- Completing rounds only when all active players have scores
- Viewing round history and editing past scores
- Renaming players and deactivating players mid-game
- Auto-completing a game when a target score is reached
- Importing scorekeeper JSON back into the app
- Installing the app as a PWA from supported browsers
- Reloading the app shell after the first visit even when offline

## Tech Stack

- React
- TypeScript
- Vite
- vite-plugin-pwa / Workbox
- Plain CSS
- `localStorage` for persistence
- GitHub Actions + GitHub Pages for deployment

## Project Structure

This is intentionally very small right now:

- [SPEC.md](/home/joel/source/scorekeeper/SPEC.md): product spec for v1
- [src/main.tsx](/home/joel/source/scorekeeper/src/main.tsx): the full app, state management, data model, helpers, and UI
- [src/styles.css](/home/joel/source/scorekeeper/src/styles.css): app styling
- [.github/workflows/deploy.yml](/home/joel/source/scorekeeper/.github/workflows/deploy.yml): GitHub Pages deployment workflow

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build locally:

```bash
npm run preview
```

## Deployment

The repository includes a GitHub Actions workflow that:

- runs on pushes to `main`
- installs dependencies with `npm install`
- builds the app with `npm run build`
- uploads `dist/`
- deploys to GitHub Pages

The Vite config uses `base: '/scorekeeper/'`, matching the GitHub Pages project path. The production build also emits a web app manifest and service worker so the app can be installed and reloaded offline after the first successful visit.

For deployment-sensitive changes, run:

```bash
npm run build
npm run preview
```

Then verify that the manifest, icons, and service worker are served under `/scorekeeper/`.

## Data Model and Persistence

The app follows the spec’s general data model:

- `Game`
- `GameSettings`
- `Player`
- `Round`
- `RoundScore`
- `AppStorage`

All data is stored locally in browser `localStorage` under:

```ts
game-scorekeeper:v1
```

Import accepts either:

- a full app-style payload with a `games` array
- a single game/setup object

Export supports:

- setup-only JSON
- full game JSON

## Current Implementation Notes

The app already covers a good portion of the spec, but a few items are still simplified or missing:

- The app is implemented in a single React entry file rather than split into feature modules.
- Navigation is screen-state based inside the SPA; there is no router.
- “Go to previous round” changes the current round number, but there is no dedicated rounds screen route or drawer.
- Player removal is implemented as deactivation, which matches the spec’s soft-delete intent.
- Import validation is lightweight and normalization-based rather than schema-driven.
- Setup import and full-game import currently flow through the same importer.
- Auto-complete logic checks whether an active player total is greater than or equal to the target score, which fits “highest wins” games well but is not yet nuanced for “lowest wins” target behavior.

## Known Gaps Against `SPEC.md`

- No dedicated “Import Game Setup” vs “Import Full Game” distinction in the UI
- No manual validation/reporting UI beyond alert-based errors
- No explicit current-round winner/status messaging beyond leader/winner text
- No separate component architecture or test suite yet
- No schema-based JSON validation
- No game-specific rules beyond cumulative scoring

## Testing

The `test` script currently runs the production build:

```bash
npm test
```

At the moment this workspace does not have dependencies installed, so local verification will fail until `npm install` has been run.

## License

MIT. See [LICENSE](/home/joel/source/scorekeeper/LICENSE).
