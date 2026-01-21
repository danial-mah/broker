import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#080A0F',
        surface: '#11151E',
        panel: '#171C27',
        border: '#273142',
        primary: '#2DD4BF',
        accent: '#F8C14A',
        danger: '#F87171',
        success: '#4ADE80'
      },
      boxShadow: {
        glow: '0 0 40px rgba(45, 212, 191, 0.12)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
