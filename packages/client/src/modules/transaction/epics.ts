import { assertUnreachable, wait } from "@anthem/utils";
import { EpicSignature } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { combineEpics } from "redux-observable";
import { filter, ignoreElements, mergeMap, pluck, tap } from "rxjs/operators";
import { adaptRawTransactionData } from "tools/client-utils";
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
        const { cosmosLedgerUtil, celoLedgerUtil, oasisLedgerUtil } = deps;
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
              case "UPVOTE_PROPOSAL":
                const upvoteResult = await celoLedgerUtil.upvoteForProposal(
                  transactionData,
                );
                return Actions.transactionConfirmed(upvoteResult);
              case "VOTE_FOR_PROPOSAL":
                const governanceVoteResult = await celoLedgerUtil.voteForProposal(
                  transactionData,
                );
                return Actions.transactionConfirmed(governanceVoteResult);
              default: {
                throw new Error(
                  `Action ${ledgerActionType} not supported for Celo yet.`,
                );
              }
            }
          case "POLKADOT":
            return Actions.signTransactionFailure();
          case "OASIS":
            switch (ledgerActionType) {
              case "SEND":
                const transferResult = await oasisLedgerUtil.transfer(
                  transactionData,
                );
                return Actions.transactionConfirmed(transferResult);
              case "DELEGATE":
                const delegateResult = await oasisLedgerUtil.delegate(
                  transactionData,
                );
                return Actions.transactionConfirmed(delegateResult);
              case "UNDELEGATE":
                const undelegateResult = await oasisLedgerUtil.undelegate(
                  transactionData,
                );
                return Actions.transactionConfirmed(undelegateResult);
              default: {
                throw new Error(
                  `Action ${ledgerActionType} not supported for Oasis yet.`,
                );
              }
            }
          default:
            assertUnreachable(name);
        }
      } catch (err) {
        console.error(err);
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

        const result = await deps.transactionModule.broadcastTransaction(
          body,
          networkName,
        );

        return Actions.broadcastTransactionSuccess(result.txhash);
      } catch (err) {
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
        const result = await deps.transactionModule.pollTransaction(
          txHash,
          network.name,
        );

        // Try to convert the transaction result to match the GraphQL/extractor:
        const adaptedTransactionResult = adaptRawTransactionData(
          result,
          network.chainId,
        );

        if (result.error && result.error.includes("not found")) {
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
    filter(
      isActionOf([Actions.connectLedgerSuccess, Actions.transactionConfirmed]),
    ),
    filter(() => state$.value.ledger.ledger.network.name === "CELO"),
    mergeMap(async () => {
      const { address } = state$.value.ledger.ledger;
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
