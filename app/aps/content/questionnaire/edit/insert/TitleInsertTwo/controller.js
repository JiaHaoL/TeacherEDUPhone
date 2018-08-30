(function() {
    define(['ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	            			
            	//初始化
            	$scope.form = {};
            	$scope.form.SURVEY_TITLE_QUE = true;
         		var content={}; 
            	
            	UE.delEditor('titlename');
                var uetitle = UE.getEditor('titlename');
            	
            	//内容部分
                $scope.contentList = [];
             	
            	//添加   
             	$scope.addContent = function() {
             		uetitle.setContent(uetitle.getContent().substring(3) + '<input type="text" style="border-left: 0;border-right: 0;border-top: 0;border-bottom: 1px solid #000;outline: medium;" readonly />');
               }
          	
               //接收保存按钮事件
               eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {  

            		$scope.form.SURVEY_QUEST_ID=params.pk;
            		$scope.form.SURVEY_TYPE_ID=params.id;

            		$scope.form.SURVEY_TITLE_NAME = uetitle.getContent().replace(/<input type="text" style="border-left: 0;border-right: 0;border-top: 0;border-bottom: 1px solid #000;outline: medium;" readonly=""\/>/g,"_____");
            		var arr = $scope.form.SURVEY_TITLE_NAME.split("_____");
            		for (var i = 0; i < arr.length-1; i++) {
            			$scope.contentList.push(content);
    				}
            		$scope.form.contents=JSON.stringify($scope.contentList);//转json格式           		

            		$httpService.post(config.addURL, $scope.form).success(function(data) {
            			if(data.code=="0000"){
	            			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
	            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"title"});	//刷新范围的数据
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增成功"});	//弹出提示框
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
