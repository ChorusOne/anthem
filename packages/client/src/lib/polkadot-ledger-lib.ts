import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import { LEDGER_ERRORS } from "constants/ledger-errors";
import PolkadotApp from "@zondax/ledger-polkadot";
import ENV from "lib/client-env";
import { wait } from "tools/client-utils";

/** ===========================================================================
 * Polkadot Ledger Utils
 * ---------------------------------------------------------------------------
 * Docs: https://github.com/Zondax/ledger-polkadot-js
 * Example App: https://github.com/Zondax/ledger-polkadot-js/blob/master/vue_example/components/LedgerExample.vue
 * ============================================================================
 */

/**
 * Handle getting the Polkadot Ledger transport.
 */
const getPolkadotLedgerTransport = async () => {
  if (window.USB) {
    return TransportUSB.create();
  } else if (window.u2f) {
    return TransportU2F.create();
  }

  throw new Error(LEDGER_ERRORS.BROWSER_NOT_SUPPORTED);
};

interface IPolkadotLedger {
  connect(): Promise<void>;
  disconnect(): void;
  getAddress(): Promise<string>;
  getVersion(): Promise<string>;
}

/** ===========================================================================
 * Polkadot Ledger Class
 * ============================================================================
 */

class PolkadotLedgerClass implements IPolkadotLedger {
  private app: Nullable<any> = null;
  private readonly path = [44, 474, 0, 0, 0];

  async connect() {
    // Given a transport (U2F/HIF/WebUSB) it is possible instantiate the app
    const transport = await getPolkadotLedgerTransport();
    const app = new PolkadotApp(transport);

    this.app = app;
  }

  disconnect() {
    this.app = null;
  }

  async getAddress() {
    if (!this.app) {
      throw new Error("Not initialized yet!");
    }

    const pathAccount = 0x80000000;
    const pathChange = 0x80000000;
    const pathIndex = 0x80000000;

    const response = await this.app.getAddress(
      pathAccount,
      pathChange,
      pathIndex,
      false,
    );
    if (response.return_code !== 0x9000) {
      console.log(`Error [${response.return_code}] ${response.error_message}`);
      return;
    }

    console.log("Response received!");
    console.log("Full response:");
    console.log(response);

    return response;
  }

  async getVersion() {
    if (!this.app) {
      throw new Error("Not initialized yet!");
    }

    const result = await this.app.getVersion();
    const version = `${result.major}.${result.minor}.${result.patch}`;
    return version;
  }
}

/** ===========================================================================
 * Mock Oasis Ledger Class
 * ============================================================================
 */

class MockPolkadotLedgerModule implements IPolkadotLedger {
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

const polkadotLedger = new PolkadotLedgerClass();

const mockPolkadotLedger = new MockPolkadotLedgerModule();

export default ENV.ENABLE_MOCK_APIS ? mockPolkadotLedger : polkadotLedger;
