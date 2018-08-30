(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = $routeParams.pk;
            	
            	//查询数据
            	$scope.find = function() { 
            		//查询问卷名称
            		$httpService.post(config.findQuestionnaireByIdURL,{
            			"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
            		}).success(function(data) {
                		$scope.questionnaire = data.data;
                		$scope.$apply();
    	            });
            		
            		//题目查询
            		$httpService.post(config.findTitleListByIdURL, $scope.form).success(function(data) {
                		$scope.titleList = data.data;
                		$scope.$apply();//强制刷新
    	            });	
            		
            		//查询题目选项
                	$httpService.post(config.findOptionListByIdURL,{
                		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	}).success(function(data) {
                		$scope.optionList = data.data;
                		console.log($scope.optionList);
                		$scope.$apply();
    	            });	
            	}   
            	
            	//ul间隔宽度
       	 		$scope.paddingWidth = ($('.index_top').width() - 174 * 5 - 15 * 2) / 10;
            	
       	 		//视频详情
       	 		$scope.videoDetails = function(obj) {
					window.location.href = "./videoDetails/"+obj.EXPAND_INFO_PK+"?qsPk="+$routeParams.pk;
				} 
            	
                //接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	            
	            $scope.find();
	            
	            $(top.document.body).attr("style","background-color: white");
        		$("#index_footer").attr("style","display:none");
        		$("#one_td").attr("style","display:none");
            }
        ];
    });
}).call(this);
