import { NETWORK_ADDRESS_DEFAULTS } from "@anthem/utils";
import { SCREEN_SIZES, UTILS, APP_URL } from "../support/cypress-utils";

const { COSMOS, CELO } = NETWORK_ADDRESS_DEFAULTS;

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
      cy.visit(`${APP_URL}/cosmos/delegate/${COSMOS.account}`);
      cy.contains("Staking");
      cy.contains("Withdraw Rewards");
      cy.contains("Withdraw Commissions");

      if (type.isDesktop()) {
        UTILS.checkForNetwork("cosmos");
      }
    });
  });

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
      cy.contains("Staking");
      cy.contains("Validator Group");
      cy.contains("Voting Power");
      cy.contains("Capacity");

      if (type.isDesktop()) {
        UTILS.checkForNetwork("celo");
      }
    });
  });
});
