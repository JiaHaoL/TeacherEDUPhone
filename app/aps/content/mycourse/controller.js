(function() {
    define([], function() {
        return [
            '$scope','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$httpService.css("assets/css/zTreeStyle/zTreeStyle.css");
            	 $scope.form ={};
            	 
            	 
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
            	  * 结课/解课
            	  */
            	 $scope.closeCourse = function(status,obj){
            		 $httpService.post(config.scCourseStatusUpdateURL,{
            			 STATUS:status,
            			 SC_COURSE_PK:obj
            		 }).success(function(data) {
                     		$scope.find();
                     });
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
            	 /**
            	 * 得到当前用户信息
            	 */
                var getUserInfo = function(){
                	$httpService.post(config.getUserInfoURL,{}).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.userInfo = data.data;
                    		PAGE.iniPage($scope);
                    	}
                     }).error(function(data) {
                         loggingService.info('获取当前用户出错');
                     });
                };
            	
            	
            	
            	var init = function(){
            		$scope.form.FK_RULE="97233b073c49468eafc7852f61458fd0";
            		getUserInfo();
            		$scope.form.INCLUDE=0;
            	}
            	init();
            	
             	
            	$scope.find = function() { 
            		$scope.page.number=10;
                	$scope.form.page = JSON.stringify($scope.page);
                	$scope.form.STATUS_MORE="4";
                	$scope.form.MY_COURSE="1";//根据用户查找

	            		$httpService.post(config.findCourseApplyListURL,$scope.form).success(function(data) {
	                    	if(data.code != '0000'){
	                    		loggingService.info(data.msg);
	                    	}else{
	                    		$scope.dataList = data.data;
	                    		for(var i=0;i<$scope.dataList.length;i++){
	                    			var obj = $scope.dataList[i];
	                    			 if(obj.INCLUDE_OFFLINE==1 && obj.FK_TEACHER == $scope.userInfo.GUID){
	                    				 $scope.dataList[i].qiandao =1;
	                    			 }
	                    		}
	                    		console.log(data);
			     	            PAGE.buildPage($scope,data);
	                    	}
		     	            
		                 }).error(function(data) {
		                	 console.log("加载我的会议异常");
		                 });
	            };
	            
	            
            	
            	
            	
            }
        ];
    });
}).call(this);
