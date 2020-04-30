import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";

/** ===========================================================================
 * Celo Ledger Utils
 * ============================================================================
 */

export const connectCeloAddress = async () => {
  try {
    let transport;
    console.log("Checking for Celo transport!");
    if (window.USB) {
      transport = await TransportUSB.create();
    } else if (window.u2f) {
      transport = await TransportU2F.create();
    } else {
      // Browser not supported
      return;
    }
    const eth = new Eth(transport);
    const { address } = await eth.getAddress(
      "44'/52752'/0'/0/" + "0", // Address Index
      true,
    );
    console.log(`Got address! ${address}`);
  } catch (error) {
    console.error(error);
  }
};

export const signCeloTransaction = async (transactionData: any) => {
  try {
    let transport;
    if (window.USB) {
      transport = await TransportUSB.create();
    } else if (window.u2f) {
      transport = await TransportU2F.create();
    } else {
      return;
    }
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
