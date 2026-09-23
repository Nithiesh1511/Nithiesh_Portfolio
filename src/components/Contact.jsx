import { ArrowUpRight, Github, Leaf, Linkedin, Mail } from 'lucide-react'
import { profile } from '../data/profile.js'
import { LocalClock, MaskedLines, Reveal } from './ui/index.jsx'

export default function Contact() {
  const year = new Date().getFullYear()

  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <Reveal className="contact__eyebrow mono">
          <Leaf size={14} strokeWidth={2} /> 06 / Contact
        </Reveal>

        <h2 className="contact__h2">
          <MaskedLines lines={['Got a system that', 'needs to talk to another?']} />
        </h2>

        <Reveal className="contact__line" delay={0.1}>
          <p>
            {profile.available
              ? 'Every forest runs on the network under it. Open to backend and integration work, and to conversations that have not turned into work yet.'
              : 'Currently heads down, but always happy to talk shop.'}
          </p>
        </Reveal>

        <Reveal className="contact__links" delay={0.16}>
          <a className="contact__primary" href={`mailto:${profile.email}`}>
            <Mail size={18} strokeWidth={1.8} />
            <span>{profile.email}</span>
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>
          <div className="contact__socials">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={15} strokeWidth={1.8} /> LinkedIn
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={15} strokeWidth={1.8} /> GitHub
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="colophon">
        <span className="mono">
          © {year} {profile.name}
        </span>
        <span className="mono colophon__mid">
          {profile.location} · <LocalClock timezone={profile.timezone} /> IST
        </span>
        <span className="mono">Grown with React 19 · three.js · framer-motion</span>
      </footer>
    </section>
  )
}
