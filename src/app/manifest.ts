import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MoneyState",
    short_name: "MoneyState",
    description: "Financial state modeling app.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f0e5",
    theme_color: "#f6f0e5",
    icons: [],
  };
}
