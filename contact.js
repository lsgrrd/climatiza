/*** Utilities ***/
var path = require("path");
var fs = require('fs');
var async = require("async");
var _ = require("underscore");
var dbConfig = require("./dbConfig.js");
var db = dbConfig.db;
var ObjectID = dbConfig.ObjectID;
var nodemailer = require("nodemailer");


var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    user: "cnava.svam@gmail.com",
    pass: "dmenucr8!Q"
  }
});




var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    user: "cnava.svam@gmail.com",
    pass: "dmenucr8!Q"
  }
});



exports.sendMsg = function(req, res) {


  var msg = req.body.msg;

  if(!msg){
    res.send(500,"Missing parameters");
  }else{
    //console.log(msg);




    var mailOptions = {
  from: msg.email, // sender address
  to: "lsgrrd@gmail.com", // list of receivers
  subject: msg.asunto || "Contacto", // Subject line

  html: "Mensaje de <b>"+ msg.nombre + " ("+msg.email+")</b><br/><br/>"+msg.body // html body
};

smtpTransport.sendMail(mailOptions, function(error, response) {
  if (error) {
    console.log(error);
  } else {

    //console.log("Message sent: " + response.message);
  }

              // if you don't want to use this transport object anymore, uncomment following line
              smtpTransport.close(); // shut down the connection pool, no more messages
            });



res.send("EMAIL SENT");
}

};

