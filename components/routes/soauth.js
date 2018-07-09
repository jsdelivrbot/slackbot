"use strict";

const nforce = require("nforce");

// SF_CLIENT_ID = process.env.SF_CLIENT_ID,
// SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET,
// SF_USER_NAME = process.env.SF_USER_NAME,
// SF_PASSWORD = process.env.SF_PASSWORD

// console.log(`Client ID: ${SF_CLIENT_ID}\nClient Secret: ${SF_CLIENT_SECRET}`)
module.exports = (message, controller) => {
  var org = nforce.createConnection({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    environment: "sandbox",
    redirectUri: "http://localhost:3000/oauth/_callback",
    mode: "single",
    autoRefresh: true
  });
console.log(controller)
  var oauth = soauth()
  
  soauth = () => {
    console.log("Authenticating with Salesforce");
    org.authenticate(
      { username: SF_USER_NAME, password: SF_PASSWORD },
      (err, resp) => {
        if (err) {
          console.error("--> unable to authenticate to SFDC");
          console.error("--> " + JSON.stringify(err));
        } else {
          console.log("--> authenticated!");
          oauth = resp;
          console.log(resp);
          createCase(message)
        }
      }
    );
  }

  createCase = message => {
    return new Promise((resolve, reject) => {
      let c = nforce.createSObject("Case");
      c.set("u_int_type", "Invitae New Ticket");
      c.set("u_int_account", "Invitae");
      c.set("u_subject", message.subject);
      c.set("u_description", message.description);
      c.set("u_first_name", "chad");
      c.set("u_last_name", "infanger");
      c.set("u_email", "a@aol.com");
      c.set("u_phone", "3213213215");
      c.set("u_ad_id", "cinfa");
      c.set("u_contact_id", message.user);
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
  };
};

//testVars();

//
//
//  TESTING
//  ZONE
//
//