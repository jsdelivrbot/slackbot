"use strict";
require("dotenv").config();

const nforce = require("nforce"),
  SF_CLIENT_ID = process.env.SF_CLIENT_ID,
  SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
  SF_USER_NAME = process.env.SF_USER_NAME,
  SF_PASSWORD = process.env.SF_PASSWORD,
  org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri: "http://localhost:3000/oauth/_callback",
    mode: "single",
    autoRefresh: true
  });

let login = () => {
  org.authenticate({ username: SF_USER_NAME, password: SF_PASSWORD }, err => {
    if (err) {
      resHandle(err, null, null);
    } else {
      console.log("Authentication successful");
    }
  });
};

let createCase = newCase => {
  return new Promise((resolve, reject) => {
    let c = nforce.createSObject("Case");
    c.set("subject", newCase.subject);
    c.set("description", newCase.description);
    c.set("origin", "Slack");
    c.set("status", "New");
    console.log(c)
    org.insert({ sobject: c }, err => {
      if (err) {
        console.error(err);
        reject("An error occurred while creating a case");
      } else {
        resolve(c);
      }
    });
  });
};

login();

exports.org = org;
exports.createCase = createCase;

// Test for local variables
//testVars();
function testVars() {
  console.log(
    "-- Env variables: START --\n" +
      `Client ID: ${process.env.SF_CLIENT_ID}\n` +
      `Client secret: ${process.env.SF_CLIENT_SECRET}\n` +
      `Username: ${process.env.SF_USER_NAME}\n` +
      `Password: ${process.env.SF_PASSWORD}\n` +
      `Access token: ${process.env.SF_ACCESS_TOKEN}\n` +
      `Redirect URI: ${process.env.SF_REDIRECT_URI}\n` +
      `Auth URL: ${process.env.SF_URL}\n` +
      "-- Env variables: END --\n"
  );
}

// test POST
function resHandle(error, response, body) {
  if (error) {
    console.error(error);
    process.exit();
  }
  if (response) {
    console.log(`Status code: ${response && response.statusCode}\n`);
  }
  if (body) {
    console.log(`Body: ${body}\n`);
  }
}
