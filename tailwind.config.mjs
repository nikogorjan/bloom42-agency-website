/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [require('@relume_io/relume-tailwind')],
  theme: {
    extend: {
      colors: {
        coral: '#FD7247',
        eggshell: '#F4F3ED',
        lightGray: '#EDEDED',
      },
      fontFamily: {
        sans: ['var(--font-figtree)', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-bebas-neue)', 'var(--font-figtree)', 'ui-sans-serif'],
        figtree: ['var(--font-figtree)'],
        bebas: ['var(--font-bebas-neue)'],
      },
    },
  },
}
