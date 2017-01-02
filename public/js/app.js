angular.module('project', ['ngRoute','homeController','userController','adminController','offerController','CustomerReportController','ngStorage',
                          'angularUtils.directives.dirPagination','localytics.directives','ngMap','gm','720kb.datepicker','angularBingMaps'])
 
 /*
 all constant used in angular js front end
*/
.constant('APPLICATION_CONSTANT', {
    default_offer_id          : 22,
    user_role                 : [{
                                  "name" : "ADMIN",
                                  "value" : "Admin"
                                },
                                {
                                  "name" : "CSR",
                                  "value" : "CSR"
                                }],
    user_status               :  [{
                                  "name" : "Active",
                                  "value" : "Y"
                                },
                                {
                                  "name" : "IN-ACTIVE",
                                  "value" : "N"
                                }],
    default_user_type         : "CSR",
    admin_section             : "ADMIN SECTION",
    offer_segment_view        : "OFFER SEGMENT VIEW",
    member_segment_view       : "MEMBER SEGMENT VIEW",
    offer_display_view        : "OFFER DISPLAY VIEW",
    merchant_display_view     : "MERCHANT DISPLAY VIEW"
})

.config(function($routeProvider) {
 
  $routeProvider
    .when('/', {
      controller:'home',
      templateUrl:'templates/home.html',
    })
    .otherwise({
      redirectTo:'/'
    });
})
.run(function($rootScope,$location){
  $rootScope.logout_user = function(){

    // call an api and send all message to server

    localStorage.removeItem("last_login");
    localStorage.removeItem("user_type");
    localStorage.removeItem("csr_name");
    localStorage.removeItem("char_message");
    localStorage.removeItem("user_details");
    localStorage.removeItem("csr_id");
    localStorage.removeItem("customer_csr_name");
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    $location.url("");
  }

  $rootScope.authenticateUser = function()
  {
    if(typeof localStorage.getItem("token") == 'undefined' || localStorage.getItem("token") == null || localStorage.getItem("token") == '')
    {
      alert("Please login again.");
      $location.url("");
    }
  }
  $rootScope.selected_page_pagination = '20';
  $rootScope.page_per_pagination = [
                  {name:'5 per page', value: '5'}, 
                  {name:'10 per page', value: '10'}, 
                  {name:'20 per page', value: '20'}, 
                  {name:'50 per page', value: '50'}, 
                  {name:'100 per page', value: '100'},     
              ];
})
.directive('googleplace', function() {
  console.log(" am here");
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                rankBy: google.maps.places.RankBy.DISTANCE,
                radius : 250,
                componentRestrictions: {country: 'in'}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                  console.log(element.val());
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
})
.directive('pageHeader', function () {
    return {
         templateUrl: "templates/include/header.html"
    };
})
.factory('Excel',function($window){
    var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
    return {
        tableToExcel:function(tableId,worksheetName){
            var table=$(tableId),
                ctx={worksheet:worksheetName,table:table.html()},
                href=uri+base64(format(template,ctx));
            return href;
        }
    };
})
.factory('MyService', function() {
  
  var factory = {}; 

  factory.compareTwoDate = function(from,to) {
     var fromDate = new Date(from);
     var toDate   = new Date(to);
      if(fromDate>toDate)
      {
        return "error"
      }
      else
      {
        return "success"
      }
    }
  return factory;
});