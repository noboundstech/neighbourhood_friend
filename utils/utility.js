module.exports =
{
	'createAuthentication': function(req,res,data,next)          
	{
		var jwt 	= require('jsonwebtoken'),
			config 	= require('config/config');
			// check header or url parameters or post parameters for token
		// decode token
		var token = jwt.sign(data, config.secret);
		next(token);
	
	},
	'checkAuthentication': function(req,res,next)          
	{
		var jwt 	= require('jsonwebtoken'),
			express = require('express'),
			config 	= require('config/config');
			// check header or url parameters or post parameters for token
		var token = req.body.token || req.param('token') || req.headers['x-access-token'] || req.query.token;
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token,config.secret, function(err, decoded) {			
				if (err) {
					var response_data = {};
					return res.status(203).send({ 
						success: false,
						response_data : {
											message: 'Please provide valid token.'
										}
					});
				//	return res.json({ success: false, message: 'Failed to authenticate token.',err :err });		
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;	
					next();
				}
			});
		} else {
			// if there is no token
			// return an error
			return res.status(203).send({ 
				success: false, 
				message: 'No token provided.'
			});
		}
	}
}    