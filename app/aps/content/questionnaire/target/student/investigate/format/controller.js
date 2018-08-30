(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
		        $scope.form.SURVEY_QUEST_ID = params.pk;
		        
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

		        $scope.find = function() {
		        	$scope.form.page = JSON.stringify($scope.page);
		        	$httpService.post(config.findTeacherListByClassIdURL,$scope.form).success(function(data) {
		        		if(data.code == '0000') {
			        		$scope.dataList = data.data;
			        		PAGE.buildPage($scope,data);	//处理分页
			        		$scope.$apply();
			        	}else{
			        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"查询用户答题信息失败!"});
			        	}
		        	}).error(function(data) {
		        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"查询用户答题信息出错!"});
		        	});
		        }
		        
		        //填写问卷
		        $scope.write = function() {
		        	var values = [];
                	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                		values.push($(this).val());
                	});
                	
                	if(values.length < 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
                	}else if(values.length > 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时修改多行数据，请选择一条数据。"});
                	}else{
                		
                		//已填写问卷不能再填写
            			if($("#dataPk"+values[0]+"_num").val() == 1){
            				eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"您已填写过该问卷！"});
            				return;
            			}
            			
			        	var m2 = {
			        		url : "aps/content/questionnaire/target/investigate/write/config.json?pk="+params.pk+"&uuid="+values[0],
			        		contentName : "content",
			        		text : "填写问卷信息",
			        		icon : "plus"
			        	}
			        	eventBusService.publish(controllerName,'appPart.load.content', m2);
                	}
		        }
		        
		        //查看问卷
		        $scope.inspect = function() {
		        	var values = [];
                	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                		values.push($(this).val());
                	});
                	
                	if(values.length < 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
                	}else if(values.length > 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时修改多行数据，请选择一条数据。"});
                	}else{
                		if($("#dataPk"+values[0]+"_num").val() == 0){
            				eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"您还未填写该问卷！"});
            				return;
            			}
                		
			        	var m2 = {
			        		url : "aps/content/questionnaire/target/investigate/read/config.json?pk="+params.pk+"&uuid="+values[0],
			        		contentName : "content",
			        		text : "查看问卷信息",
			        		icon : "file"
				        }
				        eventBusService.publish(controllerName,'appPart.load.content', m2);
                	}
		        }
		        
		        //修改问卷
		        $scope.edit = function() {
		        	var values = [];
                	$('#'+controllerName+' input[name="dataPk"]:checked').each(function(){ 
                		values.push($(this).val());
                	});
                	
                	if(values.length < 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择一条数据。"});
                	}else if(values.length > 1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不能同时修改多行数据，请选择一条数据。"});
                	}else{
                		if($("#dataPk"+values[0]+"_num").val() == 0){
            				eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"您还未填写该问卷,不能修改！"});
            				return;
            			}
                		
			        	var m2 = {
			        		url : "aps/content/questionnaire/target/investigate/update/config.json?pk="+params.pk+"&uuid="+values[0],
			        		contentName : "content",
			        		text : "修改问卷信息",
			        		icon : "file"
				        }
				        eventBusService.publish(controllerName,'appPart.load.content', m2);
                	}
		        }
            	
            	//删除
//            	$scope.removeAll = function() {
//            		if(confirm("是否确认全部删除!")){
//						$httpService.post(config.removeAllURL, {
//							"SURVEY_QUEST_ID" : params.pk
//						}).success(function(data) {
//							if(data.code == '0000') {
//								eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"全部删除成功!"});
//								eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});	//刷新范围的数据
//								$scope.$apply();
//							}else{
//								eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"全部删除失败!"});
//							}	
//						}).error(function(data) {
//							eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"全部删除出错!"});
//						});
//		        	}
//            	}
            	
            	//提交按钮事件
            	$scope.submitAnswer = function() {
            		console.log($scope.dataList);
            		for (var i = 0; i < $scope.dataList.length; i++) {
            			if($scope.dataList[i].NUM < 1) {
            				eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"您还有问卷未填写,不能提交!"});
            				return;
            			}
					}
            		
            		$httpService.post(config.addURL, {
            			"SURVEY_QUEST_ID" : params.pk
            		}).success(function(data) {
						if(data.code == '0000') {
							eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});	//刷新范围的数据
							eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"提交成功!"});
				        	var m2 = {
					        		url : "aps/content/questionnaire/target/config.json?pk="+params.pk,
					        		contentName : "content",
						    }
						    eventBusService.publish(controllerName,'appPart.load.content', m2);
						}else{
							eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"提交失败!"});
						}
					}).error(function() {
						eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"提交出错!"});
					});
            	}
            	
                //返回按钮事件
            	$scope.goBack = function() { 
             		var m2 = {
             			url:"aps/content/questionnaire/target/config.json?pk="+params.pk,
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
		        
		        //初始化分布
	            PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
             