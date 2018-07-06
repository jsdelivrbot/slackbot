"use strict";
require("dotenv").config();

const nforce = require("./nforce"),
  SF_CLIENT_ID = process.env.SF_CLIENT_ID,
  SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
  SF_USER_NAME = process.env.SF_USER_NAME,
  SF_PASSWORD = process.env.SF_PASSWORD,
  org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    environment: 'sandbox',
    redirectUri: "http://localhost:3000/oauth/_callback",
    mode: "single",
    autoRefresh: true
  });

var oauth;

// separate channel for escalation notifications

function createCase(newCase) {
  return new Promise((resolve, reject) => {
    let c = nforce.createSObject("Case");
    c.set("u_int_type", "Invitae New Ticket");
    c.set("u_int_account", "Invitae");
    c.set("u_subject", newCase.subject);
    c.set("u_description", newCase.description);
    c.set("u_first_name", "chad");
    c.set("u_last_name", "infanger");
    c.set("u_email", "a@aol.com");
    c.set("u_phone", "3213213215");
    c.set("u_ad_id", "cinfa");
    c.set("u_contact_id", newCase.user);
    console.log("---> Object: ", c);
    org.insert({ sobject: c, oauth: oauth }, (err, resp) => {
      if (err) {
        console.error("---> Unsuccessful: ", err);
        reject("An error occurred while creating a case");
      } else {
        console.log("---> Success: ", resp);
        resolve(c);
      }
    });
  });
}

console.log("Authenticating with Salesforce");

org.authenticate(
  { username: SF_USER_NAME, password: SF_PASSWORD },
  (err, resp) => {
    if (err) {
      console.error("--> unable to authenticate to sfdc");
      console.error("--> " + JSON.stringify(err));
    } else {
      console.log("--> authenticated!");
      oauth = resp;
      console.log(resp);
    }
  }
);

//testVars();
exports.createCase = createCase;

//
//
//  TESTING
//  ZONE
//
//

// Test for local variables
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
