(function() {
	define([], function() {
		return [
		    '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
		    function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
		    	$scope.form = {};
		    	$scope.form.SURVEY_QUEST_ID = $routeParams.pk;
		    	
		    	$scope.find = function() {
//		    		$scope.form.page = JSON.stringify($scope.page);
//            		$httpService.post(config.findURL, $scope.form).success(function(data) {
//                		$scope.dataList = data.data;	
//                        PAGE.buildPage($scope,data);	//处理分页
//                        $scope.$apply();//强制刷新
//    	            });
            		
    		    	$httpService.post(config.findQuestionnaireByIdURL, {
    		    		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
    		    	}).success(function(data) {
    		    		$scope.qsInfo = data.data;
    		    		$scope.$apply();
    		    	});
    		    	
            		$httpService.post(config.findTitleListByIdURL, {
            			"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
            		}).success(function(data) {
                		$scope.titleList = data.data;
                		$scope.$apply();//强制刷新
    	            });	
            		
                	$httpService.post(config.findOptionListByIdURL,{
                		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	}).success(function(data) {
                		$scope.dataList = data.data;
                		$scope.$apply();
    	            });	
		    	}
	            
	            //初始化
	            $scope.find();
	            $(top.document.body).attr("style","background-color: white");
         		$("#index_footer").attr("style","display:none");
         		$("#one_td").attr("style","display:none");
		    	
		    }
		];
	});
}).call(this);