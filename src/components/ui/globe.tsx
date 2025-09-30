'use client'
import { useEffect, useRef, useState } from 'react'
import { Color, Scene, Fog, PerspectiveCamera, Vector3, Group } from 'three'
import ThreeGlobe from 'three-globe'
import { useThree, Canvas, extend } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import countries from '@/data/globe.json'

declare module '@react-three/fiber' {
  interface ThreeElements {
    threeGlobe: ThreeElements['mesh'] & {
      new (): ThreeGlobe
    }
  }
}

extend({ ThreeGlobe: ThreeGlobe })

const RING_PROPAGATION_SPEED = 3
const aspect = 1.2
const cameraZ = 300

type Position = {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
}

export type GlobeConfig = {
  pointSize?: number
  globeColor?: string
  showAtmosphere?: boolean
  atmosphereColor?: string
  atmosphereAltitude?: number
  emissive?: string
  emissiveIntensity?: number
  shininess?: number
  polygonColor?: string
  ambientLight?: string
  directionalLeftLight?: string
  directionalTopLight?: string
  pointLight?: string
  arcTime?: number
  arcLength?: number
  rings?: number
  maxRings?: number
  initialPosition?: { lat: number; lng: number }
  autoRotate?: boolean
  autoRotateSpeed?: number
}

interface WorldProps {
  globeConfig: GlobeConfig
  data: Position[]
  onReady?: () => void
}

let numbersOfRings = [0]

export function Globe({ globeConfig, data, onReady }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null)
  const groupRef = useRef<Group | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: '#ffffff',
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: 'rgba(255,255,255,0.7)',
    globeColor: '#1d072e',
    emissive: '#000000',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  }

  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe()
      groupRef.current.add(globeRef.current as unknown as Group)
      setIsInitialized(true)
    }
  }, [])

  // Build material
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return
    const mat = globeRef.current.globeMaterial() as unknown as {
      color: Color
      emissive: Color
      emissiveIntensity: number
      shininess: number
    }
    mat.color = new Color(defaultProps.globeColor ?? '#1d072e')
    mat.emissive = new Color(defaultProps.emissive ?? '#000000')
    mat.emissiveIntensity = defaultProps.emissiveIntensity ?? 0.1
    mat.shininess = defaultProps.shininess ?? 0.9
  }, [
    isInitialized,
    defaultProps.globeColor,
    defaultProps.emissive,
    defaultProps.emissiveIntensity,
    defaultProps.shininess,
  ])

  // Build data
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return

    type Point = {
      size: number
      order: number
      color: string
      lat: number
      lng: number
    }

    const points: Point[] = []
    for (const arc of data) {
      // add both endpoints as points
      points.push({
        size: defaultProps.pointSize ?? 1,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      })
      points.push({
        size: defaultProps.pointSize ?? 1,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      })
    }

    // de-dup by lat/lng
    const filteredPoints = points.filter(
      (v, i, a) => a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i,
    )

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(!!defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor ?? '#ffffff')
      .atmosphereAltitude(defaultProps.atmosphereAltitude ?? 0.1)
      .hexPolygonColor(() => defaultProps.polygonColor ?? 'rgba(255,255,255,0.7)')

    const widths = [0.32, 0.28, 0.3] as const

    globeRef.current
      .arcsData(data)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor('color')
      .arcAltitude('arcAlt')
      .arcStroke(() => widths[(Math.random() * widths.length) | 0] ?? 0.3)
      .arcDashLength(defaultProps.arcLength ?? 0.9)
      .arcDashInitialGap('order')
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime ?? 2000)

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor('color')
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2)

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor ?? 'rgba(255,255,255,0.7)')
      .ringMaxRadius(defaultProps.maxRings ?? 3)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        ((defaultProps.arcTime ?? 2000) * (defaultProps.arcLength ?? 0.9)) /
          (defaultProps.rings ?? 1),
      )
  }, [
    isInitialized,
    data,
    defaultProps.pointSize,
    defaultProps.showAtmosphere,
    defaultProps.atmosphereColor,
    defaultProps.atmosphereAltitude,
    defaultProps.polygonColor,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.rings,
    defaultProps.maxRings,
  ])

  // Rings animation
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return

    const interval = setInterval(() => {
      if (!globeRef.current) return

      const newNumbersOfRings = genRandomNumbers(0, data.length, Math.floor((data.length * 4) / 5))

      const ringsData = data
        .filter((_d, i) => newNumbersOfRings.includes(i))
        .map((d) => ({
          lat: d.startLat,
          lng: d.startLng,
          color: d.color,
        }))

      globeRef.current.ringsData(ringsData)
    }, 2000)

    return () => clearInterval(interval)
  }, [isInitialized, data])

  const readySent = useRef(false)
  useEffect(() => {
    if (!isInitialized) return
    if (readySent.current) return
    const id = requestAnimationFrame(() => {
      if (!readySent.current) {
        readySent.current = true
        onReady?.() // signal to the transition provider
      }
    })
    return () => cancelAnimationFrame(id)
  }, [isInitialized, onReady])

  return <group ref={groupRef} />
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree()
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio)
    gl.setSize(size.width, size.height)
    gl.setClearColor(0xffaaff, 0)
  }, [gl, size])
  return null
}

export function World(props: WorldProps) {
  const { globeConfig, onReady } = props
  const scene = new Scene()
  scene.fog = new Fog(0xffffff, 400, 2000)

  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight ?? '#ffffff'} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight ?? '#ffffff'}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight ?? '#ffffff'}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight ?? '#ffffff'}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} onReady={onReady} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={0.5}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  )
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b)

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16),
  }
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = []
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min
    if (!arr.includes(r)) arr.push(r)
  }
  return arr
}
