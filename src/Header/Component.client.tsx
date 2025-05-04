'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { RxChevronDown } from 'react-icons/rx'
import { NavDropdown } from './nav-dropdown'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
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
      {/* DESKTOP */}
      <div className="hidden lg:flex">
        <div className="container max-w-[892px] flex items-center justify-center bg-white px-3 py-2 md:top-6 min-h-14 border-2 border-lightGray rounded-full ">
          <div className="w-full flex items-center justify-between ">
            <div className="flex items-center justify-center">
              <div>
                <Link
                  href={data.logoUrl || '/'}
                  className="block relative size-8 select-none  cursor-pointer"
                >
                  <Media
                    fill
                    imgClassName="object-contain rounded-[4px] md:rounded-[6px]"
                    priority
                    resource={data.logo}
                  />
                </Link>
              </div>
              <div className="ml-8">
                <div className="relative flex items-center justify-center gap-2">
                  {data.navItems?.map((navItem, i) => {
                    if (navItem.type === 'dropdown') {
                      return <NavDropdown key={i} item={navItem} />
                    }
                    const href =
                      navItem.type === 'reference' && navItem.reference
                        ? `/${
                            navItem.reference.relationTo !== 'pages'
                              ? navItem.reference.relationTo
                              : ''
                          }/${(navItem.reference.value as any).slug}`
                        : navItem.url
                    return (
                      <Link
                        key={i}
                        href={href || '#'}
                        className="text-sm px-2 h-10 flex items-center justify-center"
                        {...(navItem.newTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {navItem.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
            <div>
              <div className="relative flex items-center justify-center gap-4">
                {data.links?.map(({ link }, i) => {
                  return <CMSLink key={i} {...link} className="text-sm px-4 h-10" />
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
