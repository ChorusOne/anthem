import { ContractKit, newKitFromWeb3 } from "@celo/contractkit";
import {
  LedgerWallet,
  newLedgerWalletWithSetup,
} from "@celo/contractkit/lib/wallets/ledger-wallet";
import { VoteValue } from "@celo/contractkit/lib/wrappers/Governance";
import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import BigNumber from "bignumber.js";
import { LEDGER_ERRORS } from "constants/ledger-errors";
import ENV from "lib/client-env";
import { wait } from "tools/client-utils";
import Web3 from "web3";
import {
  ACTIVATE_VOTES_RECEIPT,
  PLACEHOLDER_TX_RECEIPT,
  TRANSFER_RECEIPT,
} from "./celo-mock-data";

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
  MAINNET: "https://rc1-forno.celo-testnet.org/",
  BAKLAVA: "https://baklava-forno.celo-testnet.org",
  ALFAJORES: "https://alfajores-forno.celo-testnet.org",
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

interface CeloVoteArguments {
  group: string;
  from: string;
  amount: number;
}

interface CeloLockGoldArguments {
  amount: string;
  from: string;
}

export interface RevokeVotesArguments {
  amount: string;
  address: string;
  group: string;
}

interface CeloGovernanceVoteArguments {
  from: string;
  proposalId: string;
  vote: keyof typeof VoteValue;
}

// Other data is included but we only care about these for now.
export interface ICeloTransactionResult {
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
}

interface ICeloLedger {
  validateAddress(address: string): boolean;
  getCeloAppVersion(): Promise<string>;
  getAddress(derivationPath: "0" | "1" | "2" | "3" | "4"): Promise<string>;
  transfer(args: CeloTransferArguments): Promise<ICeloTransactionResult>;
  voteForProposal(
    args: CeloGovernanceVoteArguments,
  ): Promise<ICeloTransactionResult>;
  upvoteForProposal(
    proposalId: string,
    upvoter: string,
  ): Promise<ICeloTransactionResult>;
  createAccount(address: string): Promise<ICeloTransactionResult>;
  isAccount(address: string): Promise<boolean>;
  lock(args: CeloLockGoldArguments): Promise<ICeloTransactionResult>;
  unlock(amount: string): Promise<ICeloTransactionResult>;
  voteForValidatorGroup(
    args: CeloVoteArguments,
  ): Promise<ICeloTransactionResult>;
  activateVotes(address: string): Promise<ICeloTransactionResult>;
  revokeVotes(args: RevokeVotesArguments): Promise<ICeloTransactionResult>;
  getAccountSummary(): Promise<any>;
  getTotalBalances(): Promise<any>;
}

/** ===========================================================================
 * Celo Ledger Class
 * ============================================================================
 */

class CeloLedgerClass implements ICeloLedger {
  private address = "";
  private kit: Nullable<ContractKit> = null;
  private eth: Nullable<any> = null;
  private web3: Nullable<Web3> = null;
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

    this.web3 = web3;
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

  validateAddress(address: string) {
    if (this.web3) {
      return this.web3.utils.isAddress(address);
    }

    throw new Error("CeloLedgerClass not initialized yet.");
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
        throw new Error("CeloLedgerClass not initialized yet.");
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
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const { to, from, amount } = args;
    const goldTokenContract = await this.kit.contracts.getGoldToken();

    // @ts-ignore
    const tx = await goldTokenContract.transfer(to, amount).send({ from });

    // Wait for the transaction to be processed
    const receipt = await tx.waitReceipt();
    return receipt;
  }

  async voteForProposal(args: CeloGovernanceVoteArguments) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const { proposalId, vote, from } = args;

    const governance = await this.kit.contracts.getGovernance();
    console.log(`Voting for proposal ID: ${proposalId}`);
    const tx = await governance.vote(proposalId, vote);
    // @ts-ignore
    const receipt = await tx.sendAndWaitForReceipt({ from });
    return receipt;
  }

  async upvoteForProposal(proposalId: string, upvoter: string) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const governance = await this.kit.contracts.getGovernance();
    console.log(`Upvoting proposal ID: ${proposalId}`);
    const result = await governance.upvote(proposalId, upvoter);
    const receipt = await result.sendAndWaitForReceipt();
    return receipt;
  }

  async createAccount(address: string) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const accounts = await this.kit.contracts.getAccounts();

    const result = await accounts
      .createAccount()
      // @ts-ignore
      .sendAndWaitForReceipt({ from: address });
    console.log("Account Result:");
    console.log(result);
    return result;
  }

  async isAccount(address: string) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const accounts = await this.kit.contracts.getAccounts();
    const isAccount = await accounts.isAccount(address);
    return isAccount;
  }

  async lock(args: CeloLockGoldArguments) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const { amount, from } = args;

    const lockedGold = await this.kit.contracts.getLockedGold();
    console.log(`Locking ${amount} gold for address ${this.address}`);

    const receipt = await lockedGold
      .lock()
      // @ts-ignore
      .sendAndWaitForReceipt({ from, value: amount });
    return receipt;
  }

  async unlock(amount: string) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const lockedGold = await this.kit.contracts.getLockedGold();
    console.log(`Unlocking ${amount} gold for address ${this.address}`);
    const receipt = await lockedGold.unlock(amount).sendAndWaitForReceipt();
    return receipt;
  }

  async voteForValidatorGroup(args: CeloVoteArguments) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const { from, group, amount } = args;

    this.kit.defaultAccount = from;
    const election = await this.kit.contracts.getElection();
    console.log(`Voting ${amount} locked gold for validator group ${group}`);
    const tx = await election.vote(group, new BigNumber(amount));
    // @ts-ignore
    const receipt = await tx.sendAndWaitForReceipt({ from });
    console.log(receipt);
    return receipt;
  }

  async activateVotes(address: string) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    this.kit.defaultAccount = address;
    const election = await this.kit.contracts.getElection();
    console.log(`Activating votes for address: ${address}`);
    const tx = await election.activate(address);
    const receipt = await tx[0].sendAndWaitForReceipt();
    return receipt;
  }

  async revokeVotes(args: RevokeVotesArguments) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const { group, address, amount } = args;
    const value = new BigNumber(amount);

    this.kit.defaultAccount = address;
    const election = await this.kit.contracts.getElection();
    console.log(`Revoking votes for address: ${address}`);
    const tx = await election.revokeActive(group, address, value);
    const receipt = await tx.sendAndWaitForReceipt();
    console.log(receipt);
    return receipt;
  }

  async getAccountSummary() {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const lockedGold = await this.kit.contracts.getLockedGold();
    const summary = await lockedGold.getAccountSummary(this.address);
    console.log("Account Summary:");
    console.log(summary);
    return summary;
  }

  async getTotalBalances() {
    if (!this.kit || !this.address) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const balances = await this.kit.getTotalBalance(this.address);
    const { gold, lockedGold, pending, usd } = balances;
    console.log("Account Balances:");
    console.log(`Gold: ${gold.toString()}`);
    console.log(`Locked: ${lockedGold.toString()}`);
    console.log(`Pending: ${pending.toString()}`);
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

class MockCeloLedgerModule implements ICeloLedger {
  createdAccount = false;

  connect() {
    // No action
  }

  async getCeloAppVersion() {
    return "1.0.1";
  }

  validateAddress() {
    return true;
  }

  async getAddress() {
    await wait(2500);
    return "0xae1d640648009dbe0aa4485d3bfbb68c37710924";
  }

  async voteForProposal(args: CeloGovernanceVoteArguments) {
    console.log(args);
    return PLACEHOLDER_TX_RECEIPT;
  }

  async isAccount(address: string) {
    return this.createdAccount;
  }

  async createAccount(address: string) {
    // Add a delay for effect...
    await wait(2500);
    this.createdAccount = true;
    return PLACEHOLDER_TX_RECEIPT;
  }

  async lock(args: CeloLockGoldArguments) {
    await wait(2500);
    return PLACEHOLDER_TX_RECEIPT;
  }

  async voteForValidatorGroup(args: CeloVoteArguments) {
    await wait(2500);
    return PLACEHOLDER_TX_RECEIPT;
  }

  async activateVotes() {
    return ACTIVATE_VOTES_RECEIPT;
  }

  async revokeVotes() {
    return PLACEHOLDER_TX_RECEIPT;
  }

  async transfer() {
    return TRANSFER_RECEIPT;
  }

  async upvoteForProposal() {
    return PLACEHOLDER_TX_RECEIPT;
  }

  async unlock() {
    return PLACEHOLDER_TX_RECEIPT;
  }

  async getAccountSummary() {
    return;
  }

  async getTotalBalances() {
    return;
  }
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const celoLedgerProvider = new CeloLedgerClass(TEST_NETS.MAINNET);

const mockCeloLedgerModule = new MockCeloLedgerModule();

export default ENV.ENABLE_MOCK_APIS ? mockCeloLedgerModule : celoLedgerProvider;
