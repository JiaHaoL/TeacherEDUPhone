(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = params.pk;
            	$scope.form.ROLE_CODE = params.code;
            	$scope.form.USER_TYPE = "1";
        		$('.unit').hide();
        		$('.parent').hide();
        		$('.school').hide();
        		$('.grade').hide();
        		$('.classes').hide();
        		if($scope.form.ROLE_CODE == '0') {
        			$('.unit').show();
        		}
        		
        		/**
        		 * 新建完投票后，自动添加会议人员到投票中
        		 */
        		var addUsers = function(){
        			
        		}
        		
        		
            	$scope.userTypeChange = function() {
            		$scope.form.USER_SN = null;
            		$scope.form.ID_NUMBER = null;

	            	if($scope.form.USER_TYPE == '1') {
	            		if($scope.form.ROLE_CODE == '0') {
	            			$('.unit').show();
	            		}
	            		$('.parent').hide();
	            		$('.school').hide();
	            		$('.grade').hide();
	            		$('.classes').hide();
                		$scope.form.FK_UNIT=null;
                		$scope.form.PARENT_NAME = null;
                		$scope.form.STUDENT_NJID=null;
                		$scope.form.STUDENT_BJID=null;
                		$scope.form.FK_GRADE = null;
	            	}
	            	if($scope.form.USER_TYPE == '2') {
	            		$('.unit').hide();
	            		$('.parent').hide();
	            		$('.school').show();
	            		$('.grade').show();
	            		$('.classes').show();
                		$scope.form.TEACHER_GZDWPK=null;
                		$scope.form.PARENT_NAME = null;
                		$scope.form.FK_GRADE = null;
                		$scope.form.STUDENT_BJID=null;
                		$scope.form.STUDENT_NJID=null;
	            	}
	            	if($scope.form.USER_TYPE == '3') {
	            		$('.unit').hide();
	            		$('.school').show();
	            		$('.parent').show();
	            		$('.grade').show();
	            		$('.classes').show();
                		$scope.form.TEACHER_GZDWPK=null;
                		$scope.form.FK_GRADE = null;
                		$scope.form.STUDENT_BJID=null;
                		$scope.form.STUDENT_NJID=null;
	            	}
	            	
	            	$scope.find();
            	}
        		
            	//学校
            	$httpService.post(config.findAllUnit, {"ROLE_CODE":params.code}).success(function(data) {
        			$scope.units = data.data;
        			$scope.$apply();
	            });
            
            	//年级
                $scope.getGrade = function() {
	           		$httpService.post(config.findGradeBySchoolIDURL, {
	           			SCHOOL_PK:$scope.form.FK_UNIT
	           		}).success(function(data) {
	               		$scope.gradeData = data.data;
	                    $scope.$apply();
	   	            });
            		$scope.form.FK_GRADE = null;
            		$scope.form.STUDENT_BJID=null;
            		$scope.form.STUDENT_NJID=null;
                }
                 
                //班级
                $scope.getClass = function() {
                	$scope.form.FK_GRADE = $scope.form.STUDENT_NJID;
                	$httpService.post(config.findClassURL, $scope.form).success(function(data) {
                		$scope.classList = data.data;
                        $scope.$apply();
    	            });
                	$scope.form.STUDENT_BJID=null;
                }

	       	    $scope.find = function() {
	    			$scope.form.page = JSON.stringify($scope.page);
	    			$httpService.post(config.findURL, $scope.form).success(function(data) {
	    				if(data.code == '0000') {
	    					$scope.userList = data.data;
	    					PAGE.buildPage($scope,data);
	    					$scope.$apply();
	    				}
	    			});
	       	    }
	       	    
	       	    //查询
                $scope.select = function() {
             	   $scope.page.current = 1;
             	   $scope.find();
                }
               
                //接收保存按钮事件
                eventBusService.subscribe(controllerName, controllerName+'.confirm', function(event, btn) {
                	var values = [];
                	$('input[name="dataPk"]:checked').each(function(){ 
                		values.push($(this).val());
                	});
                	
                	$scope.form.USER_PK_LIST = JSON.stringify(values);
                	if(values.length <= 0) {
           				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择要操作的记录。"});	
                	}else{
                		console.log($scope.form);
                		if(confirm("确认添加!")) {
	            			$httpService.post(config.addURL, $scope.form).success(function(data) {
		            			if(data.code=="0000"){
			            			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
			            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});	//刷新范围的数据
			                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存成功"});	//弹出提示框
		            			}else{
		            				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存失败"});
		            			}
		    	            }).error(function(data) {
		    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存出错"});	//弹出提示框
		                    });
                		}
                	}
	            });
            	
            	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.cancel', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });

		        //初始化分布
	            PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
