/** ===========================================================================
 * Fiat Currencies
 * ----------------------------------------------------------------------------
 * Hard-coded list of fiat currencies Anthem supports.
 * ============================================================================
 */

export interface FiatCurrency {
  letter: string;
  symbol: string;
  name: string;
}

const FIAT_CURRENCIES: FiatCurrency[] = [
  {
    letter: "$",
    symbol: "USD",
    name: "US Dollar",
  },
  {
    letter: "¥",
    symbol: "CNY",
    name: "Chinese Yuan",
  },
  {
    letter: "€",
    symbol: "EUR",
    name: "Euro",
  },
  {
    letter: "¥",
    symbol: "JPY",
    name: "Japanese Yen",
  },
  {
    letter: "£",
    symbol: "GBP",
    name: "British Pound",
  },
  {
    letter: "₩",
    symbol: "KRW",
    name: "Korean Won",
  },
  {
    letter: "₹",
    symbol: "INR",
    name: "Indian Rupee",
  },
  {
    letter: "$",
    symbol: "CAD",
    name: "Canadian Dollar",
  },
  {
    letter: "$",
    symbol: "HKD",
    name: "Hong Kong Dollar",
  },
  {
    letter: "R$",
    symbol: "BRL",
    name: "Brazilian Real",
  },
  {
    letter: "$",
    symbol: "AUD",
    name: "Australian Dollar",
  },
  {
    letter: "NT$",
    symbol: "TWD",
    name: "Taiwan New Dollar",
  },
  {
    letter: "Fr.",
    symbol: "CHF",
    name: "Swiss Franc",
  },
  {
    letter: "₽",
    symbol: "RUB",
    name: "Russian Ruble",
  },
  {
    letter: "฿",
    symbol: "THB",
    name: "Thai Baht",
  },
  {
    letter: "$",
    symbol: "MXN",
    name: "Mexican Peso",
  },
  {
    letter: "$",
    symbol: "SGD",
    name: "Singapore Dollar",
  },
  {
    letter: "Rp",
    symbol: "IDR",
    name: "Indonesian Rupiah",
  },
  {
    letter: "₺",
    symbol: "TRY",
    name: "Turkish Lira",
  },
  {
    letter: "₫",
    symbol: "VND",
    name: "Vietnamese Dong",
  },
  {
    letter: "kr",
    symbol: "SEK",
    name: "Swedish Krona",
  },
  {
    letter: "kr",
    symbol: "NOK",
    name: "Norwegian Krone",
  },
  {
    letter: "R",
    symbol: "ZAR",
    name: "South African Rand",
  },
  {
    letter: "₱",
    symbol: "PHP",
    name: "Philippine Peso",
  },
  {
    letter: "kr",
    symbol: "DKK",
    name: "Danish Krone",
  },
  {
    letter: "$",
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
