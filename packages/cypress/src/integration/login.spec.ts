import { SCREEN_SIZES, UTILS } from "../support/cypress-utils";

/** ===========================================================================
 * Test logging in with an address
 * ============================================================================
 */

SCREEN_SIZES.forEach(({ size, type }) => {
  describe("Anthem supports login with a Cosmo address", () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "cosmos");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("After logging in with a Cosmos address, the user can switch to an Oasis address", () => {
      if (!type.isDesktop()) {
        return;
      }

      cy.contains("Balance (ATOM)");
      cy.contains("ATOM Price");
      cy.contains("NETWORK: COSMOS");

      // Enter an Oasis address
      UTILS.typeText(
        "dashboard-address-input",
        "CVzqFIADD2Ed0khGBNf4Rvh7vSNtrL1ULTkWYQszDpc={enter}",
      );

      cy.contains("Balance (ROSE)");
      cy.contains("ROSE Price");
      cy.contains("NETWORK: OASIS");
    });

    it("After logging in with an address balance details are visible for that address", () => {
      cy.contains("Balance (ATOM)");

      if (type.isDesktop()) {
        cy.contains("ATOM Price");
        cy.contains("NETWORK: COSMOS");
      }
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

    it("Cosmos address is persisted on page reload", () => {
      cy.reload();
      UTILS.shouldContainText("balance-total", "ATOMs");
    });
  });

  describe("Anthem supports login with a Celo address", () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "celo");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("After logging in with a Celo address, the user can switch to an Cosmos address", () => {
      if (!type.isDesktop()) {
        return;
      }

      cy.contains("Balance (CELO)");
      cy.contains("ROSE Price");
      cy.contains("NETWORK: CELO");

      // Enter an Oasis address
      UTILS.typeText(
        "dashboard-address-input",
        "0x471ece3750da237f93b8e339c536989b8978a438={enter}",
      );

      cy.contains("Balance (ATOM)");
      cy.contains("ATOM Price");
      cy.contains("NETWORK: COSMOS");
    });

    it("After logging in with an address balance details are visible for that address", () => {
      cy.contains("Balance (CELO)");

      if (type.isDesktop()) {
        cy.contains("CELO Price");
        cy.contains("NETWORK: CELO");
      }
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

    it("Transactions can be viewed by hash", () => {
      const id = "transaction-hash-link";
    });

    it("Celo address is persisted on page reload", () => {
      cy.reload();
      UTILS.shouldContainText("balance-total", "CELO");
    });
  });

  describe("Anthem supports login with an Oasis address", () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "oasis");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("After logging in with an address balance details are visible for that address", () => {
      cy.contains("Balance (ROSE)");

      if (type.isDesktop()) {
        cy.contains("ROSE Price");
        cy.contains("NETWORK: OASIS");
      }
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

    it("Cosmos address is persisted on page reload", () => {
      cy.reload();
      UTILS.shouldContainText("balance-total", "ATOMs");
    });
  });
});
