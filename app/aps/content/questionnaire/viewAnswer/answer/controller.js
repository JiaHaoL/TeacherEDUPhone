(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = params.pk;
            	$scope.form.SURVEY_SUBJECTTEACHER_ID = params.uuid;
            	$scope.form.FK_USER = params.userPk;
            	$scope.form.TEACHER_NAME = params.teacherName;
            
            	//查询数据
            	$scope.find = function() {
                	if($scope.form.SURVEY_SUBJECTTEACHER_ID == "SUBJECTTEACHER4180A1127B7A681E0") {
                		$('.evaluate').hide();
                	}
                	
            		//查询问卷名称
                	$httpService.post(config.findQuestionnaireByIdURL,{
                		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	}).success(function(data) {
                		$scope.questionnaire = data.data;
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
                    							$scope.titleList[i].SURVEY_TITLE_NAME = $scope.titleList[i].SURVEY_TITLE_NAME.replace("_____", "<input readonly class='vacancy' value='"+$scope.optionList[j].VALS+"' />");  
                    						}
                    					}
                    				}
                    			}
							}
                    		$scope.$apply();
        	            });
    	            });	
             	}  
            	
            	$scope.selectChange = function() {
            		$scope.find();
            	}
            	
                //返回事件	
            	$scope.goBack = function(){ 
             		/*var m2 = {
					    url:"aps/content/questionnaire/viewAnswer/answerqueue/config.json?pk="+params.pk,
					    contentName:"content",
					    text:"返回问卷",
					    icon:"edit"
 	                }
                   	eventBusService.publish(controllerName,'appPart.load.content', m2);	*/
            		var pk = sessionStorage.getItem('FK_COURSE');
            		var text = sessionStorage.getItem('COURSE_NAME');
             		var data = {};
             		data.MENU_PK = "none";
                    var m2 = {
                    		"url":"aps/content/myCourse/courseDetail/config.json?pk="+pk+"&text="+text,
        	                 "contentName":"content",
        	                 "hasButton":"none",
        	                 "data":data
        	            }   
  	                eventBusService.publish(controllerName,'appPart.load.content', m2);
            	}
            	
            	$scope.find();
            	
			   //初始化分布
//	           PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
