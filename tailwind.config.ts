import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "Inter Variable", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "SFMono-Regular", "ui-monospace", "monospace"]
      },
      colors: {
        ink: "#10202f",
        muted: "#5d7086",
        panel: "#f7fbfc",
        line: "#d5e3ea",
        action: "#2563eb",
        actionDark: "#1d4ed8",
        teal: "#0f9f8e",
        success: "#047857",
        warning: "#b45309",
        danger: "#b42318"
      }
    }
  },
  plugins: []
};

export default config;
