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

export enum VALIDATORS_LIST_SORT_FILTER {
  CUSTOM_DEFAULT = "CUSTOM_DEFAULT", // Sort Chorus and Certus on the top
  NAME = "NAME",
  VOTING_POWER = "VOTING_POWER",
  COMMISSION = "COMMISSION",
}

export enum SORT_DIRECTION {
  ASCENDING = "ASCENDING",
  DESCENDING = "DESCENDING",
}

interface AppState {
  activeBannerKey: Nullable<BANNER_NOTIFICATIONS_KEYS>;
  notificationsBannerVisible: boolean;
  dashboardInputFocused: boolean;
  dismissedBannerKeys: Set<BANNER_NOTIFICATIONS_KEYS>;
  showMonthlySignupTooltip: boolean;
  showDataIntegrityHelpLabel: boolean;
  validatorsListSortFilter: VALIDATORS_LIST_SORT_FILTER;
  sortValidatorsListAscending: boolean;
  transactionsExpanded: boolean;
  portfolioExpanded: boolean;
}

const initialAppState = {
  activeBannerKey: null,
  showDataIntegrityHelpLabel: false,
  dashboardInputFocused: false,
  showMonthlySignupTooltip: false,
  notificationsBannerVisible: false,
  dismissedBannerKeys: StorageModule.getDismissedNotifications(),
  validatorsListSortFilter: VALIDATORS_LIST_SORT_FILTER.CUSTOM_DEFAULT,
  sortValidatorsListAscending: true,
  transactionsExpanded: false,
  portfolioExpanded: false,
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
  .handleAction(actions.setDashboardViewOptions, (state, action) => ({
    ...state,
    ...action.payload,
  }))
  .handleAction(actions.setValidatorListSortType, (state, action) => {
    // Flip the sort direction unless the sort category changes
    let sortDirection = true;
    if (action.payload === state.validatorsListSortFilter) {
      sortDirection = !state.sortValidatorsListAscending;
    }

    return {
      ...state,
      validatorsListSortFilter: action.payload,
      sortValidatorsListAscending: sortDirection,
    };
  })
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
