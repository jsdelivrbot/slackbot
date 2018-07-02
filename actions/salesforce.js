"use strict"

const SF_CLIENT_ID =
    "3MVG9AJuBE3rTYDg8cnWQK_PLHQW91c6wWl95D6Pn.3OuqzJ1GtdEkifzyrVjadN50rcBkA2O2BiUIIFwU7Sz", //process.env.SF_CLIENT_ID,
  SF_CLIENT_SECRET = "3002508663153639280", //process.env.SF_CLIENT_SECRET,
  SF_USER_NAME = "invitaeslack@taos.com.invitae", //process.env.SF_USER_NAME,
  SF_ACCESS_TOKEN = "XR82pq6thJJSdlMbE2D76qa79",
  SF_PASSWORD = "ypkHJrXX2nG*s9!" + SF_ACCESS_TOKEN, //process.env.SF_PASSWORD
  SF_URL = "https://test.salesforce.com/services/oauth2/token",
  SF_REDIRECT_URI = "http://localhost:3000/oauth/_callback";

let nforce = require("nforce");

// SF_CLIENT_ID = process.env.SF_CLIENT_ID,
// SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
// SF_USER_NAME = process.env.SF_USER_NAME,
// SF_PASSWORD = process.env.SF_PASSWORD;

let org = nforce.createConnection({
  clientId: SF_CLIENT_ID,
  clientSecret: SF_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/oauth/_callback",
  mode: "single",
  autoRefresh: true
});

let login = () => {
  org.authenticate({ username: SF_USER_NAME, password: SF_PASSWORD }, err => {
    console.error("Authenticating...");
    if (err) {
      console.log("Failed: ")
      console.error(err);
    } else {
      console.log("Successful.");
    }
  });
};

login();
