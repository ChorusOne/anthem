import { wait } from "@anthem/utils";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import OasisApp from "@oasisprotocol/ledger";
import bech32 from "bech32";
import BN from "bn.js";
import cbor from "cbor";
import { LEDGER_ERRORS } from "constants/ledger-errors";
import broadcastTransactionModule from "lib/blockchain-lib";
import ENV from "tools/client-env";

/** ===========================================================================
 * Oasis Ledger Utils
 * ---------------------------------------------------------------------------
 * Docs: https://github.com/Zondax/ledger-oasis-js
 * Example App: https://github.com/Zondax/ledger-oasis-js/blob/master/vue_example/components/LedgerExample.vue
 * Oasis RunKit Example: https://runkit.com/embed/jhwmrma4tdfb
 *
 * Reference Steps from Slack Discussion:
 *
 * 1. Produce test vectors from oasis via GO command.
 * 2. Translate vector examples into JSON blobs to create the txs we need
 * 3. We encode the fields that require encoding (anything bignum or address).
 * 4. We encode this via canonical CBOR, example in the paste provided by Jernej.
 * 5. We send this to be signed by the ledger by calling sign(path, context,
 *    bytes) Context is constructed by figuring out which module the tx is
 *    from, and looks like: oasis-core/<module>:whatever we want to write here.
 * 6: Wrap up the transaction and its signature in an envelope.
 * 7. CBOR encode THAT json.
 * 8. Submit to network.
 * ---------------------------------------------------------------------------
 * * TODO:
 *
 * - How to determine transaction nonce?
 * - How to determine transaction gas fees/do users specify?
 * - Transaction body data for delegation transactions?
 * - Implement broadcastTransaction method
 * - Determine if encoding/signing steps are correct or not
 * - Update dubious 'any' types
 * - Obtain ROSE tokens
 * - Test transaction workflows
 * - Add support for redelegate transaction in the app (not supported yet)
 * ============================================================================
 */

// Duplicated from oasis server code which parses transactions, removing
// irrelevant transaction methods.
enum OasisTransactionMethod {
  TRANSFER = "staking.Transfer",
  ADD_ESCROW = "staking.AddEscrow",
  RECLAIM_ESCROW = "staking.ReclaimEscrow",
  TAKE_ESCROW = "staking.TakeEscrow",
}

interface OasisTransactionPayload {
  nonce: number;
  fee: {
    gas: number;
    amount: Buffer;
  };
  method: OasisTransactionMethod;
  body: any;
}

export interface IOasisTransactionReceipt {
  height: number;
  hash: string;
}

export interface OasisTransferArgs {
  from: string;
  to: string;
  amount: string;
}

export interface OasisDelegateArgs {
  delegator: string;
  validator: string;
  amount: string;
}

export interface OasisUndelegateArgs {
  delegator: string;
  validator: string;
  amount: string;
}

export interface OasisRedelegateArgs {
  delegator: string;
  new_validator: string;
  current_validator: string;
  amount: string;
}

interface IOasisLedger {
  connect(): Promise<void>;
  disconnect(): void;
  getAddress(): Promise<string>;
  getVersion(): Promise<string>;
  getPublicKey(): Promise<string>;
  encodeAndSignTransaction(tx: OasisTransactionPayload): Promise<any>;
  broadcastTransaction(signedTx: any): Promise<IOasisTransactionReceipt>;
  transfer(args: OasisTransferArgs): Promise<IOasisTransactionReceipt>;
  delegate(args: OasisDelegateArgs): Promise<IOasisTransactionReceipt>;
  undelegate(args: OasisUndelegateArgs): Promise<IOasisTransactionReceipt>;
  redelegate(args: OasisRedelegateArgs): Promise<IOasisTransactionReceipt>;
}

/** ===========================================================================
 * Oasis Ledger Class
 * ============================================================================
 */

class OasisLedgerClass implements IOasisLedger {
  private app: Nullable<any> = null;
  private readonly path = [44, 474, 0, 0, 0];

  async connect() {
    // Given a transport (U2F/HIF/WebUSB) it is possible instantiate the app
    const transport = await getOasisLedgerTransport();
    const app = new OasisApp(transport);

    this.app = app;
  }

  disconnect() {
    this.app = null;
  }

  async showAddress() {
    if (!this.app) {
      throw new Error("Oasis Ledger App not initialized yet!");
    }

    await this.app.showAddressAndPubKey(this.path);
  }

  async getAddress() {
    if (!this.app) {
      throw new Error("Oasis Ledger App not initialized yet!");
    }

    const result = await this.app.getAddressAndPubKey(this.path);
    const address = result.bech32_address;
    console.log(`Oasis Address: ${address}`);

    return address;
  }

  async getVersion() {
    if (!this.app) {
      throw new Error("Oasis Ledger App not initialized yet!");
    }

    const result = await this.app.getVersion();
    const version = `${result.major}.${result.minor}.${result.patch}`;
    return version;
  }

  async getPublicKey() {
    if (!this.app) {
      throw new Error("Oasis Ledger App not initialized yet!");
    }

    const result = await this.app.publicKey(this.path);
    console.log("PUBLIC KEY:");
    console.log(result);
    return result;
  }

  async transfer(args: OasisTransferArgs) {
    console.log("Handling Oasis transfer transaction, args: ", args);
    const tx = this.getTransferPayload(args);
    const receipt = this.signPayload(tx);
    return receipt;
  }

  async delegate(args: OasisDelegateArgs) {
    console.log("Handling Oasis delegate transaction, args: ", args);
    const tx = getDelegateTransaction(args);
    const signedTransaction = this.encodeAndSignTransaction(tx);
    const receipt = this.broadcastTransaction(signedTransaction);
    return receipt;
  }

  async undelegate(args: OasisUndelegateArgs) {
    console.log("Handling Oasis undelegate transaction, args: ", args);
    const tx = getUndelegateTransaction(args);
    const signedTransaction = this.encodeAndSignTransaction(tx);
    const receipt = this.broadcastTransaction(signedTransaction);
    return receipt;
  }

  async redelegate(args: OasisRedelegateArgs) {
    console.log("Handling Oasis redelegate transaction, args: ", args);
    const tx = getRedelegateTransaction(args);
    const signedTransaction = this.encodeAndSignTransaction(tx);
    const receipt = this.broadcastTransaction(signedTransaction);
    return receipt;
  }

  async encodeAndSignTransaction(transactionData: OasisTransactionPayload) {
    if (!this.app) {
      throw new Error("Oasis Ledger App not initialized yet!");
    }

    console.log("Encoding Transaction Data: ");
    console.log(transactionData);

    const path = this.path;
    // TODO: What is the context?
    const context = "oasis-core/consensus: tx for chain testing";
    const encodedTransaction = encodeTransaction(transactionData);
    const message = Buffer.from(encodedTransaction, "base64");

    console.log("Encoded - Requesting Ledger to sign...");
    console.log("message: ", message);

    // TODO: What are the types?
    const result: string = await this.app.sign(path, context, message);

    const signedResult = encodeSignedTransaction(message, result);

    console.log("Got signed payload!");
    console.log(signedResult);

    return signedResult;
  }

  async getTransferPayload(args: OasisTransferArgs) {
    console.log("getTransferPayload: ", args);

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const payload = {
      ...args,
      fee: 10, // TODO: What is the fee?
    };

    const response = await fetch(`${ENV.SERVER_URL}/api/oasis/transfer`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  }

  async signPayload(tx: any) {
    console.log("signPayload: ", tx);

    if (!this.app) {
      throw new Error("Oasis Ledger App not initialized yet!");
    }

    const path = this.path;
    // TODO: What is the context?
    const context = "oasis-core/consensus: tx for chain testing";
    const result: string = await this.app.sign(path, context, tx);
    const publicKey = await this.app.publicKey(path);

    const payload = {
      publicKey,
      tx,
      sig: result,
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(`${ENV.SERVER_URL}/api/oasis/transfer/send`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  }

  async broadcastTransaction(data: any) {
    const result = await broadcastTransactionModule.broadcastTransaction(
      data,
      "OASIS",
    );
    console.log(result);
    return SampleTransactionReceipt;
  }
}

/** ===========================================================================
 * Transaction Utils
 * ============================================================================
 */

/**
 * Handle getting the Oasis Ledger transport.
 */
const getOasisLedgerTransport = async () => {
  if (window.USB) {
    return TransportUSB.create();
  } else if (window.u2f) {
    return TransportU2F.create();
  }

  throw new Error(LEDGER_ERRORS.BROWSER_NOT_SUPPORTED);
};

/**
 * Encode in CBOR.
 */
const toCBOR = (tx: any) => {
  return cbor.Encoder.encodeCanonical(tx);
};

/**
 * Encode in Base64.
 */
const toBase64 = (cborTx: any) => {
  return cborTx.toString("base64");
};

/**
 * Handle encoding the raw transaction data to be signed by the Ledger.
 */
const encodeTransaction = (tx: OasisTransactionPayload): string => {
  const cborTx = toCBOR(tx);
  const cborTxBase64 = toBase64(cborTx);
  return cborTxBase64;
};

/**
 * Encode the final transaction data after it has been signed by the
 * Ledger.
 */
const encodeSignedTransaction = (
  rawTransaction: any,
  signedTransaction: any,
) => {
  const signed = {
    untrusted_raw_value: rawTransaction,
    signature: signedTransaction,
  };

  return toCBOR(signed);
};

/**
 * Address encoder.
 */
const marshalAddress = (address: string) => {
  const decoded = bech32.decode(address);
  return Buffer.from(bech32.fromWords(decoded.words));
};

/**
 * Encode with BigNumber.
 */
const marshalQuantity = (value: string | number) => {
  const amount = new BN(value, 10);
  if (amount.isZero()) {
    return Buffer.from([]);
  }
  return amount.toArrayLike(Buffer, "be", amount.byteLength());
};

/**
 * Helper to construct a transaction fee.
 */
const getTransactionFee = (fee: number = 0) => {
  return {
    gas: 0,
    amount: marshalQuantity(0),
  };
};

/**
 * Get the delegate transaction data.
 */
const getDelegateTransaction = (
  args: OasisDelegateArgs,
): OasisTransactionPayload => {
  const { delegator, validator, amount } = args;

  const transaction = {
    nonce: 0,
    fee: getTransactionFee(),
    method: OasisTransactionMethod.TRANSFER,
    body: {
      // TODO: The following are a guess:
      amount: marshalQuantity(amount),
      delegator: marshalAddress(delegator),
      validator: marshalAddress(validator),
    },
  };

  return transaction;
};

/**
 * Get the undelegate transaction data.
 */
const getUndelegateTransaction = (
  args: OasisUndelegateArgs,
): OasisTransactionPayload => {
  const { delegator, validator, amount } = args;

  const transaction = {
    nonce: 0,
    fee: getTransactionFee(),
    method: OasisTransactionMethod.TRANSFER,
    body: {
      // TODO: The following are a guess:
      amount: marshalQuantity(amount),
      delegator: marshalAddress(delegator),
      validator: marshalAddress(validator),
    },
  };

  return transaction;
};

/**
 * Get the redelegate transaction data.
 */
const getRedelegateTransaction = (
  args: OasisRedelegateArgs,
): OasisTransactionPayload => {
  const { delegator, current_validator, new_validator, amount } = args;

  const transaction = {
    nonce: 0,
    fee: getTransactionFee(),
    method: OasisTransactionMethod.TRANSFER,
    body: {
      // TODO: The following are a guess:
      amount: marshalQuantity(amount),
      delegator: marshalAddress(delegator),
      new_validator: marshalAddress(new_validator),
      current_validator: marshalAddress(current_validator),
    },
  };

  return transaction;
};

/** ===========================================================================
 * Mock Oasis Ledger Class
 * ============================================================================
 */

const SampleTransactionReceipt: IOasisTransactionReceipt = {
  height: 23807,
  hash: "09525844d57e7ce4c270a79d769b2a7ab6e6d12d8d3ec2fa566eee2d0f89f02",
};

class MockOasisLedgerModule implements IOasisLedger {
  async connect() {
    await wait(1500);
    return;
  }

  async disconnect() {
    return;
  }

  async getAddress() {
    await wait(1500);
    return "oasis1qrllkgqgqheus3qvq69wzsmh7799agg8lgsyecfq";
  }

  async getVersion() {
    await wait(1500);
    return "1.8.1";
  }

  async getPublicKey() {
    await wait(1500);
    return "";
  }

  async encodeAndSignTransaction(data: any) {
    return "";
  }

  async broadcastTransaction(data: any) {
    return SampleTransactionReceipt;
  }

  async transfer(args: OasisTransferArgs) {
    console.log("Handling Oasis transfer transaction, args: ", args);
    await wait(1500);
    return SampleTransactionReceipt;
  }

  async delegate(args: OasisDelegateArgs) {
    console.log("Handling Oasis delegate transaction, args: ", args);
    await wait(1500);
    return SampleTransactionReceipt;
  }

  async undelegate(args: OasisUndelegateArgs) {
    console.log("Handling Oasis undelegate transaction, args: ", args);
    await wait(1500);
    return SampleTransactionReceipt;
  }

  async redelegate(args: OasisRedelegateArgs) {
    console.log("Handling Oasis redelegate transaction, args: ", args);
    await wait(1500);
    return SampleTransactionReceipt;
  }
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const oasisLedger = new OasisLedgerClass();

const mockOasisLedger = new MockOasisLedgerModule();

export default ENV.ENABLE_MOCK_APIS ? mockOasisLedger : oasisLedger;
