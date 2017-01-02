'use strict';
var express     = require("express"), // the framework which we are using for nodejs
    path        = require('path'), //The path module provides utilities for working with file and directory paths
    app         = express(),
    compression = require('compression'), //The middleware will attempt to compress response bodies for all request that traverse through the middleware
    helmet      = require('helmet'), // Helmet helps you secure your Express apps by setting various HTTP headers. 
    config      = require('./config/config'), //where we will keep all the configuration file
    morgan      = require('morgan'),  //HTTP request logger middleware for node.js
    bodyParser  = require('body-parser'),
    router      = express.Router(); //Parse incoming request bodies in a middleware before your handlers, availabe under the req.body property
// my middleware start here
app.set('superSecret', config.secret); // secret variable
app.use(bodyParser.urlencoded({ extended: true,limit: '200mb' })); 



//app.use(bodyParser.json({limit: '5mb'})); // parse application/vnd.api+json as json 
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
/*The X-XSS-Protection HTTP header is a basic protection against XSS. 
    It was originally by Microsoft but Chrome has since adopted it as well. 
    Helmet lets you use it easily:
*/
app.use(helmet.xssFilter());
// Don't allow me to be in ANY frames: 
app.use(helmet.frameguard({ action: 'deny' }))
 
// Only let me be framed by people of the same origin: 
app.use(helmet.frameguard({ action: 'sameorigin' }))
app.use(helmet.frameguard())  // defaults to sameorigin 
 
app.use(helmet.hsts({
  maxAge: 10886400000,     // Must be at least 18 weeks to be approved by Google 
  includeSubdomains: true, // Must be enabled to be approved by Google 
  preload: true
}))

// ALWAYS set the header 
app.use(helmet.hsts({
  maxAge: 1234000,
  force: true
}))
app.use(function (req, res, next) {
   // add details of what is allowed in HTTP request headers to the response headers
   // res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', '*');
   // res.header('Access-Control-Allow-Credentials', false);
    res.header('Access-Control-Max-Age', '586400');
    res.header('Access-Control-Allow-Headers', '*');
    // the next() function continues execution and will move onto the requested URL/URI
    next();
});
// adding middleware for nodejs crawl
//app.use(require('prerender-node').set('prerenderToken', 'RQ5GW4Vh2N7prQ1f3FIc'));
// to load angularjs
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'Neighborhood_friend')));
// to open pdf of the agreement
//app.use('/pdf', express.static(__dirname + '/pdf'));

var server = app.listen(3000, function () {
  console.log("Express server is started. (port: 3000)");
    var response_data   = {};
    var login = require("facebook-chat-api");
    login({email: config.user_name, password: config.password}, function callback (err, api) {
      console.log("login");
       api.listen(function callback(err, message) {
        console.log(err);
        console.log(message);
        });
    });
});
require('./routes/routes.js')(app);
/*
app.get('/*', function(req, res) {
res.sendFile(path.join(__dirname + '/public/index.html'));
});
*/

module.exports = app;