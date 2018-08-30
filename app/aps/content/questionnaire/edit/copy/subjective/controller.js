(function() {
    define(['ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	
          //标题  	
           $scope.form={};
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
           
           //内容
           $scope.contentList=[];
     	       
           //查询数据
           $scope.find = function() { 	
            	$httpService.post(config.findTitleByPkURL, {"SURVEY_TITLE_ID":params.pk}).success(function(data) {
            		$scope.form = data.data;
            		uetitle.ready(function(){
                     	 uetitle.setContent($scope.form.SURVEY_TITLE_NAME); 
                     	 $('.txtFiled textarea').val(uetitle.getPlainTxt());
                		 $scope.$apply();
             		});
	            });
            	
            	$httpService.post(config.findOptionListByPkURL, {"SURVEY_TITLE_ID":params.pk}).success(function(data) {
            		$scope.contentList = data.data;	
        			$scope.$apply();
	            });
            }
          
       //接收保存按钮事件 	     
          eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {       	 
	       	   //校验表单
	       	   if(!$scope.validateForm()){
	       		   return;
	           }   
       		   if(!editorIsDel) {
    			   uetitle.setContent($('.txtFiled textarea').val().replace(/\n/g,"<br/>"),false);
    		   }
       		   
     		   $scope.form.SURVEY_TITLE_NAME=uetitle.getContent();   //获取富文本框里面的值
     		   $scope.form.SURVEY_TITLE_TXT = uetitle.getPlainTxt();
     		   $scope.form.contents=JSON.stringify($scope.contentList);//转json格式     	

     		   $httpService.post(config.addURL, $scope.form).success(function(data) {
     			  if(data.code=="0000"){
           				eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
           				eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});	//刷新范围的数据
           				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"复制成功!"});	//弹出提示框
     			  }else{
     				 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"复制失败!"});
     			  }
     		   }).error(function(data) {
	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"复制出错!"});	//弹出提示框
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
