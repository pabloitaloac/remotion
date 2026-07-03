# Reusable 3D SaaS Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reusable Remotion-safe 3D components for SaaS/app marketing animations and use them in the SkedEz device showcase.

**Architecture:** Build a reusable component layer under `src/components/reusable3d` for frame-driven motion, studio staging, app screen panels, SaaS cards, data-flow lines, and interaction effects. Keep device models in `src/components/devices`, use `@react-three/drei` only for static geometry helpers, and add a `Reusable3DKitShowcase` composition to preview the kit independently.

**Tech Stack:** Remotion, React, TypeScript, Three.js, React Three Fiber, `@react-three/drei`, `@remotion/three`.

---

### Task 1: Motion And Texture Utilities

**Files:**

- Create: `src/components/reusable3d/motion.ts`
- Create: `src/components/reusable3d/canvasTextures.ts`
- Create: `src/components/reusable3d/types.ts`

- [x] **Step 1: Define reusable vector and theme types**
- [x] **Step 2: Add frame-driven easing helpers**
- [x] **Step 3: Add deterministic canvas texture builders for cards, badges, and screen placeholders**

### Task 2: Reusable Visual Components

**Files:**

- Create: `src/components/reusable3d/StudioStage.tsx`
- Create: `src/components/reusable3d/SaaSCard3D.tsx`
- Create: `src/components/reusable3d/DeviceScreen3D.tsx`
- Create: `src/components/reusable3d/DataFlowLine.tsx`
- Create: `src/components/reusable3d/InteractionEffects.tsx`
- Create: `src/components/reusable3d/index.ts`

- [x] **Step 1: Add studio floor, grid, and lighting preset**
- [x] **Step 2: Add reusable 3D SaaS cards**
- [x] **Step 3: Add reusable app screen/image panel**
- [x] **Step 4: Add data-flow line with frame-driven pulses**
- [x] **Step 5: Add tap ripple and success badge effects**

### Task 3: Showcase Composition

**Files:**

- Create: `src/templates/Reusable3DKitShowcase/Reusable3DKitShowcase.tsx`
- Create: `src/templates/Reusable3DKitShowcase/index.ts`
- Modify: `src/Root.tsx`

- [x] **Step 1: Add a standalone composition that displays the reusable components**
- [x] **Step 2: Register `Reusable3DKitShowcase` in Remotion**

### Task 4: SkedEz Integration

**Files:**

- Modify: `src/templates/SkedEzDeviceShowcase/SkedEzDeviceShowcase.tsx`

- [x] **Step 1: Replace local floating card implementation with `SaaSCard3D`**
- [x] **Step 2: Replace local stage setup with `StudioStage`**
- [x] **Step 3: Add reusable data-flow and interaction effects to the animation**

### Task 5: Verification And Commit

**Files:**

- All changed files

- [x] **Step 1: Run typecheck, lint, format, asset validation**
- [x] **Step 2: Render still frames for `SkedEzDeviceShowcase` and `Reusable3DKitShowcase`**
- [x] **Step 3: Commit the reusable kit**
