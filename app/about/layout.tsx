import StaticPageLayout from "@/components/StaticPageLayout";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaticPageLayout>{children}</StaticPageLayout>;
}
