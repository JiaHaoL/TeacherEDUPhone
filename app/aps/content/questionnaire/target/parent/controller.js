(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.FK_USER = params.userPk;
            	
            	var targetTab = "evaluate";
            	
		        $scope.find = function() {
		        	if(targetTab == "common") {
		        		findCommonQuestionnaire();
		        	}
		        	
		        	if(targetTab == "evaluate") {
		        		findEvaluateQuestionnaire();
		        	}
		        }
		        
            	//查询普通问卷
            	var findCommonQuestionnaire = function() {
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findParQnListByUserPkURL, $scope.form).success(function(data) {
            			if(data.code == '0000') {
            				$scope.dataList = data.data;	
            				PAGE.buildPage($scope,data);	//处理分页
            				$scope.$apply();
            			}
            		});
            	}
            	
            	//查询评测问卷
            	var findEvaluateQuestionnaire = function() {
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findParQnListByClassPkURL, $scope.form).success(function(data) {
            			if(data.code == '0000') {
            				$scope.dataList = data.data;
            				PAGE.buildPage($scope,data);	//处理分页
            				$scope.$apply();
            			}
            		});
            	}
            	
            	$scope.select = function() {
		        	$scope.page.current = 1;
		        	$scope.find();
		        }
            	
            	//切换标签页
		        $scope.checkTargetInfo = function(id) {
		        	targetTab = id;
		        	$scope.form.QUESTIONNAIRE_NAME = "";
		        	
		        	$('#questionnaireTabContent > div').hide();
		        	$('#questionnaireTab > li').removeClass('active');
		        	
		        	$('#'+id).show();
		        	$('#questionnaireTab .'+id).addClass('active');
		        	
		        	$scope.dataList = "";
		        	$scope.find();
		        }
		        
		        //填写问卷
		        $scope.write = function(obj) {
		        	if(targetTab == "common") {
		        		if(obj.ANSWER_STATUS == '0') {
	    		        	var m2 = {
    			        		url : "aps/content/questionnaire/target/parent/collection/write/config.json?pk="+obj.SURVEY_QUEST_ID+"&userPk="+params.userPk,
    			        		contentName : "content",
    			        		text : "填写问卷",
    			        		icon : "plus"
	        			    }
	        			    eventBusService.publish(controllerName,'appPart.load.content', m2);
			        	}else{
							eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"您已填写过该问卷！"});
			        	}
		        	}
		        	
		        	if(targetTab == "evaluate") {
		        		if(obj.ANSWER_STATUS == '0') {
	    		        	var m2 = {
    			        		url : "aps/content/questionnaire/target/parent/investigate/write/config.json?pk="+obj.SURVEY_QUEST_ID+
    			        			"&uuid="+obj.SURVEY_SUBJECTTEACHER_ID+"&teacherName="+obj.TEACHER_NAME+"&userPk="+params.userPk,
    			        		contentName : "content",
    			        		text : "填写问卷",
    			        		icon : "plus"
	        			    }
	        			    eventBusService.publish(controllerName,'appPart.load.content', m2);
			        	}else{
							eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"您已填写过该问卷！"});
			        	}
		        	}
		        }
		        
		        //查看问卷
		        $scope.inspect = function(obj) {
		        	if(targetTab == "common") {
			        	if(obj.ANSWER_STATUS > 0) {
			        		var m2 = {
				        		url : "aps/content/questionnaire/target/parent/collection/read/config.json?pk="+obj.SURVEY_QUEST_ID+"&userPk="+params.userPk,
				        		contentName : "content",
				        		text : "查看问卷",
				        		icon : "file"
			    			}
			        		eventBusService.publish(controllerName,'appPart.load.content', m2);
			        	}else{
							eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"您还未填写该问卷！"});
			        	}
		        	}
		        	
		        	if(targetTab == "evaluate") {
			        	if(obj.ANSWER_STATUS == '1') {
			        		var m2 = {
				        		url : "aps/content/questionnaire/target/parent/investigate/read/config.json?pk="+obj.SURVEY_QUEST_ID+"&uuid="+obj.SURVEY_SUBJECTTEACHER_ID+"&userPk="+params.userPk,
				        		contentName : "content",
				        		text : "查看问卷",
				        		icon : "file"
			    			}
			        		eventBusService.publish(controllerName,'appPart.load.content', m2);
			        	}else{
							eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"您还未填写该问卷！"});
			        	}
		        	}
		        }
		        
		        //接收刷新事件
			    eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
				    $scope.find();
			    });
            	
            	//初始化分布
            	PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
