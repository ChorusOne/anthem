// import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair } from "@polkadot/keyring/types";
import stringToU8a from "@polkadot/util/string/toU8a";
import axios from "axios";
import { EpicSignature } from "modules/root";
import { combineEpics } from "redux-observable";
import {
  delay,
  filter,
  ignoreElements,
  mapTo,
  pluck,
  tap,
} from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import { Actions } from "../root-actions";

/** ===========================================================================
 * Epics
 * ============================================================================
 */

/**
 * Placeholder epic.
 */
const createAccountEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.openPolkadotDialog)),
    tap(async () => {
      try {
        const key = "Fred";
        const seed = key.padEnd(32, " ");
        console.log(`Creating new Polkadot Account from Seed: ${key}`);
        const account = await createAccountFromSeed(seed);
        console.log("Account Result:");
        console.log(account);
      } catch (err) {
        console.error(err);
      }
    }),
    ignoreElements(),
  );
};

/**
 * Delay and then set the transaction stage to CONFIRMED.
 */
const mockConfirmEpic: EpicSignature = (action$, state$, deps) => {
  return action$.pipe(
    filter(isActionOf(Actions.setTransactionStage)),
    pluck("payload"),
    filter(x => x === "SIGN"),
    delay(3000),
    mapTo(Actions.setTransactionStage("CONFIRMED")),
  );
};

/** ===========================================================================
 * Utils
 * ============================================================================
 */

// Handy helper for emulating FlowJS style Opaque types. This is just so that
// type aliases cannot be interchanged. I.E: ControllerKey != StashKey.
type Opaque<K, V> = V & { __OPAQUE__: K };

// Ed25519 Pubkey.
type Pubkey = string;
type SecretKey = string;

interface Keypair {
  keyringPair: KeyringPair;
  mnemonic: string;
}

// Unique types for each kind of Pubkey Polkadot might use.
type ControllerKey = Opaque<"ControllerKey", Keypair>;
type StashKey = Opaque<"StashKey", Pubkey>;

const createAccountFromSeed = async (seed: string) => {
  // const WS_PROVIDER_URL: string = "wss://kusama-rpc.polkadot.io/";
  // const wsProvider = new WsProvider(WS_PROVIDER_URL);
  // const api: ApiPromise = await ApiPromise.create({ provider: wsProvider });

  const keyring: Keyring = new Keyring({ type: "ed25519" });
  const stashKey = keyring.addFromSeed(stringToU8a(seed));
  const account = await fetchAccount(stashKey.address);
  return account;

  // api.tx.staking.setController(controllerKey).signAndSend(stashKey);
};

const fetchAccount = async (stashKey: string) => {
  try {
    const SERVER_URL = "https://ns3169927.ip-51-89-192.eu";
    const url = `${SERVER_URL}/account/${stashKey}`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error(`Error fetching account state: ${err.message}`);
    throw err;
  }
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default combineEpics(createAccountEpic, mockConfirmEpic);
