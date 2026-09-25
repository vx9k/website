// Each locale is a URL segment (/en, /es, /pt) mapped to the BCP 47 tag
// used for <html lang> and hreflang. The site root picks one of these for
// the visitor; see public/index.html. Kept apart from the dictionaries so
// client components can import it without pulling in every translation.
export const locales = {
  en: { tag: "en-US", short: "EN", name: "English", og: "en_US" },
  es: { tag: "es-419", short: "ES", name: "Español", og: "es_LA" },
  pt: { tag: "pt-BR", short: "PT", name: "Português", og: "pt_BR" },
} as const;

export type Locale = keyof typeof locales;

export const localeKeys = Object.keys(locales) as Locale[];

export const hasLocale = (value: string): value is Locale => value in locales;
