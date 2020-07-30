import { ActionType, createStandardAction } from "typesafe-actions";
import { DotTransactionStage, DotTransactionType } from "./store";

/** ===========================================================================
 * Action Types
 * ============================================================================
 */

enum ActionTypesEnum {
  OPEN_POLKADOT_DIALOG = "OPEN_POLKADOT_DIALOG",
  CLOSE_POLKADOT_DIALOG = "CLOSE_POLKADOT_DIALOG",
  SET_POLKADOT_TRANSACTION_STAGE = "SET_POLKADOT_TRANSACTION_STAGE",
}

/** ===========================================================================
 * Actions
 * ============================================================================
 */

const openPolkadotDialog = createStandardAction(
  ActionTypesEnum.OPEN_POLKADOT_DIALOG,
)<DotTransactionType>();

const closePolkadotDialog = createStandardAction(
  ActionTypesEnum.CLOSE_POLKADOT_DIALOG,
)();

const setTransactionStage = createStandardAction(
  ActionTypesEnum.SET_POLKADOT_TRANSACTION_STAGE,
)<DotTransactionStage>();

const actions = {
  openPolkadotDialog,
  closePolkadotDialog,
  setTransactionStage,
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export type ActionTypes = ActionType<typeof actions>;

export default actions;
