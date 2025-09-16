// src/Header/MobileMenu.tsx
'use client'

import React, { useEffect, useState } from 'react'
import MobileMenuOverlay from './mobile-menu-overlay'

export default function MobileMenu({
  navItems,
  links,
}: {
  navItems: any[]
  links?: { link: any }[]
}) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((v) => !v)
  const close = () => setOpen(false)

  useEffect(() => {
    const cls = 'mobile-menu-open'
    document.documentElement.classList.toggle(cls, open)
    document.body.classList.toggle(cls, open)
    return () => {
      document.documentElement.classList.remove(cls)
      document.body.classList.remove(cls)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={toggle}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-lightGray bg-white z-[1001]"
      >
        <span className="sr-only">Toggle menu</span>
        <span
          className={[
            'block absolute h-0.5 w-5 bg-black transition-transform duration-200',
            open ? 'rotate-45' : '-translate-y-1.5',
          ].join(' ')}
        />
        <span
          className={[
            'block absolute h-0.5 w-5 bg-black transition-opacity duration-200',
            open ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        />
        <span
          className={[
            'block absolute h-0.5 w-5 bg-black transition-transform duration-200',
            open ? '-rotate-45' : 'translate-y-1.5',
          ].join(' ')}
        />
      </button>

      <MobileMenuOverlay open={open} navItems={navItems} links={links} onClose={close} />
    </>
  )
}
