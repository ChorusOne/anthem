import fs from "fs";
import path from "path";

import { ILocale } from "i18n/catalog";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface JSON {
  [key: string]: string;
}

export type I_SOURCE_KEYS = ReadonlyArray<string>;

/** ===========================================================================
 * Utils
 * ============================================================================
 */

const QUOTES_STRING_PATTERN = new RegExp(/"(.*?)"/g);
const NEW_LINE_PATTERN = new RegExp(/\r?\n|\r/g);

/**
 * Use plain regex double quotes matching to derive all the English text
 * strings which make up the app's i18n input values.
 *
 * TODO: Write something to read these source keys and the scan the codebase
 * src/ directory to find matching text in order to try to find i18n strings
 * which exist but have been removed/changed and no longer exist in use.
 *
 * TODO: This should also check for duplicated values in the original `ENGLISH`
 * union type, which otherwise will not be apparent.
 *
 * @returns I_SOURCE_KEYS
 */
const getTranslationSourceKeyStrings = (): I_SOURCE_KEYS => {
  const sourceString = fs
    .readFileSync(path.join(__dirname, "../src/i18n/english.ts"), "utf8")
    .replace(NEW_LINE_PATTERN, "");

  return sourceString.match(QUOTES_STRING_PATTERN)!.map(m => m.slice(1, -1));
};

const saveJsonFile = (data: JSON, key: ILocale) => {
  const json = JSON.stringify(data);
  fs.writeFileSync(
    path.join(__dirname, `../src/i18n/catalogs/${key}.json`),
    json,
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

const SOURCE_KEYS = getTranslationSourceKeyStrings();

export { SOURCE_KEYS, saveJsonFile };
