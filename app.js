'use strict';

let http = require('http'),
  actions = require('./actions/chat'),
  salesforce = require('./actions/salesforce'),
  SlackBot = require('slackbots');

const SLACK_BOT_TOKEN =
  'xoxb-390227820583-389404942256-OQUJiVYWFrlN56RpzsOOHJ0N'; //process.env.SLACK_BOT_TOKEN;

// // botkit version
// let Botkit = require('botkit'),
//   formatter = require('./actions/slack-formatter'),
//   salesforce = require('./actions/salesforce'),
//   controller = Botkit.slackbot(),
//   bot = controller.spawn({
//     token: SLACK_BOT_TOKEN
//   });

// bot.startRTM(err => {
//   if (err) {
//     throw new Error('Could not connect to Slack');
//   }
// });

// controller.hears(
//   ['help'],
//   'direct_message,direct_mention,mention',
//   (bot, message) => {
//     bot.reply(message, {
//       text: `You can ask me things like:
//     "Search account Acme" or "Search Acme in acccounts"
//     "Search contact Lisa Smith" or "Search Lisa Smith in contacts"
//     "Search opportunity Big Deal"
//     "Create contact"
//     "Create case"`
//     });
//   }
// );

const bot = new SlackBot({
  token: SLACK_BOT_TOKEN,
  name: 'codette'
});

// Start handler
bot.on('start', () => {
  actions.postText('#blessed');
  salesforce.auth();
});

// Message handling
bot.on('message', data => {
  if (data.type !== 'message') {
    return;
  }
  actions.parseRequest(data.text);
});

// Error handling
bot.on('error', err => console.log(err));

module.exports.bot = bot;
