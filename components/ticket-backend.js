/*

WHAT IS THIS?

This module contains functions and methods for using the various ticketing systems.

*/

'use strict';
var OAuth = require('oauth').OAuth,
    fs = require('fs'),
    util = require('util'),
    debug = require('debug')('botkit:ticket-backend');


module.exports = function(controller) {
  let backend = process.env.ticketBackend || 'jira';

  function ticketCreate(json_data, callback){

    if (backend == 'jira'){
      debug('ticket-backend:', backend);

      try{
        let privateKeyData = fs.readFileSync(process.env.jiraPrivateKeyFile, "utf8");
        let consumer = new OAuth(
          process.env.jiraBaseUrl + "/plugins/servlet/oauth/request-token",
          process.env.jiraBaseUrl + "/plugins/servlet/oauth/access-token",
          process.env.jiraConsumerKey,
          privateKeyData,
          "1.0",
          null,
          "RSA-SHA1");
      }
      catch(exception){
        console.error('Unable to create OAuth object: %s', exception);
      }

      getJiraFromDB('joauth')
      .then(joauth_data => {
        if (joauth_data.oauthAccessToken && joauth_data.oauthAccessTokenSecret){
          debug('Jira API Post data:', json_data);

          consumer.post(
            process.env.jiraBaseUrl + "/rest/api/2/issue",
            joauth_data.oauthAccessToken,
            joauth_data.oauthAccessTokenSecret,
            json_data,
            'application/json',
            function (error, data, response){
              if (error){
                console.error('botkit:ticket-backend - POST Error: %s', error.data);
                callback(error, error.data, response);
              }
              else {
                debug('POST Data:', data);
                debug('POST Response:', response.statusCode);

                if (response.statusCode == 201){
                  callback(null, data, response);
                } else {
                  console.error('botkit:ticket-backend: Ticket data received, but no ticket created: status code: %s', response.statusCode);
                  callback({"statusCode": response.statusCode, "data": data}, data, response);
                }
              }
            }
          );
        }
        else{
          console.error('botkit:ticket-backend - Storage: token/secret obtained from storage is invalid or NULL');
          callback('botkit:ticket-backend - Storage: token/secret obtained from storage is invalid or NULL', null, null);
        }
      })
      .catch(reason => {
        console.error('botkit:ticket-backend: ', reason);
        callback(reason, null, null);
      });
    }
    else if (backend == 'salesforce'){
      debug('ticket-backend:', backend);
    }
    else {
      debug('ticket-backend:', backend);
      console.warn('botkit:ticket-backend: Unable to determine the ticket backend. Falling back to email backend.');
    }

  }

  // Get id from the mongo database jira collection
  function getJiraFromDB(id){
    return new Promise(function(resolve, reject) {
      controller.storage.jira.get(id, function(error, response){
        if (error){
          console.error('botkit:ticket_conversations:createTicketDialog - Storage: Unable to read ' + id + ' data from storage: %s', error);
          reject('Storage: Unable to read ' + id + ' data from storage: ' + error);
        }
        else{
          debug('bot.storage.jira.get.' + id + ':', util.inspect(response, false, null));
          resolve(response);
        }
      });
    });
  }

  controller.ticketCreate = ticketCreate;
}
