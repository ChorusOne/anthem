import { assertUnreachable, NETWORK_NAME } from "@anthem/utils";
import * as bech32 from "bech32";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as HEX from "crypto-js/enc-hex";
import * as RIPEMD160 from "crypto-js/ripemd160";
import * as SHA256 from "crypto-js/sha256";
import * as secp256k1 from "secp256k1";

/** ===========================================================================
 * NOTE: This code is largely modified from here:
 * - https://www.npmjs.com/package/@terra-money/core
 * ============================================================================
 */

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface KeyPair {
  privateKey: Buffer;
  publicKey: Buffer;
}

interface Prefixes {
  accountPrefix: string;
  validatorPrefix: string;
}

/** ===========================================================================
 * Utils
 * ============================================================================
 */

const networkToPrefix = (network: NETWORK_NAME): Prefixes => {
  switch (network) {
    case "COSMOS":
      return {
        accountPrefix: "cosmos",
        validatorPrefix: "cosmosvaloper",
      };
    case "TERRA":
      return {
        accountPrefix: "terra",
        validatorPrefix: "terravaloper",
      };
    case "KAVA":
      return {
        accountPrefix: "kava",
        validatorPrefix: "kavavaloper",
      };
    case "OASIS":
      console.warn("[TODO]: Implement Oasis address prefixes!");
      return {
        accountPrefix: "oasis",
        validatorPrefix: "oasis",
      };
    case "CELO":
      console.warn("[TODO]: Implement Celo address prefixes!");
      return {
        accountPrefix: "celo",
        validatorPrefix: "celo",
      };
    case "POLKADOT":
      console.warn("[TODO]: Implement Polkadot address prefixes!");
      return {
        accountPrefix: "polkadot",
        validatorPrefix: "polkadot",
      };
    default:
      return assertUnreachable(network);
  }
};

export const deriveMasterKey = async (mnemonic: string): Promise<any> => {
  // throws if mnemonic is invalid
  bip39.validateMnemonic(mnemonic);

  const seed = await bip39.mnemonicToSeed(mnemonic);
  return bip32.fromSeed(seed);
};

export const deriveKeypair = (
  masterKey: any,
  account: number = 0,
  index: number = 0,
): KeyPair => {
  const hdPathLuna = `m/44'/330'/${account}'/0/${index}`;
  const terraHD = masterKey.derivePath(hdPathLuna);
  const privateKey = terraHD.privateKey;
  const publicKey = secp256k1.publicKeyCreate(privateKey, true);

  if (!privateKey) {
    throw new Error("Failed to derive key pair");
  }

  return {
    privateKey,
    publicKey,
  };
};

/**
 * NOTE: this only works with a compressed public key (33 bytes)
 */
const getAddress = (publicKey: Buffer): Buffer => {
  const message = HEX.parse(publicKey.toString(`hex`));
  const hash = RIPEMD160(SHA256(message)).toString();
  const address = Buffer.from(hash, `hex`);
  return bech32.toWords(address);
};

/**
 * NOTE: this only works with a compressed public key (33 bytes)
 */
export const getAccAddress = (
  publicKey: Buffer,
  network: NETWORK_NAME,
): string => {
  const { accountPrefix } = networkToPrefix(network);
  const words = getAddress(publicKey);
  return bech32.encode(accountPrefix, words);
};

/**
 * NOTE: this only works with a compressed public key (33 bytes)
 */
export const getValAddress = (
  publicKey: Buffer,
  network: NETWORK_NAME,
): string => {
  const { validatorPrefix } = networkToPrefix(network);
  const words = getAddress(publicKey);
  return bech32.encode(validatorPrefix, words);
};

export const convertValAddressToAccAddress = (
  address: string,
  network: NETWORK_NAME,
): string => {
  const { accountPrefix } = networkToPrefix(network);
  const { words } = bech32.decode(address);
  return bech32.encode(accountPrefix, words);
};

export const convertAccAddressToValAddress = (
  address: string,
  network: NETWORK_NAME,
): string => {
  const { validatorPrefix } = networkToPrefix(network);
  const { words } = bech32.decode(address);
  return bech32.encode(validatorPrefix, words);
};

export const generateMnemonic = (): string => {
  return bip39.generateMnemonic(256);
};
