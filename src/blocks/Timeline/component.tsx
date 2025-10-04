'use client'

import * as React from 'react'
import type { TimelineBlock, Media as MediaDoc } from '@/payload-types'
import { Media } from '@/components/Media'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'
import type { CarouselApi } from '@relume_io/relume-ui'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@relume_io/relume-ui'
import { cn } from '@/utilities/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { RippleButton } from '@/components/ui/ripple-button'

type Props = TimelineBlock

export default function TimelineCarouselBlockComponent({ items, heading }: Props) {
  const list = Array.isArray(items) ? items : []

  // ✅ Always call hooks
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(1)

  React.useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  // ✅ Early return AFTER hooks
  if (list.length === 0) return null

  return (
    <section className="overflow-x-hidden bg-eggshell py-16 md:py-24 lg:py-28">
      <div
        className="
    relative isolate grid grid-cols-1 items-start
    pl-[max(5%,calc((100vw-1280px)/2))] pr-0
    md:grid-cols-[240px_1fr]
    lg:gap-x-20 md:gap-x-12 gap-y-5
  "
      >
        {/* LEFT — fixed 240px column that masks underneath */}
        <div className="relative z-20 bg-eggshell">
          <div className="w-full max-w-md lg:mb-24 lg:mr-20 ">
            <div className="w-full md:w-[240px]">
              <div className="mb-6 flex items-center gap-3 text-sm leading-relaxed">
                <BulletIcon className="h-5 w-5 md:h-6 md:w-6 2xl:h-8 2xl:w-8" />
                <h2 className="text-xl font-semibold text-darkGray md:text-2xl">{heading}</h2>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-eggshell bg-white px-4 py-2 text-sm text-darkSky/70 shadow-sm">
                <span className="font-semibold text-darkSky">{current}</span>
                <span>/</span>
                <span>{list.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — carousel (can bleed to right) */}
        <div className="relative z-10 min-w-0 px-0">
          <div className="overflow-hidden">
            <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }} className="min-w-0">
              <CarouselContent className="ml-0">
                {list.map((it, idx) => (
                  <CarouselItem
                    key={idx}
                    className="
                      pl-0 pr-4 md:pr-12
                      basis-[88%]
                      sm:basis-[72%]
                      md:basis-[60%]
                      lg:basis-[48%]
                      xl:basis-[42%]
                      2xl:basis-[38%]
                    "
                  >
                    <Slide
                      image={it?.image ?? null}
                      header={it?.header ?? ''}
                      description={it?.description}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-2 md:gap-3">
                  {/* hide built-ins */}
                  <CarouselPrevious className="hidden" />
                  <CarouselNext className="hidden" />

                  {/* custom controls */}
                  <RippleButton
                    aria-label="Previous slide"
                    variant="inverted"
                    className="h-12 w-12 p-0 rounded-full flex items-center justify-center"
                    onClick={() => api?.scrollPrev()}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </RippleButton>

                  <RippleButton
                    aria-label="Next slide"
                    variant="inverted"
                    className="h-12 w-12 p-0 rounded-full flex items-center justify-center"
                    onClick={() => api?.scrollNext()}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </RippleButton>
                </div>
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Slide ---------------- */

function Slide({
  image,
  header,
  description,
}: {
  image: MediaDoc | string | null | undefined
  header: string
  description: any
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-eggshell bg-white shadow-sm p-3">
      <div className="relative aspect-[16/12] w-full overflow-hidden rounded-[14px]">
        {image ? (
          <Media resource={image} fill imgClassName="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-500">
            No image
          </div>
        )}

        {/* gradient now inside the same rounded/overflow-hidden container */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-5 md:p-6">
        <h3 className="mb-2 text-xl font-anton text-darkSky md:text-2xl">{header}</h3>
        {description ? (
          <RichTextCustom text={description} className="text-base text-darkSky/90 md:text-md" />
        ) : null}
      </div>
    </article>
  )
}

/* ---------------- Bullet ---------------- */

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
