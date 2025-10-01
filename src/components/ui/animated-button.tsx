// components/ui/animated-button.tsx
'use client'

import * as React from 'react'
import Link, { type LinkProps } from 'next/link'
import { cn } from '@/utilities/ui'
import { buttonVariants, type ButtonProps } from '@/components/ui/button'

export interface AnimatedButtonProps extends LinkProps, Pick<ButtonProps, 'size' | 'className'> {
  children: React.ReactNode
  /** default = dark→light; inverted = white→dark */
  variant?: 'default' | 'inverted'
  /** keeps the button in its “selected/dark” look */
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
  const [hovered, setHovered] = React.useState(false)

  const trackMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setXY({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  const trackTouch = (e: React.TouchEvent<HTMLAnchorElement>) => {
    const t = e.touches[0]
    if (!t) return
    const r = e.currentTarget.getBoundingClientRect()
    setXY({ x: t.clientX - r.left, y: t.clientY - r.top })
  }

  // ---- Visual state -------------------------------------------------
  const inverted = variant === 'inverted'

  // Dark state logic:
  // - inverted: dark when active OR hovered
  // - default:  dark when NOT(active OR hovered)
  const wantsDark = inverted ? active || hovered : !(active || hovered)

  const bgText = wantsDark ? 'bg-darkGray text-white' : 'bg-white text-darkGray'

  // Ripple color equals the “hovered/active” background tint
  const ripple = inverted ? 'bg-darkGray' : 'bg-white'

  // ---- Events -------------------------------------------------------
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    linkProps.onClick?.(e)
    // kill sticky hover/focus on touch
    setHovered(false)
    ;(e.currentTarget as HTMLAnchorElement).blur()
  }

  return (
    <Link
      role="button"
      aria-pressed={active}
      href={href}
      {...linkProps}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={trackMouse}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={(e) => {
        setHovered(true)
        trackTouch(e)
      }}
      onTouchEnd={() => setHovered(false)}
      className={cn(
        buttonVariants({ size, variant: 'default' }),
        'relative group duration-300 rounded-full select-none focus:outline-none',
        bgText,
        className,
      )}
      data-active={active ? 'true' : 'false'}
      data-hover={hovered ? 'true' : 'false'}
      style={{ '--rx': `${xy.x}px`, '--ry': `${xy.y}px` } as React.CSSProperties}
    >
      {/* ripple layer */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
      >
        <span
          className={cn(
            'absolute top-[var(--ry)] left-[var(--rx)] h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height] duration-300 ease-linear will-change-[width,height]',
            ripple,
            // expand when hovered OR active — listen to parent data attrs
            'group-data-[hover=true]:h-[300%] group-data-[hover=true]:w-[300%]',
            'group-data-[active=true]:h-[300%] group-data-[active=true]:w-[300%]',
          )}
        />
      </span>

      <span className="relative z-10">{children}</span>
    </Link>
  )
}

export default AnimatedButton
