import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clareza Financeira",
    short_name: "Clareza",
    description: "Entenda seu dinheiro sem complicação.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f7fafc",
    theme_color: "#1e5aa8",
    orientation: "portrait",
    categories: ["finance", "productivity"],
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/maskable-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  }
}
