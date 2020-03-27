import bech32 from "bech32";
import emailValidator from "email-validator";
import semver from "semver";

import { FiatCurrency } from "constants/fiat";
import { AVAILABLE_NETWORKS } from "constants/networks";
import ENV from "lib/client-env";
import { tFnString } from "tools/i18n-utils";
import {
  GenericNumberType,
  isGreaterThan,
  isLessThanOrEqualTo,
  valueToBigNumber,
} from "./math-utils";

/**
 * Validate an email address.
 *
 * @param  {string} email
 */
export const validateEmailAddress = (email: string) => {
  return emailValidator.validate(email);
};

/**
 * Validate a fiat currency from local storage.
 *
 * @param  {FiatCurrency} fiat
 * @returns boolean
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
 *
 * @param  {string} setting
 * @returns boolean
 */
export const validateCurrencySetting = (setting: string): boolean => {
  return (
    typeof setting === "string" && (setting === "fiat" || setting === "crypto")
  );
};

/**
 * Validate the given Cosmos Ledger app version. Minimum version required is
 * v1.1.1.
 *
 * @param  {string} version
 * @returns boolean
 */
export const validateCosmosAppVersion = (version: string): boolean => {
  const MINIMUM_COSMOS_VERSION = "1.1.1";
  return (
    semver.eq(version, MINIMUM_COSMOS_VERSION) ||
    semver.gt(version, MINIMUM_COSMOS_VERSION)
  );
};

/**
 * Try to bech32 decode an address string to validate it as a Cosmos address.
 */
export const validateCosmosAddress = (
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

  if (address.length === 44) {
    console.warn("[TODO]: Fix address validation for Oasis addresses!");
    return ENV.ENABLE_OASIS ? "" : "Oasis Network is not supported yet";
  }

  let prefixInAddress = false;
  for (const prefix of AVAILABLE_NETWORKS.map(n => n.name.toLowerCase())) {
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
 * Validate a ledger transaction amount.
 *
 * @param  {GenericNumberType} amount
 * @param  {GenericNumberType} maxAmount
 * @returns string
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
