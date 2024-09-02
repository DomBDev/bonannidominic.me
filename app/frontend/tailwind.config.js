module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: '#ebe2e1',
        background: '#151515',
        primary: '#6dabca', // Keeping the blue
        secondary: '#4b3f72', // Dark purple
        accent: '#3b945e', // Mellow green
        highlight: '#8e7cc3', // Additional accent color (mellow purple)
        darkblue: '#1a1a2e', // Dark blue for contrast
        darkpurple: '#2e2e46', // Dark purple for contrast
        muted: '#2e2e2e', // Darker background for contrast
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        glare: 'glare 2s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        glare: {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: 0,
          },
          '50%': {
            opacity: 0.5,
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [],
}