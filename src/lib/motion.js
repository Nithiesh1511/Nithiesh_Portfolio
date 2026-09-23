/* Shared motion vocabulary. One easing curve for everything that moves, so the
   whole page decelerates with the same hand. */

export const EASE = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]

export const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
}

/** Parent that deals its children out in sequence. */
export const stagger = (delay = 0.06, start = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: start } },
})

/** A line of type arriving from under a clipping mask. */
export const maskLine = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 0.95, ease: EASE } },
}

export const viewport = { once: true, margin: '-12% 0px -12% 0px' }
