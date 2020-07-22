import { ContractKit, newKitFromWeb3 } from "@celo/contractkit";
import {
  LedgerWallet,
  newLedgerWalletWithSetup,
} from "@celo/contractkit/lib/wallets/ledger-wallet";
import { VoteValue } from "@celo/contractkit/lib/wrappers/Governance";
import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import { LEDGER_ERRORS } from "constants/ledger-errors";
import ENV from "lib/client-env";
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
 * - Testnet Faucet: https://celo.org/developers/faucet
 * ============================================================================
 */

const TEST_NETS = {
  ALFAJORES: "https://alfajores-forno.celo-testnet.org",
  BAKLAVA: "https://baklava-forno.celo-testnet.org",
};

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

interface CeloTransferArguments {
  from: string;
  to: string;
  amount: number;
}

/** ===========================================================================
 * Celo Ledger Class
 * ============================================================================
 */

class CeloLedgerClass {
  private address = "";
  private kit: Nullable<ContractKit> = null;
  private eth: Nullable<any> = null;
  private wallet: Nullable<LedgerWallet> = null;
  private readonly provider: string;

  constructor(provider: string) {
    this.provider = provider;
  }

  async connect() {
    const web3 = new Web3(this.provider);
    const transport = await getCeloLedgerTransport();
    const eth = new Eth(transport);
    const wallet = await newLedgerWalletWithSetup(eth.transport);
    // @ts-ignore
    const kit = newKitFromWeb3(web3, wallet);

    this.eth = eth;
    this.kit = kit;
    this.wallet = wallet;
  }

  disconnect() {
    this.eth = null;
    this.kit = null;
    this.wallet = null;
    this.address = "";
  }

  async getCeloAppVersion() {
    const appConfig = await this.eth.getAppConfiguration();
    return appConfig.version;
  }

  async getAddress(derivationPath: "0" | "1" | "2" | "3" | "4" = "0") {
    try {
      if (this.eth) {
        const path = derivationPath;
        const { address } = await this.eth.getAddress(
          `44'/52752'/0'/0/${path}`,
          true,
        );
        this.address = address;

        // Debug:
        this.getTotalBalances();

        return address;
      } else {
        throw new Error("Not initialized yet.");
      }
    } catch (error) {
      if (error.statusCode === 26628) {
        throw new Error(LEDGER_ERRORS.COSMOS_LEDGER_SCREENSAVER_ERROR);
      } else {
        throw error;
      }
    }
  }

  async transfer(args: CeloTransferArguments) {
    if (!this.kit) {
      throw new Error("Not initialized yet.");
    }

    const { to, from, amount } = args;
    const goldTokenContract = await this.kit.contracts.getGoldToken();
    console.log(`Sending from ${amount} ${from} to ${to}.`);
    const tx = await goldTokenContract
      .transfer(to, amount)
      // @ts-ignore
      .send({ from });

    console.log(tx);

    // Wait for the transaction to be processed
    const receipt = await tx.waitReceipt();
    console.log("Transaction complete, receipt: ", receipt);
    return receipt;
  }

  async vote(proposalId: string, vote: keyof typeof VoteValue) {
    if (!this.kit) {
      throw new Error("Not initialized yet.");
    }

    const governance = await this.kit.contracts.getGovernance();
    console.log(`Voting for proposal ID: ${proposalId}`);
    const result = await governance.vote(proposalId, vote);
    return result;
  }

  async upvote(proposalId: string, upvoter: string) {
    if (!this.kit) {
      throw new Error("Not initialized yet.");
    }

    const governance = await this.kit.contracts.getGovernance();
    console.log(`Upvoting proposal ID: ${proposalId}`);
    const result = await governance.upvote(proposalId, upvoter);
    return result;
  }

  async lock(amount: string) {
    if (!this.kit) {
      throw new Error("Not initialized yet.");
    }

    const lockedGold = await this.kit.contracts.getLockedGold();
    console.log(`Locking ${amount} gold for address ${this.address}`);
    const receipt = await lockedGold
      .lock()
      // @ts-ignore
      .sendAndWaitForReceipt({ from: this.address, value: amount });
    return receipt;
  }

  async unlock(amount: string) {
    if (!this.kit) {
      throw new Error("Not initialized yet.");
    }

    const lockedGold = await this.kit.contracts.getLockedGold();
    console.log(`Unlocking ${amount} gold for address ${this.address}`);
    const receipt = await lockedGold.unlock(amount).sendAndWaitForReceipt();
    return receipt;
  }

  async getAccountSummary() {
    if (!this.kit) {
      throw new Error("Not initialized yet.");
    }

    const lockedGold = await this.kit.contracts.getLockedGold();
    const summary = await lockedGold.getAccountSummary(this.address);
    console.log("Account Summary:");
    console.log(summary);
    return summary;
  }

  async getTotalBalances() {
    if (!this.kit || !this.address) {
      throw new Error("Not initialized yet.");
    }

    const balances = await this.kit.getTotalBalance(this.address);
    const { gold, lockedGold, pending, total, usd } = balances;
    console.log("Account Balances:");
    console.log(`Gold: ${gold.toString()}`);
    console.log(`Locked: ${lockedGold.toString()}`);
    console.log(`Pending: ${pending.toString()}`);
    console.log(`Total: ${total.toString()}`);
    console.log(`USD: ${usd.toString()}`);

    return balances;
  }

  info() {
    console.log(this.eth);
    console.log(this.wallet);
    console.log(this.kit);
  }
}

/** ===========================================================================
 * Mock Celo Ledger Class
 * ============================================================================
 */

class MockCeloLedgerModule {
  connect() {
    // No action
  }
  getCeloAppVersion() {
    return "1.0.1";
  }
  getAddress() {
    return "0xae1d640648009dbe0aa4485d3bfbb68c37710924";
  }
  transfer() {
    return "Not implemented yet.";
  }
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const celoLedgerProvider = new CeloLedgerClass(TEST_NETS.ALFAJORES);

const mockCeloLedgerModule = new MockCeloLedgerModule();

export default ENV.ENABLE_MOCK_APIS ? mockCeloLedgerModule : celoLedgerProvider;
