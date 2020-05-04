import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import { LEDGER_ERRORS } from "constants/ledger-errors";

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

  throw new Error(LEDGER_ERRORS.BROWSER_NOT_SUPPORTED);
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
      throw new Error(LEDGER_ERRORS.COSMOS_LEDGER_SCREENSAVER_ERROR);
    } else {
      throw error;
    }
  }
};

// Alfajores = "https://alfajores-forno.celo-testnet.org";
// Baklava = "https://baklava-forno.celo-testnet.org";

// From web3-core library types:
// Reference on RLP encoding: https://github.com/ethereum/wiki/wiki/RLP
export interface RLPEncodedTransaction {
  raw: string;
  tx: {
    nonce: string;
    gasPrice: string;
    gas: string;
    to: string;
    value: string;
    input: string;
    r: string;
    s: string;
    v: string;
    hash: string;
  };
}

// See: https://docs.celo.org/v/master/developer-guide/overview/introduction/contractkit/contracts-wrappers-registry
interface CeloTransactionFields {
  feeCurrency: string; // address of the ERC20 contract to use to pay for gas and the gateway fee
  gatewayFeeRecipient: string; // coinbase address of the full serving the light client's transactions
  gatewayFee: string; // value paid to the gateway fee recipient, denominated in the fee currency
}

interface EthTransactionData {
  nonce?: string;
  chainId?: string;
  to?: string;
  data?: string;
  value?: string;
  gasPrice?: string;
  gas: string;
}

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
    console.log(`Celo Transaction signing success! Address: ${address}`);
  } catch (error) {
    console.log("Error signing Celo transaction:");
    console.log(error);
    throw error;
  }
};
