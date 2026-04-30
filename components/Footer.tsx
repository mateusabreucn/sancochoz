"use client";

import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="py-6 text-center text-xs xs:text-sm md:text-base text-text-muted font-body">
      &copy; {new Date().getFullYear()} Sancochoz. {t.footer.rights}
    </footer>
  );
}
