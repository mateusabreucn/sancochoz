import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="about" />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
