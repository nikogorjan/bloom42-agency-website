// /src/blocks/BrandExplainer/component.tsx
'use client'

import * as React from 'react'
import type { BrandExplainerBlock, Media as MediaDoc } from '@/payload-types'
import { Media } from '@/components/Media'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useMotionTemplate,
} from 'motion/react'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type Props = BrandExplainerBlock

const BrandExplainerBlockComponent: React.FC<Props> = ({
  content,
  image,
  tagline,
  heading,
  cta,
}) => {
  const img = image as MediaDoc | null
  const alt = (img as any)?.alt || 'Brand image'

  // --- Parallax: aspect wrapper fixed; inner layer taller & slides up (no scale transform) ---
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  // How much taller than the wrapper the inner layer should be
  const [overflowFactor, setOverflowFactor] = React.useState(1.2) // 120% on mobile
  React.useEffect(() => {
    const onResize = () => setOverflowFactor(window.innerWidth >= 768 ? 1.15 : 1.15) // 115% md+ / 120% mobile
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Drive translateY (pixels) manually
  const yRaw = useMotionValue(0)
  const y = useSpring(yRaw, { stiffness: 120, damping: 22, mass: 0.25 })
  const yTransform = useMotionTemplate`translate3d(0, ${y}px, 0)`

  React.useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    let raf = 0
    const update = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 0

      // progress 0..1 while the wrapper passes through the viewport
      const total = r.height + vh
      const seen = vh - r.top
      let progress = seen / total
      if (progress < 0) progress = 0
      if (progress > 1) progress = 1

      // Extra pixels available to reveal = (overflowFactor - 1) * wrapperHeight
      const extra = Math.max(0, (overflowFactor - 1) * r.height)
      const shift = prefersReduced ? 0 : -extra * progress // move UP, capped by the extra
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
  }, [overflowFactor, prefersReduced, yRaw])
  const ctaLink = cta?.[0]?.link

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-eggshell">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          {/* Left: rich text */}
          <div className="h-full flex flex-col justify-between md:py-12">
            <div>
              {tagline ? (
                <div className="flex items-center gap-3 text-sm leading-relaxed mb-6">
                  <BulletIcon className="md:h-6 md:w-6 2xl:h-8 2xl:w-8" />
                  <span className="text-2xl font-semibold text-darkGray">{tagline}</span>
                </div>
              ) : null}
              {heading ? (
                <h2 className="mb-5 text-6xl font-anton leading-tight text-darkGray md:mb-6 md:text-8xl lg:text-[72px]">
                  {heading}
                </h2>
              ) : null}
            </div>
            <div>
              {content ? (
                <RichTextCustom
                  text={content}
                  className="text-xl uppercase font-anton md:text-2xl text-darkSky"
                />
              ) : null}

              {ctaLink ? (
                <div className="mt-10 sm:mt-12 md:mt-20 flex justify-start">
                  <CMSLink {...ctaLink} appearance={ctaLink.appearance ?? 'outline'} />
                </div>
              ) : null}
            </div>
          </div>

          <div>
            {/* Right: portrait image with aspect + parallax */}
            <div className="relative">
              <div
                ref={wrapperRef}
                className="
      relative overflow-hidden rounded-2xl w-full
      aspect-[9/14]       /* ~0.643, good for 1080x1650 */
    "
              >
                {img ? (
                  <motion.div
                    aria-hidden
                    // Taller-than-wrapper layer → real overflow to reveal
                    style={{
                      transform: yTransform, // ✅ explicit transform string
                      height: `${overflowFactor * 100}%`,
                    }}
                    className="absolute inset-x-0 top-0 will-change-transform pointer-events-none"
                  >
                    {/* Make this the containing block for Media's fill */}
                    <div className="relative w-full h-full">
                      <Media
                        resource={img}
                        alt={alt}
                        className="absolute inset-0"
                        imgClassName="w-full h-full object-cover object-top"
                        fill
                      />
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type BulletIconProps = {
  className?: string
}

export function BulletIcon({ className }: BulletIconProps) {
  return (
    <span
      aria-hidden
      className={cn('relative inline-block h-12 w-12 shrink-0 mt-[2px]', className)}
    >
      <Media
        src="/images/bullets/bullet-orange.svg"
        alt=""
        fill
        imgClassName="object-contain"
        priority={false}
      />
    </span>
  )
}

export default BrandExplainerBlockComponent
