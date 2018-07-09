"use strict";

var env = require('node-env-file');
env(__dirname + '/envfiles/envVars');

const listener = require("./skills/new-ticket_support-channel"),
  Botkit = require("botkit"),
  SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    help: [],
    //debug: true,
    scopes: ["bot"]
  },
  controller = Botkit.slackbot(bot_options),
  bot = controller.spawn({ token: SLACK_BOT_TOKEN });

bot.startRTM(err => {
  err => {
    throw new Error("Could not connect to Slack");
    console.log(err);
  };
  if (!err) {
    console.log("Connected to Slack.");
  }
});

listener(controller);
