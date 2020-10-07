## Internationalization in Anthem

**NOTE:** Anthem partially supports internationalization, using the scheme explained in this README. The project currently has partially implemented translations, primarily for Cosmos, but less so for newer networks like Celo and Oasis. Generally, support for this became de-prioritized because of the implementation (translation) cost.

---

Anthem includes internationalized text versions, currently supporting Spanish, German, Korean, and Chinese (traditional and simplified). The language localization files exist in `client/src/i18n/catalogs` as JSON files which map the English source text to the localized translation of that text in the target language. The source definition for all of the localizations is the `client/src/i18n/english.ts` file, which exports a large union type of all the possible text values in the app. This allows the app to type check all text content and ensure that it has a matching source language key which maps to definition keys in the JSON translation files. This also supports interpolating dynamic values into a text string (with type-checking!), using this pattern:

```ts
// Applying this text in the app must include an address variable of type string:
["Address {{address}} copied to clipboard", { address: string }];
```

It's simply type safety for the internationalized translations.

However, in order to allow the app to continue to iterate features quickly, and to accommodate its largely English-speaking audience, and to deal with the slow bottleneck of manually translating text, the app allows for "untranslated" text to fallback to the English source definition. The internationalization logic exists in the `i18n-utils.tsx` file in the client package. The translation strategy is to accumulate text which requires a translation and then translate all such text in bulk at some point in time, rather than to block every feature change and edit which changes the text content of the app.

To update or change internationalized text in the app, the English source definition must be added or updated in the `english.ts` file. Then, the JSON translation files can all be automatically updated by running the command `yarn i18n`. This will update all of these JSON files to match the source file, and include `TODO` blocks for any unimplemented text, e.g.

```json
{
  "LOGIN": "登陆",
  "Connect": "<<< TODO: Implement >>>",
  "Earn": "收益"
}
```

These `TODO` lines can then be collected for each JSON file and sent off for manual translation, and then used to update the JSON translation files when the translations are complete.

Note that for the Chinese translation we are translating the app into simplified chinese, and then using a library to convert this into traditional characters, since this conversion is usually 1:1. This may not be perfect, but it should be good enough.
