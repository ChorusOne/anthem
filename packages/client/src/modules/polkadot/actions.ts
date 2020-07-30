import { ActionType, createStandardAction } from "typesafe-actions";
import { DotTransactionType } from "./store";

/** ===========================================================================
 * Action Types
 * ============================================================================
 */

enum ActionTypesEnum {
  OPEN_POLKADOT_DIALOG = "OPEN_POLKADOT_DIALOG",
  CLOSE_POLKADOT_DIALOG = "CLOSE_POLKADOT_DIALOG",
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

const actions = {
  openPolkadotDialog,
  closePolkadotDialog,
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export type ActionTypes = ActionType<typeof actions>;

export default actions;
