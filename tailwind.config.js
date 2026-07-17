/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pastel: {
          green: {
            100: '#e8f5e9',
            200: '#c8e6c9',
            300: '#a5d6a7',
            400: '#81c784',
            500: '#66bb6a',
          },
          brown: {
            100: '#f5ebe0',
            200: '#eed9c4',
            300: '#e3c4a8',
            400: '#d4a373',
            500: '#cc8b54',
          },
          dark: {
            bg: '#211d1b', // custom warm dark gray
            card: '#262b26', // custom dark olive panel
            text: '#f3f4f6'
          }
        }
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'rise': 'rise 8s infinite ease-in',
        'bump': 'bump 0.3s ease-out',
        'print': 'print 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
          '10%': { opacity: '0.8', transform: 'translateY(-10vh) scale(1)' },
          '60%': { opacity: '0.8', transform: 'translateY(-60vh) scale(1)' },
          '100%': { transform: 'translateY(-100vh) scale(0.2)', opacity: '0' },
        },
        bump: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        print: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
