(function() {
    define(['umeditorMin'], function() {
        return [
            '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$httpService.css("http://hygl.pdedu.sh.cn/CDN/js/umeditor/themes/default/css/umeditor.min.css");
            	$scope.form={};
                var pk = params.pk;
                var type = params.type;
                
                /**
            	 * 接收模态框点击上面 x 标志关闭事件
            	 */
            	eventBusService.subscribe(controllerName, 'appPart.load.modal.clickClose', function(event, data) {
            		editor.destroy();
                });
                
              //接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
            		editor.destroy();
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            	
            	//接收保存按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		var content = $("#myClassEditor").html();
            		$scope.form.FK_SC_COURSE = pk;
            		$scope.form.SYNOPSIS = content;
            		if(type ==1){
            			$httpService.post(config.ScCourseSynopsisUpdateURL,$scope.form).success(function(data) {
	                    	if(data.code=='0000'){
	                    		editor.destroy();
	                    		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"courseDetail","type":"1","content":content});//刷新数据
	                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	                    	}else{
	                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":data.msg});	//弹出提示框
	                    	}		 
		                 }).error(function(data) {
		                	 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改说课内容失败"});	//弹出提示框
		                 });
            		}else{
	            		$httpService.post(config.ScCourseSynopsisInsertURL,$scope.form).success(function(data) {
	                    	if(data.code=='0000'){
	                    		editor.destroy();
	                    		eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"courseDetail","type":"1","content":content});//刷新数据
	                    		eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	                    	}else{
	                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":data.msg});	//弹出提示框
	                    	}		 
		                 }).error(function(data) {
		                	 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增说课内容失败"});	//弹出提示框
		                 });
            	     }
	            });
            	
            	var editor;
            	var init = function(){
            		editor = UM.getEditor('myClassEditor',{
            			initialFrameWidth: 800
            		});  
                    //$(".edui-body-container").css("width", "90%");
            		$httpService.post(config.loadObjURL,{"FK_SC_COURSE":pk}).success(function(data) {
                    	if(data.code == '0000'){
                    		var Obj = data.data;
                    		if(Obj!=undefined && Obj.SYNOPSIS!=undefined && Obj.SYNOPSIS !=""){
                    			editor.setContent(Obj.SYNOPSIS);
                    		}
                    	}else{
                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":data.msg});	//弹出提示框
                    	}		 
	                 }).error(function(data) {
	                 });
            		
            	}
            	init();
            	
            }
        ];
    });
}).call(this);
