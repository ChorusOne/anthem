import { Classes, H5, MenuItem, Switch, Tooltip } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import React, { ChangeEvent } from "react";
import styled from "styled-components";

import CurrencySettingsToggle from "components/CurrencySettingToggle";
import LanguageSelectMenu from "components/LanguageSelect";
import {
  Button,
  PageContainer,
  PageTitle,
  TextInput,
  View,
} from "components/SharedComponents";
import Toast from "components/Toast";
import { COLORS } from "constants/colors";
import { FiatCurrency } from "constants/fiat";
import { IThemeProps } from "containers/ThemeContainer";
import {
  FiatCurrenciesProps,
  withFiatCurrencies,
  withGraphQLVariables,
} from "graphql/queries";
import Analytics from "lib/analytics-lib";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { connect } from "react-redux";
import { composeWithProps } from "tools/context-utils";
import { validateEmailAddress } from "tools/validation-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  email: string;
  secondEmail: string;
  monthlySignupSuccess: boolean;
}

const FiatCurrencySelect = Select.ofType<FiatCurrency>();

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class SettingsPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      email: "",
      secondEmail: "",
      monthlySignupSuccess: false,
    };
  }

  componentWillUnmount() {
    this.closeTooltip();
  }

  render(): JSX.Element {
    const { email, secondEmail, monthlySignupSuccess } = this.state;
    const { i18n, settings } = this.props;
    const { t, tString } = i18n;
    const { isDarkTheme, isDesktop, fiatCurrency } = settings;
    const { newsletterSignup } = this.props.loading;
    const emailLoading = newsletterSignup;
    const { loading, error, fiatCurrencies } = this.props.fiatCurrencies;
    return (
      <PageContainer>
        <PageTitle data-cy="settings-page-title">
          Anthem {tString("Settings")}
        </PageTitle>
        <Line />
        <RowContainer>
          <H5 className={Classes.CONTROL_INDICATOR}>{t("App Theme")}</H5>
          <Row>
            <Switch
              large
              checked={isDarkTheme}
              style={{ marginTop: 10 }}
              data-cy="settings-theme-switch"
              label={
                isDarkTheme
                  ? tString("Disable Dark Theme")
                  : tString("Enable Dark Theme")
              }
              onChange={
                isDarkTheme
                  ? () => this.handleToggleTheme(false)
                  : () => this.handleToggleTheme(true)
              }
            />
          </Row>
        </RowContainer>
        <RowContainer>
          <H5 className={Classes.CONTROL_INDICATOR}>{t("App Language")}</H5>
          <Row>
            <LanguageSelectMenu
              filterable
              i18n={this.props.i18n}
              setLocale={this.props.setLocale}
            />
            <Text className={Classes.CONTROL_INDICATOR}>
              {t("Choose a language")}
            </Text>
          </Row>
        </RowContainer>
        <RowContainer>
          {loading ? (
            <View>
              <p className={Classes.CONTROL_INDICATOR}>
                {t("Loading currencies...")}
              </p>
            </View>
          ) : error ? (
            <H5 className={Classes.CONTROL_INDICATOR}>
              {t("Could not load currencies...")}
            </H5>
          ) : (
            <React.Fragment>
              <H5 className={Classes.CONTROL_INDICATOR}>
                {t("Fiat Currency")}
              </H5>
              <Row>
                <FiatCurrencySelect
                  filterable={isDesktop}
                  popoverProps={{
                    popoverClassName: "FiatCurrencySelect",
                  }}
                  items={[...fiatCurrencies]}
                  noResults={
                    <MenuItem disabled={true} text={t("No results.")} />
                  }
                  onItemSelect={fiat => this.handleSetFiatCurrency(fiat)}
                  itemRenderer={(action, { handleClick, modifiers, query }) => {
                    if (!modifiers.matchesPredicate) {
                      return null;
                    }

                    return (
                      <MenuItem
                        text={action.name}
                        key={action.symbol}
                        onClick={handleClick}
                        active={modifiers.active}
                        data-cy={`${action.symbol}-currency-option`}
                        disabled={action.symbol === fiatCurrency.symbol}
                      />
                    );
                  }}
                  itemPredicate={(query, fiat) => {
                    const normalizedTitle = fiat.name.toLowerCase();
                    const normalizedQuery = query.toLowerCase();
                    return normalizedTitle.indexOf(normalizedQuery) >= 0;
                  }}
                >
                  <Button
                    category="SECONDARY"
                    rightIcon="caret-down"
                    data-cy="settings-currency-select-menu"
                  >
                    {fiatCurrency.name}
                  </Button>
                </FiatCurrencySelect>
                <Text className={Classes.CONTROL_INDICATOR}>
                  {t("Set your display fiat currency")}
                </Text>
              </Row>
            </React.Fragment>
          )}
        </RowContainer>
        <RowContainer>
          <H5 className={Classes.CONTROL_INDICATOR}>
            {t("Fiat/Crypto Currency Setting")}
          </H5>
          <Row>
            <CurrencySettingsToggle />
          </Row>
        </RowContainer>
        <RowContainer>
          <H5 className={Classes.CONTROL_INDICATOR}>
            {t("Chorus One Newsletter")}
          </H5>
          <form
            data-cy="newsletter-signup-form"
            style={{ marginTop: 16, display: "flex", flexDirection: "row" }}
            onSubmit={this.handleChorusNewsletterSignup}
          >
            <TextInput
              value={email}
              onChange={this.setEmail}
              placeholder={tString("Email Address")}
              data-cy="settings-form-email-newsletter-input"
            />
            <Button
              type="submit"
              disabled={emailLoading}
              style={{ marginLeft: 16, width: 100 }}
            >
              {emailLoading ? t("Loading...") : t("Signup")}
            </Button>
          </form>
        </RowContainer>
        <RowContainer>
          <H5>{t("Monthly Rewards Summary Email")}</H5>
          {monthlySignupSuccess ? (
            <InfoText>{t("You have signed up!")}</InfoText>
          ) : (
            <View>
              <InfoText>
                {t(
                  "An email summary delivered every month with information on the reward earnings for your address. Please enter your email below if you would be interested in receiving this in the future.",
                )}
              </InfoText>
              <form
                data-cy="monthly-summary-signup-form"
                style={{ marginTop: 16, display: "flex", flexDirection: "row" }}
                onSubmit={this.handleMonthlyNewsletterSignup}
              >
                <TextInput
                  value={secondEmail}
                  onChange={this.handleSetSecondEmail}
                  placeholder={tString("Email Address")}
                  data-cy="settings-form-monthly-summary-input"
                />
                <Tooltip
                  position="top"
                  onClose={this.closeTooltip}
                  isOpen={this.props.app.showMonthlySignupTooltip}
                  popoverClassName="monthly-summary-email-tooltip"
                  content={<span>{t("You can signup here!")}</span>}
                >
                  <Button type="submit" style={{ marginLeft: 16, width: 130 }}>
                    {tString("I'm interested!")}
                  </Button>
                </Tooltip>
              </form>
            </View>
          )}
        </RowContainer>
      </PageContainer>
    );
  }

  setEmail = (email: string) => {
    this.setState({ email });
  };

  setSecondEmail = (secondEmail: string) => {
    if (this.props.app.showMonthlySignupTooltip) {
      this.closeTooltip();
    }

    this.setState({ secondEmail });
  };

  handleSetSecondEmail = (value: string) => {
    this.setSecondEmail(value);
  };

  handleToggleTheme = (theme: boolean) => {
    this.props.updateSetting({ isDarkTheme: theme, darkThemeEnabled: theme });
  };

  handleSetFiatCurrency = (fiat: FiatCurrency) => {
    this.props.updateSetting({
      fiatCurrency: fiat,
    });
  };

  closeTooltip = () => {
    this.props.toggleMonthlySummaryTooltip(false);
  };

  handleChorusNewsletterSignup = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { email } = this.state;
    this.props.newsletterSignup(email);
  };

  handleMonthlyNewsletterSignup = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { secondEmail } = this.state;
    const { i18n } = this.props;

    if (!validateEmailAddress(secondEmail)) {
      return Toast.warn(
        i18n.tString(
          "Could not register your email. Is your email address typed correctly?",
        ),
      );
    }

    Analytics.interestedInMonthlySummaryEmail({
      address: this.props.address,
      email: secondEmail,
    });

    this.setState({ monthlySignupSuccess: true }, () => {
      Toast.success(
        i18n.tString("Thank you! Your interest has been recorded."),
      );
      if (this.props.app.notificationsBannerVisible) {
        this.props.toggleNotificationsBanner({
          key: "monthly_summary_newsletter",
          visible: false,
        });
      }
    });
  };
}

/** ===========================================================================
 * Styles & Helpers
 * ============================================================================
 */

const RowContainer = styled.div`
  min-height: 85px;
  margin-top: 20px;
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.ADDRESS_LINE : COLORS.LIGHT_GRAY};
`;

const Row = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const Text = styled.p`
  margin: 0;
  padding: 0;
  margin-left: 12px;
`;

const InfoText = styled.p`
  margin: 0;
  padding: 0;
  width: 600px;
`;

const Line = styled.div`
  height: 1px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.ADDRESS_LINE : COLORS.LIGHT_GRAY};
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  app: Modules.selectors.app.appSelector(state),
  settings: Modules.selectors.settings(state),
  loading: Modules.selectors.app.loadingSelector(state),
  address: Modules.selectors.ledger.ledgerSelector(state).address,
});

const dispatchProps = {
  setLocale: Modules.actions.settings.setLocale,
  updateSetting: Modules.actions.settings.updateSetting,
  newsletterSignup: Modules.actions.app.newsletterSignup,
  toggleNotificationsBanner: Modules.actions.app.toggleNotificationsBanner,
  toggleMonthlySummaryTooltip: Modules.actions.app.toggleMonthlySummaryTooltip,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(
  mapStateToProps,
  dispatchProps,
);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps, FiatCurrenciesProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withGraphQLVariables,
  withFiatCurrencies,
)(SettingsPage);
