import { getRequestConfig } from "next-intl/server";

const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    return {
      locale: "pt",
      messages: (await import("../messages/pt.json")).default,
    };
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
