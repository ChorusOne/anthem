import { getValidatorAddressFromDelegatorAddress } from "@anthem/utils";
import {
  Classes,
  Drawer,
  Icon,
  IconName,
  Position,
  Tooltip,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { ChorusLogo } from "assets/icons";
import { NetworkLogoIcon } from "assets/images";
import { Centered, View } from "components/SharedComponents";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import {
  ValidatorsProps,
  withGraphQLVariables,
  withValidators,
} from "graphql/queries";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { connect } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import Swipy from "swipyjs";
import {
  abbreviateAddress,
  copyTextToClipboard,
  onActiveRoute,
} from "tools/client-utils";
import { composeWithProps } from "tools/context-utils";
import BetaBanner from "./BetaBanner";
import { KeyboardShortcutsPopover } from "./KeyboardShortcutsPopover";
import Toast from "./Toast";

/** ===========================================================================
 * State
 * ============================================================================
 */

interface IState {
  mobileMenuOpen: boolean;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class SideMenuComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      mobileMenuOpen: false,
    };
  }

  componentDidMount() {
    this.setupMobileSwipeHandler();
  }

  render(): JSX.Element {
    const { settings, location, i18n, ledger } = this.props;
    const { address, network } = ledger;
    const { t, tString } = i18n;
    const { pathname } = location;
    const { isDesktop } = settings;

    const { mobileMenuOpen } = this.state;
    const open = () => this.setMobileMenuState(true);
    const close = () => this.setMobileMenuState(false);

    const dashboardTab = this.props.app.activeChartTab;
    const ledgerConnected = this.props.ledger.connected;
    const validator = this.getValidatorFromDelegatorAddressIfExists();

    const HAS_ADDRESS = !!address;

    // SideMenu route navigation links.
    const TOP_ROUTE_LINKS: ReadonlyArray<JSX.Element> = [
      <NavItem
        path={pathname}
        closeHandler={close}
        key="Dashboard"
        route={`${dashboardTab}`}
        title={tString("Dashboard")}
        icon={IconNames.TIMELINE_BAR_CHART}
      />,
      <NavItem
        path={pathname}
        closeHandler={close}
        key="Staking"
        route="Delegate"
        title="Staking"
        icon={IconNames.BANK_ACCOUNT}
      />,
      // <NavItem
      //   path={pathname}
      //   closeHandler={close}
      //   key="Wallet"
      //   route="Wallet"
      //   title={tString("Wallet")}
      //   icon={IconNames.CREDIT_CARD}
      // />,
      // <NavItem
      //   path={pathname}
      //   closeHandler={close}
      //   key="Governance"
      //   route="Governance"
      //   title={tString("Governance")}
      //   icon={IconNames.OFFICE}
      // />,
    ];

    const BOTTOM_ROUTE_LINKS: ReadonlyArray<JSX.Element> = [
      address && (
        <NavItem
          path={pathname}
          closeHandler={close}
          key="Settings"
          route="Settings"
          title={tString("Settings")}
          icon={IconNames.COG}
        />
      ),
      <NavItem
        path={pathname}
        closeHandler={close}
        key="Help"
        route="Help"
        title={tString("Help")}
        icon={IconNames.INFO_SIGN}
      />,
      address && (
        <NavItem
          path={pathname}
          closeHandler={(
            e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
          ) => {
            /**
             * Prevent default link behavior since this does not need to
             * navigate to any route currently.
             */
            e.preventDefault();

            // Close the side menu and run the logout method.
            close();
            this.props.openLogoutMenu();
          }}
          key="Logout"
          route="Logout"
          title={tString("Logout")}
          icon={IconNames.LOG_OUT}
        />
      ),
    ].filter(Boolean) as ReadonlyArray<JSX.Element>;

    // Create address select component.
    const AddressSelectComponent = (
      <AddressContainer
        style={{
          marginTop: isDesktop ? 0 : 4,
          paddingLeft: isDesktop ? 20 : 12,
        }}
      >
        <AddressConnectedTextBar>
          {isDesktop && <KeyboardShortcutsPopover />}
          {ledgerConnected ? (
            <LedgerConnectedText>Ledger Connected</LedgerConnectedText>
          ) : HAS_ADDRESS ? (
            <AddressTitle>{t("Address Connected")}</AddressTitle>
          ) : (
            <AddressTitle>{t("Connect Your Address")}</AddressTitle>
          )}
        </AddressConnectedTextBar>
        <NetworkAddressContainer>
          <NetworkAddressBox
            id="link-address-button"
            onClick={() => {
              close();
              this.props.openLedgerDialog({
                signinType: "INITIAL_SETUP",
                ledgerAccessType: "SIGNIN",
              });
            }}
          >
            {isDesktop && HAS_ADDRESS && (
              <NetworkLogoIcon
                network={network.name}
                styles={{ marginRight: 8 }}
              />
            )}
            <Address data-cy="user-selected-address-bar">
              {address
                ? `${abbreviateAddress(address, 6)}`
                : t("Link Your Address")}
            </Address>
          </NetworkAddressBox>
          {HAS_ADDRESS && (
            <CopyToClipboard onCopy={this.onCopySuccess} text={address}>
              {isDesktop ? (
                <Centered style={{ marginTop: !isDesktop ? 16 : "auto" }}>
                  <Icon
                    icon="duplicate"
                    color={COLORS.LIGHT_GRAY}
                    data-cy="address-copy-to-clipboard-icon"
                    className="address-copy-to-clipboard-icon"
                    style={{ marginLeft: 8, marginRight: 8 }}
                  />
                </Centered>
              ) : (
                <MobileCopyAddressBox>
                  <Icon
                    icon="duplicate"
                    color={COLORS.LIGHT_GRAY}
                    data-cy="address-copy-to-clipboard-icon"
                    className="address-copy-to-clipboard-icon"
                    style={{ marginRight: 8 }}
                  />
                  <p style={{ margin: 0 }}>{t("Copy Address")}</p>
                </MobileCopyAddressBox>
              )}
            </CopyToClipboard>
          )}
        </NetworkAddressContainer>
        {validator && (
          <Tooltip
            usePortal={false}
            disabled={!isDesktop}
            position={Position.RIGHT}
            content={validator.operator_address}
          >
            <ValidatorOperatorLabel
              onClick={() => copyTextToClipboard(validator.operator_address)}
            >
              {renderValidatorName(validator.description.moniker)}
            </ValidatorOperatorLabel>
          </Tooltip>
        )}
        {HAS_ADDRESS && (
          <NetworkInfoText>
            <b style={{ color: COLORS.LIGHT_GRAY }}>{t("NETWORK:")}</b>{" "}
            {network.name}
          </NetworkInfoText>
        )}
      </AddressContainer>
    );

    // Render Desktop Navigation Menu:
    if (isDesktop) {
      return (
        <DesktopNavigationContainer className={Classes.DARK}>
          <View>
            <Link to={`/${this.props.app.activeChartTab}`}>
              <BetaBanner mobile={false} />
              <ChorusTitleImage src={ChorusLogo} alt="Chorus One Logo" />
            </Link>
            {TOP_ROUTE_LINKS}
          </View>
          <View>
            {BOTTOM_ROUTE_LINKS}
            {AddressSelectComponent}
          </View>
        </DesktopNavigationContainer>
      );
    } else {
      // Render Mobile Navigation Menu:
      return (
        <React.Fragment>
          <MobileNavContainer>
            <Icon
              onClick={open}
              iconSize={25}
              color={COLORS.WHITE}
              icon={IconNames.MENU}
              data-cy="hamburger-menu-button"
            />
            <BetaBanner mobile={true} />
            <ChorusTitleImage src={ChorusLogo} alt="Chorus One Logo" />
          </MobileNavContainer>
          <Drawer
            position="left"
            onClose={close}
            isOpen={mobileMenuOpen}
            title="Chorus One"
            className={Classes.DARK}
            style={{
              paddingTop: 25,
              backgroundColor: "rgb(26, 26, 39)",
            }}
          >
            {TOP_ROUTE_LINKS}
            {BOTTOM_ROUTE_LINKS}
            {AddressSelectComponent}
          </Drawer>
        </React.Fragment>
      );
    }
  }

  setMobileMenuState = (state: boolean) => {
    this.setState({
      mobileMenuOpen: state,
    });
  };

  onCopySuccess = () => {
    const { i18n } = this.props;
    const { address } = this.props.ledger;
    Toast.success(
      i18n.tString("Address {{address}} copied to clipboard", { address }),
    );
  };

  getValidatorFromDelegatorAddressIfExists = () => {
    if (!this.props.validators) {
      return;
    }

    const { validators } = this.props.validators;

    if (!validators) {
      return;
    }

    const { network, address } = this.props.ledger;

    // Short circuit if address is not set
    if (!address) {
      return null;
    }

    const validatorAddress = getValidatorAddressFromDelegatorAddress(
      address,
      network.name,
    );
    const validator = validators.find(
      v => v.operator_address === validatorAddress,
    );

    return validator;
  };

  setupMobileSwipeHandler = () => {
    // Don't do this on desktop
    if (this.props.settings.isDesktop) {
      return;
    }

    // Attach handler to the document
    const swipeHandler = new Swipy(document.documentElement);

    // Respond to swipe gestures
    swipeHandler.on("swiperight", () => {
      if (!this.state.mobileMenuOpen) {
        this.setMobileMenuState(true);
      }
    });

    // Respond to swipe gestures
    swipeHandler.on("swipeleft", () => {
      if (this.state.mobileMenuOpen) {
        this.setMobileMenuState(false);
      }
    });
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const DesktopNavigationContainer = styled.div`
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 25;
  width: 250px;
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${COLORS.NAVIGATION_BACKGROUND};
`;

const MobileNavContainer = styled.div`
  z-index: 25;
  position: fixed;
  padding-left: 16px;
  padding-right: 16px;
  top: 0;
  height: 62px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${COLORS.NAVIGATION_BACKGROUND};
`;

interface INavItemProps {
  title: string;
  icon: IconName;
  path: string;
  route: string;
  closeHandler?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const NavItem = ({ route, title, icon, path, closeHandler }: INavItemProps) => {
  const active = onActiveRoute(path, route);
  const cypressLabel = `${title.toLowerCase()}-navigation-link`;
  return (
    <Link
      onClick={closeHandler}
      data-cy={cypressLabel}
      to={`/${route.toLowerCase()}`}
    >
      <NavLinkContainer activeRoute={active}>
        <Icon
          icon={icon}
          iconSize={20}
          color={active ? COLORS.LIGHT_WHITE : COLORS.LIGHT_GRAY}
          className="nav-icon"
          style={{ marginRight: 14 }}
        />
        <NavTitle activeRoute={active}>{title}</NavTitle>
      </NavLinkContainer>
    </Link>
  );
};

const NavTitle = styled.h4`
  margin: 0;
  color: ${(props: { activeRoute: boolean }) =>
    props.activeRoute ? COLORS.LIGHT_WHITE : COLORS.LIGHT_GRAY};
`;

const LedgerConnectedText = styled.p`
  margin-bottom: 0;
  font-weight: bold;
  color: ${COLORS.CHORUS_MINT};
`;

const NetworkInfoText = styled.p`
  margin-top: 5px;
  margin-bottom: 0;
  font-size: 12px;
  color: ${COLORS.WHITE};
  margin-left: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "42px" : "auto"};
`;

const ValidatorOperatorLabel = styled.p`
  margin-top: 5px;
  margin-bottom: 0;
  font-size: 12px;
  color: ${COLORS.FOCUS};
  margin-left: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "42px" : "auto"};

  &:hover {
    cursor: pointer;
  }
`;

const NavLinkContainer = styled.div`
  height: 50px;
  padding-left: 22px;
  display: flex;
  align-items: center;

  background: ${(props: { activeRoute: boolean }) =>
    props.activeRoute
      ? `linear-gradient(
    to right,
    ${COLORS.CHORUS_BACKGROUND_INTERMEDIATE},
    ${COLORS.NAVIGATION_BACKGROUND_ACTIVE_GRADIENT_END}
  )`
      : ""};

  &:hover {
    cursor: pointer;
    background-color: ${COLORS.NAVIGATION_BACKGROUND_HOVER};
  }

  &:hover ${NavTitle} {
    color: white;
  }
`;

const AddressContainer = styled.div`
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 10px;
  display: block;
  height: 125px;
  border-top: 1px solid ${COLORS.ADDRESS_LINE};
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? COLORS.ADDRESS_BACKGROUND : undefined};
`;

const AddressTitle = styled.p`
  font-weight: bold;
  margin: 0;
`;

const ChorusTitleImage = styled.img`
  height: 35px;
  width: 150px;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
`;

const NetworkAddressContainer = styled.div`
  height: 32px;
  margin-top: 12px;
  display: flex;
  flex-direction: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? "row" : "column"};
`;

const NetworkAddressBox = styled.div`
  display: flex;
  flex-direction: row;

  &:hover {
    cursor: pointer;
  }
`;

const Address = styled.div`
  width: 145px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${COLORS.ADDRESS_LINE};

  &:hover {
    cursor: pointer;
    background-color: ${COLORS.NAVIGATION_BACKGROUND_HOVER};
  }
`;

export const AddressConnectedTextBar = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
`;

const renderValidatorName = (moniker: string) => {
  return moniker.length > 16
    ? `${moniker.slice(0, 16)}... Validator`
    : `${moniker} Validator`;
};

const MobileCopyAddressBox = styled.div`
  margin-top: 75px;
  display: flex;
  flex-direction: row;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
  app: Modules.selectors.app.appSelector(state),
  ledger: Modules.selectors.ledger.ledgerSelector(state),
  network: Modules.selectors.ledger.networkSelector(state),
});

const dispatchProps = {
  openLogoutMenu: Modules.actions.ledger.openLogoutMenu,
  openLedgerDialog: Modules.actions.ledger.openLedgerDialog,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps
  extends ComponentProps,
    ValidatorsProps,
    RouteComponentProps,
    ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withValidators,
  withRouter,
)(SideMenuComponent);
