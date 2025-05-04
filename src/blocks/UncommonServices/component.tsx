'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useMediaQuery } from '@relume_io/relume-ui'
import type { UncommonServicesBlock as UncommonServicesProps } from '@/payload-types'

type Feature = {
  number: string
  tagline?: string | null
  heading?: string | null
  description?: string | null
}

export const UncommonServices: React.FC<UncommonServicesProps> = ({ features }) => {
  // 1) Safely default to an empty array if features is null or undefined
  const safeFeatures = features ?? []

  const ref = useRef<HTMLDivElement>(null)
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 991px)')

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // 2) Use the "safe" array for length checks
  const featureCount = safeFeatures.length
  const numbers = Array.from({ length: featureCount }, (_, index) => index + 1)

  const y = isTablet
    ? useTransform(
        scrollYProgress,
        [0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        ['0%', '-25%', '-25%', '-50%', '-50%', '-75%'],
      )
    : useTransform(
        scrollYProgress,
        [0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        ['0%', '0%', '-25%', '-35%', '-50%', '-75%'],
      )

  return (
    <section ref={ref} className="px-[5%] py-16 md:py-24 lg:py-28 bg-black">
      <div className="container">
        <div className="relative grid auto-cols-fr grid-cols-1 items-start gap-x-8 gap-y-12 md:grid-cols-[0.75fr_1fr] md:gap-y-16 lg:grid-cols-[max-content_1fr] lg:gap-x-20">
          <div className="static top-[20%] hidden h-56 overflow-hidden md:sticky md:flex md:items-start">
            <h1 className="text-[6rem] font-bold leading-[1] md:text-[14rem] text-white">0</h1>
            <motion.div className="text-center" style={{ y }}>
              {numbers.map((number, index) => (
                <h1
                  key={index}
                  className="text-[6rem] font-bold leading-[1] md:text-[14rem] text-white"
                >
                  {number}
                </h1>
              ))}
            </motion.div>
          </div>
          <div className="grid auto-cols-fr grid-cols-1 gap-x-12 gap-y-12 md:gap-x-28 md:gap-y-28">
            {safeFeatures.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// 3) Adjust FeatureCard to destructure one prop named "feature"
const FeatureCard = ({ feature }: { feature: Feature }) => {
  const ref = useRef<HTMLDivElement>(null)

  // Again, default 'buttons' to an empty array if null
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })
  const animatedWidth = useSpring(scrollYProgress, { stiffness: 100, damping: 20 })
  const width = { width: useTransform(animatedWidth, [0, 1], ['0%', '100%']) }

  const { number, tagline, heading, description } = feature

  return (
    <div className="flex flex-col items-start justify-center py-8 md:py-0">
      <div className="mt-10 flex text-[6rem] font-bold leading-[1] md:mt-0 md:hidden md:text-[14rem] text-white">
        {number}
      </div>
      <div ref={ref} className="mb-8 mt-8 h-0.5 w-full bg-neutral-lighter md:mt-0">
        <motion.div className="h-0.5 w-8 bg-neutral-black" style={width} />
      </div>
      {tagline && <p className="mb-3 font-semibold md:mb-4 text-white">{tagline}</p>}
      {heading && (
        <h2 className="font-figtree font-semibold text-white rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          {heading}
        </h2>
      )}
      {description && <p className="md:text-md text-white">{description}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8"></div>
    </div>
  )
}
