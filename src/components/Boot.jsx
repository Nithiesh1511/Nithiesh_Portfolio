import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../lib/motion.js'
import { profile } from '../data/profile.js'

const STEPS = [
  ['plant', 'seed · profile.json'],
  ['root', 'mycelial network'],
  ['unfurl', 'canopy · shaders'],
  ['open', 'the clearing'],
]

/* A seedling that grows with the sequence: stem first, then each leaf opens
   as a step completes. */
function Sprout({ step }) {
  const grow = (i) => ({ pathLength: step > i ? 1 : 0, opacity: step > i ? 1 : 0 })
  const t = { duration: 0.45, ease: EASE }
  return (
    <svg className="boot__sprout" viewBox="0 0 64 64" aria-hidden>
      <path className="boot__soil" d="M8 56 Q32 50 56 56" />
      <motion.path className="boot__stem" d="M32 56 C32 46 31 38 32 22" initial={grow(99)} animate={grow(0)} transition={t} />
      <motion.path className="boot__leaf" d="M32 42 C24 42 18 36 17 30 C25 29 31 34 32 42 Z" initial={grow(99)} animate={grow(1)} transition={t} />
      <motion.path className="boot__leaf" d="M32 34 C40 34 46 28 47 22 C39 21 33 26 32 34 Z" initial={grow(99)} animate={grow(2)} transition={t} />
      <motion.path className="boot__leaf boot__leaf--top" d="M32 22 C27 17 28 10 32 6 C36 10 37 17 32 22 Z" initial={grow(99)} animate={grow(3)} transition={t} />
    </svg>
  )
}

/* A boot sequence rather than a spinner. It is deliberately short — under two
   seconds — and skipped entirely under reduced motion, because a loader is a
   tax the second time someone visits. */
export default function Boot({ onDone }) {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(reduced ? STEPS.length : 0)
  const [gone, setGone] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      onDone?.()
      return
    }
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i + 1), 220 + i * 260))
    const end = setTimeout(() => {
      setGone(true)
      onDone?.()
    }, 220 + STEPS.length * 260 + 240)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(end)
    }
  }, [reduced, onDone])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
          aria-hidden
        >
          <div className="boot__inner">
            <div className="boot__head">
              <Sprout step={step} />
              <div className="boot__mark">{profile.initials}</div>
            </div>
            <ol className="boot__list">
              {STEPS.map(([verb, what], i) => (
                <li key={what} className="boot__line" data-on={i < step || undefined}>
                  <span className="boot__verb">{verb}</span>
                  <span className="boot__what">{what}</span>
                  <span className="boot__dots" aria-hidden />
                  <span className="boot__ok">{i < step ? 'ok' : '··'}</span>
                </li>
              ))}
            </ol>
            <div className="boot__bar">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step / STEPS.length }}
                transition={{ duration: 0.3, ease: EASE }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
