'use client'

import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatedNavContext } from './use-animated-navigation'

export default function AnimatedLayout({
  children,
  backgroundColor = 'black',
}: {
  children: React.ReactNode
  backgroundColor?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  // State to track if a navigation is in progress
  const [nextHref, setNextHref] = useState<string | null>(null)

  // Called by TransitionLink via context
  const onNavigate = (href: string) => {
    if (href === pathname) return // no-op if same page
    setNextHref(href)
  }

  // When a navigation is triggered, perform it after a delay (exit animation duration)
  useEffect(() => {
    if (nextHref) {
      // Delay should match your exit animation length (e.g. 0.8s here)
      const timeout = setTimeout(() => {
        router.push(nextHref!)
        setNextHref(null)
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [nextHref, router])

  // Variants for fade-in/out (customize as needed)
  const layoutVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  }

  return (
    <AnimatedNavContext.Provider value={{ onNavigate }}>
      <AnimatePresence mode="wait">
        {/*
          Keyed <motion.div> ensures AnimatePresence can play exit and enter.
          When nextHref is set, we remove the current content to trigger exit.
        */}
        {!nextHref && (
          <motion.div
            key={pathname}
            initial="initial"
            animate="enter"
            exit="exit"
            variants={layoutVariants}
            className="page-transition-container"
            style={{ backgroundColor }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedNavContext.Provider>
  )
}
