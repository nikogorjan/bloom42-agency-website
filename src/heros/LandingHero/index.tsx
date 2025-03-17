// src/heros/LandingHero.tsx
'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import { Button, Dialog, DialogContent, DialogTrigger, VideoIframe } from '@relume_io/relume-ui'
import { FaCirclePlay } from 'react-icons/fa6'

// This component will receive the `header` and `description` fields
export const LandingHero: React.FC<Page['hero']> = ({ header, description }) => {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-center">
          <div className="rb-12 mb-12 text-center md:mb-18 lg:mb-20">
            <div className="w-full max-w-lg">
              {/* Dynamically render hero header */}
              {header && (
                <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
                  {header}
                </h1>
              )}

              {/* Dynamically render hero description */}
              {description && <p className="md:text-md">{description}</p>}

              <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
                <Button title="Learn More">Learn More</Button>
                <Button title="Get Started" variant="secondary">
                  Get Started
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Dialog>
              <DialogTrigger className="relative flex w-full items-center justify-center">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail-landscape.svg"
                  alt="Relume placeholder image"
                  className="size-full object-cover"
                />
                <span className="absolute inset-0 z-10 bg-black/50" />
                <FaCirclePlay className="absolute z-20 size-16 text-white" />
              </DialogTrigger>
              <DialogContent>
                <VideoIframe video="https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW" />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  )
}
