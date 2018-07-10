/*

WHAT IS THIS?

This module handles sending emails to email based ticketing systems.

*/

'use strict';
var debug = require('debug')('botkit:email-backend');
var nodemailer = require('nodemailer');

module.exports = function(controller) {

    // Define default smtp options
    var smtpOptions = {
        host: "localhost",
        port: 25,
        secure: false
    };

    // Pull in custom SMTP options from environment vars
    if (process.env.SMTPPPORT || process.env.SMTPPPASSWD || process.env.SMTPUSER){
        var smtpOptions = {
            host: process.env.SMTPHOST,
            secure: true,
            port: process.env.SMTPPPORT,
            auth: {
                user: process.env.SMTPUSER,
                pass: process.env.SMTPPASSWD
            }
        };
    }
    
    // Define default mail options
    let defaultMailOptions = {
        from: '"OpsBot" <opsbot@taos.com>', // sender address
        to: 'opsbot@taos.com', // list of receivers
        subject: '[opsbot] New ticket created', // Subject line
        text: '[opsbot] New ticket created', // plain text body
    };
    
    // Try to create the mail transporter with the options above.
    try{
        var transporter = nodemailer.createTransport(smtpOptions,defaultMailOptions);
    } catch(err){
        console.log('Error: unable to configure SMTP Transporter: %s', err);
    }
    
    // Function to handle sending of email using the defined options
    function SendEmail(options){
    
        try{
            transporter.sendMail(options, (error, info) => {
                if (error) {
                    console.log('Error: unable to send message: %s', error);
                }
                console.log('Info: Message envelope: %s', JSON.stringify(info.envelope));
                console.log('Info: SMTP response: %s', info.response);
            });

            // Close the transporter once message is sent.
            transporter.close();
        } catch(err){
            console.log('Error: unable to send mail: %s', err);
        }
    }
    
    // Register the sendEmail function as part of controller
    controller.sendEmail = SendEmail;
};
