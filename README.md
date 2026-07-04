# Pablo Italo Remotion Studio

Reusable Remotion project for generating animated portfolio and product showcase videos.

This repo is the video factory. Websites such as `pabloitalo.com` should consume rendered files from `out/`, not install Remotion directly.

## Stack

- Remotion 4
- React 19
- TypeScript
- Tailwind CSS v4
- React Three Fiber + Drei
- JSON-driven project inputs

## Install

```console
npm install
```

## Preview

```console
npm run dev
```

Open the `ProjectShowcase` composition in Remotion Studio.

## Render One Project

```console
npm run render:project -- src/projects/pabloitalo/iluy.json
```

The output will be written to:

```console
out/pabloitalo/iluy.mp4
```

## Render All Projects

```console
npm run render:all
```

## Checks

```console
npm run lint
npm run typecheck
npm run format:check
```

## Project Data

Each video input lives under `src/projects/<group>/<slug>.json`.

```json
{
  "slug": "iluy",
  "title": "Iluy.ai",
  "subtitle": "Multi-model AI chatbot platform",
  "brand": {
    "primary": "#6d5dfc",
    "secondary": "#19d3da",
    "accent": "#f8d84a",
    "background": "#070818",
    "foreground": "#f8fbff"
  },
  "metrics": [{ "label": "Users", "value": "5k+" }],
  "features": [
    {
      "title": "Research agent",
      "detail": "Deep-search workflow with multi-step answer synthesis."
    }
  ],
  "tags": ["Next.js", "NestJS", "LangChain"]
}
```

## Assets

Store project logos, screenshots, and generated design assets in:

```console
public/assets/<group>/<project>/
```

Reference them from compositions with Remotion's `staticFile()`.

## Reusable 3D Kit

Reusable SaaS/app animation primitives live in:

```console
src/components/reusable3d/
```

The kit includes:

- `StudioStage` for lights, floor, and grid setup
- `SaaSCard3D` for reusable floating feature/metric cards
- `DeviceScreen3D` for screenshot panels
- `DataFlowLine` for animated workflow paths
- `TapRipple3D` and `SuccessBadge3D` for interaction moments
- frame-driven motion helpers in `motion.ts`

Preview the kit directly in Remotion Studio with:

```console
Reusable3DKitShowcase
```

### Reusable Apple 3D Devices

Real device models live under:

```console
public/assets/devices/apple/
```

The selected iPhone 17 Pro Max, MacBook Pro, and iPad Pro models are listed in:

```console
src/assets/devices/appleDeviceModels.json
```

They are Sketchfab Creative Commons Attribution models. Keep creator credit in:

```console
public/assets/devices/apple/ATTRIBUTION.md
```

Download the official model archives with a Sketchfab access token:

```console
SKETCHFAB_TOKEN=... npm run assets:download:devices
npm run assets:check
```

Use them in Remotion scenes through:

```tsx
import { AppleDeviceModel } from "./components/devices";
```

## Portfolio Integration

After rendering, copy the MP4/WebM files into the target site, for example:

```console
pabloitalo.com/public/project/iluy.mp4
```

The portfolio should render normal HTML video tags and stay independent from this generator repo.
