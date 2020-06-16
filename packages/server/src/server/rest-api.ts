import {
  assertUnreachable,
  getNetworkDefinitionFromIdentifier,
} from "@anthem/utils";
import axios from "axios";
import express from "express";
import { logger } from "../tools/server-utils";
import { AxiosUtil, getHostFromNetworkName } from "./axios-utils";
import { PaginationParams } from "./resolvers/resolvers";
import CELO from "./sources/celo";
import COSMOS_EXTRACTOR from "./sources/cosmos-extractor";
import OASIS from "./sources/oasis";

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

// Broadcast a transaction
Router.post("/broadcast-tx", async (req, res) => {
  try {
    const { tx, network } = req.body;
    logger.log(`Broadcasting ${network} transaction!`);
    const host = getHostFromNetworkName(network);
    const url = `${host}/txs`;
    const { data } = await axios.post(url, tx);
    res.send(JSON.stringify(data));
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
