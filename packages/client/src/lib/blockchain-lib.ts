import { NETWORK_NAME } from "@anthem/utils";
import { MOCK_BLOCKCHAIN_TRANSACTION_RESULT } from "test/data/mock-blockchain-transactions-result";
import Toast from "ui/Toast";
import ENV from "./client-env";

/** ===========================================================================
 * Cosmos Blockchain Module
 * ============================================================================
 */

class BroadcastTransactionModule {
  headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  broadcastTransaction = async (body: any, network: NETWORK_NAME) => {
    const response = await fetch(`${ENV.SERVER_URL}/api/broadcast-tx`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ tx: body, network }),
    });
    const data = await response.json();
    return data;
  };

  pollTransaction = async (hash: string, network: NETWORK_NAME) => {
    const response = await fetch(`${ENV.SERVER_URL}/api/poll-tx`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ hash, network }),
    });
    const data = await response.json();
    return data;
  };
}

/** ===========================================================================
 * Mock Module
 * ============================================================================
 */

class MockBroadcastTransaction {
  broadcastTransaction = async (body: any) => {
    return MOCK_BLOCKCHAIN_TRANSACTION_RESULT;
  };

  pollTransaction = async (hash: string) => {
    await new Promise((_: any) => setTimeout(_, 3000));
    Toast.warn(
      "Note: this response is from the offline development-mode blockchain module.",
    );
    return MOCK_BLOCKCHAIN_TRANSACTION_RESULT;
  };
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const broadcastTransactionModule = new BroadcastTransactionModule();

const mockCosmosBlockchain = new MockBroadcastTransaction();

export default ENV.ENABLE_MOCK_APIS
  ? mockCosmosBlockchain
  : broadcastTransactionModule;
