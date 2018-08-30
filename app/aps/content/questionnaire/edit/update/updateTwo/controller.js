(function() {
    define(['ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {

          //标题  	
           $scope.form={};
           var content={};
           
           UE.delEditor('titlename');
       	   var uetitle = UE.getEditor('titlename');
           
           //内容
           $scope.contentList=[];
  
	       //添加 填空选项 
	       $scope.addContent=function(){    	        	      
         		uetitle.setContent(uetitle.getContent().substring(3) + '<input type="text" style="border-left: 0;border-right: 0;border-top: 0;border-bottom: 1px solid #000;outline: medium;" readonly />');
	       }
           
           //查询数据
           $scope.find = function() { 	
            	$httpService.post(config.findTitleByPkURL, {"SURVEY_TITLE_ID":params.pk}).success(function(data) {
            		$scope.form = data.data;
            		uetitle.ready(function() {
            			uetitle.setContent($scope.form.SURVEY_TITLE_NAME.replace(/_____/g,'<input type="text" style="border-left: 0;border-right: 0;border-top: 0;border-bottom: 1px solid #000;outline: medium;" readonly \/>'));
                  		$scope.$apply();
                    });
	            });
            }
          
            //接收保存按钮事件 	     
            eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) { 
            	  $scope.form.SURVEY_TITLE_NAME = uetitle.getContent().replace(/<input type="text" style="border-left: 0;border-right: 0;border-top: 0;border-bottom: 1px solid #000;outline: medium;" readonly=""\/>/g,"_____");
          		  var arr = $scope.form.SURVEY_TITLE_NAME.split("_____");
        		  for (var i = 0; i < arr.length-1; i++) {
        			  $scope.contentList.push(content);
				  }
            	  $scope.form.contents = JSON.stringify($scope.contentList);
				  $httpService.post(config.updateVacancyInfoURL, $scope.form).success(function(data) {
					  if(data.code == '0000') {
						  eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
						  eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
						  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"填空题修改成功!"});
					  }else{
						  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"填空题修改失败!"});
					  }
				  }).error(function(data) {
				      eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"填空题修改出错!"});
				  });	
            });
          
        	//接收关闭按钮事件
        	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
              	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            });
            	
        	//重新查询
        	$scope.find();
        	//初始化表单校验
        	VALIDATE.iniValidate($scope);
          }
       ];
    });
}).call(this);
