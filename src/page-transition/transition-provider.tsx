// src/page-transition/transition-provider.tsx
'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Curve from '@/page-transition'

export type Phase = 'initial' | 'enter' | 'exit'

type TransitionContext = {
  onNavigate: (href: string) => void
  /** Tell the provider this page WANTS to hold enter until setPageReady(). */
  setShouldWait: (wait: boolean) => void
  /** Call when the page is visually ready (used only if shouldWait=true). */
  setPageReady: () => void
}

const Ctx = createContext<TransitionContext | null>(null)

const EXIT_MS = 750
const ENTER_FALLBACK_MS = 750

export function useAnimatedNavigation() {
  return useContext(Ctx)
}

const pathAndQuery = () => window.location.pathname + window.location.search

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [phase, setPhase] = useState<Phase>('enter')
  const nextHrefRef = useRef<string | null>(null)

  // Opt-in waiting flag (page sets this to true if it wants to hold enter)
  const shouldWaitRef = useRef(false)

  // Internal waiting state for the current route transition
  const waitingForReadyRef = useRef(false)
  const enterFallbackTimer = useRef<number | null>(null)

  const clearEnterFallback = useCallback(() => {
    if (enterFallbackTimer.current != null) {
      window.clearTimeout(enterFallbackTimer.current)
      enterFallbackTimer.current = null
    }
  }, [])

  // Route changes: decide to wait or not based on shouldWaitRef
  useEffect(() => {
    clearEnterFallback()
    setPhase('initial')

    if (shouldWaitRef.current) {
      waitingForReadyRef.current = true
      enterFallbackTimer.current = window.setTimeout(() => {
        if (waitingForReadyRef.current) {
          waitingForReadyRef.current = false
          setPhase('enter')
        }
      }, ENTER_FALLBACK_MS) as unknown as number
    } else {
      // No waiting requested for this route -> enter immediately
      waitingForReadyRef.current = false
      setPhase('enter')
    }

    // Reset per-route flag (pages must opt in each time)
    shouldWaitRef.current = false

    return clearEnterFallback
  }, [pathname, searchParams, clearEnterFallback])

  const setShouldWait = useCallback(
    (wait: boolean) => {
      // Page opts into waiting for THIS route load.
      shouldWaitRef.current = wait

      // If the route is currently at 'initial' and not already waiting,
      // enable waiting immediately (prevents instant enter if page sets late but still early enough).
      if (wait && phase === 'initial' && !waitingForReadyRef.current) {
        waitingForReadyRef.current = true
        clearEnterFallback()
        enterFallbackTimer.current = window.setTimeout(() => {
          if (waitingForReadyRef.current) {
            waitingForReadyRef.current = false
            setPhase('enter')
          }
        }, ENTER_FALLBACK_MS) as unknown as number
      }
    },
    [phase, clearEnterFallback],
  )

  const setPageReady = useCallback(() => {
    if (!waitingForReadyRef.current) return
    waitingForReadyRef.current = false
    clearEnterFallback()
    setPhase('enter')
  }, [clearEnterFallback])

  const onNavigate = useCallback(
    (href: string) => {
      if (!href) return
      nextHrefRef.current = href
      setPhase('exit')
      window.setTimeout(() => {
        const to = nextHrefRef.current
        nextHrefRef.current = null
        if (to) router.push(to)
      }, EXIT_MS)
    },
    [router],
  )

  // Back/Forward interception
  const currentPathRef = useRef<string>('')
  useEffect(() => {
    currentPathRef.current = pathAndQuery()
  }, [pathname, searchParams])

  useEffect(() => {
    const onPopStateCapture = (e: PopStateEvent) => {
      const targetNoHash = pathAndQuery()
      const currentNoHash = currentPathRef.current
      if (targetNoHash === currentNoHash) return
      e.stopImmediatePropagation?.()
      window.history.replaceState(window.history.state, '', currentNoHash)
      onNavigate(targetNoHash)
    }
    window.addEventListener('popstate', onPopStateCapture, { capture: true })
    return () => window.removeEventListener('popstate', onPopStateCapture, { capture: true } as any)
  }, [onNavigate])

  return (
    <Ctx.Provider value={{ onNavigate, setShouldWait, setPageReady }}>
      <Curve phase={phase}>{children}</Curve>
    </Ctx.Provider>
  )
}
