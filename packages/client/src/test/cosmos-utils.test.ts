import { NETWORKS } from "@anthem/utils";
import { transaction } from "test/data/mock-transaction-data.json";
import {
  createCosmosTransactionPostBody,
  createDelegationTransactionMessage,
  createRewardsClaimTransaction,
  createTransactionRequestMetadata,
} from "tools/cosmos-utils";
import { cosmosAccountInformation } from "../../../utils/src/client/data/cosmosAccountInformation.json";
import { cosmosRewardsByValidator } from "../../../utils/src/client/data/cosmosRewardsByValidator.json";

describe("cosmos-utils", () => {
  test("createDelegationTransactionMessage", () => {
    const result = createDelegationTransactionMessage({
      amount: "50",
      address: "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg",
      gasAmount: "1500",
      gasPrice: "150000",
      denom: "uatom",
      network: NETWORKS.COSMOS,
      validatorOperatorAddress:
        "cosmosvaloper15urq2dtp9qce4fyc85m6upwm9xul3049e02707",
    });

    expect(result).toMatchSnapshot();
  });

  test.skip("createRewardsClaimTransaction", () => {
    /**
     * TODO: Fix this test!
     */
    const result = createRewardsClaimTransaction({
      address: "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg",
      gasAmount: "1500",
      gasPrice: "150000",
      denom: "uatom",
      // @ts-ignore
      selectedRewards: cosmosRewardsByValidator,
    });

    expect(result).toMatchSnapshot();
  });

  test("createTransactionRequestMetadata", () => {
    const result = createTransactionRequestMetadata({
      address: "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg",
      gasAmount: "1500",
      gasPrice: "150000",
      account: cosmosAccountInformation,
      network: NETWORKS.COSMOS,
    });

    expect(result).toMatchSnapshot();
  });

  test("createCosmosTransactionPostBody", () => {
    const { value } = transaction.tx;
    const { pub_key, signature } = value.signatures[0];
    value.signatures = [];
    const metadata = {
      account_number: "146",
      chain_id: "cosmoshub-3",
      fees: "225000000",
      from: "cosmos1yeygh0y8rfyufdczhzytcl3pehsnxv9d3wsnlg",
      generate_only: false,
      sequence: "44",
    };
    const transactionData = {
      txMsg: value,
      txRequestMetadata: metadata,
    };
    const result = createCosmosTransactionPostBody({
      transactionData,
      signature,
      publicKey: pub_key.value,
    });
    expect(result).toMatchSnapshot();
  });
});
