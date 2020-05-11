import { ENGLISH } from "i18n/english";
import { tFn } from "tools/i18n-utils";

/** ===========================================================================
 * Test Utils
 * ----------------------------------------------------------------------------
 * Some helper test utils.
 * ============================================================================
 */

const mockT = (s: string, vars: { [key: string]: any }) => [s, vars];
const t = (mockT as unknown) as tFn;
const tString = (...text: ENGLISH) => String(text);

// Mock i18n props to be used for tests
export const MOCK_I18N = {
  t,
  tString,
};
