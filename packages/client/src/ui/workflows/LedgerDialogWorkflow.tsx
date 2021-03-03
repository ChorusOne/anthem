import {
  assertUnreachable,
  deriveNetworkFromAddress,
  getNetworkDefinitionFromIdentifier,
} from "@anthem/utils";
import { Classes, Colors, Dialog, H6, Icon } from "@blueprintjs/core";
import {
  ChorusLogoIconOnly,
  ChorusLogoIconOnlyIconDark,
  NetworkLogoIcon,
} from "assets/images";
import { COLORS } from "constants/colors";
import { LEDGER_ACTION_TYPE } from "modules/ledger/actions";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React, { ChangeEvent, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  formatAddressString,
  getDefaultChartTabForNetwork,
  onPath,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import { TRANSACTION_STAGES } from "tools/cosmos-transaction-utils";
import { tFnString } from "tools/i18n-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import {
  Button,
  Centered,
  Column,
  ErrorText,
  Link as HrefLink,
  LoaderBars,
  Row,
  TextInput,
  View,
} from "ui/SharedComponents";
import LoginSetup from "../LoginStart";
import NetworkSelect, { MyLedgerDoesntWorkModal } from "../NetworkSelect";
import CeloTransactionWorkflows from "./CeloTransactionWorkflows";
import CosmosTransactionWorkflows from "./CosmosTransactionWorkflows";
import OasisTransactionWorkflows from "./OasisTransactionWorkflows";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  addressFormSubmitted: boolean;
  ledgerActionAmount: string;
  manualAddressInputValue: string;
  customGasPriceSetting: boolean;
  canEscapeKeyCloseDialog: boolean;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class LedgerDialogComponents extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      addressFormSubmitted: false,
      ledgerActionAmount: "",
      manualAddressInputValue: "",
      customGasPriceSetting: false,
      canEscapeKeyCloseDialog: true,
    };
  }

  render(): JSX.Element {
    const { settings, i18n } = this.props;
    const { isDesktop, isDarkTheme } = settings;
    const ledgerConnected = this.props.ledger.connected;
    const { ledgerAccessType } = this.props.ledgerDialog;
    const dimensions = getDialogDimensions(isDesktop);
    const dialogMobilePosition = getMobileDialogPositioning(isDesktop);
    return (
      <Dialog
        autoFocus
        usePortal
        enforceFocus
        canOutsideClickClose
        style={{
          ...dimensions,
          ...dialogMobilePosition,
          borderRadius: 0,
        }}
        icon={
          isDarkTheme ? <ChorusLogoIconOnly /> : <ChorusLogoIconOnlyIconDark />
        }
        title={
          ledgerAccessType === "SIGNIN"
            ? i18n.tString("Sign In to Anthem")
            : ledgerConnected
            ? this.renderTransactionStageTitle()
            : i18n.tString("Connect your Ledger")
        }
        isOpen={this.props.ledgerDialog.dialogOpen}
        onClose={this.handleCloseDialog}
        className={isDarkTheme ? Classes.DARK : ""}
        canEscapeKeyClose={this.state.canEscapeKeyCloseDialog}
      >
        <View className={Classes.DIALOG_BODY} style={{ position: "relative" }}>
          {this.renderDialogComponent()}
        </View>
      </Dialog>
    );
  }

  renderTransactionStageTitle = (): Nullable<string> => {
    const { tString } = this.props.i18n;
    const { transactionStage } = this.props.transaction;
    const { network } = this.props.ledger;
    const { ledgerActionType } = this.props.ledgerDialog;
    const { celoCreateAccountStatus } = this.props.ledger;

    // If not null then account setup is active
    if (celoCreateAccountStatus && network.name === "CELO") {
      return "Create Celo Address Account";
    }

    return getDialogTitle(ledgerActionType, transactionStage, tString);
  };

  handleCloseDialog = () => {
    this.setState(
      {
        ledgerActionAmount: "",
      },
      () => {
        if (
          this.props.transaction.transactionStage === TRANSACTION_STAGES.SUCCESS
        ) {
          this.props.refetch();
        }

        this.props.closeLedgerDialog();
      },
    );
  };

  renderDialogComponent = () => {
    const {
      ledgerAccessType,
      showSelectNetworkOption,
    } = this.props.ledgerDialog;

    if (showSelectNetworkOption) {
      return <NetworkSelect />;
    }

    switch (ledgerAccessType) {
      case "SIGNIN":
        return this.renderSignin();
      case "PERFORM_ACTION":
        return this.renderAction();
      default:
        return null;
    }
  };

  renderSignin = () => {
    const { signinType } = this.props.ledgerDialog;
    switch (signinType) {
      case "INITIAL_SETUP":
        return this.renderInitialSetupStep();
      case "LEDGER":
        return this.renderLedgerSignin();
      case "ADDRESS":
        return this.renderAddressInputDialog();
      default:
        console.warn("Expected signinType received: ", signinType);
        return null;
    }
  };

  renderAction = () => {
    const { ledgerActionType } = this.props.ledgerDialog;

    switch (ledgerActionType) {
      case "SEND":
      case "CLAIM":
      case "DELEGATE":
      case "UNDELEGATE":
      case "WITHDRAW":
      case "VOTE_GOLD":
      case "LOCK_GOLD":
      case "UNLOCK_GOLD":
      case "REVOKE_VOTES":
      case "ACTIVATE_VOTES":
      case "UPVOTE_PROPOSAL":
      case "VOTE_FOR_PROPOSAL":
        if (!this.props.ledger.connected) {
          return this.renderLedgerSignin();
        } else {
          return this.renderTransactionForm();
        }
      default:
        console.warn("Expected ledgerActionType received: ", ledgerActionType);
        return null;
    }
  };

  handleEnterAddress = (value: string) => {
    this.setState({
      manualAddressInputValue: value,
    });
  };

  renderInitialSetupStep = () => {
    return <LoginSetup />;
  };

  renderLedgerSignin = () => {
    const { tString } = this.props.i18n;
    const { ledgerAppVersionValid } = this.props.ledger;
    const { signinNetworkName } = this.props.ledgerDialog;

    // Must have selected a signinNetworkName
    if (!signinNetworkName) {
      return null;
    }

    const network = getNetworkDefinitionFromIdentifier(signinNetworkName);
    return (
      <View>
        <Row style={{ justifyContent: "left" }}>
          <Circle />
          <H6 style={{ margin: 0 }}>
            Connect and unlock your Ledger and open the {network.ledgerAppName}{" "}
            Ledger App.
          </H6>
        </Row>
        <Row style={{ justifyContent: "left" }}>
          <Circle />
          <H6 style={{ margin: 0 }}>
            At least version v{network.ledgerAppVersion} of the{" "}
            {network.ledgerAppName} app installed.
          </H6>
        </Row>
        {signinNetworkName === "CELO" && (
          <Row style={{ justifyContent: "left" }}>
            <Circle />
            <H6 style={{ margin: 0 }}>
              Follow the steps to verify the address on the Ledger.
            </H6>
          </Row>
        )}
        <Row style={{ justifyContent: "left" }}>
          <Circle />
          <H6 style={{ margin: 0 }}>Please use Chrome or Brave browsers.</H6>
        </Row>
        <Row style={{ justifyContent: "left" }}>
          <Circle />
          <H6 style={{ margin: 0 }}>
            If you experience issues, disconnect and reconnect your Ledger.
          </H6>
        </Row>

        {ledgerAppVersionValid === false ? (
          <Centered style={{ flexDirection: "column", marginTop: 52 }}>
            <ErrorText>
              Invalid version of the {network.ledgerAppVersion} Ledger app
              found.
            </ErrorText>
            <ErrorText>
              {tString("Please install the latest version and retry.")}
            </ErrorText>
            <Button
              style={{ marginTop: 4 }}
              onClick={() =>
                this.props.openLedgerDialog({
                  signinType: "LEDGER",
                  ledgerAccessType: "SIGNIN",
                })
              }
            >
              {tString("Retry")}
            </Button>
          </Centered>
        ) : (
          <Centered style={{ marginTop: 18 }}>
            <LoaderBars style={{ padding: "12px 0" }} width={86} height={86} />
          </Centered>
        )}

        <Row style={{ justifyContent: "left" }}>
          <H6 style={{ margin: 0 }}>
            <MyLedgerDoesntWork />
          </H6>
        </Row>

        {this.renderBackArrow()}
        <HrefLink
          style={{
            right: 0,
            bottom: -16,
            position: "absolute",
          }}
          href={network.ledgerDocsLink}
        >
          <span>{network.ledgerAppName} App Docs</span>
        </HrefLink>
      </View>
    );
  };

  handleSubmitAddress = () => {
    this.setState({ addressFormSubmitted: true }, () => {
      this.props.setAddress(this.state.manualAddressInputValue, {
        showToastForError: false,
      });
    });
  };

  renderAddressInputDialog = () => {
    const { tString } = this.props.i18n;
    const { activeChartTab } = this.props.app;
    const { addressError, recentAddresses } = this.props.ledger;
    const currentAddress = this.props.ledger.address;

    // Exclude current address from the recent addresses list
    const recentAddressList = recentAddresses.filter(
      address => address !== this.props.ledger.address,
    );

    return (
      <View>
        <H6>Enter an address to get started:</H6>
        <View>
          <FormContainer>
            <form
              data-cy="address-input-form"
              onSubmit={(event: ChangeEvent<HTMLFormElement>) => {
                event.preventDefault();
                this.handleSubmitAddress();
              }}
            >
              <TextInput
                autoFocus
                data-cy="address-input"
                placeholder={tString("Enter an Address")}
                onSubmit={this.handleSubmitAddress}
                onChange={this.handleEnterAddress}
                value={this.state.manualAddressInputValue}
                style={{
                  width: this.props.settings.isDesktop ? 450 : undefined,
                }}
              />
              {this.renderConfirmArrow("Sign In", this.handleSubmitAddress)}
            </form>
          </FormContainer>
          {this.state.addressFormSubmitted && addressError && (
            <div style={{ marginTop: 12 }} className={Classes.LABEL}>
              <ErrorText>{addressError}</ErrorText>
            </div>
          )}
          {recentAddressList.length > 0 && (
            <View style={{ marginTop: 18 }}>
              <AddressSubtitle>{tString("Recent addresses:")}</AddressSubtitle>
              <Column
                style={{ marginTop: 6, height: 150, overflowY: "scroll" }}
              >
                {recentAddressList.map(address => {
                  const network = deriveNetworkFromAddress(address);

                  const formattedAddress = formatAddressString(
                    address,
                    !this.props.settings.isDesktop,
                    25,
                  );

                  const activeTab = getDefaultChartTabForNetwork(
                    activeChartTab,
                    network,
                  );

                  const addressLink = `/${network.name.toLowerCase()}/${activeTab.toLowerCase()}?address=${address}`;

                  return (
                    <Link
                      replace
                      key={address}
                      to={addressLink}
                      style={{ marginTop: 4, marginBottom: 2 }}
                    >
                      <Row style={{ justifyContent: "flex-start" }}>
                        <NetworkLogoIcon
                          network={network.name}
                          styles={{ width: 22, height: 22, marginRight: 6 }}
                        />
                        <View>
                          <NetworkLabel>{network.name}</NetworkLabel>
                          <RecentAddress>{formattedAddress}</RecentAddress>
                        </View>
                      </Row>
                    </Link>
                  );
                })}
              </Column>
              <ClearAllLink onClick={this.props.clearAllRecentAddresses}>
                {tString("Clear all addresses")}
              </ClearAllLink>
            </View>
          )}
          {!currentAddress && recentAddressList.length === 0 && (
            <View style={{ marginTop: 18 }}>
              <AddressSubtitle>
                Don't have an address on hand? Choose one below to explore a
                network you're interested in.
                <p className="note">
                  NOTE: Please do NOT send funds to these addresses.
                </p>
              </AddressSubtitle>
              <Column
                style={{ marginTop: 6, maxHeight: 85, overflowY: "scroll" }}
              >
                <Link
                  replace
                  style={{ marginTop: 2, marginBottom: 2 }}
                  to={`/cosmos/${activeChartTab.toLowerCase()}?address=cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd`}
                >
                  <Row style={{ justifyContent: "flex-start" }}>
                    <NetworkLogoIcon
                      network="COSMOS"
                      styles={{ width: 22, height: 22, marginRight: 6 }}
                    />
                    <View>
                      <NetworkLabel>COSMOS</NetworkLabel>
                      <RecentAddress>
                        {formatAddressString(
                          "cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd",
                          !this.props.settings.isDesktop,
                          25,
                        )}
                      </RecentAddress>
                    </View>
                  </Row>
                </Link>
                <Link
                  replace
                  style={{ marginTop: 2, marginBottom: 2 }}
                  to={`/oasis/${activeChartTab.toLowerCase()}?address=oasis1qrllkgqgqheus3qvq69wzsmh7799agg8lgsyecfq`}
                >
                  <Row style={{ justifyContent: "flex-start" }}>
                    <NetworkLogoIcon
                      network="OASIS"
                      styles={{ width: 22, height: 22, marginRight: 6 }}
                    />
                    <View>
                      <NetworkLabel>OASIS</NetworkLabel>
                      <RecentAddress>
                        {formatAddressString(
                          "oasis1qrllkgqgqheus3qvq69wzsmh7799agg8lgsyecfq",
                          !this.props.settings.isDesktop,
                          25,
                        )}
                      </RecentAddress>
                    </View>
                  </Row>
                </Link>
              </Column>
            </View>
          )}
          {this.renderBackArrow()}
        </View>
      </View>
    );
  };

  goBack = () => {
    this.props.openLedgerDialog({
      signinType: "INITIAL_SETUP",
      ledgerAccessType: "SIGNIN",
    });
  };

  renderBackArrow = () => {
    const { transaction } = this.props;

    let backMethod: () => void = () => null;

    /**
     * Disable the back option on the /landing page, otherwise render the back
     * button conditionally based on where the user is in the dialog flows.
     */
    if (onPath("/landing", window.location.pathname)) {
      return null;
    } else if (this.props.ledgerDialog.ledgerAccessType === "PERFORM_ACTION") {
      const { signPending, transactionStage } = transaction;
      if (transactionStage === TRANSACTION_STAGES.SIGN && !signPending) {
        backMethod = () => {
          this.props.setTransactionStage(TRANSACTION_STAGES.SETUP);
        };
      } else {
        return null;
      }
    } else {
      backMethod = this.goBack;
    }

    return (
      <Button
        data-cy="ledger-dialog-back-button"
        onClick={backMethod}
        style={{
          bottom: -16,
          position: "absolute",
        }}
      >
        <BackArrow /> {this.props.i18n.tString("Back")}
      </Button>
    );
  };

  renderConfirmArrow = (text: string, callback: () => void) => {
    return (
      <Button
        data-cy="ledger-dialog-confirmation-button"
        onClick={callback}
        style={{
          right: 0,
          bottom: -16,
          position: "absolute",
        }}
      >
        {text}
      </Button>
    );
  };

  renderTransactionForm = () => {
    const { network } = this.props.ledger;
    switch (network.name) {
      case "COSMOS":
      case "KAVA":
      case "TERRA":
        return (
          <>
            <CosmosTransactionWorkflows
              renderConfirmArrow={this.renderConfirmArrow}
              isDarkTheme={this.props.settings.isDarkTheme}
              fiatCurrency={this.props.settings.fiatCurrency}
              setCanEscapeKeyCloseDialog={this.setCanEscapeKeyCloseDialog}
            />
            {this.renderBackArrow()}
          </>
        );
      case "CELO":
        return (
          <>
            <CeloTransactionWorkflows
              renderConfirmArrow={this.renderConfirmArrow}
              isDarkTheme={this.props.settings.isDarkTheme}
              fiatCurrency={this.props.settings.fiatCurrency}
              setCanEscapeKeyCloseDialog={this.setCanEscapeKeyCloseDialog}
            />
            {this.renderBackArrow()}
          </>
        );
      case "OASIS":
        return (
          <>
            <OasisTransactionWorkflows
              renderConfirmArrow={this.renderConfirmArrow}
              isDarkTheme={this.props.settings.isDarkTheme}
              fiatCurrency={this.props.settings.fiatCurrency}
              setCanEscapeKeyCloseDialog={this.setCanEscapeKeyCloseDialog}
            />
            {this.renderBackArrow()}
          </>
        );
      case "POLKADOT":
        return null;
      default:
        assertUnreachable(network.name);
    }
  };

  setCanEscapeKeyCloseDialog = (canClose: boolean) => {
    this.setState({ canEscapeKeyCloseDialog: canClose });
  };
}

const StyledMyLedgerDoesntWorkLink = styled.span`
  display: block;
  color: #ffffff;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 0 39px rgba(0, 0, 0, 0.2);
  padding: 6px 10%;
  background: #1d818b;
  text-align: center;
  font-weight: normal;

  &:hover {
    opacity: 0.7;
  }
`;

const MyLedgerDoesntWork = () => {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  return (
    <>
      <StyledMyLedgerDoesntWorkLink onClick={() => setShouldShowModal(true)}>
        Is your ledger not working? You might need to adjust some settings on
        your browser.
      </StyledMyLedgerDoesntWorkLink>

      {shouldShowModal && (
        <MyLedgerDoesntWorkModal setShouldShowModal={setShouldShowModal} />
      )}
    </>
  );
};

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const getDialogDimensions = (isDesktop: boolean) => {
  return isDesktop
    ? {
        width: 515,
        height: 425,
      }
    : {
        width: "95vw",
        height: "auto",
        minHeight: 400,
      };
};

const getMobileDialogPositioning = (
  isDesktop: boolean,
): React.CSSProperties => {
  const mobileStyles: React.CSSProperties = {
    position: "absolute",
    top: 45,
  };

  if (isDesktop) {
    return {};
  } else {
    return mobileStyles;
  }
};

const FormContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
`;

const Circle = styled.div`
  width: 12px;
  height: 12px;
  margin: 8px;
  border-width: 1px;
  border-radius: 50%;
  border-style: solid;
  border-color: ${COLORS.CTA};
  flex-shrink: 0;
`;

const BackArrow = () => (
  <Icon
    icon="arrow-left"
    color={COLORS.LIGHT_WHITE}
    style={{ marginLeft: 4, marginRight: 4 }}
  />
);

const AddressSubtitle = styled.b`
  .note {
    margin: 12px 0;
  }
`;

const ClearAllLink = styled.p`
  width: 150px;
  margin-top: 8px;
  font-weight: 100;
  color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.LIGHT_GRAY3 : Colors.DARK_GRAY1};

  &:hover {
    cursor: pointer;
    color: ${COLORS.ERROR_LIGHT};
  }
`;

const NetworkLabel = styled.p`
  margin: 0;
  padding: 0;
  width: 75px;
  font-weight: bold;
  font-size: 9px;
  margin-bottom: -6px;
  color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.LIGHT_GRAY1 : Colors.DARK_GRAY5};
`;

const RecentAddress = styled.p`
  margin: 0;
  padding: 0;
`;

const getDialogTitle = (
  ledgerActionType: Nullable<LEDGER_ACTION_TYPE>,
  transactionStage: TRANSACTION_STAGES,
  tString: tFnString,
) => {
  let transactionTitle = "";
  if (ledgerActionType === "DELEGATE") {
    transactionTitle = "Delegation";
  } else if (ledgerActionType === "CLAIM") {
    transactionTitle = "Rewards Claim";
  } else if (ledgerActionType === "SEND") {
    transactionTitle = "Send/Receive";
  } else if (ledgerActionType === "VOTE_GOLD") {
    transactionTitle = "CELO Vote";
  } else if (ledgerActionType === "LOCK_GOLD") {
    transactionTitle = "Lock CELO";
  } else if (ledgerActionType === "UNLOCK_GOLD") {
    transactionTitle = "Unlock CELO";
  } else if (ledgerActionType === "WITHDRAW") {
    transactionTitle = "Withdraw";
  } else if (ledgerActionType === "ACTIVATE_VOTES") {
    transactionTitle = "Activate Votes";
  } else if (ledgerActionType === "REVOKE_VOTES") {
    transactionTitle = "Revoke Votes";
  } else if (ledgerActionType === "UPVOTE_PROPOSAL") {
    transactionTitle = "Upvote Proposal";
  } else if (ledgerActionType === "VOTE_FOR_PROPOSAL") {
    transactionTitle = "Vote For Proposal";
  }

  if (transactionStage === TRANSACTION_STAGES.SETUP) {
    return `Setup ${transactionTitle} Transaction`;
  } else if (transactionStage === TRANSACTION_STAGES.SIGN_ON_LEDGER) {
    return `Sign on Ledger`;
  } else if (transactionStage === TRANSACTION_STAGES.SIGN) {
    return `Sign ${transactionTitle} Transaction`;
  } else if (transactionStage === TRANSACTION_STAGES.CONFIRM) {
    return `Submit ${transactionTitle} Transaction`;
  } else if (transactionStage === TRANSACTION_STAGES.PENDING) {
    return `${transactionTitle} Transaction Submitted`;
  } else if (transactionStage === TRANSACTION_STAGES.SUCCESS) {
    return `${transactionTitle} Transaction Confirmed`;
  }

  return "";
};

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  app: Modules.selectors.app.appSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  ledgerDialog: Modules.selectors.ledger.ledgerDialogSelector(state),
  transaction: Modules.selectors.transaction.transactionsSelector(state),
});

const dispatchProps = {
  ...Modules.actions.ledger,
  ...Modules.actions.transaction,
  refetch: Modules.actions.app.refreshBalanceAndTransactions,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

const withProps = connect(mapStateToProps, dispatchProps);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(
  LedgerDialogComponents,
);
