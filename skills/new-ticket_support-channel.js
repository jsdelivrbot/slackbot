const fs = require("fs"),
  debug = require("debug")("botkit:new-ticket_support-channel");

// function postText(text) {
//   app.bot.postMessageToChannel("general", text);
// }
module.exports = function(controller) {
  controller.config.help.push({
    name: "New Ticket",
    help: {
      "new ticket":
        "Opens the ticket creation dialog. Other text variations can be used as well. Example: make ticket, open a ticket, etc...",
      nt: "Opens the ticket creation dialog. This is the shorthand command."
    }
  });
  
  const hearingAid = ['((fix|make|create|open|new) )((a|an|all) )?((the|new) )?(things|ticket|incident|inc|problem|issue)', '^nt$']

  controller.hears(
    hearingAid,
    "direct_message,direct_mention,mention",
    (bot, message) => {
      debug('slackbot heard "new ticket":', message);

      getClientData()
        .then(clientData => {
          let projects = clientData;
          let payload = {
            ephemeral: "true",
            attachments: [
              {
                title: "Would you like to create a ticket?",
                callback_id: "createTicketPrompt",
                attachment_type: "default",
                actions: []
              }
            ]
          };

          for (let project in projects) {
            payload.attachments[0].actions.push(
              generateReplyActions(projects[project])
            );
          }
          payload.attachments[0].actions.push({
            name: "no",
            text: "No",
            value: "no",
            type: "button"
          });

          bot.startConversation(message, function(error, convo) {
            if (error) {
              console.error("botkit:new-ticket_dm-mention:convo: %s", error);
              convo.stop();
            } else {
              debug("startConversation: ", payload);
              debug("actions: ", payload.attachments[0].actions);

              convo.say(payload);
              convo.next();
            }
          });
        })
        .catch(reason => {
          console.error("botkit:new-ticket_support-channel:hears: ", reason);
        });

      function generateReplyActions(data) {
        // name: project key, text: project friendly name, value: project id
        // These aren't going to be a 1:1 mapping from the db (value != value in the db).
        // the name, text, value, and type fields are defined by slack and the database date is for jira.
        // That's the reason for the confusing key/values.
        let json = {
          name: data.key,
          text: data.name,
          value: data.id,
          type: "button"
        };
        return json;
      }
    }
  );

  // ========================
  // Custom event listeners
  // ========================

  controller.on("submitTicket", function(bot, message) {
    debug(
      "submitTicket event fired with data: message:",
      util.inspect(message, false, null)
    );

    if (process.env.ticketBackend == "salesforce") {
      let payload = {
        fields: {
          project: {
            key: message.callback_id.value.key
          }
        }
      };

      Promise.all([getSlackUserInfo(bot, message), getClientData()])
        .then(arrPromValue => {
          try {
            // arrPromValue is an array of the return data from each promise.
            var slackUserInfo = arrPromValue[0];
            let clientData = arrPromValue[1];

            let currentProject = clientData[message.callback_id.value.key];
            let ticketFields = currentProject.ticketfields;
            let regex = new RegExp("^description$");

            for (let field in ticketFields) {
              if (IsJsonString(message.submission[ticketFields[field].value])) {
                payload.fields[ticketFields[field].value] = JSON.parse(
                  message.submission[ticketFields[field].value]
                );
              } else {
                payload.fields[ticketFields[field].value] = "";
                if (ticketFields[field].value.match(regex)) {
                  payload.fields[
                    ticketFields[field].value
                  ] = `--- submitted by --- \nDisplay Name: ${
                    slackUserInfo.profile.display_name
                  }\nReal Name: ${slackUserInfo.profile.real_name}\nEmail: ${
                    slackUserInfo.profile.email
                  }\n--------------------\n\n`;
                }
                payload.fields[ticketFields[field].value] +=
                  message.submission[ticketFields[field].value];
              }
            }
          } catch (error) {
            console.error(
              "botkit:new-ticket_dm-mention:submitTicket: %s",
              error
            );
            bot.dialogError(error);
          }

          controller.ticketCreate(payload, function(error, data, response) {
            if (error) {
              console.error(
                "botkit:new-ticket_dm-mention:ticketCreate: Error submitting ticket %s",
                error.data
              );
              bot.dialogError(error.data);
            } else {
              bot.reply(
                message,
                "<@" +
                  slackUserInfo.id +
                  ">, your ticket has been submitted: <" +
                  process.env.jiraBaseUrl +
                  "/browse/" +
                  JSON.parse(data).key +
                  "|" +
                  JSON.parse(data).key +
                  ">"
              );
              bot.dialogOk();
            }
          });
        })
        .catch(reason => {
          console.error("botkit:new-ticket_dm-mention:submitTicket: ", reason);
          bot.dialogError(reason);
        });
    } else if (process.env.ticketBackend == "salesforce") {
    } else {
      console.error("ticketBackend not defined in environment file.");
    }
  });

  controller.on("createTicketDialog", function(bot, message) {
    debug(
      "createTicketDialog event fired with data: message.actions:",
      message.actions[0]
    );

    if (!message.actions[0].value.match(/^no$/)) {
      var dialog = bot.createDialog(
        "Create a new ticket",
        '{"name": "createTicketDialog", "value": {"key": "' +
          message.actions[0].name +
          '", "id": "' +
          message.actions[0].value +
          '"}}',
        "Submit"
      );

      function replyCallback(error, response) {
        if (error) {
          console.error("Unable to create slack dialog: %s", error);
          bot.replyInteractive(message, {
            text: "There was an error creating the dialog."
          });
        } else {
          debug("Dialog created successfully");

          bot.replyInteractive(message, {
            text: "Please fill out the ticket dialog to proceed."
          });
        }
      }

      if (process.env.ticketBackend == "salesforce") {
        getClientData()
          .then(clientData => {
            dialog = createSalesforceDialog(message, dialog, clientData);
            bot.replyWithDialog(message, dialog.asObject(), replyCallback);
          })
          .catch(reason => {
            console.error(
              "botkit:new-ticket_dm-mention:createTicketDialog: ",
              reason
            );
          });
      } else if (process.env.ticketBackend == "jira") {
      } else {
        console.error("ticketBackend not defined in environment file.");
      }
    } else {
      bot.replyInteractive(message, { text: "Ticket dialog canceled..." });
    }
  });

  controller.on('interactive_message_callback', function(bot, message){
    debug('Interactive message callback triggered');

    switch(message.callback_id){
      case 'createTicketPrompt':
        controller.trigger('createTicketDialog', [bot, message]);
        break;
    }
  });

  function getLabels(field) {
    let fields = [];
    if (field.type == "select") {
      fields = [];
      let fieldsObj = field.fields;
      for (let field in fieldsObj) {
        if (process.env.ticketBackend == "salesforce") {
          fields.push({
            label: fieldsObj[field].name,
            value: '{"id": "' + fieldsObj[field].id + '"}'
          });
        } else {
          fields.push({
            label: fieldsObj[field].name,
            value: fieldsObj[field].id
          });
        }
      }
    }
    return fields;
  }

  function IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  // Get the slackbot user information
  function getSlackUserInfo(bot, message) {
    return new Promise(function(resolve, reject) {
      bot.api.users.info({ user: message.user }, function(error, response) {
        if (error) {
          reject(
            "Slack API: Unable to obtain user info from slack api: " + error
          );
        } else {
          debug(
            "bot.api.users.info:",
            util.inspect(response.user, false, null)
          );
          resolve(response.user);
        }
      });
    });
  }

  // Get client data from clientMap.json
  function getClientData() {
    return new Promise(function(resolve, reject) {
      let json = {};
      fs.readFile(process.env.clientData || "clientData.json", "utf8", function(
        error,
        data
      ) {
        if (error) {
          reject("Unable to read file: " + error);
        } else {
          try {
            json = JSON.parse(data);
          } catch (e) {
            console.error(
              "botkit:new-ticket_dm-mention: Unable to parse JSON from file: %s",
              e
            );
          }
          // debug("fs.fileRead:", util.inspect(json, false, null));
          resolve(json);
        }
      });
    });
  }

  function createSalesforceDialog(message, dialog, clientData) {
    let currentProject = clientData[message.actions[0].name];
    let ticketFields = currentProject.ticketfields;
    for (let field in ticketFields) {
      switch (ticketFields[field].type) {
        case "select":
          dialog.addSelect(
            ticketFields[field].name,
            ticketFields[field].value,
            '{"id": "' + ticketFields[field].default + '"}',
            getLabels(ticketFields[field]),
            { placeholder: ticketFields[field].placeholder }
          );
          break;
        case "text":
          dialog.addText(
            ticketFields[field].name,
            ticketFields[field].value,
            ticketFields[field].default
          );
          break;
        case "textarea":
          dialog.addTextarea(
            ticketFields[field].name,
            ticketFields[field].value,
            ticketFields[field].default,
            {
              placeholder: ticketFields[field].placeholder,
              optional: ticketFields[field].optional
            }
          );
          break;
        case "email":
          dialog.addEmail(
            ticketFields[field].name,
            ticketFields[field].value,
            ticketFields[field].default,
            {
              placeholder: ticketFields[field].placeholder,
              optional: ticketFields[field].optional
            }
          );
      }
    }
    return dialog;
  }
};
