import { newKitFromWeb3 } from "@celo/contractkit";
import { newLedgerWalletWithSetup } from "@celo/contractkit/lib/wallets/ledger-wallet";
import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import { LEDGER_ERRORS } from "constants/ledger-errors";
import Web3 from "web3";

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

const getKit = async () => {
  console.log("Getting Web3");
  const web3 = new Web3("https://baklava-forno.celo-testnet.org");

  console.log("Getting Transport");
  const transport = await getCeloLedgerTransport();

  const eth = new Eth(transport);
  console.log("Eth:");
  console.log(eth);

  // @ts-ignore
  const kit = newKitFromWeb3(web3, newLedgerWalletWithSetup(eth.transport));

  // Debug:
  try {
    console.log("KIT:");
    console.log(kit);

    console.log("Getting balances:");
    const addresses = await kit.getTotalBalance(
      "0x91E317a5437c0AFD7c99BfC9c120927131Cda2D2",
    );
    console.log(addresses);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Connect to the Celo Ledger App and retrieve the account address.
 */
export const connectCeloAddress = async () => {
  try {
    console.log("GETTING KIT");
    await getKit();
    // const transport = await getCeloLedgerTransport();
    // const eth = new Eth(transport);
    // const { address } = await eth.getAddress("44'/52752'/0'/0/1", true);
    // console.log(`Got Celo Address! ${address}`);
    // return address;
    return "0x91E317a5437c0AFD7c99BfC9c120927131Cda2D2";
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
