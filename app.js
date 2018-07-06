"use strict";
require("dotenv").config();

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN,
  // Botkit constructor
  Botkit = require("botkit"),
  formatter = require("./actions/slack-formatter"),
  salesforce = require("./actions/salesforce"),
  controller = Botkit.slackbot(),
  bot = controller.spawn({
    token: SLACK_BOT_TOKEN
  });

bot.startRTM(err => {
  err => {
    throw new Error("Could not connect to Slack");
    console.log(err)
  };
  if (!err) {
    console.log("Connected to Slack.");
  }
});

controller.hears(
  ["(.*)"],
  "direct_message,direct_mention,mention",
  (bot, message) => {
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
        salesforce
          .createCase({ subject: subject, description: description, user:message.user })
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
