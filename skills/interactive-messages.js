var debug = require('debug')('botkit:interactive-messages');

module.exports = function(controller) {
  controller.on('interactive_message_callback', function(bot, message){
    debug('Interactive message callback triggered');

    switch(message.callback_id){
      case 'createTicketPrompt':
        controller.trigger('createTicketDialog', [bot, message]);
        break;
    }
  });
}