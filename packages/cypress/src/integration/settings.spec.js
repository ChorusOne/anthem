const { SCREEN_SIZES, UTILS } = require("../support/cypress-utils");

/** ===========================================================================
 * Test app navigation
 * ============================================================================
 */

const visitSettingsPage = type => {
  if (type.isMobile()) {
    UTILS.findAndClick("hamburger-menu-button");
  }

  UTILS.findAndClick("settings-navigation-link");
  cy.contains("Settings");
  cy.url().should("contain", "/settings");
};

SCREEN_SIZES.forEach(({ type, size }) => {
  describe(`Test Dashboard Portfolio Routes, viewport: ${size}`, () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type);
      visitSettingsPage(type);
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    /**
     * Test dark theme setting.
     */
    it("Dark theme can be toggled on and off", () => {
      /* Default state should be on */
      cy.get(UTILS.find("settings-theme-switch")).should("not.be.checked");

      /* Toggle dark theme on */
      UTILS.findAndClick("settings-theme-switch");
      cy.get(UTILS.find("settings-theme-switch")).should("be.checked");

      /* Persists after reload */
      cy.reload();
      cy.get(UTILS.find("settings-theme-switch")).should("be.checked");

      /* Toggle dark theme off */
      UTILS.findAndClick("settings-theme-switch");
      cy.get(UTILS.find("settings-theme-switch")).should("not.be.checked");
    });

    /**
     * Test fiat|crypto setting.
     */
    it("Fiat|Crypto currency settings can be toggled", () => {
      /* Check crypto currency setting */
      UTILS.findAndClick("crypto-currency-setting-radio");
      cy.get(UTILS.find("crypto-currency-setting-radio")).should("be.checked");
      cy.get(UTILS.find("fiat-currency-setting-radio")).should(
        "not.be.checked",
      );

      /* Persists after reload */
      cy.reload();
      cy.get(UTILS.find("crypto-currency-setting-radio")).should("be.checked");
      cy.get(UTILS.find("fiat-currency-setting-radio")).should(
        "not.be.checked",
      );

      /* Check fiat currency setting */
      UTILS.findAndClick("fiat-currency-setting-radio");
      cy.get(UTILS.find("fiat-currency-setting-radio")).should("be.checked");
      cy.get(UTILS.find("crypto-currency-setting-radio")).should(
        "not.be.checked",
      );
    });

    /**
     * Test i18n setting.
     */
    it("App i18n language option can be changed", () => {
      /* Toggle language setting to Chinese */
      UTILS.shouldMatchText("settings-page-title", "Anthem Settings");
      UTILS.findAndClick("settings-language-select-menu");
      UTILS.findAndClick("de-language-option");

      /* Assert that some text changed... */
      UTILS.shouldMatchText("settings-page-title", "Anthem Einstellungen");

      /* Persists after reload */
      cy.reload();
      UTILS.shouldMatchText("settings-page-title", "Anthem Einstellungen");

      /* Toggle back to English */
      UTILS.findAndClick("settings-language-select-menu");
      UTILS.findAndClick("en-US-language-option");
      UTILS.shouldMatchText("settings-page-title", "Anthem Settings");
    });

    /**
     * Test display currency setting.
     */
    it("App display currency option can be changed", () => {
      /* Toggle language setting to Chinese */
      UTILS.findAndClick("settings-currency-select-menu");
      UTILS.findAndClick("KRW-currency-option");

      /* Assert currency setting updated */
      cy.get(UTILS.find("fiat-currency-setting-radio"))
        .parent()
        .should("have.text", "Korean Won");

      /* Persist after reload */
      cy.reload();
      cy.get(UTILS.find("fiat-currency-setting-radio"))
        .parent()
        .should("have.text", "Korean Won");

      /* Toggle language setting back to US Dollar */
      UTILS.findAndClick("settings-currency-select-menu");
      UTILS.findAndClick("USD-currency-option");

      /* Assert currency setting updated */
      cy.get(UTILS.find("fiat-currency-setting-radio"))
        .parent()
        .should("have.text", "US Dollar");
    });

    /**
     * Test i18n setting.
     */
    it.skip("Newsletter email signup", () => {
      /**
       * NOTE: stubbing requests does not work with the fetch API currently...
       *
       * Reference: https://github.com/cypress-io/cypress/issues/95
       */
      cy.server();
      cy.route("POST", "**/newsletter", "OK");

      /* Enter an email to subscribe to the newsletter */
      const email = "sean@chorus.one";
      cy.get("[data-cy=settings-form-email-newsletter-input]").type(email);
      cy.get("[data-cy=newsletter-signup-form]").submit();

      cy.get(".blueprint-toaster-bar > span").should(
        "have.text",
        "Successfully signed up for the Chorus One newsletter. Please check your email for details.",
      );
    });
  });
});
