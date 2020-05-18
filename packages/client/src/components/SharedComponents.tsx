import {
  Button as BlueprintButton,
  Classes,
  H3,
  Icon,
  IconName,
  Intent,
  Spinner,
} from "@blueprintjs/core";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import React, { ChangeEvent } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Loader from "react-loader-spinner";
import styled, { CSSProperties } from "styled-components";

/** ===========================================================================
 * Common components shared throughout the application
 * ============================================================================
 */

interface StyleProps {
  style?: CSSProperties;
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
export const LoaderBars = ({ style }: { style?: CSSProperties }) => (
  <View style={style}>
    <Loader type="Bars" color={COLORS.CTA} height={124} width={124} />
  </View>
);

/** ===========================================================================
 * DashboardLoader
 * ============================================================================
 */
export const DashboardLoader = ({ style }: { style?: React.CSSProperties }) => (
  <View style={{ marginTop: 85, ...style }}>
    <Spinner />
  </View>
);

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
  style?: CSSProperties;
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
  style?: CSSProperties;
  disabled?: boolean;
  icon?: IconName;
  rightIcon?: IconName;
  children: ReactNode;
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
        ...props.style,
        ...styles,
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
  style?: CSSProperties;
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
  style?: CSSProperties;
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
