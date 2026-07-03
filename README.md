# Pablo Italo Remotion Studio

Reusable Remotion project for generating animated portfolio and product showcase videos.

This repo is the video factory. Websites such as `pabloitalo.com` should consume rendered files from `out/`, not install Remotion directly.

## Stack

- Remotion 4
- React 19
- TypeScript
- Tailwind CSS v4
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

## Portfolio Integration

After rendering, copy the MP4/WebM files into the target site, for example:

```console
pabloitalo.com/public/project/iluy.mp4
```

The portfolio should render normal HTML video tags and stay independent from this generator repo.
