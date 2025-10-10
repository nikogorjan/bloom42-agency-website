// src/blocks/AboutUsParalax/component.tsx
'use client'

import * as React from 'react'
import clsx from 'clsx'
import { motion, useScroll, useTransform, useSpring, type MotionValue } from 'motion/react'
import type { AboutUsParalaxBlock, Media as MediaDoc } from '@/payload-types'
import { Media } from '@/components/Media'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'
import Link from 'next/link'

type Props = AboutUsParalaxBlock

type Product = {
  link?: string | null
  thumbnail?: MediaDoc | string | null
}

/* ---------------- helpers ---------------- */

function chunk<T>(arr: T[], size: number) {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
  return res
}

function hasMediaDoc(x: Product['thumbnail']): x is MediaDoc {
  return !!x && typeof x === 'object' && 'id' in x
}

/* ---------------- component ---------------- */

export default function AboutUsParalaxComponent(props: Props) {
  // 🧱 Hooks FIRST (no early returns before these)
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig)
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig,
  )
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig)
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig)

  // Header anims — now actually used below
  const headerOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.65], [1, 1, 0]),
    springConfig,
  )
  const headerY = useSpring(useTransform(scrollYProgress, [0.35, 0.65], [0, -24]), springConfig)

  // Then compute data and *optionally* return null
  const products: Product[] = Array.isArray(props.products) ? props.products : []
  const cleaned = products.filter((p) => hasMediaDoc(p.thumbnail))
  const rows = chunk(cleaned, 5)
  const hasHeader = !!props.header?.intro
  const hasSlides = rows.flat().length > 0
  if (!hasSlides && !hasHeader) return null

  const productKey = (p: any, rowIdx: number, i: number) =>
    (p?.id ??
      (p?.thumbnail && typeof p.thumbnail === 'object' && 'id' in p.thumbnail
        ? (p.thumbnail as any).id
        : `thumb`)) + `-${rowIdx}-${i}`

  return (
    <section
      ref={ref}
      className={clsx(
        'relative flex flex-col overflow-hidden py-40 antialiased',
        'h-[250vh] self-auto',
        '[perspective:1000px] [transform-style:preserve-3d] bg-darkSky md:h-[240vh]',
      )}
    >
      <div className="container">
        {/* motion wrapper so headerOpacity/headerY are used */}
        {hasHeader ? (
          <motion.div style={{ opacity: headerOpacity, y: headerY }}>
            <Header intro={props.header?.intro as any} />
          </motion.div>
        ) : null}
      </div>

      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="relative"
        aria-hidden
      >
        {/* Row 1 */}
        {rows[0]?.length ? (
          <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
            {rows[0].map((p, i) => (
              <ProductCard key={productKey(p, 0, i)} product={p} translate={translateX} />
            ))}
          </motion.div>
        ) : null}

        {/* Row 2 */}
        {rows[1]?.length ? (
          <motion.div className="mb-20 flex flex-row space-x-20">
            {rows[1].map((p, i) => (
              <ProductCard key={productKey(p, 1, i)} product={p} translate={translateXReverse} />
            ))}
          </motion.div>
        ) : null}

        {/* Row 3 */}
        {rows[2]?.length ? (
          <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
            {rows[2].map((p, i) => (
              <ProductCard key={productKey(p, 2, i)} product={p} translate={translateX} />
            ))}
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  )
}

/* ---------------- header ---------------- */

function Header({ intro }: { intro?: any }) {
  if (!intro) return null
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-4 py-20 md:py-40">
      <div className="mt-8 max-w-lg text-base md:text-xl dark:text-neutral-200">
        <RichTextCustom
          text={intro}
          className="font-anton text-2xl uppercase text-eggshell md:text-6xl"
        />
      </div>
    </div>
  )
}

/* ---------------- card ---------------- */

function ProductCard({ product, translate }: { product: Product; translate: MotionValue<number> }) {
  const thumb = hasMediaDoc(product.thumbnail) ? product.thumbnail : null
  if (!thumb) return null

  const href = (product.link ?? '').trim()
  const isInternal = href.startsWith('/')
  const isExternalHttp = /^https?:\/\//i.test(href)

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!href) return <div className="block">{children}</div>
    if (isInternal) {
      return (
        <Link href={href} className="block">
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        className="block"
        {...(isExternalHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className={clsx(
        'relative shrink-0 overflow-hidden rounded-2xl',
        // <= 1920px: EXACT original
        'h-96 w-[30rem]',
        // > 1920px: smooth scale
        'min-[1921px]:h-[clamp(24rem,20vw,48rem)]',
        'min-[1921px]:w-[clamp(30rem,25vw,60rem)]',
        // >= 2560px: bit larger
        'min-[2560px]:h-[clamp(32rem,21.6vw,56rem)]',
        'min-[2560px]:w-[clamp(40rem,27vw,70rem)]',
      )}
    >
      <Wrapper>
        <Media
          resource={thumb}
          alt="Parallax image"
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full rounded-2xl object-cover object-left-top"
          priority={false}
        />
      </Wrapper>
    </motion.div>
  )
}
