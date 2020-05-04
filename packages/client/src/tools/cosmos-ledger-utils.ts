import { IBalance, ITxMsg, ITxValue } from "@anthem/utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface SignBytesInput {
  fee: {
    gas: string;
    amount: Maybe<readonly IBalance[]>;
  };
  memo: string;
  msgs: Maybe<readonly ITxMsg[]>;
  sequence: string;
  account_number: string;
  chain_id: string;
}

interface JsonTransaction {
  txMsg: ITxValue;
  txRequestMetadata: any;
}

/** ===========================================================================
 * Ledger Utils
 * ----------------------------------------------------------------------------
 * Utils for interacting with a Ledger Device.
 * ============================================================================
 */

/**
 * Transactions often have amino decoded objects in them `{type, value}`.
 * We need to strip this clutter as we need to sign only the values.
 *
 * TODO: Add note about fixed order.
 */
const prepareSignBytes = (jsonTransaction: SignBytesInput): any => {
  if (Array.isArray(jsonTransaction)) {
    return jsonTransaction.map(prepareSignBytes);
  }

  // string or number
  if (typeof jsonTransaction !== "object") {
    return jsonTransaction;
  }

  const sorted = {};
  Object.keys(jsonTransaction)
    .sort()
    .forEach(key => {
      // @ts-ignore
      if (jsonTransaction[key] === undefined || jsonTransaction[key] === null) {
        return;
      }

      // @ts-ignore
      // tslint:disable-next-line
      sorted[key] = prepareSignBytes(jsonTransaction[key]);
    });

  // @ts-ignore
  return sorted;
};

/**
 * The SDK expects a certain message format to serialize and then sign:
 *
 * TODO: types.
 *
 * type StdSignMsg struct {
 *   ChainID       string      `json:"chain_id"`
 *   AccountNumber uint64      `json:"account_number"`
 *   Sequence      uint64      `json:"sequence"`
 *   Fee           auth.StdFee `json:"fee"`
 *   Msgs          []sdk.Msg   `json:"msgs"`
 *   Memo          string      `json:"memo"`
 * }
 */
export const createSignMessage = (jsonTransaction: JsonTransaction) => {
  const { txMsg, txRequestMetadata } = jsonTransaction;

  // sign bytes need amount to be an array
  const fee = {
    amount: txMsg.fee.amount || [],
    gas: txMsg.fee.gas,
  };

  return JSON.stringify(
    prepareSignBytes({
      fee,
      memo: txMsg.memo,
      msgs: txMsg.msg, // weird msg vs. msgs
      sequence: txRequestMetadata.sequence,
      account_number: txRequestMetadata.account_number,
      chain_id: txRequestMetadata.chain_id,
    }),
  );
};
