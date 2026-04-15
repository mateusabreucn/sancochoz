import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <Header variant="about" />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      <Footer />
    </div>
  );
}
