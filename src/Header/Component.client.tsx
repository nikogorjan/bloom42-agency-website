// src/Header/Component.client.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import type { Header } from '@/payload-types'
import { TransitionLink } from '@/page-transition/transition-link'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { NavDropdown } from './nav-dropdown'
import MobileMenu from './mobile-menu'

type DropdownItem = any

export const HeaderClient: React.FC<{ data: Header }> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isOpen = openIndex !== null

  const activeItem: DropdownItem | null = useMemo(
    () =>
      openIndex != null && data.navItems?.[openIndex]?.type === 'dropdown'
        ? (data.navItems[openIndex] as any)
        : null,
    [openIndex, data.navItems],
  )

  const [preview, setPreview] = useState<any>(activeItem?.defaultImage)
  useEffect(() => {
    setPreview(activeItem?.defaultImage)
  }, [activeItem])

  useEffect(() => {
    setHeaderTheme(null)
    setOpenIndex(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="fixed inset-x-0 top-5 z-[1000] px-[5%]"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="hidden lg:block">
        {/* Outer pill: radius snaps (no radius transition) */}
        <div
          className={[
            'container max-w-[992px] bg-white border-2 border-lightGray shadow-sm overflow-hidden',
            isOpen ? 'rounded-[28px]' : 'rounded-full',
            // avoid transition-all here so radius snaps; you can keep shadow transition if you want:
            'transition-shadow',
          ].join(' ')}
          onMouseLeave={() => setOpenIndex(null)} // close when leaving header+panel to page
        >
          {/* Top bar (no inner rounding) */}
          <div className="px-3 py-2 min-h-14">
            <div className="w-full flex items-center justify-between">
              {/* Left: logo + nav */}
              <div className="flex items-center">
                <div>
                  <TransitionLink
                    href={data.logoUrl || '/'}
                    className="block relative size-8 select-none cursor-pointer"
                    onMouseEnter={() => setOpenIndex(null)} // hover logo closes
                  >
                    <Media
                      fill
                      imgClassName="object-contain rounded-[4px] md:rounded-[6px]"
                      priority
                      resource={data.logo}
                    />
                  </TransitionLink>
                </div>

                {/* Primary nav */}
                <div className="ml-8">
                  <div className="relative flex items-center gap-2">
                    {data.navItems?.map((navItem: any, i: number) => {
                      if (navItem.type === 'dropdown') {
                        return (
                          <NavDropdown
                            key={i}
                            item={navItem}
                            index={i}
                            isOpen={openIndex === i}
                            onOpen={(idx) => setOpenIndex(idx)} // opens on hover
                          />
                        )
                      }

                      const href =
                        navItem.type === 'reference' && navItem.reference
                          ? `/${
                              navItem.reference.relationTo !== 'pages'
                                ? navItem.reference.relationTo
                                : ''
                            }/${(navItem.reference.value as any).slug}`
                          : navItem.url || '#'

                      const newTabProps = navItem.newTab
                        ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
                        : ({} as const)

                      return (
                        <TransitionLink
                          key={i}
                          href={href}
                          className="text-base px-2 h-10 flex items-center"
                          {...newTabProps}
                          onMouseEnter={() => setOpenIndex(null)} // hover regular link closes
                        >
                          {navItem.label}
                        </TransitionLink>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right actions — close on hover */}
              <div
                className="relative flex items-center gap-4"
                onMouseEnter={() => setOpenIndex(null)}
              >
                {data.links?.map(({ link }, i) => (
                  <CMSLink key={i} {...link} className="text-sm px-4 h-10" />
                ))}
              </div>
            </div>
          </div>

          {/* Panel: animate height/opacity only */}
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
              isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              {activeItem && (
                <div
                  className="p-3 border-t-2 border-lightGray"
                  onMouseLeave={() => setPreview(activeItem?.defaultImage)} // only resets preview
                >
                  <div className="flex items-start gap-3">
                    {/* LEFT: items */}
                    <div className="w-full">
                      {activeItem.items?.map((sub: any, j: number) => {
                        const href =
                          sub?.type === 'reference' && sub?.reference
                            ? `/${
                                sub.reference.relationTo !== 'pages' ? sub.reference.relationTo : ''
                              }/${(sub.reference.value as any).slug}`
                            : sub?.url || '#'

                        const newTabProps = sub?.newTab
                          ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
                          : ({} as const)

                        return (
                          <TransitionLink
                            key={j}
                            href={href}
                            onMouseEnter={() => setPreview(sub?.media || activeItem?.defaultImage)}
                            onClick={() => setOpenIndex(null)} // close on click
                            className="flex items-center gap-5 px-2 py-2 hover:bg-gray-50 rounded-[16px] border border-white hover:border-lightGray"
                            {...newTabProps}
                          >
                            {/* icon */}
                            <div className="relative size-[55px] flex-shrink-0 flex items-center justify-center overflow-hidden bg-lightGray rounded-[12px]">
                              <div className="relative size-[24px]">
                                <Media
                                  resource={sub?.icon}
                                  alt={sub?.icon?.alt}
                                  fill
                                  imgClassName="object-contain"
                                  priority
                                />
                              </div>
                            </div>

                            {/* text + arrow */}
                            <div className="flex justify-between gap-20 w-full">
                              <div className="flex flex-col w-full">
                                <h6 className="text-sm leading-snug">{sub?.label}</h6>
                                {sub?.description && (
                                  <p className="text-xs text-gray-600">{sub.description}</p>
                                )}
                              </div>
                              <div className="flex items-center justify-end">
                                <div className="relative size-[14px]">
                                  <Media
                                    src="/icons/right-arrow-alt.svg"
                                    alt="arrow"
                                    fill
                                    priority
                                    imgClassName="object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          </TransitionLink>
                        )
                      })}
                    </div>

                    {/* divider */}
                    <div className="self-stretch w-px bg-lightGray flex-shrink-0 ml-2 my-2" />

                    {/* RIGHT: preview */}
                    <div className="relative w-96 aspect-[16/11] flex-shrink-0 overflow-hidden rounded-[16px] m-2">
                      <Media resource={preview} alt="" fill imgClassName="object-cover" priority />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="container bg-white border-2 border-lightGray rounded-full px-2 py-2  flex items-center justify-between">
          {/* Left: logo */}
          <TransitionLink
            href={data.logoUrl || '/'}
            className="block relative size-10 select-none cursor-pointer"
          >
            <Media fill imgClassName="object-contain rounded-[4px]" priority resource={data.logo} />
          </TransitionLink>

          {/* Right: Hamburger */}
          <MobileMenu navItems={data.navItems || []} links={data.links || []} />
        </div>
      </div>
    </header>
  )
}
