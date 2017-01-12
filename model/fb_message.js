var mongoose = require("mongoose");

var message_details =  new mongoose.Schema(
	{ 
		senderID 	: String,
		body 		: String,
		threadID 	: String,
		messageID 	: String,
		timestamp 	: { type: Date, default: Date.now },
		isGroup		: Boolean 
	});
var attachment = new mongoose.Schema({
		type 					: String,
		name 					: String,
		hiresUrl 				: String,
		thumbnailUrl 			: String,
		previewUrl 				: String,
		previewWidth 			: Number,
		previewHeight 			: Number,
		ID 						: String,
		filename 				: String,
		mimeType 				: String,
		url 					: String,
		width 					: Number,
		height 					: Number,
		stickerID       		: Number,
		packID 					: String,
		frameCount 				: String,
		frameRate 				: String,
		framesPerRow 			: String,
		framesPerCol 			: String,
		spriteURI 				: String,
		spriteURI2x 			: String,
		caption 				: String,
		description				: String,
		image 					: String,
		playable 				: Boolean,
		duration 				: Number,
		source 					: String,
		title 					: String,
		facebookUrl 			: String,
		rawGifImage				: String,
    	rawWebpImage			: String,
    	animatedGifUrl 			: String,
    	animatedGifPreviewUrl 	: String,
    	animatedWebpUrl 		: String,
    	animatedWebpPreviewUrl 	: String,
    	isMalicious 			: String
})
var messageSchema 	= new mongoose.Schema(
{
	created_on			: { type: Date, default: Date.now },
	send_or_receive		: String, // send or receive
	type 				: String,
	message_details 	: message_details,
	attachment 			: [attachment],
	message_to_by		: String
});
//compile schema to model
module.exports = mongoose.model('fb_message', messageSchema,'fb_message');