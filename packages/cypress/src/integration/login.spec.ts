import { SCREEN_SIZES, UTILS } from "../support/cypress-utils";
import { NETWORK_ADDRESS_DEFAULTS } from "@anthem/utils";

const { OASIS, CELO } = NETWORK_ADDRESS_DEFAULTS;

/** ===========================================================================
 * Test logging in with an address
 * ============================================================================
 */

SCREEN_SIZES.forEach(({ size, type }) => {
  describe(`Anthem supports login with a Celo address, viewport: ${size}`, () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "celo");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("After logging in with an address balance details are visible for that address", () => {
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

  describe(`Anthem supports login with an Oasis address, viewport: ${size}`, () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "oasis");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("After logging in with an address balance details are visible for that address", () => {
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

    it("Oasis address is persisted on page reload", () => {
      cy.reload();
      UTILS.shouldContainText("balance-total", "ROSEs");
    });
  });

  describe(`Transaction details can be viewed by searching transaction hashes, viewport: ${size}`, () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "celo");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("Oasis transactions can be viewed by hash", () => {
      if (!type.isDesktop()) {
        return;
      }

      // Login with Oasis
      UTILS.searchInAddressInput(OASIS.account);

      // Enter a Oasis transaction hash
      UTILS.searchInAddressInput(OASIS.tx_hash);

      UTILS.checkForNetwork("oasis");
      cy.contains("Transaction Detail");
      cy.url().should("include", `oasis/txs/${OASIS.tx_hash.toLowerCase()}`);
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

  describe(`Celo Network display cUSD portfolio chart, viewport: ${size}`, () => {
    beforeEach(() => {
      UTILS.setViewportSize(size);
      UTILS.loginWithAddress(type, "celo");
    });

    afterEach(() => {
      UTILS.logout(type);
    });

    it("cUSD chart is visible", () => {
      if (!type.isDesktop()) {
        return;
      }

      UTILS.checkForNetwork("celo");
      cy.contains("cUSD");
    });
  });
});
