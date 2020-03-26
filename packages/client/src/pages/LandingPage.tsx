import { Colors, H1, Icon } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

import { ChorusLogoDark } from "assets/icons";
import {
  BitcoinTreesImage,
  ConnectIcon,
  EarnIcon,
  HeroBackgroundImage,
  HeroIllustrationImage,
  LaptopImage,
  ObserveIcon,
  PlayIcon,
  TreesImage,
} from "assets/images";
import LanguageSelectMenu from "components/LanguageSelect";
import LoginStart from "components/LoginStart";
import { Row, View } from "components/SharedComponents";
import { COLORS } from "constants/colors";
import { catalogs } from "i18n/catalog";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import { connect } from "react-redux";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const linkProps = {
  target: "__blank",
  rel: "noopener noreferrer",
};

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class LandingPage extends React.Component<IProps, {}> {
  loginRef: any;

  constructor(props: IProps) {
    super(props);
    this.loginRef = React.createRef();
  }

  render(): JSX.Element {
    const { t } = this.props.i18n;
    return (
      <View style={{ position: "relative" }}>
        <HeroBackgroundImage />
        <Header>
          <ChorusTitleImage src={ChorusLogoDark} alt="Chorus One Logo" />
          <Row style={{ zIndex: 5 }}>
            {this.renderLanguageSelectMenu()}
            <HeaderText
              onClick={this.scrollToLogin}
              data-cy="landing-page-header-login-text"
            >
              {t("Login")}
            </HeaderText>
          </Row>
        </Header>
        <IntroContainer>
          {this.renderTitleTextBox()}
          <HeroIllustrationImage />
          <LaptopImage />
        </IntroContainer>
        <OptimizeContainer>
          <OptimizeTitle>Optimize Your Staking</OptimizeTitle>
          <OptimizeSubTitle>
            Anthem is a non-custodial, multi-network staking platform designed
            to help you grow your crypto holdings.
          </OptimizeSubTitle>
          {this.renderCardsRow()}
        </OptimizeContainer>
        <LoginContainer ref={this.loginRef}>
          <LoginStart />
          <TreesImage />
          <BitcoinTreesImage />
        </LoginContainer>
        <LinksContainer>
          <React.Fragment>
            <ChorusTitleImage src={ChorusLogoDark} alt="Chorus One Logo" />
          </React.Fragment>
          {this.renderContentLinks()}
        </LinksContainer>
        <Footer>
          <FooterText>{t("Anthem 2019-2020. All Rights Reserved.")}</FooterText>
          {this.renderFooterLinks()}
        </Footer>
      </View>
    );
  }

  renderLanguageSelectMenu = () => {
    return (
      <LanguageSelectMenu
        i18n={this.props.i18n}
        setLocale={this.props.setLocale}
        filterable={this.props.settings.isDesktop}
        customMenuButton={
          <HeaderText>
            <Icon
              icon="translate"
              color={COLORS.DARK_TITLE}
              style={{ marginRight: 6 }}
            />
            {catalogs[this.props.i18n.locale].language}
          </HeaderText>
        }
      />
    );
  };

  renderTitleTextBox = () => {
    const { t } = this.props.i18n;
    return (
      <TitleContainer>
        <H1 style={{ color: COLORS.DARK_TITLE }} data-cy="login-page-title">
          {t("Earn Rewards on Cryptoassets")}
        </H1>
        <TitleSubText>
          Anthem makes it easy to manage your staking portfolio across multiple
          networks.
        </TitleSubText>
        <PlayTitleRow
          data-cy="landing-page-play-login-button"
          onClick={this.scrollToLogin}
          style={{ justifyContent: "start" }}
        >
          <PlayIcon />
          <PlayText>{t("GET STARTED")}</PlayText>
        </PlayTitleRow>
      </TitleContainer>
    );
  };

  renderCardsRow = () => {
    const { t } = this.props.i18n;
    return (
      <CardsContainer>
        <Card>
          <ConnectIcon />
          <CardTitleText>{t("Connect")}</CardTitleText>
          <CardText>
            Track your portfolio over time on supported networks.
          </CardText>
        </Card>
        <Card>
          <EarnIcon />
          <CardTitleText>{t("Earn")}</CardTitleText>
          <CardText>Stake your tokens and increase your holdings.</CardText>
        </Card>
        <Card>
          <ObserveIcon />
          <CardTitleText>{t("Manage")}</CardTitleText>
          <CardText>
            Analyze the performance of your investments and comply with
            regulations.
          </CardText>
        </Card>
      </CardsContainer>
    );
  };

  renderContentLinks = () => {
    const { t } = this.props.i18n;
    return (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <LinksColumn>
          <LinksTitle>{t("Company")}</LinksTitle>
          <TextLink href="https://chorus.one" {...linkProps}>
            {t("Website")}
          </TextLink>
          <TextLink href="https://chorus.one/about" {...linkProps}>
            {t("About")}
          </TextLink>
          <TextLink href="https://chorus.one/careers" {...linkProps}>
            {t("Careers")}
          </TextLink>
        </LinksColumn>
        <LinksColumn>
          <LinksTitle>{t("Content")}</LinksTitle>
          <TextLink href="https://chorusone.libsyn.com/" {...linkProps}>
            {t("Podcast")}
          </TextLink>
          <TextLink href="https://medium.com/chorus-one" {...linkProps}>
            {t("Medium")}
          </TextLink>
          <TextLink href="https://chorus.one/youtube" {...linkProps}>
            {t("YouTube")}
          </TextLink>
        </LinksColumn>
        <LinksColumn>
          <LinksTitle>{t("Community")}</LinksTitle>
          <TextLink href="https://chorus.one/telegram" {...linkProps}>
            {t("Telegram")}
          </TextLink>
          <TextLink href="https://twitter.com/chorusone" {...linkProps}>
            {t("Twitter")}
          </TextLink>
          <TextLink href="https://discord.gg/bQ6JWVa" {...linkProps}>
            {t("Discord")}
          </TextLink>
        </LinksColumn>
      </View>
    );
  };

  renderFooterLinks = () => {
    const { t } = this.props.i18n;
    return (
      <Row style={{ width: 200, justifyContent: "start" }}>
        <FooterTextLink href="https://chorus.one/cosmos/tos/" {...linkProps}>
          {t("Terms of Service")}
        </FooterTextLink>
        <FooterTextLink
          style={{ marginLeft: 12 }}
          href="https://www.iubenda.com/privacy-policy/14091123"
          {...linkProps}
        >
          {t("Privacy Policy")}
        </FooterTextLink>
      </Row>
    );
  };

  scrollToLogin = () => {
    this.loginRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  };
}

/** ===========================================================================
 * Styles and Helpers
 * ============================================================================
 */

const Header = styled.div`
  z-index: 3;
  width: 100%;
  height: 72px;
  display: flex;
  padding-left: 50px;
  padding-right: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: transparent;

  @media (max-width: 768px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const Footer = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  padding-left: 45px;
  padding-right: 105px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${COLORS.DARK_THEME_BACKGROUND};

  @media (max-width: 768px) {
    padding-left: 15px;
    padding-right: 0;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
`;

const HeaderText = styled.p`
  margin-left: 16px;
  margin-right: 16px;
  font-size: 14px;
  font-weight: bold;
  color: ${COLORS.DARK_TITLE};

  &:hover {
    cursor: pointer;
  }
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${COLORS.LIGHT_GRAY};

  @media (max-width: 768px) {
    margin-bottom: 4px;
  }
`;

const FooterTextLink = styled.a`
  margin: 0;
  font-size: 12px;
  color: ${COLORS.LIGHT_GRAY};

  &:hover {
    color: ${COLORS.LIGHT_WHITE};
  }
`;

const IntroContainer = styled.div`
  z-index: 2;
  width: 100%;
  height: 725px;
  position: relative;

  @media (max-width: 768px) {
    height: 425px;
  }
`;

const OptimizeContainer = styled.div`
  z-index: 2;
  width: 100%;
  height: auto;
  padding-top: 125px;
  padding-bottom: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    padding-top: 145px;
    padding-bottom: 25px;
  }

  @media (max-width: 600px) {
    padding-top: 25px;
    padding-bottom: 25px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OptimizeTitle = styled.h1`
  text-align: center;
  color: ${COLORS.DARK_TITLE};
  padding-left: 24px;
  padding-right: 24px;
`;

const OptimizeSubTitle = styled.p`
  font-size: 16px;
  text-align: center;
  margin-bottom: 32px;
  max-width: 500px;
  padding-left: 24px;
  padding-right: 24px;
  font-weight: 100;
  color: ${COLORS.DARK_TITLE};
`;

const LoginContainer = styled.div`
  position: relative;
  padding-top: 100px;
  padding-bottom: 100px;
  width: 100%;
  height: auto;
  background: ${Colors.LIGHT_GRAY4};

  @media (max-width: 600px) {
    padding-top: 24px;
    padding-bottom: 24px;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-top: 58px;
  padding-left: 125px;
  padding-right: 125px;
  width: 100%;
  height: 225px;
  position: relative;
  background: ${Colors.LIGHT_GRAY4};
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: ${Colors.LIGHT_GRAY1};

  @media (max-width: 768px) {
    padding: 32px;
    flex-direction: column;
  }
`;

const TitleContainer = styled.div`
  position: absolute;
  top: 125px;
  left: 135px;
  z-index: 10;
  display: flex;
  flex-direction: column;

  @media (max-width: 1100px) {
    width: 325px;
  }

  @media (max-width: 600px) {
    top: 25px;
    left: 25px;
  }
`;

const TitleSubText = styled.p`
  margin-top: 8px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 100;
  max-width: 300px;
  color: ${COLORS.DARK_TITLE};
`;

const PlayTitleRow = styled.div`
  width: 150px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
`;

const PlayText = styled.b`
  margin-left: 12px;
  color: ${COLORS.PRIMARY};
`;

const ChorusTitleImage = styled.img`
  z-index: 5;
  height: 36px;

  @media (max-width: 768px) {
    width: 130px;
  }
`;

const Card = styled.div`
  margin-left: 36px;
  margin-right: 36px;
  width: 225px;
  height: 225px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 28px;
  border-width: 1px;
  border-style: solid;
  border-color: ${COLORS.CARD_BORDER};
  box-shadow: 1px 2px 6px 6px ${COLORS.BOX_SHADOW};

  @media (max-width: 768px) {
    margin: 12px;
  }
`;

const CardTitleText = styled.b`
  margin-top: 12px;
  margin-bottom: 12px;
  color: ${COLORS.DARK_TITLE};
`;

const CardText = styled.p`
  font-size: 13px;
  font-weight: 100;
  text-align: center;
  color: ${COLORS.DARK_TITLE};
`;

const LinksColumn = styled.div`
  height: 105px;
  margin-left: 36px;
  margin-right: 36px;
  display: flex;
  align-items: left;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    margin-left: 0px;
    margin-right: 24px;
  }
`;

const LinksTitle = styled.b`
  color: ${COLORS.DARK_TITLE};
`;

const TextLink = styled.a`
  font-weight: 100;
  color: ${COLORS.DARK_TITLE};

  &:hover {
    color: ${COLORS.PRIMARY};
  }
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  settings: Modules.selectors.settings(state),
});

const dispatchProps = {
  setLocale: Modules.actions.settings.setLocale,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(
  mapStateToProps,
  dispatchProps,
);

interface ComponentProps {}

interface IProps extends ComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(withProps)(LandingPage);
