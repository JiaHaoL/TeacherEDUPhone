(function() {
    define(['uploadauto','ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
             	//PC图片上传初始化样式	
            	$httpService.css("assets/js/jquery.uploadify-v2.1.0/uploadify.css");
            	var uploadImgType = "*.jpg,*.png";                                  //限制图片上传的类型
            	var uploadVideoType = "*.mp4";  //限制视频上传类型
             	var uploadapp = "wjdc";                                              //名称
            	var UserID = "";                                                     //
            	var url = config.uploadurl;                                          //存入的图片路径
               
            	//初始化
            	$scope.form = {};  
            	$scope.SURVEY_TITLE_TXT = params.titleName;
            	var flag = 0;
            	
            	UE.delEditor('titlename');
            	var uetitle = UE.getEditor('titlename');
            	
            	$httpService.post(config.findOptionsByTitleIdURL, {
            		"SURVEY_TITLE_ID" : params.pk
            	}).success(function(data) {
            		if(data.code == '0000') {
            			$scope.options = data.data;
            			$scope.$apply();
            		}
            	});
            	
            	$httpService.post(config.findAllUnitURL, {}).success(function(data) {
        			$scope.units = data.data;
        			$scope.$apply();
            	});
            	
             	//PC图片上传中的判断（回调函数）
             	var callonComplete = function(event, queueID, fileObj, response, dataObj){
              	    //转换为json对象
                   var data = eval("("+response+")");
                   var id = event.target.id;
                   
                   if(data.code=="0000") {
                	   if(id == 'upload1') {
                		   $scope.form.EXPAND_VIDEO_IMG = data.data.RES_FILE_LINK_PK;
                		   $scope.form.VIDEO_IMG_FILE_NAME = data.data.ORI_FILENAME + '.' +data.data.EXTNAME;
                	   }

                	   if(id == 'upload2') {
                		   $scope.form.EXPAND_IMG = data.data.RES_FILE_LINK_PK;
                		   $scope.form.IMG_FILE_NAME = data.data.ORI_FILENAME + '.' +data.data.EXTNAME;
                	   }
                       $scope.$apply();
  	          	    }else if(data.code=="4444"){
  	          	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不支持此文件类型的上传，只支持"+uploadImgType+"类型文件上传"});	//弹出提示框
  	          	    }else{
  	          	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"上传图片处理失败！"});	//弹出提示框
  	          	    }
               };
               
               //视频上传（回调函数）
               var callBackComplete = function(event, queueID, fileObj, response, dataObj){
             	    //转换为json对象
                  var data = eval("("+response+")");

                  if(data.code=="0000"){
                       $scope.form.EXPAND_VIDEO = data.data.RES_FILE_LINK_PK;
                       $scope.form.VIDEO_FILE_NAME = data.data.ORI_FILENAME + '.' +data.data.EXTNAME;
                       $scope.$apply();
 	          	    }else if(data.code=="4444"){
 	          	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不支持此文件类型的上传，只支持"+uploadVideoType+"类型文件上传"});	//弹出提示框
 	          	    }else{
 	          	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"上传视频处理失败！"});	//弹出提示框
 	          	    }
               };
               
               $scope.selectChange = function() {
            	   if($scope.form.FK_SURVEY_CONTENT == null || $scope.form.FK_SURVEY_CONTENT == "") {
            		   uetitle.setContent("");
            		   $scope.form = {};
            	   }else{
	            	   $httpService.post(config.findURL, {
	            		   "FK_SURVEY_CONTENT":$scope.form.FK_SURVEY_CONTENT
	            	   }).success(function(data) {
	            		   console.log(data);
	            		   if(data.code == "0000") {
	            			   if(data.data != "") {
		            			   $scope.form = data.data;
		            			   if($scope.form.EXPAND_SUMMARY != null) {
		            				   uetitle.setContent($scope.form.EXPAND_SUMMARY);
		            			   }else{
		            				   uetitle.setContent("");
		            			   }
	            			   }
	            			   $scope.$apply();
	            		   }
	            	   });
            	   }
               }
               
               //接收保存按钮事件
               eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            	   	//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}  

            		if($scope.form.FK_SURVEY_CONTENT == null || $scope.form.FK_SURVEY_CONTENT == "") {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择参选人员!"});	//弹出提示框
            			return;
            		}
            		
            		if($scope.form.FK_UNIT == "" || $scope.form.FK_UNIT == null) {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择工作单位!"});	//弹出提示框
            			return;
            		}
            		
            		if($scope.form.EXPAND_VIDEO_IMG == "" || $scope.form.EXPAND_VIDEO_IMG == null) {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择视频照片!"});	//弹出提示框
            			return;
            		}
            		
            		if($scope.form.EXPAND_VIDEO == "" || $scope.form.EXPAND_VIDEO == null) {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择参选视频!"});	//弹出提示框
            			return;
            		}
            		
            		$scope.form.EXPAND_SUMMARY=uetitle.getContent();   //获取富文本框里面的值
            		
            		$httpService.post(config.findURL, {
            			"FK_SURVEY_CONTENT":$scope.form.FK_SURVEY_CONTENT
            		}).success(function(data) {
            			if(data.data == null) {
            				if(confirm("确定要保存参选人员信息!")) {
	    	            		$httpService.post(config.addURL, $scope.form).success(function(data) {
	    	            			if(data.code=="0000") {
	    		            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"title"});	//刷新范围的数据
	    		                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存成功!"});	//弹出提示框
	    	            			}else{
	    	            				eventBusService.publish(controllerName,'appPart.data.reload', {"title":"操作提示","content":"保存失败!"});
	    	            			}
	    	    	            }).error(function(data) {
	    	    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存出错!"});	//弹出提示框
	    	                    });
            				}
            			}else{
            				$scope.form.EXPAND_INFO_PK = data.data.EXPAND_INFO_PK;
                   			if(confirm("参选人员信息已存在,确定要更新!")) {
        	            		$httpService.post(config.updateURL, $scope.form).success(function(data) {
        	            			if(data.code=="0000") {
        		            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"title"});	//刷新范围的数据
        		                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"更新成功!"});	//弹出提示框
        	            			}else{
        	            				eventBusService.publish(controllerName,'appPart.data.reload', {"title":"操作提示","content":"更新失败!"});
        	            			}
        	    	            }).error(function(data) {
        	    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"更新出错!"});	//弹出提示框
        	                    });
                			}
            			}
            		});
	            });
                    		  
      		  	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            	
            	//图片初始化
                 var init = function() {
            		 UPLOADAUTO.iniUploadauto($('#upload1'),uploadImgType,uploadapp,0,UserID,url,callonComplete,0);
            		 UPLOADAUTO.iniUploadauto($('#upload2'),uploadImgType,uploadapp,0,UserID,url,callonComplete,2);
            		 UPLOADAUTO.iniUploadauto($('#upload3'),uploadVideoType,uploadapp,0,UserID,url,callBackComplete,1);
                 }
                 init();

            	
            	//初始化表单校验
            	VALIDATE.iniValidate($scope);
            	
            }
        ];
    });
}).call(this);
