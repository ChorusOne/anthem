import { NETWORK_NAME } from "@anthem/utils";
import { CosmosLogo, KavaLogo, OasisLogo, TerraLogo } from "assets/icons";
import React from "react";
import styled, { CSSProperties } from "styled-components";
import { ReactComponent as ChorusLogoIconOnlyDark } from "../assets/chorus/C1_logo_simple_black.svg";
import { ReactComponent as ChorusLogoIconOnlyLight } from "../assets/chorus/C1_logo_simple_white.svg";
import { ReactComponent as AddressIconSvg } from "../assets/landing-page/address-icon.svg";
import { ReactComponent as LedgerIconSvg } from "../assets/landing-page/ledger-icon.svg";

/** ===========================================================================
 * Images
 * ----------------------------------------------------------------------------
 * - Definitions of images used throughout the dashboard
 * - TODO: Add configuration to pass custom prop styles to these exported
 *         image components.
 * - NOTE: There are some issues styling svg elements directly so some
 *         of these have custom CSS styles applied via class names
 * ============================================================================
 */

export const HeroBackgroundImage = () => (
  <HeroIllustrationImageBackgroundSvg
    alt="Hero Background Shadow"
    src={require("../assets/landing-page/hero-bg.svg")}
  />
);

export const HeroIllustrationImage = () => (
  <HeroIllustrationImageSvg
    alt="Hero Illustration"
    src={require("../assets/landing-page/hero-illustration.svg")}
  />
);

export const LaptopImage = () => (
  <LaptopImageBase
    alt="Laptop"
    src={require("../assets/landing-page/laptop.png")}
  />
);

export const TreesImage = () => (
  <LoginContainerImagesBase
    style={{ left: 35 }}
    alt="Crypto Tress Artwork"
    src={require("../assets/landing-page/trees.svg")}
  />
);

export const BitcoinTreesImage = () => (
  <LoginContainerImagesBase
    style={{ right: 35 }}
    alt="Bitcoin Artwork"
    src={require("../assets/landing-page/bitcoin-flowers.svg")}
  />
);

export const EarnIcon = () => (
  <Image
    width={32}
    alt="Earn"
    src={require("../assets/landing-page/earn-icon.svg")}
  />
);

export const ConnectIcon = () => (
  <Image
    width={32}
    alt="Connect"
    src={require("../assets/landing-page/connect-icon.svg")}
  />
);

export const ObserveIcon = () => (
  <Image
    width={32}
    alt="Observe"
    src={require("../assets/landing-page/observe-icon.svg")}
  />
);

export const PlayIcon = () => (
  <Image
    width={36}
    alt="Observe"
    src={require("../assets/landing-page/play-icon.svg")}
  />
);

export const TxChangeValidatorIcon = () => (
  <Image
    width={32}
    alt="Validator Icon"
    src={require("../assets/transactions/change-validator.svg")}
  />
);

export const TxReceiveIcon = () => (
  <Image
    width={32}
    alt="Validator Icon"
    src={require("../assets/transactions/receive-icon.svg")}
  />
);

export const TxRewardWithdrawalIcon = () => (
  <Image
    width={32}
    alt="Validator Icon"
    src={require("../assets/transactions/reward-withdrawal.svg")}
  />
);

export const TxSendIcon = () => (
  <Image
    width={32}
    alt="Validator Icon"
    src={require("../assets/transactions/send-icon.svg")}
  />
);

export const TxStakeIcon = () => (
  <Image
    width={32}
    alt="Validator Icon"
    src={require("../assets/transactions/stake-icon.svg")}
  />
);

export const TxVoteIcon = () => (
  <Image
    width={32}
    alt="Validator Icon"
    src={require("../assets/transactions/vote-icon.svg")}
  />
);

export const TxWithdrawalStakeIcon = () => (
  <Image
    width={32}
    alt="Validator Icon"
    src={require("../assets/transactions/withdrawal-stake.svg")}
  />
);

export const CopyIcon = () => (
  <Image
    width={22}
    alt="Clipboard Copy Icon"
    src={require("../assets/transactions/copy-icon.svg")}
  />
);

export const LinkIcon = () => (
  <Image
    width={18}
    alt="Clipboard Copy Icon"
    src={require("../assets/transactions/link-icon.svg")}
  />
);

export const LedgerIcon = () => <LedgerIconSvg width={28} />;

export const AddressIcon = () => <AddressIconSvg width={28} />;

export const ChorusLogoIconOnly = () => (
  <ChorusLogoIconOnlyLight
    width={28}
    style={{ marginLeft: 0, marginRight: 16 }}
  />
);

export const ChorusLogoIconOnlyIconDark = () => (
  <ChorusLogoIconOnlyDark
    width={28}
    style={{ marginLeft: 0, marginRight: 16 }}
  />
);

export const NetworkLogoIcon = ({
  network,
  styles,
}: {
  network: NETWORK_NAME;
  styles?: CSSProperties;
}) => {
  switch (network) {
    case "COSMOS":
      return <NetworkImage src={CosmosLogo} style={styles} />;
    case "TERRA":
      return <NetworkImage src={TerraLogo} style={styles} />;
    case "KAVA":
      return <NetworkImage src={KavaLogo} style={styles} />;
    case "OASIS":
      return <NetworkImage src={OasisLogo} style={styles} />;
    default:
      return null;
  }
};

/** ===========================================================================
 * Styled Components
 * ============================================================================
 */

const NetworkImage = styled.img`
  width: 32px;
  border-radius: 50%;
`;

const Image = styled.img`
  :hover {
    cursor: pointer;
  }
`;

const HeroIllustrationImageBackgroundSvg = styled.img`
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
  width: 850px;

  @media (max-width: 1250px) {
    width: 800px;
  }

  @media (max-width: 1000px) {
    width: 750px;
  }

  @media (max-width: 800px) {
    width: 700px;
  }

  @media (max-width: 600px) {
    display: none;
  }

  :hover {
    cursor: auto;
  }
`;

const HeroIllustrationImageSvg = styled.img`
  position: absolute;
  left: 110px;
  top: 350px;
  width: 525px;

  @media (max-width: 1250px) {
    width: 450px;
  }

  @media (max-width: 1000px) {
    width: 400px;
  }

  @media (max-width: 800px) {
    width: 350px;
  }

  @media (max-width: 600px) {
    top: 210px;
    left: 40px;
    width: 295px;
  }
`;

const LaptopImageBase = styled.img`
  position: absolute;
  right: 0;
  top: 125px;
  width: 550px;

  @media (max-width: 1250px) {
    width: 450px;
  }

  @media (max-width: 1000px) {
    width: 400px;
  }

  @media (max-width: 800px) {
    display: none;
  }

  :hover {
    cursor: auto;
  }
`;

const LoginContainerImagesBase = styled.img`
  position: absolute;
  bottom: -1px;
  width: 350px;

  @media (max-width: 1250px) {
    width: 300px;
  }

  @media (max-width: 1000px) {
    width: 215px;
  }

  @media (max-width: 800px) {
    width: 205px;
  }

  @media (max-width: 750px) {
    width: 145px;
  }

  @media (max-width: 600px) {
    display: none;
  }

  :hover {
    cursor: auto;
  }
`;
