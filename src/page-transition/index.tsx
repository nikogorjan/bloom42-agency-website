// src/page-transition/index.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { text, curve, translate } from './anim'
import './curve.scss'

const routes: Record<string, string> = {
  '/': 'Home',
  '/portfolio': 'About',
  '/contact': 'Contact',
}

const anim = (variants: any, phase: 'initial' | 'enter' | 'exit') => ({
  variants,
  initial: 'initial',
  animate: phase,
  exit: 'exit',
})

export default function Curve({
  children,
  phase = 'enter',
}: {
  children: React.ReactNode
  phase?: 'initial' | 'enter' | 'exit'
}) {
  const pathname = usePathname()
  const [dim, setDim] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const resize = () => setDim({ width: window.innerWidth, height: window.innerHeight })
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Responsive bend: tweak to taste
  const minArc = 120
  const maxArc = 300
  const factor = 0.18 // 18% of viewport width
  const arc = Math.round(Math.min(maxArc, Math.max(minArc, dim.width * factor)))

  return (
    <motion.div
      {...anim({ initial: { opacity: 1 }, enter: { opacity: 1 }, exit: { opacity: 1 } }, phase)}
      className="page curve"
    >
      <div style={{ opacity: dim.width === 0 ? 1 : 0 }} className="background" />
      <motion.p className="route" {...anim(text, phase)}>
        {routes[pathname] ?? ''}
      </motion.p>
      {dim.width !== 0 && <SVG width={dim.width} height={dim.height} phase={phase} arc={arc} />}
      {children}
    </motion.div>
  )
}

function SVG({
  width,
  height,
  phase,
  arc,
}: {
  width: number
  height: number
  phase: 'initial' | 'enter' | 'exit'
  arc: number
}) {
  const initialPath = `
    M0 ${arc}
    Q${width / 2} 0 ${width} ${arc}
    L${width} ${height + arc}
    Q${width / 2} ${height + 2 * arc} 0 ${height + arc}
    L0 0
  `
  const targetPath = `
    M0 ${arc}
    Q${width / 2} 0 ${width} ${arc}
    L${width} ${height}
    Q${width / 2} ${height} 0 ${height}
    L0 0
  `

  return (
    <motion.svg {...anim(translate(arc), phase)}>
      <motion.path {...anim(curve(initialPath, targetPath), phase)} />
    </motion.svg>
  )
}
