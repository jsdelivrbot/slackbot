var util = require('util');
var debug = require('debug')('botkit:dialog-submissions');

module.exports = function(controller) {
  controller.on('dialog_submission', function(bot, message){
    debug('Dialog submission triggered: ', util.inspect(message), false, null);
    if (JSON.parse(message.callback_id)){
      message.callback_id = JSON.parse(message.callback_id);
      debug(message.callback_id.name);
    }

    switch (message.callback_id.name){
      case 'createTicketDialog':
        controller.trigger('submitTicket', [bot, message]);
        break;
    }
  });
}
