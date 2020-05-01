import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";

/** ===========================================================================
 * Celo Ledger Utils
 * ----------------------------------------------------------------------------
 * References:
 * - Celo Ledger App: https://docs.celo.org/celo-gold-holder-guide/ledger
 * - Celo Example Web App: https://github.com/celo-org/celo-ledger-web-app/blob/master/index.js
 * - Contract Kit: https://www.npmjs.com/package/@celo/contractkit
 * - Contract Kit Guide: https://docs.celo.org/developer-guide/start/hellocelo
 * - Ledger ETH App: https://www.npmjs.com/package/@ledgerhq/hw-app-eth
 * ============================================================================
 */

/**
 * Handle getting the Celo Ledger transport.
 */
const getCeloLedgerTransport = () => {
  if (window.USB) {
    return TransportUSB.create();
  } else if (window.u2f) {
    return TransportU2F.create();
  }

  throw new Error("Browser not supported!");
};

/**
 * Connect to the Celo Ledger App and retrieve the account address.
 */
export const connectCeloAddress = async () => {
  try {
    const transport = await getCeloLedgerTransport();
    const eth = new Eth(transport);
    const { address } = await eth.getAddress("44'/52752'/0'/0/1", true);
    console.log(`Got Celo Address! ${address}`);
    return address;
  } catch (error) {
    // Escalate the error. Try to identify and handle screensaver mode errors.
    if (error.message === "Invalid channel") {
      throw new Error("Ledger's screensaver mode is on");
    } else {
      throw error;
    }
  }
};

/**
 * Sign transaction data with the Celo Ledger App.
 */
export const signCeloTransaction = async (transactionData: any) => {
  try {
    const transport = await getCeloLedgerTransport();
    const eth = new Eth(transport);
    const { address } = await eth.signTransaction(
      "44'/52752'/0'/0/0",
      transactionData,
    );
    console.log(`Signed Transaction! ${address}`);
  } catch (error) {
    console.log(error);
  }
};
