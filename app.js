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
require('./config/database_connection.js')(app);

app.post('/sendMessageToFacebook', function (req, res) {
  var async           = require('async');
  var fb_message      = require("model/fb_message");
  var response_data   = {};
  var message_details = { 
                          senderID  : req.body.user_details.userID,
                          body      : req.body.message,
                          threadID  : req.body.user_details.userID,
                          messageID : req.body.user_details.userID,
                          isGroup   : 0 
                        };
  var insert_document = new fb_message({
                                          send_or_receive   : "send", // send or receive
                                          type              : "message",
                                          message_details   : message_details,
                                          message_to_by     : req.body.user_details.userID,
                                          attachments       : [],
                                        });
  socket_details.emit("new_message",insert_document);
  var login = require("facebook-chat-api");
  // Create simple echo bot
    login({email: config.user_name, password: config.password}, function callback (err, api) {
      api.sendMessage(req.body.message, req.body.user_details.userID);
      if(err) return console.error(err);
      insert_document.save(function(err,result)           
      {
        res.send("message send");
      }); 
  })
})
require('./routes/routes.js')(app);

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(3000, function () {
  console.log("Express server is started. (port: 3000)");
    var response_data   = {};
    var login = require("facebook-chat-api");
    login({email: config.user_name, password: config.password}, function callback (err, api) {
       api.listen(function callback(err, message) {
          if(message)
          {
            var message_type = message.type;
            var fb_message = require("model/fb_message");
            var attachment_details = [];
            if(typeof message.attachments != 'undefined')
            {
              if(message.attachments.length>0)
              {
                for(var i=0;i<message.attachments.length;i++)
                {
                  var message_type = message.attachments[i].type;
                  var name = '';
                  var hiresUrl = '';
                  var thumbnailUrl = '';
                  var previewUrl = '';
                  var previewWidth = 0;
                  var previewHeight = 0;
                  var ID = '';
                  var filename = '';
                  var mimeType = '';
                  var url = '';
                  var width = 0;
                  var height = 0;
                  var stickerID = '';
                  var packID = '';
                  var frameCount = 0;
                  var frameRate = '';
                  var framesPerRow = '';
                  var framesPerCol = '';
                  var spriteURI2x = '';
                  var spriteURI = '';
                  var caption = '';
                  var description = '';
                  var image = '';
                  var playable = false;
                  var duration = 0;
                  var source = '';
                  var title = '';
                  var facebookUrl = '';
                  var rawGifImage ='';
                  var rawWebpImage ='';
                  var animatedGifUrl ='';
                  var animatedGifPreviewUrl ='';
                  var animatedWebpUrl ='';
                  var animatedWebpPreviewUrl ='';
                  var isMalicious ='';
                  if(typeof message.attachments[i].name != 'undefined')
                  {
                    name = message.attachments[i].name;
                  }

                  if(typeof message.attachments[i].hiresUrl != 'undefined')
                  {
                    hiresUrl = message.attachments[i].hiresUrl;
                  }

                  if(typeof message.attachments[i].thumbnailUrl != 'undefined')
                  {
                    thumbnailUrl = message.attachments[i].thumbnailUrl;
                  }

                  if(typeof message.attachments[i].previewUrl != 'undefined')
                  {
                    previewUrl = message.attachments[i].previewUrl;
                  }

                  if(typeof message.attachments[i].previewWidth != 'undefined')
                  {
                    previewWidth = message.attachments[i].previewWidth;
                  }

                  if(typeof message.attachments[i].previewHeight != 'undefined')
                  {
                    previewHeight = message.attachments[i].previewHeight;
                  }

                  if(typeof message.attachments[i].ID != 'undefined')
                  {
                    ID = message.attachments[i].ID;
                  }

                  if(typeof message.attachments[i].filename != 'undefined')
                  {
                    filename = message.attachments[i].filename;
                  }

                  if(typeof message.attachments[i].mimeType != 'undefined')
                  {
                    mimeType = message.attachments[i].mimeType;
                  }

                  if(typeof message.attachments[i].url != 'undefined')
                  {
                    url = message.attachments[i].url;
                  }

                  if(typeof message.attachments[i].width != 'undefined')
                  {
                    width = message.attachments[i].width;
                  }

                  if(typeof message.attachments[i].height != 'undefined')
                  {
                    height = message.attachments[i].height;
                  }

                  if(typeof message.attachments[i].stickerID != 'undefined')
                  {
                    stickerID = message.attachments[i].stickerID;
                  }

                  if(typeof message.attachments[i].packID != 'undefined')
                  {
                    packID = message.attachments[i].packID;
                  }

                  if(typeof message.attachments[i].frameCount != 'undefined')
                  {
                    frameCount = message.attachments[i].frameCount;
                  }

                  if(typeof message.attachments[i].frameRate != 'undefined')
                  {
                    frameRate = message.attachments[i].frameRate;
                  }

                  if(typeof message.attachments[i].framesPerRow != 'undefined')
                  {
                    framesPerRow = message.attachments[i].framesPerRow;
                  }

                  if(typeof message.attachments[i].framesPerCol != 'undefined')
                  {
                    framesPerCol = message.attachments[i].framesPerCol;
                  }

                  if(typeof message.attachments[i].spriteURI2x != 'undefined')
                  {
                    spriteURI2x = message.attachments[i].spriteURI2x;
                  }

                  if(typeof message.attachments[i].spriteURI != 'undefined')
                  {
                    spriteURI = message.attachments[i].spriteURI;
                  }
                  
                  if(typeof message.attachments[i].caption != 'undefined')
                  {
                    caption = message.attachments[i].caption;
                  }

                  if(typeof message.attachments[i].description != 'undefined')
                  {
                    description = message.attachments[i].description;
                  }

                  if(typeof message.attachments[i].image != 'undefined')
                  {
                    image = message.attachments[i].image;
                  }

                  if(typeof message.attachments[i].playable != 'undefined')
                  {
                    playable = message.attachments[i].playable;
                  }

                  if(typeof message.attachments[i].duration != 'undefined')
                  {
                    duration = message.attachments[i].duration;
                  }

                  if(typeof message.attachments[i].source != 'undefined')
                  {
                    source = message.attachments[i].source;
                  }

                  if(typeof message.attachments[i].title != 'undefined')
                  {
                    title = message.attachments[i].title;
                  }
                  
                  if(typeof message.attachments[i].facebookUrl != 'undefined')
                  {
                    facebookUrl = message.attachments[i].facebookUrl;
                  }
                  if(typeof message.attachments[i].rawGifImage != 'undefined')
                  {
                    rawGifImage = message.attachments[i].rawGifImage;
                  }

                  if(typeof message.attachments[i].rawWebpImage != 'undefined')
                  {
                    rawWebpImage = message.attachments[i].rawWebpImage;
                  }

                  if(typeof message.attachments[i].animatedGifUrl != 'undefined')
                  {
                    animatedGifUrl = message.attachments[i].animatedGifUrl;
                  }

                  if(typeof message.attachments[i].animatedGifPreviewUrl != 'undefined')
                  {
                    animatedGifPreviewUrl = message.attachments[i].animatedGifPreviewUrl;
                  }

                  if(typeof message.attachments[i].animatedWebpUrl != 'undefined')
                  {
                    animatedWebpUrl = message.attachments[i].animatedWebpUrl;
                  }
                  
                  if(typeof message.attachments[i].animatedWebpPreviewUrl != 'undefined')
                  {
                    animatedWebpPreviewUrl = message.attachments[i].animatedWebpPreviewUrl;
                  }
                  if(typeof message.attachments[i].isMalicious != 'undefined')
                  {
                    isMalicious = message.attachments[i].isMalicious;
                  }

                  var attachment = {   
                                      type          : message.attachments[i].type,
                                      name          : name,
                                      hiresUrl      : hiresUrl,
                                      thumbnailUrl  : thumbnailUrl,
                                      previewUrl    : previewUrl,
                                      previewWidth  : previewWidth,
                                      previewHeight : previewHeight,
                                      ID            : ID,
                                      filename      : filename,
                                      mimeType      : mimeType,
                                      url           : url,
                                      width         : width,
                                      height        : height,
                                      stickerID     : stickerID,
                                      packID        : packID,
                                      frameCount    : frameCount,
                                      frameRate     : frameRate,
                                      framesPerRow  : framesPerRow,
                                      framesPerCol  : framesPerCol,
                                      spriteURI     : spriteURI,
                                      spriteURI2x   : spriteURI2x,
                                      caption       : caption,
                                      description   : description,
                                      image         : image,
                                      playable      : playable,
                                      duration      : duration,
                                      source        : source,
                                      title         : title,
                                      facebookUrl   : facebookUrl,
                                      rawGifImage   : rawGifImage,
                                      rawWebpImage  : rawWebpImage,
                                      animatedGifUrl: animatedGifUrl,
                                      animatedGifPreviewUrl: animatedGifPreviewUrl,
                                      animatedWebpUrl: animatedWebpUrl,
                                      animatedWebpPreviewUrl: animatedWebpPreviewUrl,
                                      isMalicious   : isMalicious
                                  };
                    attachment_details.push(attachment);
                 }
              }
            }
            var message_details = { 
                senderID    : message.senderID,
                body        : message.body,
                threadID    : message.threadID,
                messageID   : message.threadID,
                isGroup     : message.isGroup 
              };
            var insert_document = new fb_message(
              {
                send_or_receive   : "receive", // send or receive
                type              : message_type,
                message_details   : message_details,
                message_to_by     : message.senderID,
                attachment        : attachment_details,
              });
            insert_document.save(function(err,result)           
            {
              socket_details.emit("new_message",result);
            }); 
          }
        });
    });
});


var users = {};
var total_csr = [];
var socket_details = '';
io.on('connection', function(socket){
  socket_details = socket;
    // socket get open when any new user get login into chat system
    socket.on('new_user',function(data,callback){
      socket.unique_id        = data.id;
      users[socket.unique_id] = socket;
      total_csr.push(data.id);
       socket_details = socket;
      console.log(total_csr,"total connection");
    });
    socket.on('disconnect',function(data){
        var index = total_csr.indexOf(socket.unique_id);
        if (index > -1) {
            total_csr.splice(index, 1);
        }
         // i.e called an api to we chat where we have to remove connection from csr 
      delete users[socket.unique_id];
      socket_details = socket;
  });
});
/*
app.get('/*', function(req, res) {
res.sendFile(path.join(__dirname + '/public/index.html'));
});
*/

module.exports = app;