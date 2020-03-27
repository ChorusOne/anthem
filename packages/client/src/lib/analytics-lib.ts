import { CURRENCY_SETTING, FiatCurrency } from "constants/fiat";
import { ILocale } from "i18n/catalog";
import ENV from "lib/client-env";
import { SIGNIN_TYPE } from "modules/ledger/actions";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

enum T {
  SET_ADDRESS = "SET_ADDRESS",
  LEDGER_SIGN_IN_START = "LEDGER_SIGN_IN_START",
  ADDRESS_SIGN_IN_START = "ADDRESS_SIGN_IN_START",
  LEDGER_SIGN_IN_UPDATE = "LEDGER_SIGN_IN_UPDATE",
  ADDRESS_SIGN_IN_UPDATE = "ADDRESS_SIGN_IN_UPDATE",
  OPEN_TRANSACTION_DETAILS = "OPEN_TRANSACTION_DETAILS",
  LOGOUT = "LOGOUT",

  // Settings
  SET_APP_THEME = "SET_APP_THEME",
  SET_APP_LANGUAGE = "SET_APP_LANGUAGE",
  SET_FIAT_CURRENCY = "SET_FIAT_CURRENCY",
  SET_CURRENCY_OPTION = "SET_CURRENCY_OPTION",

  // Actions
  DOWNLOAD_CSV = "DOWNLOAD_CSV",
  VIEW_BALANCE_PORTFOLIO = "VIEW_BALANCE_PORTFOLIO",
  VIEW_REWARDS_PORTFOLIO = "VIEW_REWARDS_PORTFOLIO",

  // Delegate
  DELEGATE = "DELEGATE",
  CLAIM_REWARDS = "CLAIM_REWARDS",

  MONTHLY_SUMMARY_EMAIL_INTEREST = "MONTHLY_SUMMARY_EMAIL_INTEREST",
}

/** ===========================================================================
 * Segment Analytics Utils
 * ----------------------------------------------------------------------------
 * The primary purpose of this additional class is to provide a single, clear
 * definition for the events the app is tracking, and to define methods and
 * interfaces for recording events for consistency.
 * ============================================================================
 */
class SegmentAnalyticsModule {
  // Map some methods directly from Segment analytics module
  page = window.analytics.page;
  identify = window.analytics.identify;

  initialize = () => {
    const writeKey = ENV.SEGMENT_WRITE_KEY;
    if (writeKey) {
      window.analytics.load(writeKey);
    }
  };

  loginStart = (type: SIGNIN_TYPE) => {
    if (type === "LEDGER") {
      this.track(T.LEDGER_SIGN_IN_START);
    } else if (type === "ADDRESS") {
      this.track(T.ADDRESS_SIGN_IN_START);
    }
  };

  loginUpdate = (type: SIGNIN_TYPE) => {
    if (type === "LEDGER") {
      this.track(T.LEDGER_SIGN_IN_UPDATE);
    } else if (type === "ADDRESS") {
      this.track(T.ADDRESS_SIGN_IN_UPDATE);
    }
  };

  logout = () => {
    this.track(T.LOGOUT);
  };

  delegate = () => {
    this.track(T.DELEGATE);
  };

  claimRewards = () => {
    this.track(T.CLAIM_REWARDS);
  };

  setAddress = (address: string) => {
    this.track(T.SET_ADDRESS, { address });
  };

  setAppTheme = (theme: string) => {
    this.track(T.SET_APP_THEME, { theme });
  };

  setAppLanguage = (locale: ILocale) => {
    this.track(T.SET_APP_LANGUAGE, { locale });
  };

  setFiatCurrency = (fiat: FiatCurrency) => {
    this.track(T.SET_FIAT_CURRENCY, { fiat });
  };

  setCurrencySetting = (setting: CURRENCY_SETTING) => {
    this.track(T.SET_CURRENCY_OPTION, { setting });
  };

  openTransactionDetails = () => {
    this.track(T.OPEN_TRANSACTION_DETAILS);
  };

  viewPortfolioBalances = () => {
    this.track(T.VIEW_BALANCE_PORTFOLIO);
  };

  viewPortfolioRewards = () => {
    this.track(T.VIEW_REWARDS_PORTFOLIO);
  };

  downloadCSV = () => {
    this.track(T.DOWNLOAD_CSV);
  };

  interestedInMonthlySummaryEmail = ({
    email,
    address,
  }: {
    email: string;
    address: string;
  }) => {
    this.track(T.MONTHLY_SUMMARY_EMAIL_INTEREST, { email, address });
  };

  /**
   * Private method used to track custom events.
   */
  private readonly track = (event: T, properties?: { [key: string]: any }) => {
    if (ENV.ENABLE_MOCK_APIS) {
      console.warn(`Analytics Event Tracked: ${event}`);
    }

    window.analytics.track(event, properties);
  };
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const Analytics = new SegmentAnalyticsModule();

export default Analytics;
