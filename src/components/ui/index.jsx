import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Leaf } from 'lucide-react'
import { EASE, maskLine, rise, stagger, viewport } from '../../lib/motion.js'

/* Small shared primitives. Nothing here knows about content. */

export function Reveal({ children, delay = 0, className, as = 'div', ...rest }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      className={className}
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Stagger({ children, className, delay = 0.06, start = 0, as = 'div', ...rest }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag className={className} variants={stagger(delay, start)} initial="hidden" whileInView="show" viewport={viewport} {...rest}>
      {children}
    </Tag>
  )
}

export function Item({ children, className, as = 'div', ...rest }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag className={className} variants={rise} {...rest}>
      {children}
    </Tag>
  )
}

/** Lines of display type that arrive from under a mask, one after another. */
export function MaskedLines({ lines, className, start = 0.1, animate = true }) {
  const reduced = useReducedMotion()
  if (reduced || !animate) {
    return (
      <span className={className}>
        {lines.map((l, i) => (
          <span key={i} className="mask-line">
            <span className="mask-line__inner">{l}</span>
          </span>
        ))}
      </span>
    )
  }
  return (
    <motion.span className={className} variants={stagger(0.09, start)} initial="hidden" animate="show">
      {lines.map((l, i) => (
        <span key={i} className="mask-line">
          <motion.span className="mask-line__inner" variants={maskLine}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

export function SectionHead({ n, title, note, id }) {
  return (
    <header className="section-head" id={id}>
      <Reveal className="section-head__label">
        <span className="sprig" aria-hidden>
          <span className="sprig__stem" />
          <Leaf size={14} strokeWidth={2} />
        </span>
        <span className="mono">
          {n} / {title}
        </span>
      </Reveal>
      {note && <Reveal className="section-head__note" delay={0.08}>{note}</Reveal>}
    </header>
  )
}

/** A vine that grows along the track once, when it is first seen, with a bud
 *  riding its growing tip. */
export function Meter({ level }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduced = useReducedMotion()
  return (
    <span className="meter" ref={ref}>
      <motion.span
        className="meter__fill"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: seen ? level / 100 : 0 }}
        transition={{ duration: reduced ? 0 : 1.1, ease: EASE }}
      />
      <span className="meter__ticks" aria-hidden />
      <motion.span
        className="meter__bud"
        initial={{ left: '0%', scale: 0 }}
        animate={{ left: seen ? `${level}%` : '0%', scale: seen ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 1.1, ease: EASE }}
        aria-hidden
      >
        <Leaf size={12} strokeWidth={2.2} />
      </motion.span>
    </span>
  )
}

/** Counts up to `value` the first time it scrolls into view. */
export function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? value : 0)

  useEffect(() => {
    if (!seen || reduced) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1100)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, value, reduced])

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

/** Live local time where he actually is - the cheapest possible signal that
 *  the page is a running thing rather than a printout. */
export function LocalClock({ timezone }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  }).format(now)

  return <span className="tnum">{time}</span>
}
