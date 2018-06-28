const Botkit = require('botkit')

var controller = Botkit.slackbot({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ['bot'],
});

var bot = controller.spawn({
  incoming_webhook: {
    url: 'https://hooks.slack.com/services/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'
  }
})

bot.sendWebhook({
  text: 'This is an incoming webhook',
  channel: '#general',
}, function (err, res) {
  if (err) {
    // ...
  }
});