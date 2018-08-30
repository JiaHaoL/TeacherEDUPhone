/*! thunder SVN
 * Author: fet
 * Description: fet
 * Date: 2014-02-17 */
(function(angular) {
        var app = angular.module('app', ['ngRoute','commonDirectives']);
        
        app.filter('trustHtml', function ($sce) {
            return function (input) {
                return $sce.trustAsHtml(input);
            }
        });
        
        app.controller('LoginController', function($scope, $route, $routeParams, $location) {
       	 	$scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;
        });
        
        app.controller('MainController', function($scope, $route, $routeParams, $location) {
       	 	$scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;
            $("body").css("background-color","#fff");
        });
       
        app.controller('WxController', function($scope, $route, $routeParams, $location) {
       	 	$scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;
            
            $("body").css("background-color","rgb(50,53,66)");
        	$("body").css("overflow","hidden");
        	
        });
        
       app.config(function($routeProvider, $locationProvider) {
    	   $routeProvider
    	    .when('/', {
               templateUrl: 'html/main.html',
               controller: 'MainController'
             })
             .when('/data/tktz/:pk', {
               templateUrl: 'html/tktz.html',
               controller: 'MainController'
             })
             .when('/collect/:qn',{
   	   			templateUrl: 'html/collect.html',
                controller: 'MainController'
   	   	 	 })
   	   	 	 .when('/voteResult/:pk', {
            	templateUrl:'html/voteResult.html',
            	controller:'MainController'
            })
            .when('/voteChoice/:pk', {
            	templateUrl:'html/voteChoice.html',
            	controller:'MainController'
            })
            .when('/evaluate/:qn', {
               templateUrl: 'html/evaluate.html',
               controller: 'MainController'
             })
             .when('/see/:qn',{
	   			templateUrl: 'html/see.html',
                controller: 'MainController'
   	   	 	 })
           .otherwise({
               redirectTo: '/'
           });
         // configure html5 to get links working on jsfiddle
         $locationProvider.html5Mode(true);
       });

       app.run(function ($rootScope, $log){
    	   $log.debug("app.js loaded");
       })
       
})(window.angular);