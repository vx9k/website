import en, { type Dictionary } from "./en";
import es from "./es";
import pt from "./pt";
import type { Locale } from "./locales";

export * from "./locales";
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, es, pt };

export const getDictionary = (locale: Locale) => dictionaries[locale];
