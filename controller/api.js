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
// api to send details of customer
router.route('/getFriendList')
.get(function (req, res) {
 
	var async 			= require('async');
	var sql 			= require('mssql');
	var config 			= require('config/db_connection');
	var constant 		= require("config/constant");
	var db_query 		= require('db_query/query');
	var utils 			= require('utility/utils');
	var response_data 	= {};
	var where_cond 		= '';

	async.parallel([
		function(callback) {
			// validating the customer details
			var validate = require('utility/validate');
			validate.validateCustomer(req,res,function(){
				if(req.body.search_by =='customer_id')
				{
					where_cond =  " mem.memberWechatId='"+req.body.wechat_id+"'";
				}
				else
				{
					where_cond =  " mem.MTRCardNumber='"+req.body.card_no+"'";
				}
				callback();
			})
		},
		function(callback){
			//authenticating that request is comming with valid token
			utils.checkAuthentication(req,res,function(){
				callback();
			})
		},
		function(callback) {
			var query = " select *";
				query+= " FROM "+constant.MEMBER_MASTER_TABLE+" as mem";
				query+= " where "+where_cond;
			db_query.RunSelSqlFromDb(req,res,query,response_data,function(){
				if(response_data.details.length>0)
				{
					response_data.member_details = response_data.details;
					callback();
				}
				else
				{
					if(req.body.search_by == 'customer_id')
					{
						response_data.message = "Please Enter valid customer Wechat Id";
					}
					else
					{
						response_data.message = "Please Enter valid customer Card no.";
					}
					response_data.success = false;
					
					res.status(203).send({response_data});
				}
			})
		},function(callback){
			var wechat_id = req.body.wechat_id;
			var query = " SELECT mem.memberWechatId,mem.memberFirstName,";
				query += "mem.memberLastName,mem.memberGender,mem.preferredLanguage,";
				query += " mem.MTRPoints,mem.MTRCardType,mem.memberPhone,mem.memberAge,mem.memberOccupation,";
				query += "mem.memberHobby,mem.memberInfo1,mem.memberInfo2,mem.memberInfo3,mem.AddressLatitude,mem.Addresslongitude,";
				query += "mem.AddressLine1,mem.AddressLine2,mem.City,mem.District,mem.Province,mem.Country,mem.memberSegment,";
				query += "count(offer.offerClicked) as click,count(offer.offerUsed) as used, count(offer.offerSentTimestamp) as sent";
				query+= " FROM "+constant.MEMBER_MASTER_TABLE+" as mem LEFT JOIN "+constant.OFFER_RESPONSE_TABLE+" as offer ON mem.memberId = offer.memberId ";
				query+= " LEFT JOIN  "+constant.MEMBER_TAG_TABLE+"  as tag ON mem.memberId = tag.memberId";
				query+= " WHERE "+where_cond;
				query+= " GROUP BY mem.memberWechatId,mem.memberFirstName,mem.memberLastName,mem.memberGender,mem.preferredLanguage,mem.MTRPoints,mem.MTRCardType,mem.memberPhone,mem.memberAge,mem.memberOccupation,mem.memberHobby,mem.memberInfo1,mem.memberInfo2,mem.memberInfo3,mem.AddressLatitude,mem.Addresslongitude,mem.AddressLine1,mem.AddressLine2,mem.City,mem.District,mem.Province,mem.Country,mem.memberSegment ";
			db_query.RunSelSqlFromDb(req,res,query,response_data,function(){
				if(response_data.details.length>0)
				{
					response_data.customer_details = response_data.details;
					callback();
				}
				else
				{
					response_data.success = false;
					if(req.body.search_by == 'customer_id')
					{
						response_data.message = "Please Enter valid customer Wechat Id";
					}
					else
					{
						response_data.message = "Please Enter valid customer Card no.";
					}
					res.status(203).send({response_data});
				}
			})
		},
		function(callback){
           		utils.getOfferDetailsList(req,res,constant,where_cond,db_query,response_data,function(){
					callback();

				})
        }],function(err) {
			response_data.user_details = req.decoded;
			response_data.success = true;
			response_data.message = "success!";
			res.status(200).send({response_data});
		});
});

module.exports = router;