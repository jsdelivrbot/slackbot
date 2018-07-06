"use strict";
require("dotenv").config();

const skills = require("./skills/chat"),
  SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN,
  // Botkit constructor
  Botkit = require("botkit"),
  controller = Botkit.slackbot(),
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