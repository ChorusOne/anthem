import { Colors } from "@blueprintjs/core";
import { FiatCurrency } from "constants/fiat";
import {
  CeloAccountBalancesProps,
  CeloValidatorsProps,
  FiatPriceDataProps,
  withCeloAccountBalances,
  withCeloValidatorGroups,
  withFiatPriceData,
  withGraphQLVariables,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {}

/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * Transaction input component which provides transaction input validation.
 * ============================================================================
 */

class CreateTransactionForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {};
  }

  render(): Nullable<JSX.Element> {
    return (
      <FormContainer>
        <p>Celo Transaction Workflow</p>
        <DividerLine />
      </FormContainer>
    );
  }
}

/** ===========================================================================
 * Styled Components
 * ============================================================================
 */

const FormContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
`;

const DividerLine = styled.div`
  height: 1px;
  margin-top: 16px;
  margin-bottom: 8px;
  width: 100%;
  border-top-width: 1px;
  border-top-style: solid;
  background: transparent;
  border-top-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY1};
`;

/** ===========================================================================
 * Export
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  ledgerDialog: Modules.selectors.ledger.ledgerDialogSelector(state),
  transaction: Modules.selectors.transaction.transactionsSelector(state),
});

const dispatchProps = {
  refetch: Modules.actions.app.refreshBalanceAndTransactions,
  closeLedgerDialog: Modules.actions.ledger.closeLedgerDialog,
  signTransaction: Modules.actions.transaction.signTransaction,
  setTransactionData: Modules.actions.transaction.setTransactionData,
  broadcastTransaction: Modules.actions.transaction.broadcastTransaction,
  setDelegationValidatorSelection:
    Modules.actions.transaction.setDelegationValidatorSelection,
};

const withProps = connect(mapStateToProps, dispatchProps);

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {
  isDarkTheme: boolean;
  fiatCurrency: FiatCurrency;
  setCanEscapeKeyCloseDialog: (canClose: boolean) => void;
  renderConfirmArrow: (text: string, callback: () => void) => void;
}

interface IProps
  extends ComponentProps,
    ConnectProps,
    CeloValidatorsProps,
    CeloAccountBalancesProps,
    FiatPriceDataProps {}

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withCeloValidatorGroups,
  withFiatPriceData,
  withCeloAccountBalances,
)(CreateTransactionForm);
