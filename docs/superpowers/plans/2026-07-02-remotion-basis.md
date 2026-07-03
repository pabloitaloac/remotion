# Remotion Basis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable Remotion video studio for portfolio/project promo videos.

**Architecture:** Keep Remotion in its own repository as a generator, not inside the portfolio website. Register one data-driven `ProjectShowcase` composition first, store project render inputs as JSON, and output MP4/WebM assets that can be copied into websites.

**Tech Stack:** Remotion 4, React 19, TypeScript, Tailwind v4, Node scripts.

---

### Task 1: Scaffold Base Project

**Files:**

- Modify: `package.json`
- Modify: `README.md`
- Modify: `remotion.config.ts`

- [x] Create the Remotion blank starter from `create-video@latest`.
- [x] Keep TypeScript, Tailwind v4, and the generated Remotion config.
- [x] Add render scripts for single-project and all-project rendering.

### Task 2: Add Data-Driven Project Showcase

**Files:**

- Modify: `src/Root.tsx`
- Delete: `src/Composition.tsx`
- Create: `src/templates/ProjectShowcase/ProjectShowcase.tsx`
- Create: `src/templates/ProjectShowcase/types.ts`
- Create: `src/templates/ProjectShowcase/defaultProject.ts`
- Create: `src/projects/pabloitalo/iluy.json`

- [x] Register `ProjectShowcase` as a vertical video composition.
- [x] Define serializable project data for rendering with `--props`.
- [x] Use animation primitives from Remotion: `useCurrentFrame`, `interpolate`, `spring`, and `Sequence`.

### Task 3: Add Rendering Utilities

**Files:**

- Create: `scripts/render-project.mjs`
- Create: `scripts/render-all.mjs`
- Create: `public/assets/.gitkeep`
- Create: `out/.gitkeep`

- [x] Render one JSON project file into `out/<project>/<slug>.mp4`.
- [x] Render all JSON files under `src/projects`.
- [x] Keep `public/assets` ready for logos, screenshots, and brand assets.

### Task 4: Verify

**Commands:**

- `npm install`
- `npm run lint`
- `npm run render:project -- src/projects/pabloitalo/iluy.json`

- [x] Confirm TypeScript and ESLint pass.
- [x] Confirm at least one MP4 renders from JSON input.
