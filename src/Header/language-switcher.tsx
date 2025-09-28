'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Header } from '@/payload-types'
import { Media } from '@/components/Media'
import { useAnimatedNavigation } from '@/page-transition/transition-provider'

type Lang = NonNullable<Header['languages']>[number]

function replaceLocaleInPath(pathname: string, newCode: string) {
  const parts = pathname.split('/')
  if (parts.length >= 2) {
    parts[1] = newCode
    return parts.join('/') || '/'
  }
  return `/${newCode}`
}

export default function LanguageSwitcher({
  languages,
  light = true,
  className,
}: {
  languages?: Lang[] | null
  light?: boolean
  className?: string
}) {
  // Hooks: always call first
  const pathname = usePathname()
  const search = useSearchParams()
  const router = useRouter()
  const nav = useAnimatedNavigation()

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  // Derive data (do NOT early return yet)
  const langs = Array.isArray(languages) ? languages : []
  const currentLocale = (pathname.split('/')[1] || '').toLowerCase()
  const selected = langs.find((l) => (l?.code || '').toLowerCase() === currentLocale) ?? langs[0]

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateCoords = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setCoords({
      top: Math.round(r.bottom + 2), // 2px below the button
      left: Math.round(r.left + r.width / 2), // centered
    })
  }

  // Recompute coords on open; close on scroll; keep centered on resize
  useEffect(() => {
    if (!open) return
    updateCoords()
    const onScroll = () => setOpen(false)
    const onResize = () => updateCoords()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current && triggerRef.current.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [open])

  const onPick = (lang: Lang) => {
    setOpen(false)
    const newCode = (lang?.code || '').toLowerCase()
    const q = search?.toString()
    const path = replaceLocaleInPath(pathname, newCode)
    const href = q ? `${path}?${q}` : path
    // Keep your transition animation for language changes
    if (nav?.onNavigate) nav.onNavigate(href)
    else router.push(href)
  }

  const pillClasses = [
    'inline-flex items-center justify-center font-bold text-[14px]',
    'py-[3px] pl-[6px] pr-[8px] h-9 w-16 rounded-[50px] cursor-pointer',
    light ? 'bg-white border border-lightGray text-darkGray' : 'bg-[#1A1A1A] border border-glass',
  ].join(' ')

  const toggleOpen: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setOpen((v) => !v)
  }

  // Now it's safe to early return
  if (langs.length === 0) return null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggleOpen}
        className={[pillClasses, className].filter(Boolean).join(' ')}
      >
        {selected?.languageIcon ? (
          <span className="relative w-[24px] h-[24px] overflow-hidden rounded-full">
            <Media resource={selected.languageIcon} fill imgClassName="object-cover rounded-full" />
          </span>
        ) : null}
        <span className="ml-1 uppercase">{selected?.shortTitle}</span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && coords ? (
              <div
                style={{
                  position: 'fixed',
                  top: coords.top,
                  left: coords.left,
                  transform: 'translateX(-50%)',
                  zIndex: 1100,
                }}
              >
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-[10px] border border-lightGray bg-white shadow-[0_15px_35px_rgba(0,0,0,0.08)] p-1 w-48"
                >
                  {langs.map((lang, i) => (
                    <button
                      key={`${lang?.code}-${i}`}
                      type="button"
                      className="w-full flex items-center gap-3 rounded-md px-2 py-2 text-sm text-darkGray hover:bg-eggshell transition-colors"
                      onClick={() => onPick(lang)}
                    >
                      {lang?.languageIcon ? (
                        <span className="relative w-6 h-6 overflow-hidden rounded-full">
                          <Media
                            resource={lang.languageIcon}
                            fill
                            imgClassName="object-cover rounded-full"
                          />
                        </span>
                      ) : null}
                      <span className="font-semibold uppercase">{lang?.shortTitle}</span>
                    </button>
                  ))}
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
