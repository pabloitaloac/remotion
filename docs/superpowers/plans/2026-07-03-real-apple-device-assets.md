# Real Apple Device Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import reusable, licensed free iPhone 17 Pro Max, MacBook Pro, and iPad Pro 3D model assets into the Remotion studio and use them from the SkedEz 3D showcase.

**Architecture:** Store device model metadata in a reusable manifest, keep downloaded `.glb` files under `public/assets/devices/apple`, and render them through shared React Three Fiber model components. Sketchfab downloads must use the official authenticated download API; if no token is available, validation fails with exact instructions instead of silently substituting fake models.

**Tech Stack:** Remotion, `@remotion/three`, React Three Fiber, Three.js GLTFLoader, Sketchfab public API, Node.js scripts.

---

### Task 1: Asset Manifest And Validation

**Files:**

- Create: `src/assets/devices/appleDeviceModels.ts`
- Create: `scripts/validate-device-assets.mjs`
- Modify: `package.json`

- [x] **Step 1: Run a failing validation for missing manifest**

Run: `node scripts/validate-device-assets.mjs`

Expected: FAIL because the script does not exist yet.

- [x] **Step 2: Create the model manifest**

Create `src/assets/devices/appleDeviceModels.ts` with selected CC Attribution Sketchfab models:

- iPhone 17 Pro Max by MajdyModels
- MacBook Pro M3 16 inch 2024 by jackbaeten
- iPad Pro 13in silver M4 by polyman Studio

- [x] **Step 3: Create validation script**

Create `scripts/validate-device-assets.mjs` to verify that each manifest entry has a local `.glb`, matching attribution metadata, and a non-empty file.

- [x] **Step 4: Add npm script**

Add `assets:check` to `package.json`.

### Task 2: Official Sketchfab Download Script

**Files:**

- Create: `scripts/download-sketchfab-devices.mjs`
- Modify: `package.json`

- [x] **Step 1: Verify official endpoint requires authentication**

Run: `curl https://api.sketchfab.com/v3/models/<uid>/download`

Expected: `401` without `SKETCHFAB_TOKEN`.

- [x] **Step 2: Create authenticated downloader**

Create `scripts/download-sketchfab-devices.mjs` to use `SKETCHFAB_TOKEN`, fetch the official `.gltf` archive URL from Sketchfab, unzip it into a temporary directory, and copy the first `.gltf`/`.glb` found into the configured local asset path.

- [x] **Step 3: Add npm script**

Add `assets:download:devices` to `package.json`.

### Task 3: Reusable 3D Device Components

**Files:**

- Create: `src/components/devices/AppleDeviceModel.tsx`
- Create: `src/components/devices/index.ts`
- Modify: `src/templates/SkedEzDeviceShowcase/SkedEzDeviceShowcase.tsx`

- [x] **Step 1: Add failing typecheck before components**

Run: `npm run typecheck`

Expected: FAIL after importing the new component before it exists.

- [x] **Step 2: Create shared GLTF model component**

Create `AppleDeviceModel` to load local GLB/GLTF files with `staticFile()` and Three.js `GLTFLoader`.

- [x] **Step 3: Replace handmade MacBook/iPhone geometry**

Use `AppleDeviceModel` for iPhone and MacBook in the SkedEz showcase and add iPad Pro as a third reusable device.

### Task 4: Verification And Commit

**Files:**

- All changed files

- [x] **Step 1: Run targeted checks**

Run:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run assets:check
```

Expected: typecheck/lint/format pass; `assets:check` fails until official model files are downloaded.

- [x] **Step 2: Commit**

Commit the reusable asset scaffold and integration.
