(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	var pk = params.pk;
            	$scope.form ={};
            	$scope.form.STATUS="1";
            	$scope.form.FK_SC_COURSE = params.pk;
            	$("#"+controllerName+" .qrcodeLoginImg").attr("src","json/Qrcode_qrcode_data.json?rand="+Math.random()+"&COURSE_PK="+pk);
            	
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
         				$scope.form.STATUS="1";
         				$('#'+controllerName+' .tab_qrcode').addClass("active");
         				
         				$('#'+controllerName+' .signin-qrcode').show();
         				$('#'+controllerName+' .signin-verify').hide();
         			}else{
         				$scope.form.STATUS="1";
         				$('#'+controllerName+' .tab_verify').addClass("active");
         				$('#'+controllerName+' .signin-qrcode').hide();
         				$('#'+controllerName+' .signin-verify').show();
         				$scope.find();
         				
         			}
         			
         		}
            	
            	
            	$scope.find = function() { 
                	//$scope.form.ISOFFLINE =1; 
            		console.log($scope.form);
                  	$httpService.post(config.getTeacherByQRCodeURL,$scope.form).success(function(data) {
                  		console.log(data);
                      	if(data.code == '0000'){
                      		 $scope.dataList = data.data;
                      		 $scope.$apply();
                      		
                      	}
  	                 }).error(function(data) {
  	                 });
	            };

            }
        ];
    });
}).call(this);
