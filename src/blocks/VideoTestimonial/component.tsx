'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { VideoTestimonialBlock, Media as MediaDoc } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'

type Props = VideoTestimonialBlock

export default function VideoTestimonialComponent(props: Props) {
  const { richText, video, cta, autoplay = true, loop = true, mutedByDefault = true } = props

  // Normalize CTA coming from linkGroup (can be array or single object depending on your helper)
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
      <div className="container max-w-[992px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-center">
          {/* LEFT: Rich text + CTA */}
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

          {/* RIGHT: Video (9/16), autoplay, loop, muted with toggle */}
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
    </section>
  )
}

/* ---------------- video with mute toggle ---------------- */

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

  // Keep the underlying <video> element in sync when user toggles
  useEffect(() => {
    const videoEl = wrapperRef.current?.querySelector('video')
    if (videoEl) {
      videoEl.muted = muted
      if (autoplay && videoEl.paused) {
        // Try to play after user gesture; browsers may block autoplay until gesture
        videoEl.play().catch(() => {})
      }
    }
  }, [muted, autoplay])

  // We rely on your <Media> VideoMedia defaults (autoPlay, loop, muted, playsInline, controls=false)
  // We just provide sizing and a toggle overlay.
  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden rounded-2xl border border-eggshell/10"
    >
      {/* Aspect 9/16 box */}
      <div className="relative aspect-[9/16] w-full">
        <Media
          resource={media}
          // Fill the aspect-ratio box and round the video itself
          className="absolute inset-0"
          videoClassName="absolute inset-0 h-full w-full object-cover rounded-2xl"
        />
      </div>

      {/* Mute/Unmute button */}
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
