import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Award, Bot, Code2, Database, Sparkles } from 'lucide-react'
import { learning } from '../data/profile.js'
import { EASE } from '../lib/motion.js'
import { Item, Meter, SectionHead, Stagger } from './ui/index.jsx'

const ICONS = { ai: Sparkles, code: Code2, data: Database, bot: Bot }

const fmt = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`)

/* A seedling drawn to the course's progress: the stem grows with it, and each
   pair of leaves unfurls as a threshold is passed. Even a course just started
   shows its first two leaves - it has been planted. */
function Sapling({ progress }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()
  const on = seen || reduced
  const stem = 0.45 + progress * 0.55
  const t = (delay) => ({ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: EASE })
  /* Leaves draw their outline in and fill as they fade up - no transforms,
     so each one unfurls exactly where it joins the stem. */
  const leaf = (show, delay) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: on && show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition: t(delay),
  })

  return (
    <svg className="sapling" viewBox="0 0 64 72" ref={ref} aria-hidden>
      <ellipse className="sapling__soil" cx="32" cy="66" rx="22" ry="4" />
      <motion.path
        className="sapling__stem"
        d="M32 66 C32 56 30 44 32 30 C33 22 32 14 32 8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: on ? stem : 0 }}
        transition={t(0.1)}
      />
      <motion.path className="sapling__leaf" d="M32 56 C24 56 18 50 17 44 C25 43 31 48 32 56 Z" {...leaf(true, 0.5)} />
      <motion.path className="sapling__leaf" d="M32 54 C40 54 46 48 47 42 C39 41 33 46 32 54 Z" {...leaf(true, 0.6)} />
      <motion.path className="sapling__leaf" d="M31 38 C24 38 19 33 18 27 C25 27 30 31 31 38 Z" {...leaf(progress >= 0.3, 0.8)} />
      <motion.path className="sapling__leaf" d="M33 34 C40 34 45 29 46 23 C39 23 34 27 33 34 Z" {...leaf(progress >= 0.5, 0.9)} />
      <motion.path className="sapling__leaf sapling__leaf--tip" d="M32 16 C27 12 28 5 32 1 C36 5 37 12 32 16 Z" {...leaf(progress >= 0.85, 1.1)} />
    </svg>
  )
}

export default function Learning() {
  return (
    <section className="section learning" id="learning">
      <SectionHead n="04" title="Learning" note="Always learning, experimenting and growing the toolkit - certificates earned along the way." />

      <Stagger className="learning__grid" delay={0.08}>
        {learning.map((c) => {
          const Icon = ICONS[c.icon] ?? Sparkles
          const done = c.certified ? c.minutes ?? 1 : Math.max(0, Math.min(c.minutes, c.minutes - c.left))
          const progress = c.certified ? 1 : c.minutes ? done / c.minutes : 0
          const pct = Math.round(progress * 100)
          return (
            <Item className="seedling" key={c.title} data-certified={c.certified || undefined}>
              <div className="seedling__top">
                <span className="seedling__topic">
                  <Icon size={13} strokeWidth={2} /> {c.topic}
                </span>
                <span className="mono seedling__platform">{c.platform}</span>
              </div>

              <div className="seedling__body">
                <Sapling progress={progress} />
                <div>
                  <h3 className="seedling__title">{c.title}</h3>
                  <p className="seedling__meta">
                    {[c.by, c.minutes && fmt(c.minutes), c.edition && (c.certified ? c.edition : `${c.edition} edition`)]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </div>

              <Meter level={Math.max(pct, 2)} />
              <div className="seedling__foot mono">
                {c.certified ? (
                  <>
                    <span>fully grown</span>
                    {c.link ? (
                      <a className="seedling__cert" href={c.link} target="_blank" rel="noreferrer">
                        <Award size={12} strokeWidth={2.2} /> verify <ArrowUpRight size={12} strokeWidth={2.2} />
                      </a>
                    ) : (
                      <span className="seedling__cert">
                        <Award size={12} strokeWidth={2.2} /> certified
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span>{pct < 5 ? 'just planted' : `${pct}% grown`}</span>
                    <span>{c.left > 0 ? `${fmt(c.left)} to go` : 'fully grown'}</span>
                  </>
                )}
              </div>
            </Item>
          )
        })}
      </Stagger>
    </section>
  )
}
