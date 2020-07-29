import { NETWORKS } from "@anthem/utils";
import bech32 from "bech32";
import { FiatCurrency } from "constants/fiat";
import emailValidator from "email-validator";
import semver from "semver";
import { tFnString } from "tools/i18n-utils";
import {
  GenericNumberType,
  isGreaterThan,
  isLessThanOrEqualTo,
  valueToBigNumber,
} from "./math-utils";

/** ===========================================================================
 * Validation Utils
 * ============================================================================
 */

/**
 * Validate an email address.
 */
export const validateEmailAddress = (email: string) => {
  return emailValidator.validate(email);
};

/**
 * Validate a fiat currency from local storage.
 */
export const validateFiatCurrency = (fiat: FiatCurrency): boolean => {
  try {
    if (
      typeof fiat === "object" &&
      typeof fiat.name === "string" &&
      typeof fiat.symbol === "string"
    ) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

/**
 * Validates a currency setting from local storage.
 */
export const validateCurrencySetting = (setting: string): boolean => {
  return (
    typeof setting === "string" && (setting === "fiat" || setting === "crypto")
  );
};

/**
 * Validate the given Cosmos Ledger app version.
 */
export const validateLedgerAppVersion = (
  version: string,
  minimumRequiredVersion: string,
): boolean => {
  return (
    semver.eq(version, minimumRequiredVersion) ||
    semver.gt(version, minimumRequiredVersion)
  );
};

/**
 * Try to bech32 decode an address string to validate it as a Cosmos address.
 */
export const validateNetworkAddress = (
  address: string,
  currentAddress: string,
  tString: tFnString,
): string => {
  if (address === currentAddress) {
    return tString("This address is already connected.");
  } else if (!address) {
    return tString("Please enter a value.");
  }

  if (address.includes("valoper")) {
    return tString(
      "This appears to be a validator address. Please use the associated delegator address if you wish to view information on a validator.",
    );
  }

  /**
   * TODO: Improve Celo address validation.
   */
  if (address.substring(0, 2) === "0x" && address.length === 42) {
    return "";
  }

  /**
   * Polkadot address validation (?).
   */
  if (address.length === 47) {
    return "";
  }

  let prefixInAddress = false;
  for (const prefix of Object.values(NETWORKS).map(n => n.name.toLowerCase())) {
    if (address.includes(prefix)) {
      prefixInAddress = true;
    }
  }

  if (!prefixInAddress) {
    return tString("This network is not supported yet.");
  }

  try {
    bech32.decode(address);
    return "";
  } catch (err) {
    console.warn(`Bech32 decoding failed for address: ${address}`);
    return tString("This does not appear to be a valid address.");
  }
};

/**
 * Perform basic validation on a Cosmos address string.
 */
export const validateCosmosAddress = (address: string): boolean => {
  try {
    bech32.decode(address);
  } catch (err) {
    return false;
  }

  return true;
};

/**
 * Validate a ledger transaction amount.
 */
export const validateLedgerTransactionAmount = (
  amount: GenericNumberType,
  maxAmount: GenericNumberType,
  tString: tFnString,
): string => {
  if (amount === "" || !amount) {
    return tString("Please input an amount.");
  }

  const value = valueToBigNumber(amount);
  const max = valueToBigNumber(maxAmount);

  if (isGreaterThan(value, max)) {
    return tString("Final value is greater than the maximum available.");
  } else if (isLessThanOrEqualTo(value, 0)) {
    return tString("Final amount must be greater than zero.");
  } else {
    return "";
  }
};
