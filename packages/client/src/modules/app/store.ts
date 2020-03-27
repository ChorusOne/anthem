import StorageModule from "lib/storage-lib";
import { combineReducers } from "redux";
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
  .handleAction(actions.initializeSuccess, (state, action) => ({
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
  activeBannerKey: Nullable<BANNER_NOTIFICATIONS_KEYS>;
  notificationsBannerVisible: boolean;
  dashboardInputFocused: boolean;
  dismissedBannerKeys: Set<BANNER_NOTIFICATIONS_KEYS>;
  showMonthlySignupTooltip: boolean;
  showDataIntegrityHelpLabel: boolean;
}

const initialAppState = {
  activeBannerKey: null,
  showDataIntegrityHelpLabel: false,
  dashboardInputFocused: false,
  showMonthlySignupTooltip: false,
  notificationsBannerVisible: false,
  dismissedBannerKeys: StorageModule.getDismissedNotifications(),
};

const app = createReducer<AppState, ActionTypes>(initialAppState)
  .handleAction(actions.toggleMonthlySummaryTooltip, (state, action) => ({
    ...state,
    showMonthlySignupTooltip: action.payload,
  }))
  .handleAction(actions.toggleDataIntegrityHelpLabel, (state, action) => ({
    ...state,
    showDataIntegrityHelpLabel: action.payload,
  }))
  .handleAction(
    actions.setDashboardAddressInputFocusState,
    (state, action) => ({
      ...state,
      dashboardInputFocused: action.payload,
    }),
  )
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
