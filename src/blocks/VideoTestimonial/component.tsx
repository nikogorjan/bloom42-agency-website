'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { VideoTestimonialBlock, Media as MediaDoc } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { RichTextCustom } from '@/components/common/rich-text/rich-text'
import dynamic from 'next/dynamic'
import { useAnimatedNavigation } from '@/page-transition/transition-provider'

// Render <Canvas/> only on client
const World = dynamic(() => import('@/components/ui/globe').then((m) => m.World), {
  ssr: false,
})

function useIsDesktop(minWidth = 768) {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`)
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsDesktop('matches' in e ? e.matches : (e as MediaQueryList).matches)

    // init + subscribe
    setIsDesktop(mql.matches)
    if (mql.addEventListener) mql.addEventListener('change', onChange as any)
    else mql.addListener(onChange as any)

    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange as any)
      else mql.removeListener(onChange as any)
    }
  }, [minWidth])
  return isDesktop
}

type Props = VideoTestimonialBlock

/* ---------------- globe config + demo arcs ---------------- */

const globeConfig = {
  pointSize: 4,
  globeColor: '#0f1115',
  showAtmosphere: true,
  atmosphereColor: '#FFFFFF',
  atmosphereAltitude: 0.1,
  emissive: '#062056',
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: 'rgba(255,255,255,0.7)',
  directionalLeftLight: '#ffffff',
  directionalTopLight: '#ffffff',
  arcTime: 1200,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
}

const colors = ['#9CA3AF', '#A8AFB7', '#8B919B'] as const // muted grays
const pickOne = <T,>(arr: readonly T[]): T => arr[(Math.random() * arr.length) | 0] ?? arr[0]!

// lightweight sample arcs (trim if you want)
const sampleArcs = [
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.1,
    color: pickOne(colors),
  },
  {
    order: 1,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.2,
    color: pickOne(colors),
  },
  {
    order: 2,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.2,
    color: pickOne(colors),
  },
  {
    order: 2,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.3,
    color: pickOne(colors),
  },
  {
    order: 3,
    startLat: -33.8688,
    startLng: 151.2093,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: pickOne(colors),
  },
  {
    order: 3,
    startLat: 21.3099,
    startLng: -157.8581,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.3,
    color: pickOne(colors),
  },
  {
    order: 4,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.5,
    color: pickOne(colors),
  },
  {
    order: 5,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.2,
    color: pickOne(colors),
  },
  {
    order: 6,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: pickOne(colors),
  },
  {
    order: 7,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: pickOne(colors),
  },
  {
    order: 8,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.5,
    color: pickOne(colors),
  },
]

/* ---------------- component ---------------- */

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

  // Normalize CTA from linkGroup (array vs single)
  let ctaLink: any | undefined
  const rawCTA = cta as any
  if (rawCTA) {
    if (Array.isArray(rawCTA) && rawCTA.length > 0 && rawCTA[0]?.link) ctaLink = rawCTA[0].link
    else if (!Array.isArray(rawCTA) && rawCTA.link) ctaLink = rawCTA.link
  }

  const nav = useAnimatedNavigation()
  const fired = useRef(false)
  const isDesktop = useIsDesktop(768)
  // Opt in to waiting for THIS page load only
  useEffect(() => {
    if (!nav) return
    if (isDesktop) {
      nav.setShouldWait(true)
      return () => nav.setShouldWait(false)
    } else {
      // make sure we never wait on mobile
      nav.setShouldWait(false)
    }
  }, [isDesktop, nav])

  const handleWorldReady = () => {
    if (fired.current) return
    fired.current = true
    nav?.setPageReady?.()
  }

  return (
    <section
      id="video-testimonial"
      className="relative overflow-visible bg-darkSky px-[5%] py-12 md:py-20"
    >
      {/* DESKTOP BACKGROUND GLOBE (right side, half visible) */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute left-[-10vw] top-1/2 hidden -translate-y-1/2 md:block
          z-0
        "
        // size & responsiveness of the background globe
        style={{
          width: '90vh',
          height: '90vh',
          maxWidth: '1800px',
          maxHeight: '1800px',
        }}
      >
        <World globeConfig={globeConfig} data={sampleArcs} onReady={handleWorldReady} />
      </div>

      <div className="container relative z-10">
        {/* TOP ROW: text + video */}
        <div className="mx-auto max-w-[992px]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              {richText ? (
                <RichTextCustom
                  text={richText}
                  className="text-5xl md:text-6xl font-anton text-eggshell uppercase"
                />
              ) : null}

              {ctaLink ? (
                <div className="mt-8 md:mt-10 flex flex-col items-start justify-center sm:flex-row md:items-start md:justify-start">
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
            <div className="columns-1 gap-x-6 md:columns-2 lg:columns-3">
              {testimonials.map((t, idx) => (
                <article
                  key={idx}
                  className="mb-6 inline-block w-full break-inside-avoid rounded-2xl border border-eggshell/15 bg-darkPaper p-6 md:p-7 backdrop-blur-[2px]"
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
                    <div className="text-eggshell">
                      {t?.name ? <p className="font-semibold">{t.name}</p> : null}
                      {t?.position && (
                        <p className="text-eggshell/80">
                          <span>{t?.position}</span>
                          {t?.position}
                        </p>
                      )}
                    </div>
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
  const trimmed = (text || '').trim()
  const hasQuotes = /^["“].*["”]$/.test(trimmed)
  return hasQuotes ? trimmed : `“${trimmed}”`
}

/* fixed-color star */
function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="#FACC15" aria-hidden="true" className="h-5 w-5">
      <path d="M10 2.5l2.472 5.29 5.81.516-4.393 3.86 1.303 5.684L10 14.95l-5.192 2.9 1.303-5.684L1.718 8.306l5.81-.516L10 2.5z" />
    </svg>
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
          videoClassName="absolute inset-0 h-full w-full rounded-2xl object-cover"
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
