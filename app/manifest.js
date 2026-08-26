export default function manifest() {
  return {
    name: "Iron Log",
    short_name: "Iron Log",
    description: "Full body 4x/week training tracker",
    start_url: "/",
    display: "standalone",
    background_color: "#121110",
    theme_color: "#121110",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
