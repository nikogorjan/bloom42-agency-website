// src/blocks/TeamSlider/component.tsx
'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import type { TeamSliderBlock, TeamMember, Media as MediaDoc } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = TeamSliderBlock

const INACTIVE_SCALE = 1.22
const EASE = [0.22, 0.61, 0.36, 1] as const

function isTeamMember(x: unknown): x is TeamMember {
  return !!x && typeof x === 'object' && 'id' in (x as any)
}

/* measure an element's content width (for mobile active square height) */
function useElementWidth<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)
  const [w, setW] = React.useState<number>(0)
  React.useLayoutEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ro = new ResizeObserver(([entry]) => {
      const cw = entry?.contentRect?.width ?? el.clientWidth
      setW(Math.round(cw))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, width: w }
}

export default function TeamSliderComponent(props: Props) {
  const { tagline, heading, description } = props
  const members: TeamMember[] = (props.members ?? []).filter(isTeamMember)
  if (!members.length && !tagline && !heading && !description) return null

  const [activeIndex, setActiveIndex] = React.useState<number>(
    Math.min(1, Math.max(0, members.length - 1)),
  )

  return (
    <section id="team" className="px-[5%] py-16 md:py-24 lg:py-28 bg-eggshell">
      <div className="container px-0">
        {(tagline || heading || description) && (
          <header className="mx-auto mb-10 w-full max-w-3xl text-center md:mb-14">
            {tagline ? <p className="mb-3 font-semibold text-neutral-600">{tagline}</p> : null}
            {heading ? (
              <h2 className="mb-4 text-4xl font-bold leading-tight text-neutral-900 md:text-6xl">
                {heading}
              </h2>
            ) : null}
            {description ? <p className="text-neutral-700 md:text-lg">{description}</p> : null}
          </header>
        )}

        {/* ---------- MOBILE (vertical, animated height) ---------- */}
        <MobileAccordion members={members} activeIndex={activeIndex} onActivate={setActiveIndex} />

        {/* ---------- DESKTOP (horizontal accordion, exact as your snippet + grayscale) ---------- */}
        <DesktopAccordion members={members} activeIndex={activeIndex} onActivate={setActiveIndex} />
      </div>
    </section>
  )
}

/* ===================== Mobile ===================== */

function MobileAccordion({
  members,
  activeIndex,
  onActivate,
}: {
  members: TeamMember[]
  activeIndex: number
  onActivate: (i: number) => void
}) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const activeH = Math.max(288, Math.min(width, 608)) // ≈ square; clamp 18rem..38rem
  const inactiveH = 240 // 15rem

  return (
    <div className="block min-[940px]:hidden" ref={ref}>
      <div className="flex w-full flex-col gap-4">
        {members.map((member, index) => {
          const img = member.image as unknown as MediaDoc | null
          const isActive = activeIndex === index
          const key = (member as any).id ?? `${member?.name ?? 'm'}-m-${index}`

          return (
            <motion.div
              key={key}
              className={clsx(
                'relative w-full cursor-pointer overflow-hidden rounded-3xl',
                'will-change-transform',
              )}
              initial={{ height: inactiveH }}
              animate={{ height: isActive ? activeH : inactiveH }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={() => onActivate(index)}
            >
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <motion.div
                  className="h-full w-full"
                  initial={{ scale: INACTIVE_SCALE, filter: 'grayscale(100%)' }}
                  animate={{
                    scale: isActive ? 1 : INACTIVE_SCALE,
                    filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)',
                  }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {img ? (
                    <Media
                      resource={img}
                      alt={(member.name as string) || 'Team member'}
                      className="absolute inset-0 !h-full !w-full"
                      imgClassName="!absolute !inset-0 !h-full !w-full !object-cover"
                      priority={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200/40 text-neutral-500">
                      No image
                    </div>
                  )}
                </motion.div>
              </div>

              <AnimatePresence>
                {isActive && (member.name || member.jobTitle) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="pointer-events-none absolute inset-x-0 bottom-0 p-4"
                  >
                    {member.name ? (
                      <p className="text-xl font-medium text-white drop-shadow">
                        {member.name as string}
                      </p>
                    ) : null}
                    {member.jobTitle ? (
                      <p className="text-md text-white/80">{member.jobTitle as string}</p>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ===================== Desktop ===================== */

function DesktopAccordion({
  members,
  activeIndex,
  onActivate,
}: {
  members: TeamMember[]
  activeIndex: number
  onActivate: (i: number) => void
}) {
  return (
    <div
      className={clsx(
        'relative hidden w-full min-[940px]:block',
        // base defaults (≥940)
        '[--tileH:24rem]',
        '[--activeW:32rem]',
        '[--inactiveW:8rem]',

        // regular bumps
        'xl:[--tileH:26rem]',
        '2xl:[--tileH:30rem]',

        // ≥1920 — a little bigger than before
        'min-[1920px]:[--tileH:34rem]',
        'min-[1920px]:[--activeW:40rem]',
        'min-[1920px]:[--inactiveW:12rem]',

        // ≥2560 — gentle extra bump
        'min-[2560px]:[--tileH:40rem]',
        'min-[2560px]:[--activeW:48rem]',
        'min-[2560px]:[--inactiveW:14rem]',
      )}
    >
      <div className="w-full flex justify-center">
        <div className="inline-flex flex-nowrap items-stretch gap-3 min-[940px]:gap-4 min-[1920px]:gap-5 min-[2560px]:gap-6">
          {members.map((member, index) => {
            const img = member.image as unknown as MediaDoc | null
            const isActive = activeIndex === index
            const key = (member as any).id ?? `${member?.name ?? 'm'}-d-${index}`

            return (
              <motion.div
                key={key}
                className={clsx(
                  'relative shrink-0 cursor-pointer overflow-hidden rounded-3xl',
                  'will-change-transform',
                )}
                initial={{ width: 'var(--inactiveW)', height: 'var(--tileH)' }}
                animate={{
                  width: isActive ? 'var(--activeW)' : 'var(--inactiveW)',
                  height: 'var(--tileH)',
                }}
                transition={{ duration: 0.35, ease: EASE }}
                onClick={() => onActivate(index)}
                onHoverStart={() => onActivate(index)}
              >
                {/* absolute media frame that truly fills the tile */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {/* scale + grayscale per state (desktop) */}
                  <motion.div
                    className="h-full w-full"
                    initial={{ scale: INACTIVE_SCALE, filter: 'grayscale(100%)' }}
                    animate={{
                      scale: isActive ? 1 : INACTIVE_SCALE,
                      filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)',
                    }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {img ? (
                      <Media
                        resource={img}
                        alt={(member.name as string) || 'Team member'}
                        className="absolute inset-0 !h-full !w-full"
                        imgClassName="!absolute !inset-0 !h-full !w-full !object-cover"
                        priority={false}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-200/40 text-neutral-500">
                        No image
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* caption only when active */}
                <AnimatePresence>
                  {isActive && (member.name || member.jobTitle) && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25 }}
                      className="pointer-events-none absolute inset-x-0 bottom-0 p-4"
                    >
                      {member.name ? (
                        <p className="text-sm font-medium text-white drop-shadow">
                          {member.name as string}
                        </p>
                      ) : null}
                      {member.jobTitle ? (
                        <p className="text-xs text-white/80">{member.jobTitle as string}</p>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
