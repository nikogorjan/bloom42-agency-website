'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { VideoTestimonialBlock, Media as MediaDoc } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'

type Props = VideoTestimonialBlock

export default function VideoTestimonialComponent(props: Props) {
  const {
    richText,
    video,
    cta,
    autoplay = true,
    loop = true,
    mutedByDefault = true,
    testimonials = [],
  } = props

  // Normalize CTA as before
  let ctaLink: any | undefined
  const rawCTA = cta as any
  if (rawCTA) {
    if (Array.isArray(rawCTA) && rawCTA.length > 0 && rawCTA[0]?.link) {
      ctaLink = rawCTA[0].link
    } else if (!Array.isArray(rawCTA) && rawCTA.link) {
      ctaLink = rawCTA.link
    }
  }

  return (
    <section
      id="video-testimonial"
      className="relative overflow-hidden bg-darkSky px-[5%] py-12 md:py-20"
    >
      <div className="container">
        {/* TOP ROW: text + video */}
        <div className="max-w-[992px] mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              {richText ? (
                <RichTextCustom
                  text={richText}
                  className="text-6xl font-anton text-eggshell uppercase"
                />
              ) : null}

              {ctaLink ? (
                <div className="mt-8 flex flex-col items-start justify-center sm:flex-row md:items-start md:justify-start md:mt-10">
                  <CMSLink {...ctaLink} />
                </div>
              ) : null}
            </div>

            <div className="relative w-full md:w-[366px]">
              <VideoWithMuteToggle
                media={video}
                autoplay={autoplay ?? true}
                loop={loop ?? true}
                mutedByDefault={mutedByDefault ?? true}
              />
            </div>
          </div>
        </div>
        {/* TESTIMONIALS GRID */}
        {Array.isArray(testimonials) && testimonials.length > 0 ? (
          <div className="mt-12 md:mt-16">
            {/* Masonry-like columns (simple) */}
            <div className="columns-1 gap-x-6 md:columns-2 lg:columns-3">
              {testimonials.map((t, idx) => (
                <article
                  key={idx}
                  className="mb-6 inline-block w-full break-inside-avoid rounded-2xl border border-eggshell/15 bg-white/5 p-6 md:p-7"
                >
                  {/* Stars */}
                  <div className="mb-4 flex">
                    {Array.from({ length: clampStars(t?.numberOfStars) }).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  {/* Quote */}
                  {t?.quote ? (
                    <blockquote className="text-eggshell/90">{smartQuotes(t.quote)}</blockquote>
                  ) : null}

                  {/* Person */}
                  <div className="mt-5 flex w-full flex-col items-start gap-4 md:mt-6 md:w-fit md:flex-row md:items-center">
                    {t?.avatar ? (
                      <div className="size-12 min-h-12 min-w-12 overflow-hidden rounded-full">
                        <Media
                          resource={t.avatar as MediaDoc}
                          imgClassName="h-12 w-12 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="size-12 min-h-12 min-w-12 rounded-full bg-eggshell/20" />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* ---------------- helpers ---------------- */

function clampStars(n?: number) {
  if (typeof n !== 'number') return 5
  if (n < 1) return 1
  if (n > 5) return 5
  return Math.round(n)
}

function smartQuotes(text: string) {
  // If the editor text isn’t already quoted, add nice quotes
  const trimmed = (text || '').trim()
  const hasQuotes = /^["“].*["”]$/.test(trimmed)
  return hasQuotes ? trimmed : `“${trimmed}”`
}

/* a tiny star svg to avoid extra deps */
function StarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="#FACC15" // warm yellow-gold
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M10 2.5l2.472 5.29 5.81.516-4.393 3.86 1.303 5.684L10 14.95l-5.192 2.9 1.303-5.684L1.718 8.306l5.81-.516L10 2.5z" />
    </svg>
  )
}

/* ---------------- video with mute toggle (unchanged) ---------------- */

function VideoWithMuteToggle({
  media,
  autoplay = true,
  mutedByDefault = true,
}: {
  media?: MediaDoc | string | null
  autoplay?: boolean
  loop?: boolean
  mutedByDefault?: boolean
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState<boolean>(mutedByDefault)

  useEffect(() => {
    const videoEl = wrapperRef.current?.querySelector('video')
    if (videoEl) {
      videoEl.muted = muted
      if (autoplay && videoEl.paused) {
        videoEl.play().catch(() => {})
      }
    }
  }, [muted, autoplay])

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden rounded-2xl border border-eggshell/10"
    >
      <div className="relative aspect-[9/16] w-full">
        <Media
          resource={media}
          className="absolute inset-0"
          videoClassName="absolute inset-0 h-full w-full object-cover rounded-2xl"
        />
      </div>

      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur transition hover:bg-black/60"
        aria-label={muted ? 'Unmute video' : 'Mute video'}
      >
        <span aria-hidden>{muted ? '🔇' : '🔊'}</span>
        <span>{muted ? 'Unmute' : 'Mute'}</span>
      </button>
    </div>
  )
}
