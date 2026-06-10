import { Inter, Permanent_Marker } from "next/font/google";
import "@/styles/globals.css";
import { PageLoader } from "@/components/PageLoader";
import { CookieConsent } from "@/components/CookieConsent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LanguageProvider } from "@/context/LanguageContext";
import { PageLoaderProvider } from "@/context/PageLoaderContext";

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
        <LanguageProvider>
          <PageLoaderProvider>
            <ScrollToTop />
            <PageLoader />
            <CookieConsent />
            <div className="max-w-screen-3xl mx-auto">
              {children}
            </div>
          </PageLoaderProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
