// src/blocks/CreativeGrowthScroller/component.tsx
'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useMediaQuery } from '@relume_io/relume-ui'
import type { CreativeGrowthScrollerBlock, Media as MediaDoc } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type Props = CreativeGrowthScrollerBlock

export default function CreativeGrowthScrollerComponent(props: Props) {
  const items = Array.isArray(props.items) ? props.items : []
  const isMobile = useMediaQuery('(max-width: 992px)')

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  if (isMobile) {
    // Simple stacked layout on mobile (no sticky/opacity)
    return (
      <section ref={containerRef} className="px-[5%] py-16 bg-eggshell">
        <div className="grid grid-cols-1 gap-y-12">
          {items.map((item, index) => (
            <div key={index}>
              <div className="max-w-md">
                {item.heading ? (
                  <h2 className="mb-3 text-4xl font-anton text-darkGray">{item.heading}</h2>
                ) : null}

                {item.description ? (
                  <p className="mb-3 text-xl text-neutral-700">{item.description}</p>
                ) : null}

                {item.richText && (
                  <RichText
                    className="prose prose-neutral mb-3"
                    data={item.richText}
                    enableGutter={false}
                  />
                )}

                {Array.isArray(item.bullets) &&
                  item.bullets.map((group, gi) => (
                    <div key={gi} className="mb-4">
                      {group?.header ? (
                        <p className="mb-3 text-md font-semibold">{group.header}</p>
                      ) : null}
                      <ul className="space-y-3">
                        {group?.items?.map((b, bi) => (
                          <li key={bi} className="flex items-center gap-3 leading-relaxed">
                            <BulletIcon className="h-6 w-6" />
                            <span className="text-md">{b?.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>

              <div className="mt-8">
                <BlockMedia
                  media={item.image}
                  className="relative block w-full overflow-hidden rounded-xl"
                  imgClassName="size-full object-cover"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Desktop/tablet: sticky left, full-screen slides right
  return (
    <section ref={containerRef} className="px-[5%] lg:px-0 bg-eggshell">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT: sticky viewport with absolute slides */}
        <div className="relative">
          <div className="lg:sticky lg:top-0 h-screen flex items-center justify-end">
            <div className="relative w-full max-w-md lg:ml-[5vw] lg:mr-20">
              {/* absolute stack of fading slides */}
              <div className="relative h-auto lg:h-[70vh]">
                {items.map((item, index) => (
                  <LeftSlide
                    key={index}
                    item={item}
                    index={index}
                    total={items.length}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: one full-viewport image per item (drives the scroll) */}
        <div className="hidden lg:block">
          {items.map((item, index) => (
            <div key={index} className="relative h-screen">
              <BlockMedia
                media={item.image}
                fill
                className="absolute inset-0"
                imgClassName="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- helpers ---------------- */

function BlockMedia({
  media,
  className,
  imgClassName,
  fill,
  priority,
}: {
  media?: MediaDoc | string | null
  className?: string
  imgClassName?: string
  fill?: boolean
  priority?: boolean
}) {
  if (!media) return null

  if (fill) {
    return (
      <div className={className || 'absolute inset-0'}>
        <Media resource={media} fill priority={priority} imgClassName={imgClassName} />
      </div>
    )
  }

  return (
    <div className={className}>
      <Media resource={media} priority={priority} imgClassName={imgClassName} />
    </div>
  )
}

type BulletIconProps = {
  className?: string
}

export function BulletIcon({ className }: BulletIconProps) {
  return (
    <span aria-hidden className={cn('relative inline-block h-8 w-8 shrink-0 mt-[2px]', className)}>
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

/* ---------------- slides ---------------- */

function LeftSlide({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: Props['items'][number]
  index: number
  total: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  // define a cross-fade band per slide
  const start = index / total
  const end = (index + 1) / total

  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.07), start, end - 0.07, Math.min(1, end)],
    [0, 1, 1, 0],
  )

  // each slide is absolutely positioned; the stack lives in the sticky viewport
  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex flex-col justify-center">
      {item.heading ? (
        <h2 className="font-anton md:mb-3 2xl:mb-4 md:text-6xl 2xl:text-10xl text-darkGray">
          {item.heading}
        </h2>
      ) : null}

      {item.description ? (
        <p className="md:mb-3 2xl:mb-4 text-neutral-700 md:text-xl 2xl:text-2xl">
          {item.description}
        </p>
      ) : null}

      {item.richText && (
        <RichText
          className="prose prose-neutral md:mb-3 2xl:mb-4 text-base 2xl:text-md"
          data={item.richText}
          enableGutter={false}
        />
      )}

      {Array.isArray(item.bullets) &&
        item.bullets.map((group, gi) => (
          <div key={gi} className="lg:mb-4">
            {group?.header ? (
              <p className="md:mb-3 2xl:mb-4 md:text-md 2xl:text-xl font-semibold">
                {group.header}
              </p>
            ) : null}
            <ul className="md:space-y-3 2xl:space-y-4">
              {group?.items?.map((b, bi) => (
                <li key={bi} className="flex items-center gap-3 text-sm leading-relaxed">
                  <BulletIcon className="md:h-6 md:w-6 2xl:h-8 2xl:w-8" />
                  <span className="md:text-md 2xl:text-xl">{b?.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </motion.div>
  )
}
