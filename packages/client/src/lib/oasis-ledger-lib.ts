import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import { LEDGER_ERRORS } from "constants/ledger-errors";
import OasisApp from "ledger-oasis-js";
import ENV from "lib/client-env";
import { wait } from "tools/client-utils";

/** ===========================================================================
 * Oasis Ledger Utils
 * ---------------------------------------------------------------------------
 * Docs: https://github.com/Zondax/ledger-oasis-js
 * ============================================================================
 */

/**
 * Handle getting the Celo Ledger transport.
 */
const getOasisLedgerTransport = async () => {
  if (window.USB) {
    return TransportUSB.create();
  } else if (window.u2f) {
    return TransportU2F.create();
  }

  throw new Error(LEDGER_ERRORS.BROWSER_NOT_SUPPORTED);
};

interface IOasisLedger {
  connect(): Promise<void>;
  disconnect(): void;
  getAddress(): Promise<string>;
  getVersion(): Promise<string>;
  getPublicKey(): Promise<string>;
}

/** ===========================================================================
 * Oasis Ledger Class
 * ============================================================================
 */

class OasisLedgerClass implements IOasisLedger {
  private app: Nullable<any> = null;
  private readonly path = [44, 118, 5, 0, 3];

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
    console.log("ADDRESS:");
    console.log(result);
    return result;
  }

  async getVersion() {
    if (!this.app) {
      throw new Error("Not initialized yet!");
    }

    const result = await this.app.getVersion();
    const version = `${result.major}-${result.minor}-${result.patch}`;
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
}

/** ===========================================================================
 * Mock Oasis Ledger Class
 * ============================================================================
 */

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
    return "1.0.0";
  }

  async getPublicKey() {
    await wait(1500);
    return "";
  }
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const oasisLedger = new OasisLedgerClass();

const mockOasisLedger = new MockOasisLedgerModule();

export default ENV.ENABLE_MOCK_APIS ? mockOasisLedger : oasisLedger;
