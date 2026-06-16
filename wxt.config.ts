import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// WXT config — MV3, minimal permissions. We never declare host_permissions:
// the readiness probe runs inside the active tab via `activeTab` + `scripting`,
// so every robots.txt / homepage / llms.txt fetch is SAME-ORIGIN to the page
// the user is already on. That keeps the Web Store review surface tiny.
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Zene — AI Visibility Checker",
    description:
      "Free GEO readiness score for any site: can ChatGPT, Claude, Gemini & Perplexity actually read your brand? Measured by Zene.",
    permissions: ["activeTab", "scripting"],
    action: {
      default_title: "Zene — check this site's AI visibility",
      default_icon: {
        16: "/icon/16.png",
        32: "/icon/32.png",
        48: "/icon/48.png",
        128: "/icon/128.png",
      },
    },
    icons: {
      16: "/icon/16.png",
      32: "/icon/32.png",
      48: "/icon/48.png",
      96: "/icon/96.png",
      128: "/icon/128.png",
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
