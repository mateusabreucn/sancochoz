import StaticPageLayout from "@/components/StaticPageLayout";

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaticPageLayout>{children}</StaticPageLayout>;
}
