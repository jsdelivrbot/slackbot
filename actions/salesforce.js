const SF_CLIENT_ID =
    '3MVG9AJuBE3rTYDg8cnWQK_PLHQW91c6wWl95D6Pn.3OuqzJ1GtdEkifzyrVjadN50rcBkA2O2BiUIIFwU7Sz', //process.env.SF_CLIENT_ID,
  SF_CLIENT_SECRET = '3002508663153639280', //process.env.SF_CLIENT_SECRET,
  SF_USER_NAME = 'invitaeslack@taos.com.invitae', //process.env.SF_USER_NAME,
  SF_ACCESS_TOKEN = 'XR82pq6thJJSdlMbE2D76qa79',
  SF_PASSWORD = 'ypkHJrXX2nG*s9!' + SF_ACCESS_TOKEN, //process.env.SF_PASSWORD
  SF_REDIRECT_URI = 'http://localhost:3000/oauth/_callback',
  SF_URL = 'https://test.salesforce.com/services/oauth2/token',
  POST_BODY =
    'grant_type=password&client_id=3MVG9AJuBE3rTYDg8cnWQK_PLHQW91c6wWl95D6Pn.3OuqzJ1GtdEkifzyrVjadN50rcBkA2O2BiUIIFwU7Sz&client_secret=3002508663153639280&username=invitaeslack@taos.com.invitae&password=ypkHJrX$*X2nG$_Q7RJRH*s9!XR82pq6thJJSdlMbE2D76qa79',
  POST_TYPE = 'application/x-www-form-urlencoded';

// // botkit format for user auth
// let nforce = require('nforce'),
//   org = nforce.createConnection({
//     clientId: SF_CLIENT_ID,
//     clientSecret: SF_CLIENT_SECRET,
//     redirectUri: SF_REDIRECT_URI,
//     mode: 'single',
//     autoRefresh: true
//   });

// let login = () => {
//   org.authenticate({ username: SF_USER_NAME, password: SF_PASSWORD }, err => {
//     if (err) {
//       console.error('Authentication error');
//       console.error(err);
//     } else {
//       console.log('Authentication successful');
//     }
//   });
// };
function auth() {
  var request = require('request'),
  qs = require('querystring'), 
  oauth =
  { callback: SF_REDIRECT_URI  , consumer_key: SF_CLIENT_ID  , consumer_secret: SF_CLIENT_SECRET  }, 
  url = SF_URL
;
request.post({url:url, oauth:oauth}, function (e, r, body) {
// Ideally, you would take the body in the response
// and construct a URL that a user clicks on (like a sign in button).
// The verifier is only available in the response after a user has
// verified with twitter that they are authorizing your app.

// step 2
var req_data = qs.parse(body)
var uri = 'https://api.twitter.com/oauth/authenticate'
  + '?' + qs.stringify({oauth_token: req_data.oauth_token})
// redirect the user to the authorize uri

// step 3
// after the user is redirected back to your server
var auth_data = qs.parse(body)
  , oauth =
    { consumer_key: CONSUMER_KEY
    , consumer_secret: CONSUMER_SECRET
    , token: auth_data.oauth_token
    , token_secret: req_data.oauth_token_secret
    , verifier: auth_data.oauth_verifier
    }
  , url = 'https://api.twitter.com/oauth/access_token'
  ;
request.post({url:url, oauth:oauth}, function (e, r, body) {
  // ready to make signed requests on behalf of the user
  var perm_data = qs.parse(body)
    , oauth =
      { consumer_key: CONSUMER_KEY
      , consumer_secret: CONSUMER_SECRET
      , token: perm_data.oauth_token
      , token_secret: perm_data.oauth_token_secret
      }
    , url = 'https://api.twitter.com/1.1/users/show.json'
    , qs =
      { screen_name: perm_data.screen_name
      , user_id: perm_data.user_id
      }
    ;
  request.get({url:url, oauth:oauth, qs:qs, json:true}, function (e, r, user) {
    console.log(user)
  })
})
})
module.exports.auth = auth
