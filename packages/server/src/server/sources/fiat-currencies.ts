/** ===========================================================================
 * Fiat Currencies
 * ----------------------------------------------------------------------------
 * Hard-coded list of fiat currencies Anthem supports.
 * ============================================================================
 */

export interface FiatCurrency {
  symbol: string;
  name: string;
}

const FIAT_CURRENCIES: FiatCurrency[] = [
  {
    symbol: "USD",
    name: "US Dollar",
  },
  {
    symbol: "CNY",
    name: "Chinese Yuan",
  },
  {
    symbol: "EUR",
    name: "Euro",
  },
  {
    symbol: "JPY",
    name: "Japanese Yen",
  },
  {
    symbol: "GBP",
    name: "British Pound",
  },
  {
    symbol: "KRW",
    name: "Korean Won",
  },
  {
    symbol: "INR",
    name: "Indian Rupee",
  },
  {
    symbol: "CAD",
    name: "Canadian Dollar",
  },
  {
    symbol: "HKD",
    name: "Hong Kong Dollar",
  },
  {
    symbol: "BRL",
    name: "Brazilian Real",
  },
  {
    symbol: "AUD",
    name: "Australian Dollar",
  },
  {
    symbol: "TWD",
    name: "Taiwan New Dollar",
  },
  {
    symbol: "CHF",
    name: "Swiss Franc",
  },
  {
    symbol: "RUB",
    name: "Russian Ruble",
  },
  {
    symbol: "THB",
    name: "Thai Baht",
  },
  {
    symbol: "MXN",
    name: "Mexican Peso",
  },
  {
    symbol: "SGD",
    name: "Singapore Dollar",
  },
  {
    symbol: "IDR",
    name: "Indonesian Rupiah",
  },
  {
    symbol: "TRY",
    name: "Turkish Lira",
  },
  {
    symbol: "VND",
    name: "Vietnamese Dong",
  },
  {
    symbol: "SEK",
    name: "Swedish Krona",
  },
  {
    symbol: "NOK",
    name: "Norwegian Krone",
  },
  {
    symbol: "ZAR",
    name: "South African Rand",
  },
  {
    symbol: "PHP",
    name: "Philippine Peso",
  },
  {
    symbol: "DKK",
    name: "Danish Krone",
  },
  {
    symbol: "NZD",
    name: "New Zealand Dollar",
  },
];

const DEFAULT_FIAT_CURRENCY = FIAT_CURRENCIES[0];

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default FIAT_CURRENCIES;

export { DEFAULT_FIAT_CURRENCY };
