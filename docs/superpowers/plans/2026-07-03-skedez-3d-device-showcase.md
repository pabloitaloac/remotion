# SkedEz 3D Device Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an original 10-second SkedEz 3D animation with a rotating MacBook and iPhone product story, previewed in Remotion Studio instead of repeatedly rendering MP4 files.

**Architecture:** Add a standalone `SkedEzDeviceShowcase` Remotion composition at 1080x1440, 30fps, 300 frames. Use `@remotion/three`, React Three Fiber, and Three.js for the primary full-bleed 3D scene, with device screen textures from SkedEz screenshots and frame-accurate motion driven by `useCurrentFrame()`.

**Tech Stack:** Remotion 4.0.484, React 19, TypeScript, Three.js, React Three Fiber, `@remotion/three`, Tailwind CSS v4 for existing project styling.

---

## Market Reference Notes

- 3D SaaS/device references are strongest when they use restrained device choreography, real app surfaces, clean lighting, and one clear story beat instead of many UI fly-ins.
- Awwwards 3D inspiration favors visual narrative and interactive depth.
- Spline/Rotato/MockRocket-style device mockups emphasize studio-grade reflections, camera movement, customizable device angles, and clean product focus.
- Lottie/SaaS animation references reinforce small supporting motion: lightweight floating labels, status pulses, and workflow cues.

## Animation Design

- Duration: 10 seconds, 300 frames at 30fps.
- Aspect: 1080x1440 vertical, suitable for portfolio/social/product pages.
- Scene: white spatial studio with a subtle floor grid, no blobs, no decorative gradient-orb background.
- Main objects:
  - MacBook in the center/back, opening as the camera arrives.
  - iPhone floating front/right, rotating around the MacBook.
  - Floating workflow cards for Bookings, Reminders, Calendar Sync, and Analytics.
- Story beats:
  - Frames 0-70: camera glides in, MacBook settles open.
  - Frames 70-150: iPhone orbits into foreground with booking screen.
  - Frames 150-230: floating cards rotate around both devices.
  - Frames 230-300: devices align into final hero pose with SkedEz brand lockup.

## File Structure

- Modify: `package.json`
  - Add `three`, `@react-three/fiber`, `@remotion/three`, and `@types/three`.
- Modify: `package-lock.json`
  - Dependency lock update from `npm install`.
- Create: `public/assets/skedez/logo.png`
  - Copied from the SkedEz landing-page repo.
- Create: `public/assets/skedez/icon.png`
  - Copied from the SkedEz landing-page repo.
- Create: `public/assets/skedez/dashboard.png`
  - Copied from the SkedEz landing-page repo.
- Create: `public/assets/skedez/smart-calendar.png`
  - Copied from the SkedEz landing-page repo.
- Create: `public/assets/skedez/appointments-management.png`
  - Copied from the SkedEz landing-page repo.
- Create: `src/templates/SkedEzDeviceShowcase/SkedEzDeviceShowcase.tsx`
  - Full 3D composition and device scene components.
- Create: `src/templates/SkedEzDeviceShowcase/index.ts`
  - Composition export.
- Modify: `src/Root.tsx`
  - Register the new `SkedEzDeviceShowcase` composition.

## Tasks

### Task 1: Missing-Composition Check

- [ ] Run a still command before implementation.

```bash
npx remotion still SkedEzDeviceShowcase /tmp/skedez-device-red.png --frame=0
```

Expected: fail because `SkedEzDeviceShowcase` is not registered yet.

### Task 2: Dependencies and Assets

- [ ] Install Three.js integration packages with versions compatible with Remotion 4.0.484.

```bash
npm install three @react-three/fiber @remotion/three@4.0.484 @types/three
```

- [ ] Copy SkedEz assets from `/Users/pabloitaloac/Local/DEVELOPMENT/SkedEz/SkedEz-core-code/skedez.com-landing-pages/public` into `public/assets/skedez/`.

### Task 3: 3D Composition

- [ ] Create `src/templates/SkedEzDeviceShowcase/SkedEzDeviceShowcase.tsx`.
- [ ] Implement a full-bleed `<ThreeCanvas width={1080} height={1440}>`.
- [ ] Use declarative `useCurrentFrame()` animation, not `useFrame()`.
- [ ] Build MacBook and iPhone from Three.js primitives.
- [ ] Apply screenshot textures to device screens.
- [ ] Add lighting, contact shadows, floor grid, and floating workflow cards.
- [ ] Use frame ranges for the 10-second story beats.

### Task 4: Registration

- [ ] Create `src/templates/SkedEzDeviceShowcase/index.ts`.
- [ ] Register the composition in `src/Root.tsx`:

```tsx
<Composition
  id="SkedEzDeviceShowcase"
  component={SkedEzDeviceShowcase}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1440}
/>
```

### Task 5: Studio Preview and Checks

- [ ] Run typecheck.

```bash
npm run typecheck
```

- [ ] Run lint.

```bash
npm run lint
```

- [ ] Run format check.

```bash
npm run format:check
```

- [ ] Render one still only for structural verification.

```bash
npx remotion still SkedEzDeviceShowcase /tmp/skedez-device-showcase-frame150.png --frame=150
```

- [ ] Start the dev view.

```bash
npm run dev -- --port 3000
```

Expected: Remotion Studio opens with `SkedEzDeviceShowcase` available for scrubbing.
