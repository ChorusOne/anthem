import Toast from "components/Toast";
import logger from "lib/logger-lib";
import { EpicSignature } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { combineEpics } from "redux-observable";
import { filter, mergeMap, pluck } from "rxjs/operators";
import { wait } from "tools/client-utils";
import { createSignMessage } from "tools/cosmos-ledger-utils";
import { createCosmosTransactionPostBody } from "tools/cosmos-utils";
import { isActionOf } from "typesafe-actions";
import { Actions } from "../root-actions";

/** ===========================================================================
 * Epics
 * ============================================================================
 */

const signTransactionEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.signTransaction)),
    mergeMap(async () => {
      try {
        const { ledger } = deps;
        const transactionData = state$.value.transaction.transactionData;

        if (ledger && transactionData) {
          const ledgerSignature = (
            await ledger.sign(createSignMessage(transactionData))
          ).toString("base64");

          const signature = ledgerSignature;
          const publicKey = (await ledger.getPubKey()).toString("base64");

          const message = createCosmosTransactionPostBody({
            transactionData,
            signature,
            publicKey,
          });

          return Actions.signTransactionSuccess(message);
        } else {
          throw new Error(
            "Unable to sign transaction! Ledger or transactionData was missing.",
          );
        }
      } catch (err) {
        const { tString } = i18nSelector(state$.value);
        Toast.warn(
          tString(
            "Could not access Ledger. Is your device still connected and unlocked?",
          ),
        );

        return Actions.signTransactionFailure();
      }
    }),
  );
};

const broadcastTransactionEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.broadcastTransaction)),
    pluck("payload"),
    mergeMap(async () => {
      const tx = state$.value.transaction.transactionPostBody;
      const networkName = state$.value.ledger.ledger.network.name;

      try {
        if (tx === null) {
          throw new Error("No transaction data exists!");
        }

        // NOTE: Use `block` to debug and `async` in production:
        const body = JSON.stringify({
          tx: tx.value,
          mode: "async",
        });

        logger(body);

        const result = await deps.cosmos.broadcastTransaction(
          body,
          networkName,
        );

        logger(result);

        return Actions.broadcastTransactionSuccess(result.txhash);
      } catch (err) {
        logger(err);
        Toast.danger(
          "Failed to send transaction. Please note, the transaction may have succeeded. Please wait a few seconds and refresh your browser before trying again.",
        );
        return Actions.broadcastTransactionFailure();
      }
    }),
  );
};

const pollTransactionEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(
      isActionOf([
        Actions.pollForTransaction,
        Actions.broadcastTransactionSuccess,
      ]),
    ),
    pluck("payload"),
    mergeMap(async () => {
      try {
        const txHash = state$.value.transaction.transactionHash;
        const networkName = state$.value.ledger.ledger.network.name;

        const result = await deps.cosmos.pollTransaction(txHash, networkName);
        logger(result);

        // Try to convert the transaction result to match the GraphQL/extractor
        // transaction data model...
        const adaptedTransactionResult = {
          chain: "cosmoshub-3",
          fees: result.tx.value.fee,
          gasused: result.gas_used,
          gaswanted: result.gas_wanted,
          hash: result.txhash,
          height: result.height,
          log: result.logs,
          memo: result.tx.value.memo,
          msgs: result.tx.value.msg,
          tags: result.tags,
          timestamp: String(new Date(result.timestamp).getTime()),
        };

        if (result.error && result.error.includes("not found")) {
          logger("Transaction not found, re-polling...");
          await wait(1500);
          return Actions.pollForTransaction();
        } else if (result.logs && result.logs[0].success) {
          return Actions.transactionConfirmed(adaptedTransactionResult);
        } else {
          const rawLog = result.raw_log;
          if (rawLog.includes("out of gas")) {
            Toast.danger(
              "Transaction failed because of insufficient gas! Please try again with adjusted gas settings.",
            );
          } else {
            const { tString } = i18nSelector(state$.value);
            Toast.danger(
              tString(
                "An unknown error occurred, received: {{errorString}}. Please refresh and try again.",
                {
                  errorString: JSON.stringify(result),
                },
              ),
            );
          }

          return Actions.transactionFailed();
        }
      } catch (err) {
        console.log(err);
        await wait(2500);
        return Actions.pollForTransaction();
      }
    }),
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default combineEpics(
  signTransactionEpic,
  broadcastTransactionEpic,
  pollTransactionEpic,
);
