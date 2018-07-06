var nforce = require("nforce");

require("dotenv").config();

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
testVars();

var sfuser = process.env.SF_USER_NAME,
  sfpass = process.env.SF_PASSWORD;

var oauth;

var org = nforce.createConnection({
  clientId: process.env.SF_CLIENT_ID,
  clientSecret: process.env.SF_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/oauth/_callback"
});

function insertLead() {
  var ld = nforce.createSObject("Contact", {
    "u_int_type": "Invitae New Ticket",
    "u_int_account": "Invitae",
    "u_subject": "Test Subject",
    "u_description": "Test description",
    "u_first_name": "",
    "u_last_name": "",
    "u_email": "",
    "u_phone": "",
    "u_ad_id": "[Slack Username]"
    });
  console.log("\nAttempting to insert lead\n",ld);
  org.insert({ sobject: ld, oauth: oauth }, function(err, resp) {
    if (err) {
      console.error("\n--> unable to insert lead");
      console.error("--> " + JSON.stringify(err));
      process.exit();
    } else {
      console.log("\n--> lead inserted\n", resp);
      // updateLead(ld);
    }
  });
}

function initialize() {
  console.log("Authenticating with Salesforce\n");

  org.authenticate({ username: sfuser, password: sfpass }, function(err, resp) {
    if (err) {
      console.error("\n--> unable to authenticate to sfdc\n");
      console.error("--> " + JSON.stringify(err));
      process.exit();
    } else {
      console.log("\n--> authenticated!\n", resp);
      oauth = resp;
      insertLead();
    }
  });
}

exports.initialize = initialize;
