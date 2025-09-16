/* components/ui/animated-button.tsx */
'use client'

import * as React from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/utilities/ui'
import { buttonVariants, type ButtonProps } from '@/components/ui/button'

export interface AnimatedButtonProps extends LinkProps, Pick<ButtonProps, 'size' | 'className'> {
  children: React.ReactNode
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  href,
  children,
  size = 'default',
  className,
  ...linkProps
}) => {
  const [xy, setXY] = React.useState({ x: 0, y: 0 })
  const track = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    setXY({ x: e.clientX - left, y: e.clientY - top })
  }

  return (
    <Link
      href={href}
      {...linkProps}
      onMouseEnter={track}
      onMouseMove={track}
      className={cn(
        buttonVariants({ size, variant: 'default' }),
        'relative group bg-darkGray text-white hover:bg-white hover:text-darkGray duration-300',
        className,
      )}
      style={{ '--rx': `${xy.x}px`, '--ry': `${xy.y}px` } as React.CSSProperties}
    >
      {/* ripple mask — sits under content, clips to pill radius */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ borderRadius: 'inherit' }}
      >
        <span
          className="absolute top-[var(--ry)] left-[var(--rx)]
                     h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white
                     transition-all duration-300 ease-linear
                     group-hover:h-[300%] group-hover:w-[300%]"
        />
      </span>

      {/* label (above ripple) */}
      <span className="relative z-10">{children}</span>
    </Link>
  )
}

export default AnimatedButton
