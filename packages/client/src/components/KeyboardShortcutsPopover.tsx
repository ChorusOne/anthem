import { Colors, Icon, Popover, Position, Tooltip } from "@blueprintjs/core";
import { COLORS } from "constants/colors";
import { IThemeProps } from "containers/ThemeContainer";
import React from "react";
import styled from "styled-components";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

// Source of truth for supported keyboard keys:
export type KEYBOARD_SHORTCUT_KEYS = "P" | "T" | "I" | "S" | "C" | "Q";

export interface KeyboardShortcutMetadata {
  key: KEYBOARD_SHORTCUT_KEYS;
  keyCode: number;
  action: string;
}

export const KeyActionMap: {
  [key in KEYBOARD_SHORTCUT_KEYS]: KeyboardShortcutMetadata;
} = {
  I: {
    key: "I",
    keyCode: 73,
    action: "Focus address input",
  },
  S: {
    key: "S",
    keyCode: 83,
    action: "Open address login modal",
  },
  C: {
    key: "C",
    keyCode: 67,
    action: "Copy current address",
  },
  P: {
    key: "P",
    keyCode: 80,
    action: "Toggle portfolio full size",
  },
  T: {
    key: "T",
    keyCode: 84,
    action: "Toggle transactions full size",
  },
  Q: {
    key: "Q",
    keyCode: 81,
    action: "Open logout menu",
  },
};

/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * FIXME: For some reason this component does not inherit the Blueprint
 * theme styles correctly... so the theme styles are manually applied here.
 * ============================================================================
 */

const KeyboardShortcutsPopover = () => {
  return (
    <Popover
      content={
        <KeyboardShortcutsPreview>
          <Title>Anthem Keyboard Shortcuts</Title>
          <Text>
            Shortcuts to trigger various actions. Some of these are only
            available in the Dashboard view.
          </Text>
          <KeyHeader>
            <KeyBlock>Key</KeyBlock> <Header>Action</Header>
          </KeyHeader>
          {Object.entries(KeyActionMap).map(([_, { key, action }]) => {
            return <KeyLabel key={key + action} letter={key} label={action} />;
          })}
        </KeyboardShortcutsPreview>
      }
      position={Position.RIGHT}
    >
      <Tooltip
        position={Position.RIGHT}
        content="Click to view keyboard shortcuts"
      >
        <Icon
          icon="control"
          color={COLORS.DARK_GRAY}
          style={{ marginRight: 12 }}
          className="keyboard-shortcut-icon"
        />
      </Tooltip>
    </Popover>
  );
};

/** ===========================================================================
 * Styles
 * ============================================================================
 */

const fontColor = (darkTheme: boolean) =>
  darkTheme ? Colors.WHITE : Colors.DARK_GRAY3;

const KeyboardShortcutsPreview = styled.div`
  width: 325px;
  padding: 12px;
  background: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? Colors.DARK_GRAY5 : Colors.LIGHT_GRAY3};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

interface KeyLabelProps {
  letter: string;
  label: string;
}

const KeyLabel = ({ letter, label }: KeyLabelProps) => {
  return (
    <Row style={{ marginTop: 1 }}>
      <KeyBlock style={{ fontStyle: "italic" }}>
        {letter.toLowerCase()}
      </KeyBlock>{" "}
      <Text>{label}</Text>
    </Row>
  );
};

const Text = styled.p`
  margin: 0;
  color: ${(props: { theme: IThemeProps }) =>
    fontColor(props.theme.isDarkTheme)};
`;

const KeyHeader = styled(Row)`
  margin-top: 6px;
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: ${(props: { theme: IThemeProps }) =>
    props.theme.isDarkTheme ? COLORS.LIGHT_GRAY : COLORS.DARK_GRAY};
`;

const Header = styled.b`
  margin: 0;
  color: ${(props: { theme: IThemeProps }) =>
    fontColor(props.theme.isDarkTheme)};
`;

const Title = styled(Header)`
  font-size: 18px;
  margin-top: 6px;
  margin-bottom: 6px;
`;

const KeyBlock = styled(Header)`
  width: 35px;
`;

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { KeyboardShortcutsPopover };
