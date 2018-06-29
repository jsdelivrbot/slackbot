const SlackBot = require('slackbots'),
  axios = require('axios')

const bot = new SlackBot({
  token: 'xoxb-390227820583-389404942256-OQUJiVYWFrlN56RpzsOOHJ0N',
  name: 'codette'
})

function postText(text) {
  bot.postMessageToChannel('general', text)
}

function parseRequest(msg) {
  if (msg.includes(' jokes')) {
    randomJoke()
  } else if (msg.includes(' help')) {
    helpDemo()
  }
}

function jokeAPI(url, name) {
  let joke
  axios.get(url)
    .then(res => {
      switch (name) {
        case 'yoMama':
          joke = res.data.joke
          break;
        case 'chuckNorris':
          joke = res.data.value.joke
          break;
      }
      postText(`Check it: ${joke}`)
    })
}

function randomJoke() {
  let rand = Math.floor(Math.random() * 2 + 1)
  let name, url
  if (rand === 1) {
    name = 'yoMama'
    url = 'http://api.yomomma.info'
  } else if (rand === 2) {
    name = 'chuckNorris'
    url = 'http://api.icndb.com/jokes/random'
  }
  jokeAPI(url, name)
}

function helpDemo() {
  let helpText = "Type 'jokes' for a random joke."
  postText(helpText)
}

// Start handler
bot.on('start', () => {
  postText('#blessed')
})

// Message handling
bot.on('message', (data) => {
  if (data.type !== 'message') {
    return
  }
  parseRequest(data.text)
})

// Error handling
bot.on('error', (err) => console.log(err))