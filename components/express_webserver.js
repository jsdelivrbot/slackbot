var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var querystring = require("querystring");
var debug = require("debug")("botkit:webserver");
var http = require("http");
var hbs = require("express-hbs"),
  buttonTest = require("./routes/buttonTest");

module.exports = function(controller) {
  var webserver = express();
  webserver.use(bodyParser.json());
  webserver.use(bodyParser.urlencoded({ extended: true }));
  
  webserver.use(
    session({
      secret: "taos-opsbot",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000, secure: false }
    })
  );

  webserver.use(express.static("public"));
  webserver.use("/slack/slash-commands/send-me-buttons", buttonTest);

  // // set up handlebars ready for tabs
  // webserver.engine(
  //   "hbs",
  //   hbs.express4({ partialsDir: __dirname + "/../views/partials" })
  // );
  // webserver.set("view engine", "hbs");
  // webserver.set("views", __dirname + "/../views/");


  // var server = http.createServer(webserver);

  webserver.listen(process.env.PORT || 3000, null, function() {
    console.log(
      "Express webserver configured and listening at " +
        process.env.appUrl +
        ":" +
        process.env.PORT || 3000
    );
  });

  // import all the pre-defined routes that are present in /components/routes
  var normalizedPath = require("path").join(__dirname, "routes");
  require("fs")
    .readdirSync(normalizedPath)
    .forEach(function(file) {
      // if (fs.statSync(`${normalizedPath}/${file}`).isFile()) {
      require(`${normalizedPath}/${file}`)(webserver, controller);
      // }
    });

  controller.webserver = webserver;
  controller.httpserver = server;

  return webserver;
};
