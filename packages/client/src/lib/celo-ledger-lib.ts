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

interface CeloVoteArguments {
  group: string;
  from: string;
  amount: number;
}

interface CeloLockGoldArguments {
  amount: string;
  from: string;
}

interface CeloGovernanceVoteArguments {
  proposalId: string;
  vote: keyof typeof VoteValue;
}

/** ===========================================================================
 * Celo Ledger Class
 * ============================================================================
 */

class CeloLedgerClass {
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

    const { proposalId, vote } = args;

    const governance = await this.kit.contracts.getGovernance();
    console.log(`Voting for proposal ID: ${proposalId}`);
    const result = await governance.vote(proposalId, vote);
    return result;
  }

  async upvoteForProposal(proposalId: string, upvoter: string) {
    if (!this.kit) {
      throw new Error("CeloLedgerClass not initialized yet.");
    }

    const governance = await this.kit.contracts.getGovernance();
    console.log(`Upvoting proposal ID: ${proposalId}`);
    const result = await governance.upvote(proposalId, upvoter);
    return result;
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

    try {
      const receipt = await lockedGold
        .lock()
        // @ts-ignore
        .sendAndWaitForReceipt({ from, value: amount });
      return receipt;
    } catch (err) {
      console.error(err);
      throw err;
    }
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

    const election = await this.kit.contracts.getElection();
    console.log(
      `Voting ${amount} locked gold for validator group ${this.address}`,
    );
    const receipt = await election
      .vote(group, new BigNumber(amount))
      // @ts-ignore
      .sendAndWaitForReceipt({ from: this.address });
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

class MockCeloLedgerModule {
  connect() {
    // No action
  }

  getCeloAppVersion() {
    return "1.0.1";
  }

  validateAddress() {
    return true;
  }

  getAddress() {
    return "0xae1d640648009dbe0aa4485d3bfbb68c37710924";
  }

  voteForProposal(args: CeloGovernanceVoteArguments) {
    console.log(args);
    // TODO: Fill in correct response data:
    return {
      transactionHash:
        "0x42407259176a931a0294847ee10eedbf01be4959ac7914f9fffbb5b84faf6ee7",
    };
  }

  isAccount(address: string) {
    return true;
  }

  createAccount(address: string) {
    return true;
  }

  lock(args: CeloLockGoldArguments) {
    console.log(args);
    // TODO: Fill in correct response data:
    return {
      transactionHash:
        "0x42407259176a931a0294847ee10eedbf01be4959ac7914f9fffbb5b84faf6ee2",
    };
  }

  voteForValidatorGroup(args: CeloVoteArguments) {
    console.log(args);
    // TODO: Fill in correct response data:
    return {
      transactionHash:
        "0x42407259176a931a0294847ee10eedbf01be4959ac7914f9fffbb5b84faf6ee2",
    };
  }

  transfer() {
    return {
      blockHash:
        "0x5307a5509c5655836a7d8dee55e94686c2ad0b9ed88cd6d61870b76fe662f141",
      blockNumber: 116599,
      contractAddress: null,
      cumulativeGasUsed: 46086,
      events: {
        Transfer: {
          address: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
          blockHash:
            "0x5307a5509c5655836a7d8dee55e94686c2ad0b9ed88cd6d61870b76fe662f141",
          blockNumber: 116599,
          event: "Transfer",
          id: "log_3678fb7a",
          logIndex: 0,
          raw: {},
          removed: false,
          returnValues: {
            0: "0x6CB8265dB4cf1f588B9a6576618ed9c965CC0869",
            1: "0x91E317a5437c0AFD7c99BfC9c120927131Cda2D2",
            2: "100000",
            from: "0x6CB8265dB4cf1f588B9a6576618ed9c965CC0869",
            to: "0x91E317a5437c0AFD7c99BfC9c120927131Cda2D2",
            value: "100000",
          },
          signature:
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          transactionHash:
            "0x42407259176a931a0294847ee10eedbf01be4959ac7914f9fffbb5b84faf6ee1",
          transactionIndex: 0,
        },
      },
      from: "0x6cb8265db4cf1f588b9a6576618ed9c965cc0869",
      gasUsed: 46086,
      logsBloom:
        "0x00000000000000000000000000000000000000000000000000000000000000008000800000000000000000000000000000000000000000000000000000000000000000000000100000000008000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000010000000002000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000020000000",
      status: true,
      to: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
      transactionHash:
        "0x42407259176a931a0294847ee10eedbf01be4959ac7914f9fffbb5b84faf6ee1",
      transactionIndex: 0,
    };
  }
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const celoLedgerProvider = new CeloLedgerClass(TEST_NETS.ALFAJORES);

const mockCeloLedgerModule = new MockCeloLedgerModule();

export default !ENV.ENABLE_MOCK_APIS
  ? mockCeloLedgerModule
  : celoLedgerProvider;
