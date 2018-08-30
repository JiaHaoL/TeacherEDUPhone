(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = params.pk;
            	
            	//查询数据
            	$scope.find = function() { 
            		//问卷名称查询
            	  	$httpService.post(config.findQuestionnaireByIdURL,$scope.form).success(function(data) {
                		$scope.questionnaire = data.data;
                		$scope.$apply();
    	            });
            	  	
            		//题目查询
            		$httpService.post(config.findTitleListByIdURL, $scope.form).success(function(data) {
                		$scope.titleList = data.data;
                		$scope.$apply();//强制刷新
    	            });	
            		
              	    //行标题查询
              	    $httpService.post(config.findHeadingByQnIdURL, $scope.form).success(function(data) {   
              		    $scope.headingList = data.data;
              		    $scope.$apply();
      	            });
              	    
              	    //统计 行标题和选项 值
              	    $httpService.post(config.findHeadingAndValueListByIdURL, $scope.form).success(function(data) {   
              		    $scope.dataList = data.data;
              		    $scope.$apply();
      	            });
            		
            		//选项查询
                	$httpService.post(config.findOptionListByIdURL,$scope.form).success(function(data) {
                		$scope.optionList = data.data;
                		$scope.$apply();
    	            });
            	}
            	
            	//浏览填空详情
            	$scope.details=function(obj){
            		var m2={
        				url:"aps/content/questionnaire/analysis/details/config.json?titleId="+obj.SURVEY_TITLE_ID+"&pk="+params.pk+"&optionId="+obj.SURVEY_CONTENT_ID,
        				contentName:"modal",
        				text:"填空题详情",
        				size:"modal-lg",
        				icon:"file"
            		}
            		eventBusService.publish(controllerName,'appPart.load.modal',m2);
            	}
            	
               	//浏览主观题详情
            	$scope.detailsSubjective=function(obj){
            		var m2={
        				url:"aps/content/questionnaire/analysis/detailsSubjective/config.json?titleId="+obj.SURVEY_TITLE_ID+"&pk="+params.pk+"&optionId="+obj.SURVEY_CONTENT_ID,
        				contentName:"modal",
        				text:"主观题详情",
        				size:"modal-lg",
        				icon:"file"
            		}
            		eventBusService.publish(controllerName,'appPart.load.modal',m2);
            	}
            	
                //返回事件	
            	$scope.goBack=function(){ 
             		/*var m2 = {
	     				  url:"aps/content/questionnaire/question/welcome/config.json?pk="+params.pk,
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
            	
            	//接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	            
	            $scope.find();
            }
        ];
    });
}).call(this);
