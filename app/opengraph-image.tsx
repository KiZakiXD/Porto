import { ImageResponse } from "next/og";
export const alt = "KIZAKIXD — Engineering New Worlds";
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
          position: "relative",
          overflow: "hidden",
          background: "#06080d",
          color: "#f0f4ff",
          padding: 65,
          fontFamily: "sans-serif",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: -80,
            top: 84,
            width: 610,
            height: 610,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 25% 23%, #bc824b 0%, #704232 33%, #21191f 65%, #06080d 86%)",
            border: "2px solid #688cc977",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: -180,
            top: 230,
            width: 820,
            height: 230,
            border: "1px solid #789de84d",
            borderRadius: "50%",
            transform: "rotate(-29deg)",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "relative",
            justifyContent: "space-between",
            fontSize: 16,
            letterSpacing: 3,
          }}
        >
          <span>KIZAKIXD</span>
          <span style={{ color: "#9baccc" }}>WEB3 / BLOCKCHAIN / AI</span>
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            fontSize: 91,
            letterSpacing: -6,
            lineHeight: 1.05,
          }}
        >
          <span>Engineering</span>
          <span style={{ color: "#b7cbeb" }}>new worlds.</span>
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            fontSize: 18,
            color: "#899fbe",
          }}
        >
          A developer’s precision. An architect’s perspective.
        </div>
      </div>
    ),
    size,
  );
}
