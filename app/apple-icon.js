import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#121110",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: 22, height: 110, background: "#B5453B", marginRight: 16, borderRadius: 4 }} />
        <div style={{ width: 22, height: 110, background: "#EDEAE3", borderRadius: 4 }} />
      </div>
    ),
    { ...size }
  );
}
