(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$scope.form={};
            	$scope.comment={};
                var pk = params.pk;
                $scope.SynopsisVO={};
                eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, m2) {
                	if(m2.scope=="courseDetail"){
                		if(m2.type==1){
                    		$("#div_class_speakcourse").empty();
                    		$("#div_class_speakcourse").append(m2.content);
                    		//$("#div_class_speakcourse").append("<a style=\"cursor:pointer;\" href=\"\" onclick=\"updateSpeakCourse();\"  class=\"add_shuoke\"><span style=\"color:blue;\">修改“说课”</span></a>");
                    		$('#'+controllerName+' .update_shuoke').show();
                    		$('#'+controllerName+' .insert_shuoke').hide();
                    	}
                	}
                });
                
                
                /**
                 * 点击修改说课
                 */
                $scope.updateSpeakCourse = function(){
                	var m2 = {
        	                  url:"aps/content/myCourse/speakCourse/config.json?pk="+pk+"&type=1",
        	                  contentName:"modal",
        	                  text:"修改“说课”",
        	                  icon:"pencil",
        	                  size:"modal-lg"
        	                }
                  	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                }
                
                /**
                 * 点击添加说课
                 */
                $scope.addSpeakCourse = function(){
                	var m2 = {
      	                  url:"aps/content/myCourse/speakCourse/config.json?pk="+pk,
      	                  contentName:"modal",
      	                  text:"添加“说课”",
      	                  icon:"pencil",
      	                  size:"modal-lg"
      	                }
                	eventBusService.publish(controllerName,'appPart.load.modal', m2);
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
                    		if($scope.userInfo.GUID==$scope.dataVO.COURSESPEAKER || $scope.userInfo.GUID== $scope.dataVO.FK_TEACHER){
                    			$scope.action = 1;
                    			if($scope.SynopsisVO != undefined && $scope.SynopsisVO.SYNOPSIS != undefined && $scope.SynopsisVO.SYNOPSIS!="" ){
                            		$('#'+controllerName+' .update_shuoke').show();
                            		$('#'+controllerName+' .insert_shuoke').hide();
                        		}else{
                        			$('#'+controllerName+' .div_class_speakcourse').append("暂无说明");
                        				
                        			$('#'+controllerName+' .insert_shuoke').show();
                        		}
                    			
                    		}else{
                    			$('#'+controllerName+' .add_shuoke').hide();
                    			$('#'+controllerName+' .update_shuoke').hide();
                    			$scope.action = 0;
                    		}
                    		$scope.$apply();
                    	}
                     }).error(function(data) {
                         loggingService.info('获取当前用户出错');
                     });
                };
                
                var livestatus=0;
            	var init = function(){
            		$scope.form.SC_COURSE_PK = pk;
            		$scope.form.FK_SC_COURSE = pk;
            		$httpService.post(config.findCourseApplyListURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.dataVO = data.data[0];
                    		console.log("研修说明");
                    		console.log($scope.dataVO);
                    		if($scope.dataVO.INCLUDE_OFFLINE==1 && $scope.dataVO.INCLUDE_ONLINE==0){
                    			$('#'+controllerName+' .coursedetail_online').hide();
                    			$('#'+controllerName+' .coursedetail_offline').show();
                    		}
                    		
                    		$httpService.post(config.findScCourseSynopsisURL,{FK_SC_COURSE:pk}).success(function(data) {
                            	if(data.code != '0000'){
                            		loggingService.info(data.msg);
                            	}else{
                            		$scope.SynopsisVO = data.data[0];
                            		console.log($scope.SynopsisVO);
                            		getUserInfo();
                            		$scope.$apply();
                            	}
                             }).error(function(data) {
                             });
                    		
                    		$scope.$apply();
                    	}
	                 }).error(function(data) {
                             console.log("加载会议信息出错");
	                 });
            	}
            	init();
            	

            }
        ];
    });
}).call(this);
