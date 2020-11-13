import {
  assertUnreachable,
  getNetworkDefinitionFromIdentifier,
  NETWORK_NAME,
} from "@anthem/utils";
import axios from "axios";
import express from "express";
import { PaginationParams } from "./resolvers/resolvers";
import CELO from "./sources/celo";
import COSMOS_EXTRACTOR from "./sources/cosmos-extractor";
import OASIS from "./sources/oasis";
import { AxiosUtil, getHostFromNetworkName } from "./tools/axios-utils";
import { logger } from "./tools/server-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const Router = express.Router();

/** ===========================================================================
 * Cosmos LCD APIs
 * ============================================================================
 */

interface LcdRequestError {
  response: {
    data: {
      error: string;
    };
  };
}

const formatLcdRequestError = (error: LcdRequestError) => {
  try {
    return {
      error: error.response.data.error,
    };
  } catch (err) {
    return { error: "Request Failed" };
  }
};

/**
 * [OASIS LEDGER TODO]:
 *
 * Additional APIs will need to be added here for the other Oasis Ledger
 * transaction types, e.g. delegate, undelegate, redelegate.
 */

// Get a payload to sign for an Oasis Delegation transaction
Router.post("/oasis/delegate", async (req, res) => {
  try {
    const { body } = req;
    const host = getHostFromNetworkName("OASIS");
    const url = `${host}/transaction/create/stake`;
    console.log("Handling /oasis/transfer request");
    const { data } = await axios.post(url, body);
    console.log(data);
    return res.send(JSON.stringify(data));
  } catch (err) {
    logger.error(err, true);
    res.status(400);
    res.send({ error: "Failed to get sign payload." });
  }
});

// Get a payload to sign for an Oasis Transfer transaction
Router.post("/oasis/transfer", async (req, res) => {
  try {
    const { body } = req;
    const host = getHostFromNetworkName("OASIS");
    const url = `${host}/transaction/create/transfer`;
    console.log("Handling /oasis/transfer request");
    const { data } = await axios.post(url, body);
    console.log(data);
    return res.send(JSON.stringify(data));
  } catch (err) {
    logger.error(err, true);
    res.status(400);
    res.send({ error: "Failed to get sign payload." });
  }
});

// Submit an Oasis transaction
Router.post("/oasis/transfer/send", async (req, res) => {
  try {
    const { body } = req;
    const host = getHostFromNetworkName("OASIS");
    const url = `${host}/transaction/submit`;
    console.log("Handling /oasis/transfer/send request");

    const { data } = await axios.post(url, body, {
      // Hard-coded for access token for now (ask Dave):
      headers: {
        Authorization:
          "Bearer 41461b9bb96199527ffcc6d05212b25b19ff734494f56d861c9454b52c24a4d7",
      },
    });
    console.log(data);
    return res.send(JSON.stringify(data));
  } catch (err) {
    logger.error(err, true);
    res.status(400);
    res.send({ error: "Failed to get send signed transaction." });
  }
});

// Broadcast a transaction
Router.post("/broadcast-tx", async (req, res) => {
  try {
    const { tx, network } = req.body;
    const name: NETWORK_NAME = network;
    logger.log(`Broadcasting ${name} transaction!`);

    switch (name) {
      case "COSMOS":
      case "KAVA":
      case "TERRA": {
        const host = getHostFromNetworkName(network);
        const url = `${host}/txs`;
        const { data } = await axios.post(url, tx);
        return res.send(JSON.stringify(data));
      }
      case "OASIS": {
        /**
         * TODO: Broadcast transaction data to Oasis node.
         */
        console.log("Processing Oasis Transaction, data:");
        console.log(tx);
        return res.status(200).send({ result: "OK" });
      }
      case "CELO":
      case "POLKADOT": {
        return res.status(400).send({
          error: `${name} network does not supporting broadcasting transactions via API.`,
        });
      }
      default:
        assertUnreachable(name);
    }
  } catch (err) {
    logger.error(err, true);
    res.status(400);
    res.send(formatLcdRequestError(err));
  }
});

// Poll a transaction
Router.post("/poll-tx", async (req, res) => {
  try {
    const { hash, network } = req.body;
    logger.log(`Polling for ${network} transaction, hash: ${hash}`);
    const host = getHostFromNetworkName(network);
    const url = `${host}/txs/${hash}`;
    const result = await AxiosUtil.get(url);
    res.json(result);
  } catch (err) {
    logger.error(err, true);
    res.status(400);
    res.send(formatLcdRequestError(err));
  }
});

// API to download all transaction history as JSON
Router.get("/tx-history/:network/:address", async (req, res) => {
  try {
    const { address, network: networkName } = req.params;
    const network = getNetworkDefinitionFromIdentifier(networkName);
    console.log(
      `Fetching transaction history for address: ${address}, network: ${network.name}`,
    );

    const { name } = network;
    let transactions: any[] = [];

    const params: PaginationParams = {
      address,
      network,
      pageSize: 1000,
      startingPage: 1,
    };

    switch (name) {
      case "KAVA":
      case "TERRA":
      case "COSMOS": {
        const result = await COSMOS_EXTRACTOR.getTransactions(params);
        transactions = result.data;
        break;
      }
      case "OASIS": {
        const result = await OASIS.fetchTransactions(params);
        transactions = result.data;
        break;
      }
      case "CELO": {
        const result = await CELO.fetchTransactions(params);
        transactions = result.data;
        break;
      }
      case "POLKADOT":
        break;
      default:
        return assertUnreachable(name);
    }

    console.log(`Received ${transactions.length} results!`);
    return res.json(transactions);
  } catch (err) {
    res.status(400);
    res.send(err);
  }
});

/** ===========================================================================
 * Regular REST APIs
 * ============================================================================
 */

// Email Newsletter signup route
Router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    await axios.post("https://chorusone.substack.com/api/v1/import/form", {
      email,
    });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

/** ===========================================================================
 * Export
 * ============================================================================
 */

export default Router;
