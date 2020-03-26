import BigNumber from "bignumber.js";

import {
  add,
  divide,
  GenericNumberType,
  isGreaterThan,
  isGreaterThanOrEqualTo,
  isLessThan,
  isLessThanOrEqualTo,
  multiply,
  subtract,
  toBigNumber,
  valueToBigNumber,
} from "tools/math-utils";

describe("math-utils", () => {
  test("toBigNumber", () => {
    let result = toBigNumber(5);
    expect(result instanceof BigNumber).toBeTruthy();
    expect(result.toString()).toBe("5");

    result = toBigNumber("5");
    expect(result instanceof BigNumber).toBeTruthy();
    expect(result.toString()).toBe("5");

    result = toBigNumber(new BigNumber(5));
    expect(result instanceof BigNumber).toBeTruthy();
    expect(result.toString()).toBe("5");
  });

  test("valueToBigNumber", () => {
    let result = valueToBigNumber(5);
    expect(result instanceof BigNumber).toBeTruthy();
    expect(result.toString()).toBe("5");

    result = valueToBigNumber("5");
    expect(result instanceof BigNumber).toBeTruthy();
    expect(result.toString()).toBe("5");

    result = valueToBigNumber(new BigNumber(5));
    expect(result instanceof BigNumber).toBeTruthy();
    expect(result.toString()).toBe("5");

    expect(() => {
      valueToBigNumber("sad8f7p0");
    }).toThrowError("Invalid number input received, original input: sad8f7p0");
  });

  test("add", () => {
    let result: GenericNumberType = add(5, 10, String);
    expect(result).toBe("15");

    result = add(5, 10, Number);
    expect(result).toBe(15);

    result = add(5, 10, toBigNumber);
    expect(result.toString()).toBe(toBigNumber(15).toString());
  });

  test("subtract", () => {
    let result: GenericNumberType = subtract(5, 10, String);
    expect(result).toBe("-5");

    result = subtract(5, 10, Number);
    expect(result).toBe(-5);

    result = subtract(5, 10, toBigNumber);
    expect(result.toString()).toBe(toBigNumber(-5).toString());
  });

  test("multiply", () => {
    let result: GenericNumberType = multiply(5, 10, String);
    expect(result).toBe("50");

    result = multiply(5, 10, Number);
    expect(result).toBe(50);

    result = multiply(5, 10, toBigNumber);
    expect(result.toString()).toBe(toBigNumber(50).toString());
  });

  test("divide", () => {
    let result: GenericNumberType = divide(5, 10, String);
    expect(result).toBe("0.5");

    result = divide(5, 10, Number);
    expect(result).toBe(0.5);

    result = divide(5, 10, toBigNumber);
    expect(result.toString()).toBe(toBigNumber(0.5).toString());
  });

  test("isGreaterThan", () => {
    let result = isGreaterThan(50, 10);
    expect(result).toBeTruthy();

    result = isGreaterThan(5, 10);
    expect(result).toBeFalsy();
  });

  test("isGreaterThanOrEqualTo", () => {
    let result = isGreaterThanOrEqualTo(50, 50);
    expect(result).toBeTruthy();

    result = isGreaterThanOrEqualTo(50, 10);
    expect(result).toBeTruthy();

    result = isGreaterThanOrEqualTo(5, 10);
    expect(result).toBeFalsy();
  });

  test("isLessThan", () => {
    let result = isLessThan(5, 10);
    expect(result).toBeTruthy();

    result = isLessThan(50, 10);
    expect(result).toBeFalsy();
  });

  test("isLessThanOrEqualTo", () => {
    let result = isLessThanOrEqualTo(50, 50);
    expect(result).toBeTruthy();

    result = isLessThanOrEqualTo(5, 10);
    expect(result).toBeTruthy();

    result = isLessThanOrEqualTo(50, 10);
    expect(result).toBeFalsy();
  });
});
