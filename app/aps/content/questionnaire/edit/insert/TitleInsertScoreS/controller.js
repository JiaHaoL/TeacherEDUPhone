(function() {
    define(['uploadauto','ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	//PC图片上传初始化样式	
            	$httpService.css("assets/js/jquery.uploadify-v2.1.0/uploadify.css");
            	var uploadfiletype = "*.jpg,*.png";                                  //限制图片上传的类型
            	var uploadapp = "wjdc";                                              //名称
            	var UserID = "";                                                     //
            	var url = config.uploadurl;                                          //存入的图片路径
            	
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
             		
            	//+添加
             	$scope.addContent = function(){
	               	var content = {};
	               	$scope.contents.push(content); 
	               	
	               	if(params.id == '7') {
	               		$('input[name="choice"]').prop("checked",false); 
	               		for (var i = 0; i < $scope.contents.length; i++) {
	               			$scope.contents[i].SURVEY_CONTENT_DEF = false;
						}
	               	}
               }
             	
               //-删除	
               $scope.removeContent = function(obj){
             	  if($scope.contents.length == 1) {
              		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"选项不可以被删除"});	//弹出提示框
            	  }else{
            		  $scope.contents.remove(obj);
            	  }
               }
               
               //单选题默认值只能选中一个
               $scope.optionIsDefault = function(idx) {
	               	if(params.id == '7') { 
	               		 //设置复选框只能选中一个值
	               		 $('input[name="choice"]').bind('click', function(){
	               		      $('input[name="choice"]').not(this).attr("checked", false);
	               		 });
	                	 for(var i = 0; i < $scope.contents.length; i++) {
                  			 if(idx == i) {
                  				 $scope.contents[i].SURVEY_CONTENT_DEF = true;
                  			 }else{
                  				 $scope.contents[i].SURVEY_CONTENT_DEF = false;
                  			 }
	   					 }
	               	}	
               }
            	 
               //PC图片上传中的判断（回调函数）
               var callonComplete = function(event, queueID, fileObj, response, dataObj){
              	    //转换为json对象
                   var data = eval("("+response+")");
                   var index = $('#uploadIndex').val();
                   if(data.code=="0000"){
                        $scope.contents[index].SURVEY_CONTENT_IMG = data.data.RES_FILE_LINK_PK;
                        $scope.contents[index].IMAGE_WIDTH = '40';
                        $scope.contents[index].IMAGE_HEIGHT = '40';
                        $scope.$apply();
  	          	    }else if(data.code=="4444"){
  	          	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不支持此文件类型的上传，只支持"+uploadfiletype+"类型文件上传"});	//弹出提示框
  	          	    }else{
  	          	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"上传文件处理失败！"});	//弹出提示框
  	          	    }
               };
               
              //接收保存按钮事件
              eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}   
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
              
	            //上移
	      	    $scope.updata=function(obj){	
	      			  if(obj>0){
	      				  var temp=$scope.contents[obj-1];
	      				  $scope.contents[obj-1]=$scope.contents[obj];
	      				  $scope.contents[obj]=temp;  
	      			  }
	      		} 
	      	    
	      	    //下移
	    	    $scope.downdata=function(obj){	
		    		  if(obj<$scope.contents.length-1){
		    			  var temp=$scope.contents[obj+1];
		    			  $scope.contents[obj+1]=$scope.contents[obj];
		    			  $scope.contents[obj]=temp; 
		    		  }
	    		}
	    	    
            	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            	
            	//初始化表单校验
            	VALIDATE.iniValidate($scope);
            	
            	//图片初始化每次初始化或添加或删除时都调用
            	$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {       		
            		for (var i = 0; i < $scope.contents.length; i++) {
            			if($scope.contents[i].hasFileBtn){
            				
            			}else{
            				$scope.contents[i].hasFileBtn = true;
            				UPLOADAUTO.iniUploadauto($('#uploadify'+i),uploadfiletype,uploadapp,0,UserID,url,callonComplete,i);          				
            			}
					}         		
            	});
            }
        ];
    });
}).call(this);
