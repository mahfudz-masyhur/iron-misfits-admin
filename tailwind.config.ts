import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#57BEFF',
          main: '#2152FF',
          dark: '#1A1BDF'
        },
        secondary: {
          light: '#2D355B',
          main: '#42424a',
          dark: '#191919'
        },
        success: {
          light: '#A2DE66',
          main: '#99D161',
          dark: '#6A9143'
        },
        error: {
          light: '#F03A3A',
          main: '#E23636',
          dark: '#A32727'
        },
        warning: {
          light: '#FAC364',
          main: '#EDB95E',
          dark: '#AD8745'
        },
        info: {
          light: '#82F4FA',
          main: '#7BE7ED',
          dark: '#5BAAAE'
        },
        background: {
          'default-dark': '#111827',
          'paper-dark': '#1f2937',
          default: '#F5FAF7',
          paper: '#fff'
        },
        text: {
          primary: '#344767',
          secondary: '#96A0B1'
        },
        divider: '#dce0dd'
      },
      margin: {
        navbar: '31.6px'
      },
      padding: {
        navbar: '31.6px'
      },
      height: {
        navbar: '31.6px',
        'fit-screen': 'calc(100dvh - 32px)'
      },
      width: {
        'sidebar-open': '280px',
        'sidebar-close': '83px',
        'fit-content-open': 'calc(100dvw - 280px - 81px)',
        'fit-content-close': 'calc(100dvw - 83px - 81px)'
      },
      maxWidth: {
        'sidebar-open': '280px',
        'sidebar-close': '83px',
        'fit-content-open': 'calc(100dvw - 280px - 81px)',
        'fit-content-close': 'calc(100dvw - 83px - 81px)'
      },
      minWidth: {
        'sidebar-open': '280px',
        'sidebar-close': '83px',
        'fit-content-open': 'calc(100dvw - 280px - 81px)',
        'fit-content-close': 'calc(100dvw - 83px - 81px)'
      },
      maxHeight: {
        'fit-screen': 'calc(100dvw - 32px)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      dropdown: {
        menu: {
          width: '200px',
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          animation: 'fade-in 0.2s ease-out'
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'fade-out': 'fade-out 0.5s ease-in-out',
        'fade-in-slide': 'fade-in-slide 0.5s ease-in-out',
        'fade-out-slide': 'fade-out-slide 0.5s ease-in-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'fade-in-slide': {
          '0%': { opacity: '0', transform: 'translateX(-5px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'fade-out-slide': {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-5px)' }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      }
    }
  },
  plugins: [],
};
export default config;
