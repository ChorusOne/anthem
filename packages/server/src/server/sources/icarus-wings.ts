const fetch = require("node-fetch");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

// Fetch data from URL
const fetchData = async URL => {
  const response = await fetch(URL);
  const data = await response.text();
  return data;
};

// Given a URL of a Proposal.md file : extracts and returns the title of the proposal
const FetchProposalTitleFromURL = async URL => {
  let title;

  const db = await open({
    filename: "./wings.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
  CREATE TABLE IF NOT EXISTS proposals (
    url TEXT UNIQUE,
    title TEXT
  )`);

  const res = await db.get(
    `
  SELECT * from "proposals"
  WHERE url="${URL}"
  `,
  );

  title = res && res.title;

  if (!title) {
    const data = await fetchData(URL);

    const regex = /]:([^\n]+)/;

    const result = regex.exec(data);

    title = result[1].trim();

    // Adding result to cache
    await db.exec(
      `
      INSERT INTO "proposals"
      VALUES ("${URL}","${title}")
      `,
    );
  }

  return title;
};

// Generates URL of markdown file from proposalId
const generateUrl = proposalId => {
  let URL =
    "https://raw.githubusercontent.com/celo-org/celo-proposals/master/CGPs/";

  const parsedProposalId = ("000000" + proposalId).slice(-4);

  URL = URL + parsedProposalId + ".md";

  return URL;
};

// Given a Proposal ID > 0 : returns the title of the corresponding proposal
const FetchProposalTitleFromID = async proposalId => {
  if (proposalId <= 0) {
    return "";
  }

  const URL = generateUrl(proposalId);

  const title = await FetchProposalTitleFromURL(URL);

  return title;
};

// Validator Group Details Functions ---->

// Returns object that contains useful data
const getClaimObject = (data, keyword) => {
  const object = data.claims.filter(claim => claim.type === keyword);

  return object[0];
};

// Parse all required info from keybase api for a given username
const fetchKeybaseData = async username => {
  try {
    let response = await fetch(
      `https://keybase.io/_/api/1.0/user/lookup.json?usernames=${username}&field=basics,proofs_summary,pictures`,
    );

    response = await response.json();

    // Collecting useful data objects
    const basics = response.them[0].basics;
    const pictures = response.them[0].pictures;
    const proofsSummary = response.them[0].proofs_summary;

    // Extracting logo
    const logoUrl = pictures.primary.url;

    // Extracting social links
    const socialLinks = {};
    proofsSummary.all.map(proof => {
      socialLinks[proof.proof_type] = proof.service_url;
    });

    return { username, socialLinks, logoUrl };
  } catch (error) {
    return undefined;
  }
};

// Given the URL of a metadata file of a validator group, returns its metadata in JSON format
// If metadata file contains a keybase reference, then the response also includes metadata from keybase
const FetchValidatorGroupDetails = async URL => {
  let returnData;

  const db = await open({
    filename: "./wings.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
  CREATE TABLE IF NOT EXISTS validator_groups (
    url TEXT,
    data TEXT
  )
  `);

  // Checking the cache
  const res = await db.get(`
  SELECT * from "validator_groups"
  WHERE url="${URL}"
  `);

  returnData = res && JSON.parse(res.data);

  if (!res) {
    let data = await fetchData(URL);

    data = JSON.parse(data);

    const domain = getClaimObject(data, "DOMAIN").domain;

    let keybaseObject = getClaimObject(data, "KEYBASE");

    if (keybaseObject) {
      keybaseObject = await fetchKeybaseData(keybaseObject.username);
    }

    returnData = { domain, keybase: keybaseObject || null };

    await db
      .exec(
        `
    INSERT into "validator_groups"
    VALUES ("${URL}",'${JSON.stringify(returnData)}')
    `,
      )
      .catch(err => console.log(err));
  }

  return returnData;
};

module.exports = {
  FetchProposalTitleFromID,
  FetchValidatorGroupDetails,
  FetchProposalTitleFromURL,
};
