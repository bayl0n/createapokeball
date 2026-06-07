# Create a Pokeball

A browser-based 3D Pokeball customizer built with Next.js, React Three Fiber, Three.js, and Tailwind CSS. Pick colors, finishes, patterns, lighting, and backdrops, then share the design with a URL or download it as a PNG.

This is a fan-made creative tool and is not affiliated with Nintendo, Game Freak, or The Pokemon Company.

## Features

- Interactive 3D Pokeball preview with orbit controls
- Custom colors for the top shell, bottom shell, center band, button, and button highlight
- Finish options: glossy, matte, and metallic
- Pattern options: classic, stripe, split, and accent
- Lighting presets: studio, sunset, and night
- Backdrop presets: graphite, sky, mint, and plum
- Shareable URLs backed by query parameters
- PNG export from the WebGL canvas
- Responsive viewport tuning for mobile and desktop

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build.

```bash
npm run lint
```

Runs ESLint across the project.

## Project Structure

```text
app/
  globals.css              Global styling and layout rules
  layout.tsx               App metadata and root layout
  page.tsx                 Home route
components/pokeball/
  PokeballCustomizer.tsx   Main customization interface
  controls/                Reusable color and segmented controls
  scene/                   Three.js scene and Pokeball parts
hooks/
  useIsMobileViewport.ts   Mobile viewport helper
lib/pokeball/
  config.ts                Options, defaults, and material settings
  dimensions.ts            Shared geometry dimensions
  geometry.ts              Geometry helpers
  url.ts                   URL read/write helpers for shareable designs
```

## How Sharing Works

The customizer stores the current design in the browser URL as query parameters. When the page loads, `lib/pokeball/url.ts` validates those values and merges them with the default configuration. As controls change, the URL is updated with `history.replaceState`, so the current design can be copied without a page reload.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Three.js
- React Three Fiber
- Drei
- Tailwind CSS
- Lucide React
