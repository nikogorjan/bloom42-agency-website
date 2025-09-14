// src/page-transition/transition-provider.tsx
'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Curve from '@/page-transition' // default export from src/page-transition/index.tsx

type Phase = 'initial' | 'enter' | 'exit'
type TransitionContext = { onNavigate: (href: string) => void }

// nullable so callers can no-op gracefully outside provider
const Ctx = createContext<TransitionContext | null>(null)

const EXIT_MS = 750 // match your longest exit animation

export function useAnimatedNavigation() {
  return useContext(Ctx)
}

// helper: pathname + search (no hash)
const pathAndQuery = () => window.location.pathname + window.location.search

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [phase, setPhase] = useState<Phase>('enter')
  const nextHrefRef = useRef<string | null>(null)

  // Track the current URL (without hash) and play enter after any route change
  const currentPathRef = useRef<string>('')
  useEffect(() => {
    currentPathRef.current = pathAndQuery()
    setPhase('enter')
  }, [pathname, searchParams])

  const onNavigate = useCallback(
    (href: string) => {
      if (!href) return
      nextHrefRef.current = href
      setPhase('exit') // 1) play exit
      window.setTimeout(() => {
        const to = nextHrefRef.current
        nextHrefRef.current = null
        if (to) router.push(to) // 2) navigate after exit
        // new page mounts -> effect above sets 'enter'
      }, EXIT_MS)
    },
    [router],
  )

  // Intercept Back/Forward to play exit BEFORE navigating
  useEffect(() => {
    const onPopStateCapture = (e: PopStateEvent) => {
      // Target the URL the browser tried to go to (already applied to location)
      const targetNoHash = pathAndQuery()
      const currentNoHash = currentPathRef.current

      // If only the hash changed (same path+query), let it pass (no big transition)
      if (targetNoHash === currentNoHash) return

      // 1) Block Next's internal popstate handler
      e.stopImmediatePropagation?.()

      // 2) Instantly restore the current URL WITHOUT adding a history entry
      //    (so the Back press is effectively cancelled)
      window.history.replaceState(window.history.state, '', currentNoHash)

      // 3) Now run our normal exit -> push(target) flow
      onNavigate(targetNoHash)
    }

    // Capture phase ensures we run before Next's own listener
    window.addEventListener('popstate', onPopStateCapture, { capture: true })
    return () => window.removeEventListener('popstate', onPopStateCapture, { capture: true } as any)
  }, [onNavigate])

  return (
    <Ctx.Provider value={{ onNavigate }}>
      <Curve phase={phase}>{children}</Curve>
    </Ctx.Provider>
  )
}
