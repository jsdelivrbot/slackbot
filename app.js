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


// curl --form client_id=3MVG9AJuBE3rTYDg8cnWQK_PLHQW91c6wWl95D6Pn.3OuqzJ1GtdEkifzyrVjadN50rcBkA2O2BiUIIFwU7Sz --form client_secret=3002508663153639280 --form grant_type=password --form username=invitaeslack@taos.com.invitae --form password=ypkHJrXX2nG*s9!XR82pq6thJJSdlMbE2D76qa79 https://test.salesforce.com/services/oauth2/token

/* curl -v https://test.salesforce.com/services/oauth2/token \
   -d "grant_type=password" \
   -d "client_id=3MVG9AJuBE3rTYDg8cnWQK_PLHQW91c6wWl95D6Pn.3OuqzJ1GtdEkifzyrVjadN50rcBkA2O2BiUIIFwU7Sz" \
   -d "client_secret=3002508663153639280" \
   -d "username=invitaeslack@taos.com.invitae" -d "password=ypkHJrXX2nG*s9!"
*/