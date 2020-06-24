import { SCREEN_SIZES, UTILS, APP_URL } from "../support/cypress-utils";

/** ===========================================================================
 * Test the staking/ page
 * ============================================================================
 */

SCREEN_SIZES.forEach(({ size, type }) => {
  describe("Anthem supports governance for Celo networks", () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "celo");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("After logging in with an address the governance page is accessible", () => {
      cy.visit(`${APP_URL}/governance`);
      cy.contains("Governance");
      cy.contains("Proposals");
      cy.contains("Proposal Details");
      cy.contains("Governance Transactions");

      if (type.isDesktop()) {
        UTILS.checkForNetwork("celo");
      }
    });
  });
});