import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useMedia } from '../hooks/useTheme.js'
import { EASE } from '../lib/motion.js'

/* ---------------------------------------------------------------------------
   The tree the whole page grows on.

   A trunk down the left margin, from the foot of the hero to the contact
   section. Its growing tip runs ahead of the reader - always a little below
   the bottom of the screen - so a flick of the wheel sends it shooting down
   the page. Sprigs sprout along the way, and wherever it reaches a section a
   branch grows out with a cluster of leaves, a blossom and a few sparks.
   Everything is measured from the live layout, so it stays put through
   resizes, theme changes and late-loading content.
   --------------------------------------------------------------------------- */

const SECTIONS = ['about', 'work', 'stack', 'learning', 'path', 'contact']

/** Catmull-Rom through the points, as a smooth cubic Bézier path. */
function smooth(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i - 1] ?? points[i]
    const [x1, y1] = points[i]
    const [x2, y2] = points[i + 1]
    const [x3, y3] = points[i + 2] ?? points[i + 1]
    d += ` C ${x1 + (x2 - x0) / 6} ${y1 + (y2 - y0) / 6}, ${x2 - (x3 - x1) / 6} ${y2 - (y3 - y1) / 6}, ${x2} ${y2}`
  }
  return d
}

function measure() {
  const hero = document.querySelector('.hero')
  const head = document.querySelector('#about .section-head')
  const contact = document.getElementById('contact')
  if (!hero || !head || !contact) return null
  const sy = window.scrollY
  const space = Math.max(0, head.getBoundingClientRect().left)
  const top = hero.getBoundingClientRect().bottom + sy + 40
  const bottom = contact.getBoundingClientRect().top + sy + 180
  const branches = SECTIONS.map((id) => {
    const el = document.getElementById(id)
    if (!el) return null
    const h = el.querySelector('.section-head, .contact__eyebrow') ?? el
    return { id, y: h.getBoundingClientRect().top + sy + 14 }
  }).filter((b) => b && b.y > top && b.y < bottom)
  return { space, top, bottom, height: document.documentElement.scrollHeight, branches }
}

export default function PageTree() {
  const reduced = useReducedMotion()
  const wide = useMedia('(min-width: 761px)')
  const [m, setM] = useState(null)

  useLayoutEffect(() => {
    if (!wide) return
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setM(measure()))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(document.body)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [wide])

  if (!wide || !m || m.space < 60) return null
  return <Tree m={m} still={!!reduced} />
}

/* One leaf: a real leaf shape with a midrib, drawn with its stem at (0, 0)
   and the blade reaching up and to the right. It pops open on a springy
   overshoot, then sways in the breeze on its own phase. */
const LEAF = 'M0 0 C 5 -1 12 -5 18 -14 C 21 -19 22 -25 21 -31 C 13 -30 5 -24 2 -14 C 0 -9 -0.5 -4 0 0 Z'
const VEIN = 'M0 0 C 5 -7 12 -17 20 -29'

function Leaf({ x, y, rot = 0, s = 1, tone = 'fern', on, delay = 0, still }) {
  const shown = on || still
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <motion.g
        initial={still ? false : { scale: 0, opacity: 0 }}
        animate={shown ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 13, delay: shown ? delay : 0 }}
        style={{ originX: 0, originY: 1 }}
      >
        <g className="pt-sway" style={{ animationDelay: `${-(Math.abs(x * 7 + y) % 40) / 10}s` }}>
          <path className={`pt-leaf pt-leaf--${tone}`} d={LEAF} />
          <path className="pt-leaf__vein" d={VEIN} />
        </g>
      </motion.g>
    </g>
  )
}

function Blossom({ x, y, on, delay, still }) {
  const shown = on || still
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        initial={still ? false : { scale: 0, rotate: -60, opacity: 0 }}
        animate={shown ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 12, delay: shown ? delay : 0 }}
      >
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} className="pt-petal" cx="0" cy="-5.5" rx="3.6" ry="5.4" transform={`rotate(${a})`} />
        ))}
        <circle className="pt-blossom__heart" r="2.6" />
      </motion.g>
    </g>
  )
}

function Tree({ m, still }) {
  const { space, top, bottom, height, branches } = m
  /* The trunk sits close to the content on wide screens instead of far out
     at the window edge; branches reach from it to the section headings. */
  const cx = Math.max(space * 0.2, space - 116)
  const reach = Math.min(120, space - cx - 12)
  const amp = Math.min(12, space * 0.09)
  const step = 220

  /* The trunk wanders gently from side to side rather than dropping as a
     ruler-straight line. */
  const trunk = useMemo(() => {
    const pts = []
    for (let y = top, i = 0; y <= bottom; y += step, i++) pts.push([cx + Math.sin(i * 1.3) * amp, y])
    if (pts[pts.length - 1][1] < bottom) pts.push([cx, bottom])
    return smooth(pts)
  }, [top, bottom, cx, amp])

  const xAt = (y) => cx + Math.sin(((y - top) / step) * 1.3) * amp

  /* Little sprigs between the branches, alternating sides, so the trunk is
     leafy all the way down rather than bare between sections. */
  const sprigs = useMemo(() => {
    const out = []
    let side = 1
    for (let y = top + 90; y < bottom - 40; y += 130) {
      if (branches.some((b) => Math.abs(b.y - y) < 70)) continue
      out.push({ y, side })
      side = -side
    }
    return out
  }, [top, bottom, branches])

  /* Growth is driven by where the bottom of the screen is, pushed ahead by a
     third of a screen, so the tip always leads the reader. A stiff spring
     makes it shoot rather than crawl. */
  const { scrollY } = useScroll()
  const lead = typeof window !== 'undefined' ? window.innerHeight * 1.3 : 1200
  const target = useTransform(scrollY, (v) => Math.min(1, Math.max(0, (v + lead - top) / (bottom - top))))
  const grown = useSpring(target, { stiffness: 140, damping: 22, mass: 0.5 })
  const growth = still ? 1 : grown

  const path = useRef(null)
  const bud = useRef(null)
  const [tipY, setTipY] = useState(still ? Infinity : top)

  const place = (g) => {
    const p = path.current
    if (!p) return
    const pt = p.getPointAtLength(p.getTotalLength() * g)
    if (bud.current) bud.current.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
    /* Rounded to a coarse step so React re-renders only when the tip has
       moved far enough to matter, not on every frame of the spring. */
    setTipY(Math.round(pt.y / 20) * 20)
  }

  useMotionValueEvent(grown, 'change', (g) => !still && place(g))
  useEffect(() => place(still ? 1 : grown.get()), [trunk]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <svg className="page-tree" width={space} height={height} viewBox={`0 0 ${space} ${height}`} aria-hidden>
      <defs>
        <linearGradient id="pt-bark" x1="0" y1={top} x2="0" y2={bottom} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--bark)" />
          <stop offset="0.7" stopColor="color-mix(in srgb, var(--bark) 75%, var(--signal))" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--bark) 40%, var(--signal))" />
        </linearGradient>
        <linearGradient id="pt-fern" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--signal)" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--signal) 45%, #c8f5b0)" />
        </linearGradient>
        <linearGradient id="pt-lichen" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--teal)" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--teal) 45%, #d4f7e8)" />
        </linearGradient>
        <linearGradient id="pt-autumn" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--amber)" />
          <stop offset="1" stopColor="var(--glow)" />
        </linearGradient>
      </defs>

      {/* faint guide of the whole trunk, so the path it will take is hinted */}
      <path d={trunk} className="pt-ghost" />
      {/* bark: a dark outer stroke, the trunk itself, and a thin highlight */}
      <motion.path ref={path} d={trunk} className="pt-trunk-shadow" style={{ pathLength: growth }} />
      <motion.path d={trunk} className="pt-trunk" style={{ pathLength: growth }} />
      <motion.path d={trunk} className="pt-trunk-light" style={{ pathLength: growth }} />

      {sprigs.map((sp, k) => (
        <Leaf
          key={sp.y}
          x={xAt(sp.y)}
          y={sp.y}
          rot={sp.side > 0 ? 12 : -102}
          s={0.62}
          tone={k % 3 === 1 ? 'lichen' : 'fern'}
          on={tipY >= sp.y}
          still={still}
        />
      ))}

      {branches.map((b, i) => (
        <Branch key={b.id} i={i} x={xAt(b.y)} y={b.y} reach={reach} on={tipY >= b.y} still={still} />
      ))}

      {/* the growing tip */}
      {!still && (
        <g ref={bud} className="pt-bud">
          <circle r="12" className="pt-bud__glow" />
          <circle r="4.2" className="pt-bud__core" />
        </g>
      )}
    </svg>
  )
}

/* A branch off the trunk: it draws out when the tip reaches it, a cluster of
   leaves pops open along it, alternate branches blossom, and a few sparks
   drift up as it arrives. Coordinates are local to the joint, set with SVG
   transform attributes so nothing depends on CSS transform origins. */
function Branch({ x, y, reach, on, i, still }) {
  const len = Math.max(30, reach)
  const lift = 20 + (i % 2) * 10
  const d = `M 0 0 C ${len * 0.35} -2, ${len * 0.65} -${lift * 0.55}, ${len} -${lift}`
  const along = (t) => ({ x: len * t, y: -lift * t * t * 0.9 - t * 2 })
  const a = along(0.35)
  const b = along(0.62)
  const c = along(1)
  const autumn = i % 3 === 2
  const shown = on || still
  return (
    <g transform={`translate(${x} ${y})`} className="pt-branch" data-on={shown || undefined}>
      <motion.path
        d={d}
        className="pt-twig"
        initial={still ? false : { pathLength: 0 }}
        animate={{ pathLength: shown ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      <Leaf x={a.x} y={a.y} rot={-8} s={0.8} tone="fern" on={on} delay={0.18} still={still} />
      <Leaf x={a.x} y={a.y + 1} rot={112} s={0.62} tone="lichen" on={on} delay={0.26} still={still} />
      <Leaf x={b.x} y={b.y} rot={-28} s={0.95} tone={autumn ? 'autumn' : 'fern'} on={on} delay={0.32} still={still} />
      <Leaf x={b.x} y={b.y + 1} rot={95} s={0.7} tone="fern" on={on} delay={0.4} still={still} />
      <Leaf x={c.x} y={c.y} rot={-52} s={1.05} tone="fern" on={on} delay={0.46} still={still} />
      {i % 2 === 0 ? (
        <Blossom x={c.x + 2} y={c.y - 4} on={on} delay={0.62} still={still} />
      ) : (
        <Leaf x={c.x} y={c.y} rot={20} s={0.7} tone="lichen" on={on} delay={0.56} still={still} />
      )}
      {!still &&
        [0, 1, 2, 3, 4].map((k) => (
          <circle
            key={k}
            className="pt-spark"
            r={1.6 + (k % 2)}
            cx={c.x - 10 + k * 6}
            cy={c.y - 4 + (k % 3) * 5}
            style={{ animationDelay: `${0.35 + k * 0.12}s` }}
          />
        ))}
    </g>
  )
}
