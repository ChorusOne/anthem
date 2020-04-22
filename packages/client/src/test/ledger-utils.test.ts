import { transaction } from "test/data/mock-transaction-data.json";
import { createSignMessage } from "tools/ledger-utils";

describe("ledger-utils", () => {
  test("createSignMessage", () => {
    const metadata = {
      account_number: "146",
      chain_id: "cosmoshub-2",
      fees: "225000000",
      from: "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg",
      generate_only: false,
      sequence: "44",
    };

    const transactionData = {
      txMsg: transaction.tx.value,
      txRequestMetadata: metadata,
    };

    const result = createSignMessage(transactionData);
    expect(result).toMatchInlineSnapshot(
      `"{\\"account_number\\":\\"146\\",\\"chain_id\\":\\"cosmoshub-2\\",\\"fee\\":{\\"amount\\":[{\\"amount\\":\\"930\\",\\"denom\\":\\"uatom\\"}],\\"gas\\":\\"37188\\"},\\"memo\\":\\"(Sent via Lunie)\\",\\"msgs\\":[{\\"type\\":\\"cosmos-sdk/MsgSend\\",\\"value\\":{\\"amounts\\":[{\\"amount\\":\\"2000000\\",\\"denom\\":\\"uatom\\"}],\\"from_address\\":\\"cosmos15urq2dtp9qce4fyc85m6upwm9xul3049um7trd\\",\\"to_address\\":\\"cosmos16nte2qf5l0u39s86wcwu4fff4vdtvg7yn3uksu\\"}}],\\"sequence\\":\\"44\\"}"`,
    );
  });
});
