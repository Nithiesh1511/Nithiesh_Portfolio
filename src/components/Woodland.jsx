import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/* ---------------------------------------------------------------------------
   The wood behind the page.

   Three treelines at different depths, each drifting at its own rate as the
   page scrolls so the forest has parallax depth; a sun (or moon) up in the
   corner; and a layer of fireflies and falling leaves. Everything is drawn
   from a seeded generator, so the skyline is the same on every visit.
   --------------------------------------------------------------------------- */

const W = 1440
const H = 320

/** Small deterministic PRNG — the treeline must not reshuffle on re-render. */
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** One pine silhouette: three stacked tiers with a slight droop on each. */
function pine(x, h, w) {
  const b = H
  const t = (k) => b - h * k
  return [
    `M ${x - w * 0.5} ${t(0.08)}`,
    `L ${x - w * 0.18} ${t(0.4)}`,
    `L ${x - w * 0.36} ${t(0.38)}`,
    `L ${x - w * 0.12} ${t(0.68)}`,
    `L ${x - w * 0.24} ${t(0.66)}`,
    `L ${x} ${t(1)}`,
    `L ${x + w * 0.24} ${t(0.66)}`,
    `L ${x + w * 0.12} ${t(0.68)}`,
    `L ${x + w * 0.36} ${t(0.38)}`,
    `L ${x + w * 0.18} ${t(0.4)}`,
    `L ${x + w * 0.5} ${t(0.08)}`,
    `L ${x + w * 0.05} ${t(0.08)}`,
    `L ${x + w * 0.05} ${b}`,
    `L ${x - w * 0.05} ${b}`,
    `L ${x - w * 0.05} ${t(0.08)} Z`,
  ].join(' ')
}

/** A broadleaf: a trunk and a lumpy crown of overlapping circles. */
function broadleaf(x, h, w) {
  const r = w * 0.3
  const cy = H - h + r
  const blob = (cx, cy2, rr) => `M ${cx - rr} ${cy2} a ${rr} ${rr} 0 1 0 ${rr * 2} 0 a ${rr} ${rr} 0 1 0 ${-rr * 2} 0 Z`
  return [
    `M ${x - w * 0.05} ${H} L ${x - w * 0.04} ${cy + r} L ${x + w * 0.04} ${cy + r} L ${x + w * 0.05} ${H} Z`,
    blob(x, cy, r),
    blob(x - r * 0.8, cy + r * 0.55, r * 0.75),
    blob(x + r * 0.85, cy + r * 0.5, r * 0.78),
  ].join(' ')
}

function treeline(seed, { count, min, max, broad = 0 }) {
  const rand = seeded(seed)
  const parts = []
  const step = W / count
  for (let i = -1; i <= count + 1; i++) {
    const x = i * step + (rand() - 0.5) * step * 0.8
    const h = min + rand() * (max - min)
    const w = h * (0.42 + rand() * 0.2)
    parts.push(rand() < broad ? broadleaf(x, h, w * 1.3) : pine(x, h, w))
  }
  /* A ground band so the trunks never float. */
  parts.push(`M 0 ${H - 6} L ${W} ${H - 6} L ${W} ${H} L 0 ${H} Z`)
  return parts.join(' ')
}

const LAYERS = [
  { key: 'far', d: treeline(7, { count: 34, min: 90, max: 170, broad: 0.25 }), rate: 40 },
  { key: 'mid', d: treeline(19, { count: 22, min: 120, max: 220, broad: 0.3 }), rate: 90 },
  { key: 'near', d: treeline(41, { count: 12, min: 150, max: 290, broad: 0.15 }), rate: 170 },
]

/* Fireflies / pollen: positions and timings are fixed so CSS can animate them
   without any per-frame JavaScript. */
const MOTES = Array.from({ length: 22 }, (_, i) => {
  const r = seeded(100 + i)
  return {
    left: `${(r() * 100).toFixed(1)}%`,
    top: `${(18 + r() * 72).toFixed(1)}%`,
    delay: `${(-r() * 14).toFixed(1)}s`,
    dur: `${(9 + r() * 10).toFixed(1)}s`,
    size: `${(3 + r() * 4).toFixed(1)}px`,
  }
})

const LEAVES = Array.from({ length: 9 }, (_, i) => {
  const r = seeded(300 + i)
  return {
    left: `${(r() * 100).toFixed(1)}%`,
    delay: `${(-r() * 24).toFixed(1)}s`,
    dur: `${(16 + r() * 14).toFixed(1)}s`,
    size: `${(12 + r() * 12).toFixed(0)}px`,
    tone: i % 3,
  }
})

export default function Woodland() {
  const reduced = useReducedMotion()
  const { scrollYProgress, scrollY } = useScroll()
  /* The sun sets as you leave the hero, so it never sits behind copy. */
  const orbOpacity = useTransform(scrollY, [0, 700], [1, 0])
  const orbY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 160])

  return (
    <div className="woodland" aria-hidden>
      <span className="woodland__sky" />
      <motion.span className="woodland__orb-wrap" style={{ opacity: orbOpacity, y: orbY }}>
        <span className="woodland__orb" />
      </motion.span>

      {LAYERS.map((l) => (
        <Treeline key={l.key} layer={l} progress={scrollYProgress} still={reduced} />
      ))}
      <span className="woodland__mist" />

      {!reduced && (
        <>
          <div className="motes">
            {MOTES.map((m, i) => (
              <span
                key={i}
                style={{ left: m.left, top: m.top, width: m.size, height: m.size, animationDelay: m.delay, animationDuration: m.dur }}
              />
            ))}
          </div>
          <div className="leaves">
            {LEAVES.map((l, i) => (
              <span
                key={i}
                data-tone={l.tone}
                style={{ left: l.left, width: l.size, height: l.size, animationDelay: l.delay, animationDuration: l.dur }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6 6 4 12 6 18c1 2 3 4 6 4 3 0 5-2 6-4 2-6 0-12-6-16Z" />
                  <path d="M12 5v17" className="leaves__vein" />
                </svg>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Treeline({ layer, progress, still }) {
  const y = useTransform(progress, [0, 1], [0, still ? 0 : layer.rate])
  return (
    <motion.svg
      className={`woodland__trees woodland__trees--${layer.key}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      style={{ y }}
    >
      <path d={layer.d} />
    </motion.svg>
  )
}
