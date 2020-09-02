import { assertUnreachable } from "@anthem/utils";
import logger from "lib/logger-lib";
import { EpicSignature } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { combineEpics } from "redux-observable";
import { filter, ignoreElements, mergeMap, pluck, tap } from "rxjs/operators";
import { adaptRawTransactionData, wait } from "tools/client-utils";
import { createSignMessage } from "tools/cosmos-ledger-utils";
import { createCosmosTransactionPostBody } from "tools/cosmos-utils";
import { isActionOf } from "typesafe-actions";
import Toast from "ui/Toast";
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
        const { cosmosLedgerUtil, celoLedgerUtil } = deps;
        const { ledgerActionType } = state$.value.ledger.ledgerDialog;
        const { name } = state$.value.ledger.ledger.network;
        const { address } = state$.value.ledger.ledger;
        const { transactionData } = state$.value.transaction;

        switch (name) {
          case "COSMOS":
          case "TERRA":
          case "KAVA":
            if (cosmosLedgerUtil && transactionData) {
              const ledgerSignature = (
                await cosmosLedgerUtil.sign(createSignMessage(transactionData))
              ).toString("base64");

              const signature = ledgerSignature;
              const publicKey = (await cosmosLedgerUtil.getPubKey()).toString(
                "base64",
              );

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
          case "CELO":
            switch (ledgerActionType) {
              case "SEND":
                const transferResult = await celoLedgerUtil.transfer(
                  transactionData,
                );
                return Actions.transactionConfirmed(transferResult);
              case "VOTE_GOLD":
                const voteResult = await celoLedgerUtil.voteForValidatorGroup(
                  transactionData,
                );
                return Actions.transactionConfirmed(voteResult);
              case "LOCK_GOLD":
                const lockResult = await celoLedgerUtil.lock(transactionData);
                return Actions.transactionConfirmed(lockResult);
              case "UNLOCK_GOLD":
                const unlockResult = await celoLedgerUtil.unlock(
                  transactionData,
                );
                return Actions.transactionConfirmed(unlockResult);
              case "WITHDRAW":
                const withdrawResult = await celoLedgerUtil.withdraw(
                  transactionData,
                );
                return Actions.transactionConfirmed(withdrawResult);
              case "ACTIVATE_VOTES":
                const activateResult = await celoLedgerUtil.activateVotes(
                  address,
                );
                return Actions.transactionConfirmed(activateResult);
              case "REVOKE_VOTES":
                const revokeResult = await celoLedgerUtil.revokeVotes(
                  transactionData,
                );
                return Actions.transactionConfirmed(revokeResult);
              case "GOVERNANCE_VOTE":
                const governanceResult = await celoLedgerUtil.voteForProposal(
                  transactionData,
                );
                return Actions.transactionConfirmed(governanceResult);
              default: {
                throw new Error(
                  `Action ${ledgerActionType} not supported for Celo yet.`,
                );
              }
            }
          case "POLKADOT":
            return Actions.signTransactionFailure();
          case "OASIS":
            const msg = "Signing Oasis transactions is not supported yet.";
            console.warn(msg);
            throw new Error(msg);
          default:
            assertUnreachable(name);
        }
      } catch (err) {
        const { statusText, message } = err;
        if (statusText && statusText === "CONDITIONS_OF_USE_NOT_SATISFIED") {
          Toast.warn("Transaction rejected.");
        } else {
          const defaultMessage =
            "Could not access Ledger, or failed to send transaction. Is your device still connected and unlocked?";
          Toast.warn(message || defaultMessage);
        }

        return Actions.signTransactionFailure();
      }

      return Actions.signTransactionFailure();
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

        const body = JSON.stringify({
          tx: tx.value,
          mode: "async",
          // mode: "block", // NOTE: Use `block` to debug and `async` in production
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
        const { network } = state$.value.ledger.ledger;
        const result = await deps.cosmos.pollTransaction(txHash, network.name);

        // Try to convert the transaction result to match the GraphQL/extractor:
        const adaptedTransactionResult = adaptRawTransactionData(
          result,
          network.chainId,
        );

        if (result.error && result.error.includes("not found")) {
          logger("Transaction not found, re-polling...");
          await wait(1500);
          return Actions.pollForTransaction();
        } else if (result.logs && result.logs[0].success) {
          return Actions.transactionConfirmed(adaptedTransactionResult);
        } else {
          const rawLog = result.raw_log;
          if (typeof rawLog === "string" && rawLog.includes("out of gas")) {
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
        await wait(2500);
        return Actions.pollForTransaction();
      }
    }),
  );
};

const syncTransactionPageEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.setTransactionsPage)),
    pluck("payload"),
    tap(() => {
      const { router } = deps;
      const address = state$.value.ledger.ledger.address;
      const page = state$.value.transaction.transactionsPage;
      router.replace({
        search: `address=${address}&page=${page}`,
      });
    }),
    ignoreElements(),
  );
};

const fetchCeloPendingWithdrawalsEpic: EpicSignature = (
  action$,
  state$,
  deps,
) => {
  return action$.pipe(
    filter(isActionOf(Actions.connectLedgerSuccess)),
    filter(action => action.payload.network.name === "CELO"),
    mergeMap(async action => {
      const address = action.payload.ledgerAddress;
      const pendingWithdrawals = await deps.celoLedgerUtil.getPendingWithdrawalBalances(
        address,
      );
      return Actions.setCeloPendingWithdrawalData(pendingWithdrawals);
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
  syncTransactionPageEpic,
  fetchCeloPendingWithdrawalsEpic,
);
