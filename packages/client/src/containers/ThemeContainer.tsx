import useWindowSize from "@rehooks/window-size";
import { ReduxStoreState } from "modules/root";
import React from "react";
import { connect } from "react-redux";
import { RouteChildrenProps, withRouter } from "react-router";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { composeWithProps } from "tools/context-utils";

/** ===========================================================================
 * Provider & Context Setup
 * ============================================================================
 */

export interface IThemeProps {
  isDesktop: boolean;
  isDarkTheme: boolean;
}

/** ===========================================================================
 * Component
 * ----------------------------------------------------------------------------
 * ThemeProvider which is responsible for various application settings,
 * such as app theme, fiat currency setting, etc.
 * ============================================================================
 */
const ThemeProviderComponent = (props: ThemeProviderProps) => {
  // Windo resize listener setup:
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
