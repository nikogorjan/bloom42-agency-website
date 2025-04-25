// src/heros/LandingHero.tsx
'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import { Dialog, DialogTrigger } from '@relume_io/relume-ui'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { HeroTagline } from '@/components/ui/hero-tagline'

// This component will receive the `header` and `description` fields
export const LandingHero: React.FC<Page['hero']> = ({
  header,
  description,
  links,
  techStack,
  tagline,
}) => {
  return (
    <section id="hero-header" className="px-[5%] py-16 md:py-24 lg:py-28 bg-eggshell">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="relative rb-12 mb-12 text-center md:mb-18 lg:mb-20 max-w-[768px]">
            <div className="relative w-full max-w-lg flex flex-col items-center justify-center z-10">
              {/* Dynamically render hero tagline */}
              {tagline && <HeroTagline text={tagline} />}

              {/* Dynamically render hero header */}
              {header && (
                <span className="relative inline-block mb-5 md:mb-6">
                  <Media
                    src="/media/icons/orange-leaf.svg"
                    alt=""
                    priority
                    fill
                    className="z-0 pointer-events-none absolute left-[12px] top-[56px] md:left-[32px] md:top-[64px] lg:left-[-24px] lg:top-[80px] -translate-y-1/2 w-[16px] h-[15px] md:w-[25px] md:h-[24px] object-contain"
                  />
                  <Media
                    src="/media/icons/white-leaf-big.svg"
                    alt=""
                    priority
                    fill
                    className="z-0 pointer-events-none absolute right-[18px] top-[80px] md:right-[56px] md:top-[110px] lg:right-[15px] lg:top-[130px] -translate-y-1/2 w-[25px] h-[24px] md:w-[32px] md:h-[31px] object-contain"
                  />
                  <h1 className="relative z-10 text-6xl font-bebas md:text-9xl lg:text-[64px] max-w-[400px] md:max-w-[540px]">
                    {header}
                  </h1>
                </span>
              )}

              {/* Dynamically render hero description */}
              {description && (
                <p className="font-figtree font-light md:text-md max-w-[420px] md:max-w-[500px] lg:max-w-[610px]">
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
                  alt=""
                  priority
                  fill
                  className="pointer-events-none absolute -left-[24px] top-[28px] md:-left-[32px] md:top-[24px] w-[16px] h-[15px] md:w-[20px] md:h-[19px] object-contain z-0"
                />

                <Media
                  src="/media/icons/white-leaf-mid.svg"
                  alt=""
                  priority
                  fill
                  className="pointer-events-none absolute right-[-28px] top-[5px] md:right-[-38px] md:top-[10px] lg:right-[-38px] lg:top-[10px] -translate-y-1/2 w-[15px] h-[14px] md:w-[22px] md:h-[21px] object-contain z-0"
                />

                <div className="flex items-center justify-center mb-2">
                  {techStack?.items?.map(({ logo }, i) => (
                    <div
                      key={i}
                      className={cn(
                        'relative flex-shrink-0 size-[40px] rounded-full border border-eggshell bg-white flex items-center justify-center',
                        i !== 0 && '-ml-[8px]',
                      )}
                      style={{ zIndex: i + 1 }}
                    >
                      <Media
                        resource={logo}
                        alt=""
                        imgClassName="object-contain size-[32px]"
                        priority
                      />
                    </div>
                  ))}
                </div>
                <p className="font-bebas text-base">{techStack?.label}</p>
              </div>
            </div>
          </div>

          <div>
            <Dialog>
              <DialogTrigger className="relative flex w-full items-center justify-center">
                <img
                  src="/media/placeholder.webp"
                  alt="Relume placeholder image"
                  className="size-full object-cover"
                />
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  )
}
