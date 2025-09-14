// src/page-transition/transition-provider.tsx
'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Curve from '@/page-transition' // default export from src/page-transition/index.tsx

type Phase = 'initial' | 'enter' | 'exit'
type TransitionContext = { onNavigate: (href: string) => void }

// IMPORTANT: default is null so consumers can detect missing provider
const Ctx = createContext<TransitionContext | null>(null)

const EXIT_MS = 750 // match your longest exit animation

export function useAnimatedNavigation() {
  return useContext(Ctx)
}

export default function TransitionProvider({
  children,
  backgroundColor = 'black',
}: {
  children: React.ReactNode
  backgroundColor?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('enter')
  const nextHrefRef = useRef<string | null>(null)

  useEffect(() => {
    setPhase('enter') // after route change, play enter
  }, [pathname])

  const onNavigate = useCallback(
    (href: string) => {
      if (!href || href === pathname) return
      nextHrefRef.current = href
      setPhase('exit') // play exit

      window.setTimeout(() => {
        const to = nextHrefRef.current
        nextHrefRef.current = null
        if (to) router.push(to) // then navigate
        // new page mounts -> phase becomes 'enter' in the effect above
      }, EXIT_MS)
    },
    [pathname, router],
  )

  return (
    <Ctx.Provider value={{ onNavigate }}>
      <Curve backgroundColor={backgroundColor} phase={phase}>
        {children}
      </Curve>
    </Ctx.Provider>
  )
}
