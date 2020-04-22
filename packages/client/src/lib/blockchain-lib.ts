import { NETWORK_NAME } from "@anthem/utils";
import Toast from "components/Toast";
import ENV from "./client-env";

/** ===========================================================================
 * Cosmos Blockchain Module
 * ============================================================================
 */

class CosmosBlockchainModule {
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

class MockCosmosBlockchain {
  broadcastTransaction = async (body: any) => {
    return {
      height: "1723963",
      txhash:
        "0063860028A079244B43AE9F347027A3518FE984E1C5F809C76851D4DD24CF58",
      raw_log: `[{"msg_index":"0","success":true,"log":""}]`,
      logs: [{ msg_index: "0", success: true, log: "" }],
      gas_wanted: "150000",
      gas_used: "109449",
      tags: [
        { key: "action", value: "delegate" },
        {
          key: "delegator",
          value: "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
        },
        {
          key: "destination-validator",
          value: "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
        },
      ],
      tx: {
        type: "auth/StdTx",
        value: {
          msg: [
            {
              type: "cosmos-sdk/MsgDelegate",
              value: {
                delegator_address:
                  "cosmos1gk6yv6quevfd93zwke75cn22mxhevxv00pc350",
                validator_address:
                  "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
                amount: { denom: "uatom", amount: "50000" },
              },
            },
          ],
          fee: { amount: [{ denom: "uatom", amount: "1500" }], gas: "150000" },
          signatures: [
            {
              pub_key: {
                type: "tendermint/PubKeySecp256k1",
                value: "A5CPW9HAUXnCtKHhcD33TDfw2gItO0Qa6opVxFHKKhBu",
              },
              signature:
                "C/9TZHtmG0SW0Kj1z/67Q7Q9f2uLmr5InBFQS3Pnnlc4uCmh6ou3Fb83Y4YtyRyviT9DNT1WcOD1NmVsDMYFjg==",
            },
          ],
          memo: "Stake online with Chorus One at https://chorus.one",
        },
      },
      timestamp: "2019-09-07T16:09:03Z",
    };
  };

  pollTransaction = async (hash: string) => {
    await new Promise((_: any) => setTimeout(_, 3000));
    Toast.warn(
      "Note: this response is from the offline development-mode blockchain module.",
    );
    return {
      height: 100,
      logs: [{ success: true }],
    };
  };
}

/** ===========================================================================
 * Export
 * ============================================================================
 */

const cosmosBlockchainModule = new CosmosBlockchainModule();

const mockCosmosBlockchain = new MockCosmosBlockchain();

export default ENV.ENABLE_MOCK_APIS
  ? mockCosmosBlockchain
  : cosmosBlockchainModule;
