# 3D Layout Animation Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition reusable 3D devices, cards, flow lines, and interaction effects so the SkedEz and reusable-kit compositions read clearly without component overlap, while adding deliberate frame-driven entrance motion.

**Architecture:** Keep reusable primitives in `src/components/reusable3d`, add small vector interpolation helpers, and use fixed visual slots in each composition rather than orbiting cards. Devices remain central; cards live in upper/side lanes; flow lines and badges stay close to the specific interaction they explain.

**Tech Stack:** Remotion, React, TypeScript, Three.js, React Three Fiber, `@remotion/three`.

---

### Task 1: Motion Helpers

**Files:**

- Modify: `src/components/reusable3d/motion.ts`

- [x] **Step 1: Add vector interpolation helper for frame-driven slide-ins**

### Task 2: SkedEz Layout Polish

**Files:**

- Modify: `src/templates/SkedEzDeviceShowcase/SkedEzDeviceShowcase.tsx`

- [x] **Step 1: Replace orbiting cards with fixed presentation slots**
- [x] **Step 2: Add card slide/pop entrances and subtle hold motion**
- [x] **Step 3: Reposition flow/ripple/badge so they do not cover cards or devices**

### Task 3: Reusable Kit Showcase Polish

**Files:**

- Modify: `src/templates/Reusable3DKitShowcase/Reusable3DKitShowcase.tsx`

- [x] **Step 1: Space example devices, screen panels, and cards into clear lanes**
- [x] **Step 2: Add staggered slide-in motion to each example component**

### Task 4: Verification And Commit

**Files:**

- All changed files

- [x] **Step 1: Run typecheck, lint, format, and asset checks**
- [x] **Step 2: Render multiple still frames from both compositions**
- [x] **Step 3: Commit the layout and animation polish**
