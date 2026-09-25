import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated favicon: the initial in accent on the site's canvas background. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          color: "#0B7A6D",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.05em",
          border: "1px solid rgba(15,17,21,0.16)",
        }}
      >
        S
      </div>
    ),
    size,
  );
}
