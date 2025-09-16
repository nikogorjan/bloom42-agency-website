'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { TransitionLink } from '@/page-transition/transition-link'
import { CMSLink } from '@/components/Link'
import { curveMenu } from '@/page-transition/anim'

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

export default function MobileMenuOverlay({
  open,
  navItems,
  links,
  onClose,
}: {
  open: boolean
  navItems: NavItem[]
  links?: MobileLinkWrapper[]
  onClose: () => void
}) {
  const [dim, setDim] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const resize = () => setDim({ width: window.innerWidth, height: window.innerHeight })
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // responsive arc like the page curve
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

  // IMPORTANT: translate uses the SAME arc to lift the SVG by -arc px
  // so the flat part aligns with the top of the viewport when open.
  const translateMenu = {
    closed: {
      top: '100vh',
      transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
    },
    open: {
      top: `-${arc}px`,
      transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
      transitionEnd: { top: `-${arc}px` }, // park
    },
  }

  // links fade AFTER the sweep; not clickable while hidden
  const contentVariants = {
    closed: { opacity: 0, pointerEvents: 'none' as const, transition: { duration: 0.2 } },
    open: {
      opacity: 1,
      pointerEvents: 'auto' as const,
      transition: { duration: 0.25, delay: 0.75 },
    },
  }

  // dynamic height so the SVG always covers (viewport + 2*arc)
  const svgHeight = dim.height + arc * 4

  return (
    <>
      {/* SVG sweep – above page content, below header */}
      {dim.width !== 0 && (
        <motion.svg
          className="mobile-curve"
          style={{ height: svgHeight }}
          initial="closed"
          animate={open ? 'open' : 'closed'}
          variants={translateMenu}
        >
          <motion.path variants={curveMenu(initialPath, targetPath)} />
        </motion.svg>
      )}

      {/* Menu content – appears after sweep; unclickable while hidden */}
      <motion.div
        className="fixed inset-0 z-[950] flex flex-col items-center justify-start pt-28 pb-16 px-6 gap-6"
        initial={false}
        animate={open ? 'open' : 'closed'}
        variants={contentVariants}
      >
        <nav className="w-full max-w-[520px]">
          <ul className="flex flex-col gap-2">
            {navItems?.flatMap((navItem: NavItem, i: number) => {
              if (navItem.type === 'dropdown') {
                return (navItem.items || []).map((sub: SubItem, j: number) => {
                  const href =
                    sub?.type === 'reference' && sub?.reference
                      ? `/${sub.reference.relationTo !== 'pages' ? sub.reference.relationTo : ''}/${(sub.reference.value as any).slug}`
                      : sub?.url || '#'
                  const newTabProps = sub?.newTab
                    ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
                    : ({} as const)
                  return (
                    <li key={`${i}-${j}`}>
                      <TransitionLink
                        href={href}
                        className="block w-full text-2xl py-3 px-4 rounded-xl hover:bg-gray-50"
                        {...newTabProps}
                        onClick={onClose}
                      >
                        {sub?.label}
                      </TransitionLink>
                    </li>
                  )
                })
              } else {
                const item = navItem as NavItemLink
                const href =
                  item.type === 'reference' && item.reference
                    ? `/${item.reference.relationTo !== 'pages' ? item.reference.relationTo : ''}/${(item.reference.value as any).slug}`
                    : item.url || '#'
                const newTabProps = item.newTab
                  ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
                  : ({} as const)
                return [
                  <li key={i}>
                    <TransitionLink
                      href={href}
                      className="block w-full text-2xl py-3 px-4 rounded-xl hover:bg-gray-50"
                      {...newTabProps}
                      onClick={onClose}
                    >
                      {item.label}
                    </TransitionLink>
                  </li>,
                ]
              }
            })}
          </ul>
        </nav>

        {!!links?.length && (
          <div className="w-full max-w-[520px]">
            <div className="flex flex-col gap-3 mt-2">
              {links!.map(({ link }: MobileLinkWrapper, i: number) => (
                <CMSLink
                  key={i}
                  {...(link as any)}
                  className="w-full justify-center text-base py-3 rounded-xl"
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
