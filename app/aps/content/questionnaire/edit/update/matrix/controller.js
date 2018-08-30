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
	           $scope.contentList=[];//选项
	           var content={};     
	           $scope.contentList.push(content);
	           
               //插入行标题
               $scope.addLineHeading = function() {
            	   $scope.form.LINE_HEADING += "行标题\n";
               }
	           
	           //添加      
		       $scope.addContent=function(){    	        	
	        	   var content={};       	
	        	   content.IS_DELETE = 0;
	        	   $scope.contentList.push(content); 
		       }

	           //删除选项
	           $scope.removeContent = function(obj) { 
	         	  if($scope.contentList.length == 1) {
	          		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"选项不可以被删除。"});	//弹出提示框
	        	  }else{
		        	  obj.IS_DELETE = 1;
	        	  }
	          }
	           
	          //查询数据
	          $scope.find = function() { 	
	        	   $httpService.post(config.findTitleByPkURL, {
	        		   "SURVEY_TITLE_ID":params.pk
	        	   }).success(function(data) {
	              		$scope.form = data.data;
	              		uetitle.ready(function(){
	                      	uetitle.execCommand('insertHtml',$scope.form.SURVEY_TITLE_NAME);	 
	                     	$('.txtFiled textarea').val(uetitle.getPlainTxt());
	                		$scope.$apply();
	              		});
	               });
	        	   
	        	   //题目行标题
	        	   $httpService.post(config.findHeadingByTitleIdURL,{
	        		   "SURVEY_TITLE_ID":params.pk
	        	   }).success(function(data) {
	        		    $scope.headingList = data.data;
	        		    var str = "";
	        		    for (var i = 0; i < data.data.length; i++) {
	        		    	str = str + data.data[i].LINE_HEADING + "\n";
						}
	        		    $scope.form.LINE_HEADING = str;
	        			$scope.$apply();
	        	   });
	        	   
	        	   //题目选项
	               $httpService.post(config.findOptionListByPkURL, {
	            	   "SURVEY_TITLE_ID":params.pk
	               }).success(function(data) {
	            		$scope.contentList = data.data;
	            		for (var i = 0; i < $scope.contentList.length; i++) {
	            			$scope.contentList[i].IS_DELETE = 0;
						}
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
          		  
          	      if($scope.form.LINE_HEADING == null || $scope.form.LINE_HEADING == "") {
            		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"行标题不能为空。"});
        	    	  return;
        	      }
          	      
        		  $scope.form.SURVEY_TITLE_ID=params.pk;
          		  $scope.form.SURVEY_TYPE_ID=params.typeid;

          		  $scope.form.SURVEY_TITLE_NAME=uetitle.getContent();   //获取富文本框里面的值
          		  $scope.form.SURVEY_TITLE_TXT=uetitle.getPlainTxt();
          		  $scope.form.contents=JSON.stringify($scope.contentList);//选项转json格式           		

          		  $httpService.post(config.updateURL, $scope.form).success(function(data) {
          			  if(data.code=="0000") {
          				  eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
          				  eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"title"});	//刷新范围的数据
          				  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"矩阵题修改成功!"});	//弹出提示框
          			  }else{
          				  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"矩阵题修改失败!"});
          			  }
  	              }).error(function(data) {
  	            	  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"矩阵题修改出错!"});	//弹出提示框
                  });
	         });
          
	         //接收关闭按钮事件
	      	 eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
	      		 eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	      	 });
          
			 //上移
			 $scope.updata=function(obj){	
				  if(obj>0){
					  var temp=$scope.contentList[obj-1];
					  $scope.contentList[obj-1]=$scope.contentList[obj];
					  $scope.contentList[obj]=temp;  
				  }
			  }
          
			  //下移
			  $scope.downdata=function(obj){
					  var temp=$scope.contentList[obj+1];
					  $scope.contentList[obj+1]=$scope.contentList[obj];
					  $scope.contentList[obj]=temp;			 
			  }
        		
	    	  //重新查询
	    	  $scope.find();
	    	  
	    	  //初始化表单校验
	    	  VALIDATE.iniValidate($scope);	
           }
       ];
    });
}).call(this);
