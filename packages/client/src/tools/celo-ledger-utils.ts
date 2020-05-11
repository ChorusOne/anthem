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

const Alfajores = "https://alfajores-forno.celo-testnet.org";
const Baklava = "https://baklava-forno.celo-testnet.org";

const ADDRESS_1 = "0x91E317a5437c0AFD7c99BfC9c120927131Cda2D2";
const ADDRESS_2 = "0x40981A4e814c03F3791bd5267DD1D2b62F8F4211";

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

const CELO_KIT = {
  address: "",
  initialized: false,
  kit: null,
  eth: null,

  init(kit: any, eth: any, address: string) {
    this.kit = kit;
    this.eth = eth;
    this.address = address;
    this.initialized = true;
  },

  get() {
    return {
      kit: this.kit,
      eth: this.eth,
      address: this.address,
    };
  },
};

const getKit = async () => {
  // Debug:
  try {
    if (CELO_KIT.initialized) {
      const { kit, eth, address } = CELO_KIT.get();
    } else {
      const web3 = new Web3(Alfajores);
      const transport = await getCeloLedgerTransport();
      const eth = new Eth(transport);
      const { address } = await eth.getAddress("44'/52752'/0'/0/2", true);
      console.log(`Got Celo Address! ${address}`);

      const wallet = await newLedgerWalletWithSetup(eth.transport);
      console.log(wallet);

      // @ts-ignore
      const kit = newKitFromWeb3(web3, wallet);

      const goldTokenContract = await kit.contracts.getGoldToken();
      let balance = await goldTokenContract.balanceOf(address);

      // // Get starting balance:
      console.log(balance.toString());

      console.log("~ Transferring");
      const tx = await goldTokenContract
        .transfer(ADDRESS_2, 1000)
        // @ts-ignore
        .send({ from: ADDRESS_1 });

      console.log(tx);
      console.log("~ Waiting for receipt");
      // Wait for the transaction to be processed
      const receipt = await tx.waitReceipt();

      // 5000000000000000000
      // 4999762869999999000

      // Print receipt
      console.log("Transaction receipt: ", receipt);

      //  your new balance
      balance = await goldTokenContract.balanceOf(ADDRESS_1);
      console.log(balance.toString());

      // Init Kit
      CELO_KIT.init(kit, eth, address);

      const balances = await kit.getTotalBalance(address);
      console.log(balances);
      return address;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Connect to the Celo Ledger App and retrieve the account address.
 */
export const connectCeloAddress = async () => {
  try {
    const address = await getKit();
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
