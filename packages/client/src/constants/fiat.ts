/** ===========================================================================
 * Fiat Currencies
 * ============================================================================
 */

export interface FiatCurrency {
  symbol: string;
  name: string;
}

export const DEFAULT_FIAT_CURRENCY = {
  symbol: "USD",
  name: "US Dollar",
};

export type CURRENCY_SETTING = "fiat" | "crypto";

export const DEFAULT_CURRENCY_SETTING: CURRENCY_SETTING = "fiat";
