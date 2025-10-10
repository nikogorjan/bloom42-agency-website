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
import LanguageSwitcher from './language-switcher'

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

  // Close/open state + theme reset on route change
  useEffect(() => {
    setHeaderTheme(null)
    setOpenIndex(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Sync theme from provider
  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 lg:top-5 z-[1300] px-0 lg:px-[5%]" // was z-[1000]
      {...(theme ? { 'data-theme': theme } : {})}
    >
      {/* DESKTOP (floating pill, centered container) */}
      <div className="hidden lg:block">
        <div
          className={[
            'container max-w-[992px] bg-white overflow-hidden',
            isOpen ? 'rounded-[28px]' : 'rounded-full',
            // base separation
            'border border-gray-200',
            // idle elevation
            !isOpen && !scrolled
              ? 'shadow-[0_8px_24px_-10px_rgba(0,0,0,0.20)]'
              : // raised when open or scrolled
                'ring-black/10 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.35)]',
            // gentle hover lift when closed
            !isOpen ? 'hover:shadow-[0_20px_56px_-16px_rgba(0,0,0,0.40)]' : '',
            'transition-shadow duration-300',
          ].join(' ')}
          onMouseLeave={() => setOpenIndex(null)}
        >
          {/* Top bar */}
          <div className="px-3 py-2 min-h-14">
            <div className="w-full flex items-center justify-between">
              {/* Left: logo + nav */}
              <div className="flex items-center">
                <div>
                  <TransitionLink
                    href={data.logoUrl || '/'}
                    className="group block relative size-8 select-none cursor-pointer"
                    onMouseEnter={() => setOpenIndex(null)}
                    aria-label="Home"
                  >
                    <Media
                      fill
                      imgClassName="
                        object-contain rounded-[4px] md:rounded-[6px]
                        transition-transform duration-700 ease-out
                        will-change-transform transform-gpu
                        group-hover:rotate-[360deg]
                      "
                      priority
                      resource={data.logo}
                    />
                  </TransitionLink>
                </div>

                {/* Primary nav */}
                <nav className="ml-8" aria-label="Primary">
                  <div className="relative flex items-center gap-2">
                    {data.navItems?.map((navItem: any, i: number) => {
                      if (navItem.type === 'dropdown') {
                        return (
                          <NavDropdown
                            key={i}
                            item={navItem}
                            index={i}
                            isOpen={openIndex === i}
                            onOpen={(idx) => setOpenIndex(idx)}
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
                          className="text-base font-medium px-2 h-10 flex items-center"
                          {...newTabProps}
                          onMouseEnter={() => setOpenIndex(null)}
                        >
                          {navItem.label}
                        </TransitionLink>
                      )
                    })}
                  </div>
                </nav>
              </div>

              {/* Right actions */}
              <div
                className="relative flex items-center gap-4"
                onMouseEnter={() => setOpenIndex(null)}
              >
                <LanguageSwitcher languages={data.languages} className="-mr-1" />
                {data.links?.map(({ link }, i) => (
                  <CMSLink key={i} {...link} className="text-sm px-4 h-10" />
                ))}
              </div>
            </div>
          </div>

          {/* Dropdown panel (height/opacity only) */}
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
              isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
            aria-hidden={!isOpen}
          >
            <div className="overflow-hidden">
              {activeItem && (
                <div
                  className="p-3 border-t-2 border-lightGray"
                  onMouseLeave={() => setPreview(activeItem?.defaultImage)}
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
                            onClick={() => setOpenIndex(null)}
                            className="flex items-center gap-5 px-2 py-2 hover:bg-gray-50 rounded-[16px] border border-white hover:border-gray-100"
                            {...newTabProps}
                          >
                            {/* icon */}
                            <div className="relative size-[64px] flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-200 rounded-[12px]">
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
                                <h6 className="text-base font-semibold leading-snug">
                                  {sub?.label}
                                </h6>
                                {sub?.description && (
                                  <p className="text-sm text-gray-600">{sub.description}</p>
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

      {/* MOBILE (full-width top bar) */}
      <div className="lg:hidden">
        <div
          className="
      w-full bg-white border-b border-gray-200
      shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]
      px-[5%] py-4 min-h-14
      flex items-center justify-between
      relative z-[1300]                /* keep the whole bar above overlay */
    "
        >
          {/* Left: logo */}
          <TransitionLink
            href={data.logoUrl || '/'}
            className="block relative size-9 select-none cursor-pointer z-[1300]" // add z
            aria-label="Home"
            onMouseEnter={() => setOpenIndex(null)}
          >
            <Media fill imgClassName="object-contain rounded-[4px]" priority resource={data.logo} />
          </TransitionLink>

          {/* Right: language + menu */}
          <div className="flex flex-row items-center justify-center">
            <LanguageSwitcher languages={data.languages} className="mr-3 relative z-[1300]" />{' '}
            {/* add z */}
            <MobileMenu navItems={data.navItems || []} links={data.links || []} />
          </div>
        </div>
      </div>
    </header>
  )
}
