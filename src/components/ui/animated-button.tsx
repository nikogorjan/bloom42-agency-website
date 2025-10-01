/* components/ui/animated-button.tsx */
'use client'

import * as React from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/utilities/ui'
import { buttonVariants, type ButtonProps } from '@/components/ui/button'

export interface AnimatedButtonProps extends LinkProps, Pick<ButtonProps, 'size' | 'className'> {
  children: React.ReactNode
  /** default = dark→light (current behavior); inverted = white→dark */
  variant?: 'default' | 'inverted'
  /** keeps the button in its “hovered/dark” state (for selected service) */
  active?: boolean
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  href,
  children,
  size = 'default',
  className,
  variant = 'default',
  active = false,
  ...linkProps
}) => {
  const [xy, setXY] = React.useState({ x: 0, y: 0 })
  const track = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    setXY({ x: e.clientX - left, y: e.clientY - top })
  }

  // base palette
  const base =
    variant === 'inverted'
      ? 'bg-white text-darkGray hover:bg-darkGray hover:text-white'
      : 'bg-darkGray text-white hover:bg-white hover:text-darkGray'

  // when active + inverted, keep dark bg/text even without hover
  const activeFix = variant === 'inverted' && active ? 'bg-darkGray text-white' : ''

  // ripple color matches the “hovered” background
  const ripple = variant === 'inverted' ? 'bg-darkGray' : 'bg-white'

  return (
    <Link
      href={href}
      {...linkProps}
      onMouseEnter={track}
      onMouseMove={track}
      className={cn(
        buttonVariants({ size, variant: 'default' }),
        'relative group duration-300',
        base,
        activeFix,
        className,
      )}
      style={{ '--rx': `${xy.x}px`, '--ry': `${xy.y}px` } as React.CSSProperties}
    >
      {/* ripple mask */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ borderRadius: 'inherit' }}
      >
        <span
          className={cn(
            'absolute top-[var(--ry)] left-[var(--rx)] h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-linear group-hover:h-[300%] group-hover:w-[300%]',
            ripple,
          )}
        />
      </span>

      <span className="relative z-10">{children}</span>
    </Link>
  )
}

export default AnimatedButton
