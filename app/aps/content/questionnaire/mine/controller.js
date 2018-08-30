(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	$scope.form = {};
        		$scope.form.WRITE_NUMBER = '1';
        		var pk = params.pk;
        		$scope.form.SC_COURSE_PK = pk;
        		$scope.form.FK_SC_COURSE = pk;
        		//$scope.form.ROLE_CODE = "1";
        		
        		$httpService.post(config.findUserRoleCodeURL, {}).success(function(data) {
            		if(data.code == '0000') {
            			if(data.data == "0") {
            				//$scope.form.ROLE_CODE = "0";
            			}else{
            				//$scope.form.ROLE_CODE = "1";
            			}
            		}
            	});
        		
            	$scope.find = function() {
            		$scope.flag = '0';
            		$scope.findQsList();
				}
            	
            	$scope.findQsList = function() {
            		$scope.form.page = JSON.stringify($scope.page);
               	 	$httpService.post(config.findURL, $scope.form).success(function(data) {
               	 		$scope.dataList = data.data;
               	 		$scope.num = $scope.dataList.length;
               	 		//按钮宽度，高度
               	 		$scope.btnW = ($('.container').width() - 100 * 2 + 15 * 2) / 2;
               	 		
               	 		//图片宽度，高度
               	 		//$scope.imageW = ($('.container').width() - 100 * 2 - 5 * 20 - 2 * 10) / 6 - 24 - 2;
               	 		//$scope.txtW = $('.container').width() - 85 - 10 * 2;
               	 		
               	 		PAGE.buildPage($scope,data);	//处理分页
               	 		$scope.$apply();
               	 	});
				}
            	
            	//未完成问卷
            	$scope.disFinished = function() {
            		$scope.flag = '0';
            		$scope.form.WRITE_NUMBER = '1';
            		$scope.findQsList();
            	}
            	
            	//已完成问卷
            	$scope.finished = function() {
            		$scope.flag = '1';
            		$scope.form.WRITE_NUMBER = '0';
            		$scope.findQsList();
            	}
           	 	
           	 	$scope.choice = function(obj) {
           	 		if(obj.SURVEY_QUEST_STATE == '2') {
           	 			alert("该问卷调查已结束。");
           	 		}else{
           	 			if(obj.SURVEY_QUEST_TYPE == '1') {
           	 				if(obj.WRITE_NUMBER == '0') {
           	 				window.location.href = "./voteResult/"+obj.SURVEY_QUEST_ID,"_blank";
           	 				}else{
           	 				window.location.href = "./voteChoice/"+obj.SURVEY_QUEST_ID,"_blank";
           	 				}
           	 			}else{
		           	 		if(obj.WRITE_NUMBER == '0') {
		           	 			if(obj.TEACHER_FLAG == '0') {
			     					$httpService.post(config.findEvaluateListByIdSizeURL, {
			     						"SURVEY_QUEST_ID" : obj.SURVEY_QUEST_ID
			     					}).success(function(data) {
			     						if(data.data > 0) {
			     							window.location.href = "./evaluate/"+obj.SURVEY_QUEST_ID,"_blank";
			     						}else{
			     							window.location.href = "./see/"+obj.SURVEY_QUEST_ID,"_blank";
			     						}
			     					});
		           	 			}else{
		           	 			window.location.href = "./evaluate/"+obj.SURVEY_QUEST_ID,"_blank";
		           	 			}
		           	 		}else{
		           	 			if(obj.TEACHER_FLAG == '0') {
			     					$httpService.post(config.findEvaluateListByIdSizeURL, {
			     						"SURVEY_QUEST_ID" : obj.SURVEY_QUEST_ID
			     					}).success(function(data) {
			     						if(data.data > 0) {
			     							window.location.href = "./evaluate/"+obj.SURVEY_QUEST_ID,"_blank";
			     						}else{
			     							window.location.href = "./collect/"+obj.SURVEY_QUEST_ID,"_blank";
			     						}
			     					});
		           	 			}else{
		           	 			window.location.href = "./evaluate/"+obj.SURVEY_QUEST_ID,"_blank";
		           	 			}
		           	 		}
           	 			}
           	 		}
				}
           	 	
	            //初始化分布
	            PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
