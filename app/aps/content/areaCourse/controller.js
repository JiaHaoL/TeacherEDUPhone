(function() {
    define([], function() {
        return [
            '$scope','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	 $scope.form ={};
            	
            	 /**
            	  * 进入
            	  */
            	 $scope.enterIntoClick = function(obj){
            		    var m2 = {
            				  url:"aps/content/courseDetail/config.json?pk="+obj.SC_COURSE_PK,
         	                  contentName:"content",
         	                  hasButton:"right",
         	                  data:{MENU_PK:"none",MENU_NAME:"会议内容"}
         	                }
                   		eventBusService.publish(controllerName,'appPart.load.content', m2);
            	 }
            	 
            	 
            	 /**
            	  * 切片评课
            	  */
            	 $scope.videoPoint = function(obj){
            		 var m2 = {
              				  url:"aps/content/courseDetail/video/config.json?pk="+obj.SC_COURSE_PK+"&action=0&treeid="+obj.FK_RES_SUBJECT_SORT,
           	                  contentName:"content",
           	                  hasButton:"right",
           	                  data:{MENU_PK:"none",MENU_NAME:"切片评课"}
           	                }
                       eventBusService.publish(controllerName,'appPart.load.content', m2);
            	 };
            	 
            	 
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
            	 
            	 $scope.onlineTabclick = function(obj){
               	   $('#'+controllerName+' .onlineTab').removeClass("active");
               	    if(obj==1){
               	    	$scope.form.INCLUDE_ONLINE="1";
                  		$scope.form.INCLUDE_OFFLINE="";
               	    	$('#'+controllerName+' .tab_online').addClass("active");
               	    	$scope.appPartSrc = config.onlineURL;
               	    }else if(obj==2){
               	    	$scope.form.INCLUDE_ONLINE="";
                  		$scope.form.INCLUDE_OFFLINE="1";
               	    	$('#'+controllerName+' .tab_offline').addClass("active");
               	    }else{
               	    	$scope.form.INCLUDE_ONLINE="";
                  		$scope.form.INCLUDE_OFFLINE="";
               	    	$('#'+controllerName+' .tab_all').addClass("active");
               	    }
               	    $scope.find();
               	    $scope.$apply();
                  }


            	
             	/**
            	 * 
            	 */
                var getUserRole = function(){
            		 $httpService.post(config.findRoleByUserPkURL,{FK_ROLE_IDS:"'1c23f9912e7647b7b3017d57f8997752','1a371612e43742aab4c54a9802666f7a'"}).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.form.AREA_COURSE="1";
                    		if(data.data.length>0){
                    			$scope.form.AREA_COURSE="";
                    		}
                    		PAGE.iniPage($scope);
                    	}
                     }).error(function(data) {
                     });
                };
             	
             	
             	
            	var init = function(){
            		$scope.form.FK_RULE="97233b073c49468eafc7852f61458fd0";
            		$scope.form.INCLUDE=0;
            		getUserRole();
            	}
            	init();
            	 
            	$scope.find = function() { 
                	$scope.form.page = JSON.stringify($scope.page);
                	$scope.form.STATUS_MORE="4";
                	
	            		$httpService.post(config.findCourseApplyListURL,$scope.form).success(function(data) {
	                    	if(data.code != '0000'){
	                    		loggingService.info(data.msg);
	                    	}else{
	                    		$scope.dataList = data.data;
			     	            PAGE.buildPage($scope,data);
	                    	}
		     	            
		                 }).error(function(data) {
		                     loggingService.info('获取区级会议出错');
		                 });
	            };
	            
	            
            	
            	
            	
            }
        ];
    });
}).call(this);
