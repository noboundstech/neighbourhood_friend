var express = require('express'),
	jwt 	= require('jsonwebtoken'),
	config  = require('config/config'),
    router  = express.Router();
//    _       = require('underscore');
require('rootpath')();
router.route('/')
.get(function (req, res) {
     res.status(404).send("We're sorry,but the page you're looking for can't be found" );
})
.post(function (req, res) {
     res.status(404).send("We're sorry,but the page you're looking for can't be found");
});


// api to send details of customer to send details of customer
router.route('/autoReply')
.get(function (req, res) {
 	
	var response_data 	= {};
	
	var login = require("facebook-chat-api");
	
	login({email: config.user_name, password: config.password}, function callback (err, api) {
		 api.listen(function callback(err, message) {
		 	console.log(err);
		 	console.log(message);
        	api.sendMessage("hello priyankar you said "+message.body, message.threadID);
    	});

	});
		
});


// api to send details of customer to send details of customer
router.route('/sendMessage')
.post(function (req, res) {
 	
	var async 			= require('async');
	var response_data 	= {};
	
	var login = require("facebook-chat-api");
	// Create simple echo bot
	login({email: config.user_name, password: config.password}, function callback (err, api) {
		console.log(api);
		api.sendMessage(req.body.message, req.body.user_details.userID);
		if(err) return console.error(err);
		console.log("here");
		var fb_message = require("model/fb_message");

		var message_details = { 
									senderID 	: req.body.user_details.userID,
									body 		: req.body.message,
									threadID 	: req.body.user_details.userID,
									messageID 	: req.body.user_details.userID,
									isGroup		: 0 
								};
		var insert_document = new fb_message(
								{
									send_or_receive		: "send", // send or receive
									type 				: "message",
									message_details 	: message_details,
									message_to_by		: req.body.user_details.userID,
									attachments 		: [],
								});

		insert_document.save(function(err,result)           
  		{
  			console.log(err);
  			console.log(result);
			res.send("message send");
  		}); 
		
	});
		
});
router.route('/getFriendList')
.get(function (req, res) {
 	
 	console.log(config);
	var async 			= require('async');
	var response_data 	= {};
	
	var login = require("facebook-chat-api");
	// Create simple echo bot
	login({email: config.user_name, password: config.password}, function callback (err, api) {
		if(err) return console.error(err);
	//	response_data.api = api;
		// api.sendMessage('hello sukalyan da i am sending this message by default when ever i am starting my server', '100001555122576');
		api.getFriendsList(function(err, data) {
		if(err) return console.error(err);
		response_data.data = err;
			res.send(data);
		});
	});
		
});
router.route('/getAllFbMessage')
.post(function (req, res) {
 	
//	var async 			= require('async');
	var response_data 	= {};
	var fb_message = require("model/fb_message");
	fb_message.find({'message_to_by': req.body.userID}).sort('-created_on').limit(20).exec(function(err, posts){
		var _ = require("underscore");
		var send_data = _.sortBy(posts, 'created_on');
	    res.send(send_data);
	});
});
// api
module.exports = router;