import { NetworkDefinition } from "@anthem/utils";
import BigNumber from "bignumber.js";
import { trimZeroes } from "./client-utils";
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

interface CurrencyConversionMethodTypes {
  (
    amount: GenericNumberType,
    denomSize: GenericNumberType,
    targetConstructorFn?: typeof String,
  ): string;
  (
    amount: GenericNumberType,
    denomSize: GenericNumberType,
    targetConstructorFn: typeof Number,
  ): number;
  (
    amount: GenericNumberType,
    denomSize: GenericNumberType,
    targetConstructorFn: typeof toBigNumber,
  ): BigNumber;
}

/**
 * Convert a denomination to the normal network display amount.
 */
export const denomToUnit: CurrencyConversionMethodTypes = (
  denoms: GenericNumberType,
  networkDenominationSize: GenericNumberType,
  targetConstructorFn: any = String,
) => {
  const amount = valueToBigNumber(denoms);
  const result = divide(amount, networkDenominationSize);
  return targetConstructorFn(result);
};

/**
 * Convert a network display amount back to the network denomination amount.
 */
export const unitToDenom: CurrencyConversionMethodTypes = (
  amount: GenericNumberType,
  networkDenominationSize: GenericNumberType,
  targetConstructorFn: any = String,
) => {
  const value = valueToBigNumber(amount);
  const result = multiply(value, networkDenominationSize);
  return targetConstructorFn(result);
};

/**
 * Convert a network currency amount to fiat price given the network
 * exchange rate.
 */
export const convertCryptoToFiat = (
  price: number,
  denom: string | BigNumber,
  network: NetworkDefinition,
): string => {
  const amount = valueToBigNumber(denom);
  if (price) {
    const atoms = denomToUnit(amount, network.denominationSize);
    const fiat = multiply(atoms, price);
    return fiat;
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
  network: NetworkDefinition,
): string => {
  const [available, gasPrice, gasAmount] = [
    availableInput,
    gasPriceInput,
    gasAmountInput,
  ].map(valueToBigNumber);

  const fee = multiply(gasPrice, gasAmount);
  const denoms = unitToDenom(available, network.denominationSize, toBigNumber);
  const availableAmountDenom = subtract(denoms, fee);
  const availableAmount = denomToUnit(
    availableAmountDenom,
    network.denominationSize,
  );

  return availableAmount;
};

interface RenderCurrencyArgs {
  value: string;
  denomSize: number;
  fiatPrice: number;
  convertToFiat?: boolean;
}

// Helper to render Celo currency values
export const renderCeloCurrency = (args: RenderCurrencyArgs) => {
  const { value, denomSize, fiatPrice, convertToFiat } = args;
  let result = denomToUnit(value, denomSize, toBigNumber);
  if (convertToFiat) {
    result = multiply(fiatPrice, result, toBigNumber);
  }

  return result.toFixed();
};
