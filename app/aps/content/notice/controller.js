(function() {
    define([], function() {
        return [
            '$scope','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$httpService.css("assets/css/zTreeStyle/zTreeStyle.css");
            	 $scope.form ={};
            	 
            	 /**
            	  * 详情
            	  */
            	 $scope.viewclick = function(obj){
            		 var m2 = {
            				  url:"aps/content/courseView/config.json?pk="+obj,
         	                  contentName:"content",
         	                  hasButton:"right",
         	                  data:{MENU_PK:"none",MENU_NAME:"会议详情"}
         	                }
                   		eventBusService.publish(controllerName,'appPart.load.content', m2);
            		 
            	 }
            	
            	var init = function(){
            		$scope.form.FK_RULE="97233b073c49468eafc7852f61458fd0";
            		//getUserInfo();
            		$scope.form.INCLUDE=0;
            	}
            	init();
            	
             	
            	$httpService.post(config.findCourseListForNoticeURL,$scope.form).success(function(data) {
                	if(data.code != '0000'){
                		loggingService.info(data.msg);
                	}else{
                		$scope.noticeList = data.data;
                		console.log(data.data);
                		$scope.$apply();
                	}
                 }).error(function(data) {
                     console.log("获取听课通知失败！");
                 });
            	

            }
        ];
    });
}).call(this);
