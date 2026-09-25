import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { timeline } from '../data/profile.js'
import { Reveal, SectionHead } from './ui/index.jsx'

/* One stint: a leaf on the trunk. It lights up at the moment the growing
   trunk reaches it, and dims again if the trunk shrinks back past it. */
function Stint({ t, lit, nodeRef }) {
  return (
    <Reveal className="stint" data-lit={lit || undefined}>
      <span ref={nodeRef} className="stint__node" data-current={t.current || undefined} aria-hidden />
      <div className="stint__period mono">{t.period}</div>
      <div className="stint__body">
        <h3>
          {t.title}
          <span className="stint__org">{t.org}</span>
        </h3>
        <p>{t.text}</p>
        <ul className="chips chips--quiet">
          {t.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

/* The trunk grows as the section is read, so the list has a direction rather
   than just an order; each stint is a leaf on it. */
export default function Path() {
  const ref = useRef(null)
  const spine = useRef(null)
  const nodes = useRef([])
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 180, damping: 36, mass: 0.4 })
  const [reached, setReached] = useState(reduced ? timeline.length : 0)

  /* Where the trunk's growing tip is, compared with where each leaf joins it.
     Driven by the same spring that scales the trunk, so the glow lands exactly
     as the brown touches the leaf. */
  useEffect(() => {
    if (reduced) {
      setReached(timeline.length)
      return
    }
    const update = (grown) => {
      const s = spine.current?.getBoundingClientRect()
      if (!s || !s.height) return
      const tip = s.top + s.height * grown
      let n = 0
      nodes.current.forEach((el) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        if (tip >= r.top + r.height / 2) n++
      })
      setReached(n)
    }
    update(scaleY.get())
    return scaleY.on('change', update)
  }, [scaleY, reduced])

  return (
    <section className="section path" id="path">
      <SectionHead n="05" title="Experience" note="Growth rings - from automation, to software development, to building across the stack." />

      <div className="path__list" ref={ref}>
        <span className="path__spine" ref={spine} aria-hidden>
          <motion.span style={{ scaleY: reduced ? 1 : scaleY }} />
        </span>

        {timeline.map((t, i) => (
          <Stint key={t.title + t.period} t={t} lit={i < reached} nodeRef={(el) => (nodes.current[i] = el)} />
        ))}
      </div>
    </section>
  )
}
