const fs = require("fs"),
  salesforce = require("../components/routes/soauth"),
  formatter = require("./slack-formatter");

// function postText(text) {
//   app.bot.postMessageToChannel("general", text);
// }
module.exports = function(controller) {
  controller.config.help.push({
    name: "New Ticket",
    help: {
      "new ticket":
        "Opens the ticket creation dialog. Other text variations can be used as well. Example: make ticket, open a ticket, etc...",
      nt: "Opens the ticket creation dialog. This is the shorthand command."
    }
  });

  controller.hears(
    ["(.*)"],
    "direct_message,direct_mention,mention",
    (bot, message) => {
      getClientData()
        .then(clientData => {
          let projects = clientData;
          let payload = {
            ephemeral: "true",
            attachments: [
              {
                title: "Would you like to create a ticket?",
                callback_id: "createTicketPrompt",
                attachment_type: "default",
                actions: []
              }
            ]
          };
          for (let project in projects) {
            payload.attachments[0].actions.push(
              generateReplyActions(projects[project])
            );
          }
          payload.attachments[0].actions.push({
            name: "no",
            text: "No",
            value: "no",
            type: "button"
          });

          bot.startConversation(message, function(error, convo) {
            if (error) {
              console.error("botkit:new-ticket_dm-mention:convo: %s", error);
              convo.stop();
            } else {
              convo.say(payload);
              convo.next();
            }
          });
        })
        .catch(reason => {
          console.error("botkit:new-ticket_dm-mention:hears: ", reason);
        });

      let subject, description;
      let askSubject = (response, convo) => {
        convo.ask("What's the subject?", (response, convo) => {
          subject = response.text;
          askDescription(response, convo);
          convo.next();
        });
      };
      let askDescription = (response, convo) => {
        convo.ask("Enter a description for the case", (response, convo) => {
          description = response.text;
          salesforce({
            subject: subject,
            description: description,
            user: message.user
          })
            .then(_case => {
              bot.reply(message, {
                text: "I created the case:",
                attachments: formatter.formatCase(_case)
              });
              convo.next();
            })
            .catch(error => {
              bot.reply(message, error);
              convo.next();
            });
        });
      };
      bot.reply(message, "Let's create a new ticket!");
      bot.startConversation(message, askSubject);
    }
  );

  // Get client data from clientMap.json
  function getClientData() {
    return new Promise(function(resolve, reject) {
      let json = {};
      fs.readFile(process.env.clientData || "clientData.json", "utf8", function(
        error,
        data
      ) {
        if (error) {
          reject("Unable to read file: " + error);
        } else {
          try {
            json = JSON.parse(data);
          } catch (e) {
            console.error(
              "botkit:new-ticket_dm-mention: Unable to parse JSON from file: %s",
              e
            );
          }
          // debug("fs.fileRead:", util.inspect(json, false, null));
          resolve(json);
        }
      });
    });
  }
};
