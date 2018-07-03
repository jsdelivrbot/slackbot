const jokes = require("./jokes"),
  salesforce = require("./salesforce"),
  formatter = require("./slack-formatter");

// function postText(text) {
//   app.bot.postMessageToChannel("general", text);
// }

function parseRequest(msg) {
  console.log("Parsing!!");
  if (msg.includes(" jokes")) {
    jokes.randomJoke();
  } else if (msg.includes(" help")) {
    helpDemo();
  } else if (msg.includes(" search")) {
    let name = message.match[1];
    salesforce
      .findContact(name)
      .then(contacts =>
        bot.reply(message, {
          text: "I found these contacts matching  '" + name + "':",
          attachments: formatter.formatContacts(contacts)
        })
      )
      .catch(error => bot.reply(message, error));
  }
}

module.exports.parseRequest = parseRequest;
