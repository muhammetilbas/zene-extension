import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// WXT config — MV3, minimal permissions.
//   • activeTab → read the current tab's URL after the user clicks the icon.
//   • host_permissions: tryzene.com only → call the public readiness API from the
//     popup. A single, own-domain host (not <all_urls>), so review stays easy.
// The site itself is fetched & scored server-side by Zene, so the extension needs
// no access to the sites it checks. For local PEEX dev add "http://localhost:3000/*".
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Zene — AI Visibility Checker",
    description:
      "Free AI readiness score for any site: can ChatGPT, Claude, Gemini & Perplexity actually read your brand? Measured by Zene.",
    permissions: ["activeTab"],
    host_permissions: ["https://tryzene.com/*"],
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
