/* components/ui/leaf-button.tsx */
'use client'

import * as React from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/utilities/ui'
import { buttonVariants, type ButtonProps } from '@/components/ui/button'
import { Media } from '@/components/Media'
import { motion, AnimatePresence } from 'motion/react'

export interface LeafButtonProps extends LinkProps, Pick<ButtonProps, 'size' | 'className'> {
  children: React.ReactNode
}

const leaves = [
  { src: '/media/icons/white-leaf-small.svg', x: -10, y: -20, delay: 0 },
  { src: '/media/icons/white-leaf-mid.svg', x: -15, y: -30, delay: 0.2 },
  { src: '/media/icons/white-leaf-big.svg', x: -20, y: -40, delay: 0.4 },
  { src: '/media/icons/orange-leaf.svg', x: 14, y: -40, delay: 0.6 },
  { src: '/media/icons/white-leaf-small.svg', x: 6, y: -40, delay: 0.8 },
  { src: '/media/icons/white-leaf-mid.svg', x: 19, y: -40, delay: 1.0 },
  { src: '/media/icons/white-leaf-mid.svg', x: 27, y: -40, delay: 1.2 },

  { src: '/media/icons/orange-leaf.svg', x: 26, y: -40, delay: 1.3 },
  { src: '/media/icons/white-leaf-small.svg', x: 18, y: -40, delay: 1.4 },
  { src: '/media/icons/white-leaf-mid.svg', x: 12, y: -40, delay: 1.5 },
  { src: '/media/icons/white-leaf-mid.svg', x: 8, y: -40, delay: 1.6 },

  { src: '/media/icons/orange-leaf.svg', x: 14, y: -40, delay: 1.7 },
  { src: '/media/icons/white-leaf-small.svg', x: 10, y: -40, delay: 1.8 },
  { src: '/media/icons/white-leaf-mid.svg', x: 7, y: -40, delay: 1.9 },
  { src: '/media/icons/white-leaf-mid.svg', x: 10, y: -40, delay: 2.0 },
]

const LeafButton: React.FC<LeafButtonProps> = ({
  href,
  children,
  size = 'default',
  className,
  ...linkProps
}) => {
  /* ripple position */
  const [xy, setXY] = React.useState({ x: 0, y: 0 })

  /* sparkle state */
  const [open, setOpen] = React.useState(false)
  const [burstId, setId] = React.useState(0)
  const timer = React.useRef<NodeJS.Timeout | null>(null)

  const setCoords = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    setXY({ x: e.clientX - left, y: e.clientY - top })
  }

  /* hover-in */
  const handleEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setCoords(e)
    setOpen(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setOpen(false)
      setId((i) => i + 1)
    }, 2_600)
  }

  /* hover-out */
  const handleLeave = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(false)
    setId((i) => i + 1)
  }

  return (
    <Link
      href={href}
      {...linkProps}
      onMouseEnter={handleEnter}
      onMouseMove={setCoords}
      onMouseLeave={handleLeave}
      className={cn(
        buttonVariants({ size, variant: 'default' }),
        'relative group bg-white text-black hover:text-white duration-300',
        className,
      )}
      style={{ '--rx': `${xy.x}px`, '--ry': `${xy.y}px` } as React.CSSProperties}
    >
      {/* ——— ripple (clipped by its own mask) ——— */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ borderRadius: 'inherit' }} /* <-- keeps rounded corners */
      >
        <span
          className="absolute top-[var(--ry)] left-[var(--rx)]
                     h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black
                     transition-all duration-300 ease-linear
                     group-hover:h-[300%] group-hover:w-[300%]"
        />
      </span>

      {/* label */}
      <span className="relative z-20 shrink-0 mr-1">{children}</span>

      {/* leaf burst */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: open ? 20 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="relative z-10 h-full flex items-center overflow-visible"
      >
        <AnimatePresence>
          {open &&
            leaves.map(({ src, x, y, delay }, i) => (
              <motion.div
                key={`${burstId}-${i}`}
                className="absolute"
                initial={{ opacity: 0, x: 8, y: 0 }}
                animate={{ opacity: [0, 1, 0], x, y }}
                exit={{ opacity: 0 }}
                transition={{ delay, duration: 0.8, ease: 'easeInOut' }}
              >
                <Media src={src} alt="" priority fill className="block size-1 object-contain" />
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* arrow */}
      <div className="relative z-20 size-[14px]">
        <Media
          fill
          src="/media/icons/right-arrow-alt.svg"
          alt="arrow"
          priority
          imgClassName="object-contain transition duration-300 group-hover:invert"
        />
      </div>
    </Link>
  )
}

export default LeafButton
