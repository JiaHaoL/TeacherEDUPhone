(function() {
	define([], function() {
		return [
		    '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
	        function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
		        $scope.form = {};
		        $scope.form.SURVEY_QUEST_ID = params.pk;
		        $scope.form.ROLE_CODE = params.code;

		        //问卷名称
        		$httpService.post(config.findQuestionnaireByIdURL, {
        			"SURVEY_QUEST_ID" : params.pk
        		}).success(function(data) {
        			if(data.code == '0000') {
        				$scope.questionnaire = data.data;
            			$scope.$apply();
        			}else{
		        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"获取问卷失败!"});
		        	}
	        	}).error(function(data) {
	        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"获取问卷出错!"});
	        	});
		        
		        //查询所有问卷用户
		        $scope.find = function() {
		        	$scope.form.page = JSON.stringify($scope.page);
		        	$httpService.post(config.findAnonymousAnswerUserListURL,$scope.form).success(function(data) {
		        		if(data.code == '0000') {
			        		$scope.answerInfoList = data.data;
			        		PAGE.buildPage($scope,data);	//处理分页
			        		$scope.$apply();
			        	}else{
			        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"对象采集信息查询失败!"});
			        	}
		        	}).error(function(data) {
		        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"对象采集信息查询出错!"});
		        	});
	        	}
		        
		        $scope.select = function() {
		        	$scope.page.current = 1;
		        	$scope.find();
		        }
			    
		        $("#selectAll").click(function() {
		        	$("input[name='usrPk']:checkbox").each(function(){
		        		$(this).attr("checked",true);
		        	});
		        });

		        //重新加载
            	eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
                  	$scope.find();
	            });
            	
                //返回按钮事件
            	$scope.goBack = function(){ 
             		var m2 = {
             			url:"aps/content/questionnaire/question/welcome/config.json?pk="+params.pk,
         	            contentName:"content",
         	            text:"返回问卷",
         	            icon:"edit"
             		}
                   	eventBusService.publish(controllerName,'appPart.load.content', m2);	
            	}
            	
		        //初始化分布
	            PAGE.iniPage($scope);
		    } 
		];	
	});
}).call(this);