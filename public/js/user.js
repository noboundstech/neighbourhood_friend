angular.module('userController', ['applicationService.services'])
.controller('user', function($scope,$rootScope,$http,$routeParams,$location,$localStorage,$interval,API)
{
	$rootScope.authenticateUser();
	$scope.show_id   = 0;
	$scope.show_cust = false;;
	$scope.offer_history =[];
	$scope.state =[];
	$scope.states = [];
	$scope.user_details = [];
	$scope.customer_tag = [];
	$scope.address = {};
	$scope.chat_details =[];
	$scope.search_type  = "distance";
	$scope.search_by_merchant_tag = '';
	$scope.search_by_distance_filter = 10000;
	var socket = io.connect();
	$scope.csr_name = JSON.parse(localStorage.getItem('csr_name'));

	$scope.csr_id    = localStorage.getItem('csr_id');
	// the default center if we can give
	$scope.points = '';


	$scope.mapOptions = {};
    $scope.mapOptions.center = "";
    $scope.mapOptions.zoom = 15;
    $scope.mapOptions.mapType = 'a';
     $scope.mapOptions.options = {
        scrollwheel: false,
        disableZooming: true
    }
    /*<pushpin> directive options*/
    $scope.pushpin = {};
    $scope.pushpin.options = {
        draggable: false
    }

	$scope.CallRestService = function(request) {
	    $.ajax({
	        url: request,
	        dataType: "jsonp",
	        jsonp: "jsonp",
	        success: function (r) {
	        	if(r.statusCode == 200 )
	        	{
		        	$scope.mapOptions.center = {"latitude": r.resourceSets[0].resources[0].point.coordinates[0], "longitude":  r.resourceSets[0].resources[0].point.coordinates[1]};
		            $scope.pushpin.latitude =  r.resourceSets[0].resources[0].point.coordinates[0];
		            $scope.pushpin.longitude =  r.resourceSets[0].resources[0].point.coordinates[1];
		            $scope.getDetailsByLocation();
		        }
		        else
		        {
		        	alert(e.authenticationResultCode);
		        }
	        },
	        error: function (e) {
	            alert(e.statusText);
	        }
	    });
	}

	/*
	var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/US/WA/Redmond/1%20Microsoft%20Way?key=AjZ0wB-x_wfUhjERvFMimAGIUbgHM7uRTKubZcmsbnE_-DSE49gBI53Ts9ClaeT5";

	CallRestService(geocodeRequest);
	*/

	if(localStorage.getItem('user_details') == 'undefined' || localStorage.getItem('user_details') == null)
	{
		$scope.user_details =[];
	}
	else
	{
		$scope.user_details = JSON.parse(localStorage.getItem('user_details'));
	}

	// function to get merchant by location
	$scope.getMerchantDetailsByLocation = function(lotlng,type)
	{
		$scope.location_details.id     		= $scope.customer_id;
		$scope.location_details.member_id 	= $scope.customer_details.memberId;
		$scope.location_details.token 		= localStorage.getItem('token');
		API.getDetails("userfetch/searchbydistance",$scope.location_details).then(function successCallback(response) {
			$scope.merchant_by_location_details = '';
			if(response.status == 200 || response.status == 304)
			{
				if(typeof response.data.response_data.mdetail !='undefined' && response.data.response_data.mdetail.length>0)
				{
					$scope.merchant_by_location_details = response.data.response_data.mdetail;
				}
			}
			else
			{
				// show error message
			}
			
			if(type == 'showSerachByDistance')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			if(type == 'showSearchByDistanceLoader')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			if(type == 'showSerachByDistance')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			$scope.show_user_location ='current';
		}, function errorCallback(response) {
			if(type == 'showSerachByDistance')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			if(type == 'showSearchByDistanceLoader')
			{
				$scope.showSearchByDistanceLoader = false;
			}
			if(type == 'showSerachByDistance')
			{
				$scope.showSearchByDistanceLoader = false;
			}
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	// function to get tag made to the customer
	$scope.getTagDetailByCustomer = function(detail,type)
	{
		detail.token = localStorage.getItem('token');
		API.getDetails("userfetch/fetchtag",detail).then(function successCallback(response) {
			if(response.status == 200 || response.status == 304)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{
					if(response.data.message.details.length>0)
					{
						$scope.customer_tag = response.data.message.details;
					}
					else
					{
						$scope.customer_tag = [];
					}
				}
			}
			else
			{
				// show error message
			}
			if(type == 'showCustomerLoader')
			{
				$scope.showCustomerLoader = false;
			}
			if(type == 'show_remove_tag_loader')
			{
				$scope.show_remove_tag_loader = false;
			}
			if(type == 'show_add_tag_loader')
			{
				$scope.show_add_tag_loader = false;
			}
		}, function errorCallback(response) {
			if(type == 'showCustomerLoader')
			{
				$scope.showCustomerLoader = false;
			}
			if(type == 'show_remove_tag_loader')
			{
				$scope.show_remove_tag_loader = false;
			}
			if(type == 'show_add_tag_loader')
			{
				$scope.show_add_tag_loader = false;
			}
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	// function to get all merchant details which are tag to the customer
	$scope.getMerchantDetailsByCustomer = function(details,type)
	{
		details.member_id = $scope.customer_details.memberId;
		details.token = localStorage.getItem('token');
		API.getDetails("userfetch/searchbymerchant",details).then(function successCallback(response) {
			if(response.status == 200)
			{
				if(typeof response.data.response_data.mdetail !='undefined' && response.data.response_data.mdetail.length>0)
				{
					$scope.merchant_details = response.data.response_data.mdetail;
				}
			}
			else
			{
				// show error message
			}
			if(type=='showCustomerLoader')
			{
				$scope.showCustomerLoader = false;
			}
		}, function errorCallback(response) {
			if(type=='showCustomerLoader')
			{
				$scope.showCustomerLoader = false;
			}
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	// function to get all the offer history made to the customer
	$scope.getCustomerOfferHistory = function(id,customer_name,location,index)
	{
	//	$scope.showCustomerOffer = true;
		$scope.customer_id = id;
		$scope.positions = [];
		$scope.user_details[index].notification = 0;
		$scope.offer_history = '';
		$scope.show_id      = id;
		$scope.show_cust    = true;
		$scope.cust         = customer_name;
		$scope.no_offer_found = false;
		// fetching all the offer offered to the customer
		API.getDetails("userfetch/fetchofferhistory",{id : id,token : localStorage.getItem("token")}).then(function successCallback(response) {
			
			if(response.status == 200 || response.status == 304)
			{
				if(typeof response.data.response_data.details !='undefined' && response.data.response_data.details.length>0)
				{
					$scope.offer_history = response.data.response_data.details;
				}
				else
				{
					$scope.no_offer_found  = true;
				}
			}
			else
			{
				// show error message
			}
			$scope.showCustomerOffer = false;
		}, function errorCallback(response) {
			$scope.showCustomerOffer = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
		
		// if location are provided by we chat than get merchant details by location
		if(typeof location != 'undefined' && location !='')
		{
			if(typeof location.latitude !='undefined' && location.latitude !='' && location.latitude !=null )
			{
				$scope.show_user_location = 'current';
				$scope.merchant_by_location_details = '';
				$scope.mapOptions.center = {"latitude": location.latitude, "longitude": location.longitude };
				$scope.location_details ={
					lat : location.latitude,
					lon : location.longitude
				};
				$scope.pushpin.latitude = location.latitude;
	            $scope.pushpin.longitude = location.longitude;
				$scope.showSearchByDistanceLoader = true;
				$scope.getMerchantDetailsByLocation($scope.location_details,"showSerachByDistance");
			}
			else
			{
				$scope.show_user_location = 'choosen';
				 $scope.mapOptions.center = '';
			}
		}
		else
		{
			$scope.show_user_location = 'choosen';
			$scope.mapOptions.center = '';
		}
		$scope.send_to_customer =id;
		// adding new user into the socket
		$(".messages").scrollTop($(".messages")[0].scrollHeight);
	}
	// get all customer details when the csr will click on customer list in left side
	$scope.getCustomerDetails = function(details,id,customer_name,location,index)
	{
		$scope.showCustomerLoader = true;
		$scope.customer_id = id;
		$scope.customer_details ='';
		$scope.merchant_by_location_details = '';
		$scope.merchant_details = '';
		$scope.customer_tag = '';
		// fetching all tag irrespective of the customer
		API.getDetails("userfetch/fetchalltag",{token : localStorage.getItem("token")}).then(function successCallback(response) {
			if(response.status == 200 || response.status == 304)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{
					$scope.tags = response.data.message.details;
				}
			}
			else
			{
				// show error message
			}
			$scope.showCustomerLoader = false;
		}, function errorCallback(response) {
			$scope.showCustomerLoader = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
		
		// fetching all profile details of the customer
		API.getDetails("userfetch/fetchprofile",{id : id,token : localStorage.getItem("token")}).then(function successCallback(response) {
			if(response.status == 200 || response.status == 304)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{

					$scope.customer_details = response.data.message.details[0];
					$scope.user_detail_selected = {
						"id" 	: $scope.customer_id,
						"token" 	 	: localStorage.getItem("token"),
						"member_id" 	: response.data.message.details[0].memberId
					};
					
					$scope.showCustomerLoader = false;
					$scope.current_header_id = $scope.user_details[index].chat_header;
					$scope.present_customer_details = $scope.user_details[index];
					$scope.getMerchantDetailsByCustomer({id : id},"showCustomerLoader");
				}

				// calling function to fetch all tag which are taged to this customer
				$scope.getTagDetailByCustomer({id : id,token : localStorage.getItem("token")},"showCustomerLoader");
				// fetching all merchant details which are tag to the given customer
				$scope.getCustomerOfferHistory(id,customer_name,location,index);
				$scope.search_type  = "distance";
			}
			else
			{
				// show error message
			}
			$scope.showCustomerLoader = false;
		}, function errorCallback(response) {
			$scope.showCustomerLoader = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	$scope.openReadmoreModel = function(details)
	{
		$scope.user_offer_history_details = details;
	}

	$scope.searchType = function(type)
	{
		$scope.changeLocation('current');
		$scope.search_type  = type;
	}
	$scope.changeLocation = function(location_type)
	{
		$scope.show_user_location = location_type
	}
	$scope.getDetailsByLocation = function()
	{
		$scope.location_details 	= { lat :  $scope.mapOptions.center.latitude, lon :  $scope.mapOptions.center.longitude};
		$scope.pushpin.latitude 	= $scope.mapOptions.center.latitude;
	    $scope.pushpin.longitude 	= $scope.mapOptions.center.longitude;
		$scope.merchant_by_location_details = '';
		$scope.showSearchByDistanceLoader = true;
		// calling function to get all merchant details by the given location
		$scope.getMerchantDetailsByLocation($scope.location_details,"showSearchByDistanceLoader");
	}
	// function to get merchant details by tag type in the search merchant text
	$scope.searchMerchantByTag = function()
	{
		$scope.showSearchMerchantTagLoader = true;
		$scope.search_by_merchant_tag = document.getElementById("search_by_merchant_tag").value;
		API.getDetails("userfetch/searchbypart",{tag : $scope.search_by_merchant_tag,token : localStorage.getItem("token")}).then(function successCallback(response) {

			$scope.merchant_details = '';
			if(response.status == 200)
			{
				if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
				{
					$scope.merchant_details = response.data.message.details;
				}
			}
			else
			{
				// show error message
			}
			$scope.showSearchMerchantTagLoader = false;
		}, function errorCallback(response) {
			$scope.showSearchMerchantTagLoader = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	$scope.addChatIntoLocalstorage = function(data)
	{
		localStorage.setItem('chat_message', JSON.stringify(data));
	}
	$scope.clearTextMessage = function()
	{
		$scope.csr_message = '';
		document.getElementById("dragable_id").value ='';
	}

	// getting all merchant details if csr provide location by typing
	$scope.getLatitudeLongitude = function(type) {
		var address_detail_array = [];
		var address_details ='';
		if(type =='address')
		{
			if(typeof  $scope.address.street != 'undefined')
			{
				address_detail_array.push($scope.address.street);
			}
			if(typeof  $scope.address.province != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.province);
			}
			if(typeof  $scope.address.city != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.city);
			}
			if(typeof  $scope.address.district != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.district);
			}
			if(typeof  $scope.address.country != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.country);
			}
			if(typeof  $scope.address.postcode != 'undefined')
			{
				address_detail_array.push(" "+$scope.address.postcode);
			}
		}
		else
		{
			address_details = "/"+document.getElementById("address_autocomplete").value;
		}
		for(i=0;i<address_detail_array.length;i++)
		{
			address_details+=address_detail_array[i];
		}

		var url = 'http://dev.virtualearth.net/REST/v1/Locations/'+address_details+'/?key=AjZ0wB-x_wfUhjERvFMimAGIUbgHM7uRTKubZcmsbnE_-DSE49gBI53Ts9ClaeT5';
		//var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/US/WA/Redmond/1%20Microsoft%20Way?key=AjZ0wB-x_wfUhjERvFMimAGIUbgHM7uRTKubZcmsbnE_-DSE49gBI53Ts9ClaeT5";

		$scope.CallRestService(url);
	}
	// Define options
    $scope.autocompleteOptions = {};
    // Listen to change event
    $scope.$on('gmPlacesAutocomplete::placeChanged', function(){
      $scope.getLatitudeLongitude("autocomplete");
    });
    // function called when new tag get added by the csr to the customer
    $scope.addNewTag = function()
    {
    	$scope.add_tag_error ='';
    	if(typeof $scope.add_customer_tag =='undefined')
    	{
    		$scope.add_tag_error ='Please select tag to be added';
    		return false;
    	}
    	if($scope.add_customer_tag.length == 0 )
    	{
    		$scope.add_tag_error ='Please select tag to be added';
    		return false;
    	}
    	$scope.show_add_tag_loader = true;
    	var details = {	"id" 				: $scope.customer_id,
    					"tags" 				: $scope.add_customer_tag,
    					"csr_id" 			: JSON.parse(localStorage.getItem('csr_id')),
    					"member_id" 		: $scope.customer_details.memberId,
    					"chatheaderid" 		: $scope.present_customer_details.chat_header,
    					"token" 			: localStorage.getItem("token")
    				};
    	API.postDetails(details,"userfetch/addtag").then(function successCallback(response) {
			$scope.show_add_tag_loader = false;

			if(response.status == 200)
			{
				if($scope.customer_tag == '')
				{
					$scope.customer_tag = [];
				}
				for(i=0;i<$scope.add_customer_tag.length;i++)
				{
					$scope.customer_tag.push({"tagDesc" : $scope.add_customer_tag[i].tagDesc});
				}
				$scope.add_customer_tag ='';
				// once the tag got added calling function to refreash the tag details
				$scope.getTagDetailByCustomer({id :  $scope.customer_id,token : localStorage.getItem("token")},"show_add_tag_loader");
				// getting all merchant details once the new tag got added by the csr to the customer
				$scope.getMerchantDetailsByCustomer({id : $scope.customer_id},"show_add_tag_loader");
			}
			else
			{
				// show error message
			}
		}, function errorCallback(response) {
			$scope.showCustomerOffer = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
    }
    // function to remove the tag details of the customer
    $scope.removeCustomerTag = function(tag,tagId)
    {
    	
    	$scope.show_remove_tag_loader = true;
    	var details = {	"id" 				: $scope.customer_id,
    					"tags" 				: [{ "tagId" : tagId,
    											"tagDesc" : tag
    											}],
    					"csr_id" 			: JSON.parse(localStorage.getItem('csr_id')),
    					"member_id" 		: $scope.customer_details.memberId,
    					"token" 			: localStorage.getItem("token"),
    					"chatheaderid" 	: $scope.present_customer_details.chat_header
    				};
    	API.postDetails(details,"userfetch/removetag").then(function successCallback(response) {
    		
    		// calling function to update the tag to the customer
    		$scope.getTagDetailByCustomer({id :  $scope.customer_id,token : localStorage.getItem("token")},"show_remove_tag_loader");
    		// calling function to update the merchant details of the customer
    		$scope.getMerchantDetailsByCustomer({id : $scope.customer_id},"show_remove_tag_loader");
    	//	$scope.show_remove_tag_loader = false;
    	}, function errorCallback(response) {
			$scope.show_remove_tag_loader = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
    }
    /* socket related code */
    if(localStorage.getItem('chat_message') != 'undefined' && localStorage.getItem('chat_message') != null)
	{
		$scope.chat_details = JSON.parse(localStorage.getItem('chat_message'));
	}
	$(".messages").scrollTop($(".messages")[0].scrollHeight);

	var InsertChatInDb = $interval(function() {
	
		$scope.previous_chat_message = localStorage.getItem('chat_message');
		//	localStorage.removeItem('chat_message');
		localStorage.removeItem('chat_message');
		if($scope.chat_details.length>0 && $scope.chat_details != null && $scope.chat_details != '')
		{
			for(i=0;i<$scope.chat_details.length;i++)
			{
				$scope.chat_details[i].chatheaderid = 186;
				for(j=0;j<$scope.user_details.length;j++)
				{
					
					if($scope.chat_details[i].cust_id == $scope.user_details[j].id )
					{
						$scope.chat_details[i].chatheaderid = $scope.user_details[j].chat_header;
					}
				}
			}
			var details = {"chat_details" :$scope.chat_details ,
							"token" : localStorage.getItem("token")};
			if($scope.previous_chat_message!= null && chat_details.length>0)
			{
				if($scope.previous_chat_message.length> 0)
				{
					
					API.postDetails(details,"userfetch/AddChatDetails").then(function successCallback(response) {
						if(response.status == 200)
						{
							$scope.previous_chat_message = '';
							$scope.chat_details = [];
						}
						else
						{
							$scope.reinsert_chat = JSON.parse(localStorage.getItem('chat_message'));
							if($scope.reinsert_chat == null)
							{
								$scope.reinsert_chat = [];
							}
							for(i=0;i<$scope.previous_chat_message.length;i++)
							{
								$scope.reinsert_chat.push($scope.previous_chat_message[i]);
							}
							localStorage.setItem('chat_message',JSON.stringify($scope.reinsert_chat));
						}
					});
					
				}
			}
		}
	}, 100000);
	if(localStorage.getItem('token') != 'undefined' && localStorage.getItem('token') != null)
	{
		//	$scope.csr_id 	=  localStorage.getItem('token');
		socket.emit('new user',{type : "csr" , id : $scope.csr_id,"csr" : $scope.csr_id},function(data){
			if(!data.status)
			{
				if(data.connect_by =='csr')
				{
					alert(data.message);
					location.reload();
				}
				else
				{
					alert(data.message);
				}
			}
		});
	}
	$scope.value_checked = [];
  	$scope.sendChatMessageFromCsr = function (){
  		var checkedValue = '';
  		if(document.getElementById("dragable_id").value !='')
  		{
  			var details = document.getElementById("dragable_id").value.split("#");
  			for(i=0;i<details.length;i++)
  			{
  				if(details[i]!='undefined')
  				{
  					$scope.value_checked.push({"offer_id" :details[i]});
  				}
  			}
  		}
  		if($scope.search_type == 'distance')
  		{
			var inputElements = document.getElementsByClassName('distance_offer_checkbox');
			for(var i=0; inputElements[i]; ++i){
			    if(inputElements[i].checked){
		      		if(checkedValue != '' && checkedValue != 'undefined ' && checkedValue != null)
		      		{
		      			var details = inputElements[i].value.split("#");
		           		checkedValue +="  , "+details[0];
		           		$scope.value_checked.push({"offer_id" :details[1]});
		            }
		            else
		            {
		            	var details = inputElements[i].value.split("#");
		            	checkedValue +="  "+details[0];
		            	$scope.value_checked.push({"offer_id" :details[1]});
		            }
		            inputElements[i].checked = false;
			    }
			}
  		}
  		if($scope.search_type == 'merchant')
  		{
			var inputElements = document.getElementsByClassName('merchant_offer_checkbox');
			for(var i=0; inputElements[i]; ++i){
			    if(inputElements[i].checked){
		      		if(checkedValue != '' && checkedValue != 'undefined ' && checkedValue != null)
		      		{
		      			var details = inputElements[i].value.split("#");
		           		checkedValue +="  , "+details[0];
		           		$scope.value_checked.push({"offer_id" :details[1]});
		            }
		            else
		            {
		            	var details = inputElements[i].value.split("#");
		            	checkedValue +="  "+details[0];
		            	$scope.value_checked.push({"offer_id" :details[1]});
		            }
		            inputElements[i].checked = false;
			    }
			}
  		}
  		if($scope.search_type == 'offer')
  		{
			var inputElements = document.getElementsByClassName('offer_search_checkbox');
			for(var i=0; inputElements[i]; ++i){
			    if(inputElements[i].checked){
		      		if(checkedValue != '' && checkedValue != 'undefined ' && checkedValue != null)
		      		{
		           		var details = inputElements[i].value.split("#");
		           		checkedValue +="  , "+details[0];
		           		$scope.value_checked.push({"offer_id" :details[1]});
		            }
		            else
		            {
		            	var details = inputElements[i].value.split("#");
		            	checkedValue +="  "+details[0];
		            	$scope.value_checked.push({"offer_id" :details[1]});
		            }
		            inputElements[i].checked = false;
			    }
			}
  		}
  		if(checkedValue!='')
  		{
  			if(typeof $scope.csr_message !='undefined' && $scope.csr_message != null)
  			{
  				$scope.message_sending_detail = $scope.csr_message + "  "+checkedValue;
  			}
  			else
  			{
  				$scope.message_sending_detail = checkedValue;
  			}
  		}
  		else
  		{
  			$scope.message_sending_detail = $scope.csr_message;
  		}
  		if($scope.message_sending_detail != '')
		{
			console.log($scope.customer_details);
  			socket.emit("send message",
  				{
	  				"sender_id" 		: $scope.csr_id,
	  				"customer_id" 		: $scope.cust_id,
	  				"typeofdata"		: "TX",
	  				"converseby" 		: "CS",
	  				"message" 			: $scope.message_sending_detail,
	  				"chatheaderid" 		: $scope.customer_details.chatheaderid,
	  				"member_id" 		: $scope.customer_details.memberId,
	  				"cust_id" 			: $scope.send_to_customer,
	  				"csr_id" 			: $scope.csr_id,
	  				"offer_details" 	: $scope.value_checked
	  			});
  		}
  		$scope.csr_message ='';
  		$scope.value_checked = [];
	}
	socket.on("new message",function(data){

		console.log(data,"got new message");
		if(typeof data.converseby =='undefined' || data.converseby =='CU')
		{
			for(i=0;i<$scope.user_details.length;i++)
			{
				if($scope.user_details[i].id == data.id)
				{
					data.chatheaderid = $scope.user_details[i].chatheaderid;
				}
			}
		}
		$scope.chat_details.push(data);
		//$scope.$apply();
		$(".messages").scrollTop($(".messages")[0].scrollHeight);
		$scope.addChatIntoLocalstorage($scope.chat_details);
		if($scope.customer_id == data.cust_id)
		{
			$(".messages").scrollTop($(".messages")[0].scrollHeight);
		}
		else
		{
			for(i=0;i<$scope.user_details.length;i++)
			{
				if($scope.user_details[i].id == data.cust_id)
				{
					$scope.user_details[i].notification +=1;
				}
			}
		}
		if(data.sender_id != $scope.csr_id)
		{
			var myAudio = new Audio("sound/Sonic_Ring_freetone.at.ua.mp3");
			myAudio.play()
		}
		$scope.$digest();
	})
	socket.on("new customer added",function(data){
		for(i=0;i<$scope.user_details.length;i++)
		{
			if(data.id == $scope.user_details[i].id)
			{
				$scope.user_details.splice(i, 1);
			}
		}
		$scope.user_details.push(data);
		localStorage.setItem('user_details', JSON.stringify($scope.user_details));
		$scope.$digest();
	})
	socket.on("exit_connection_with_csr",function(data){
		$scope.new_chat_user_list = angular.copy($scope.user_details);
		$scope.user_details = [];
		for(i=0;i<$scope.new_chat_user_list.length;i++)
		{
			if($scope.new_chat_user_list[i].id != data)
			{
				$scope.user_details.push($scope.new_chat_user_list[i]);
			}
			else
			{
				if(data == $scope.new_chat_user_list[i].id)
				{
					$scope.show_cust = false;
				}
			}
		}
		$scope.$apply();
	})
})

.controller('dashboard', function($scope,$localStorage,$rootScope)
{
	$rootScope.authenticateUser();
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$scope.user_role = localStorage.getItem('user_role');
})
.controller('member_profile', function($scope,$localStorage,API,$rootScope)
{
	$rootScope.authenticateUser();
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$scope.show_search_details = true;
	$scope.wechat_id = '';
	$scope.page_title = "Member Profile View";
	//$scope.customer_tag = [{"tagDesc":"Life Style","tagId":2},{"tagDesc":"Dining","tagId":4},{"tagDesc":"Shopping","tagId":5},{"tagDesc":"Peace-of-mind","tagId":6}];
	
	$scope.search_by 	="customer_id";
	$scope.mapOptions = {};
    $scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
    $scope.mapOptions.zoom = 12;
    $scope.mapOptions.mapType = 'a';
     $scope.mapOptions.options = {
        scrollwheel: false,
        disableZooming: true
    }
    /*<pushpin> directive options*/
    $scope.pushpin = {};
    $scope.pushpin.options = {
        draggable: false
    }
    $scope.pushpin.latitude 	= 39.9042;
	$scope.pushpin.longitude 	= 116.4074;

	var current_date 	= new Date();
	$scope.start_date 	= current_date.getMonth()+1+"-"+ 1+"-"+current_date.getFullYear();
	$scope.end_date 	= current_date.getMonth()+1+"-"+current_date.getDate()+"-"+current_date.getFullYear();

	
	$scope.showCustomerDetail = function()
	{
		$scope.error_message = '';
		if($scope.search_by == 'customer_id')
		{
			$scope.wechat_id = document.getElementById("wechat_id").value;
			if(typeof $scope.wechat_id =='undefined' || $scope.wechat_id =='' || $scope.wechat_id ==null)
			{
				$scope.error_message = "Please enter the WeChat Id.";
				$scope.customer_details = '';
				$scope.offer_history = '';
				$scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
				$scope.pushpin.latitude 	= 39.9042;
				$scope.pushpin.longitude 	= 116.4074;
				return false;
			}
		}
		if($scope.search_by == 'card_no')
		{
			$scope.card_no = document.getElementById("card_no").value;
			if(typeof $scope.card_no =='undefined' || $scope.card_no =='' || $scope.card_no ==null)
			{
				$scope.error_message = "Please enter Card Number.";
				$scope.customer_details = '';
				$scope.customer_tag = [];
				$scope.offer_history = '';
				$scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
				$scope.pushpin.latitude 	= 39.9042;
				$scope.pushpin.longitude 	= 116.4074;
				return false;
			}
		}
		
		$scope.showCustomerLoader 	= true;
		$scope.customer_tag 		= [];
		$scope.offer_history 		= [];
		$scope.request_detail 		= { wechat_id	: $scope.wechat_id,
										search_by 	: $scope.search_by,
										card_no 	: $scope.card_no,
										token 		: localStorage.getItem("token")
										};
		// fetching all profile details of the customer
		API.postDetails($scope.request_detail,"api/getCustomerDetails").then(function successCallback(response) {
			if(response.status == 200)
			{
				
				$scope.customer_details = response.data.response_data.customer_details[0];
				$scope.predicted_offer  = response.data.response_data.predicted_offer;
				$scope.show_search_details = false;
				$scope.wechat_id = response.data.response_data.customer_details[0].memberWechatId

				// calling api to fetch all tag details
				API.getDetails("userfetch/fetchtag",{id : $scope.wechat_id,token : localStorage.getItem("token")}).then(function successCallback(response) {
					if(response.status == 200)
					{
						if(typeof response.data.message.details !='undefined' && response.data.message.details.length>0)
						{
							if(response.data.message.details.length>0)
							{
								$scope.customer_tag = response.data.message.details;

							}
						}
					}
					else
					{
						$scope.customer_tag = [];
						// show error message
					}
				});

				// calling api to fetch all tag details
				API.getDetails("userfetch/fetchofferhistory",{id : $scope.wechat_id,token : localStorage.getItem("token")}).then(function successCallback(response) {
					
					if(response.status == 200)
					{
						if(typeof response.data.response_data.details !='undefined' && response.data.response_data.details.length>0)
						{
							if(response.data.response_data.details.length>0)
							{
								$scope.offer_history = response.data.response_data.details;
							}
							else
							{
								$scope.offer_history = [];
							}
						}
					}
					else
					{
						$scope.offer_history = [];
						// show error message
					}
					$scope.showCustomerLoader = false;
				}, function errorCallback(response) {
					$scope.showCustomerLoader = false;
				});
				
				var address_details = '';
				if($scope.customer_details.AddressLine1 != '' && $scope.customer_details.AddressLine1 != null)
				{
					address_details = " "+$scope.customer_details.AddressLine1;
				}
				if($scope.customer_details.AddressLine2 != '' && $scope.customer_details.AddressLine2 != null)
				{
					address_details+= " "+$scope.customer_details.AddressLine2;
				}
				if($scope.customer_details.City != '' && $scope.customer_details.City != null)
				{
					address_details+= " "+$scope.customer_details.City;
				}
				if($scope.customer_details.District != '' && $scope.customer_details.District != null)
				{
					address_details+= " "+$scope.customer_details.District;
				}
				if($scope.customer_details.Province != '' && $scope.customer_details.Province != null)
				{
					address_details+= " "+$scope.customer_details.Province;
				}
				if($scope.customer_details.Country != '' && $scope.customer_details.Country != null)
				{
					address_details+= " "+$scope.customer_details.Country;
				}
				if(address_details != '')
				{	
					var url = 'http://dev.virtualearth.net/REST/v1/Locations/'+address_details+'/?key=AjZ0wB-x_wfUhjERvFMimAGIUbgHM7uRTKubZcmsbnE_-DSE49gBI53Ts9ClaeT5';
					$.ajax({
				        url: url,
				        dataType: "jsonp",
				        jsonp: "jsonp",
				        success: function (r) {
				        	if(r.statusCode == 200 )
				        	{
				        		if(r.resourceSets[0].resources.length>0)
				        		{
						        	$scope.mapOptions.center = {"latitude": r.resourceSets[0].resources[0].point.coordinates[0], "longitude":  r.resourceSets[0].resources[0].point.coordinates[1]};
						            $scope.pushpin.latitude =  r.resourceSets[0].resources[0].point.coordinates[0];
						            $scope.pushpin.longitude =  r.resourceSets[0].resources[0].point.coordinates[1];
						        }
						        else
						        {
						        	$scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
									$scope.pushpin.latitude 	= 39.9042;
									$scope.pushpin.longitude 	= 116.4074;
						        }
					        }
					        else
					        {
								$scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
								$scope.pushpin.latitude 	= 39.9042;
								$scope.pushpin.longitude 	= 116.4074;
					        }
				        },
				        error: function (e) {
				            alert(e.statusText);
				        }
				    });
				}

			}
			else
			{
				$scope.error_message = response.data.response_data.message;
				$scope.showCustomerLoader = false;
				$scope.customer_details = '';
				$scope.customer_tag = [];
				$scope.offer_history = '';
				$scope.mapOptions.center = {"latitude": 39.9042, "longitude":  116.4074};
				$scope.pushpin.latitude 	= 39.9042;
				$scope.pushpin.longitude 	= 116.4074;
				// show error message
			}
		}, function errorCallback(response) {
			$scope.showCustomerLoader = false;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}

	$scope.getCustomerForm = function()
	{
		$scope.show_search_details = true;
	}
})