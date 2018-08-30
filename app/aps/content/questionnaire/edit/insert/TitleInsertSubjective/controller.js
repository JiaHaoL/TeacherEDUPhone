(function() {
    define(['ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	 console.log(controllerName,"loaded");
            	            			
            	 //初始化
            	 $scope.form = {};
            	 $scope.form.SURVEY_TITLE_QUE = true;
            	 
            	 UE.delEditor('titlename');
            	 var uetitle = UE.getEditor('titlename');
             	 var editorIsDel = false;
                 //创建编辑器
                 $scope.showEditor = function() {
                	$('#titlename').show();
                	editorIsDel = true;
                	$('.txtFiled').attr("style","display:none");
                	$('.pictxt').hide();
                	$('.txt').show();
                	uetitle.ready(function() { 
                		uetitle.setContent($('.txtFiled textarea').val().replace(/\n/g,"<br/>"),false);	
              		});
                 }
                
                 //删除编辑器
                 $scope.hideEditor = function() {
                 	console.log(uetitle.getContent());
                	$('#titlename').hide();
                	editorIsDel = false;
                	$('.txtFiled').attr("style","display:block");
                	$('.pictxt').show();
                	$('.txt').hide();
                	$('.txtFiled textarea').val(uetitle.getPlainTxt());
				 }
                
            	 //内容部分
            	 $scope.contents = [];
            	 var content = {};            	
             	 $scope.contents.push(content);            	
             	
	             //接收保存按钮事件
	             eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {   

	            		if(!editorIsDel) {
	            			uetitle.setContent($('.txtFiled textarea').val().replace(/\n/g,"<br/>"),false);
	            		}
	            		
	            		$scope.form.SURVEY_QUEST_ID=params.pk;
	            		$scope.form.SURVEY_TYPE_ID=params.id;

	            		$scope.form.SURVEY_TITLE_NAME=uetitle.getContent();   //获取富文本框里面的值
	            		$scope.form.SURVEY_TITLE_TXT = uetitle.getPlainTxt();
	            		$scope.form.contents=JSON.stringify($scope.contents);//转json格式           		

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
