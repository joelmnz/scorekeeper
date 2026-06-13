# Repository Guidelines

## Project Structure & Module Organization

This is a small React + TypeScript + Vite scorekeeper app for static GitHub Pages deployment. Source lives in `src/`: `main.tsx` wires app state, `types.ts` defines the data model, `storage.ts` handles `localStorage`, and `templates.ts`, `helpers.ts`, `import.ts`, and `export.ts` contain domain utilities. UI components are in `src/components/`, with shared styling in `src/styles.css`. Product requirements are in `SPEC.md`; setup notes are in `README.md`. Built assets are emitted to `dist/` and should not be committed.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start Vite on port `5176` for local development.
- `npm run build`: run TypeScript project build and produce the Vite production bundle.
- `npm test`: currently aliases `npm run build`; use it as the main verification command.
- `npm run preview`: serve the built `dist/` output locally.

The Vite config uses `base: '/scorekeeper/'`, so verify asset paths with `npm run preview` before deployment-sensitive changes.

## Coding Style & Naming Conventions

Use TypeScript with React function components and hooks. Follow the existing two-space indentation, single quotes, semicolons, and trailing commas. Name components in PascalCase (`GameView.tsx`), helper functions in camelCase, and shared domain types in PascalCase (`Game`, `RoundScore`). Coordinate persistent data changes with `AppStorage.version` and the `game-scorekeeper:v1` storage key.

## Testing Guidelines

There is no dedicated unit test framework yet. For now, `npm test` must pass before submitting changes. When adding tests, prefer focused TypeScript tests next to the module or under a future `src/__tests__/` directory, with names like `storage.test.ts` or `helpers.test.ts`. Cover score totals, import normalization, target-score completion, and player activation/deactivation when those areas change.

## Commit & Pull Request Guidelines

Recent history uses short imperative or descriptive commit subjects, for example `refactor - break out files` and `Fix GitHub Pages deployment and scorekeeping gaps`. Keep subjects concise and specific. Pull requests should include a summary, verification steps such as `npm test`, and screenshots or screen recordings for visible UI changes. Link related issues or spec sections when behavior changes, especially for scoring rules, imports/exports, persistence, or GitHub Pages deployment.

## Security & Configuration Tips

Do not commit secrets or generated local data. The app stores user game data only in browser `localStorage`; avoid adding remote persistence without documenting migration and privacy implications. Treat imported JSON as untrusted input and validate or normalize it before writing to storage.
