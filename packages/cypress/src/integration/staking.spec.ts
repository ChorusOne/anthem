import { SCREEN_SIZES, UTILS, APP_URL } from "../support/cypress-utils";

/** ===========================================================================
 * Test the staking/ page
 * ============================================================================
 */

SCREEN_SIZES.forEach(({ size, type }) => {
  describe("Anthem supports staking for Cosmos networks", () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "cosmos");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("After logging in with an address the staking page is accessible", () => {
      cy.visit(`${APP_URL}/delegate`);
      cy.contains("Staking");
      cy.contains("Withdraw Rewards");
      cy.contains("Withdraw Commissions");

      if (type.isDesktop()) {
        UTILS.checkForNetwork("cosmos");
      }
    });
  });
});
