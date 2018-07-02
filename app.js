const SlackBot = require('slackbots'),
  actions = require('./actions/chat')

const bot = new SlackBot({
  token: 'xoxb-390227820583-389404942256-OQUJiVYWFrlN56RpzsOOHJ0N',
  name: 'codette'
})

// Start handler
bot.on('start', () => {
  actions.postText('#blessed')
})

// Message handling
bot.on('message', (data) => {
  if (data.type !== 'message') {
    return
  }
  actions.parseRequest(data.text)
})

// Error handling
bot.on('error', (err) => console.log(err))

module.exports.bot = bot