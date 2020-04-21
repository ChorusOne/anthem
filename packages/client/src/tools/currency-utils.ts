import { ICoin, IQuery } from "@anthem/utils";
import BigNumber from "bignumber.js";
import { trimZeroes } from "./generic-utils";
import {
  divide,
  GenericNumberType,
  isGreaterThanOrEqualTo,
  multiply,
  subtract,
  toBigNumber,
  valueToBigNumber,
} from "./math-utils";

/**
 * Get a token formatter for the number.
 */
const getTokenFormatter = (maximumFractionDigits: number = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  });
};

/**
 * Convert and format a Cosmos coin denomination into a human readable
 * format.
 */
export const formatCurrencyAmount = (
  amount: GenericNumberType,
  maximumFractionDigits?: number,
): string => {
  const value = valueToBigNumber(amount);

  if (value.isZero()) {
    return "0";
  } else if (value.isLessThanOrEqualTo(0.001)) {
    // Remove this case if people don't like it!
    const tokenFormatter = getTokenFormatter(6);
    return tokenFormatter.format(Number(amount));
  } else if (
    isGreaterThanOrEqualTo(value, 1) ||
    maximumFractionDigits !== undefined
  ) {
    const tokenFormatter = getTokenFormatter(maximumFractionDigits);
    return tokenFormatter.format(Number(amount));
  } else {
    const result = value.toFormat(10);
    return trimZeroes(result);
  }
};

/**
 * Find a currency from the currency list. This can be used to get the
 * coin data for the prices query.
 */
export const findCurrencyFromCoinsList = (
  denom: string,
  coins: IQuery["coins"],
): ICoin => {
  const defaultCoin = {
    id: "",
    symbol: "",
    name: "",
  };

  if (!coins) {
    return defaultCoin;
  }

  const currencySymbol = denom.slice(1);
  const coin = coins.find((c: ICoin) => c.symbol === currencySymbol);

  return coin ? coin : defaultCoin;
};

interface CurrencyConversionMethodTypes {
  (amount: GenericNumberType, targetConstructorFn?: typeof String): string;
  (amount: GenericNumberType, targetConstructorFn: typeof Number): number;
  (
    amount: GenericNumberType,
    targetConstructorFn: typeof toBigNumber,
  ): BigNumber;
}

/**
 * Convert an ATOM denomination to the normal ATOM amount.
 */
export const denomToAtoms: CurrencyConversionMethodTypes = (
  denoms: any,
  targetConstructorFn: any = String,
) => {
  const amount = valueToBigNumber(denoms);
  const result = divide(amount, 1e6);
  return targetConstructorFn(result);
};

/**
 * Convert an ATOM amount back to the raw ATOM denomination.
 */
export const atomsToDenom: CurrencyConversionMethodTypes = (
  amount: any,
  targetConstructorFn: any = String,
) => {
  const value = valueToBigNumber(amount);
  const result = multiply(value, 1e6);
  return targetConstructorFn(result);
};

/**
 * Convert raw ATOMs amount to fiat price given the exchange rate.
 */
export const convertAtomsToFiat = (
  priceQuery: IQuery["prices"] | undefined,
  denom: string | BigNumber,
): string => {
  const amount = valueToBigNumber(denom);
  if (priceQuery) {
    const { price } = priceQuery;
    if (price) {
      const atoms = denomToAtoms(amount);
      const fiat = multiply(atoms, price);
      return fiat;
    }
  }

  return "";
};

/**
 * Determine the maximum possible transaction value after fees.
 */
export const calculateTransactionAmount = (
  availableInput: string,
  gasPriceInput: string,
  gasAmountInput: string,
): string => {
  const [available, gasPrice, gasAmount] = [
    availableInput,
    gasPriceInput,
    gasAmountInput,
  ].map(valueToBigNumber);

  const fee = multiply(gasPrice, gasAmount);
  const denoms = atomsToDenom(available, toBigNumber);
  const availableAmountDenom = subtract(denoms, fee);
  const availableAmount = denomToAtoms(availableAmountDenom);

  return availableAmount;
};
