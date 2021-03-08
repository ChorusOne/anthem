import { NETWORK_ADDRESS_DEFAULTS } from "@anthem/utils";
import { APP_URL, SCREEN_SIZES, UTILS } from "../support/cypress-utils";

const { CELO } = NETWORK_ADDRESS_DEFAULTS;

/** ===========================================================================
 * Test the staking/ page
 * ============================================================================
 */

SCREEN_SIZES.forEach(({ size, type }) => {
  describe("Anthem supports staking for Celo networks", () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "celo");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("After logging in with an address the staking page is accessible", () => {
      cy.visit(`${APP_URL}/celo/delegate/${CELO.account}`);
      cy.contains("Voting");
      cy.contains("Your Validator Groups");
      cy.contains("Validator Group");
      cy.contains("% of Total Votes");
      cy.contains("Capacity");

      if (type.isDesktop()) {
        UTILS.checkForNetwork("celo");
      }
    });
  });
});
