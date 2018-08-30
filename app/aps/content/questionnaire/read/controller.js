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
            		
              	    //行标题查询
              	    $httpService.post(config.findHeadingByQnIdURL, {
              		    "SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
              	    }).success(function(data) {   
              		   $scope.headingList = data.data;
              		   $scope.$apply();
      	            });
            		
            		//查询题目选项
                	$httpService.post(config.findOptionListByIdURL,{
                		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	}).success(function(data) {
                		$scope.optionList = data.data;
                		$scope.$apply();
                		$(top.document.body).attr("style","background-color: white");
                		$("#index_footer").attr("style","display:none");
                		$("#one_td").attr("style","display:none");
    	            });	
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
	            
	            $scope.find();
            }
        ];
    });
}).call(this);
