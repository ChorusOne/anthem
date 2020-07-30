import { ActionType, createStandardAction } from "typesafe-actions";
import { DotTransactionType } from "./store";

/** ===========================================================================
 * Action Types
 * ============================================================================
 */

enum ActionTypesEnum {
  OPEN_LEDGER_DIALOG = "OPEN_LEDGER_DIALOG",
  CLOSE_LEDGER_DIALOG = "CLOSE_LEDGER_DIALOG",
}

/** ===========================================================================
 * Actions
 * ============================================================================
 */

const openPolkadotDialog = createStandardAction(
  ActionTypesEnum.OPEN_LEDGER_DIALOG,
)<DotTransactionType>();

const closePolkadotDialog = createStandardAction(
  ActionTypesEnum.CLOSE_LEDGER_DIALOG,
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
