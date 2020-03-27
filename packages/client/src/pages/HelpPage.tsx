import { Classes, H5, Tooltip } from "@blueprintjs/core";
import { Link, PageContainer, PageTitle } from "components/SharedComponents";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * React Component
 * ============================================================================
 */

const HelpPage: React.FC<IProps> = (props: IProps) => {
  const { t, tString } = props.i18n;
  return (
    <PageContainer>
      <PageTitle data-cy="help-page-title">
        {props.i18n.tString("Help")}
      </PageTitle>
      <Line />
      <RowContainer>
        <H5 className={Classes.CONTROL_INDICATOR}>{t("What is Anthem?")}</H5>
        <p>
          {t(
            "Anthem is a tool to help you earn on your cryptoassets. With Anthem, you can track your portfolio and access investment opportunities. In the first version, Anthem supports staking on Cosmos. In the future, we will add other blockchains with staking, as well as other crypto-native, non-custodial investment opportunities. To stay up-to-date, follow Chorus One on {{twitterLink}} or subscribe to our {{newsletterLink}}.",
            {
              twitterLink: (
                <Link href="https://twitter.com/chorusone">
                  {tString("Twitter")}
                </Link>
              ),
              newsletterLink: (
                <Link href="https://chorusone.substack.com/">
                  {tString("newsletter")}
                </Link>
              ),
            },
          )}
        </p>
      </RowContainer>
      <RowContainer>
        <H5 className={Classes.CONTROL_INDICATOR}>
          {t("How do I use Anthem?")}
        </H5>
        <p>
          {t(
            "You can currently use Anthem in two ways: to track your staking investment for any Cosmos address and as a Cosmos wallet by connecting your Ledger device. Paste in your address to see important metrics, stake your Atoms, or withdraw rewards with your Ledger device. {{postLink}}",
            {
              postLink: (
                <Link href="https://blog.chorus.one/anthem-intro">
                  {tString("You can also check out this introductory post.")}
                </Link>
              ),
            },
          )}
        </p>
      </RowContainer>
      <RowContainer>
        <H5 className={Classes.CONTROL_INDICATOR}>
          {t("What kind of data does Anthem display?")}
        </H5>
        <p>
          {t(
            "Anthem currently displays transaction, balance, and reward data that is relevant to a user staking on Cosmos.",
          )}
        </p>
        <ul>
          <li>
            <b>{t("Total")}: </b>
            {t(
              "Your overall portfolio value adding up available, staked, unbonding, and Atoms currently in your reward, and if applicable, commissions pool.",
            )}
          </li>
          <br />
          <li>
            <b>{t("Available")}: </b>
            {t(
              "Your balance that is sitting idle in your wallet. These are tokens that can immediately be accessed, e.g. to send to another address.",
            )}
          </li>
          <br />
          <li>
            <b>{t("Staking")}: </b>
            {t(
              "The amount of Atoms that are at stake with validators on the Cosmos Hub.",
            )}
          </li>
          <br />
          <li>
            <b>{t("Rewards")}: </b>
            {t(
              "In the balance module, rewards show you what is currently in your reward pool. In the portfolio view, the rewards chart is plotting the rewards you earned from staking tokens over time.",
            )}
          </li>
          <br />
          <li>
            <b>{t("Commissions")}: </b>
            {t(
              "If you've entered a validator address, information about commissions earned will be displayed. In the balance module, commissions show you the amount of commissions in that validator's pool. In the portfolio view, the commissions chart is plotting what that validator earned through commissions from his delegators.",
            )}
          </li>
          <br />
          <li>
            <b>{t("Unbonding")}: </b>
            {t(
              "Unbonding relates ATOMs that are in the process of being withdrawn from staking. These Atoms do not earn rewards anymore and will become liquid (available) once the unbonding period of currently 21 days finished.",
            )}
          </li>
        </ul>
      </RowContainer>
      <RowContainer>
        <H5 className={Classes.CONTROL_INDICATOR}>
          {t("Who should I contact with questions about Anthem?")}
        </H5>
        <p>
          {t(
            "Please join the Chorus One Community on {{telegramLink}} or {{discordLink}} to discuss about Anthem. You can also contact us via our Intercom plugin directly on the page. We are always looking for feedback, so please do not hesitate to contact us!",
            {
              telegramLink: (
                <Link href="https://chorus.one/telegram">
                  {tString("Telegram")}
                </Link>
              ),
              discordLink: (
                <Link href="https://chorus.one/discord">
                  {tString("Discord")}
                </Link>
              ),
            },
          )}
        </p>
      </RowContainer>
      <RowContainer>
        <H5 className={Classes.CONTROL_INDICATOR}>
          {t("What will I be able to do with Anthem in the future?")}
        </H5>
        <p>
          {t(
            "Anthem is a non-custodial interface to help you keep track of your holdings and interactions across blockchains, wallets, and smart contracts. Anthem will help you aggregate your data from different blockchains and wallets, display key metrics to you in a human-readable format, and help you access investment opportunities.",
          )}
        </p>
      </RowContainer>
      <RowContainer>
        <H5 className={Classes.CONTROL_INDICATOR}>
          {t("How can I export data from Anthem?")}
        </H5>
        <p>
          {t(
            "Anthem features a handy CSV export feature that you can use for your records, e.g. to simplify your tax filing. To get your CSV report, simply click on the “Download CSV” button in the Portfolio panel after entering an address.",
          )}
        </p>
      </RowContainer>
      <RowContainer>
        <H5 className={Classes.CONTROL_INDICATOR}>
          {t("Who is behind Anthem?")}
        </H5>
        <p>
          {t(
            "Anthem is developed by Chorus One, a startup focused on providing staking nodes and services. Please refer to {{websiteLink}} for more information.",
            {
              websiteLink: (
                <Link href="https://chorus.one">
                  {tString("the Chorus One website")}
                </Link>
              ),
            },
          )}
        </p>
      </RowContainer>
      <RowContainer id="help-page-data-integrity-disclaimer">
        <Tooltip
          position="top"
          content="Read more here"
          popoverClassName="data-integrity-label-tooltip"
          isOpen={props.app.showDataIntegrityHelpLabel}
        >
          <H5 className={Classes.CONTROL_INDICATOR}>
            Portfolio History Data Integrity Disclaimer
          </H5>
        </Tooltip>
        <p>
          The portfolio history data you see in Anthem is built up by running a
          blockchain node and manually generating a separate copy of the
          blockchain ledger history in an independent database. This process is
          resource intensive, prone to failure, and takes a long time to run.
          Several heuristics and approximations must be applied during this
          process so that the process can support the thousands of address,
          hundreds of thousands of transactions, and millions of blocks which
          exist in a typical blockchain ledger.
        </p>
        <p>
          Because of these reasons, the resulting data set represents an
          approximation of the account balance history of an address over time
          and not an exact record. You might find small deviations and
          inconsistencies in the dataset. We recommend always reviewing the data
          manually and comparing with the transaction history, which should
          represent an exact record of transactions which occurred for an
          address.
        </p>
      </RowContainer>
    </PageContainer>
  );
};

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const Line = styled.div`
  height: 1px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.ADDRESS_LINE : COLORS.LIGHT_GRAY};
`;

const RowContainer = styled.div`
  margin-top: 30px;
  max-width: 900px;
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  app: Modules.selectors.app.appSelector(state),
});

const dispatchProps = {
  setLocale: Modules.actions.settings.setLocale,
  toggleDataIntegrityHelpLabel:
    Modules.actions.app.toggleDataIntegrityHelpLabel,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(HelpPage);
