/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--accent)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          soft: "var(--primary-soft)",
        },
        secondary: {
          DEFAULT: "var(--accent-2)",
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)",
          soft: "var(--secondary-soft)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--primary-light)", // map accent light to primary light for consistency
          dark: "var(--primary-dark)",
          soft: "var(--primary-soft)",
        },
        neutral: {
          background: "var(--bg)",
          surface: "var(--bg-surface)",
          panel: "var(--panel)",
          raised: "var(--panel-light)",
          border: "var(--panel-border)",
        },
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--muted)",
          subtle: "var(--muted)",
          inverse: "var(--text-inverse)",
        },
        success: {
          DEFAULT: "#10b981",
          soft: "rgba(16, 185, 129, 0.14)",
        },
        error: {
          DEFAULT: "#ef4444",
          soft: "rgba(239, 68, 68, 0.14)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          soft: "rgba(245, 158, 11, 0.14)",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        eyebrow: ["0.75rem", { lineHeight: "1rem", fontWeight: "700" }],
        body: ["0.9375rem", { lineHeight: "1.625rem" }],
        h6: ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }],
        h5: ["1.125rem", { lineHeight: "1.625rem", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.75rem", fontWeight: "700" }],
        h3: ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "2.375rem", fontWeight: "800" }],
        h1: ["clamp(2.75rem, 7vw, 5.75rem)", { lineHeight: "1", fontWeight: "800" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        component: "0.75rem",
        panel: "1rem",
        shell: "1.25rem",
      },
      boxShadow: {
        component: "0 18px 50px rgba(0, 0, 0, 0.28)",
        elevated: "0 28px 70px rgba(0, 0, 0, 0.38)",
        glow: "0 18px 45px rgba(37, 99, 235, 0.28)",
        focus: "0 0 0 4px rgba(37, 99, 235, 0.22)",
      },
    },
  },
  plugins: [],
};
