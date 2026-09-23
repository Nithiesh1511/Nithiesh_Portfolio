import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'

/* ---------------------------------------------------------------------------
   The grove.

   The integration topology, told as a forest: an ancient heartwood in the
   middle, five vendor trees in a clearing around it, and a mycelial root
   network between them carrying glowing spores — the wood wide web is the
   original integration layer. Everything is generated from the TREE table
   below, so adding a sixth vendor is one line.
   --------------------------------------------------------------------------- */

const GROUND = -1.85

const PALETTE = {
  light: {
    fern: '#2f6b3f',
    lichen: '#4f8f7a',
    amber: '#c26a2a',
    glow: '#e7b63c',
    canopy: ['#4d7a45', '#5f8f4e', '#3f6b3c', '#77a05c'],
    trunk: '#6b4f36',
    ground: '#b7c39a',
    root: '#7b5d40',
    moss: '#6e8f55',
    stem: '#efe6d0',
  },
  dark: {
    fern: '#8fd18a',
    lichen: '#6cc2a6',
    amber: '#e8a15a',
    glow: '#f3e27a',
    canopy: ['#2a4a35', '#335b3f', '#24412e', '#3b6647'],
    trunk: '#54402d',
    ground: '#10201a',
    root: '#4a3a2a',
    moss: '#1d3a27',
    stem: '#b9b09a',
  },
}

/* Trees are spread across the width and alternate front and back, so no two
   trail markers ever stack on top of each other in the camera's view. */
const TREES = [
  { id: 'azure', label: 'Azure', sub: 'Runtime', x: -3.3, z: -0.5, kind: 'round', h: 1.1, colour: 'fern' },
  { id: 'dosespot', label: 'DoseSpot', sub: 'e-Rx', x: -1.9, z: 1.5, kind: 'pine', h: 0.85, colour: 'amber' },
  { id: 'stedi', label: 'Stedi', sub: 'X12 270/271', x: 1.7, z: 1.6, kind: 'round', h: 0.8, colour: 'lichen' },
  { id: 'cosmos', label: 'Cosmos DB', sub: 'State', x: 2.5, z: -1.3, kind: 'pine', h: 1.25, colour: 'lichen' },
  { id: 'healthie', label: 'Healthie', sub: 'GraphQL', x: 3.8, z: 0.4, kind: 'pine', h: 1.05, colour: 'fern' },
]

function treeBase({ x, z }) {
  return new THREE.Vector3(x, GROUND, z)
}

export default function ForestGrove({ still = false, dark = false }) {
  const c = dark ? PALETTE.dark : PALETTE.light
  const group = useRef()
  const heart = useRef()
  const canopies = useRef([])

  const trees = useMemo(() => TREES.map((t) => ({ ...t, pos: treeBase(t) })), [])

  /* One root per tree. The curve hugs the forest floor and wanders sideways,
     so it reads as something grown rather than a cable laid down. */
  const roots = useMemo(
    () =>
      trees.map((t, i) => {
        const end = t.pos.clone().setY(GROUND + 0.03)
        const a = end.clone().multiplyScalar(0.33)
        const b = end.clone().multiplyScalar(0.66)
        const side = new THREE.Vector3(-end.z, 0, end.x).normalize()
        a.addScaledVector(side, 0.28 * (i % 2 ? 1 : -1)).setY(GROUND + 0.08)
        b.addScaledVector(side, -0.22 * (i % 2 ? 1 : -1)).setY(GROUND + 0.02)
        return {
          id: t.id,
          colour: c[t.colour],
          curve: new THREE.CatmullRomCurve3([new THREE.Vector3(0, GROUND + 0.05, 0), a, b, end]),
        }
      }),
    [trees, c],
  )

  /* Two spores per root, offset in phase and speed, so the traffic never falls
     into a visible lockstep. */
  const spores = useMemo(() => {
    const out = []
    roots.forEach((r, i) => {
      out.push({ curve: r.curve, colour: r.colour, offset: (i * 0.37) % 1, speed: 0.16 + (i % 3) * 0.03 })
      out.push({ curve: r.curve, colour: r.colour, offset: (i * 0.37 + 0.55) % 1, speed: 0.12 + (i % 2) * 0.05 })
    })
    return out
  }, [roots])

  /* A handful of leaves drifting down through the clearing. */
  const leaves = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: Math.sin(i * 12.9898) * 4.2,
        z: Math.cos(i * 78.233) * 1.8,
        phase: (i * 0.137) % 1,
        speed: 0.05 + ((i * 7) % 5) * 0.012,
        spin: 0.6 + (i % 4) * 0.35,
        colour: i % 3 === 0 ? c.amber : i % 3 === 1 ? c.glow : c.canopy[3],
      })),
    [c],
  )

  const sporeRefs = useRef([])
  const leafRefs = useRef([])
  const pointer = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    /* Pointer parallax, eased. The grove leans towards the pointer instead of
       tracking it, which keeps the motion calm at high frame rates. */
    if (group.current) {
      const targetY = state.pointer.x * 0.22
      const targetX = -state.pointer.y * 0.08
      pointer.current.x += (targetY - pointer.current.x) * Math.min(1, delta * 2.4)
      pointer.current.y += (targetX - pointer.current.y) * Math.min(1, delta * 2.4)
      group.current.rotation.y = pointer.current.x + (still ? 0 : Math.sin(t * 0.08) * 0.18)
      group.current.rotation.x = pointer.current.y
    }

    if (still) return

    if (heart.current) {
      heart.current.rotation.y = t * 0.6
      heart.current.position.y = -0.55 + Math.sin(t * 1.3) * 0.08
    }

    /* Wind: every canopy sways on its own phase. */
    canopies.current.forEach((m, i) => {
      if (m) m.rotation.z = Math.sin(t * 0.9 + i * 1.7) * 0.035
    })

    spores.forEach((s, i) => {
      const mesh = sporeRefs.current[i]
      if (!mesh) return
      const u = (s.offset + t * s.speed) % 1
      mesh.position.copy(s.curve.getPointAt(u))
      mesh.position.y += 0.05
      /* Spores fade in as they leave the heartwood and out as they arrive, so
         none ever pops into being mid-root. */
      const fade = Math.min(1, Math.sin(u * Math.PI) * 2.6)
      mesh.scale.setScalar(0.04 + fade * 0.035)
      mesh.material.opacity = fade
    })

    leaves.forEach((l, i) => {
      const mesh = leafRefs.current[i]
      if (!mesh) return
      const u = (l.phase + t * l.speed) % 1
      mesh.position.set(l.x + Math.sin(t * 0.7 + i) * 0.4, 3.2 - u * 5.2, l.z)
      mesh.rotation.set(t * l.spin, t * l.spin * 0.7, Math.sin(t + i) * 0.8)
      mesh.material.opacity = Math.min(1, Math.sin(u * Math.PI) * 2.2) * 0.9
    })
  })

  let canopyIndex = 0
  const canopyRef = () => {
    const i = canopyIndex++
    return (el) => (canopies.current[i] = el)
  }

  return (
    <group ref={group} position={[0.35, 0.15, 0]} scale={0.72}>
      {/* ——— forest floor ——— */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND, 0]} receiveShadow>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial color={c.ground} roughness={1} />
      </mesh>
      <Moss colour={c.moss} />

      {/* ——— mycelial roots ——— */}
      {roots.map((r) => (
        <mesh key={r.id} geometry={tubeFor(r.curve)}>
          <meshStandardMaterial color={c.root} roughness={0.8} />
        </mesh>
      ))}

      {/* ——— spores ——— */}
      {spores.map((s, i) => (
        <mesh key={i} ref={(el) => (sporeRefs.current[i] = el)} scale={0.05}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={s.colour} transparent toneMapped={false} />
        </mesh>
      ))}

      {/* ——— the heartwood ——— */}
      <group position={[0, GROUND, 0]}>
        <mesh position={[0, 1.05, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.36, 2.1, 9]} />
          <meshStandardMaterial color={c.trunk} roughness={0.95} flatShading />
        </mesh>
        {/* buttress roots flaring into the ground */}
        {[0, 1.3, 2.6, 3.9, 5.2].map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.32, 0.12, Math.sin(a) * 0.32]} rotation={[0, -a, Math.PI / 2.6]}>
            <coneGeometry args={[0.11, 0.6, 5]} />
            <meshStandardMaterial color={c.trunk} roughness={0.95} flatShading />
          </mesh>
        ))}
        <group ref={canopyRef()} position={[0, 2.35, 0]}>
          {[
            [0, 0.35, 0, 0.95],
            [-0.75, 0, 0.1, 0.72],
            [0.78, 0.05, -0.05, 0.75],
            [0.15, -0.2, 0.55, 0.62],
            [-0.2, 0.85, -0.2, 0.6],
          ].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]} castShadow>
              <icosahedronGeometry args={[r, 1]} />
              <meshStandardMaterial color={c.canopy[i % c.canopy.length]} roughness={0.85} flatShading />
            </mesh>
          ))}
        </group>
      </group>

      {/* The seed at the heart of the grove — the one thing in the scene that
          glows on its own, and the source every spore travels out from. */}
      <Float speed={still ? 0 : 1.2} rotationIntensity={0} floatIntensity={still ? 0 : 0.2}>
        <group ref={heart} position={[0, -0.55, 0.5]}>
          <mesh scale={0.2}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#ffffff" emissive={c.glow} emissiveIntensity={2.2} roughness={0.3} />
          </mesh>
          <pointLight color={c.glow} intensity={dark ? 3 : 1.2} distance={4} decay={2} />
        </group>
      </Float>

      {/* ——— vendor trees ——— */}
      {trees.map((t) => {
        const top = t.kind === 'pine' ? 2.3 * t.h : 2.05 * t.h
        return (
          <group key={t.id} position={t.pos}>
            <group scale={t.h}>
              {t.kind === 'pine' ? <Pine c={c} canopy={canopyRef()} /> : <RoundTree c={c} canopy={canopyRef()} />}
            </group>

            {/* A ring of glowing mushrooms where the root arrives — the tree's
                own signal colour, so the links read as belonging to it. */}
            {[0, 2.1, 4.2].map((a, j) => (
              <Mushroom
                key={j}
                position={[Math.cos(a + t.x) * 0.38, 0, Math.sin(a + t.x) * 0.38]}
                size={0.1 + j * 0.025}
                glow={c[t.colour]}
                stem={c.stem}
              />
            ))}

            <Html center position={[0, top + 0.35, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
              <div className="pod-label">
                <span className="pod-label__name">{t.label}</span>
                <span className="pod-label__sub">{t.sub}</span>
              </div>
            </Html>
          </group>
        )
      })}

      {/* ——— falling leaves ——— */}
      {leaves.map((l, i) => (
        <mesh key={i} ref={(el) => (leafRefs.current[i] = el)} scale={[0.09, 0.14, 1]}>
          <circleGeometry args={[1, 5]} />
          <meshStandardMaterial color={l.colour} side={THREE.DoubleSide} transparent roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function Pine({ c, canopy }) {
  return (
    <>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 0.6, 6]} />
        <meshStandardMaterial color={c.trunk} roughness={0.95} flatShading />
      </mesh>
      <group ref={canopy}>
        {[
          [0.75, 0.62, 0.95],
          [1.3, 0.48, 0.8],
          [1.8, 0.33, 0.65],
        ].map(([y, r, h], i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <coneGeometry args={[r, h, 7]} />
            <meshStandardMaterial color={c.canopy[i % 3]} roughness={0.85} flatShading />
          </mesh>
        ))}
      </group>
    </>
  )
}

function RoundTree({ c, canopy }) {
  return (
    <>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.11, 1.0, 6]} />
        <meshStandardMaterial color={c.trunk} roughness={0.95} flatShading />
      </mesh>
      <group ref={canopy}>
        {[
          [0, 1.35, 0, 0.55],
          [-0.3, 1.1, 0.15, 0.4],
          [0.32, 1.15, -0.1, 0.42],
          [0.05, 1.7, 0, 0.36],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[r, 0]} />
            <meshStandardMaterial color={c.canopy[(i + 1) % 4]} roughness={0.85} flatShading />
          </mesh>
        ))}
      </group>
    </>
  )
}

function Mushroom({ position, size, glow, stem }) {
  return (
    <group position={position}>
      <mesh position={[0, size * 0.6, 0]}>
        <cylinderGeometry args={[size * 0.18, size * 0.24, size * 1.2, 6]} />
        <meshStandardMaterial color={stem} roughness={0.7} />
      </mesh>
      <mesh position={[0, size * 1.2, 0]}>
        <sphereGeometry args={[size * 0.55, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* Tufts of moss scattered across the floor — cheap flat-shaded domes, placed
   deterministically so the clearing looks the same on every visit. */
function Moss({ colour }) {
  const tufts = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const a = i * 2.399
        const r = 1.1 + ((i * 37) % 50) / 11
        return { x: Math.cos(a) * r, z: Math.sin(a) * r * 0.62, s: 0.12 + ((i * 13) % 7) * 0.03 }
      }),
    [],
  )
  return tufts.map((t, i) => (
    <mesh key={i} position={[t.x, GROUND, t.z]} scale={[t.s * 1.6, t.s, t.s * 1.3]}>
      <sphereGeometry args={[1, 7, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={colour} roughness={1} flatShading />
    </mesh>
  ))
}

/* Tube geometries are built once per curve and cached on the curve object —
   cheaper than a useMemo per root and it keeps the JSX above flat. */
function tubeFor(curve) {
  if (!curve.__tube) curve.__tube = new THREE.TubeGeometry(curve, 64, 0.022, 6, false)
  return curve.__tube
}
