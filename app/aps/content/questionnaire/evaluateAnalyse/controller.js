(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = params.pk;
            	
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
	               		$scope.form.STUDENT_NJID = null;
	               		$scope.form.STUDENT_BJID = null;
	             		$scope.form.FK_GRADE = null;
	             		$scope.getTeachers();
	   	            });
               }
                
               //班级
               $scope.getClass = function() {
                	$scope.form.FK_GRADE = $scope.form.STUDENT_NJID;
                	$httpService.post(config.findClassURL, $scope.form).success(function(data) {
                		$scope.classList = data.data;
                    	$scope.form.STUDENT_BJID = null;
                        $scope.$apply();
    	            });
               }
               
               //评测教师
               $scope.getTeachers = function() {
            	   $httpService.post(config.findTeacherListByClassPkURL, $scope.form).success(function(data) {
	               		$scope.teacherList = data.data;
	               		$scope.form.FK_TEACHER = null;
	                    $scope.$apply();
            	   });
               }
               
            	//查询数据
            	$scope.find = function() { 
            		//问卷名称查询
            	  	$httpService.post(config.findQuestionnaireByIdURL,{
            	  		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
            	  	}).success(function(data) {
                		$scope.questionnaire = data.data;
                		$scope.$apply();
    	            });
            	  	
            		//题目查询
            		$httpService.post(config.findTitleListByTeacherPkURL, $scope.form).success(function(data) {
                		$scope.titleList = data.data;
                		$scope.$apply();//强制刷新
    	            });	
            		
              	    //行标题查询
              	    $httpService.post(config.findHeadingByQnIdURL, {
              		    "SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
              	    }).success(function(data) {   
              		    $scope.headingList = data.data;
              		    $scope.$apply();
      	            });
              	    
              	    //统计 行标题和选项 值
              	    $httpService.post(config.findHeadingAndValueListByIdURL, $scope.form).success(function(data) {   
              		    $scope.dataList = data.data;
              		    $scope.$apply();
      	            });
            		
            		//选项查询
                	$httpService.post(config.findOptionListByTeacherPkURL,$scope.form).success(function(data) {
                		$scope.optionList = data.data;
                		$scope.$apply();
    	            });
            	}
            	
            	//浏览填空详情
            	$scope.details=function(obj){
            		if(obj.OPTION_NUM > 0) {
                		var m2={
            				url:"aps/content/questionnaire/evaluateAnalyse/details/config.json?titleId="+
            					obj.SURVEY_TITLE_ID+"&pk="+params.pk+"&optionId="+obj.SURVEY_CONTENT_ID+
            					"&teacherPk="+$scope.form.FK_TEACHER,
            				contentName:"modal",
            				text:"填空题详情",
            				size:"modal-lg",
            				icon:"file"
                		}
                		eventBusService.publish(controllerName,'appPart.load.modal',m2);
            		}else{
     	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"当前还没有人填写。"});	
            		}
            	}
            	
               	//浏览主观题详情
            	$scope.detailsSubjective=function(obj){
            		if(obj.OPTION_NUM > 0) {
                		var m2={
            				url:"aps/content/questionnaire/evaluateAnalyse/detailsSubjective/config.json?titleId="+
            				obj.SURVEY_TITLE_ID+"&pk="+params.pk+"&optionId="+obj.SURVEY_CONTENT_ID+
            				"&teacherPk="+$scope.form.FK_TEACHER,
            				contentName:"modal",
            				text:"主观题详情",
            				size:"modal-lg",
            				icon:"file"
                		}
                		eventBusService.publish(controllerName,'appPart.load.modal',m2);
            		}else{
     	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"当前还没有人填写。"});	
            		}
            	}
            	
                //返回事件	
            	$scope.goBack=function(){ 
             		var m2 = {
	     				  url:"aps/content/questionnaire/question/welcome/config.json?pk="+params.pk,
	 	                  contentName:"content",
	 	                  text:"返回问卷",
	 	                  icon:"edit"
         	        }
                   	eventBusService.publish(controllerName,'appPart.load.content', m2);	
            	}
            	
            	//接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	          
	            $scope.select = function() {
	            	$scope.find();
	            }
	           
	            $scope.find();
            }
        ];
    });
}).call(this);
