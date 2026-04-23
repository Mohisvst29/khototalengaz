import ar from "../../locales/ar.json";
import en from "../../locales/en.json";

const translations: any = { ar, en };

export function getTranslation(locale: string) {
  return translations[locale] || translations.ar;
}

export type Locale = "ar" | "en";
