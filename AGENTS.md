# Repository Guidelines

## Project Structure & Module Organization

This is a Remotion studio for reusable product showcase videos. Entry points live in `src/index.ts` and `src/Root.tsx`. Video compositions live under `src/templates/`, with shared 3D UI primitives in `src/components/reusable3d/` and Apple device model rendering in `src/components/devices/`. Device metadata is in `src/assets/devices/`. Static images, GLTF models, binaries, and texture assets live in `public/assets/`. Utility scripts for rendering and asset management live in `scripts/`. Render output should go to `out/`.

## Build, Test, and Development Commands

- `npm run dev`: open Remotion Studio for local preview.
- `npm run build`: bundle the Remotion project.
- `npm run render:project`: render a configured project video.
- `npm run render:all`: render all configured outputs.
- `npm run assets:check`: validate expected local device assets.
- `npm run assets:download:devices`: download configured Sketchfab device assets.
- `npm run lint`: run ESLint on `src` and `scripts`.
- `npm run typecheck`: run TypeScript checks.
- `npm run format:check`: verify Prettier formatting.

For layout checks, render stills directly, for example:

```bash
npx remotion still src/index.ts SkedEzDeviceShowcase /tmp/check.png --frame=160 --scale=0.4
```

## Coding Style & Naming Conventions

Use TypeScript and React functional components. Keep components PascalCase, helpers camelCase, and constants SCREAMING_SNAKE_CASE only for exported duration/config values. Prefer small shared helpers in `src/components/reusable3d/` instead of duplicating animation math. Remotion animations must be driven by `useCurrentFrame()` and deterministic interpolation, not CSS transitions or `useFrame()`. Use Prettier and ESLint as the source of formatting truth.

## Testing Guidelines

There is no dedicated test runner yet. Validate changes with `npm run lint`, `npm run typecheck`, `npm run format:check`, and at least one Remotion still for visual changes. For device asset work, also run `npm run assets:check`.

## Commit & Pull Request Guidelines

History uses short conventional messages such as `feat: add fluid showcase motion` and `chore: remove markdown files`. Keep commits focused and avoid mixing generated renders with source changes. PRs should include a clear summary, validation commands, and screenshots or still-frame paths for visual changes. Use draft PRs for animation/design review until the composition is approved.

## Asset & Configuration Notes

Keep large models under `public/assets/devices/` and preserve nearby license files. Do not commit private credentials or local browser/session data. Avoid committing rendered videos unless explicitly requested.
