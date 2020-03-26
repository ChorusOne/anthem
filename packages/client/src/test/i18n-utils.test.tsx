import React from "react";

import { catalogs, TODO_IMPLEMENTATION_MSG } from "i18n/catalog";
import {
  createStringTranslationMethodFromLocale,
  createTranslationMethodFromLocale,
  getCatalogFromLocale,
} from "tools/i18n-utils";

describe("i18nContainer utils", () => {
  test("getCatalogFromLocale", () => {
    const result = getCatalogFromLocale("en-US");
    expect(result).toEqual(catalogs["en-US"].catalog);
  });

  test("createTranslationMethodFromLocale", () => {
    const tEnglish = createTranslationMethodFromLocale(
      catalogs["en-US"].catalog,
    );

    const text =
      "Voted “{{option}}” on governance proposal {{proposalId}}. Fees spent: {{fees}} ATOM.";
    const args = {
      proposalId: <b>5</b>,
      option: <b>Yes</b>,
      fees: <b>235531</b>,
    };

    const english = tEnglish(text, args);
    expect(english).toMatchSnapshot();
    const tGerman = createTranslationMethodFromLocale(catalogs.de.catalog);
    const german = tGerman(text, args);
    expect(german).toMatchSnapshot();
  });

  test("createStringTranslationMethodFromLocale", () => {
    const tEnglish = createStringTranslationMethodFromLocale(
      catalogs["en-US"].catalog,
    );

    const english = tEnglish("Delegate");
    expect(typeof english).toBe("string");
    const tGerman = createStringTranslationMethodFromLocale(
      catalogs.de.catalog,
    );

    const german = tGerman("Delegate");
    expect(typeof german).toBe("string");

    expect(() => {
      const text =
        "Voted “{{option}}” on governance proposal {{proposalId}}. Fees spent: {{fees}} ATOM.";
      const args = {
        proposalId: <b>5</b>,
        option: <b>Yes</b>,
        fees: <b>235531</b>,
      };

      tEnglish(text, args);
    }).toThrow();
  });

  test("all catalog translations have matching {{placeholder}} blocks", () => {
    Object.values(catalogs).forEach(({ catalog, locale }) => {
      Object.entries(catalog).forEach(([key, value]) => {
        const pattern = new RegExp(/\{\{(.*?)\}\}/g);
        const keyMatch = key.match(pattern);
        const valueMatch = value.match(pattern);

        /**
         * Fail if any keys do not include a translation message.
         */
        if (value.includes(TODO_IMPLEMENTATION_MSG)) {
          throw new Error(
            `- WARNING: Unimplemented translation values in ${locale} locale found for key: ${key}`,
          );
        }

        /**
         * Verify the number and name of the placeholder values match in the
         * key:value translation pair.
         */
        if (keyMatch && valueMatch) {
          if (keyMatch.length !== valueMatch.length) {
            throw new Error(
              `Different numbers of placeholders found in translation input: ${key}`,
            );
          }

          const keyMatchSet = new Set(keyMatch);

          for (const x of valueMatch) {
            if (!keyMatchSet.has(x)) {
              throw new Error(
                `No match for placeholder block ${x} in locale ${locale}`,
              );
            }
          }
        }
      });
    });
  });
});
