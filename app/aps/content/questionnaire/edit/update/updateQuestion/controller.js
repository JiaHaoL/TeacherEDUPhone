(function() {
    define(['ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	
            	//初始化
            	$scope.form = {};
            	UE.delEditor('titlename');
                var uetitle = UE.getEditor('titlename');   
                
            	$scope.find=function(){
            		$httpService.post(config.findQuestionnaireByIdURL, {
            			"SURVEY_QUEST_ID":params.pk
            		}).success(function(data) {
                		$scope.form = data.data; 
                		if($scope.form.WRITE_TAG == 1) {
                			$scope.form.WRITE_TAG = true;
                		}else{
                			$scope.form.WRITE_TAG = false;
                		}
            		    uetitle.ready(function(){
            		    	uetitle.setContent($scope.form.SURVEY_QUEST_REMARK);   	 
            		    });
                		$scope.$apply();//强制刷新
    	            });
            	}
            	
            	$scope.$watch("form.ANONYMOUS",function(value) {  
                	if(value == 1) {
                		$('.allowTag').show();
                	}else{
                		$('.allowTag').hide();
                		$scope.form.WRITE_TAG = 0;
                	}
                });
            	
            	//接收保存按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}

            		$scope.form.SURVEY_QUEST_REMARK = uetitle.getContent(); 
            		$scope.form.SURVEY_REMARK_TEXT = uetitle.getPlainTxt();
            		
            		$scope.form.SURVEY_QUEST_REMARK = uetitle.getContent();
            		$scope.form.SURVEY_REMARK_TEXT = uetitle.getPlainTxt();
            		if($scope.form.WRITE_TAG == true) {
            			$scope.form.WRITE_TAG = 1;
            		}else{
            			$scope.form.WRITE_TAG = 0;
            		}
            		$httpService.post(config.QuestionnaireUpdateURL, $scope.form).success(function(data) {
            			if(data.code=="0000"){
	            			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
	            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});	//刷新范围的数据
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改成功"});	//弹出提示框
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改出错"});	//弹出提示框
                    });          		
	            });
            	
            	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            	
            	$scope.find();
            	//初始化表单校验
            	VALIDATE.iniValidate($scope);
            }	
        ];
    });
}).call(this);
