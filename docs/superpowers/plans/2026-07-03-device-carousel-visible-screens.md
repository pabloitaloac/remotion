# Device Carousel Visible Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the 3D showcase into a three-device carousel where the iPhone, MacBook, and iPad remain the only device objects and their app screens stay visible while moving.

**Architecture:** Add a reusable screen-content plane that renders app screenshots without a device frame. Use it inside real Apple model groups, then animate the three device groups around a shallow carousel path that keeps their display side biased toward the camera. Remove the freestanding `DeviceScreen3D` panels from the reusable showcase so there are no duplicate tablets/screens.

**Tech Stack:** Remotion, React Three Fiber, Three.js textures, existing Apple GLTF models, existing reusable 3D motion helpers.

---

### Task 1: Add Real-Device Screen Content

**Files:**

- Create: `src/components/reusable3d/DeviceScreenContent3D.tsx`
- Modify: `src/components/reusable3d/index.ts`

- [ ] **Step 1: Create a reusable screen overlay component**

Create `DeviceScreenContent3D.tsx` that loads a static screenshot texture and renders only a thin plane plus subtle emissive glow. It must accept `frame`, `texturePath`, `delay`, `width`, `height`, `position`, `rotation`, `scale`, `accent`, and optional `radius` props.

- [ ] **Step 2: Export the component**

Export `DeviceScreenContent3D` from `src/components/reusable3d/index.ts`.

### Task 2: Rebuild SkedEz Showcase As A Device Carousel

**Files:**

- Modify: `src/templates/SkedEzDeviceShowcase/SkedEzDeviceShowcase.tsx`

- [ ] **Step 1: Replace independent device wrappers with carousel devices**

Create a small `CarouselDevice` helper that computes a shallow x/z/y path from `frame`, an `offset`, and fixed screen-facing rotation values. Use it for exactly three `AppleDeviceModel` instances: `macbook-pro-m3-16-2024`, `iphone-17-pro-max`, and `ipad-pro-13-m4-silver`.

- [ ] **Step 2: Attach app screen content to each real device**

Add `DeviceScreenContent3D` inside each carousel device group with SkedEz screenshots:

- MacBook: `assets/skedez/dashboard.png`
- iPhone: `assets/skedez/appointments-management.png`
- iPad: `assets/skedez/smart-calendar.png`

- [ ] **Step 3: Keep supporting UI outside device silhouettes**

Move cards, badge, ripple, and data line into positions that do not cover the three screen surfaces.

### Task 3: Remove Duplicate Screens From Reusable Kit Showcase

**Files:**

- Modify: `src/templates/Reusable3DKitShowcase/Reusable3DKitShowcase.tsx`

- [ ] **Step 1: Remove freestanding `DeviceScreen3D` imports/usages**

Delete the two independent `DeviceScreen3D` panels so the composition has only the three real Apple model devices.

- [ ] **Step 2: Reuse the same carousel/screen-overlay pattern**

Attach `DeviceScreenContent3D` overlays to the MacBook, iPhone, and iPad model groups. Keep the SaaS cards and effects visible but outside the screens.

### Task 4: Verify Layout And Commit

**Files:**

- Validate changed files only, then run project checks.

- [ ] **Step 1: Render key stills**

Run Remotion still renders for the carousel at early/mid/late frames and visually inspect that all three screens are visible.

- [ ] **Step 2: Run code checks**

Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run assets:check`, and `git diff --check`.

- [ ] **Step 3: Commit**

Commit the focused changes with message `feat: add visible device carousel screens`.
