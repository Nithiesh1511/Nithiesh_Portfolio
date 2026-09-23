import { Leaf } from 'lucide-react'
import { stack, ticker } from '../data/profile.js'
import { Item, Meter, SectionHead, Stagger } from './ui/index.jsx'

export function Ticker() {
  const row = [...ticker, ...ticker]
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker__row">
        {row.map((t, i) => (
          <span key={i}>
            {t}
            <i>
              <Leaf size={13} strokeWidth={2} />
            </i>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Stack() {
  return (
    <section className="section stack" id="stack">
      <SectionHead n="03" title="Stack" note="What I reach for, and how deep the roots actually go." />

      <div className="stack__grid">
        {stack.map((g) => (
          <Stagger className="stack__group" key={g.group} delay={0.07}>
            <Item className="stack__group-head mono">{g.group}</Item>
            {g.items.map((it) => (
              <Item className="skill" key={it.name}>
                <div className="skill__top">
                  <span className="skill__name">{it.name}</span>
                  <span className="skill__level mono tnum">{it.level}</span>
                </div>
                <Meter level={it.level} />
                <span className="skill__note">{it.note}</span>
              </Item>
            ))}
          </Stagger>
        ))}
      </div>
    </section>
  )
}
