import { Suspense, lazy, useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Sprout, TreePine } from 'lucide-react'
import { profile } from '../data/profile.js'
import { EASE } from '../lib/motion.js'
import { LocalClock, MaskedLines } from './ui/index.jsx'

const Scene = lazy(() => import('../three/Scene.jsx'))

export default function Hero({ ready, theme }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  /* The grove only renders while the hero is on screen; scrolled past it,
     the GPU is left alone for the rest of the page. */
  const onScreen = useInView(ref, { margin: '0px 0px 0px 0px' })

  /* Copy and scene travel at different rates, so the two planes separate as
     the page leaves rather than sliding away as one sheet. */
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -90])
  const copyFade = useTransform(scrollYProgress, [0, 0.65], [1, reduced ? 1 : 0])
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120])
  const sceneFade = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0.15])

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero__canvas" style={{ y: sceneY, opacity: sceneFade }}>
        {ready && (
          <Suspense fallback={null}>
            <Scene still={!!reduced} paused={!onScreen} theme={theme} />
          </Suspense>
        )}
        <span className="hero__canvas-caption mono" aria-hidden>
          fig. 01 — the wood wide web · live
        </span>
      </motion.div>

      <motion.div className="hero__copy" style={{ y: copyY, opacity: copyFade }}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        >
          <Sprout size={14} strokeWidth={2} className="eyebrow__leaf" />
          {profile.role} · {profile.discipline}
        </motion.p>

        <h1 className="hero__h1">
          <MaskedLines lines={profile.headline} start={0.12} />
        </h1>

        <motion.p
          className="hero__standfirst"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          {profile.standfirst}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.62, ease: EASE }}
        >
          <a className="btn btn--solid" href="#work">
            <TreePine size={16} strokeWidth={2} /> Walk the work <ArrowDownRight size={16} strokeWidth={2} />
          </a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
            <Github size={15} strokeWidth={1.8} /> GitHub
          </a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={15} strokeWidth={1.8} /> LinkedIn
            <ArrowUpRight size={13} strokeWidth={2} className="btn__out" />
          </a>
        </motion.div>
      </motion.div>

      <motion.dl
        className="readout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
      >
        <div>
          <dt className="mono">rooted in</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt className="mono">sun time</dt>
          <dd>
            <LocalClock timezone={profile.timezone} /> IST
          </dd>
        </div>
        <div>
          <dt className="mono">grows in</dt>
          <dd>{profile.domain}</dd>
        </div>
        <div>
          <dt className="mono">season</dt>
          <dd className="readout__live">
            <span className="status__dot" /> {profile.available ? 'in bloom · open to work' : 'dormant · heads down'}
          </dd>
        </div>
      </motion.dl>
    </section>
  )
}
