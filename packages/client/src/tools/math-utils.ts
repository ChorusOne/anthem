import BigNumber from "bignumber.js";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

/**
 * Constructor helper for the bignumber library constructor.
 */
export const toBigNumber = (x: any) => new BigNumber(x);

/**
 * Determine if any value is `NaN`.
 */
export const valueIsNaN = (value: GenericNumberType) => {
  return toBigNumber(value).isNaN();
};

/**
 * Generic number type.
 */
export type GenericNumberType = string | number | BigNumber;

/**
 * Method overrides for the generic math functions in this file.
 */
interface MathMethodSignatures {
  (
    a: GenericNumberType,
    b: GenericNumberType,
    targetConstructorFn?: typeof String,
  ): string;
  (
    a: GenericNumberType,
    b: GenericNumberType,
    targetConstructorFn: typeof Number,
  ): number;
  (
    a: GenericNumberType,
    b: GenericNumberType,
    targetConstructorFn: typeof toBigNumber,
  ): BigNumber;
}

interface AddListSignatures {
  (
    values: ReadonlyArray<GenericNumberType>,
    targetConstructorFn?: typeof String,
  ): string;
  (
    values: ReadonlyArray<GenericNumberType>,
    targetConstructorFn: typeof Number,
  ): number;
  (
    values: ReadonlyArray<GenericNumberType>,
    targetConstructorFn: typeof toBigNumber,
  ): BigNumber;
}

type ComparatorMethodSignature = (
  a: GenericNumberType,
  b: GenericNumberType,
) => boolean;

type ExecutionMethod = (a: BigNumber, b: BigNumber) => BigNumber;
type ComparatorMethod = (a: BigNumber, b: BigNumber) => boolean;

/** ===========================================================================
 * Math Utils
 * ----------------------------------------------------------------------------
 * This file contains some helper utils to perform basic math operations on
 * values. Values in the application may be in various formats depending on
 * the data source and other factors (e.g. returned from some other function),
 * so this file provides some generic helpers which can accept flexibly typed
 * arguments, perform basic math, and then return specific return types based
 * on the consumer's needs.
 * ============================================================================
 */

/**
 * Accept various inputs but always convert to `BigNumber`, of fails.
 */
export const valueToBigNumber = (i: GenericNumberType): BigNumber => {
  try {
    let input = i;

    if (typeof i === "string") {
      input = i.replace(/,/g, "");
    }

    /**
     * Try to convert any input value to the BigNumber constructor. If this
     * fails or if the result is NaN, throw an error. Otherwise return the
     * BigNumber.
     */
    const result = new BigNumber(input);

    if (result.isNaN()) {
      throw new Error(`Invalid number input received, original input: ${i}`);
    }

    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Helper which creates and evaluates a regular math method.
 */
const createMathMethod = (fn: ExecutionMethod) => {
  return (a: any, b: any, targetConstructor: any = String) => {
    const firstArgument = toBigNumber(a);
    const secondArgument = toBigNumber(b);

    const result = fn(firstArgument, secondArgument).toString();
    return targetConstructor(result);
  };
};

/**
 * Helper which creates and evaluates a comparator method.
 */
const createComparatorMethod = (
  comparator: ComparatorMethod,
): ComparatorMethodSignature => {
  return (a: any, b: any) => {
    const firstArgument = toBigNumber(a);
    const secondArgument = toBigNumber(b);

    const result = comparator(firstArgument, secondArgument);
    return result;
  };
};

/**
 * Add two numbers: e.g. a + b
 */
export const add: MathMethodSignatures = createMathMethod(
  (a: BigNumber, b: BigNumber) => a.plus(b),
);

/**
 * Add two numbers: e.g. a - b
 */
export const subtract: MathMethodSignatures = createMathMethod(
  (a: BigNumber, b: BigNumber) => a.minus(b),
);

/**
 * Multiply two numbers: e.g. a * b
 */
export const multiply: MathMethodSignatures = createMathMethod(
  (a: BigNumber, b: BigNumber) => a.times(b),
);

/**
 * Multiply two numbers: e.g. a / b
 */
export const divide: MathMethodSignatures = createMathMethod(
  (a: BigNumber, b: BigNumber) => a.dividedBy(b),
);

/**
 * Compare two numbers: e.g. a > b
 */
export const isGreaterThan: ComparatorMethodSignature = createComparatorMethod(
  (a: BigNumber, b: BigNumber) => a.isGreaterThan(b),
);

/**
 * Compare two numbers: e.g. a >= b
 */
export const isGreaterThanOrEqualTo: ComparatorMethodSignature = createComparatorMethod(
  (a: BigNumber, b: BigNumber) => a.isGreaterThanOrEqualTo(b),
);

/**
 * Compare two numbers: e.g. a < b
 */
export const isLessThan: ComparatorMethodSignature = createComparatorMethod(
  (a: BigNumber, b: BigNumber) => a.isLessThan(b),
);

/**
 * Compare two numbers: e.g. a <= b
 */
export const isLessThanOrEqualTo: ComparatorMethodSignature = createComparatorMethod(
  (a: BigNumber, b: BigNumber) => a.isLessThanOrEqualTo(b),
);

/**
 * Compare equality of two numbers: e.g. a <= b
 */
export const isEqual: ComparatorMethodSignature = createComparatorMethod(
  (a: BigNumber, b: BigNumber) => a.isEqualTo(b),
);

/** ===========================================================================
 * Higher Order Methods
 * ============================================================================
 */

/**
 * Add a list of values.
 */
export const addValuesInList: AddListSignatures = (
  values: any,
  targetConstructor: any = String,
) => {
  const convertValues = values.map(toBigNumber);

  const result = convertValues.reduce((sum: any, value: any) => {
    return add(sum, value);
  }, toBigNumber(0));

  return targetConstructor(result);
};
