import { deriveNetworkFromAddress, NETWORK_NAME } from "@anthem/utils";
import { NetworkLogoIcon } from "assets/images";
import axios from "axios";
import { COLORS } from "constants/colors";
import Identicon from "identicon.js";
import md5 from "js-md5";
import React from "react";
import styled from "styled-components";
import {
  getValidatorNameFromAddress,
  ValidatorOperatorAddressMap,
  wait,
} from "tools/client-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IProps {
  address: string;
  networkName: NETWORK_NAME;
  validatorOperatorAddressMap: ValidatorOperatorAddressMap;
}

interface IState {
  logoUrl: string;
  loading: boolean;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */

class AddressIconComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      logoUrl: "",
      loading: true,
    };
  }

  async componentDidMount() {
    const { address, networkName, validatorOperatorAddressMap } = this.props;
    const validator = getValidatorNameFromAddress(
      validatorOperatorAddressMap,
      address,
      networkName,
    );

    if (validator) {
      const validatorIdentityField = validator.description.identity;
      const logoUrl = await fetchValidatorLogoUrl(validatorIdentityField);
      if (logoUrl) {
        this.setState({ logoUrl });
      }
    }

    this.setState({ loading: false });
  }

  render(): JSX.Element {
    if (this.state.loading) {
      return <LoadingPlaceholderIcon />;
    } else if (this.state.logoUrl) {
      return <TxIcon src={this.state.logoUrl} />;
    } else {
      return getIdenticon(this.props.address);
    }
  }
}

/** ===========================================================================
 * Utils
 * ============================================================================
 */

/**
 * Keep a locale cache of `identity`:`avatarUrl` values to avoid
 * over-fetching from the Keybase API.
 */
const LOGO_CACHE = new Map();

/**
 * Fetch the validator logo using the `identity` field and the Keybase API.
 */
const fetchValidatorLogoUrl = async (
  identity: string,
): Promise<Nullable<string>> => {
  try {
    /**
     * If the value is in the cache return the result or if the result is
     * still being fetched recursively call the same function after a delay.
     */
    if (LOGO_CACHE.has(identity)) {
      const value = LOGO_CACHE.get(identity);
      if (value === "loading") {
        await wait(250);
        return fetchValidatorLogoUrl(identity);
      } else if (value === "error") {
        return null;
      } else {
        return value;
      }
    } else {
      LOGO_CACHE.set(identity, "loading");
    }

    // The value was not in the cache yet, fetch it from keybase.
    const KEYBASE_URL = `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}`;
    const response = await axios.get(KEYBASE_URL);
    const { data } = response;
    const avatarUrl = data.them[0].pictures.primary.url;

    // If a url is found store it in the cache and then return it.
    if (avatarUrl) {
      LOGO_CACHE.set(identity, avatarUrl);
      return avatarUrl;
    } else {
      return null;
    }
  } catch (err) {
    LOGO_CACHE.set(identity, "error");
    return null;
  }
};

/** ===========================================================================
 * Styled Components
 * ============================================================================
 */

const LoadingPlaceholderIcon = styled.div`
  width: 32px;
  border-radius: 50%;
  background: ${COLORS.LIGHT_GRAY};
`;

const TxIcon = styled.img`
  width: 32px;
  border-radius: 50%;

  :hover {
    cursor: auto;
  }
`;

const getIdenticon = (address: string) => {
  if (!address) {
    const network = deriveNetworkFromAddress(address);
    return <NetworkLogoIcon network={network.name} />;
  }

  const options = { brightness: 0.5 };
  const hash = md5(address);

  // docs: https://github.com/stewartlord/identicon.js
  // @ts-ignore
  const data = new Identicon(hash, options).toString();
  return (
    <TxIcon
      alt="Random from address profile"
      src={`data:image/png;base64,${data}`}
    />
  );
};

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default AddressIconComponent;
