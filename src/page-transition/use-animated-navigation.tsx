// src/page-transition/useAnimatedNavigation.tsx
'use client'

import { createContext, useContext } from 'react'

interface NavContext {
  onNavigate: (href: string) => void
}

export const AnimatedNavContext = createContext<NavContext>({
  onNavigate: () => {
    throw new Error('AnimatedNavContext not initialized')
  },
})

export function useAnimatedNavigation() {
  return useContext(AnimatedNavContext)
}
