import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { principles, profile, spec } from '../data/profile.js'
import { Item, Reveal, SectionHead, Stagger } from './ui/index.jsx'

/* Body copy that lights up word by word as it passes through the viewport.
   The scroll source is the paragraph itself, so the effect is tied to reading
   position rather than to page position. */
function LitText({ text }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')

  if (reduced) return <p className="lit" ref={ref}>{text}</p>

  return (
    <p className="lit" ref={ref}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1.6) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span className="lit__w" style={{ opacity }}>
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
      <SectionHead n="01" title="About" note="Who tends the code, and how they think about it." />

      <div className="about__grid">
        <div className="about__main">
          <LitText text={profile.summary} />

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
