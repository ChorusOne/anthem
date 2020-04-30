import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";

const Kit = require("@celo/contractkit");

/** ===========================================================================
 * Celo Ledger Utils
 * ----------------------------------------------------------------------------
 * References:
 * - Celo Ledger App: https://docs.celo.org/celo-gold-holder-guide/ledger
 * - Contract Kit: https://www.npmjs.com/package/@celo/contractkit
 * - Contract Kit Guide: https://docs.celo.org/developer-guide/start/hellocelo
 * - Ledger ETH App: https://www.npmjs.com/package/@ledgerhq/hw-app-eth
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

const checkAddressWithContractKit = async (address: string) => {
  try {
    console.log("Checking contract kit for balance!");
    const kit = Kit.newKit("https://alfajores-forno.celo-testnet.org");
    const balance = await kit.web3.eth.getBalance(address);
    console.log(balance);
  } catch (error) {
    console.log(error);
  }
};

export const connectCeloAddress = async () => {
  try {
    const transport = await getCeloLedgerTransport();
    const eth = new Eth(transport);
    const { address } = await eth.getAddress("44'/52752'/0'/0/1", true);
    console.log(`Got Celo Address! ${address}`);
    checkAddressWithContractKit(address);
  } catch (error) {
    console.error(error);
  }
};

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
