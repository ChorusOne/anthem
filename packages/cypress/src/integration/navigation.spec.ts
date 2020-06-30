import { APP_URL, SCREEN_SIZES, UTILS } from "../support/cypress-utils";

/** ===========================================================================
 * Test app navigation
 * ============================================================================
 */

SCREEN_SIZES.forEach(({ type, size }) => {
  describe(`Test App Navigation/Routing, viewport: ${size}`, () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
    });

    /**
     * Default login page route.
     */
    it("The default app page displays the /login route", () => {
      cy.visit(APP_URL);
      UTILS.shouldMatchText("login-page-title", "Earn Rewards on Cryptoassets");
    });

    /**
     * Redirect to login.
     */
    it("Other routes redirect to /login if no address is set", () => {
      cy.visit(`${APP_URL}`);
      UTILS.shouldMatchText("login-page-title", "Earn Rewards on Cryptoassets");
      cy.url().should("contain", "/login");

      cy.visit(`${APP_URL}/available`);
      UTILS.shouldMatchText("login-page-title", "Earn Rewards on Cryptoassets");
      cy.url().should("contain", "/login");

      cy.visit(`${APP_URL}/settings`);
      UTILS.shouldMatchText("login-page-title", "Earn Rewards on Cryptoassets");
      cy.url().should("contain", "/login");
    });
  });

  describe(`Test Dashboard Portfolio Routes, viewport: ${size}`, () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "cosmos");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    /**
     * Dashboard sub-routes.
     */
    it("All navigation sub-routes in the Dashboard can be visited", () => {
      if (type.isDesktop()) {
        cy.visit(`${APP_URL}/cosmos/total`);
        cy.url().should("contain", "/total");

        cy.visit(`${APP_URL}/cosmos/available`);
        cy.url().should("contain", "/available");

        cy.visit(`${APP_URL}/cosmos/rewards`);
        cy.url().should("contain", "/rewards");

        cy.visit(`${APP_URL}/cosmos/staking`);
        cy.url().should("contain", "/staking");
      }
    });

    /**
     * Dashboard sub-routes.
     */
    it("Can visit all sub-routes by clicking on the tabs in the Dashboard view", () => {
      cy.visit(APP_URL);

      if (type.isMobile()) {
        UTILS.findAndClick("mobile-dashboard-navigation-menu");
      }

      UTILS.findAndClick("available-navigation-link");
      cy.url().should("contain", "/available");

      if (type.isMobile()) {
        UTILS.findAndClick("mobile-dashboard-navigation-menu");
      }

      UTILS.findAndClick("rewards-navigation-link");
      cy.url().should("contain", "/rewards");
    });

    /**
     * Settings page route.
     */
    it("Visiting the /settings route shows settings UI", () => {
      cy.visit(`${APP_URL}/settings`);
      cy.contains("Settings");
      cy.url().should("contain", "/settings");
    });

    /**
     * Settings page link in SideMenu.
     */
    it("The /settings route can be visited through the SideMenu", () => {
      cy.visit(`${APP_URL}`);

      if (type.isMobile()) {
        UTILS.findAndClick("hamburger-menu-button");
      }

      UTILS.findAndClick("settings-navigation-link");
      cy.contains("Settings");
      cy.url().should("contain", "/settings");
    });

    /**
     * Help page route.
     */
    it("Visiting the /help route shows settings UI", () => {
      cy.visit(`${APP_URL}/help`);
      cy.contains("Help");
      cy.url().should("contain", "/help");
    });

    /**
     * Help page link in SideMenu.
     */
    it("The /help route can be visited through the SideMenu", () => {
      cy.visit(`${APP_URL}`);

      if (type.isMobile()) {
        UTILS.findAndClick("hamburger-menu-button");
      }

      UTILS.findAndClick("help-navigation-link");
      cy.contains("Help");
      cy.url().should("contain", "/help");
    });
  });
});
