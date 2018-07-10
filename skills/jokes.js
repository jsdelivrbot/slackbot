module.exports = function(controller) {
  controller.config.help.push({
    name: "Status",
    help: {
      ping: "Test if OpsBot is listening. Should receive a *Pong!* response.",
      marco: "Test if OpsBot is listening. Should receive a *Polo!* response.",
      uptime: "Check OpsBot uptime and stats."
    }
  });
  const axios = require("axios");

  function jokeAPI(url, name) {
    let joke;
    axios.get(url).then(res => {
      switch (name) {
        case "yoMama":
          joke = res.data.joke;
          break;
        case "chuckNorris":
          joke = res.data.value.joke;
          break;
      }
      actions.postText(`Check it: ${joke}`);
    });
  }

  function randomJoke() {
    let rand = Math.floor(Math.random() * 2 + 1);
    let name, url;
    if (rand === 1) {
      name = "yoMama";
      url = "http://api.yomomma.info";
    } else if (rand === 2) {
      name = "chuckNorris";
      url = "http://api.icndb.com/jokes/random";
    }
    jokeAPI(url, name);
  }

  module.exports.randomJoke = randomJoke;
};
