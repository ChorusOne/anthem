import { wait } from "@anthem/utils";
import Ledger from "@lunie/cosmos-ledger";
import ENV from "./client-env";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

class CosmosLedgerModule extends Ledger {
  ledger: typeof Ledger = {} as any;

  constructor(args: { testModeAllowed: boolean }) {
    super(args);
    this.ledger = new Ledger({ testModeAllowed: args.testModeAllowed });
  }

  connectDevice = async () => {
    return this.ledger.connect();
  };

  isCosmosAppOpen = async () => {
    return this.ledger.isCosmosAppOpen();
  };

  getCosmosAppVersion = async () => {
    if (ENV.ALLOW_LEDGER_ADDRESS_OVERRIDE) {
      return "1.5.3";
    } else {
      return this.ledger.getCosmosAppVersion();
    }
  };

  getCosmosAddress = async () => {
    if (ENV.ALLOW_LEDGER_ADDRESS_OVERRIDE) {
      const urlAddress = window.location.search.replace("?address=", "");
      const address =
        urlAddress || "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd";
      console.warn(`Overriding Ledger address! Using "${address}" instead.`);
      return address;
    } else {
      return this.ledger.getCosmosAddress();
    }
  };

  sign = async (message: string) => {
    return this.ledger.sign(message);
  };

  getPubKey = async () => {
    return this.ledger.getPubKey();
  };
}

/** ===========================================================================
 * Mock Ledger Class
 * ============================================================================
 */

class MockCosmosLedgerModule extends Ledger {
  connectDevice = async () => {
    return this;
  };

  getCosmosAppVersion = async () => {
    return "1.5.3";
  };

  isCosmosAppOpen = async () => {
    return;
  };

  getCosmosAddress = async () => {
    await wait(1500);
    if (ENV.ALLOW_LEDGER_ADDRESS_OVERRIDE) {
      const urlAddress = window.location.search.replace("?address=", "");
      const address =
        urlAddress || "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd";
      console.warn(`Overriding Ledger address! Using "${address}" instead.`);
      return address;
    } else {
      return "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd";
    }
  };

  sign = async (message: string) => {
    await new Promise((_: any) => setTimeout(_, 3000));
    return Buffer.from(
      "veSWDdD9U+ItHYpNjyYLVKQqFB21I3r4S4URzZbTu9AAm1O6u/myrzEhrhBYOVd43jPm6rrSycAmYdVjbSbv5g==",
    );
  };

  getPubKey = async () => {
    return Buffer.from("Aw4zgEv1pPgBcW5jA/KvrlE33pmhLFmnhiPHasUvncGn");
  };
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const cosmosLedgerModule = new CosmosLedgerModule({ testModeAllowed: true });

const mockCosmosLedgerModule = new MockCosmosLedgerModule();

export default ENV.ENABLE_MOCK_APIS
  ? mockCosmosLedgerModule
  : cosmosLedgerModule;
