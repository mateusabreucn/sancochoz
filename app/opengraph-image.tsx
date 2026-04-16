import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "sancochoz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <svg
          viewBox="0 0 1000 1000"
          width={220}
          height={220}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M879.3,376.36c-94.67,69.4-265.28,82.77-381.37,82.75-95-.01-186.65-7.87-277.13-33.81-42.2-12.1-127.64-44.27-127.37-92.63.27-49.49,81.94-81.07,125.4-93.49,161.95-46.28,405.44-46.27,566.56,2.39,42.04,12.7,117.46,43.64,117.76,91.25.08,13.02-10.94,34.08-23.84,43.54Z" />
          <path d="M936.6,360.61c-3.46,80.72-39.57,154.2-95.21,213.03-69.4,73.37-159.74,115.11-258.92,133.43-231.39,42.74-512.55-101-522.7-353.39,25.42,65.49,144.83,100.09,213.3,113.23,149.31,28.65,300.43,28.38,449.74.02,70.83-13.46,167.84-41.85,213.79-106.31Z" />
        </svg>
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: "#0A0A0A",
            letterSpacing: "-1px",
          }}
        >
          sancochoz
        </span>
      </div>
    ),
    { ...size }
  );
}
