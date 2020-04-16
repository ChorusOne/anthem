import Toast from "components/Toast";
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
import {
  assertUnreachable,
  capitalizeString,
  deriveNetworkFromAddress,
  validatorAddressToOperatorAddress,
  wait,
} from "tools/generic-utils";
import { getAccAddress } from "tools/terra-library/key-utils";
import {
  validateCosmosAddress,
  validateCosmosAppVersion,
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

      const maybeErrorMessage = validateCosmosAddress(
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

const ledgerDialogConnectionEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.openLedgerDialog)),
    pluck("payload"),
    map(payload => {
      if (
        payload.signinType === "LEDGER" &&
        payload.ledgerAccessType === "SIGNIN"
      ) {
        return Actions.connectLedger();
      } else {
        return Actions.empty();
      }
    }),
  );
};

const connectCosmosLedgerEpic: EpicSignature = (action$, state$, deps) => {
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

            let cosmosSdkAddress;
            switch (signinNetworkName) {
              case "COSMOS": {
                cosmosSdkAddress = await ledger.getCosmosAddress();
                break;
              }
              case "KAVA":
              case "TERRA": {
                const pk = await ledger.getPubKey();
                if (typeof pk === "string") {
                  cosmosSdkAddress = getAccAddress(
                    Buffer.from(pk),
                    signinNetworkName,
                  );
                } else {
                  cosmosSdkAddress = getAccAddress(pk, signinNetworkName);
                }

                break;
              }
              case "OASIS": {
                Toast.warn("Oasis Network is not supported on Ledger yet.");
                return resolve(Actions.connectLedgerFailure());
              }
              default: {
                return assertUnreachable(signinNetworkName);
              }
            }

            const cosmosAppVersion = await ledger.getCosmosAppVersion();
            const network = deriveNetworkFromAddress(cosmosSdkAddress);
            const versionValid = validateCosmosAppVersion(cosmosAppVersion);

            if (!versionValid) {
              Toast.danger(
                "Invalid Cosmos app version. Please upgrade your Cosmos Ledger application!",
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
                cosmosAppVersion,
                cosmosAddress: cosmosSdkAddress,
              }),
            );
          } catch (error) {
            const SCREENSAVER_MODE_ERROR = "Ledger's screensaver mode is on";
            const { message } = error;

            let retryDelay = 500;
            if (message === SCREENSAVER_MODE_ERROR) {
              const { tString } = i18nSelector(state$.value);
              Toast.warn(
                tString(
                  "The screensaver mode is currently active on the Ledger Device",
                ),
              );

              // Extend the retry delay
              retryDelay = 6500;
            }

            await wait(retryDelay);
            return resolve(Actions.connectLedger());
          }
        }),
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
      if ("cosmosAddress" in payload) {
        address = payload.cosmosAddress;
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
    tap(address => {
      const { router } = deps;
      if (!router.location.pathname.includes("dashboard") && !!address) {
        console.log("HI!");
        router.push({
          pathname: "/dashboard/total/",
          search: `?address=${address}`,
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
  connectCosmosLedgerEpic,
  logoutEpic,
  saveAddressEpic,
  setAddressNavigationEpic,
  searchTransactionNavigationEpic,
  clearAllRecentAddressesEpic,
);
