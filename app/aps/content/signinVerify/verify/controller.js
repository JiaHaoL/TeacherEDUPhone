(function() {
    define([], function() {
        return [
            '$scope','httpService','config', 'params','eventBusService','controllerName','loggingService', function($scope,$httpService,config, params,eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	 $scope.form ={};
            	 $scope.form.STATUS="1";
         		 $scope.form.FK_SC_COURSE = params.pk;
         		 var url = config.getTeacherByQRCodeURL;
         		 
         		 
         		/**
             	 * 确认签到
             	 */
             	$scope.signinClick = function(obj){
                 	$httpService.post(config.scCourseTeacherUpdateURL,{
                 		SC_COURSE_TEACHER_PK:obj.SC_COURSE_TEACHER_PK,
                 		STATUS:"2"
                 	}).success(function(data) {
                     	if(data.code != '0000'){
                     		loggingService.info(data.msg);
                     	}else{
                     		$scope.find();
                     	}
                     });
                 	$httpService.post(config.scCourseTeacherQRCodeUpdateURL,{
                		FK_COURSE:obj.FK_SC_COURSE,
                		FK_TEACHER:obj.FK_TEACHER,
                		STATUS:"2"
                	}).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.find();
                    	}
                    });
                 }
         		 
         		 
         		 
         		$scope.tabClick = function(obj){
         			$('#'+controllerName+' .onlineTab').removeClass("active");
         			if(obj==0){
         				url = config.getTeacherByQRCodeURL;
         				$scope.form.STATUS="1";
         				$('#'+controllerName+' .tab_verify').addClass("active");
         			}else if(obj == 1){
         				url = config.getTeacherByCourseURL;
         				$scope.form.STATUS="2";
         				$('#'+controllerName+' .tab_off').addClass("active");
         			}else if(obj == 2){
         				url = config.getNoTeacherByCourseURL;
         				$scope.form.STATUS="2";
         				$('#'+controllerName+' .tab_on').addClass("active");
         			}
         			$scope.find();
         		}
         		
            	$scope.find = function() { 
            		console.log(url);
                	$scope.form.page = JSON.stringify($scope.page);
                	$scope.form.ISOFFLINE =1; 
                	//$scope.form.ISNOTQJ = "1";
                  	$httpService.post(url,$scope.form).success(function(data) {
                      	if(data.code == '0000'){
                      		 $scope.dataList = data.data;
                      		 PAGE.buildPage($scope,data);
                      		 if($scope.form.STATUS=="2"){
                      			$('#'+controllerName+' .verif-btn').hide();
                         		$scope.$apply();
                      		 }
                      		 
                      		
                      	}
  	                 }).error(function(data) {
  	                 });
	            };
	            $scope.tabClick(1);
	            PAGE.iniPage($scope);
            	
            	
            	
            }
        ];
    });
}).call(this);
