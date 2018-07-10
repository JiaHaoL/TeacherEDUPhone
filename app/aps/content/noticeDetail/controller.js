(function() {
    define([], function() {
        return [
            '$scope','httpService','config','$routeParams','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,$routeParams,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$scope.form={};
                var pk = $routeParams.pk;
                $("body").attr("class","");
                $scope.tabclick=function(obj){
                	if(obj==0){
                		$('#'+controllerName+' .div_fields').show();
                		$('#'+controllerName+' .div_join_teacher').hide();
                		$('#'+controllerName+' .tab_base').addClass("active");
            			$('#'+controllerName+' .tab_jointeacher').removeClass("active");
                	}else{
                		getTeacherByCourse();
            			$('#'+controllerName+' .div_fields').hide();
            			$('#'+controllerName+' .div_join_teacher').show();
            			if($scope.dataVO.INCLUDE_ONLINE==1){
                			$('#'+controllerName+' .tr_appointTeacher_online').show();
                		}
                		if($scope.dataVO.INCLUDE_OFFLINE==1){
                			$('#'+controllerName+' .tr_appointTeacher_offline').show();
                		}
                		$('#'+controllerName+' .tab_jointeacher').addClass("active");
            			$('#'+controllerName+' .tab_base').removeClass("active");
                	}
                }
                
              //接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
                
            	
            	$scope.openTeacherEDUPhone = function(){
            		window.location = "http://hygl.pdedu.sh.cn";
            	}
            	
            	
            	
            	/**
            	 * 加载已经选定的教师
            	 */
            	 var getTeacherByCourse = function(){
            		$scope.form.FK_SC_COURSE=pk;
                 	$httpService.post(config.getTeacherByCourseURL,$scope.form).success(function(data) {
                     	if(data.code == '0000'){
                     		 $scope.dataList = data.data;
                     		 $scope.$apply();   
                     	}
 	                 }).error(function(data) {
 	                 });
                 }
            	
            	 getTeacherByCourse();
            	
            	var init = function(){
            		$scope.form.SC_COURSE_PK = $routeParams.pk;
            		$httpService.post(config.loadObjURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.dataVO = data.data;
                    		//console.log($scope.dataVO);
                    		if($scope.dataVO.INCLUDE_ONLINE==1){
                    			$('#'+controllerName+' .div_online').show();
                    		}
                    		if($scope.dataVO.INCLUDE_OFFLINE==1){
                    			$('#'+controllerName+' .div_offline').show();
                    		}
                    		if($scope.dataVO.COURSELEVEL==3 && $scope.dataVO.STATUS>0){
                    			$('#'+controllerName+' .view_check').show();
                    			$('#'+controllerName+' .viewschool').hide();
                    		}
                    		else if($scope.dataVO.COURSELEVEL<3 && $scope.dataVO.STATUS>0){
                    		  $('#'+controllerName+' .viewschool').show();
                    		}else if($scope.dataVO.COURSELEVEL<3 && $scope.dataVO.STATUS==0){
                    			$('#'+controllerName+' .tab_jointeacher').hide();
                    		}
                    		if($scope.dataVO.INCLUDE_LIVE!=1){
    	    					$('#'+controllerName+' .class_time').hide();
    	    				}
                    		var GRADEB = $scope.dataVO.GRADEB;
                    		if(GRADEB != undefined){
                    			var GRADEB_TEXT ="";
                        		var str =GRADEB.split(",");
                        		for(var i=0;i<str.length;i++){
                        			if(str[i]==1){
                        				GRADEB_TEXT=GRADEB_TEXT+"幼儿园,"
                        			}else if(str[i]==2){
                        				GRADEB_TEXT=GRADEB_TEXT+"小学,"
                        			}else if(str[i]==3){
                        				GRADEB_TEXT=GRADEB_TEXT+"初中,"
                        			}else{
                        				GRADEB_TEXT=GRADEB_TEXT+"高中,"
                        			}
                        		}
                        	    $scope.dataVO.GRADEB_TEXT = GRADEB_TEXT.substring(0,GRADEB_TEXT.length-1);
                    		}
                    		$scope.$apply();
                    	}
	                 }).error(function(data) {
	                	 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"加载数据异常"});	//弹出提示框
	                 });
            	}
            	init();
            	
            }
        ];
    });
}).call(this);
