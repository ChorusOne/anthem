const { SCREEN_SIZES, UTILS } = require("../support/cypress-utils");

/** ===========================================================================
 * Test linking an address
 * ============================================================================
 */

SCREEN_SIZES.forEach(({ size, type }) => {
  describe("Test Address Login", () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type);
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("After logging in with an address balance details are visible for that address", () => {
      UTILS.shouldContainText("balance-available", "ATOMs");
      UTILS.shouldContainText("balance-delegations", "ATOMs");
      UTILS.shouldContainText("balance-rewards", "ATOMs");
      UTILS.shouldContainText("balance-unbonding", "ATOMs");
      UTILS.shouldContainText("balance-commissions", "ATOMs");
      UTILS.shouldContainText("balance-total", "ATOMs");
    });

    it("The transaction history is rendered once an address is entered", () => {
      cy.get(UTILS.find("transaction-list-item"))
        .each(el => {
          cy.wrap(el).get(UTILS.find("transaction-timestamp"));
        })
        .then(list => {
          expect(list).length.to.be.greaterThan(0);
        });
    });

    it("Address is persisted on page reload", () => {
      cy.reload();
      UTILS.shouldContainText("balance-total", "ATOMs");
    });
  });
});
