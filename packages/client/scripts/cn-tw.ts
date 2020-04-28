import { tify } from "chinese-conv";
import { catalogs } from "../src/i18n/catalog";
import { I_SOURCE_KEYS, saveJsonFile, SOURCE_KEYS } from "./script-utils";

/** ===========================================================================
 * Script
 * ============================================================================
 */

const SIMPLIFIED = catalogs["zh-CN"].catalog;

const convertToTraditional = (sourceKeys: I_SOURCE_KEYS) => {
  let result = {};

  for (const key of sourceKeys) {
    if (key in SIMPLIFIED) {
      const simplified = SIMPLIFIED[key as keyof typeof SIMPLIFIED];
      const traditional = tify(simplified);
      result = {
        ...result,
        [key]: traditional,
      };
    } else {
      console.error(
        `Found a key which didn't exist: ${key} - this should happen!!!`,
      );
    }
  }

  return result;
};

const convertSimplifiedToTraditional = () => {
  console.log(
    "Converting existing Simplified Chinese translation JSON file to Traditional Chinese\n",
  );

  const traditionalCatalog = convertToTraditional(SOURCE_KEYS);
  saveJsonFile(traditionalCatalog, "zh-TW");

  console.log("Conversion complete!\n");
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { convertSimplifiedToTraditional };
