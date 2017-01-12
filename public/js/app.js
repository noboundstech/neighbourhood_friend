angular.module('project', ['ngRoute','homeController','userController','adminController','offerController','CustomerReportController'
                          ])
 
 /*
 all constant used in angular js front end
*/
.constant('APPLICATION_CONSTANT', {
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
    $location.url("");
  }

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
})
.filter('trustedAudioUrl', function($sce) {
    return function(path, audioFile) {
        return $sce.trustAsResourceUrl(path + audioFile);
    };
})
.directive('schrollBottom', function () {
  
  return {

    scope: {
      schrollBottom: "="
    },
    /*
    link: function (scope, element) {
      scope.$watchCollection('schrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
    */
  }
  
})