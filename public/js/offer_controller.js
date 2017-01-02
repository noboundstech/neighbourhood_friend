angular.module('offerController', ['applicationService.services'])
.controller('offer_display_view', function($scope,Excel,MyService,$timeout,$location,$localStorage,
											$rootScope,API,APPLICATION_CONSTANT)
{
	$scope.page_title = APPLICATION_CONSTANT.offer_display_view;
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$rootScope.authenticateUser();
	$scope.merchat_detail_selected 	= '';
	var current_date 	= new Date();
	$scope.start_date 	= 1+"-"+ 1+"-"+current_date.getFullYear();
	$scope.end_date 	= current_date.getMonth()+1+"-"+current_date.getDate()+"-"+current_date.getFullYear();
	$scope.show_loader = true;

	// function to generate excel
	$scope.exportToExcel=function(tableId){ // ex: '#my-table'
        var exportHref=Excel.tableToExcel(tableId,'WireWorkbenchDataExport');
        $timeout(function(){location.href=exportHref;},100); // trigger download
    }

    // function to generate pdf
    $scope.generatePDF = function() {
    	$timeout(function(){
    		kendo.drawing.drawDOM($("#tableToPdf")).then(function(group) {
				kendo.drawing.pdf.saveAs(group, $scope.page_title+".pdf");
				document.getElementById("close_pdf_model").click();
			});
    	},100); 
	}

	// function to select all

	$scope.selectAllFilter = function(type)
	{
		if(type == 'card_type')
		{
			$scope.card_type_selected = $scope.card_type;
		}
		if(type == 'category')
		{
			$scope.category_selected = $scope.category;
		}
		if(type == 'sub_category')
		{
			$scope.sub_category_selected = $scope.sub_category;
		}
		if(type == 'merchant')
		{
			$scope.merchant_selected = $scope.merchat_details;
		}
	}

	
	API.getDetails("view_offer_merchant/getViewList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
		if(response.status == 200)
		{
			$scope.card_type 				= response.data.response_data.cardtype;
			$scope.location_name			= response.data.response_data.offerloc;
			$scope.merchat_details 			= response.data.response_data.merchant_details;
			$scope.category 				= response.data.response_data.category;
			$scope.sub_category 			= response.data.response_data.subcategory;

			$scope.card_type_selected		= "";
			$scope.category_selected 		= '';
			$scope.sub_category_selected 	= '';
			$scope.location_selected 		= '';
			$scope.merchant_selected 		= '';
			$scope.details = {
				card_type 		: "",
				token 			: "",
				category 		: "",
				subcategory 	: "",
				merchant_details: "",
				location 		: "",
				token 			: localStorage.getItem('token'),
				date_range 		: {"from":$scope.start_date ,"to":$scope.end_date}
			};

			API.postDetails($scope.details,"view_offer_merchant/getOfferView").then(function successCallback(response) {
				$scope.details_response = response.data.response_data.details;
				$scope.show_loader = false;
			});
		}
		else
		{
			// show error message
		}
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});

	$scope.getOfferDisplayView = function()
	{
		$scope.details = {
			card_type 		: $scope.card_type_selected,
			token 			: localStorage.getItem('token'),
			category 		: $scope.category_selected,
			subcategory 	: $scope.sub_category_selected,
			merchant_details: $scope.merchant_selected,
			location 		: $scope.location_selected,
			date_range 		: {"from":$scope.start_date ,"to":$scope.end_date}
		};
		if(MyService.compareTwoDate($scope.start_date,$scope.end_date)== 'error')
		{
			$scope.error = "Your end date must be greater that start date";
			return false;
		}
		$scope.show_loader_details = true;
		API.postDetails($scope.details,"view_offer_merchant/getOfferView").then(function successCallback(response) {
			$scope.show_loader_details = false;
			$scope.details_response = response.data.response_data.details;
			document.getElementById("close_filter").click();
		});
	}
	$scope.sortBy = 'merchantName'
	$scope.sort = function(val)
	{
		if($scope.sortBy == val)
		{
			
			$scope.sortBy = '-'+val;
		}
		else
		{
			$scope.sortBy = val;
		}
	}
})
.controller('merchant_display_view', function($scope,Excel,$timeout,$location,$localStorage,
												$rootScope,API,APPLICATION_CONSTANT)
{
	$scope.page_title = APPLICATION_CONSTANT.merchant_display_view;
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$rootScope.authenticateUser();
	$scope.merchat_detail_selected 	= '';
	var current_date 	= new Date();
	$scope.start_date 	= current_date.getMonth()+1+"-"+ 1+"-"+current_date.getFullYear();
	$scope.end_date 	= current_date.getMonth()+1+"-"+current_date.getDate()+"-"+current_date.getFullYear();
	$scope.show_loader = true;

	$scope.exportToExcel=function(tableId){ // ex: '#my-table'
        var exportHref=Excel.tableToExcel(tableId,'WireWorkbenchDataExport');
        $timeout(function(){location.href=exportHref;},100); // trigger download
    }

    $scope.generatePDF = function() {
    	$timeout(function(){
    		kendo.drawing.drawDOM($("#tableToPdf")).then(function(group) {
				kendo.drawing.pdf.saveAs(group, APPLICATION_CONSTANT.merchant_display_view+".pdf");
				document.getElementById("close_pdf_model").click();
			});
    	},100); 
	}

	// function to select all

	$scope.selectAllFilter = function(type)
	{

		
		if(type == 'card_type')
		{
			$scope.card_type_selected = $scope.card_type;
		}
		if(type == 'category')
		{
			$scope.category_selected = $scope.category;
		}
		if(type == 'sub_category')
		{
			$scope.sub_category_selected = $scope.sub_category;
		}
		if(type == 'merchant')
		{
			$scope.merchant_selected = $scope.merchat_details;
		}
	}

	API.getDetails("view_offer_merchant/getViewList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
		if(response.status == 200)
		{
			$scope.card_type 					= response.data.response_data.cardtype;
			$scope.location_name				= response.data.response_data.offerloc;
			$scope.merchant_location_name		= response.data.response_data.merchloc;
			$scope.merchat_details 				= response.data.response_data.merchant_details;
			$scope.category 					= response.data.response_data.category;
			$scope.sub_category 				= response.data.response_data.subcategory;

			$scope.card_type_selected			= response.data.response_data.cardtype;
			$scope.category_selected 			= '';
			$scope.sub_category_selected 		= '';
			$scope.location_selected 			= '';
			$scope.merchant_location_selected 	= '';
			$scope.merchant_selected 			= '';
			$scope.details = {
				card_type 			: $scope.card_type_selected,
				token 				: "",
				category 			: "",
				subcategory 		: "",
				merchant_details	: "",
				location 			: "",
				token 				: localStorage.getItem('token'),
				merchant_location 	: $scope.merchant_location_selected
			};
			API.postDetails($scope.details,"view_offer_merchant/getMerchantView").then(function successCallback(response) {
				$scope.details_response = response.data.response_data.details;
				$scope.show_loader = false;
			});
		}
		else
		{
			// show error message
		}
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});

	$scope.getMerchantDisplayView = function()
	{
		$scope.details = {
			card_type 			: $scope.card_type_selected,
			token 				: localStorage.getItem('token'),
			category 			: $scope.category_selected,
			subcategory 		: $scope.sub_category_selected,
			merchant_details	: $scope.merchant_selected,
			location 			: $scope.location_selected,
			merchant_location 	: $scope.merchant_location_selected
		};
		$scope.show_loader_filter = true;
		API.postDetails($scope.details,"view_offer_merchant/getMerchantView").then(function successCallback(response) {
			$scope.show_loader_filter = false;
			$scope.details_response = response.data.response_data.details;
			document.getElementById("close_filter").click();
		});
	}
	$scope.sortBy = 'merchantName'
	$scope.sort = function(val)
	{
		if($scope.sortBy == val)
		{
			
			$scope.sortBy = '-'+val;
		}
		else
		{
			$scope.sortBy = val;
		}
	}

})
