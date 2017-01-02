angular.module('homeController', ['applicationService.services'])

.controller('home', function($scope,API,$location,$rootScope)
{
	$scope.details ="Login to Your Account";
	$scope.login = {};
	$scope.Loader = true;

	API.getDetails("api/getFriendList","").then(function successCallback(response) {
		$scope.Loader = false;
		$scope.getFriendList = response.data;
	})
	$scope.selectCustomer = function(data){
		console.log(data);
		$scope.user_details = data;
	}
	$scope.sendChatMessage = function()
	{
		$scope.data = {
			user_details : $scope.user_details,
			message 	 : $scope.fb_message 
		}
		$scope.fb_message = '';
		API.postDetails($scope.data,"api/sendMessage").then(function successCallback(response) {
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
})
