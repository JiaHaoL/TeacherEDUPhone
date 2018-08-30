(function() {
	define([], function() {
		return [
		    '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
	        function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
		        $scope.form = {};
		        $scope.form.SURVEY_QUEST_ID = params.pk;
		        $scope.form.ROLE_CODE = params.code;
	        	
		        var targetTab = "collect";

		        //去掉家长学生
		        $scope.form.SURVEY_TYPE = "1";
		        
		        if(params.state == 1 || params.state == 2) {
		        	$('#addCollectBtn').hide();
		        	$('#addSurveyBtn').hide();
		        	$('#addAppraisalBtn').hide();
		        }
		        if(params.state == 0 || params.state == 2){
		        	$('#addSupplementBtn').hide();
		        	$('#addSupplementWxBtn').hide();	
		        }
		        //问卷名称
        		$httpService.post(config.findQuestionnaireByIdURL, {
        			"SURVEY_QUEST_ID" : params.pk
        		}).success(function(data) {
        			if(data.code == '0000') {
        				$scope.questionnaire = data.data;
        				if($scope.questionnaire.SURVEY_QUEST_TYPE == '1') {
        		        	$('#addSurveyBtn').hide();
        		        	$('#addAppraisalBtn').hide();
        				}
            			$scope.$apply();
        			}else{
		        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"获取问卷失败!"});
		        	}
	        	}).error(function(data) {
	        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"获取问卷出错!"});
	        	});
		        
		        $scope.find = function() {
		        	if(targetTab == "collect") {
		        		findCollectTarget();
		        	}
		        	
		        	if(targetTab == "survey") {
		        		findSurveyTarget();
		        	}
		        }
		        
		        //查询所有问卷用户
		        var findCollectTarget = function() {
		        	$scope.form.page = JSON.stringify($scope.page);
		        	$httpService.post(config.findAnswerUserListURL,$scope.form).success(function(data) {
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
	        	
		        //查询所有评比对象
	        	var findSurveyTarget = function() {
	        		$scope.form.page = JSON.stringify($scope.page);
		        	$httpService.post(config.findSubjectTeacherListURL,$scope.form).success(function(data) {
		        		if(data.code == '0000') {
			        		$scope.dataList = data.data;
			        		PAGE.buildPage($scope,data);	//处理分页
			        		$scope.$apply();
			        	}else{
			        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"对象调查信息查询失败!"});
			        	}
		        	}).error(function(data) {
		        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"对象调查信息查询出错!"});
		        	});
	        	}
		        
		        $scope.select = function() {
		        	$scope.page.current = 1;
		        	$scope.find();
		        }

			    //切换标签页
		        $scope.checkTargetInfo = function(id) {
		        	targetTab = id;
		        	$scope.form.USER_SN = "";
		        	$scope.form.SURVEY_TYPE = "";
		        	
		        	if(id == "survey") {
		        		$scope.form.USER_PK_LIST = null;
		        	}
		        	
		        	if(id == "collect") {
		        		$scope.form.PK_LIST = null;
		        	}
		        	
		        	$('#targetTabContent > div').hide();
		        	$('#targetTab > li').removeClass('active');
		        	
		        	$('#'+id).show();
		        	$('#targetTab .'+id).addClass('active');
		        	
		        	$scope.select();        
		        }
		        
		        //删除
		        $scope.remove = function() {
		        	if(targetTab == "survey") {
		        		removeSurveyTarget();
		        	}
		        	
		        	if(targetTab == "collect") {
		        		removeCollectTarget();
		        	}
				}
		        
		        $("#selectAll").click(function() {
		        	$("input[name='usrPk']:checkbox").each(function(){
		        		$(this).attr("checked",true);
		        	});
		        });
		        
		        //删除问卷用户
		        var removeCollectTarget = function() {
		        	var values = [];
	            	$('input[name="usrPk"]:checked').each(function(){ 
	            		values.push($(this).val());
	            	});
	            	
	            	$scope.form.USER_PK_LIST = JSON.stringify(values);
	            	if(values.length < 1){
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"请选择你要操作的记录。"});
	            	}else{
	            		console.log($scope.form);
			        	if(confirm("是否确认删除已选中对象!")){
							$httpService.post(config.removeCollectTargetURL, $scope.form).success(function(data) {
								if(data.code == '0000') {
									eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"删除成功!"});
									eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});	//刷新范围的数据
								}else{
									eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"删除失败!"});
								}	
							}).error(function(data) {
								eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"删除出错!"});
							});
			        	}
		        	}
            	}
		        
		        //删除评比对象
		        var removeSurveyTarget = function() {
		        	var values = [];
	            	$('input[name="dataPk"]:checked').each(function(){ 
	            		values.push($(this).val());
	            	});
	            	
	            	$scope.form.PK_LIST = JSON.stringify(values);
	            	if(values.length < 1){
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"请选择你要操作的记录。"});
	            	}else{
			        	if(confirm("是否确认删除已选中对象!")){
							$httpService.post(config.removeSurveyTargetURL, $scope.form).success(function(data) {
								if(data.code == '0000') {
									eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"删除成功!"});
									eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});	//刷新范围的数据
								}else{
									eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"删除失败!"});
								}	
							}).error(function(data) {
								eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"删除出错!"});
							});
			        	}
	            	}
				}
		        
		        //添加对象
		        $scope.addAppraisalUser = function() {	
		        	if($scope.answerInfoList.length < 1) {
		        		eventBusService.publish(controllerName,'appPart.load.modal.alert',{"title":"操作提示","content":"请先添加答卷用户!"});
		        	}else{
			        	var m2 = {
			        			url:"aps/content/questionnaire/answerUser/add/config.json?pk="+$scope.form.SURVEY_QUEST_ID+"&code="+params.code,
			        	    	contentName:"modal",
			        	    	size: "modal-lg",
				      	        text:"添加问卷评比对象",
				      	        icon:"plus"	
			        	}
			        	eventBusService.publish(controllerName,'appPart.load.modal', m2);
		        	}
		        }
		        
		        //添加问卷评比对象
		        $scope.addSurveyTarget = function() {
		        	var m2 = {
		        			url:"aps/content/questionnaire/answerUser/survey/config.json?pk="+$scope.form.SURVEY_QUEST_ID+"&code="+params.code,
		        	    	contentName:"modal",
			      	        text:"添加问卷评比对象",
			      	        icon:"plus"	
			        }
			        eventBusService.publish(controllerName,'appPart.load.modal', m2);
		        }
		        
		        //添加问卷用户
		        $scope.addCollectTarget= function() {
		        	var m2 = {
		        			url:"aps/content/questionnaire/answerUser/collect/config.json?pk="+$scope.form.SURVEY_QUEST_ID+"&code="+params.code,
		        	    	contentName:"modal",
			      	        text:"添加答卷用户",
			      	        icon:"plus"	
			        }
			        eventBusService.publish(controllerName,'appPart.load.modal', m2);
		        }
		        
		        //补发微信通知
		        $scope.addSupplementWx = function() {
		        	var m2 = {
		        			url:"aps/content/questionnaire/supplement/config.json?pk="+$scope.form.SURVEY_QUEST_ID+"&code="+params.code,
		        	    	contentName:"modal",
		        	    	size:"modal-lg",
			      	        text:"补发微信通知",
			      	        icon:"plus"	
			        }
			        eventBusService.publish(controllerName,'appPart.load.modal', m2);
		        }
		        
		        //补入填写用户
		        $scope.addSupplementUser = function() {
		        	var m2 = {
		        			url:"aps/content/questionnaire/supplement/add/config.json?pk="+$scope.form.SURVEY_QUEST_ID+"&code="+params.code,
		        	    	contentName:"modal",
		        	    	size:"modal-lg",
			      	        text:"添加答卷用户",
			      	        icon:"plus"	
			        }
			        eventBusService.publish(controllerName,'appPart.load.modal', m2);
		        }
		       
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
            	
            	//链接跳转
            	$scope.link = function(obj) {
            		$scope.form.page = "";
            		$scope.form.SURVEY_TYPE = ""; 
            		$scope.form.TEACHER_FLAG = obj.TEACHER_FLAG;
        			console.log(obj);
            		$httpService.post(config.findSubjectTeacherListURL,$scope.form).success(function(data) {
		        		if(data.code == '0000') {
			        		if(data.data == null || data.data.length < 1) {
			            		//普通问卷
			            		window.open("./collect/"+obj.SURVEY_QUEST_ID,"_blank");
			        		}else{
			            		//评测问卷
			            		window.open("./survey/"+obj.SURVEY_QUEST_ID,"_blank");
			        		}
			        	}
		        	});
            	}
		        
		        //初始化分布
	            PAGE.iniPage($scope);
		    } 
		];	
	});
}).call(this);