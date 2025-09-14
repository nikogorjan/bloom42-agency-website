// src/page-transition/transition-provider.tsx
'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Curve from '@/page-transition' // default export from src/page-transition/index.tsx

type Phase = 'initial' | 'enter' | 'exit'

type TransitionContext = {
  onNavigate: (href: string) => void
}

const Ctx = createContext<TransitionContext>({ onNavigate: () => {} })

const EXIT_MS = 750 // match the longest exit transition duration in anim.ts

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
    // when route changes after push, play enter
    setPhase('enter')
  }, [pathname])

  const onNavigate = useCallback(
    (href: string) => {
      if (!href || href === pathname) return
      nextHrefRef.current = href
      setPhase('exit') // 1) play exit

      window.setTimeout(() => {
        const to = nextHrefRef.current
        nextHrefRef.current = null
        if (to) router.push(to) // 2) navigate after exit
        // 3) new page mounts -> effect above sets 'enter'
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
