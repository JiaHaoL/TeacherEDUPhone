(function() {
    define(['uploadauto','ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
	    	   //PC图片上传初始化
	    	   $httpService.css("assets/js/jquery.uploadify-v2.1.0/uploadify.css"); //样式
	    	   var uploadfiletype = "*.jpg,*.png";                                  //限制图片上传的类型
	    	   var uploadapp = "wjdc";                                              //
	    	   var UserID = "";                                                     //
	    	   var url = config.uploadurl;     
	    	  
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
	           var content={};     
	           $scope.contentList.push(content);
	           
	           if(params.typeid == '6') {
	        	   $('.vote').show();
	           }else{
	        	   $('.vote').hide();
	           }
	           
	           //回调函数（判断图片上传）  
	           var callonComplete = function(event, queueID, fileObj, response, dataObj){
	           	    //转换为json对象
	                var data = eval("("+response+")");
	                var index = $('#uploadIndex').val();
	                if(data.code=="0000"){
	                     $scope.contentList[index].SURVEY_CONTENT_IMG = data.data.RES_FILE_LINK_PK;
	                     $scope.contentList[index].IMAGE_WIDTH = '40';
	                     $scope.contentList[index].IMAGE_HEIGHT = '40';
	                     $scope.$apply();
	         	    }else if(data.code=="4444"){
	         	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不支持此文件类型的上传，只支持"+uploadfiletype+"类型文件上传"});	//弹出提示框
	         	    }else{
	         	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"上传文件处理失败！"});	//弹出提示框
	         	    }
	           };
	           
	           //添加      
		       $scope.addContent=function(){    	        	
	        	   var content={};       	
	        	   content.IS_DELETE=0;
	        	   $scope.contentList.push(content); 
	
	              	if(params.typeid == '1' || params.typeid == '5' || params.typeid == '4') {
	               		$('input[name="choice"]').prop("checked",false); 
	               		for (var i = 0; i < $scope.contentList.length; i++) {
	               			$scope.contentList[i].IS_CHECKED = false;
						}
	               	}
		       }
		       
	           //单选题默认值只能选中一个
	           $scope.optionIsDefault = function(idx) {
		           	if(params.typeid == '1' || params.typeid == '5' || params.typeid == '4') { 
		           		 $('input[name="choice"]').not(this).attr("checked", false);
		           		 //设置复选框只能选中一个值
		           		 $('input[name="choice"]').bind('click', function(){
		           		      $('input[name="choice"]').not(this).attr("checked", false);
		           		 });
		           	}
               		for(var i = 0; i < $scope.contentList.length; i++) {
              			 if(idx == i) {
              				$scope.contentList[i].IS_CHECKED = true;
              			 }else{
	               			$scope.contentList[i].IS_CHECKED = false;
              			 }
					}
	           }
	
	           //删除选项
	           $scope.removeContent=function(obj) { 
	         	  if($scope.contentList.length == 1) {
	          		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"选项不可以被删除"});	//弹出提示框
	        	  }else{
	        		  $scope.contentList.remove(obj);
	        	  }
	          }
	           
	          //查询数据
	          $scope.find = function() { 	
	        	   $httpService.post(config.findTitleByPkURL, {"SURVEY_TITLE_ID":params.pk}).success(function(data) {
	              		$scope.form = data.data;
	              		uetitle.ready(function(){
	                      	uetitle.execCommand('insertHtml',$scope.form.SURVEY_TITLE_NAME);	 
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
				  if(obj<$scope.contentList.length-1){
					  var temp=$scope.contentList[obj+1];
					  $scope.contentList[obj+1]=$scope.contentList[obj];
					  $scope.contentList[obj]=temp;		
				  }
			  }
        		
	    	  //重新查询
	    	  $scope.find();
	    	  
	    	  //初始化表单校验
	    	  VALIDATE.iniValidate($scope);
	     	  //PC图片上传初始化时
        	
          	  //图片初始化
        	  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {   
        	 	  for(var i = 0; i < $scope.contentList.length; i++) {	
        			  if($scope.contentList[i].hasFileBtn){
        				
        			  }else{
        				 $scope.contentList[i].hasFileBtn = true;		
        				 UPLOADAUTO.iniUploadauto($('#uploadify'+i),uploadfiletype,uploadapp,0,UserID,url,callonComplete,i);      
        			  }
			 	  }          		
        	  }); 	
           }
       ];
    });
}).call(this);
