const jokes = require('./jokes'),
salesforce = require('./salesforce'),
  app = require('../app')

function postText(text) {
  app.bot.postMessageToChannel('general', text)
}

function parseRequest(msg) {
  if (msg.includes(' jokes')) {
    jokes.randomJoke()
  } else if (msg.includes(' help')) {
    helpDemo()
  } else if (msg.includes(' search')){
    salesforce.search(msg)
  }
}

function helpDemo() {
  let helpText = "Type 'jokes' for a random joke."
  postText(helpText)
}

module.exports.postText = postText
module.exports.parseRequest = parseRequest