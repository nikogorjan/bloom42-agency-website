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
import Squares from '@/components/ui/squares-background-animation' // ⬅️ add this

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

  // --- Squares BG (same behavior as FormBlock) ---
  const [squareSize, setSquareSize] = React.useState(80)
  React.useEffect(() => {
    const updateSize = () => setSquareSize(window.innerWidth < 768 ? 64 : 80)
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // --- Parallax for the image ---
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()
  const [overflowFactor, setOverflowFactor] = React.useState(1.15)
  React.useEffect(() => {
    const onResize = () => setOverflowFactor(window.innerWidth >= 768 ? 1.15 : 1.15)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
      const total = r.height + vh
      const seen = vh - r.top
      let progress = seen / total
      if (progress < 0) progress = 0
      if (progress > 1) progress = 1

      const extra = Math.max(0, (overflowFactor - 1) * r.height)
      const shift = prefersReduced ? 0 : -extra * progress
      yRaw.set(shift)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), update()))
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
    <section className="relative bg-eggshell px-[5%] py-16 md:py-24 lg:py-28">
      {/* Squares background layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Squares
          speed={0.1}
          squareSize={squareSize}
          direction="up"
          borderColor="#EBE9E4"
          hoverFillColor="#EBE9E4"
        />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:items-center md:gap-x-12 lg:gap-x-20">
          {/* Left: copy */}
          <div className="flex h-full flex-col justify-between md:py-12">
            <div>
              {tagline ? (
                <div className="mb-6 flex items-center gap-3 text-sm leading-relaxed">
                  <BulletIcon className="h-5 w-5 md:h-6 md:w-6 2xl:h-8 2xl:w-8" />
                  <span className="text-xl font-semibold text-darkGray md:text-2xl">{tagline}</span>
                </div>
              ) : null}
              {heading ? (
                <h2 className="mb-5 font-anton text-6xl leading-tight text-darkGray md:mb-6 md:text-8xl lg:text-[72px]">
                  {heading}
                </h2>
              ) : null}
            </div>

            <div>
              {content ? (
                <RichTextCustom
                  text={content}
                  className="font-anton text-xl uppercase text-darkSky md:text-2xl"
                />
              ) : null}

              {ctaLink ? (
                <div className="mt-10 flex justify-start sm:mt-12 md:mt-20">
                  <CMSLink {...ctaLink} appearance={ctaLink.appearance ?? 'outline'} />
                </div>
              ) : null}
            </div>
          </div>

          {/* Right: portrait image with aspect + parallax */}
          <div>
            <div className="relative">
              <div
                ref={wrapperRef}
                className="
                  relative w-full overflow-hidden rounded-2xl
                  aspect-[9/14]
                "
              >
                {img ? (
                  <motion.div
                    aria-hidden
                    style={{ transform: yTransform, height: `${overflowFactor * 100}%` }}
                    className="pointer-events-none absolute inset-x-0 top-0 will-change-transform"
                  >
                    <div className="relative h-full w-full">
                      <Media
                        resource={img}
                        alt={alt}
                        className="absolute inset-0"
                        imgClassName="h-full w-full object-cover object-top"
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

type BulletIconProps = { className?: string }

export function BulletIcon({ className }: BulletIconProps) {
  return (
    <span
      aria-hidden
      className={cn('relative mt-[2px] inline-block h-12 w-12 shrink-0', className)}
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
