/* app/fonts.ts */
import { Anton, Figtree } from 'next/font/google'

/**
 * Bebas Neue has only one static weight (400),
 * so we just pull that single file.
 */
export const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
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
