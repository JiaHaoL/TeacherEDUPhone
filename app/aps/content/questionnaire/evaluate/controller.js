(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
		        $scope.form.SURVEY_QUEST_ID = $routeParams.qn;
		        
		        //问卷名称
        		$httpService.post(config.findQuestionnaireByIdURL, {
        			"SURVEY_QUEST_ID" : $scope.form.SURVEY_QUEST_ID
        		}).success(function(data) {
        			if(data.code == '0000') {
        				$scope.questionnaire = data.data;
            			$scope.$apply();
        			}else{
		        		alert("获取问卷失败!");
		        	}
	        	}).error(function(data) {
	        		alert("获取问卷出错!");
	        	});

		        $scope.find = function() {
		        	$scope.form.page = JSON.stringify($scope.page);
		        	$httpService.post(config.findEvaluateListURL,$scope.form).success(function(data) {
		        		if(data.code == '0000') {
		        			$scope.dataList = data.data;
		        			PAGE.buildPage($scope,data);	//处理分页
		        			$scope.$apply();
		        		}
		        	}).error(function(data) {
		        		alert("查找评比人员信息出错!");
		        	});
		        }
		        
		        //填写问卷
		        $scope.write = function(obj) {
	        		//已填写问卷不能再填写
	    			if(obj.NUM >= 1){
	    				alert("您已填写过该问卷!");
	    				return;
	    			}
	    			
	    			window.location.href = "./write/"+obj.SURVEY_SUBJECTTEACHER_ID+"/"+obj.SURVEY_QUEST_ID+"/"+obj.FK_USER;
		        }
		        
		        //查看问卷
		        $scope.inspect = function(obj) {
            		if(obj.NUM < 1){
            			alert("您还未填写该问卷!");
        				return;
        			}
            		
            		window.location.href = "./read/"+obj.SURVEY_SUBJECTTEACHER_ID+"/"+obj.SURVEY_QUEST_ID+"/"+obj.FK_USER;
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
             