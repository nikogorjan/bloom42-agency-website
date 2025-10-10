// components/ui/ripple-button.tsx
'use client'

import * as React from 'react'
import { cn } from '@/utilities/ui'

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** default = dark→light; inverted = white→dark */
  variant?: 'default' | 'inverted'
  /** keeps the button in its “selected/dark” look */
  active?: boolean
  size?: 'default' | 'sm' | 'lg'
}

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    { className, variant = 'default', active = false, size = 'default', onClick, ...props },
    ref,
  ) => {
    const [xy, setXY] = React.useState({ x: 0, y: 0 })
    const [hovered, setHovered] = React.useState(false)

    const trackMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
      const r = e.currentTarget.getBoundingClientRect()
      setXY({ x: e.clientX - r.left, y: e.clientY - r.top })
    }
    const trackTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
      const t = e.touches[0]
      if (!t) return
      const r = e.currentTarget.getBoundingClientRect()
      setXY({ x: t.clientX - r.left, y: t.clientY - r.top })
    }

    // keep parity with AnimatedButton’s state logic
    const inverted = variant === 'inverted'
    const wantsDark = inverted ? active || hovered : !(active || hovered)
    const bgText = wantsDark ? 'bg-darkGray text-white' : 'bg-white text-darkGray'
    const ripple = inverted ? 'bg-darkGray' : 'bg-white'

    const sizes =
      size === 'sm'
        ? 'px-3 h-9 text-sm'
        : size === 'lg'
          ? 'px-5 h-12 text-base'
          : 'px-4 h-11 text-base'

    return (
      <button
        ref={ref}
        type="button"
        {...props}
        onClick={(e) => {
          onClick?.(e)
          setHovered(false)
          ;(e.currentTarget as HTMLButtonElement).blur()
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={trackMouse}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={(e) => {
          setHovered(true)
          trackTouch(e)
        }}
        onTouchEnd={() => setHovered(false)}
        data-active={active ? 'true' : 'false'}
        data-hover={hovered ? 'true' : 'false'}
        style={{ '--rx': `${xy.x}px`, '--ry': `${xy.y}px` } as React.CSSProperties}
        className={cn(
          'relative group rounded-full select-none outline-none transition duration-300',
          'border border-eggshell shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
          sizes,
          bgText,
          className,
        )}
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
              'group-data-[hover=true]:h-[300%] group-data-[hover=true]:w-[300%]',
              'group-data-[active=true]:h-[300%] group-data-[active=true]:w-[300%]',
            )}
          />
        </span>

        {/* content */}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {props.children}
        </span>
      </button>
    )
  },
)
RippleButton.displayName = 'RippleButton'
