(function() {
    define([], function() {
        return [   
              '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
             function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService){	
                //查询数据
            	$scope.titles={};
            	$scope.form={};
            	
            	$scope.find = function() { 
            		//题目查询
            		$scope.titles.SURVEY_TITLE_ID=params.titleId;
            		$scope.titles.SURVEY_QUEST_ID=params.pk;
            		
            		$httpService.post(config.findTitleByIdURL, $scope.titles).success(function(data) {
                		$scope.titleList = data.data;
                		$scope.$apply();//强制刷新
    	            });	
            		
            		//选项查询 
            		$scope.form.SURVEY_CONTENT_ID = params.optionId; 
            		$scope.form.page = JSON.stringify($scope.page);
                	$httpService.post(config.findSynthByOptionIdURL,$scope.form).success(function(data) {
                		$scope.optionList = data.data;
                		PAGE.buildPage($scope,data);	//处理分页
                		$scope.$apply();
    	            });
            	}
            	
            	//查看答卷
            	$scope.value=function(){
            		var m2 = {
         				  url:"aps/content/questionnaire/viewAnswer/answerqueue/config.json?pk="+params.pk,
     	                  contentName:"content",
     	                  text:"返回问卷",
     	                  icon:"edit"
         	        }
                   	eventBusService.publish(controllerName,'appPart.load.content', m2);	
            		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            	}
            	
            	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            	
                //接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });

	            //初始化分页分布            
	            PAGE.iniPage($scope);
            }  
        ];
    });
}).call(this);
