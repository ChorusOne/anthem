import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";

/** ===========================================================================
 * Celo Ledger Utils
 * ============================================================================
 */

const getCeloLedgerTransport = () => {
  if (window.USB) {
    return TransportUSB.create();
  } else if (window.u2f) {
    return TransportU2F.create();
  }

  throw new Error("Browser not supported!");
};

export const connectCeloAddress = async () => {
  try {
    const transport = getCeloLedgerTransport();
    const eth = new Eth(transport);
    const { address } = await eth.getAddress("44'/52752'/0'/0/1", true);
    console.log(`Got Celo Address! ${address}`);
  } catch (error) {
    console.error(error);
  }
};

export const signCeloTransaction = async (transactionData: any) => {
  try {
    const transport = getCeloLedgerTransport();
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
