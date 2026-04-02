import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cta: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0a',
        },
        navy: {
          50: '#f0f4fa',
          100: '#dce6f4',
          200: '#b3c8e8',
          300: '#7aa3d4',
          400: '#4378bc',
          500: '#2a5fa5',
          600: '#1e4a8a',
          700: '#193c72',
          800: '#122d56',
          900: '#0C1829',
          950: '#080f1a',
        },
        amber: {
          50: '#eff7fd',
          100: '#daeef9',
          200: '#b0dcf4',
          300: '#76c1eb',
          400: '#3da2dc',
          500: '#2589C4',
          600: '#1d6fa0',
          700: '#185a82',
          800: '#174b6b',
          900: '#163f59',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
