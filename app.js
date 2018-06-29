const SlackBot = require('slackbots'),
  axios = require('axios')

const bot = new SlackBot({
  token: 'xoxb-390227820583-389404942256-OQUJiVYWFrlN56RpzsOOHJ0N',
  name: 'codette'
})

// Start handler
bot.on('start', () => {
  const params = require('./params.json')
  bot.postMessageToChannel('general', 'BOOM!', params)
})

// Message handling
bot.on('message', (data) => {
  console.log(data)
  if (data.type !== 'message') {
    return
  }
  handleMessage(data.text)
})

// Error handling
bot.on('error', (err) => console.log(err))

// 
// Methods
// 

function handleMessage(msg) {
  if (msg.includes(' jokes')) {
    randomJoke()
  } else if (msg.includes(' help')) {
    helpDemo()
  }
}

function yoMamaAPI() {
  axios.get('http://api.yomomma.info')
    .then(res => {
      let joke = res.data.joke
      bot.postMessageToChannel('general', `Hey! ${joke}`)
    })
}

function chuckNorrisAPI() {
  axios.get('http://api.icndb.com/jokes/random')
    .then(res => {
      let joke = res.data.value.joke
      bot.postMessageToChannel('general', `Hey! ${joke}`)
    })
}

function randomJoke() {
  let rand = Math.floor(Math.random() * 2 + 1)
  if (rand === 1) {
    yoMamaAPI()
  } else if (rand === 2) {
    chuckNorrisAPI()
  }
}

function helpDemo() {
  let params = {
    icon_emoji: ':question:'
  }
  bot.postMessageToChannel('general', "Type 'jokes' for a random joke, bruh!", params)
}




/* External Webhook; sends message to 'General'
// curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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
*/