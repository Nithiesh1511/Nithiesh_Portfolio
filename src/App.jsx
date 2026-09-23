import { useEffect, useState } from 'react'
import About from './components/About.jsx'
import Boot from './components/Boot.jsx'
import Contact from './components/Contact.jsx'
import Hero from './components/Hero.jsx'
import Learning from './components/Learning.jsx'
import Nav from './components/Nav.jsx'
import PageTree from './components/PageTree.jsx'
import Path from './components/Path.jsx'
import Stack, { Ticker } from './components/Stack.jsx'
import Woodland from './components/Woodland.jsx'
import Work from './components/Work.jsx'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [ready, setReady] = useState(false)

  /* The WebGL bundle only starts loading once the boot sequence is done, so
     the shell paints first and the scene arrives into a page that is already
     readable. */
  useEffect(() => {
    if (!ready) return
    document.body.dataset.ready = 'true'
  }, [ready])

  return (
    <>
      <Boot onDone={() => setReady(true)} />
      <Nav theme={theme} onToggleTheme={toggleTheme} />

      <PageTree />
      <main>
        <Hero ready={ready} theme={theme} />
        <Ticker />
        <About />
        <Work />
        <Stack />
        <Learning />
        <Path />
        <Contact />
      </main>

      {/* The page sits in a wood that never scrolls away - only drifts. */}
      <Woodland />
    </>
  )
}
