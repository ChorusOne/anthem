import { wait } from "@anthem/utils";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import { LEDGER_ERRORS } from "constants/ledger-errors";
import OasisApp from "ledger-oasis-js";
import ENV from "lib/client-env";

/** ===========================================================================
 * Oasis Ledger Utils
 * ---------------------------------------------------------------------------
 * Docs: https://github.com/Zondax/ledger-oasis-js
 * Example App: https://github.com/Zondax/ledger-oasis-js/blob/master/vue_example/components/LedgerExample.vue
 * ============================================================================
 */

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
      throw new Error("Not initialized yet!");
    }

    await this.app.showAddressAndPubKey(this.path);
  }

  async getAddress() {
    if (!this.app) {
      throw new Error("Not initialized yet!");
    }

    const result = await this.app.getAddressAndPubKey(this.path);
    const address = result.bech32_address;
    console.log(`Oasis Address: ${address}`);

    return address;
  }

  async getVersion() {
    if (!this.app) {
      throw new Error("Not initialized yet!");
    }

    const result = await this.app.getVersion();
    const version = `${result.major}.${result.minor}.${result.patch}`;
    return version;
  }

  async getPublicKey() {
    if (!this.app) {
      throw new Error("Not initialized yet!");
    }

    const result = await this.app.publicKey(this.path);
    console.log("PUBLIC KEY:");
    console.log(result);
    return result;
  }

  async transfer(args: OasisTransferArgs) {
    const { from, amount } = args;
    console.log("Handling Oasis transfer transaction, args: ", args);
    const tx = getStakingTransferTransaction(from, amount);
    console.log(tx);
    return SampleTransactionReceipt;
  }

  async delegate(args: OasisDelegateArgs) {
    console.log("Handling Oasis delegate transaction, args: ", args);
    return SampleTransactionReceipt;
  }

  async undelegate(args: OasisUndelegateArgs) {
    console.log("Handling Oasis undelegate transaction, args: ", args);
    return SampleTransactionReceipt;
  }

  async redelegate(args: OasisRedelegateArgs) {
    console.log("Handling Oasis undelegate transaction, args: ", args);
    return SampleTransactionReceipt;
  }
}

/** ===========================================================================
 * Utils
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
 * Fill in the rest: https://runkit.com/embed/jhwmrma4tdfb
 */
const getStakingTransferTransaction = (from: string, amount: string) => {
  const tx = {
    nonce: 0,
    fee: {
      amount: "0",
      gas: 0,
    },
    method: "staking.Transfer",
    body: {
      to: "oasis1qrrnesqpgc6rfy2m50eew5d7klqfqk69avhv4ak5",
      amount: "0",
    },
  };
  return tx;
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
