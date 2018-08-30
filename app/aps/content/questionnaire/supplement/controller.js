(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = params.pk;
            	$scope.form.ROLE_CODE = params.code;

	       	    $scope.find = function() {
	    			$httpService.post(config.findURL, $scope.form).success(function(data) {
	    				if(data.code == '0000') {
	    					$scope.userList = data.data;
	    					$scope.$apply();
	    				}
	    			});
	       	    }
	       	    
	       	    //查询
                $scope.select = function() {
             	   $scope.find();
                }
               
                //接收保存按钮事件
                eventBusService.subscribe(controllerName, controllerName+'.confirm', function(event, btn) {
                	var values = [];
                	$('input[name="dataPk"]:checked').each(function(){ 
                		values.push($(this).val());
                	});

                	$scope.form.USER_PK_LIST = JSON.stringify(values);
                	if(values.length <= 0) {
           				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择要操作的记录。"});	
                	}else{
                		console.log($scope.form);
                		if(confirm("确认发布!")) {
	            			$httpService.post(config.sendWxURL, $scope.form).success(function(data) {
		            			if(data.code=="0000"){
			            			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
			            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});	//刷新范围的数据
			                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布成功"});	//弹出提示框
		            			}else{
		            				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布失败"});
		            			}
		    	            }).error(function(data) {
		    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布出错"});	//弹出提示框
		                    });
                		}
                	}
	            });
            	
            	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.cancel', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            	
	       	    $scope.find();
            }
        ];
    });
}).call(this);
