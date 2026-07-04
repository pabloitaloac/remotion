# Device Presentation Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the 3D SkedEz device animation from a connector-heavy carousel into a clean staged presentation where iPad, iPhone, and MacBook enter one by one, spin into place, and end screen-facing with cards around them.

**Architecture:** Replace the carousel pose helper in the SkedEz and reusable-kit showcase templates with a reusable presentation-device helper that interpolates from an offscreen pose to a fixed final pose. Remove `DataFlowLine`, `TapRipple3D`, and `SuccessBadge3D` usage/imports so the animation contains only real devices, real screen materials, stage, and cards.

**Tech Stack:** Remotion, React Three Fiber, Three.js GLTF models, existing `AppleDeviceModel`, existing reusable card/stage/motion helpers.

---

### Task 1: Replace SkedEz Carousel With Staged Device Entrances

**Files:**

- Modify: `src/templates/SkedEzDeviceShowcase/SkedEzDeviceShowcase.tsx`

- [ ] **Step 1: Remove connector/effect components**

Delete imports and JSX for `DataFlowLine`, `TapRipple3D`, and `SuccessBadge3D`.

- [ ] **Step 2: Replace carousel helper**

Replace `carouselPose`/`CarouselDevice` with `PresentedDevice`, using `mixVector3`, `mix`, and `revealProgress` to move devices from offscreen into final positions while rotating around the Y axis.

- [ ] **Step 3: Final layout**

Set final positions to iPad left, MacBook center, iPhone right. Keep final rotations screen-facing and keep cards above/below the ready device group.

### Task 2: Keep Reusable Kit Showcase Consistent

**Files:**

- Modify: `src/templates/Reusable3DKitShowcase/Reusable3DKitShowcase.tsx`

- [ ] **Step 1: Remove connector/effect components**

Delete imports and JSX for `DataFlowLine`, `TapRipple3D`, and `SuccessBadge3D`.

- [ ] **Step 2: Use the same staged presentation helper**

Mirror the clean staged device entrance pattern for the reusable-kit preview so it does not show removed effects.

### Task 3: Verify And Commit

**Files:**

- Verify changed templates only, then run project checks.

- [ ] **Step 1: Render stills**

Render early/mid/final SkedEz frames and one reusable-kit frame to confirm the entry sequence, final positions, and no line/check components.

- [ ] **Step 2: Run checks**

Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run assets:check`, and `git diff --check`.

- [ ] **Step 3: Commit**

Commit with message `feat: stage device presentation flow`.
