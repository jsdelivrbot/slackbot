const jokes = require("./jokes"),
  salesforce = require("./salesforce"),
  formatter = require("./slack-formatter");

// function postText(text) {
//   app.bot.postMessageToChannel("general", text);
// }

module.exports.parseRequest = msg => {
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
};

module.exports = function(controller) {
  controller.config.help.push({
    "name": "New Ticket",
    "help":{
      "new ticket": "Opens the ticket creation dialog. Other text variations can be used as well. Example: make ticket, open a ticket, etc...",
      "nt": "Opens the ticket creation dialog. This is the shorthand command."
    }
  });
};
