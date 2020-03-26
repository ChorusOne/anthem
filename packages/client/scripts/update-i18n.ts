import {
  catalogs,
  ICatalogItem,
  ICatalogKeys,
  TODO_IMPLEMENTATION_MSG,
} from "../src/i18n/catalog";
import { I_SOURCE_KEYS, saveJsonFile, SOURCE_KEYS } from "./script-utils";

/** ===========================================================================
 * Constants
 * ============================================================================
 */

/**
 * Method which iterates through the source keys and re-builds the JSON
 * translation file using these source keys as a source of truth.
 *
 * @param  {I_SOURCE_KEYS} sourceKeys
 * @param  {ICatalogItem} catalogItem
 */
const matchEnglishSourceWithJsonTranslationFile = (
  sourceKeys: I_SOURCE_KEYS,
  catalogItem: ICatalogItem,
) => {
  const { catalog, locale } = catalogItem;
  let result = {};
  let newWordCount = 0;

  /**
   * Iterating by the sourceKeys order will maintain a consistent order in
   * JSON translation files. Rules:
   *
   * - If the key does not exist, add it
   * - If the catalog is English, the translation matches the key
   * - If the catalog is not English, the translation requires implementation
   * - If the key already exists, map it to the previous translation
   *
   * This method will incidentally remove any keys in the JSON file which no
   * longer exist in the source file (e.g. removed or changed keys).
   */
  for (const key of sourceKeys) {
    if (!(key in catalog)) {
      newWordCount++;
      result = {
        ...result,
        [key]: locale === "en-US" ? key : TODO_IMPLEMENTATION_MSG,
      };
    } else {
      result = {
        ...result,
        [key]: catalog[key as ICatalogKeys],
      };
    }
  }

  const s = newWordCount > 1 ? "s" : "";
  console.log(
    `- Added ${newWordCount} new text item${s} for ${locale} locale.`,
  );
  return result;
};

/**
 * Run the program!
 *
 * This file is used to update the JSON translation files in `src/i18n/catalogs`
 * so they match the source of truth: `src/i18n/english.ts`. Running this
 * script with `yarn update-i18n` will derive all text strings from the
 * source type and then rebuild the JSON translation files so they match this
 * source, leaving any new untranslated strings with TODO placeholders.
 */
const main = () => {
  console.log("\nProcessing JSON i18n translation files...\n");

  const catalogList = Object.values(catalogs);
  for (const catalog of catalogList) {
    const data = matchEnglishSourceWithJsonTranslationFile(
      SOURCE_KEYS,
      catalog,
    );
    saveJsonFile(data, catalog.locale);
  }

  console.log(
    `\nComplete! ${catalogList.length} files processed successfully!\n`,
  );
};

main();
