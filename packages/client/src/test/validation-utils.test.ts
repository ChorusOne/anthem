import { ENGLISH } from "i18n/english";
import {
  validateCurrencySetting,
  validateFiatCurrency,
  validateLedgerAppVersion,
  validateLedgerTransactionAmount,
  validateNetworkAddress,
} from "tools/validation-utils";

describe("validation-utils", () => {
  test("validateFiatCurrency", () => {
    let result = validateFiatCurrency({
      name: "US Dollar",
      symbol: "USD",
    });
    expect(result).toBeTruthy();

    // @ts-ignore
    result = validateFiatCurrency({
      symbol: "USD",
    });
    expect(result).toBeFalsy();
  });

  test("validateCurrencySetting", () => {
    let result = validateCurrencySetting("crypto");
    expect(result).toBeTruthy();

    result = validateCurrencySetting("fiat");
    expect(result).toBeTruthy();

    result = validateCurrencySetting("blah");
    expect(result).toBeFalsy();

    result = validateCurrencySetting("x");
    expect(result).toBeFalsy();
  });

  test("validateCosmosAddress", () => {
    let result = validateLedgerAppVersion("1.1.1", "1.1.1");
    expect(result).toBeTruthy();

    result = validateLedgerAppVersion("1.1.2", "1.1.1");
    expect(result).toBeTruthy();

    result = validateLedgerAppVersion("1.5.3", "1.1.1");
    expect(result).toBeTruthy();

    result = validateLedgerAppVersion("0.1.2", "1.1.1");
    expect(result).toBeFalsy();

    result = validateLedgerAppVersion("1.0.9", "1.1.1");
    expect(result).toBeFalsy();
  });

  test("validateCosmosAddress", () => {
    console.warn = () => null;
    const tString = (...text: ENGLISH) => String(text);
    const address = "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg";
    expect(validateNetworkAddress("", address, tString)).toBeTruthy();

    expect(validateNetworkAddress("apsdiuf", address, tString)).toBeTruthy();

    expect(
      validateNetworkAddress("apsdiasfd870asd0f97a0suf", address, tString),
    ).toBeTruthy();

    expect(
      validateNetworkAddress(
        "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg",
        address,
        tString,
      ),
    ).toBeTruthy();

    expect(
      validateNetworkAddress(
        "cosmos16nte2qf5l0u39s86wcwu4fff4vdtvg7yn3uksu",
        address,
        tString,
      ),
    ).toBeFalsy();

    expect(
      validateNetworkAddress(
        "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
        address,
        tString,
      ),
    ).toBeFalsy();
  });

  test("validateLedgerTransactionAmount", () => {
    const tString = (...text: ENGLISH) => String(text);
    let result = validateLedgerTransactionAmount("500", "5000", tString);
    expect(result).toBe("");

    result = validateLedgerTransactionAmount("500", "50", tString);
    expect(result).toBe("Final value is greater than the maximum available.");

    result = validateLedgerTransactionAmount("-500", "50", tString);
    expect(result).toBe("Final amount must be greater than zero.");
  });
});
