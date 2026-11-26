/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FFF9F3",
          light: "#FFFCF9",
          dark: "#F4EAE0",
        },
        softPink: {
          DEFAULT: "#F3D5D8",
          light: "#FAF0F2",
          dark: "#E8BCC2",
        },
        dustyRose: {
          DEFAULT: "#D9A6AC",
          light: "#E7C2C7",
          dark: "#B87F87",
        },
        burgundy: {
          DEFAULT: "#743B4A",
          light: "#925162",
          dark: "#4E1F2C",
          deep: "#2B0B14",
        },
        mutedGold: {
          DEFAULT: "#C7A36B",
          light: "#E1C595",
          dark: "#A37C42",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
        handwriting: ["var(--font-dancing)", "cursive"],
      },
      boxShadow: {
        polaroid: "0 10px 30px -5px rgba(116, 59, 74, 0.15), 0 4px 10px -2px rgba(116, 59, 74, 0.08)",
        romantic: "0 20px 45px -10px rgba(116, 59, 74, 0.2)",
        glow: "0 0 25px rgba(199, 163, 107, 0.4)",
        letter: "0 15px 35px rgba(46, 14, 23, 0.12), 0 5px 15px rgba(0, 0, 0, 0.06)",
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatRev 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatRev: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.85' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};
