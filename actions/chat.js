const jokes = require('./jokes'),
  app = require('../app')

function postText(text) {
  app.bot.postMessageToChannel('general', text)
}

function parseRequest(msg) {
  if (msg.includes(' jokes')) {
    jokes.randomJoke()
  } else if (msg.includes(' help')) {
    helpDemo()
  }
}

function helpDemo() {
  let helpText = "Type 'jokes' for a random joke."
  postText(helpText)
}

module.exports.postText = postText
module.exports.parseRequest = parseRequest