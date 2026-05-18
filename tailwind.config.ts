import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        beige: 'var(--beige)',
        'beige-dark': 'var(--beige-dark)',
        cream: 'var(--cream)',
        green: 'var(--green)',
        'green-mid': 'var(--green-mid)',
        'green-light': 'var(--green-light)',
        'green-accent': 'var(--green-accent)',
        'green-pale': 'var(--green-pale)',
        blue: 'var(--blue)',
        'blue-mid': 'var(--blue-mid)',
        'blue-light': 'var(--blue-light)',
        'blue-pale': 'var(--blue-pale)',
        'text-dark': 'var(--text-dark)',
        'text-muted': 'var(--text-muted)',
      },
      maxWidth: {
        hub: '1200px',
      },
    },
  },
  plugins: [],
};
export default config;
