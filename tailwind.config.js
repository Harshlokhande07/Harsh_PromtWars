/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "#4338CA",
          light: "#EEF2FF",
        },
        accent: {
          DEFAULT: "var(--accent)",
          light: "#FEF3C7",
        },
        ok: {
          DEFAULT: "var(--ok)",
          light: "#D1FAE5",
        },
        warn: {
          DEFAULT: "var(--warn)",
          light: "#FEE2E2",
        },
        border: "var(--border)",
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0, 0, 0, 0.08)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        elevated: "0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
