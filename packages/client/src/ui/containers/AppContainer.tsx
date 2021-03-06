import { Colors } from "@blueprintjs/core";
import * as Sentry from "@sentry/browser";
import { Action, Location } from "history";
import Modules, { ReduxStoreState } from "modules/root";
import { i18nSelector } from "modules/settings/selectors";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import Analytics from "tools/analytics-utils";
import { composeWithProps } from "tools/context-utils";
import { IThemeProps } from "ui/containers/ThemeContainer";
import { Centered } from "ui/SharedComponents";
import RoutesContainer, { FixedAppBackgroundPage } from "./RoutesContainer";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

interface IState {
  hasError: boolean;
}

/** ===========================================================================
 * React Component
 * ----------------------------------------------------------------------------
 * Top level app container which also provides an error boundary.
 * ============================================================================
 */

class AppContainer extends React.Component<IProps, IState> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidMount() {
    // Initialize the app.
    this.props.initializeApp();

    // Attach a listener for URL change events.
    this.props.history.listen(this.routeChangeListener);
  }

  componentDidCatch(error: Error) {
    // Log the error to Sentry.
    Sentry.captureException(error);
  }

  render(): Nullable<JSX.Element> {
    if (!this.props.loading.initialized) {
      return null;
    } else if (this.state.hasError) {
      return this.renderErrorFallback();
    }

    return <RoutesContainer />;
  }

  renderErrorFallback = () => {
    const { t } = this.props.i18n;
    return (
      <ErrorFallbackPage>
        <Centered style={{ flexDirection: "column" }}>
          <ErrorTitle>{t("Anthem encountered an error...")}</ErrorTitle>
          <ErrorText>
            {t("Don't worry, our engineers will be on it right away!")}
          </ErrorText>
          <ErrorText>
            {t("In the meantime you can try to reload the page.")}
          </ErrorText>
        </Centered>
      </ErrorFallbackPage>
    );
  };

  routeChangeListener = (location: Location, action: Action) => {
    // Dispatch relevant actions for routing events.
    Analytics.page();
    this.props.onRouteChange({ ...location, action });
  };
}

/** ===========================================================================
 * Styles
 * ============================================================================
 */

const ErrorFallbackPage = FixedAppBackgroundPage;

const ErrorTitle = styled.h2`
  color: ${(props: { theme: IThemeProps }) => {
    return props.theme.isDarkTheme ? Colors.LIGHT_GRAY3 : Colors.DARK_GRAY2;
  }};
`;

const ErrorText = styled.p`
  color: ${(props: { theme: IThemeProps }) => {
    return props.theme.isDarkTheme ? Colors.LIGHT_GRAY3 : Colors.DARK_GRAY2;
  }};
`;

/** ===========================================================================
 * Props
 * ============================================================================
 */

const mapStateToProps = (state: ReduxStoreState) => ({
  i18n: i18nSelector(state),
  loading: Modules.selectors.app.loadingSelector(state),
});

const dispatchProps = {
  initializeApp: Modules.actions.app.initializeApp,
  onRouteChange: Modules.actions.app.onRouteChange,
};

type ConnectProps = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const withProps = connect(mapStateToProps, dispatchProps);

interface ComponentProps {}

interface IProps extends ComponentProps, RouteComponentProps, ConnectProps {}

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default composeWithProps<ComponentProps>(
  withProps,
  withRouter,
)(AppContainer);
