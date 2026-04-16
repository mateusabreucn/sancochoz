import { Inter, Permanent_Marker } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
});

export const metadata = {
  title: "sancochoz",
  description: "let's make projects we believe in",
  openGraph: {
    title: "sancochoz",
    description: "let's make projects we believe in",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${permanentMarker.variable} font-body bg-bg`}
      >
        {children}
      </body>
    </html>
  );
}
