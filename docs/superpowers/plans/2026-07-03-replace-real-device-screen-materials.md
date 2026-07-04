# Replace Real Device Screen Materials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the actual GLTF screen materials on the real iPhone, MacBook, and iPad models with SkedEz screenshots instead of rendering overlay planes.

**Architecture:** Extend `AppleDeviceModel` with an optional `screenTexturePath` prop. The loader will identify device-specific screen material names, clone the loaded GLTF scene, and swap the matched material maps/emissive maps with the requested screenshot texture. The showcase templates will pass screenshot paths into the real device models and remove `DeviceScreenContent3D`.

**Tech Stack:** Remotion, React Three Fiber, Three.js GLTFLoader/TextureLoader, existing Apple GLTF models.

---

### Task 1: Add GLTF Screen Material Replacement

**Files:**

- Modify: `src/components/devices/AppleDeviceModel.tsx`

- [ ] **Step 1: Add device screen material registry**

Map each Apple device id to its real GLTF screen material:

- `iphone-17-pro-max`: `screen.001`
- `macbook-pro-m3-16-2024`: `sfCQkHOWyrsLmor`
- `ipad-pro-13-m4-silver`: `otqLWQuZkhmipQs`

- [ ] **Step 2: Add `screenTexturePath` prop**

Load the requested texture with `TextureLoader`, set it to sRGB and `flipY = false`, and apply it to matched screen materials on the cloned GLTF scene.

### Task 2: Remove Overlay Screen Usage

**Files:**

- Modify: `src/templates/SkedEzDeviceShowcase/SkedEzDeviceShowcase.tsx`
- Modify: `src/templates/Reusable3DKitShowcase/Reusable3DKitShowcase.tsx`
- Modify: `src/components/reusable3d/index.ts`
- Delete: `src/components/reusable3d/DeviceScreenContent3D.tsx`

- [ ] **Step 1: Pass screen textures directly to `AppleDeviceModel`**

Use the real SkedEz screenshots:

- MacBook: `assets/skedez/dashboard.png`
- iPhone: `assets/skedez/appointments-management.png`
- iPad: `assets/skedez/smart-calendar.png`

- [ ] **Step 2: Delete the overlay screen component**

Remove `DeviceScreenContent3D` imports, exports, props, and JSX.

### Task 3: Verify Real Replacement

**Files:**

- Validate changed files and render stills.

- [ ] **Step 1: Run typecheck/lint/format/assets checks**

Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run assets:check`, and `git diff --check`.

- [ ] **Step 2: Render visual stills**

Render SkedEz and reusable-kit stills and inspect that screens are coming from the real device materials with no overlay component in the code.

- [ ] **Step 3: Commit**

Commit with message `feat: replace device screen materials`.
