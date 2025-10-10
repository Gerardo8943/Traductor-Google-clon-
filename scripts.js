import { $ } from "./dom.js";

class GoogleTranslator {
  static SUPPORTED_LANGUAGES = [
    "auto",
    "es",
    "en",
    "fr",
    "de",
    "it",
    "pt",
    "zh",
    "ja",
    "ru",
    "ar",
    "hi",
    "ko",
    "nl",
    "sv",
    "tr",
    "pl",
    "vi",
    "th",
    "id",
  ];

  static FULL_LANGUAGE_CODES = {
    es: "es-ES",
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    pt: "pt-PT",
    zh: "zh-CN",
    ja: "ja-JP",
    ru: "ru-RU",
    ar: "ar-SA",
    hi: "hi-IN",
    ko: "ko-KR",
    nl: "nl-NL",
    sv: "sv-SE",
    tr: "tr-TR",
    pl: "pl-PL",
    vi: "vi-VN",
    th: "th-TH",
    id: "id-ID",
  };
}

