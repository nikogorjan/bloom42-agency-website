'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { FeaturedServicesBlock, Media as MediaDoc } from '@/payload-types'
import { TransitionLink } from '@/page-transition/transition-link'

// 👇 make the Link motion-capable so variants work on hover
const MotionTransitionLink = motion(TransitionLink as any)

type Props = FeaturedServicesBlock

function getHrefFromLink(link: any): {
  href: string
  newTab?: boolean | null
  isExternal?: boolean
} {
  if (!link) return { href: '#', newTab: false, isExternal: false }

  const { type, url, newTab, reference } = link || {}

  // external / absolute
  if (type === 'custom' && typeof url === 'string' && url.trim()) {
    const isExternal = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)
    return { href: url, newTab: !!newTab, isExternal }
  }

  // internal reference (include collection segment unless 'pages')
  if (type === 'reference' && reference?.value) {
    const rel = String(reference.relationTo || '')
    const value = reference.value as any
    const slug = value?.slug ?? value?.doc?.slug
    const id = value?.id ?? value?._id
    const seg = rel && rel !== 'pages' ? `/${rel}` : ''
    const leaf = slug || id || ''
    const path = `${seg}/${leaf}`.replace(/\/+$/, '') || '/'
    return { href: path, newTab: !!newTab, isExternal: false }
  }

  return { href: '#', newTab: !!newTab, isExternal: false }
}

/** Try to get a usable URL from a Payload media field. */
function getMediaURL(img: MediaDoc | string | number | null | undefined): string | undefined {
  if (!img) return undefined
  if (typeof img === 'string') return img
  if (typeof img === 'number') return undefined
  if ('url' in img && typeof (img as any).url === 'string') return (img as any).url
  const sizes = (img as any).sizes
  if (sizes?.card?.url) return sizes.card.url
  if (sizes?.thumbnail?.url) return sizes.thumbnail.url
  return undefined
}

export default function FeaturedServicesBlockComponent(props: Props) {
  const { title, items } = props
  const safeItems = Array.isArray(items) ? items : []

  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 bg-darkSky">
      <div className="container">
        <div className="mx-auto w-full max-w-5xl">
          {title ? (
            <h2 className="mb-4 text-xl font-semibold text-neutral-200 md:mb-8 md:text-2xl">
              {title}
            </h2>
          ) : null}

          <div className="divide-y-2 divide-neutral-800">
            {safeItems.map((item, idx) => (
              <HoverRow
                key={idx}
                heading={item?.heading || ''}
                subheading={item?.subheading || ''}
                hrefData={getHrefFromLink(item?.link)}
                imgSrc={getMediaURL(item?.image)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function HoverRow({
  heading,
  subheading,
  hrefData,
  imgSrc,
}: {
  heading: string
  subheading?: string | null
  hrefData: { href: string; newTab?: boolean | null; isExternal?: boolean }
  imgSrc?: string
}) {
  const ref = useRef<HTMLAnchorElement | null>(null)

  // cursor-follow preview
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20, mass: 0.2 })
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20, mass: 0.2 })
  const top = useTransform(mouseYSpring, [0.5, -0.5], ['40%', '60%'])
  const left = useTransform(mouseXSpring, [0.5, -0.5], ['60%', '70%'])

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  // Use your TransitionLink directly so exit/enter animations run
  return (
    <MotionTransitionLink
      ref={ref}
      href={hrefData.href}
      target={hrefData.newTab ? '_blank' : undefined}
      rel={hrefData.newTab ? 'noopener noreferrer' : undefined}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="whileHover"
      className="
    group relative z-0 hover:z-50
    flex items-center justify-between
    py-4 transition-colors duration-500 md:py-6
  "
      aria-label={heading}
    >
      <div className="min-w-0">
        <h3 className="relative z-10 block truncate text-3xl font-bold tracking-tight text-neutral-400 transition-colors duration-500 group-hover:text-neutral-50 md:text-5xl">
          {heading}
        </h3>

        {subheading ? (
          <span className="relative z-10 mt-2 block truncate text-sm text-neutral-500 transition-colors duration-500 group-hover:text-neutral-200 md:text-base">
            {subheading}
          </span>
        ) : null}
      </div>

      {imgSrc ? (
        <motion.img
          style={{ top, left, transform: 'translate(-50%, -50%)' }}
          variants={{
            initial: { scale: 0, rotate: '-12.5deg' },
            whileHover: { scale: 1, rotate: '12.5deg' },
          }}
          transition={{ type: 'spring' }}
          src={imgSrc}
          // 2) Ensure the image is above the row’s content & borders
          className="pointer-events-none absolute z-40 h-24 w-32 rounded-xl object-cover shadow-2xl md:h-48 md:w-64 will-change-transform"
          alt={heading ? `Image for ${heading}` : 'Preview image'}
        />
      ) : null}

      <motion.div
        variants={{ initial: { x: '25%', opacity: 0 }, whileHover: { x: '0%', opacity: 1 } }}
        transition={{ type: 'spring' }}
        className="relative z-10 p-3 md:p-4"
      >
        <ArrowRight className="h-8 w-8 text-neutral-50 md:h-10 md:w-10" />
      </motion.div>
    </MotionTransitionLink>
  )
}
