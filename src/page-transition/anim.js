// src/page-transition/anim.js
'use client'

export const text = {
  initial: { opacity: 1 },
  enter: {
    opacity: 0,
    top: -100,
    transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
    transitionEnd: { top: '47.5%' },
  },
  exit: {
    opacity: 1,
    top: '40%',
    transition: { duration: 0.5, delay: 0.4, ease: [0.33, 1, 0.68, 1] },
  },
}

export const curve = (initialPath, targetPath) => ({
  initial: { d: initialPath },
  enter: {
    d: targetPath,
    transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    d: initialPath,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
})

/**
 * Responsive translate variant.
 * offset = arc height in px (we use the same "arc" value we compute in index.tsx)
 */
export const translate = (offset = 300) => ({
  initial: { top: `-${offset}px` },
  enter: {
    top: '-100vh',
    transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] },
    transitionEnd: { top: '100vh' },
  },
  exit: {
    top: `-${offset}px`,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
})
