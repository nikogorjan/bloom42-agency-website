'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Environment, AdaptiveDpr, AdaptiveEvents, Center } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import * as THREE from 'three'

/** Anchor children to a viewport corner in *screen space*. */
function Anchor({
  children,
  corner = 'br', // 'br' | 'bl' | 'tr' | 'tl'
  margin = [0.6, 0.6], // world units margin from edges (x, y)
  depth = 0, // z at which to compute viewport size
}: {
  children: React.ReactNode
  corner?: 'br' | 'bl' | 'tr' | 'tl'
  margin?: [number, number]
  depth?: number
}) {
  const group = useRef<THREE.Group>(null)
  const { viewport, camera } = useThree()

  useFrame(() => {
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, depth])
    const [mx, my] = margin
    const x = corner.includes('r') ? width / 2 - mx : -width / 2 + mx
    const y = corner.includes('t') ? height / 2 - my : -height / 2 + my
    group.current!.position.set(x, y, depth)
  })

  return <group ref={group}>{children}</group>
}

function useResponsiveScale(desktop = 2.5, mobile = 1.6) {
  const [scale, setScale] = useState(desktop)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const update = () => setScale(mql.matches ? mobile : desktop)
    update()
    mql.addEventListener?.('change', update)
    return () => mql.removeEventListener?.('change', update)
  }, [desktop, mobile])
  return scale
}

function Model({ url = '/models/my-object-meshopt.glb' }: { url?: string }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    ;(loader as GLTFLoader).setMeshoptDecoder(MeshoptDecoder)
  })

  useMemo(() => {
    gltf.scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if ((mesh as any).isMesh) {
        mesh.castShadow = false
        mesh.receiveShadow = false
        const mat = mesh.material as THREE.Material & { side?: number }
        if (mat && 'side' in mat) mat.side = THREE.FrontSide
      }
    })
  }, [gltf.scene])

  return <primitive object={gltf.scene} />
}

export default function ThreeMeshoptViewer() {
  const scale = useResponsiveScale(0.9, 1.0) // desktop, mobile

  return (
    <div className="relative w-full h-full pointer-events-none">
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [2.8, 1.3, 3.4], fov: 45 }} // a touch farther back for 2.5×
        shadows={false}
        frameloop="always"
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Simple, cheap lighting */}
        <hemisphereLight intensity={0.8} />
        <directionalLight position={[2, 4, 2]} intensity={1.1} />

        <Suspense fallback={null}>
          <Environment preset="city" resolution={256} />

          {/* Center recenters the model’s pivot at the origin; we then anchor the group to bottom-right */}
          <Anchor corner="br" margin={[0.8, 1.7]}>
            <Center>
              <group scale={scale}>
                <Model />
              </group>
            </Center>
          </Anchor>
        </Suspense>
      </Canvas>
    </div>
  )
}
