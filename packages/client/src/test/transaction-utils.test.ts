import { ITransaction } from "graphql/types";
import { ENGLISH } from "i18n/english";
import { tFn } from "tools/i18n-utils";
import { getHumanReadableMessageFromTransaction } from "tools/transaction-utils";
import transactions from "../../../utils/src/client/data/transactions.json";

const txs = transactions.transactions;

interface TxTypeMap {
  [key: string]: ReadonlyArray<ITransaction>;
}

/**
 * Transform the transactions to a map, keyed by the transaction type, to
 * be used for testing to easily retrieve transactions of a specific type.
 */
const txsByType: TxTypeMap = txs.reduce(
  // @ts-ignore
  (txMap: TxTypeMap, tx: ITransaction) => {
    const { type } = tx.msgs[0];
    let updatedMap: TxTypeMap = {};

    if (type in txMap) {
      updatedMap = {
        ...txMap,
        [type]: txMap[type].concat(tx),
      };
    } else {
      updatedMap = {
        ...txMap,
        [type]: [tx],
      };
    }

    return updatedMap;
  },
  {},
);

describe("transaction-utils", () => {
  test.skip("getHumanReadableMessageFromTransaction", () => {
    /**
     * TODO: Refactor these to test helpers.
     */
    const mockT = (s: string, vars: { [key: string]: any }) => [s, vars];
    const t = (mockT as unknown) as tFn;
    const tString = (...text: ENGLISH) => String(text);

    const txTypes: ReadonlyArray<string> = [
      "cosmos-sdk/MsgDelegate",
      "cosmos-sdk/MsgSend",
      "cosmos-sdk/MsgVote",
      "cosmos-sdk/MsgWithdrawDelegationReward",
      "cosmos-sdk/MsgWithdrawValidatorCommission",
    ];

    const testTxs = txTypes
      .map(type => {
        if (type in txsByType) {
          return txsByType[type][0];
        } else {
          return null;
        }
      })
      .filter(Boolean) as ReadonlyArray<ITransaction>;

    for (const testTx of testTxs) {
      const result = getHumanReadableMessageFromTransaction({
        t,
        tString,
        msgIndex: 0,
        denom: "uatom",
        transaction: testTx,
        address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      });
      expect(result).toMatchSnapshot();
    }
  });
});
