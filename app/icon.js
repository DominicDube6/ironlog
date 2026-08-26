import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <div style={{ width: 4, height: 20, background: "#B5453B", marginRight: 3 }} />
        <div style={{ width: 4, height: 20, background: "#EDEAE3" }} />
      </div>
    ),
    { ...size }
  );
}
