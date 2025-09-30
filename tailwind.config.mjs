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
        darkGray: '#262423',
        darkSand: '#201e1d',
        darkSky: '#101014',
        darkPaper: '#1c1c20',
      },
      fontFamily: {
        sans: ['var(--font-figtree)', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-anton)', 'var(--font-figtree)', 'ui-sans-serif'],
        figtree: ['var(--font-figtree)'],
        anton: ['var(--font-anton)'],
        ivypresto: ['var(--font-ivypresto)', 'serif'],
      },
      screens: {
        '2xl': '1440px',
      },
    },
  },
}
