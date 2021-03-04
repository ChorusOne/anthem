import { UTILS, getScreenType } from "../support/cypress-utils";

/** ===========================================================================
 * Test Ledger transactions
 * ============================================================================
 */

describe("Test Ledger Transactions", () => {
  beforeEach(() => {
    UTILS.loginWithAddress(getScreenType(), "celo", true);
  });

  afterEach(() => {
    UTILS.logout(getScreenType());
  });

  // Error with no value:
  it("The delegation transaction workflow can be completed", () => {
    UTILS.findAndClick("stake-button");
    UTILS.findAndClick("validator-0x81cef0668e15639d0b101bdc3067699309d73bed");
    UTILS.findAndClick("delegate-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.shouldMatchText(
      "amount-transaction-error",
      "Please input an amount.",
    );

    // Open the validator menu and selector a validator
    UTILS.findAndClick("validator-composition-select-menu");
    UTILS.findAndClick("ChorusOne-delegation-option");

    // Error with very large value added:
    UTILS.typeText("transaction-amount-input", "500000000000");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.shouldMatchText(
      "amount-transaction-error",
      "Final value is greater than the maximum available.",
    );

    UTILS.findAndClick("transaction-delegate-all-toggle");

    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    cy.wait(5000);

    UTILS.findAndClick("transaction-dialog-close-button");
  });

  it("The unlocking transaction workflow can be completed", () => {
    UTILS.findAndClick("stake-button");
    UTILS.findAndClick("unlock-gold-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");

    // Error with no validators selected:
    UTILS.shouldMatchText(
      "amount-transaction-error",
      "Please input an amount.",
    );

    UTILS.findAndClick("transaction-delegate-all-toggle");

    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    cy.wait(5000);

    UTILS.findAndClick("transaction-dialog-close-button");
  });

  it("The send transaction workflow can be completed", () => {
    UTILS.findAndClick("send-receive-button");

    // Connect with ledger
    UTILS.findAndClick("CELO-network-login");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");

    // Error with no validators selected:
    UTILS.shouldMatchText(
      "amount-send-transaction-error",
      "Please input an amount.",
    );

    // Error with very large value added:
    UTILS.typeText("transaction-send-amount-input", "5000000000000000000");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.shouldMatchText(
      "amount-send-transaction-error",
      "Final value is greater than the maximum available.",
    );

    // Enter an amount
    UTILS.typeText("transaction-send-amount-input", "1");
    UTILS.typeText(
      "transaction-send-recipient-input",
      "0x47b2dB6af05a55d42Ed0F3731735F9479ABF0673",
    );

    UTILS.findAndClick("ledger-dialog-confirmation-button");
    UTILS.findAndClick("ledger-dialog-confirmation-button");
    cy.wait(5000);
    UTILS.findAndClick("transaction-dialog-close-button");
  });
});
