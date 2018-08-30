(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = params.pk;
            	$scope.form.SURVEY_SUBJECTTEACHER_ID = params.uuid;
            	$scope.form.FK_USER = params.userPk;
            	$scope.form.USER_TYPE = '2';
            	//查询数据
            	$scope.find = function() {
            		//查询问卷名称
                	$httpService.post(config.findQuestionnaireByIdURL,{
                		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	}).success(function(data) {
                		$scope.questionnaire = data.data;
                		$scope.$apply();
    	            });
                	
             	    //行标题查询
              	    $httpService.post(config.findHeadingByQnIdURL, {
              		    "SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
              	    }).success(function(data) {   
              		    $scope.headingList = data.data;
              		    $scope.$apply();
      	            });
              	    
              	    //行标题和选项 值
              	    $httpService.post(config.findHeadingAndValueListByIdURL, {
              		    "SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID,
                		"SURVEY_SUBJECTTEACHER_ID":$scope.form.SURVEY_SUBJECTTEACHER_ID,
                		"FK_USER":$scope.form.FK_USER
              	    }).success(function(data) {   
              		    $scope.dataList = data.data;
              		    $scope.$apply();
      	            });
                	
            		//查询题目
            		$httpService.post(config.findTitleListByIdURL, $scope.form).success(function(data) {
                		$scope.titleList = data.data;
                        
                		//查询选项
                    	$httpService.post(config.findOptionAndValueListByIdURL,{
                    		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID,
                    		"SURVEY_SUBJECTTEACHER_ID":$scope.form.SURVEY_SUBJECTTEACHER_ID,
                    		"FK_USER":$scope.form.FK_USER
                    	}).success(function(data) {
                    		$scope.optionList = data.data;
                    		
                    		//将选项和值对应
                    		for (var i = 0; i < $scope.titleList.length; i++) {
                    			var titleId = $scope.titleList[i].SURVEY_TITLE_ID;
                    			if($scope.titleList[i].SURVEY_TYPE_ID == 3) {
                    				for (var j = 0; j < $scope.optionList.length; j++) { 
                    					if(titleId === $scope.optionList[j].SURVEY_TITLE_ID){
                    						if($scope.optionList[j].VALS == '(null)') {
                    							$scope.titleList[i].SURVEY_TITLE_NAME = $scope.titleList[i].SURVEY_TITLE_NAME.replace("_____", "<input readonly  class='vacancy' />");
                    						}else{
                    							$scope.titleList[i].SURVEY_TITLE_NAME = $scope.titleList[i].SURVEY_TITLE_NAME.replace("_____", "<input readonly  class='vacancy' value='"+$scope.optionList[j].VALS+"' />");  
                    						}
                    					}
                    				}
                    			}
							}
                    		$scope.$apply();
        	            });
    	            });	
                	
                	if(params.num <= 0) {
                		$('.fm').hide();
                	}else{
                    	$httpService.post(config.findTeacherListByUserPkURL, {
                    		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID,
                    		"FK_USER":$scope.form.FK_USER,
                    		"USER_TYPE":$scope.form.USER_TYPE
                    	}).success(function(data) {
    		        		if(data.code == '0000') {
    			        		$scope.teacherList = data.data;
    			        		$scope.$apply();
    			        	}
                    	});
                	}
             	}  
            	
            	$scope.selectChange = function() {
            		$scope.find();
            	}
            	
                //返回事件	
            	$scope.goBack = function(){ 
             		var m2 = {
					    url:"aps/content/questionnaire/target/student/config.json?pk="+params.pk+"&userPk="+params.userPk,
					    contentName:"content",
					    text:"返回问卷",
					    icon:"edit"
 	                }
                   	eventBusService.publish(controllerName,'appPart.load.content', m2);	
            	}
            	
            	$scope.find();
            	
            }
        ];
    });
}).call(this);
