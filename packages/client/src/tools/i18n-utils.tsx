import {
  catalogs,
  DEFAULT_LOCALE,
  ICatalog,
  ILocale,
  TODO_IMPLEMENTATION_MSG,
} from "i18n/catalog";
import { ENGLISH } from "i18n/english";
import ENV from "lib/client-env";
import React from "react";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export type tFn = (...text: ENGLISH) => ReadonlyArray<JSX.Element>;
export type tFnString = (...text: ENGLISH) => string;
export type tReturnType = ReadonlyArray<JSX.Element> | string;

export interface TranslateMethodProps {
  t: tFn;
  tString: tFnString;
}

interface I18nTranslateProps extends TranslateMethodProps {
  locale: ILocale;
}

export interface I18nProps {
  i18n: I18nTranslateProps;
  setLocale: (locale: ILocale) => void;
}

/** ===========================================================================
 * Utils
 * ============================================================================
 */

/**
 * Get a catalog given a locale if it exists, otherwise return the default
 * locale.
 */
export const getCatalogFromLocale = (locale: ILocale): ICatalog => {
  if (locale in catalogs) {
    return catalogs[locale].catalog;
  }

  return catalogs[DEFAULT_LOCALE].catalog;
};

const INTERPOLATION_PATTERN = new RegExp(/\{\{(.*?)\}\}/g);

/**
 * Helper to parse the i18n input.
 */
const parseCatalogInput = (input: ENGLISH, catalog: ICatalog) => {
  const [t, ...rest] = input;
  const variables = rest[0];

  if (!(t in catalog)) {
    if (ENV.DEVELOPMENT) {
      throw new Error(`No match for i18n text input: ${t}`);
    } else {
      // In production allow fallback to the English key.
      const text = t.split(INTERPOLATION_PATTERN);
      return {
        text,
        variables,
      };
    }
  }

  const value = catalog[t];

  if (value === TODO_IMPLEMENTATION_MSG) {
    /**
     * This shouldn't happen but if it does just fallback to the original
     * English string value.
     */
    const text = t.split(INTERPOLATION_PATTERN);
    return { text, variables };
  } else {
    const text = value.split(INTERPOLATION_PATTERN);
    return { text, variables };
  }
};

/**
 * This methods returns a translation method given a locale which interpolates
 * translations values for text internationalization.
 */
export const createTranslationMethodFromLocale = (catalog: ICatalog) => (
  ...input: ENGLISH
): ReadonlyArray<JSX.Element> => {
  const { text, variables } = parseCatalogInput(input, catalog);

  return text.filter(Boolean).map((match: string, index: number) => {
    let interpolated;
    if (variables && match in variables) {
      // index key check occurs on the line above
      interpolated = variables[match as keyof ENGLISH[1]];
    } else {
      interpolated = match;
    }

    return <span key={index}>{interpolated}</span>;
  });
};

/**
 * The same method as above but this method explicitly returns a string. This
 * is to make it easier to use the i18n-utils for components where the
 * translated text must be a string value. This method will throw an error
 * if it receives a dynamic non-string value for an interpolated variable.
 */
export const createStringTranslationMethodFromLocale = (catalog: ICatalog) => (
  ...input: ENGLISH
): string => {
  const { text, variables } = parseCatalogInput(input, catalog);

  return text
    .filter(Boolean)
    .map((match: string) => {
      let interpolated;
      if (variables && match in variables) {
        // index key check occurs on the line above
        interpolated = variables[match as keyof ENGLISH[1]];
      } else {
        interpolated = match;
      }

      if (typeof interpolated !== "string") {
        throw new Error(
          `Trying to interpolate non-string value in tString function, value: ${interpolated}`,
        );
      }

      return interpolated;
    })
    .reduce((str, itr) => str + itr, "");
};

/**
 * Helper to wrap some text string in bold attributes.
 */
export const bold = (s: string): JSX.Element => <b>{s}</b>;
