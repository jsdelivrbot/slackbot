const axios = require('axios'),
  actions = require('./chat')

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
      actions.postText(`Check it: ${joke}`)
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

module.exports.randomJoke = randomJoke