import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { projects } from '../data/profile.js'
import FlowDiagram from './FlowDiagram.jsx'
import { SectionHead } from './ui/index.jsx'

function Card({ p }) {
  const Tag = p.link ? 'a' : 'article'
  const extra = p.link ? { href: p.link, target: '_blank', rel: 'noreferrer' } : {}

  return (
    <Tag className="case" data-accent={p.accent} {...extra}>
      <header className="case__head">
        <span className="case__num mono">{p.num}</span>
        <span className="case__kind mono">{p.kind}</span>
        <span className="case__year mono">{p.year}</span>
      </header>

      <div className="case__body">
        <div className="case__left">
          <h3 className="case__title">{p.title}</h3>
          <p className="case__summary">{p.summary}</p>
          <p className="case__detail">{p.detail}</p>
          <ul className="chips">
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="case__right">
          <FlowDiagram flow={p.flow} accent={p.accent} />
          <dl className="case__facts">
            {p.facts.map(([k, v]) => (
              <div key={k}>
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="case__foot">
            <span className="mono case__role">{p.role}</span>
            {p.link && (
              <span className="case__link mono">
                source <ArrowUpRight size={13} strokeWidth={2} />
              </span>
            )}
          </div>
        </div>
      </div>
    </Tag>
  )
}

export default function Work() {
  const track = useRef(null)
  const [idx, setIdx] = useState(0)
  const [edge, setEdge] = useState({ start: true, end: false })
  const progress = useMotionValue(0)
  const pct = useTransform(progress, [0, 1], ['0%', '100%'])

  /* The gallery is a real horizontal scroller — trackpad swipes, touch, the
     scrollbar and the buttons all move it natively, so every card is always
     reachable. The wheel is borrowed only while the row can still move in
     that direction; at either end the page scrolls on as normal. */
  useEffect(() => {
    const el = track.current
    if (!el) return

    const sync = () => {
      const max = el.scrollWidth - el.clientWidth
      const v = max > 0 ? el.scrollLeft / max : 0
      progress.set(v)
      setIdx(Math.min(projects.length - 1, Math.round(v * (projects.length - 1))))
      setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 })
    }

    const wheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      const max = el.scrollWidth - el.clientWidth
      const canMove = e.deltaY > 0 ? el.scrollLeft < max - 1 : el.scrollLeft > 1
      if (!canMove) return
      e.preventDefault()
      el.scrollBy({ left: e.deltaY, behavior: 'auto' })
    }

    sync()
    el.addEventListener('scroll', sync, { passive: true })
    el.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      el.removeEventListener('wheel', wheel)
      window.removeEventListener('resize', sync)
    }
  }, [progress])

  const step = (dir) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('.case')
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth) + gap), behavior: 'smooth' })
  }

  return (
    <section className="work" id="work">
      <div className="work__inner">
        <div className="work__bar">
          <SectionHead n="02" title="Selected work" note="Five systems, and the root network under each one." />
          <div className="work__meter">
            <span className="mono" aria-hidden>
              {String(idx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <span className="work__rail" aria-hidden>
              <motion.span className="work__rail-fill" style={{ width: pct }} />
            </span>
            <div className="work__nav">
              <button className="icon-btn" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous project">
                <ArrowLeft size={16} strokeWidth={2} />
              </button>
              <button className="icon-btn" onClick={() => step(1)} disabled={edge.end} aria-label="Next project">
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="work__track" ref={track} tabIndex={0} aria-label="Selected work — scroll sideways">
        {projects.map((p) => (
          <Card key={p.id} p={p} />
        ))}
      </div>
    </section>
  )
}
