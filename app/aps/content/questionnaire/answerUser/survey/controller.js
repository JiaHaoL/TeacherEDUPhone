(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = params.pk;
            	
        		$('.school').show();
        		$('.grade').hide();
        		$('.classes').hide();
        		
         	    $('input[name="student"]').bind('click', function(){    
       		   		$('input[name="parent"]').attr("checked", false);
         	    });
         	    $('input[name="parent"]').bind('click', function(){    
      		   		$('input[name="student"]').attr("checked", false);
         	    });
                
          		//问卷名称
        		$httpService.post(config.findQuestionnaireByIdURL, {
        			"SURVEY_QUEST_ID" : params.pk
        		}).success(function(data) {
        			$scope.questionnaire = data.data;
        			$scope.$apply();
        		});
        		
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
	           		if($scope.form.FK_UNIT == "" || $scope.form.FK_UNIT==null) {
	           			$('.grade').hide();
		           		$('.classes').hide();
	           		}else{
		           		$('.grade').show();
		           		$('.classes').hide();
	           		}
               		$scope.form.STUDENT_NJID = null;
               		$scope.form.STUDENT_BJID = null;
               		$scope.form.FK_GRADE = null;
               }
                
               //班级
               $scope.getClass = function() {
                	$scope.form.FK_GRADE = $scope.form.STUDENT_NJID;
                	$httpService.post(config.findClassURL, $scope.form).success(function(data) {
                		$scope.classList = data.data;
                        $scope.$apply();
    	            });
                	if($scope.form.STUDENT_NJID=="" || $scope.form.STUDENT_NJID==null) {
                		$('.classes').hide();
                	}else{
                    	$('.classes').show();
                	}
                	$scope.form.STUDENT_BJID = null;
               }
               
               //接收保存按钮事件
               eventBusService.subscribe(controllerName, controllerName+'.issued', function(event, btn) {
            	   if($('input[name="student"]').is(':checked')) {
            		   $scope.form.USER_TYPE = 2;//被评比对象：任课教师  问卷用户：学生
            	   }
            	   
            	   if($('input[name="parent"]').is(':checked')) {
            		   $scope.form.USER_TYPE = 3;//被评比对象：任课教师  问卷用户：家长
            	   }

            	   if($scope.form.FK_UNIT == null || $scope.form.FK_UNIT == "") {
           				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择学校！"});	
           		   }else if($scope.form.USER_TYPE == null || $scope.form.USER_TYPE == "") {
           			    eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择问卷用户！"});	
           		   }else{
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
            	
            	//初始化表单校验
            	VALIDATE.iniValidate($scope);
	            
            }
        ];
    });
}).call(this);
