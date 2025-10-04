// src/heros/AboutHeader.tsx
'use client'

import * as React from 'react'
import type { Page, Media as MediaDoc } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

export const AboutHeader: React.FC<Page['hero']> = (props) => {
  // Determine variant first (no early return yet)
  const isAboutHeader = props?.type === 'aboutHeader'
  const aboutHeader = isAboutHeader ? props.aboutHeader : undefined

  const image = aboutHeader?.image as MediaDoc | null
  const heading = aboutHeader?.heading
  const description = aboutHeader?.description
  const links = aboutHeader?.links

  // --- Parallax: wrapper fixed, image layer taller & slides up ---
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  // How much taller than the wrapper the image layer should be
  const [layerScale, setLayerScale] = React.useState(1.2) // 120% on mobile
  React.useEffect(() => {
    const setScale = () => setLayerScale(window.innerWidth >= 768 ? 1.15 : 1.65)
    setScale()
    window.addEventListener('resize', setScale)
    return () => window.removeEventListener('resize', setScale)
  }, [])

  // Motion value we drive manually
  const yRaw = useMotionValue(0)
  const y = useSpring(yRaw, { stiffness: 120, damping: 22, mass: 0.25 })

  React.useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    let raf = 0
    const update = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 0

      // progress: 0 when top hits viewport bottom, 1 when bottom hits viewport top
      const total = r.height + vh
      const seen = vh - r.top
      let progress = seen / total
      if (progress < 0) progress = 0
      if (progress > 1) progress = 1

      // Extra pixels available to reveal = (layerScale - 1) * wrapperHeight
      const extra = Math.max(0, (layerScale - 1) * r.height)
      const shift = prefersReduced ? 0 : -extra * progress // move UP within available extra
      yRaw.set(shift)
    }

    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          update()
        })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [layerScale, prefersReduced, yRaw])

  // Safe to return after hooks are declared
  if (!isAboutHeader) return null

  return (
    <section id="about-header" className="relative flex flex-col bg-eggshell pt-[69px] md:pt-0">
      {/* Fixed-height wrapper (stays still) */}
      <div
        ref={wrapperRef}
        className="relative w-full shrink-0 grow-0 basis-[35svh] md:basis-[80svh] overflow-hidden"
      >
        {/* Moving layer is TALLER than the wrapper → creates overflow to reveal */}
        {image ? (
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 will-change-transform pointer-events-none pt-[100px] md:pt-0"
            style={{
              y, // slide the taller layer UP
              height: `${layerScale * 100}%`, // e.g. 120% or 165% of wrapper height
            }}
          >
            {/* Make this layer a positioning context for fill */}
            <div className="relative w-full h-full">
              <Media
                resource={image}
                priority
                className="absolute inset-0"
                imgClassName="size-full object-cover object-top"
                fill
              />
            </div>
          </motion.div>
        ) : null}
      </div>

      {/* Foreground content */}
      <div className="px-[5%]">
        <div className="container relative z-10">
          <div className="grid grid-rows-1 items-start gap-y-5 py-12 md:grid-cols-2 md:gap-x-12 md:gap-y-8 md:py-18 lg:gap-x-20 lg:gap-y-16 lg:py-20">
            {heading ? (
              <h1 className="text-6xl font-anton text-darkGray md:text-9xl lg:text-10xl">
                {heading}
              </h1>
            ) : (
              <div />
            )}
            <div>
              {description ? (
                <RichTextCustom text={description} className="text-base md:text-md text-darkGray" />
              ) : null}

              <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
                {links?.map(({ link }, i) => (
                  <CMSLink key={i} {...link} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
