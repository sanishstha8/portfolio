import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "Sanish Shrestha · Python & Django Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const META = ["PYTHON", "DJANGO", "REST API", "POSTGRESQL"];

/** Social card, generated at build time so there is no binary asset to keep in sync. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFFFF",
          padding: "72px 80px",
          color: "#0F1115",
        }}
      >
        {/* Top rail */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: "0.18em",
            color: "#4A4E57",
            borderBottom: "1px solid rgba(15,17,21,0.12)",
            paddingBottom: 24,
          }}
        >
          <span>SANISH.DEV</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#0B7A6D",
              }}
            />
            AVAILABLE
          </span>
        </div>

        {/* Statement */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>I BUILD DIGITAL</span>
            <span style={{ display: "flex", flexDirection: "row" }}>
              <span>SYSTEMS THAT WORK</span>
              <span style={{ color: "#0B7A6D" }}>.</span>
            </span>
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 28,
              color: "#4A4E57",
              letterSpacing: "-0.01em",
            }}
          >
            {`${site.name} · ${site.role}`}
          </div>
        </div>

        {/* Bottom rail */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 19,
            letterSpacing: "0.18em",
            color: "#6B7280",
            borderTop: "1px solid rgba(15,17,21,0.12)",
            paddingTop: 24,
          }}
        >
          <span style={{ display: "flex", gap: 28 }}>
            {META.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </span>
          <span>{`github.com/${site.githubHandle}`}</span>
        </div>
      </div>
    ),
    size,
  );
}
