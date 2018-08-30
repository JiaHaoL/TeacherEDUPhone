(function() {
    define(['highchartsMore'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {

            	 $(top.document.body).attr("style","background-color: white");
         		$("#index_footer").attr("style","display:none");
         		$("#one_td").attr("style","display:none");
            	
            }
        ];
    });
}).call(this);
