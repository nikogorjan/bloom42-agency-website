// src/Header/MobileMenuOverlay.tsx
'use client'

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { TransitionLink } from '@/page-transition/transition-link'

type RelationTo = 'pages' | 'posts'
interface Reference {
  relationTo: RelationTo
  value: { slug: string } | any
}
interface SubItem {
  type: 'reference' | 'custom'
  label: string
  description?: string
  newTab?: boolean
  reference?: Reference
  url?: string
  icon?: any
  media?: any
}
interface NavItemDropdown {
  type: 'dropdown'
  label: string
  defaultImage?: any
  items: SubItem[]
}
interface NavItemLink {
  type: 'reference' | 'custom'
  label: string
  newTab?: boolean
  reference?: Reference
  url?: string
}
type NavItem = NavItemDropdown | NavItemLink
interface MobileLinkWrapper {
  link: any
}

export type MobileMenuOverlayRef = {
  /** Called by parent before closing the whole menu; makes sure subpanel slides out first */
  prepareClose: () => Promise<void>
}

const D = 0.75
const E = [0.76, 0, 0.24, 1] as const
const SUB_D = 0.3 // subpanel slide duration

const MobileMenuOverlay = forwardRef<
  MobileMenuOverlayRef,
  {
    open: boolean
    navItems: NavItem[]
    links?: MobileLinkWrapper[]
    onRequestClose: () => void
  }
>(({ open, navItems, onRequestClose }, ref) => {
  const [dim, setDim] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const resize = () => setDim({ width: window.innerWidth, height: window.innerHeight })
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // responsive arc
  const minArc = 120
  const maxArc = 300
  const factor = 0.18
  const arc = Math.round(Math.min(maxArc, Math.max(minArc, dim.width * factor)))

  // paths
  const initialPath = `
      M0 ${arc}
      Q${dim.width / 2} 0 ${dim.width} ${arc}
      L${dim.width} ${dim.height + arc}
      Q${dim.width / 2} ${dim.height + 2 * arc} 0 ${dim.height + arc}
      L0 0
    `
  const targetPath = `
      M0 ${arc}
      Q${dim.width / 2} 0 ${dim.width} ${arc}
      L${dim.width} ${dim.height + arc * 3}
      Q${dim.width / 2} ${dim.height + arc * 4} 0 ${dim.height + arc * 3}
      L0 0
    `
  const svgHeight = dim.height + arc * 4

  // ───────────────── subpanel state
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null)
  const subOpen = activeDropdownIndex !== null
  const activeDropdown = useMemo(
    () => (subOpen ? (navItems[activeDropdownIndex!] as NavItemDropdown) : null),
    [subOpen, activeDropdownIndex, navItems],
  )

  const openSub = (index: number) => setActiveDropdownIndex(index)
  const closeSub = () => setActiveDropdownIndex(null)

  // Let parent await this before actually closing the curve
  useImperativeHandle(
    ref,
    () => ({
      prepareClose: () =>
        new Promise<void>((resolve) => {
          if (!subOpen) return resolve()
          closeSub()
          const t = setTimeout(() => resolve(), SUB_D * 1000 + 50)
          return () => clearTimeout(t)
        }),
    }),
    [subOpen],
  )

  // content fade AFTER curve sweep; disable clicks while hidden
  const contentVariants = {
    closed: { opacity: 0, pointerEvents: 'none' as const, transition: { duration: 0.2 } },
    open: { opacity: 1, pointerEvents: 'auto' as const, transition: { duration: 0.25, delay: D } },
  }

  // main list + subpanel slide container
  // We keep them stacked; subpanel slides over the main list.
  const panelWrapStyle = 'relative w-full h-[75vh] overflow-hidden'

  const subVariants = {
    hidden: { x: '100%', transition: { duration: SUB_D, ease: E } },
    visible: { x: '0%', transition: { duration: SUB_D, ease: E } },
  }

  function IconChevronRight({
    size = 28,
    stroke = 2,
    className = '',
  }: {
    size?: number
    stroke?: number
    className?: string
  }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  function IconChevronLeft({
    size = 28,
    stroke = 2,
    className = '',
  }: {
    size?: number
    stroke?: number
    className?: string
  }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <>
      {/* SVG sweep — beneath header (z-1000), above content background */}
      {dim.width !== 0 && (
        <motion.svg
          className="mobile-curve"
          style={{ height: svgHeight }}
          initial={{ top: '100vh' }}
          animate={open ? { top: `-${arc}px` } : { top: '100vh' }}
          transition={{ duration: D, ease: E }}
        >
          <motion.path
            initial={{ d: initialPath }}
            animate={{ d: open ? targetPath : initialPath }}
            transition={{ duration: D, ease: E }}
          />
        </motion.svg>
      )}

      {/* Content */}
      <motion.div
        className="fixed inset-0 z-[950] flex flex-col items-center justify-start pt-20 pb-16 px-[5%] gap-6"
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={contentVariants}
      >
        <div className={panelWrapStyle}>
          {/* MAIN LIST (stays underneath) */}
          <div className="absolute inset-0 overflow-y-auto">
            <ul className="flex flex-col gap-1">
              {navItems?.map((navItem: NavItem, i: number) => {
                if (navItem.type === 'dropdown') {
                  return (
                    <li key={`dd-${i}`}>
                      <button
                        type="button"
                        onClick={() => openSub(i)}
                        className="w-full text-left text-darkSky font-anton uppercase text-2xl py-3 px-2 rounded-xl hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{navItem.label}</span>
                        {/* chevron right */}
                        <div className="flex items-center gap-1 py-2 px-2 rounded-md hover:bg-gray-50">
                          <IconChevronRight className="shrink-0" />
                        </div>
                      </button>
                    </li>
                  )
                }

                // simple link
                const item = navItem as NavItemLink
                const href =
                  item.type === 'reference' && item.reference
                    ? `/${item.reference.relationTo !== 'pages' ? item.reference.relationTo : ''}/${(item.reference.value as any).slug}`
                    : item.url || '#'
                const newTabProps = item.newTab
                  ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
                  : ({} as const)

                return (
                  <li key={`ln-${i}`}>
                    <TransitionLink
                      href={href}
                      className="block w-full text-2xl text-darkSky font-anton uppercase py-3 px-2 rounded-xl hover:bg-gray-50"
                      {...newTabProps}
                      onClick={onRequestClose}
                    >
                      {item.label}
                    </TransitionLink>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* SUBPANEL (slides over from right when a dropdown is opened) */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial="hidden"
            animate={subOpen ? 'visible' : 'hidden'}
            variants={subVariants}
          >
            {/* Subpanel header with back chevron */}
            <div className="flex items-center justify-between  pb-2">
              <button
                type="button"
                onClick={closeSub}
                className="flex items-center gap-1 py-2 px-2 rounded-md hover:bg-gray-50"
              >
                <IconChevronLeft className="shrink-0" />
              </button>
            </div>

            {/* Subpanel list */}
            <div className="overflow-y-auto h-[calc(75vh-44px)]">
              <ul className="flex flex-col gap-2">
                {activeDropdown?.items?.map((sub: SubItem, j: number) => {
                  const href =
                    sub?.type === 'reference' && sub?.reference
                      ? `/${sub.reference.relationTo !== 'pages' ? sub.reference.relationTo : ''}/${(sub.reference.value as any).slug}`
                      : sub?.url || '#'
                  const newTabProps = sub?.newTab
                    ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
                    : ({} as const)
                  return (
                    <li key={`sub-${activeDropdownIndex}-${j}`}>
                      <TransitionLink
                        href={href}
                        className="block w-full text-2xl text-darkSky font-anton uppercase py-3 px-2 rounded-xl hover:bg-gray-50"
                        {...newTabProps}
                        onClick={onRequestClose}
                      >
                        {sub?.label}
                      </TransitionLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
})

MobileMenuOverlay.displayName = 'MobileMenuOverlay'
export default MobileMenuOverlay
