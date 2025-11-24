import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        surface: '#0f172a',
        'surface-glass': 'rgba(15, 23, 42, 0.6)',
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        accent: '#8B5CF6',
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
        border: '#1E293B',
        success: '#10B981',
        error: '#EF4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #3B82F6, #2563EB)',
        'gradient-accent': 'linear-gradient(to right, #8B5CF6, #6D28D9)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
