import {
  assertUnreachable,
  deriveNetworkFromAddress,
  getNetworkDefinitionFromIdentifier,
  validatorAddressToOperatorAddress,
} from "@anthem/utils";
import Toast from "components/Toast";
import { LEDGER_ERRORS } from "constants/ledger-errors";
import Analytics from "lib/analytics-lib";
import StorageModule from "lib/storage-lib";
import { EpicSignature, ReduxActionTypes } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { combineEpics } from "redux-observable";
import { from } from "rxjs";
import {
  filter,
  ignoreElements,
  map,
  mergeMap,
  pluck,
  takeUntil,
  tap,
} from "rxjs/operators";
import { connectCeloAddress } from "tools/celo-ledger-utils";
import { capitalizeString, wait } from "tools/client-utils";
import { getAccAddress } from "tools/terra-library/key-utils";
import {
  validateLedgerAppVersion,
  validateNetworkAddress,
} from "tools/validation-utils";
import { isActionOf } from "typesafe-actions";
import { Actions } from "../root-actions";
import selectors, { addressSelector } from "./selectors";

/** ===========================================================================
 * Epics
 * ============================================================================
 */

const setAddressEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.setAddress)),
    map(({ payload, meta }) => {
      let setAddress = payload;
      const { tString } = i18nSelector(state$.value);
      const address = addressSelector(state$.value);

      if (payload.length > 52) {
        return Actions.searchTransactionByHash(payload);
      }

      // Convert validator address to operator addresses
      if (setAddress.includes("valoper")) {
        setAddress = validatorAddressToOperatorAddress(setAddress);
      }

      const maybeErrorMessage = validateNetworkAddress(
        setAddress,
        address,
        tString,
      );

      if (maybeErrorMessage) {
        if (meta.showToastForError) {
          Toast.warn(maybeErrorMessage);
        }

        return Actions.setAddressFailure(maybeErrorMessage);
      }

      StorageModule.setAddress(setAddress);
      StorageModule.updateRecentAddress(setAddress);
      Analytics.setAddress(setAddress);

      const network = deriveNetworkFromAddress(setAddress);

      return Actions.setAddressSuccess({
        network,
        address: setAddress,
      });
    }),
  );
};

/**
 * Epic to handle connecting a Ledger in response to various actions. Maps
 * to the connect action if the Ledger is not currently connected and
 * if the Ledger Dialog action has been dispatched.
 */
const ledgerDialogConnectionEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.openLedgerDialog)),
    pluck("payload"),
    pluck("signinType"),
    filter(x => x === "LEDGER"),
    filter(() => !state$.value.ledger.ledger.connected),
    map(() => Actions.connectLedger()),
  );
};

const connectLedgerEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.connectLedger)),
    mergeMap(() => {
      return from(
        new Promise<ReduxActionTypes>(async resolve => {
          try {
            const { ledger } = deps;
            const { signinNetworkName } = selectors.ledgerDialogSelector(
              state$.value,
            );

            const networkDefinition = getNetworkDefinitionFromIdentifier(
              signinNetworkName,
            );

            // Fail fast if the network does not have Ledger support yet.
            if (!networkDefinition.supportsLedger) {
              Toast.warn(
                `${networkDefinition.name} Network is not supported on Ledger yet.`,
              );
              return resolve(Actions.connectLedgerFailure());
            }

            let ledgerAddress;
            let ledgerAppVersion = "0.0.0";

            // TODO: Refactor this to a separate function, e.g. getAddressFromLedger
            switch (signinNetworkName) {
              case "COSMOS": {
                await ledger.connectDevice();
                ledgerAddress = await ledger.getCosmosAddress();
                ledgerAppVersion = await ledger.getCosmosAppVersion();
                break;
              }
              case "KAVA":
              case "TERRA": {
                await ledger.connectDevice();
                const pk = await ledger.getPubKey();
                if (typeof pk === "string") {
                  ledgerAddress = getAccAddress(
                    Buffer.from(pk),
                    signinNetworkName,
                  );
                } else {
                  ledgerAddress = getAccAddress(pk, signinNetworkName);
                }

                ledgerAppVersion = await ledger.getCosmosAppVersion();
                break;
              }
              case "CELO": {
                ledgerAddress = await connectCeloAddress();
                // TODO: How to get Celo App version?
                ledgerAppVersion = "1.0.1";
                break;
              }
              case "OASIS": {
                return resolve(Actions.connectLedgerFailure());
              }
              default: {
                return assertUnreachable(signinNetworkName);
              }
            }

            const network = deriveNetworkFromAddress(ledgerAddress);
            const versionValid = validateLedgerAppVersion(
              ledgerAppVersion,
              network.ledgerAppVersion,
            );

            if (!versionValid) {
              Toast.danger(
                `Invalid ${network.ledgerAppName} version! Please upgrade your ${network.ledgerAppName} Ledger application!`,
              );
              return resolve(Actions.connectLedgerFailure());
            }

            Toast.success(
              `Ledger connected to ${capitalizeString(
                signinNetworkName,
              )} Network!`,
            );

            return resolve(
              Actions.connectLedgerSuccess({
                network,
                ledgerAppVersion,
                ledgerAddress,
              }),
            );
          } catch (error) {
            console.log(error);
            let retryDelay = 500;
            const { message } = error;

            if (message === LEDGER_ERRORS.BROWSER_NOT_SUPPORTED) {
              Toast.warn("This browser is not supported.");
            } else if (
              message === LEDGER_ERRORS.COSMOS_LEDGER_SCREENSAVER_ERROR
            ) {
              const { tString } = i18nSelector(state$.value);
              Toast.warn(
                tString(
                  "The screensaver mode is currently active on the Ledger Device",
                ),
              );

              // Extend the retry delay to allow the screensaver to be dismissed
              retryDelay = 6500;
            }

            await wait(retryDelay);
            return resolve(Actions.connectLedger());
          }
        }),
        // Discard stream when the Ledger dialog is dismissed
      ).pipe(takeUntil(action$.ofType(Actions.closeLedgerDialog().type)));
    }),
  );
};

const logoutEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.confirmLogout)),
    tap(() => {
      // Remove local storage state
      StorageModule.logout();

      // Reset Apollo cache
      const { client } = deps;
      client.cache.reset();

      // Record analytics
      Analytics.logout();

      // Redirect to welcome route
      // NOTE: Welcome UI is not enabled yet
      // router.push("/welcome");

      // Render toast success message
      const { tString } = i18nSelector(state$.value);
      Toast.success(tString("Logout Success."));
    }),
    map(Actions.logoutSuccess),
  );
};

const saveAddressEpic: EpicSignature = action$ => {
  return action$.pipe(
    filter(
      isActionOf([Actions.connectLedgerSuccess, Actions.setAddressSuccess]),
    ),
    pluck("payload"),
    tap(payload => {
      let address = "";
      if ("ledgerAddress" in payload) {
        address = payload.ledgerAddress;
      } else {
        address = payload.address;
      }

      StorageModule.setAddress(address);
      StorageModule.updateRecentAddress(address);
    }),
    ignoreElements(),
  );
};

const setAddressNavigationEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.setAddressSuccess)),
    pluck("payload"),
    pluck("address"),
    tap(address => {
      const { router } = deps;
      if (!router.location.pathname.includes("dashboard") && !!address) {
        const page = state$.value.transaction.transactionsPage;
        router.push({
          pathname: "/dashboard/total/",
          search: `address=${address}&page=${page}`,
        });
      }
    }),
    ignoreElements(),
  );
};

const searchTransactionNavigationEpic: EpicSignature = (
  action$,
  state$,
  deps,
) => {
  return action$.pipe(
    filter(isActionOf(Actions.searchTransactionByHash)),
    pluck("payload"),
    tap(hash => deps.router.push({ pathname: `/txs/${hash.toLowerCase()}` })),
    ignoreElements(),
  );
};

const clearAllRecentAddressesEpic: EpicSignature = action$ => {
  return action$.pipe(
    filter(isActionOf(Actions.clearAllRecentAddresses)),
    tap(StorageModule.clearRecentAddresses),
    ignoreElements(),
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default combineEpics(
  setAddressEpic,
  ledgerDialogConnectionEpic,
  connectLedgerEpic,
  logoutEpic,
  saveAddressEpic,
  setAddressNavigationEpic,
  searchTransactionNavigationEpic,
  clearAllRecentAddressesEpic,
);
