import { useEffect, useRef, useState } from 'react'

/* Hand-drawn, looping vignettes for the project cards - one per `scene` key in
   profile.js. Pure SVG/CSS in the forest palette; the animations only run
   while the card is on screen. */

const Leaf = ({ className }) => (
  <svg className={className} viewBox="-6 -8 12 16" aria-hidden>
    <path d="M0 -7C4 -4 4 3 0 7C-4 3 -4 -4 0 -7Z" />
    <path className="scene__vein" d="M0 -6V6" />
  </svg>
)

function Leaves() {
  return (
    <div className="scene__leaves" aria-hidden>
      <Leaf className="scene__leaf scene__leaf--1" />
      <Leaf className="scene__leaf scene__leaf--2" />
      <Leaf className="scene__leaf scene__leaf--3" />
    </div>
  )
}

/* Suvadu: a notebook that opens, turns two pages, sketches a leaf, closes. */
function Notebook() {
  return (
    <div className="nbs">
      <div className="nb">
        <div className="nb__block">
          <svg className="nb__doodle" viewBox="0 0 60 80" aria-hidden>
            <path className="nb__ink nb__ink--1" d="M30 70C30 52 30 36 30 16" />
            <path className="nb__ink nb__ink--2" d="M30 16C44 24 46 46 30 58C14 46 16 24 30 16Z" />
            <path className="nb__ink nb__ink--3" d="M30 40L39 32M30 48L21 40" />
          </svg>
        </div>
        <div className="nb__leaf nb__page nb__page--2">
          <div className="nb__face nb__face--page" />
          <div className="nb__face nb__face--page nb__face--back" />
        </div>
        <div className="nb__leaf nb__page nb__page--1">
          <div className="nb__face nb__face--page" />
          <div className="nb__face nb__face--page nb__face--back" />
        </div>
        <div className="nb__leaf nb__cover">
          <div className="nb__face nb__face--cover">
            <span className="nb__frame" />
            <Leaf className="nb__emblem" />
            <span className="nb__word">Suvadu</span>
            <span className="nb__sub mono">make your mark</span>
            <span className="nb__band" />
          </div>
          <div className="nb__face nb__face--inside nb__face--back" />
        </div>
      </div>
      <span className="nbs__shadow" />
    </div>
  )
}

/* Doctor's Water: the cap pops, the 20L bottle tips and waters a sapling,
   which grows its leaves as the water reaches it. The bottle is drawn around
   (160, 120), then scaled down and set off to the right; the water inside
   counter-rotates so its surface stays level while the bottle tilts. */
const LEAVES = [
  { x: 70, y: 166, r: -58, s: 0.8 },
  { x: 71, y: 156, r: 56, s: 0.9 },
  { x: 70, y: 145, r: -48, s: 1 },
  { x: 71, y: 136, r: 46, s: 0.9 },
  { x: 70, y: 126, r: 0, s: 0.85 },
]

function WaterJug() {
  const shell =
    'M147 50L147 58C147 70 105 72 105 92L105 170Q105 182 117 182L203 182Q215 182 215 170L215 92C215 72 173 70 173 58L173 50Z'
  let wave = 'M-120 0'
  for (let x = -120; x < 440; x += 20) wave += `q10 ${x % 40 ? 4 : -4} 20 0`
  wave += 'L440 300L-120 300Z'
  const stream = 'M195 114C178 114 134 126 120 174'

  return (
    <svg className="jug" viewBox="0 0 320 200" aria-hidden>
      <defs>
        <clipPath id="jug-clip">
          <path d={shell} />
        </clipPath>
      </defs>

      <ellipse className="jug__floor" cx="240" cy="188" rx="42" ry="3.5" />
      <path className="jug__grass" d="M28 188c2-10 4-14 3-20M34 188c0-8 3-12 6-16M40 188c-1-6 0-9 2-12M292 188c-2-9-1-14 1-19M298 188c1-7 4-11 7-14" />

      {/* the sapling */}
      <g transform="translate(34 0)">
        <ellipse className="plant__wet" cx="76" cy="184" rx="30" ry="4" />
        <path className="plant__soil" d="M44 186Q70 170 102 186Z" />
        <g className="plant__ripples">
          <ellipse cx="86" cy="180" rx="8" ry="2" />
          <ellipse cx="86" cy="180" rx="8" ry="2" />
        </g>
        <path className="plant__stem" d="M70 180C70 164 72 150 70 124" pathLength="1" />
        {LEAVES.map((l, i) => (
          <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
            <path className={`plant__leaf plant__leaf--${i + 1}`} d="M0 0C-6 -4 -6 -12 0 -17C6 -12 6 -4 0 0Z" />
          </g>
        ))}
        <circle className="plant__bud" cx="70" cy="122" r="3.2" />
      </g>

      {/* the pour */}
      <path className="jug__stream" d={stream} pathLength="1" />
      <path className="jug__flow" d={stream} pathLength="1" />

      <g transform="translate(131 64) scale(0.68)">
        <g className="jug__tilt">
          <g clipPath="url(#jug-clip)">
            <rect className="jug__glass" x="100" y="40" width="120" height="150" />
            <g className="jug__still">
              <g className="jug__level">
                <path className="jug__wave jug__wave--back" d={wave} />
                <path className="jug__wave" d={wave} />
                <circle className="jug__bubble jug__bubble--1" cx="128" cy="14" r="2.4" />
                <circle className="jug__bubble jug__bubble--2" cx="176" cy="22" r="1.6" />
                <circle className="jug__bubble jug__bubble--3" cx="196" cy="18" r="2.8" />
                <circle className="jug__bubble jug__bubble--4" cx="148" cy="26" r="1.8" />
              </g>
            </g>
          </g>

          <path className="jug__shell" d={shell} />
          <path className="jug__rib" d="M108 124H212M108 142H212M108 160H212" />
          <path className="jug__shine" d="M114 98V166" />

          <g className="jug__label">
            <rect x="128" y="114" width="64" height="36" rx="7" />
            <path className="jug__drop" d="M140 122c3 4 5 7 5 9a5 5 0 0 1-10 0c0-2 2-5 5-9Z" />
            <text x="150" y="130">DOCTOR'S</text>
            <text className="jug__word" x="150" y="142">WATER</text>
          </g>

          <rect className="jug__ring" x="140" y="47" width="40" height="5" rx="2" />
        </g>

        <g className="jug__cap">
          <rect x="143" y="30" width="34" height="19" rx="4" />
          <path d="M149 34V45M155 34V45M161 34V45M167 34V45M173 34V45" />
        </g>
      </g>
    </svg>
  )
}

const SCENES = { notebook: Notebook, water: WaterJug }

export default function ProjectScene({ scene }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Scene = SCENES[scene]
  if (!Scene) return null

  return (
    <div ref={ref} className={`scene scene--${scene}`} data-on={on || undefined}>
      <Scene />
      <Leaves />
    </div>
  )
}
