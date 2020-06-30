import { SCREEN_SIZES, UTILS } from "../support/cypress-utils";
import { NETWORK_ADDRESS_DEFAULTS } from "@anthem/utils";

const { COSMOS, OASIS, CELO } = NETWORK_ADDRESS_DEFAULTS;

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
      UTILS.typeText("dashboard-address-input", `${OASIS.account}{enter}`);

      cy.contains("Balance (AMBR)");
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
      UTILS.typeText("dashboard-address-input", `${COSMOS.account}{enter}`);

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
      cy.contains("Balance (AMBR)");

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
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "cosmos");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("Cosmos transactions can be viewed by hash", () => {
      if (!type.isDesktop()) {
        return;
      }

      // Enter a Cosmos transaction hash
      UTILS.searchInAddressInput(COSMOS.tx_hash);

      UTILS.checkForNetwork("cosmos");
      cy.contains("Transaction Detail");
      cy.url().should("include", `cosmos/txs/${COSMOS.tx_hash.toLowerCase()}`);
    });

    it("Celo transactions can be viewed by hash", () => {
      if (!type.isDesktop()) {
        return;
      }

      // Login with Celo
      UTILS.searchInAddressInput(CELO.account);

      // Enter a Celo transaction hash
      UTILS.searchInAddressInput(CELO.tx_hash);

      UTILS.checkForNetwork("celo");
      cy.contains("Transaction Detail");
      cy.url().should("include", `celo/txs/${CELO.tx_hash.toLowerCase()}`);
    });
  });
});
