import { ImageResponse } from "next/og";
export const alt = "KIZAKIXD — Beyond the Block";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#171410",
          color: "#ede9df",
          padding: 65,
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 35,
            top: 130,
            width: 450,
            height: 320,
            border: "16px solid #aaa08c",
            borderRadius: "50%",
            transform: "rotate(-35deg)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 35,
            top: 130,
            width: 450,
            height: 320,
            border: "8px solid #ff653d",
            borderRadius: "50%",
            transform: "rotate(35deg)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: 220,
            top: 240,
            width: 90,
            height: 90,
            background: "#ff653d",
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span>kizakixd</span>
          <span style={{ color: "#afa497", fontSize: 14 }}>
            WEB3 / AI / SYSTEMS
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 105,
            letterSpacing: -7,
            lineHeight: 1.0,
            position: "relative",
            fontWeight: 700,
          }}
        >
          <span>Beyond</span>
          <span style={{ color: "#ff653d" }}>the block.</span>
        </div>
        <div style={{ display: "flex", fontSize: 18, color: "#b8af9e" }}>
          Independent developer. Connected systems.
        </div>
      </div>
    ),
    size,
  );
}
