import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { navLinks, profile } from '../data/profile.js'

/* Fixed chrome: the progress hairline, the mark, the section index and the
   theme switch. The active section is tracked with IntersectionObserver so the
   index always agrees with what is on screen. */
export default function Nav({ theme, onToggleTheme }) {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 })
  const [active, setActive] = useState('')
  const [lifted, setLifted] = useState(false)

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden />

      <header className="nav" data-lifted={lifted || undefined}>
        <a className="nav__mark" href="#top" aria-label={profile.name}>
          <span className="nav__initials">{profile.initials}</span>
          <span className="nav__name">
            {profile.name}
            <span className="nav__role">{profile.role}</span>
          </span>
        </a>

        <nav className="nav__index" aria-label="Sections">
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} data-active={active === l.id || undefined}>
              <span className="mono nav__n">{l.n}</span>
              <span>{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__right">
          {profile.available && (
            <span className="status" title="Open to conversations">
              <span className="status__dot" />
              <span className="mono">in bloom</span>
            </span>
          )}
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to the forest by day' : 'Switch to the forest by night'}
            title={theme === 'dark' ? 'Dawn' : 'Nightfall'}
          >
            {theme === 'dark' ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
          </button>
        </div>
      </header>
    </>
  )
}
