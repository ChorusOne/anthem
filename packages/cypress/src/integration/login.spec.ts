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
      UTILS.checkForNetwork("cosmos");

      // Enter an Oasis address
      UTILS.typeText(
        "dashboard-address-input",
        "CVzqFIADD2Ed0khGBNf4Rvh7vSNtrL1ULTkWYQszDpc={enter}",
      );

      cy.contains("Balance (ROSE)");
      UTILS.checkForNetwork("oasis");
    });

    it("After logging in with an address balance details are visible for that address", () => {
      cy.contains("Balance (ATOM)");

      if (type.isDesktop()) {
        UTILS.checkForNetwork("cosmos");
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
      UTILS.checkForNetwork("celo");

      // Enter an Oasis address
      UTILS.typeText(
        "dashboard-address-input",
        "0x471ece3750da237f93b8e339c536989b8978a438={enter}",
      );

      cy.contains("Balance (ATOM)");
      UTILS.checkForNetwork("cosmos");
    });

    it("After logging in with an address balance details are visible for that address", () => {
      cy.contains("Balance (CELO)");

      if (type.isDesktop()) {
        UTILS.checkForNetwork("celo");
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
        UTILS.checkForNetwork("oasis");
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

  describe("Transaction details can be viewed by searching transaction hashes", () => {
    it("Cosmos transactions can be viewed by hash", () => {
      if (!type.isDesktop()) {
        return;
      }

      const id = "transaction-hash-link";
      const hash =
        "E0BC81E3B76F70466D8F235F02EDD3F3E23E8C52A40D27A650BC14A9E6F8239C";

      // Enter a Cosmos transaction hash
      UTILS.typeText(id, hash);

      UTILS.checkForNetwork("cosmos");
      cy.contains("Transaction Detail");
      cy.url().should("include", `txs/${hash}`);
    });

    it("Celo transactions can be viewed by hash", () => {
      if (!type.isDesktop()) {
        return;
      }

      // Login with Celo
      UTILS.searchInAddressInput("0x47b2dB6af05a55d42Ed0F3731735F9479ABF0673");

      const hash =
        "0xdb33159c19e457e500adae015e4923d3851f355f7319c3ded15a8cfe4503d002";

      // Enter a Celo transaction hash
      UTILS.searchInAddressInput(hash);

      UTILS.checkForNetwork("celo");
      cy.contains("Transaction Detail");
      cy.url().should("include", `txs/${hash}`);
    });
  });
});
