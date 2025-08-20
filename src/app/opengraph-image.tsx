import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          color: "white",
          background: "linear-gradient(135deg, #060b1f 0%, #050814 55%, #040812 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#ffffff",
          }}
        >
          Aditya Singh
        </div>
        
        <div
          style={{
            fontSize: 32,
            color: "#00b9fc",
            marginBottom: "30px",
          }}
        >
          Visual Novel Portfolio
        </div>
        
        <div
          style={{
            fontSize: 24,
            color: "#ffffff88",
            textAlign: "center",
            maxWidth: "800px",
            marginBottom: "20px",
          }}
        >
          Interactive story-driven portfolio showcasing Tech × Finance
        </div>
        
        <div
          style={{
            fontSize: 18,
            color: "#ffffff66",
          }}
        >
          Built with Next.js • Tailwind • Framer Motion
        </div>
      </div>
    ),
    size
  );
}
