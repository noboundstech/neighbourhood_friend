angular.module('homeController', ['applicationService.services'])

.controller('home', function($scope,API,$location,$rootScope)
{
	$scope.details ="Login to Your Account";
	$scope.login = {};
	$scope.Loader = true;
	$scope.userFbMessage  = [];
	var socket = io.connect();


	API.getDetails("api/getFriendList","").then(function successCallback(response) {
		$scope.Loader = false;
		$scope.getFriendList = response.data;

	})
	$scope.selectCustomer = function(data){
		console.log(data);
		$scope.user_details = data;
		API.postDetails(data,"api/getAllFbMessage").then(function successCallback(response) {
			$scope.fb_message = '';
			if(response.status == 200)
			{
				$scope.userFbMessage = response.data;
			//	var scroller = document.getElementById("bottom");
      		//		scroller.scrollTop = scroller.scrollHeight;
			}
			else
			{
				//$scope.error = response.data.response_data.message;
			}
		});
	}
	$scope.sendChatMessage = function()
	{
		$scope.data = {
			user_details : $scope.user_details,
			message 	 : $scope.fb_message 
		}
		$scope.fb_message = '';
		API.postDetails($scope.data,"sendMessageToFacebook").then(function successCallback(response) {
			$scope.fb_message = '';
			if(response.status == 200)
			{
				//$scope.success = response.data.response_data.message;
			}
			else
			{
				//$scope.error = response.data.response_data.message;
			}
		});
	}
	$scope.clearTextMessage = function()
	{
		$scope.fb_message = '';
	}

	$scope.socket_id = moment().unix();
	// creating new socket when ever any user comes into this page
	socket.emit('new_user',{ id : $scope.socket_id},function(data){	});
	socket.on("new_message",function(data){
		$scope.userFbMessage.push(data);
		$scope.$digest();
	});

})
