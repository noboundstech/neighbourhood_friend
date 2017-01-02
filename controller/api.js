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
	console.log(req.body.message);
	console.log(req.body.user_details.userID);

	// Create simple echo bot
	login({email: config.user_name, password: config.password}, function callback (err, api) {
		console.log(api);
		api.sendMessage(req.body.message, req.body.user_details.userID);
		if(err) return console.error(err);
		res.send("message send");
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
// api
module.exports = router;