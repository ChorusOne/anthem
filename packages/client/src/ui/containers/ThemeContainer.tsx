import useWindowSize from "@rehooks/window-size";
import { ReduxStoreState } from "modules/root";
import React from "react";
import { connect } from "react-redux";
import { RouteChildrenProps, withRouter } from "react-router";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

export interface IThemeProps {
  isDesktop: boolean;
  isDarkTheme: boolean;
}

/** ===========================================================================
 * React Component
 * ============================================================================
 */
const ThemeProviderComponent = (props: ThemeProviderProps) => {
  // Window resize listener setup:
  const windowSize = useWindowSize();
  const isDesktop = windowSize.innerWidth > 768;
  const darkThemeEnabled = props.isDarkTheme;

  return (
    <StyledComponentsThemeProvider
      theme={{
        isDesktop,
        isDarkTheme: darkThemeEnabled,
      }}
    >
      {props.children}
    </StyledComponentsThemeProvider>
  );
};

/** ===========================================================================
 * Props
 * ============================================================================
 */

interface ComponentProps {
  children: JSX.Element;
}

interface ThemeProviderProps extends ComponentProps, RouteChildrenProps {
  isDarkTheme: boolean;
}

const ThemeProvider = composeWithProps<ComponentProps>(
  withRouter,
  connect((state: ReduxStoreState) => ({
    isDarkTheme: state.settings.isDarkTheme,
  })),
)(ThemeProviderComponent);

/** ===========================================================================
 * Export
 * ============================================================================
 */

export { ThemeProvider };
