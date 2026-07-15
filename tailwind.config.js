/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Deep black — the void the hunter rises from
        void: {
          DEFAULT: "#05060A",
          50: "#14161F",
          100: "#0F111A",
          200: "#0B0D15",
          300: "#05060A",
        },
        // Dark blue — command-center panels
        abyss: {
          50: "#3A4A8C",
          100: "#2A3670",
          200: "#1B2452",
          300: "#131A3D",
          400: "#0C1129",
          500: "#080B1C",
        },
        // Electric purple — the awakening / rare rarity
        arcane: {
          50: "#EDE2FF",
          100: "#D6B8FF",
          200: "#B87BFF",
          300: "#9D4EFF",
          400: "#7B2FF7",
          500: "#5B1FC2",
          600: "#3E1489",
        },
        // Neon cyan — active state, XP, primary accent
        neon: {
          50: "#DFFCFF",
          100: "#A9F6FF",
          200: "#5CEBFF",
          300: "#22D9F5",
          400: "#0FB8D9",
          500: "#0A8FAD",
        },
        // Gold — legendary rewards only
        gold: {
          50: "#FFF6DF",
          100: "#FFE6A8",
          200: "#FFD874",
          300: "#F5B94D",
          400: "#E09B26",
          500: "#A8720F",
        },
        // Red — danger / boss / streak-at-risk only
        danger: {
          50: "#FFE1E5",
          300: "#FF5C6C",
          400: "#FF3B4E",
          500: "#C2202F",
        },
      },
      fontFamily: {
        display: ["Orbitron_700Bold", "System"],
        body: ["Inter_400Regular", "System"],
        "body-medium": ["Inter_500Medium", "System"],
        "body-semibold": ["Inter_600SemiBold", "System"],
        "body-bold": ["Inter_700Bold", "System"],
      },
    },
  },
  plugins: [],
};
