"use strict";
var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false }),
  env = require("node-env-file");
env(__dirname + "/envfiles/envVars");

const Botkit = require("botkit"),
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

// Load all skills
const normalizedPath = require("path").join(__dirname, "skills");

require("fs")
  .readdirSync(normalizedPath)
  .forEach(function(file) {
    require(`${normalizedPath}/${file}`)(controller);
  });
