# Nithiesh Thulasimani — Portfolio

A light, technical, motion-first portfolio. React 19, Vite, React Three Fiber,
Framer Motion. No UI framework, no Tailwind — the whole visual system is ~1,200
lines of CSS driven by tokens.

```bash
npm install
npm run dev      # dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## The idea

Most developer portfolios put an abstract blob in the hero. This one puts the
actual work there: an **integration topology** — a glass core with five vendor
pods around it and packets travelling the links between them. That is a picture
of what the job is, which is the only reason it earns a 1 MB three.js bundle.

The same idea repeats at section scale: every case study carries its own
animated topology diagram generated from data, so the reader sees the shape of
each system before they read a word about it.

## Sections

| # | Section | What it does |
| --- | --- | --- |
| — | Hero | WebGL integration mesh, masked headline, live IST clock in the readout strip |
| 01 | About | Copy that lights word by word as it is read, three working principles, portrait plate, spec sheet |
| 02 | Work | Four case studies in a gallery that pins to the viewport and travels sideways |
| 03 | Stack | Capability matrix with meters that fill on first sight |
| 04 | Path | Roles on a spine that draws itself as the section is read |
| 05 | Contact | Email, LinkedIn, GitHub, colophon |

## Motion

Built around scroll rather than page load.

- **Hero** — the headline arrives from under a clipping mask, line by line. On
  scroll the copy lifts and dissolves while the 3D scene drifts at its own rate,
  so the two planes separate.
- **Work** — the section is exactly as tall as the gallery is wide: scroll
  distance is measured from the track, so one pixel down is one pixel sideways.
  Under 980px, and under reduced motion, it falls back to a vertical stack of
  the same cards.
- **Diagrams** — edges draw themselves in with `pathLength` on first sight, then
  packets run them with SMIL, so four live diagrams cost no JS timers.
- **Cursor** — a soft follower that swells over anything interactive. Pointer
  devices only.

Everything respects `prefers-reduced-motion`: the WebGL frameloop drops to
`demand`, the boot sequence is skipped, the marquee stops, and every reveal
renders in its final state.

## The 3D scene

`src/three/` is two files.

- `Scene.jsx` — the canvas, lit entirely by a hand-built `Environment` of
  `Lightformer`s rather than a drei HDRI preset, so nothing is fetched from a
  CDN at runtime. `flat` disables tone mapping on purpose: ACES pulls
  paper-white towards grey, which is exactly wrong for a light page.
- `IntegrationMesh.jsx` — the mesh itself. Everything is generated from the
  `PODS` table at the top: positions, the curves between them, the tubes drawn
  along those curves and the packets riding them. Adding a sixth vendor is one
  line.

The core is a rounded box with `MeshTransmissionMaterial` over an emissive
icosahedron. The heart is emissive rather than unlit — a `meshBasicMaterial`
behind transmission reads as a painted blue screen instead of something glowing
inside the glass.

Bloom is the only post effect, with the threshold set high so the packets are
the only thing in the frame that blooms.

## Edit your content here

Everything the site renders lives in **`src/data/profile.js`** — profile,
headline, spec sheet, ticker, principles, case studies (including their
diagrams), stack levels, timeline and nav.

Three placeholders are left, each marked `TODO`:

- `profile.email` — currently `hello@nithiesh.dev`
- `timeline[2].org` — currently `Add your institution`
- `timeline[0].text` — what you actually build at App Innovation Technologies

Also worth doing: drop your own photo into `public/` named `profile.jpg` (or
`.png`/`.webp`). Each candidate in `profile.portraitCandidates` is tried in
order, so nothing ever 404s visibly.

## Design

**Palette.** Paper-white page, near-black ink shifted blue so it sits inside the
palette rather than on top of it, one signal blue carrying every piece of live
state, plus teal and amber for per-case accents. Dark mode is a drafting table
at night, not an inverted page. All of it is in `src/styles/tokens.css`.

**Type.** Sora for display, Inter for reading, JetBrains Mono for anything that
reads as data (labels, readouts, diagram annotations, spec sheet), Instrument
Serif italic for the one accent line in the contact block.

**Structure.**

```
src/
  main.jsx              entry
  App.jsx               page composition
  data/profile.js       ALL content
  components/           one file per section, plus ui/ primitives
  three/                Scene.jsx (canvas) + IntegrationMesh.jsx (the mesh)
  hooks/useTheme.js     theme + media queries
  lib/motion.js         shared easings and variants
  styles/               tokens.css (design tokens) + app.css
```

## Performance

`vite.config.js` splits `three`, `@react-three/*` + `postprocessing`, and
`framer-motion` into their own chunks, and the scene is `React.lazy`-loaded and
only mounted once the boot sequence finishes — so the shell paints without
waiting on ~1.1 MB of three.js.
