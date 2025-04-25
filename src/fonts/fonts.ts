/* app/fonts.ts */
import { Bebas_Neue, Figtree } from 'next/font/google'

/**
 * Bebas Neue has only one static weight (400),
 * so we just pull that single file.
 */
export const bebasNeue = Bebas_Neue({
  weight: '400', // only option available
  subsets: ['latin'],
  variable: '--font-bebas-neue',
})

/**
 * Figtree is a variable font on Google Fonts (300-900),
 * but if you want every static slice you can list them all.
 */
export const figtree = Figtree({
  weight: [
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900', // all published weights
  ],
  style: ['normal', 'italic'], // omit if you don’t need italics
  subsets: ['latin'],
  variable: '--font-figtree',
})
