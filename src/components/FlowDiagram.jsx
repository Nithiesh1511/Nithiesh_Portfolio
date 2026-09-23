import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { EASE } from '../lib/motion.js'

/* ---------------------------------------------------------------------------
   The topology strip on each case card.

   Nodes and edges come straight from `flow` in profile.js. Roots grow
   themselves in when the card is first seen, then a spore runs each one with
   SMIL — no JS timer per card, which matters when four of these are live in a
   horizontal track at once.
   --------------------------------------------------------------------------- */

const W = 300
const H = 150
const NODE_H = 21

const nodeWidth = (label) => Math.max(46, label.length * 5.1 + 18)

/** A gentle bow so parallel edges never overlap into a single stroke. */
function edgePath(a, b) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const bow = Math.min(16, len * 0.13)
  const cx = mx + (-dy / len) * bow
  const cy = my + (dx / len) * bow
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}

export default function FlowDiagram({ flow, accent = 'signal' }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()
  const byId = Object.fromEntries(flow.nodes.map((n) => [n.id, n]))

  return (
    <div className="flow" ref={ref} data-accent={accent}>
      <svg viewBox={`-8 -5 ${W + 16} ${H + 10}`} role="img" aria-label="System topology">
        {/* forest floor — a scatter of soil flecks rather than a drafting grid */}
        <defs>
          <pattern id={`g-${flow.nodes[0].id}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="4" r="0.7" fill="currentColor" className="flow__grid" />
            <circle cx="9" cy="10" r="0.5" fill="currentColor" className="flow__grid" />
          </pattern>
        </defs>
        <rect x="-8" y="-5" width={W + 16} height={H + 10} fill={`url(#g-${flow.nodes[0].id})`} opacity="0.5" />

        {/* edges */}
        {flow.edges.map(([from, to], i) => {
          const d = edgePath(byId[from], byId[to])
          return (
            <g key={`${from}-${to}`}>
              <motion.path
                d={d}
                className="flow__edge"
                fill="none"
                initial={{ pathLength: reduced ? 1 : 0 }}
                animate={{ pathLength: seen || reduced ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.15 + i * 0.1, ease: EASE }}
              />
              {!reduced && (
                <circle r="2.4" className="flow__packet">
                  <animateMotion dur={`${2.4 + i * 0.35}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.15;0.85;1"
                    dur={`${2.4 + i * 0.35}s`}
                    begin={`${i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          )
        })}

        {/* nodes */}
        {flow.nodes.map((n, i) => {
          const w = nodeWidth(n.label)
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: reduced ? 1 : 0 }}
              animate={{ opacity: seen || reduced ? 1 : 0 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.07, ease: EASE }}
              className={`flow__node flow__node--${n.kind}`}
            >
              <rect x={n.x - w / 2} y={n.y - NODE_H / 2} width={w} height={NODE_H} rx="10" />
              <text x={n.x} y={n.y + 3.2} textAnchor="middle">
                {n.label}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
