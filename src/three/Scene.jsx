import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import ForestGrove from './ForestGrove.jsx'

/* ---------------------------------------------------------------------------
   The hero canvas - a clearing in the wood.

   Day is warm low sun through the canopy with pollen in the air; night is cool
   moonlight, with fireflies doing the work the sun did. Fog is the page colour,
   so the far side of the grove dissolves into the paper instead of ending on a
   hard edge. `flat` disables tone mapping so the paper stays paper.
   --------------------------------------------------------------------------- */

export default function Scene({ still = false, paused = false, theme = 'light' }) {
  const dark = theme === 'dark'
  const paper = dark ? '#0b1510' : '#f2efe2'

  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      frameloop={still || paused ? 'demand' : 'always'}
      camera={{ position: [0, 0.6, 9.6], fov: 38, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <fog attach="fog" args={[paper, 9, 17]} />

      <Suspense fallback={null}>
        <hemisphereLight
          intensity={dark ? 0.65 : 0.85}
          color={dark ? '#9fb8ff' : '#fff6dc'}
          groundColor={dark ? '#0b1510' : '#8fa36f'}
        />
        {/* Sun (or moon) low and to the side, so every canopy has a lit face
            and a shaded one. */}
        <directionalLight position={[5, 6, 4]} intensity={dark ? 0.85 : 1.5} color={dark ? '#b8c8ff' : '#ffe2a8'} />
        <directionalLight position={[-6, 3, -4]} intensity={dark ? 0.2 : 0.4} color={dark ? '#6f8fd8' : '#cfe3b8'} />

        <ForestGrove still={still} dark={dark} />

        {/* Fireflies at night, drifting pollen by day. */}
        <Sparkles
          count={dark ? 70 : 45}
          scale={[11, 4.5, 6]}
          position={[0, 0.2, 0]}
          size={dark ? 4.5 : 2.6}
          speed={still ? 0 : 0.35}
          opacity={dark ? 1 : 0.7}
          color={dark ? '#f3e27a' : '#d9a441'}
          noise={1.2}
        />

        <ContactShadows
          position={[0.35, -1.16, 0]}
          opacity={dark ? 0.6 : 0.38}
          scale={14}
          blur={2.6}
          far={4.5}
          resolution={512}
          color={dark ? '#000000' : '#15261c'}
        />

        {/* Bloom picks out the seed, spores, mushrooms and fireflies. The
            threshold is high so the foliage never glows. */}
        <EffectComposer enabled={!still} multisampling={4}>
          <Bloom intensity={dark ? 1.3 : 0.6} luminanceThreshold={0.72} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
