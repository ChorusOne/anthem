import axios from "axios";
import express from "express";
import logger from "../tools/logger-utils";
import { AxiosUtil, getHostFromNetworkName } from "./axios-utils";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const Router = express.Router();

/** ===========================================================================
 * API routes
 * ============================================================================
 */

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
    res.sendStatus(400);
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
    res.sendStatus(400);
  }
});

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
