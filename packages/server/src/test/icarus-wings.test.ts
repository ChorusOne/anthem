import {
  fetchProposalTitleFromID,
  fetchValidatorGroupDetails,
} from "../server/sources/icarus-wings";

describe.only("Icarus Wings Test", () => {
  test("fetchProposalTitleFromID", async () => {
    const result = await fetchProposalTitleFromID(3);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "contents": "# CGP [0003]: Unfreeze Celo Gold Transfers

      - Date: 2020-05-12
      - Author(s): @aslawson
      - Status: EXECUTED
      - Governance Proposal ID #: 3
      - Date Executed: 2020-05-18

      ## Overview

      This change unfreezes Celo Gold transfers by removing the GoldToken smart contract from the Freezer contract's \`isFrozen\` map.

      ## Proposed Changes

      1. Remove GoldToken smart contract from the Freezer
        - Destination: Freezer, [unfreeze](https://github.com/celo-org/celo-monorepo/blob/de09a44f5ea2c2116506a6b3d05dcaaef92d4fad/packages/protocol/contracts/common/Freezer.sol#L27)
        - Data: 0x471EcE3750Da237f93B8E339c536989b8978a438 (GoldToken Address)
        - Value: 0 (NA)

      ## Verification

      1. Confirm proposal steps: run \`celocli governance:view --proposalID 3\`
      2. Confirm GoldToken address: run \`celocli network:contracts\`

      ### Post-Execution Verification

      1. Check that a (non-whitelisted) account can transfer celo gold to another (non-whitelisted) account.  You can do so by running CeloCli tooling for [transfer:gold](https://docs.celo.org/command-line-interface/transfer#gold)
      2. Check Freezer [isFrozen map](https://github.com/celo-org/celo-monorepo/blob/de09a44f5ea2c2116506a6b3d05dcaaef92d4fad/packages/protocol/contracts/common/Freezer.sol#L9) no longer contains the GoldToken Address.

      ## Risks

      Low risk, if unsuccessful there is no change to the network.

      ## Useful Links

      - NA
      ",
        "title": "Unfreeze Celo Gold Transfers",
      }
    `);
  });

  test("fetchValidatorGroupDetails", async () => {
    const result = await fetchValidatorGroupDetails(
      "https://gist.githubusercontent.com/cachitu/84a96450d895aedbc3d414f73d269641/raw/dd0d275d4d91fd642f8978bbacfb4990284555c6/celo_mainnet_group.json",
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "domain": "kytzu.com",
        "keybase": Object {
          "logoUrl": "https://s3.amazonaws.com/keybase_processed_uploads/3b72c1a2f1efd5f7fed0bacd6a787e05_360_360.jpg",
          "socialLinks": Object {
            "generic_web_site": "https://kytzu.com",
            "github": "https://github.com/cachitu",
            "market.link": "https://market.link/handles/kytzu_team",
            "reddit": "https://reddit.com/user/kytzucc",
            "twitter": "https://twitter.com/kytzu",
          },
          "username": "kytzu",
        },
      }
    `);
  });

  test("fetchProposalTitleFromURL", async () => {
    const result = await fetchValidatorGroupDetails(
      "https://gist.githubusercontent.com/WilliamGuozi/b78b751df572f6a8adc9847141ee1aea/raw/9f79aee0772bf4583ac9edd4aaefa0f7f99e6a6f/group-metadata-rc1.json",
    );
    expect(result).toMatchInlineSnapshot(`
      Object {
        "domain": "sparkpool.com",
        "keybase": null,
      }
    `);
  });
});
