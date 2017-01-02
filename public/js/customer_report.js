angular.module('CustomerReportController', ['applicationService.services'])
.controller('offer_segment', function($scope,$timeout,MyService,$http,$routeParams,$location,$localStorage,
										$rootScope,API,APPLICATION_CONSTANT)
{
	$scope.user_type = localStorage.getItem('user_type');
	$scope.user_name = localStorage.getItem('csr_name');
	$rootScope.authenticateUser();
	$scope.checkboxModel = {};
	$scope.total_checked = 3;
	$rootScope.map_type = 'default';
	$scope.checkboxModel.card_type 			= false;
	$scope.checkboxModel.gender 			= false;
	$scope.checkboxModel.location_details 	= false;
	$scope.checkboxModel.age_grouped 		= false;
	$scope.checkboxModel.date_range 		= true;
	$scope.checkboxModel.segment 			= false;
	$scope.checkboxModel.tag_details 		= false;
	$scope.show_discription 				= false;
	$scope.show_by_offer 					= true;
	$scope.merchant_details 				= '';
	$scope.x_axis_selected 					= '';
	$scope.y_axis_selected 					= '';
	$scope.offer_name 						= '';
	$timeout(function(){

		$('#offerSelect_chosen .chosen-default span').text("Select Merchant First");

	},100);

	$scope.default_segment_filter = [];
	$scope.age_group_filter = [];
	
	$scope.checkboxModel.offer_segment_search_by = "offer_id";
	var current_date 	= new Date();
	$scope.start_date 	= 1+"-"+ 1+"-"+current_date.getFullYear();
	$scope.end_date 	= current_date.getMonth()+1+"-"+current_date.getDate()+"-"+current_date.getFullYear();
	$scope.show_loader = true;

	if($location.path() == '/offer_segment')
	{
		$scope.page_title = APPLICATION_CONSTANT.offer_segment_view;
	}
	else
	{
		$scope.page_title = APPLICATION_CONSTANT.member_segment_view;
	}

	$scope.selectAllFilter = function(type)
	{
		if(type == 'age_group')
		{
			$scope.age_group_filter = $scope.age_group_type;
		}
		if(type == 'card_type')
		{
			$scope.card_type_filter_details = $scope.card_type;
		}
		if(type == 'gender')
		{
			$scope.gender_type_filter = $scope.gender_type;
		}
		if(type == 'segment')
		{
			$scope.segment_filter = $scope.segment_type;
		}
		if(type == 'tags')
		{
			$scope.tag_details_filter = $scope.tag_type;
		}
		if(type == 'category')
		{
			$scope.category_filter_details = $scope.category;
		}
	}

	API.getDetails("customer_segment/getCustReportList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
		
		if(response.status == 200)
		{
			$scope.card_type 			= response.data.response_data.cardtype;
			$scope.gender_type 			= [{"name":"Male"},{"name":"Female"}];
			$scope.location_name		= response.data.response_data.custloc;
			$scope.age_group_type 		= response.data.response_data.age_group;
			$scope.segment_type 		= response.data.response_data.custseg;
			$scope.tag_type 			= response.data.response_data.tag;
			$scope.merchat_details 		= response.data.response_data.merchant;
			$scope.category 			= response.data.response_data.category;
			$scope.gender_type_filter 		= $scope.gender_type;
			$scope.card_type_filter_details = $scope.card_type;
			$scope.segment_filter 			= $scope.segment_type;
			$scope.age_group_filter 		= $scope.age_group_type;

			if(document.getElementById("x_axis_card_type") != null)
			{
				document.getElementById("x_axis_card_type").checked = true;
			}
			if(document.getElementById("y_axis_card_type") != null)
			{
				document.getElementById("y_axis_card_type").disabled = true;
			}
			$scope.x_axis_selected = 'card_type';
			$scope.checkboxModel.card_type 	= true;
			if(document.getElementById("y_axis_gender") != null)
			{
				document.getElementById("y_axis_gender").checked = true;
			}
			if(document.getElementById("x_axis_gender") != null)
			{
				document.getElementById("x_axis_gender").disabled = true;
			}
			$scope.y_axis_selected = 'gender';
			$scope.checkboxModel.gender 	= true;


			$scope.offer_id = APPLICATION_CONSTANT.default_offer_id;
			if($location.path() == '/offer_segment')
			{
				$scope.getOfferSegmentDetails();
			}
			else
			{
				$scope.getCustomerSegmentDetails();
			}

			$scope.checkboxModel.location_details 	= false;
			$scope.checkboxModel.age_grouped 		= false;
			$scope.checkboxModel.segment 			= false;
			$scope.checkboxModel.tag_details 		= false;
			$scope.show_discription 				= false;
			//$scope.show_loader = false;
		}
		else
		{
			$scope.show_loader = false;
			// show error message
		}
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});

	$scope.change_axis_display = function(type,axis)
	{
		if(axis =='x_axis')
		{
			document.getElementById("y_axis_card_type").disabled = false;
			document.getElementById("y_axis_gender").disabled 	= false;
			document.getElementById("y_axis_location").disabled = false;
			document.getElementById("y_axis_age_group").disabled = false;
			document.getElementById("y_axis_tags").disabled = false;
			document.getElementById("y_axis_segment").disabled = false;
			document.getElementById("y_axis_category").disabled = false;
			if(type =='card_type')
			{
				document.getElementById("y_axis_card_type").disabled = true;
			}
			if(type =='gender')
			{
				document.getElementById("y_axis_gender").disabled = true;
			}
			if(type =='tags')
			{
				document.getElementById("y_axis_tags").disabled = true;
			}
			if(type =='location')
			{
				document.getElementById("y_axis_location").disabled = true;
			} 
			if(type =='age_grouped')
			{
				document.getElementById("y_axis_age_group").disabled = true;
			}
			if(type =='segment')
			{
				document.getElementById("y_axis_segment").disabled = true;
			}
			if(type =='category')
			{
				document.getElementById("y_axis_category").disabled = true;
			}
		}
		else
		{
			document.getElementById("x_axis_tags").disabled = false;
			document.getElementById("x_axis_card_type").disabled = false;
			document.getElementById("x_axis_location").disabled = false;
			document.getElementById("x_axis_age_group").disabled = false;
			document.getElementById("x_axis_gender").disabled = false;
			document.getElementById("x_axis_segment").disabled = false;
			document.getElementById("x_axis_category").disabled = false;

			if(type =='card_type')
			{
				document.getElementById("x_axis_card_type").disabled = true;
			}
			if(type =='gender')
			{
				document.getElementById("x_axis_gender").disabled = true;
			}
			if(type =='tags')
			{
				document.getElementById("x_axis_tags").disabled = true;
			}
			if(type =='location')
			{
				document.getElementById("x_axis_location").disabled = true;
			} 
			if(type =='age_grouped')
			{
				document.getElementById("x_axis_age_group").disabled = true;
			}
			if(type =='segment')
			{
				document.getElementById("x_axis_segment").disabled = true;
			}
			if(type =='category')
			{
				document.getElementById("x_axis_category").disabled = true;
			}
		}
	}
	$scope.changeChecboxStatus = function(type,axis)
	{
		if(axis == 'x_axis')
		{
			// checking for card type
			if(type =='card_type')
			{
				if($scope.x_axis_selected != 'card_type')
				{

					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.x_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.x_axis_selected 			= 'card_type';
					$scope.checkboxModel.card_type 	= true;
				}
			}
			// checking for gender
			if(type =='gender')
			{
				if($scope.x_axis_selected != 'gender')
				{
					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.x_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.x_axis_selected 			= 'gender';
					$scope.checkboxModel.gender 	= true;
				}
			}
			// checking for tags
			if(type =='tags')
			{
				if($scope.x_axis_selected != 'tags')
				{
					console.log($scope.x_axis_selected );
					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.x_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.x_axis_selected 			= 'tags';
					$scope.checkboxModel.tag_details = true;
				}
			}
			// checking for location
			if(type =='location')
			{
				if($scope.x_axis_selected != 'location')
				{
					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.x_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.x_axis_selected 					= 'location';
					$scope.checkboxModel.location 	= true;
				}
			}
			// checking for age group
			if(type =='age_grouped')
			{
				if($scope.x_axis_selected != 'age_grouped')
				{

					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.x_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.x_axis_selected 				= 'age_grouped';
					$scope.checkboxModel.age_grouped 	= true;
				}
			}
			// checking for segment
			if(type =='segment')
			{
				if($scope.x_axis_selected != 'segment')
				{

					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.x_axis_selected 				= 'segment';
					$scope.checkboxModel.segment 	= true;
				}
			}
			if(type =='category')
			{
				if($scope.x_axis_selected != 'category')
				{

					if($scope.x_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.x_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.x_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.x_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.x_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					$scope.x_axis_selected 				= 'category';
					$scope.checkboxModel.category 	= true;
				}
			}
		}
		else
		{
			// checking for card type
			if(type =='card_type')
			{
				if($scope.y_axis_selected != 'card_type')
				{

					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.y_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}

					$scope.y_axis_selected 			= 'card_type';
					$scope.checkboxModel.card_type 	= true;
				}
			}
			// checking for gender
			if(type =='gender')
			{
				if($scope.y_axis_selected != 'gender')
				{

					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.y_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.y_axis_selected 			= 'gender';
					$scope.checkboxModel.gender 	= true;
				}
			}
			// checking for tags
			if(type =='tags')
			{
				if($scope.y_axis_selected != 'tags')
				{
					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.y_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.y_axis_selected 			= 'tags';
					$scope.checkboxModel.tag_details = true;
				}
			}
			// checking for location
			if(type =='location')
			{
				if($scope.y_axis_selected != 'location')
				{
					console.log($scope.y_axis_selected );
					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.y_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.y_axis_selected 					= 'location';
					$scope.checkboxModel.location 	= true;
				}
			}
			// checking for age group
			if(type =='age_grouped')
			{
				if($scope.y_axis_selected != 'age_grouped')
				{

					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					if($scope.y_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.y_axis_selected 				= 'age_grouped';
					$scope.checkboxModel.age_grouped 	= true;
				}
			}
			// checking for segment
			if(type =='segment')
			{
				if($scope.y_axis_selected != 'segment')
				{

					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'category')
					{
						$scope.checkboxModel.category 	= false;
					}
					$scope.y_axis_selected 				= 'segment';
					$scope.checkboxModel.segment 	= true;
				}
			}
			// checking for category
			if(type =='category')
			{
				if($scope.y_axis_selected != 'category')
				{

					if($scope.y_axis_selected == 'card_type')
					{
						$scope.checkboxModel.card_type 	= false;
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.checkboxModel.tag_details 	= false;
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.checkboxModel.location 	= false;
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.checkboxModel.gender 	= false;
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.checkboxModel.age_grouped 	= false;
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.checkboxModel.segment 	= false;
					}
					$scope.y_axis_selected 				= 'category';
					$scope.checkboxModel.category 		= true;
				}
			}
		}
		$scope.change_axis_display(type,axis);
	}
	$scope.getCustomerSegmentDetails = function()
	{
		
		$scope.card_type_selected_details 		= [];
		$scope.segment_selected_details 		= [];
		$scope.age_grouped_selected_details 	= [];
		$scope.location_filter_selected_details = [];
		$scope.selected_axis_details    		= 0;
		$scope.error =  '';
		$scope.x_axis_error_select_msg 			= '';
		$scope.y_axis_error_select_msg 			= '';
		$scope.empty_in_selection 				= '';
		if($scope.x_axis_selected == 'card_type' || $scope.y_axis_selected == 'card_type')
		{
			if(typeof $scope.card_type_filter_details !='undefined')
			{
				for(i=0;i<$scope.card_type_filter_details.length;i++)
				{
					$scope.card_type_selected_details.push({"name" : $scope.card_type_filter_details[i].card_type});
				}
				if($scope.card_type_selected_details.length>0)
				{
					$scope.selected_axis_details++;
				}
				else
				{
					if($scope.x_axis_selected == 'card_type')
					{
						$scope.x_axis_error_select_msg 	 = "SELECT CARD TYPE";
						$scope.empty_in_selection = "x_axis";
					}
					if($scope.y_axis_selected == 'card_type')
					{
						$scope.y_axis_error_select_msg 	 = "SELECT CARD TYPE";
						$scope.empty_in_selection = "y_axis";
					}
				}
			}
			else
			{
				if($scope.x_axis_selected == 'card_type')
				{
					$scope.x_axis_error_select_msg 	 = "SELECT CARD TYPE";
					$scope.empty_in_selection = "x_axis";
				}
				if($scope.y_axis_selected == 'card_type')
				{
					$scope.y_axis_error_select_msg 	 = "SELECT CARD TYPE";
					$scope.empty_in_selection = "y_axis";
				}
			}
		}
		if($scope.x_axis_selected == 'gender' || $scope.y_axis_selected == 'gender')
		{
			if(typeof $scope.gender_type_filter != 'undefined')
			{
				if($scope.gender_type_filter.length>0)
				{
					$scope.selected_axis_details++;
				}
				else
				{
					if($scope.x_axis_selected == 'gender')
					{
						$scope.x_axis_error_select_msg 	 = "SELECT GENDER";
						$scope.empty_in_selection = "x_axis";
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.y_axis_error_select_msg 	 = "SELECT GENDER";
						$scope.empty_in_selection = "y_axis";
					}
				}
			}
			else
			{
				if($scope.x_axis_selected == 'gender')
				{
					$scope.x_axis_error_select_msg 	 = "SELECT GENDER";
					$scope.empty_in_selection = "x_axis";
				}
				if($scope.y_axis_selected == 'gender')
				{
					$scope.y_axis_error_select_msg 	 = "SELECT GENDER";
					$scope.empty_in_selection = "y_axis";
				}
			}
		}
		if($scope.x_axis_selected == 'tags' || $scope.y_axis_selected == 'tags')
		{
			if(typeof $scope.tag_details_filter != 'undefined')
			{
				if($scope.tag_details_filter.length>0)
				{
					$scope.selected_axis_details++;
				}
				else
				{
					if($scope.x_axis_selected == 'tags')
					{
						$scope.x_axis_error_select_msg 	 = "SELECT TAGS";
						$scope.empty_in_selection = "x_axis";
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.y_axis_error_select_msg 	 = "SELECT TAGS";
						$scope.empty_in_selection = "y_axis";
					}
				}
			}
			else
			{
				if($scope.x_axis_selected == 'tags')
				{
					$scope.x_axis_error_select_msg 	 = "SELECT TAGS";
					$scope.empty_in_selection = "x_axis";
				}
				if($scope.y_axis_selected == 'tags')
				{
					$scope.y_axis_error_select_msg 	 = "SELECT TAGS";
					$scope.empty_in_selection = "y_axis";
				}
			}
		}
		if($scope.x_axis_selected == 'age_grouped' || $scope.y_axis_selected == 'age_grouped')
		{
			console.log($scope.age_group_filter);
			if(typeof $scope.age_group_filter !='undefined')
			{
				for(i=0;i<$scope.age_group_filter.length;i++)
				{
					$scope.age_grouped_selected_details.push({"name" : $scope.age_group_filter[i].value});
				}
				if($scope.age_grouped_selected_details.length>0)
				{
					$scope.selected_axis_details++;
				}
				else
				{
					if($scope.x_axis_selected == 'age_grouped')
					{
						$scope.x_axis_error_select_msg 	 = "SELECT AGE GROUP";
						$scope.empty_in_selection = "x_axis";
					}
					if($scope.y_axis_selected == 'age_grouped')
					{
						$scope.y_axis_error_select_msg 	 = "SELECT AGE GROUP";
						$scope.empty_in_selection = "y_axis";
					}
				}
			}
		}
		if($scope.x_axis_selected == 'location' || $scope.y_axis_selected == 'location')
		{
			if(typeof $scope.location_filter !='undefined')
			{
				for(i=0;i<$scope.location_filter.length;i++)
				{
					$scope.location_filter_selected_details.push({"name" : $scope.location_filter[i].cust_location});
				}
				if($scope.location_filter_selected_details.length>0)
				{
					$scope.selected_axis_details++;
				}
				else
				{
					if($scope.x_axis_selected == 'location')
					{
						$scope.x_axis_error_select_msg 	 = "SELECT LOCATION";
						$scope.empty_in_selection = "x_axis";
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.y_axis_error_select_msg 	 = "SELECT LOCATION";
						$scope.empty_in_selection = "y_axis";
					}
				}
			}
			else
			{
				if($scope.x_axis_selected == 'location')
				{
					$scope.x_axis_error_select_msg 	 = "SELECT LOCATION";
					$scope.empty_in_selection = "x_axis";
				}
				if($scope.y_axis_selected == 'location')
				{
					$scope.y_axis_error_select_msg 	 = "SELECT LOCATION";
					$scope.empty_in_selection = "y_axis";
				}
			}
		}
		if($scope.x_axis_selected == 'segment' || $scope.y_axis_selected == 'segment')
		{
			if(typeof $scope.segment_filter !='undefined')
			{
				for(i=0;i<$scope.segment_filter.length;i++)
				{
					$scope.segment_selected_details.push({"name" : $scope.segment_filter[i].cust_segment});
				}
				if($scope.segment_filter.length>0)
				{
					$scope.selected_axis_details++;
				}
				else
				{
					if($scope.x_axis_selected == 'segment')
					{
						$scope.x_axis_error_select_msg 	 = "SELECT SEGMENT";
						$scope.empty_in_selection = "x_axis";
					}
					if($scope.y_axis_selected == 'segment')
					{
						$scope.y_axis_error_select_msg 	 = "SELECT SEGMENT";
						$scope.empty_in_selection = "y_axis";
					}
				}
			}
		}
		if(MyService.compareTwoDate($scope.start_date,$scope.end_date)== 'error')
		{
			$scope.error = "End date must be greater than start date";
			$scope.selected_axis_details = 1;
			return false;
		}
		if($scope.selected_axis_details<2)
		{
			if(typeof $scope.x_axis_selected == 'undefined' || $scope.x_axis_selected == '' || $scope.x_axis_selected == null )
			{
				$scope.error = "Select X-axis option";
				return false;
			}
			if(typeof $scope.y_axis_selected == 'undefined' || $scope.y_axis_selected == '')
			{
				$scope.error = "Select Y-axis option";
				return false;
			}

			var x_axis_det_name = $scope.x_axis_selected.replace("_", " ");
			var y_axis_det_name = $scope.y_axis_selected.replace("_", " ");
			if($scope.empty_in_selection == "x_axis")
			{
				$scope.error = $scope.x_axis_error_select_msg;
				return false;
			}
			else
			{
				$scope.error = $scope.y_axis_error_select_msg;
				return false;
			}
			return false;
		}
		else
		{
			
			$scope.show_loader 		= true;
			$scope.request_details  = {
										"card_type"		: $scope.card_type_selected_details,
										"tags"			: $scope.tag_details_filter,
										"location"		: $scope.location_filter_selected_details,
										"age_grouped"	: $scope.age_grouped_selected_details,
										"segment"		: $scope.segment_selected_details,
										"gender"		: $scope.gender_type_filter,
										"date_range"	:
															{ 
																"from" 	: $scope.start_date,
																"to"	: $scope.end_date
															},
										"x_axis" 		: $scope.x_axis_selected,
										"y_axis" 		: $scope.y_axis_selected,
										"token" 		: localStorage.getItem('token')
									} 

			API.postDetails($scope.request_details,"customer_segment/getCustSegReportData").then(function successCallback(response) {
				$scope.show_loader = false;
				if(response.status == 200)
				{
				//	var message = '';
				    
				    if($scope.y_axis_selected == 'age_grouped')
						{
							var y_head= "Age Group";
                        }
                        else
                        {
						     var y_head =$scope.y_axis_selected.replace("_", " ");
                        
						}
						if($scope.x_axis_selected == 'age_grouped')
						{
							var x_head= "Age Group";
                        }
                        else
                        {
						     var x_head =$scope.x_axis_selected.replace("_", " ");
                        
						}
					var message =  x_head.toUpperCase() +' vs. ' + y_head.toUpperCase() ;
				}
				else
				{
					var message = response.data.response_data.message;
				}
                
				var  category		= response.data.response_data.Graph_data[0].x_axis_name;
				var chart_details 	= response.data.response_data.Graph_data[0].y_array_header;
				if($scope.y_axis_selected == 'age_grouped')
				{
					var y_axis_legend_name = "Age Group"
				}
				else
				{
					var y_axis_legend_name = $scope.y_axis_selected;
				}
				var y_axis_legend_name = y_axis_legend_name.toUpperCase();
				Highcharts.chart('container', {

			        chart: {
			            type: 'column'
			        },

			        title: {
			            text: message
			        },

			        xAxis: {
			            categories : category
			        },

			        yAxis: {
			            allowDecimals: false,
			            min: 0,
			            title: {
			                text: y_axis_legend_name
			            },
			        },
			        tooltip: {
			            formatter: function () {
			                return '<b>' + this.x + '</b><br/>' +
			                    this.series.name + ': ' + this.y + '<br/>' +
			                    'Total: ' + this.point.stackTotal;
			            }
			        },

			        plotOptions: {
			            column: {
			                stacking: 'normal'
			         	}
			        },

			        series: chart_details
			    });
				
			}, function errorCallback(response) {
				$scope.show_loader = false;
			});
		}
	}
	$scope.changeofferSearchStatus = function(val)
	{
		console.log(val);
		if(val == 'change_to_offer_id')
		{
			if($scope.offer_id_details != '' && $scope.offer_id_details != null)
			{
				if(typeof $scope.offer_id_details.offerId != "undefined")
				{
					$scope.offer_id = $scope.offer_id_details.offerId;
					//$scope.show_by_offer = true;
					//$scope.checkboxModel.offer_segment_search_by = "offer_id";
					for(i=0;i<$scope.offer_details.length;i++)
					{
						if($scope.offer_id == $scope.offer_details[i].offerId)
						{
							$scope.offer_name = $scope.offer_details[i].offer_rule_en
						}
					}
				}
			}
		}
		else
		{
			$scope.offer_name = '';
			$scope.offer_id_details = '';
			if(val =='offer_id')
			{
				$scope.show_by_offer = true;
				$scope.offer_id = '';
				if(typeof $scope.offer_details != 'undefined')
				{
					for(i=0;i<$scope.offer_details.length;i++)
					{
						if($scope.offer_id == $scope.offer_details[i].offerId)
						{
							$scope.offer_name = $scope.offer_details[i].offer_rule_en
						}
					}
				}
			}
			else
			{
				$scope.offer_id = '';
				$scope.show_by_offer = false;
			//	$scope.checkboxModel.offer_segment_search_by = "customer_id";
			}

		}
	}
	$scope.getOfferSegmentDetails = function()
	{
		$scope.card_type_selected_details 		= [];
		$scope.segment_selected_details 		= [];
		$scope.age_grouped_selected_details 	= [];
		$scope.location_filter_selected_details = [];
		$scope.category_filter_details_arr		= [];
		$scope.selected_offer_axis_details    	= 0; 
		$scope.offer_name 						= '';
		$scope.error 							= '';
		$scope.x_axis_error_select_msg 			= '';
		$scope.y_axis_error_select_msg 			= '';
		$scope.empty_in_selection 				= '';
		$scope.show_discription 				= false;
		if(typeof $scope.offer_id == 'undefined' || $scope.offer_id == '' || $scope.offer_id == null)
		{
			if($scope.checkboxModel.offer_segment_search_by == 'offer_id')
			{
				$scope.error = 'Please Enter Offer Id.';
			}
			else
			{
				if(typeof $scope.merchant_details == 'undefined' || $scope.merchant_details == '' || $scope.merchant_details == null)
				{
					$scope.error = 'Please Select Merchant';
				}
				else
				{
					$scope.error = 'Please Select Offer Detail';
				}
			}
		}
		else
		{
			if($scope.x_axis_selected == 'card_type' || $scope.y_axis_selected == 'card_type')
			{
				if(typeof $scope.card_type_filter_details != 'undefined')
				{
					for(i=0;i<$scope.card_type_filter_details.length;i++)
					{
						$scope.card_type_selected_details.push({"name" : $scope.card_type_filter_details[i].card_type});
					}
					if($scope.card_type_filter_details.length>0)
					{
						$scope.selected_offer_axis_details++;
					}
					else
					{
						if($scope.x_axis_selected == 'card_type')
						{
							$scope.x_axis_error_select_msg 	 = "SELECT CARD TYPE";
							$scope.empty_in_selection = "x_axis";
						}
						if($scope.y_axis_selected == 'card_type')
						{
							$scope.y_axis_error_select_msg 	 = "SELECT CARD TYPE";
							$scope.empty_in_selection = "y_axis";
						}
					}
				}
			}
			if($scope.x_axis_selected == 'gender' || $scope.y_axis_selected == 'gender')
			{
				if(typeof $scope.gender_type_filter != 'undefined')
				{
					if($scope.gender_type_filter.length>0)
					{
						$scope.selected_offer_axis_details++;
					}
					else
					{
						if($scope.x_axis_selected == 'gender')
						{
							$scope.x_axis_error_select_msg 	 = "SELECT GENDER";
							$scope.empty_in_selection = "x_axis";
						}
						if($scope.y_axis_selected == 'gender')
						{
							$scope.y_axis_error_select_msg 	 = "SELECT GENDER";
							$scope.empty_in_selection = "y_axis";
						}
					}
				}
				else
				{
					if($scope.x_axis_selected == 'gender')
					{
						$scope.x_axis_error_select_msg 	 = "SELECT GENDER";
						$scope.empty_in_selection = "x_axis";
					}
					if($scope.y_axis_selected == 'gender')
					{
						$scope.y_axis_error_select_msg 	 = "SELECT GENDER";
						$scope.empty_in_selection = "y_axis";
					}
				}
			}
			if($scope.x_axis_selected == 'age_grouped' || $scope.y_axis_selected == 'age_grouped')
			{
				if(typeof $scope.age_group_filter != 'undefined')
				{
					for(i=0;i<$scope.age_group_filter.length;i++)
					{
						$scope.age_grouped_selected_details.push({"name" : $scope.age_group_filter[i].value});
					}
					if($scope.age_grouped_selected_details.length>0)
					{
						$scope.selected_offer_axis_details++;
					}
					else
					{
						if($scope.x_axis_selected == 'age_grouped')
						{
							$scope.x_axis_error_select_msg 	 = "SELECT AGE GROUP";
							$scope.empty_in_selection = "x_axis";
						}
						if($scope.y_axis_selected == 'age_grouped')
						{
							$scope.y_axis_error_select_msg 	 = "SELECT AGE GROUP";
							$scope.empty_in_selection = "y_axis";
						}
					}
				}
			}
			if($scope.x_axis_selected == 'location' || $scope.y_axis_selected == 'location')
			{
				if(typeof $scope.location_filter != 'undefined')
				{
					for(i=0;i<$scope.location_filter.length;i++)
					{
						$scope.location_filter_selected_details.push({"name" : $scope.location_filter[i].cust_location});
					}
					if($scope.location_filter_selected_details.length>0)
					{
						$scope.selected_offer_axis_details++;
					}
					else
					{
						if($scope.x_axis_selected == 'location')
						{
							$scope.x_axis_error_select_msg 	 = "SELECT LOCATION";
							$scope.empty_in_selection = "x_axis";
						}
						if($scope.y_axis_selected == 'location')
						{
							$scope.y_axis_error_select_msg 	 = "SELECT LOCATION";
							$scope.empty_in_selection = "y_axis";
						}
					}
				}
				else
				{
					if($scope.x_axis_selected == 'location')
					{
						$scope.x_axis_error_select_msg 	 = "SELECT LOCATION";
						$scope.empty_in_selection = "x_axis";
					}
					if($scope.y_axis_selected == 'location')
					{
						$scope.y_axis_error_select_msg 	 = "SELECT LOCATION";
						$scope.empty_in_selection = "y_axis";
					}
				}
			}
			if($scope.x_axis_selected == 'segment' || $scope.y_axis_selected == 'segment')
			{
				if(typeof $scope.segment_filter != 'undefined')
				{
					for(i=0;i<$scope.segment_filter.length;i++)
					{
						$scope.segment_selected_details.push({"name" : $scope.segment_filter[i].cust_segment});
					}
					if($scope.segment_selected_details.length>0)
					{
						$scope.selected_offer_axis_details++;
					}
					else
					{
						if($scope.x_axis_selected == 'segment')
						{
							$scope.x_axis_error_select_msg 	 = "SELECT SEGMENT";
							$scope.empty_in_selection = "x_axis";
						}
						if($scope.y_axis_selected == 'segment')
						{
							$scope.y_axis_error_select_msg 	 = "SELECT SEGMENT";
							$scope.empty_in_selection = "y_axis";
						}
					}
				}
			}
			if($scope.x_axis_selected == 'tags' || $scope.y_axis_selected == 'tags')
			{
				if(typeof $scope.tag_details_filter != 'undefined')
				{
					if($scope.tag_details_filter.length>0)
					{
						$scope.selected_offer_axis_details++;
					}
					else
					{
						if($scope.x_axis_selected == 'tags')
						{
							$scope.x_axis_error_select_msg 	 = "SELECT TAGS";
							$scope.empty_in_selection = "x_axis";
						}
						if($scope.y_axis_selected == 'tags')
						{
							$scope.y_axis_error_select_msg 	 = "SELECT TAGS";
							$scope.empty_in_selection = "y_axis";
						}
					}
				}
				else
				{
					if($scope.x_axis_selected == 'tags')
					{
						$scope.x_axis_error_select_msg 	 = "SELECT TAGS";
						$scope.empty_in_selection = "x_axis";
					}
					if($scope.y_axis_selected == 'tags')
					{
						$scope.y_axis_error_select_msg 	 = "SELECT TAGS";
						$scope.empty_in_selection = "y_axis";
					}
				}
			}

			if($scope.x_axis_selected == 'category' || $scope.y_axis_selected == 'category')
			{
				if(typeof $scope.category_filter_details != 'undefined')
				{
					for(i=0;i<$scope.category_filter_details.length;i++)
					{
						$scope.category_filter_details_arr.push({"name" : $scope.category_filter_details[i].category});
					}
					if($scope.category_filter_details.length>0)
					{
						$scope.selected_offer_axis_details++;
					}
					else
					{
						if($scope.x_axis_selected == 'category')
						{
							$scope.x_axis_error_select_msg 	 = "SELECT CATEGORY";
							$scope.empty_in_selection = "x_axis";
						}
						if($scope.y_axis_selected == 'category')
						{
							$scope.y_axis_error_select_msg 	 = "SELECT CATEGORY";
							$scope.empty_in_selection = "y_axis";
						}
					}
				}
			}
			if(MyService.compareTwoDate($scope.start_date,$scope.end_date)== 'error')
			{
				$scope.error = "End date must be greater that start date";
				$scope.selected_axis_details = 1;
				return false;
			}
			if($scope.selected_offer_axis_details<2)
			{
				if(typeof $scope.x_axis_selected == 'undefined' || $scope.x_axis_selected == '' || $scope.x_axis_selected == null )
				{
					$scope.error = "Select X-axis option";
					return false;
				}
				if(typeof $scope.y_axis_selected == 'undefined' || $scope.y_axis_selected == '' || $scope.y_axis_selected == null)
				{
					$scope.error = "Select Y-axis option";
					return false;
				}

				var x_axis_det_name = $scope.x_axis_selected.replace("_", " ");
				var y_axis_det_name = $scope.y_axis_selected.replace("_", " ");
				if($scope.empty_in_selection == "x_axis")
				{
					$scope.error = $scope.x_axis_error_select_msg;
					return false;
				}
				else
				{
					$scope.error = $scope.y_axis_error_select_msg;
					return false;
				}
				return false;
			}
			else
			{
				$scope.show_loader 	   = true;
				$scope.request_details = {
											"card_type"		: $scope.card_type_selected_details,
											"tags"			: $scope.tag_details_filter,
											"offer_id"		: $scope.offer_id,
											"location"		: $scope.location_filter_selected_details,
											"age_grouped"	: $scope.age_grouped_selected_details,
											"segment"		: $scope.segment_selected_details,
											"gender"		: $scope.gender_type_filter,
											"category" 		: $scope.category_filter_details_arr,
											"date_range"	:
																{ 
																	"from" 	: $scope.start_date,
																	"to"	: $scope.end_date
																},
											"x_axis" 		: $scope.x_axis_selected,
											"y_axis" 		: $scope.y_axis_selected,
											"token" 		: localStorage.getItem('token')
										} 

				API.postDetails($scope.request_details,"customer_segment/getOfferSegReportData").then(function successCallback(response) {
					$scope.show_loader = false;
					var  category		= response.data.response_data.Graph_data[0].x_axis_name;
					var chart_details 	= response.data.response_data.Graph_data[0].y_array_header;
					$scope.offer_name 	= response.data.response_data.offer_name;
					$scope.show_discription = true;
					if(response.status == 203)
					{
						var message = response.data.response_data.message;
					}
					else
					{
						//var message = ''; 
						if($scope.y_axis_selected == 'age_grouped')
						{
							var y_head= "Age Group";
                        }
                        else
                        {
						     var y_head =$scope.y_axis_selected.replace("_", " ");
                        
						}
						if($scope.x_axis_selected == 'age_grouped')
						{
							var x_head= "Age Group";
                        }
                        else
                        {
						     var x_head =$scope.x_axis_selected.replace("_", " ");
                        
						}
				       
					    var message =  x_head.toUpperCase() +' vs. ' + y_head.toUpperCase() ;
					}
					
					if($scope.y_axis_selected == 'age_grouped')
					{
						var y_axis_legend_name = "Age Group"
					}
					else
					{
						var y_axis_legend_name = $scope.y_axis_selected;
					}
					var y_axis_legend_name = y_axis_legend_name.toUpperCase();
					Highcharts.chart('container', {

				        chart: {
				            type: 'column'
				        },

				        title: {
				            text: message
				        },

				        xAxis: {
				            categories : category
				        },

				        yAxis: {
				            allowDecimals: false,
				            min: 0,
				            title: {
				                text: y_axis_legend_name
				            }
				        },
				        tooltip: {
				            formatter: function () {
				                return '<b>' + this.x + '</b><br/>' +
				                    this.series.name + ': ' + this.y + '<br/>' +
				                    'Total: ' + this.point.stackTotal;
				            }
				        },

				        plotOptions: {
				            column: {
				                stacking: 'normal'
				            }
				        },

				        series: chart_details
				    });
					
				}, function errorCallback(response) {
					$scope.show_loader = false;
				});
			}
		}
	}
	
	$scope.getOfferDetails = function(option,id)
	{
		$scope.show_merchant_loader = true;
		
			$scope.get_offer_details = {
				"token" 		: localStorage.getItem('token'),
				merchant_id 	: $scope.merchant_details.id
			}
			API.postDetails($scope.get_offer_details,"api/getMerchantOffer").then(function successCallback(response) {
				$scope.show_merchant_loader = false;
				$scope.offer_details = response.data.response_data.details;
			}, function errorCallback(response) {
				
			});
		
	}
})

.controller('customer', function($scope,$http,$routeParams,$location,$localStorage)
{
	$scope.show_id   = 0;
	$scope.show_cust = false;;
	$scope.offer_history =[];
	$scope.state =[];
	$scope.states = [];
	var socket = io.connect();
	$scope.cust_id 	= $routeParams.userId;
	$scope.cust_id = $scope.cust_id.substr(1);
	$scope.chat_details =[];

	

	$scope.makeNewConnection = function()
	{
		socket.emit('new user',{type : "customer" , "id" : $scope.cust_id,"csr" : $scope.csr_id},function(data){
			if(!data.status)
			{
				alert(data.message)
			}
			else
			{
				$scope.csr_id = data.csr_id;
				localStorage.setItem('customer_csr_name', JSON.stringify(data.csr_id));
			}
		});
	}
	if(localStorage.getItem('customer_csr_name') != 'undefined' && localStorage.getItem('customer_csr_name') != null)
	{
		$scope.csr_id = JSON.parse(localStorage.getItem('customer_csr_name'));
		$scope.makeNewConnection();
	}
	else
	{
		$scope.csr_id   = 'find_new_csr';
		$scope.makeNewConnection();
	}
	socket.on("make_connection_with_csr",function(data){

		localStorage.setItem('customer_csr_name', JSON.stringify(data));
		$scope.csr_id = data;
		$scope.$apply();
	})
	$scope.sendChatMessageByCustomer = function (){
		if($scope.customer_message != '')
		{
  			socket.emit("send message", {
							  				"sender_id" 		: $scope.cust_id,
							  				"customer_id" 		: $scope.cust_id,
							  				"typeofdata"		: "TX",
							  				"converseby" 		: "CU",
							  				"message" 			: $scope.customer_message,
							  				"chatheaderid" 		: "",
							  				"member_id" 		: "",
							  				"cust_id" 			: $scope.cust_id,
							  				"csr_id" 			: $scope.csr_id
							  			});
  		}
  		$scope.customer_message ='';
	}
	socket.on("new message",function(data){
		console.log(data);
		$scope.chat_details.push(data);
		$scope.$apply();
		$(".messages").scrollTop($(".messages")[0].scrollHeight);
		$scope.addChatIntoLocalstorage($scope.chat_details);
	})
	$scope.addChatIntoLocalstorage = function(data)
	{
		localStorage.setItem('chat_message', JSON.stringify(data));
	}
	if(localStorage.getItem('chat_message') != 'undefined' && localStorage.getItem('chat_message') != null)
	{
		$scope.chat_details = JSON.parse(localStorage.getItem('chat_message'));
	}
	$(".messages").scrollTop($(".messages")[0].scrollHeight);
	$scope.clearTextMessage = function()
	{
		$scope.customer_message = '';
	}
	$scope.logoutCustomer = function()
	{
		localStorage.removeItem("customer_csr_name");
	    localStorage.removeItem("chat_message");
	    $location.url("");
	}
})