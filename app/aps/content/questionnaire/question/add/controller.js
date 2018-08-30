(function() {
    define(['ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	console.log(controllerName,"loaded");
            	//初始化
            	$scope.form = {};
            	$scope.form.FK_COURSE = params.pk;
            	UE.delEditor('titlename');
                var uetitle = UE.getEditor('titlename');
                
                var setTeacher = function(pk){
                	$scope.form.SURVEY_QUEST_ID = pk;
                	$scope.form.TEACHER_FLAG = '0';
                	$scope.form.WRITE_NUMBER = '1';
                	$httpService.post(config.addCourseTeacher, $scope.form).success(function(data) {
            			if(data.code=="0000"){
            				console.log("success");
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增出错"});	//弹出提示框
                    });
                }
                
                $scope.$watch("anonymous",function(value) {  
                	if(value == 1) {
                		$('.allowTag').show();
                	}else{
                		$('.allowTag').hide();
                		$scope.allowTag = false;
                	}
                });
                
            	//接收保存按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}
            		
            		$scope.form.SURVEY_QUEST_TYPE = $('input[name="qsType"]:checked').val();
            		$scope.form.ANONYMOUS = $('input[name="anonymous"]:checked').val();
            		$scope.form.SURVEY_QUEST_REMARK = uetitle.getContent(); 
            		$scope.form.SURVEY_REMARK_TEXT = uetitle.getPlainTxt();
            		if($scope.allowTag == true) {
            			$scope.form.WRITE_TAG = 1;
            		}else{
            			$scope.form.WRITE_TAG = 0;
            		}
            		console.log($scope.form);//return;
            		$httpService.post(config.addURL, $scope.form).success(function(data) {
                		var m2 = {
            				 url:"aps/content/questionnaire/edit/update/update/config.json?pk="+data.data,
        	                 contentName:"content",
        	                 text:"问卷编辑",
        	                 icon:"edit"
  	              	    }
                		
            			if(data.code=="0000"){
            				setTeacher(data.data);
	            			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增成功"});
	            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"question"});	//刷新范围的数据
	                		
	                        eventBusService.publish(controllerName,'appPart.load.content', m2);
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增出错"});	//弹出提示框
                    });
            		
	            });
            	
            	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            		
            	//初始化表单校验
            	VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
