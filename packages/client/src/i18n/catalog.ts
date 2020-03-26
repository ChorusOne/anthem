import { ENGLISH } from "i18n/english";

/* Import locale JSON catalogs: */
import de from "./catalogs/de.json";
import en from "./catalogs/en-US.json";
import es from "./catalogs/es-ES.json";
import kr from "./catalogs/kr.json";
import zhCN from "./catalogs/zh-CN.json";
import zhTW from "./catalogs/zh-TW.json";

/** ===========================================================================
 * i18n Configuration
 * ----------------------------------------------------------------------------
 * These are the catalogs for different support internationalized locales.
 * ============================================================================
 */

export const LOCALE_MAP = {
  "en-US": "en-US",
  de: "de",
  "es-ES": "es-ES",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  kr: "kr",
};

export type ILocale = keyof typeof LOCALE_MAP;

export const DEFAULT_LOCALE: ILocale = "en-US";

export type ICatalogKeys = ENGLISH[0];

export type ICatalog = { [k in ICatalogKeys]: string };

export interface ICatalogItem {
  catalog: ICatalog;
  locale: ILocale;
  language: string;
}

export interface ICatalogs {
  [key: string]: ICatalogItem;
}

/**
 * This string is used to identify temporary un-translated strings in the
 * JSON translation files. See `scripts/update-i18n.ts` for more details.
 */
export const TODO_IMPLEMENTATION_MSG = "<<< TODO: Implement >>>";

/** ===========================================================================
 * i18n Catalogs for the locales the app supports
 * ============================================================================
 */

const catalogs: ICatalogs = {
  [LOCALE_MAP["en-US"]]: {
    catalog: en,
    locale: "en-US",
    language: "English",
  },
  [LOCALE_MAP.de]: {
    catalog: de,
    locale: "de",
    language: "Deutsch",
  },
  [LOCALE_MAP["es-ES"]]: {
    catalog: es,
    locale: "es-ES",
    language: "español",
  },
  [LOCALE_MAP["zh-CN"]]: {
    catalog: zhCN,
    locale: "zh-CN",
    language: "中文 (简体)",
  },
  [LOCALE_MAP["zh-TW"]]: {
    catalog: zhTW,
    locale: "zh-TW",
    language: "中文 (繁體)",
  },
  [LOCALE_MAP.kr]: {
    catalog: kr,
    locale: "kr",
    language: "한국어",
  },
};

const DEFAULT_CATALOG = catalogs[DEFAULT_LOCALE].catalog;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { catalogs, DEFAULT_CATALOG };
