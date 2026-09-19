/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Ali Food brand palette (extracted from logo banner)
        brand: {
          50:  '#FFF8EC',
          100: '#FEEECB',
          200: '#FDD98A',
          300: '#FCBC3A',
          400: '#F5A623',  // Primary amber/orange — dominant logo background
          500: '#E8940D',
          600: '#C97C09',
          700: '#A46006',
          800: '#7C4805',
          900: '#5A3404',
          950: '#3A2003',
        },
        amber: {
          50:  '#FFF8EC',
          100: '#FEEECB',
          200: '#FDD98A',
          300: '#FCBC3A',
          400: '#F5A623',  // Primary amber/orange
          500: '#E8940D',
          600: '#C97C09',
          700: '#A46006',
          800: '#7C4805',
          900: '#5A3404',
          950: '#3A2003',
        },
        maroon: {
          50:  '#FDF0F0',
          100: '#FADADD',
          200: '#F5A9B0',
          300: '#E97882',
          400: '#D14B56',
          500: '#B02332',
          600: '#8A1220',
          700: '#6B1A1A',  // Dark maroon — "Ali Food" text color in logo
          800: '#4F1010',
          900: '#380B0B',
          950: '#240606',
        },
        forest: {
          50:  '#F0FBF4',
          100: '#D8F3E1',
          200: '#A8E4BB',
          300: '#6DCE90',
          400: '#38B265',
          500: '#1F9148',
          600: '#1A7A3C',  // Official emerald green accent (left stripe of logo)
          700: '#155F2E',
          800: '#0F4620',
          900: '#0A3016',
          950: '#051A0C',
        },
        // Dark warm background (maroon-tinted dark)
        warmDark: {
          800: '#1A0808',
          900: '#100505',
          950: '#080202',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
