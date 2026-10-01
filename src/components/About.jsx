import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { principles, profile, spec } from '../data/profile.js'
import { Item, Reveal, SectionHead, Stagger } from './ui/index.jsx'

/* Body copy that lights up word by word as it passes through the viewport.
   The scroll source is the paragraph itself, so the effect is tied to reading
   position rather than to page position. If the reader lingers on it, the
   rest of the paragraph lights up anyway, so nobody has to scroll to read;
   the moment they scroll again, the words go back to following the scroll. */
const LINGER_MS = 3000

function LitText({ text, highlight }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const inView = useInView(ref, { amount: 0.3 })
  /* 0 → 1 once the reader has held still for LINGER_MS; sweeps through the
     words in the same order the scroll would. */
  const linger = useMotionValue(0)
  const timer = useRef(0)

  const restart = () => {
    clearTimeout(timer.current)
    if (reduced || !inView) return
    timer.current = setTimeout(() => animate(linger, 1, { duration: 1.4, ease: 'easeOut' }), LINGER_MS)
  }

  useEffect(() => {
    restart()
    return () => clearTimeout(timer.current)
  }, [inView, reduced]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Any scroll hands control back to the scroll and restarts the wait. */
  useMotionValueEvent(scrollYProgress, 'change', () => {
    if (linger.get() > 0) animate(linger, 0, { duration: 0.6, ease: 'easeOut' })
    restart()
  })
  const words = text.split(' ')
  /* Words from here to the end are emphasised; -1 when there is no match. */
  const hlFrom = highlight && text.endsWith(highlight) ? words.length - highlight.split(' ').length : -1

  if (reduced) {
    if (hlFrom < 0) return <p className="lit" ref={ref}>{text}</p>
    return (
      <p className="lit" ref={ref}>
        {words.slice(0, hlFrom).join(' ')} <mark className="lit__hl">{highlight}</mark>
      </p>
    )
  }

  return (
    <p className="lit" ref={ref}>
      {words.map((w, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          linger={linger}
          /* Spread over n + 0.6 so the last word's ramp ends at 1 and it
             reaches full brightness like the rest. */
          range={[i / (words.length + 0.6), (i + 1.6) / (words.length + 0.6)]}
          hl={hlFrom >= 0 && i >= hlFrom}
        >
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, linger, range, hl }) {
  const byScroll = useTransform(progress, range, [0.18, 1])
  const byLinger = useTransform(linger, range, [0.18, 1])
  const opacity = useTransform(() => Math.max(byScroll.get(), byLinger.get()))
  return (
    <motion.span className={hl ? 'lit__w lit__hl' : 'lit__w'} style={{ opacity }}>
      {children}
    </motion.span>
  )
}

/** Tries each candidate path in turn and only gives up at the last one, so a
 *  missing photo never shows a broken image. */
function Portrait() {
  const [i, setI] = useState(0)
  const src = profile.portraitCandidates[i]
  return (
    <figure className="portrait">
      <div className="portrait__plate">
        <img
          src={src}
          alt={profile.name}
          loading="lazy"
          decoding="async"
          onError={() => setI((n) => Math.min(n + 1, profile.portraitCandidates.length - 1))}
        />
        <span className="portrait__light" aria-hidden />
        <svg className="portrait__vine" viewBox="0 0 120 120" aria-hidden>
          <path className="portrait__vine-stem" d="M2 118 C 10 80, 4 50, 22 30 S 60 6, 118 4" />
          <path className="portrait__vine-leaf" d="M14 70 c -9 -2 -13 -9 -12 -15 c 8 0 13 6 12 15 Z" />
          <path className="portrait__vine-leaf" d="M22 32 c 1 -9 8 -14 15 -13 c -1 8 -7 13 -15 13 Z" />
          <path className="portrait__vine-leaf" d="M56 12 c 4 -8 12 -10 18 -7 c -3 7 -10 10 -18 7 Z" />
          <path className="portrait__vine-leaf" d="M92 6 c 5 -6 12 -6 17 -2 c -5 5 -12 6 -17 2 Z" />
        </svg>
      </div>
      <figcaption className="mono">
        {profile.initials} · {profile.location.toUpperCase()}
      </figcaption>
    </figure>
  )
}

export default function About() {
  return (
    <section className="section about" id="about">
      <SectionHead n="01" title="About" note={profile.aboutTitle} />

      <div className="about__grid">
        <div className="about__main">
          <Reveal>
            <p className="about__tagline">{profile.aboutTagline}</p>
          </Reveal>

          <LitText text={profile.summary} highlight={profile.summaryHighlight} />

          <Stagger className="principles" delay={0.09}>
            {principles.map((p) => (
              <Item className="principle" key={p.n}>
                <span className="principle__n mono">{p.n}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>

        <aside className="about__side">
          <Reveal>
            <Portrait />
          </Reveal>

          <Reveal className="spec" delay={0.1}>
            <div className="spec__head mono">
              <span>spec</span>
              <span>rev. 2026.09</span>
            </div>
            <dl>
              {spec.map(([k, v]) => (
                <div className="spec__row" key={k}>
                  <dt className="mono">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </aside>
      </div>
    </section>
  )
}
