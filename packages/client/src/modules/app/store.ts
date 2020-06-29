import { Pathname, Search } from "history";
import { PORTFOLIO_CHART_TYPES } from "i18n/english";
import StorageModule from "lib/storage-lib";
import { combineReducers } from "redux";
import {
  isValidChartTab,
  onPageWhichIncludesAddressParam,
} from "tools/client-utils";
import { createReducer } from "typesafe-actions";
import actions, { ActionTypes } from "./actions";

/** ===========================================================================
 * Loading Store
 * ============================================================================
 */

export interface LoadingState {
  initialized: boolean;
  newsletterSignup: boolean;
}

const initialState = {
  initialized: false,
  newsletterSignup: false,
};

const loading = createReducer<LoadingState, ActionTypes>(initialState)
  .handleAction(actions.initializeAppSuccess, (state, action) => ({
    ...state,
    initialized: true,
  }))
  .handleAction(actions.newsletterSignup, (state, action) => ({
    ...state,
    newsletterSignup: true,
  }))
  .handleAction(
    [actions.newsletterSignupSuccess, actions.newsletterSignupFailure],
    (state, action) => ({
      ...state,
      newsletterSignup: false,
    }),
  );

/** ===========================================================================
 * App Store
 * ============================================================================
 */

export type BANNER_NOTIFICATIONS_KEYS = "monthly_summary_newsletter";

interface AppState {
  activeChartTab: PORTFOLIO_CHART_TYPES;
  activeBannerKey: Nullable<BANNER_NOTIFICATIONS_KEYS>;
  notificationsBannerVisible: boolean;
  dashboardInputFocused: boolean;
  dismissedBannerKeys: Set<BANNER_NOTIFICATIONS_KEYS>;
  showMonthlySignupTooltip: boolean;
  showDataIntegrityHelpLabel: boolean;
  transactionsExpanded: boolean;
  portfolioExpanded: boolean;
  addressInputRef: Nullable<HTMLInputElement>;
  locationState: {
    pathname: Pathname;
    search: Search;
  };
}

const initialAppState: AppState = {
  activeBannerKey: null,
  showDataIntegrityHelpLabel: false,
  dashboardInputFocused: false,
  showMonthlySignupTooltip: false,
  notificationsBannerVisible: false,
  dismissedBannerKeys: StorageModule.getDismissedNotifications(),
  transactionsExpanded: false,
  portfolioExpanded: false,
  addressInputRef: null,
  locationState: {
    pathname: "",
    search: "",
  },
  activeChartTab: "TOTAL",
};

const app = createReducer<AppState, ActionTypes>(initialAppState)
  .handleAction(actions.toggleMonthlySummaryTooltip, (state, action) => ({
    ...state,
    showMonthlySignupTooltip: action.payload,
  }))
  .handleAction(actions.setAddressInputRef, (state, action) => ({
    ...state,
    addressInputRef: action.payload,
  }))
  .handleAction(actions.toggleDataIntegrityHelpLabel, (state, action) => ({
    ...state,
    showDataIntegrityHelpLabel: action.payload,
  }))
  .handleAction(actions.togglePortfolioSize, state => ({
    ...state,
    transactionsExpanded: false,
    portfolioExpanded: !state.portfolioExpanded,
  }))
  .handleAction(actions.toggleTransactionsSize, state => ({
    ...state,
    portfolioExpanded: false,
    transactionsExpanded: !state.transactionsExpanded,
  }))
  .handleAction(
    actions.setDashboardAddressInputFocusState,
    (state, action) => ({
      ...state,
      dashboardInputFocused: action.payload,
    }),
  )
  .handleAction(actions.setActiveChartTab, (state, action) => ({
    ...state,
    activeChartTab: action.payload,
  }))
  .handleAction(actions.onRouteChange, (state, action) => {
    let activeChartTab = state.activeChartTab;

    // Update the active chart tab if viewing the portfolio
    const { pathname } = action.payload;
    const chartViewActive = onPageWhichIncludesAddressParam(pathname);
    if (chartViewActive) {
      const tab = pathname.split("/")[2];
      const validTab = isValidChartTab(tab);
      if (validTab) {
        activeChartTab = validTab;
      }
    }

    return {
      ...state,
      activeChartTab,
      locationState: {
        search: action.payload.search,
        pathname: action.payload.pathname,
      },
    };
  })
  .handleAction(actions.toggleNotificationsBanner, (state, { payload }) => ({
    ...state,
    activeBannerKey: payload.visible ? payload.key : null,
    dismissedBannerKeys: payload.visible
      ? state.dismissedBannerKeys
      : state.dismissedBannerKeys.add(payload.key),
    notificationsBannerVisible: payload.visible,
  }));

/** ===========================================================================
 * Export
 * ============================================================================
 */

export interface State {
  app: AppState;
  loading: LoadingState;
}

export default combineReducers({ loading, app });
