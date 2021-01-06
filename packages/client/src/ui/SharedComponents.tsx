import {
  Button as BlueprintButton,
  Classes,
  Code,
  H3,
  Icon,
  IconName,
  Intent,
  Spinner,
} from "@blueprintjs/core";
import { COLORS } from "constants/colors";
import QRCode from "qrcode.react";
import React, { ChangeEvent } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Loader from "react-loader-spinner";
import styled from "styled-components";
import { copyTextToClipboard } from "tools/client-utils";
import { tFnString } from "tools/i18n-utils";
import { isGreaterThan, isLessThan } from "tools/math-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";

/** ===========================================================================
 * Common components shared throughout the application
 * ============================================================================
 */

interface StyleProps {
  style?: React.CSSProperties;
}

/** ===========================================================================
 * View
 * ============================================================================
 */
export const View = styled.div``;

/** ===========================================================================
 * Line
 * ============================================================================
 */
export const Line = styled.div`
  height: 1px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.ADDRESS_LINE : COLORS.LIGHT_GRAY};
`;

/** ===========================================================================
 * Row
 * ============================================================================
 */
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

/** ===========================================================================
 * Column
 * ============================================================================
 */
export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

/** ===========================================================================
 * Centered
 * ============================================================================
 */
export const Centered = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/** ===========================================================================
 * Panel Text
 * ============================================================================
 */

export const PanelMessageText = styled.p`
  margin-top: 100px;
  text-align: center;
`;

/** ===========================================================================
 * ErrorText
 * ============================================================================
 */
export const ErrorText = styled.p`
  color: ${COLORS.ERROR};
`;

/** ===========================================================================
 * PageContainer
 * ============================================================================
 */
export const PageContainer = styled.div`
  padding-left: 4px;
`;

/** ===========================================================================
 * PageContainer with scrolling
 * ============================================================================
 */

export const PageContainerScrollable = styled(PageContainer)`
  overflow-y: scroll;
  padding-bottom: 50px;

  .contentful {
    h1 {
      font-weight: bold;
      margin-top: 24px;
      line-height: 25px;
      font-size: 22px;
      color: #182026;
      padding-bottom: 10px;
      margin-bottom: 30px;

      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-color: #a7b6c2;
    }
  }
`;

/** ===========================================================================
 * PageContainerScrollable
 * ============================================================================
 */
export const PageScrollableContent = styled.div`
  overflow-x: hidden;
  overflow-y: scroll;

  height: ${(props: { theme: IThemeProps }) =>
    props.theme.isDesktop ? `calc(100vh - 250px)` : "100%"};
`;

/** ===========================================================================
 * PageTitle
 * ============================================================================
 */
export const PageTitle = (props: {
  "data-cy": string;
  children: string | ReadonlyArray<JSX.Element | string>;
}) => (
  <H3 data-cy={props["data-cy"]} style={{ fontWeight: "bold", marginTop: 24 }}>
    {props.children}
  </H3>
);

/** ===========================================================================
 * LoaderBars
 * ============================================================================
 */
export const LoaderBars = ({ style }: { style?: React.CSSProperties }) => (
  <View style={style}>
    <Loader type="Bars" color={COLORS.CTA} height={124} width={124} />
  </View>
);

/** ===========================================================================
 * DashboardError
 * ============================================================================
 */

export const DashboardError = ({
  tString,
  text,
}: {
  tString: tFnString;
  text?: string | JSX.Element;
}) => (
  <p style={{ marginTop: 85, textAlign: "center", padding: 12 }}>
    {text
      ? text
      : `Oops! We are having trouble fetching data at the moment. Our engineers have been notified and this will be fixed shortly.`}
  </p>
);

/** ===========================================================================
 * DashboardLoader
 * ============================================================================
 */
export const DashboardLoader = ({
  style,
  showPortfolioLoadingMessage,
}: {
  showPortfolioLoadingMessage?: boolean;
  style?: React.CSSProperties;
}) => (
  <View style={{ marginTop: 85, ...style }}>
    <Spinner />
    {showPortfolioLoadingMessage && (
      <LoadingWarningMessage>
        <b>Notice:</b> Addresses with a large amount of activity take a while to
        load.
      </LoadingWarningMessage>
    )}
  </View>
);

const LoadingWarningMessage = styled.p`
  margin-top: 22px;
  font-size: 14px;
  text-align: center;
`;

/** ===========================================================================
 * Link
 * ============================================================================
 */
export const Link = ({
  testID,
  href,
  style,
  onClick,
  children,
}: {
  testID?: string;
  href?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: string | JSX.Element;
}) => (
  <a
    data-cy={testID}
    href={href}
    style={style}
    onClick={onClick}
    target="__blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

interface IButtonProps {
  "data-cy"?: string;
  type?: "button" | "submit" | "reset" | undefined;
  category?: "PRIMARY" | "SECONDARY" | "DANGER";
  style?: React.CSSProperties;
  disabled?: boolean;
  icon?: IconName;
  rightIcon?: IconName;
  children?: ReactNode;
  onClick?: () => void;
}

/** ===========================================================================
 * Button
 * ----------------------------------------------------------------------------
 * Shared Button component which currently supports three
 * types: `PRIMARY` | `SECONDARY` | `DANGER`;
 * ============================================================================
 */
export const Button = (props: IButtonProps) => {
  const { category = "PRIMARY", children, ...rest } = props;

  /* Get className: */
  const className =
    category === "PRIMARY"
      ? "custom-button-primary"
      : category === "SECONDARY"
      ? "custom-button-secondary"
      : "";

  /* Get styles: */
  const styles =
    category === "PRIMARY"
      ? {
          borderRadius: 0,
          background: COLORS.CTA,
          color: COLORS.LIGHT_WHITE,
        }
      : { borderRadius: 0 };

  return (
    <BlueprintButton
      {...rest}
      className={`${className} blueprint-button`}
      onClick={props.onClick}
      disabled={props.disabled}
      intent={category === "DANGER" ? Intent.DANGER : Intent.NONE}
      style={{
        ...styles,
        ...props.style,
      }}
    >
      <Pointer>{props.children}</Pointer>
    </BlueprintButton>
  );
};

const Pointer = styled.p`
  margin: 0;

  :hover {
    cursor: pointer;
  }
`;

/** ===========================================================================
 * CopyTextComponent
 * ============================================================================
 */
export const CopyTextComponent = ({
  textToCopy,
  onCopy,
  children,
}: {
  textToCopy: string;
  onCopy: () => void;
  children: ReactNode;
}) => {
  return (
    <CopyToClipboard text={textToCopy} onCopy={onCopy}>
      {children}
    </CopyToClipboard>
  );
};

/** ===========================================================================
 * CopyIcon
 * ============================================================================
 */
export const CopyIcon = (props: StyleProps & { color: string }) => {
  return (
    <Icon
      icon="duplicate"
      style={props.style}
      color={props.color}
      data-cy="address-copy-to-clipboard-icon"
      className="address-copy-to-clipboard-icon"
    />
  );
};

/** ===========================================================================
 * TextInput
 * ============================================================================
 */
export const TextInput = (props: {
  "data-cy": string;
  label?: string;
  autoFocus?: boolean;
  placeholder: string;
  value: string;
  type?: string;
  style?: React.CSSProperties;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  assignRef?: (ref: HTMLInputElement) => void;
  onChange: (value: string) => void;
}) => (
  <View>
    {props.label && (
      <p
        style={{
          margin: 0,
          fontSize: 10,
          marginBottom: 1,
          marginLeft: 1,
        }}
      >
        {props.label}
      </p>
    )}
    <input
      dir="auto"
      spellCheck={false}
      style={props.style}
      value={props.value}
      data-cy={props["data-cy"]}
      type={props.type || "text"}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onSubmit={props.onSubmit}
      autoFocus={props.autoFocus}
      ref={props.assignRef}
      placeholder={props.placeholder}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        props.onChange(event.target.value);
      }}
      className={`${Classes.INPUT} .modifier :modifier`}
    />
  </View>
);

/** ===========================================================================
 * SearchInput
 * ============================================================================
 */
export const SearchInput = (props: {
  "data-cy": string;
  label?: string;
  autoFocus?: boolean;
  placeholder: string;
  value: string;
  type?: string;
  style?: React.CSSProperties;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  assignRef?: (ref: HTMLInputElement) => void;
  onChange: (value: string) => void;
}) => {
  return (
    <Row style={{ position: "relative" }}>
      <TextInput {...props} style={{ paddingRight: 28, ...props.style }} />
      <span
        style={{ position: "absolute", right: 10 }}
        className="bp3-icon bp3-icon-search"
      />
    </Row>
  );
};

/** ===========================================================================
 * PercentChangeText
 * ============================================================================
 */

interface PercentChangeTextProps {
  value: string | number;
}

export const PercentChangeText = (props: PercentChangeTextProps) => {
  const { value } = props;
  const change = Number(value);
  return (
    <b style={{ color: getColorForPercentChange(change) }}>
      {renderPercentChange(change)}
    </b>
  );
};

const getColorForPercentChange = (percentChange: number) => {
  if (isGreaterThan(percentChange, 0)) {
    return COLORS.BRIGHT_GREEN;
  } else if (isLessThan(percentChange, 0)) {
    return COLORS.ERROR;
  } else {
    return undefined;
  }
};

const renderPercentChange = (percentChange: number) => {
  const sign = isGreaterThan(percentChange, 0) ? "+" : "";
  return `${sign}${percentChange.toFixed(2)}%`;
};

/** ===========================================================================
 * Address QR Code
 * ============================================================================
 */

export const AddressQR = ({ address }: { address: string }) => (
  <View style={{ marginTop: 24 }}>
    <Centered style={{ flexDirection: "column" }}>
      <QRCode size={164} value={address} />
      <ClickableRow onClick={() => copyTextToClipboard(address)}>
        <Code>{address}</Code>
        <CopyIcon style={{ marginLeft: 6 }} color="white" />
      </ClickableRow>
      <p style={{ marginTop: 12 }}>
        Confirm that the copied address matches exactly.
      </p>
    </Centered>
  </View>
);

const ClickableRow = styled(Row)`
  margin-top: 24px;

  :hover {
    cursor: pointer;
  }
`;
