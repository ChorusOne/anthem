import { ITransaction } from "@anthem/utils";
import { transformCosmosTransactionToRenderElements } from "tools/cosmos-transaction-utils";
import { cosmosTransactions } from "../../../utils/src/client/data/cosmosTransactions.json";

const txs = cosmosTransactions.data;

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
      const result = transformCosmosTransactionToRenderElements({
        msgIndex: 0,
        denom: "uatom",
        transaction: testTx,
        address: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
      });
      expect(result).toMatchSnapshot();
    }
  });
});
