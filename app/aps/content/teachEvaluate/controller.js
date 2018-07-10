(function() {
    define([], function() {
        return [
                '$scope','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config, eventBusService,controllerName,loggingService) {
                	loggingService.info(controllerName,"loaded");
                	 $scope.form ={};
            
            	 /**
            	  *评分
            	  */
            	 $scope.scoreClick = function(obj){
         		    var m2 = {
         				  url:"aps/content/teachEvaluate/score/config.json?pk="+obj.SC_COURSE_PK+"&subjectpk="+obj.FK_SUBJECT,
      	                  contentName:"content",
      	                  hasButton:"right",
      	                  data:{MENU_PK:"none",MENU_NAME:obj.TITLE}
      	                }
                		eventBusService.publish(controllerName,'appPart.load.content', m2);
             	 } 
            	 $scope.onlineTabclick = function(obj){
                 	   $('#'+controllerName+' .onlineTab').removeClass("active");
                 	    if(obj == 0){
                 	    	$scope.form.COURSELEVEL="";
                 	    	$('#'+controllerName+' .tab_online').addClass("active");
                 	    }else if(obj==1){
                 	    	$scope.form.COURSELEVEL="1";
                 	    	$('#'+controllerName+' .tab_online').addClass("active");
                 	    }else if(obj==2){
                 	    	$scope.form.COURSELEVEL="2";
                 	    	$('#'+controllerName+' .tab_offline').addClass("active");
                 	    }else if(obj==3){
                 	    	$scope.form.COURSELEVEL="3";
                 	    	$('#'+controllerName+' .tab_all').addClass("active");
                 	    }
                 	    $scope.find();
                 	    $scope.$apply();  
                 	    }	
            	 
            	 
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
            	
            	 $scope.find = function(){
            		 
            		$scope.form.page = JSON.stringify($scope.page);
                 	$scope.form.STATUS_MORE="4";
                 	
            		 $httpService.post(config.TeachEvaluateListURL,$scope.form).success(function(data) {
                     	if(data.code != '0000'){
                     		loggingService.info(data.msg);
                     	}else{
                     		$scope.dataList = data.data;
                     		PAGE.buildPage($scope,data);
                     	}
                      }).error(function(data) {
                          loggingService.info('获取评分会议出错');
                      });
            	 }
            	 
            	 
            }
        ];
    });
}).call(this);
