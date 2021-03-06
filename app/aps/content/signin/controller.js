(function() {
    define([], function() {
        return [
            '$scope','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	 $scope.form ={};
                 
            	 $scope.qrcode = function(obj){
            		 var m2 = {
           				  url:"aps/content/signin/qrcode/config.json?pk="+obj.SC_COURSE_PK,
        	                  contentName:"content",
        	                  hasButton:"right",
        	                  data:{MENU_PK:"none",MENU_NAME:"签到二维码"}
        	                }
                     eventBusService.publish(controllerName,'appPart.load.content', m2);
            		 
            	 }
            	 
            	 /**
            	  * 详情
            	  */
            	 $scope.viewclick = function(obj){
            		 var m2 = {
            				  url:"aps/content/courseView/config.json?pk="+obj.SC_COURSE_PK,
         	                  contentName:"content",
         	                  hasButton:"right",
         	                  data:{MENU_PK:"none",MENU_NAME:"会议详情"}
         	                }
                   		eventBusService.publish(controllerName,'appPart.load.content', m2);
            		 
            	 }


            	var init = function(){
            		$scope.form.FK_RULE="97233b073c49468eafc7852f61458fd0";
            		$scope.form.INCLUDE=0;
            	}
            	init();
            	
             	
            	$scope.find = function() { 
            		$scope.page.number=10;
                	$scope.form.page = JSON.stringify($scope.page);
                	$scope.form.STATUS_MORE="4";
                	$scope.form.QRCODE="1";//根据用户查找
                	$scope.form.INCLUDE_ONLINE="";
              		$scope.form.INCLUDE_OFFLINE="1";
              		$scope.form.MY_COURSE = "1";
           	    	$('#'+controllerName+' .tab_online').addClass("active");
	            		$httpService.post(config.findCourseApplyListURL,$scope.form).success(function(data) {
	                    	if(data.code != '0000'){
	                    		loggingService.info(data.msg);
	                    	}else{
	                    		$scope.dataList = data.data;
			     	            PAGE.buildPage($scope,data);
	                    	}
		     	            
		                 }).error(function(data) {
		                	 console.log("加载我的会议异常");
		                 });
	            };
	            
	            PAGE.iniPage($scope);
            	
            	
            	
            }
        ];
    });
}).call(this);
