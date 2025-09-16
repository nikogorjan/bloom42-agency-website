// src/Header/MobileMenu.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import MobileMenuOverlay, { MobileMenuOverlayRef } from './mobile-menu-overlay'

export default function MobileMenu({
  navItems,
  links,
}: {
  navItems: any[]
  links?: { link: any }[]
}) {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<MobileMenuOverlayRef>(null)

  const toggle = async () => {
    if (open) {
      // 1) slide subpanel away if open, then 2) close curve/menu
      await overlayRef.current?.prepareClose()
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  const close = async () => {
    if (!open) return
    await overlayRef.current?.prepareClose()
    setOpen(false)
  }

  // prevent background scroll
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
      {/* Button (hamburger ↔ X). This sits in your header, above overlay. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={toggle}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-eggshell z-[1001]"
      >
        <span className="sr-only">Toggle menu</span>
        {/* bars */}
        <span
          className={[
            'block absolute h-[3px] w-5 bg-darkGray rounded-full transition-transform duration-200',
            open ? 'rotate-45' : '-translate-y-1.5',
          ].join(' ')}
        />
        <span
          className={[
            'block absolute h-[3px] w-5 bg-darkGray rounded-full transition-opacity duration-200',
            open ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        />
        <span
          className={[
            'block absolute h-[3px] w-5 bg-darkGray rounded-full transition-transform duration-200',
            open ? '-rotate-45' : 'translate-y-1.5',
          ].join(' ')}
        />
      </button>

      {/* Overlay (the curve + content). We pass a ref so we can run the close sequence. */}
      <MobileMenuOverlay
        ref={overlayRef}
        open={open}
        navItems={navItems}
        links={links}
        onRequestClose={close} // called when a link is clicked
      />
    </>
  )
}
