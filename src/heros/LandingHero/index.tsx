// src/heros/LandingHero.tsx
'use client'

import React, { useEffect, useState } from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { HeroTagline } from '@/components/ui/hero-tagline'
import Squares from '@/components/ui/squares-background-animation'

// This component will receive the `header` and `description` fields
export const LandingHero: React.FC<Page['hero']> = ({
  header,
  description,
  links,
  techStack,
  tagline,
  heroVideo,
}) => {
  const [squareSize, setSquareSize] = useState(80)

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 768) {
        // Mobile
        setSquareSize(64)
      } else {
        // Tablet & up
        setSquareSize(80)
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <section
      id="hero-header"
      className="relative overflow-hidden px-[5%] pb-16 md:pb-24 lg:pb-28 pt-32 md:pt-36 lg:pt-36 bg-eggshell"
    >
      <div className="absolute inset-0 z-0 ">
        <Squares
          speed={0.2}
          squareSize={squareSize}
          direction="up"
          borderColor="#EBE9E4"
          hoverFillColor="#EBE9E4"
        />
      </div>

      {/* <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] w-full h-full">
        <ThreeMeshoptViewer />
      </div>
*/}
      {/* Foreground content */}
      <div className="relative z-10 container">
        <div className="flex flex-col items-center">
          <div className="relative rb-12 mb-12 text-center md:mb-18 lg:mb-20 max-w-[768px]">
            <div className="relative w-full max-w-lg flex flex-col items-center justify-center z-10">
              {/* edge-less ambient blur layer */}
              <span
                aria-hidden
                className="
                    pointer-events-none absolute -z-10 left-1/2 top-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-[80vw] h-[80vh] md:w-[70vw] md:h-[70vh]
                    backdrop-blur-md bg-eggshell/30
                    [mask-image:radial-gradient(50%_50%_at_50%_50%,_black_35%,_transparent_70%)]
                    [mask-repeat:no-repeat]
                    [mask-size:100%_100%]
                    "
              />
              {/* Dynamically render hero tagline */}
              {tagline && <HeroTagline text={tagline} />}
              {/* Dynamically render hero header */}
              {header && (
                <span className="relative inline-block mb-5 md:mb-6">
                  <Media
                    src="/media/icons/orange-leaf.svg"
                    alt="orange-leaf"
                    priority
                    fill
                    className="z-0 pointer-events-none absolute left-[12px] top-[56px] md:left-[32px] md:top-[64px] lg:left-[-0px] lg:top-[80px] -translate-y-1/2 w-[16px] h-[15px] md:w-[25px] md:h-[24px] object-contain"
                  />
                  <Media
                    src="/media/icons/white-leaf-big.svg"
                    alt="white-leaf"
                    priority
                    fill
                    className="z-0 pointer-events-none absolute right-[18px] top-[80px] md:right-[56px] md:top-[110px] lg:right-[0px] lg:top-[130px] -translate-y-1/2 w-[25px] h-[24px] md:w-[32px] md:h-[31px] object-contain"
                  />
                  <h1 className="relative z-10 text-darkGray text-6xl font-anton md:text-10xl lg:text-[72px] max-w-[500px] md:max-w-[690px]">
                    {header}
                  </h1>
                </span>
              )}
              {/* Dynamically render hero description */}
              {description && (
                <p className="font-figtree font-light md:text-md max-w-[420px] md:max-w-[560px] lg:max-w-[560px]">
                  {description}
                </p>
              )}
              <div className="relative mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8 mb-5 md:mb-6">
                {links?.map(({ link }, i) => {
                  return <CMSLink key={i} {...link} />
                })}
              </div>
              <div className="relative flex flex-col items-center justify-center">
                {/* white leaf to the left of the tech-stack badges */}
                <Media
                  src="/media/icons/white-leaf-small.svg"
                  alt="white-leaf-small"
                  priority
                  fill
                  className="pointer-events-none absolute -left-[24px] top-[28px] md:-left-[32px] md:top-[24px] w-[16px] h-[15px] md:w-[20px] md:h-[19px] object-contain z-0"
                />

                <Media
                  src="/media/icons/white-leaf-mid.svg"
                  alt="white-leaf-mid"
                  priority
                  fill
                  className="pointer-events-none absolute right-[-28px] top-[5px] md:right-[-38px] md:top-[10px] lg:right-[-38px] lg:top-[10px] -translate-y-1/2 w-[15px] h-[14px] md:w-[22px] md:h-[21px] object-contain z-0"
                />

                <div className="relative flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center mb-2">
                    {techStack?.items?.map(({ logo }, i) => (
                      <div
                        key={i}
                        className={cn(
                          'relative flex-shrink-0 w-[40px] h-[40px] rounded-full border border-eggshell bg-white flex items-center justify-center transition-transform ease-in-out',
                          i !== 0 && '-ml-[8px]',
                          `z-[${i + 1}] hover:z-50 hover:scale-110`,
                        )}
                      >
                        <Media
                          resource={logo}
                          alt="alt-logo"
                          imgClassName="object-contain w-[32px] h-[32px]"
                          priority
                        />
                      </div>
                    ))}
                  </div>
                  <p className="font-anton text-darkGray text-base">{techStack?.label}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex w-full items-center justify-center">
            {heroVideo ? (
              <Media
                resource={heroVideo}
                className="w-full"
                videoClassName="w-full h-auto rounded-3xl"
              />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
